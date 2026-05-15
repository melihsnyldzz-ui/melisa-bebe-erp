const fs = require("node:fs");
const path = require("node:path");
const sql = require("mssql");

const ENV_FILE = ".env.local";
const REQUIRED_ENV_KEYS = ["VEGA_SQL_SERVER", "VEGA_SQL_DATABASE", "VEGA_SQL_USER", "VEGA_SQL_PASSWORD"];
const FORBIDDEN_SQL_WORDS = ["INSERT", "UPDATE", "DELETE", "MERGE", "DROP", "ALTER", "CREATE", "TRUNCATE", "EXEC", "GRANT", "DENY", "REVOKE"];
const MAX_LIMIT = 20;
const DEFAULT_TIMEOUT_MS = 3000;
const STOCK_CARD_TABLE = "dbo.F0102TBLSTOKLAR";
const STOCK_MOVEMENT_TABLE = "dbo.F0102D0001TBLSTOKHAREKETLERI";
const STOCK_CARD_COLUMNS = ["IND", "STOKKODU", "MALINCINSI"];
const STOCK_MOVEMENT_COLUMNS = ["STOKNO", "ACIKLAMA", "DEPO", "GIREN", "CIKAN", "KALAN", "TARIH"];
const SEARCH_TYPES = new Set(["stockCode", "productName", "stockNo"]);

function buildStockCardMetadata() {
  return {
    mode: "stock-card-search-read-only",
    tableScope: STOCK_CARD_TABLE,
    maxRowsLimit: MAX_LIMIT,
    writeEnabled: false,
    importEnabled: false,
    syncEnabled: false,
    fileOutputEnabled: false,
    rendererReceivesCredentials: false,
    rawErrorExposeEnabled: false,
    retryEnabled: false,
  };
}

function buildStockMovementMetadata() {
  return {
    mode: "stock-movement-by-stock-no-read-only",
    tableScope: STOCK_MOVEMENT_TABLE,
    maxRowsLimit: MAX_LIMIT,
    writeEnabled: false,
    importEnabled: false,
    syncEnabled: false,
    fileOutputEnabled: false,
    rendererReceivesCredentials: false,
    rawErrorExposeEnabled: false,
    retryEnabled: false,
  };
}

const safeStockCardFailure = (errorClass, message) => ({
  status: "error",
  errorClass,
  message,
  items: [],
  columns: STOCK_CARD_COLUMNS,
  rowCount: 0,
  metadata: buildStockCardMetadata(),
});

const safeStockMovementFailure = (errorClass, message) => ({
  status: "error",
  errorClass,
  message,
  items: [],
  columns: STOCK_MOVEMENT_COLUMNS,
  rowCount: 0,
  metadata: buildStockMovementMetadata(),
});

function parseEnvFile(filePath) {
  const env = {};
  const content = fs.readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    env[key] = rawValue.replace(/^["']|["']$/g, "");
  }

  return env;
}

function parseBoolean(value, fallback) {
  if (value === undefined || value === "") return fallback;
  return String(value).toLowerCase() === "true";
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function collectSafeErrorSignals(error) {
  return [
    error?.code,
    error?.name,
    error?.number,
    error?.state,
    error?.class,
    error?.message,
    error?.originalError?.code,
    error?.originalError?.name,
    error?.originalError?.number,
    error?.originalError?.message,
    error?.precedingErrors?.map((item) => [item?.code, item?.number, item?.message].filter(Boolean).join(" ")).join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function classifySqlError(error) {
  const signals = collectSafeErrorSignals(error);

  if (/\betimeout\b|timeout|time-out|timed out|zaman asimi/i.test(signals)) return "SQL_TIMEOUT";
  if (/\be_login\b|login failed|authentication|auth failed|password|18456|giris basarisiz|oturum acma/i.test(signals)) return "SQL_AUTH_FAILED";
  if (/\besocket\b|\beconnrefused\b|\beconnreset\b|\benotfound\b|\beai_again\b|network|server.*not found|instance|port|connect|baglanti kurulamadi|sunucu/i.test(signals)) return "SQL_NETWORK_FAILED";
  if (/permission|denied|not authorized|authorization|229|230|yetki|izin/i.test(signals)) return "SQL_PERMISSION_DENIED";
  if (/invalid object|invalid column|object name|column name|could not find|208|207|tablo|kolon|column|object/i.test(signals)) return "SQL_TABLE_OR_COLUMN_MISMATCH";

  return "SQL_UNKNOWN_SAFE";
}

function validateEnvironment(metadataBuilder, failureBuilder) {
  const envPath = path.resolve(process.cwd(), ENV_FILE);

  if (!fs.existsSync(envPath)) {
    return { error: failureBuilder("ENV_MISSING", ".env.local yok. Fail-closed: Vega read-only arama denenmedi.") };
  }

  const env = parseEnvFile(envPath);
  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !env[key]);
  if (missingKeys.length) {
    return { error: failureBuilder("ENV_MISSING", `Eksik env degiskenleri: ${missingKeys.join(", ")}. Fail-closed: Vega read-only arama denenmedi.`) };
  }

  if (String(env.VEGA_SQL_USER).toLowerCase() === "sa") {
    return { error: failureBuilder("SQL_AUTH_FAILED", "sa kullanicisi yasaktir. Fail-closed: Vega read-only arama denenmedi.") };
  }

  const limit = parsePositiveInteger(env.VEGA_READONLY_LIMIT, MAX_LIMIT);
  if (limit !== MAX_LIMIT || limit > MAX_LIMIT) {
    return { error: failureBuilder("ENV_MISSING", "VEGA_READONLY_LIMIT tam olarak 20 olmalidir. Fail-closed: Vega read-only arama denenmedi.") };
  }

  const timeoutMs = parsePositiveInteger(env.VEGA_SQL_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  if (timeoutMs > DEFAULT_TIMEOUT_MS) {
    return { error: failureBuilder("SQL_TIMEOUT", "VEGA_SQL_TIMEOUT_MS 3000 ms degerini asamaz. Fail-closed: Vega read-only arama denenmedi.") };
  }

  return { env, limit, timeoutMs, metadata: metadataBuilder() };
}

function createPool(env, timeoutMs) {
  return new sql.ConnectionPool({
    server: env.VEGA_SQL_SERVER,
    database: env.VEGA_SQL_DATABASE,
    user: env.VEGA_SQL_USER,
    password: env.VEGA_SQL_PASSWORD,
    options: {
      encrypt: parseBoolean(env.VEGA_SQL_ENCRYPT, false),
      trustServerCertificate: parseBoolean(env.VEGA_SQL_TRUST_SERVER_CERTIFICATE, true),
      enableArithAbort: true,
    },
    requestTimeout: timeoutMs,
    connectionTimeout: timeoutMs,
    pool: {
      max: 1,
      min: 0,
      idleTimeoutMillis: timeoutMs,
    },
  });
}

function assertNoForbiddenSql(queryText) {
  for (const word of FORBIDDEN_SQL_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, "i");
    if (pattern.test(queryText)) throw new Error("FORBIDDEN_SQL_WORD");
  }
}

function assertSafeStockCardSearchQuery(queryText, limit, type) {
  if (limit !== MAX_LIMIT) throw new Error("LIMIT_NOT_EXACTLY_20");
  if (!SEARCH_TYPES.has(type)) throw new Error("INVALID_SEARCH_TYPE");

  assertNoForbiddenSql(queryText);

  if (!/\bFROM\s+dbo\.F0102TBLSTOKLAR\s+s\b/i.test(queryText)) throw new Error("UNEXPECTED_STOCK_CARD_SCOPE");
  if (/\bJOIN\b/i.test(queryText)) throw new Error("UNEXPECTED_JOIN_SCOPE");
  if (type === "stockCode" && !/\bWHERE\s+s\.STOKKODU\s+LIKE\s+@query\b/i.test(queryText)) throw new Error("PARAMETER_REQUIRED");
  if (type === "productName" && !/\bWHERE\s+s\.MALINCINSI\s+LIKE\s+@query\b/i.test(queryText)) throw new Error("PARAMETER_REQUIRED");
  if (type === "stockNo" && !/\bWHERE\s+s\.IND\s*=\s*@stockNo\b/i.test(queryText)) throw new Error("PARAMETER_REQUIRED");
}

function assertSafeStockMovementQuery(queryText, limit) {
  if (limit !== MAX_LIMIT) throw new Error("LIMIT_NOT_EXACTLY_20");
  assertNoForbiddenSql(queryText);
  if (!/\bFROM\s+dbo\.F0102D0001TBLSTOKHAREKETLERI\b/i.test(queryText)) throw new Error("UNEXPECTED_STOCK_MOVEMENT_SCOPE");
  if (!/\bWHERE\s+STOKNO\s*=\s*@stockNo\b/i.test(queryText)) throw new Error("PARAMETER_REQUIRED");
  if (!/\bORDER\s+BY\s+TARIH\s+DESC\b/i.test(queryText)) throw new Error("ORDER_BY_REQUIRED");
}

function normalizeSearchPayload(payload) {
  const type = String(payload?.type ?? "").trim();
  const query = String(payload?.query ?? "").trim();
  return { type, query };
}

function mapStockCardRow(row) {
  return {
    IND: row.IND,
    STOKNO: row.IND,
    STOKKODU: row.STOKKODU,
    MALINCINSI: row.MALINCINSI,
  };
}

function mapStockMovementRow(row) {
  return {
    STOKNO: row.STOKNO,
    ACIKLAMA: row.ACIKLAMA,
    DEPO: row.DEPO,
    GIREN: row.GIREN,
    CIKAN: row.CIKAN,
    KALAN: row.KALAN,
    TARIH: row.TARIH,
  };
}

async function searchVegaStockCardsReadOnly(payload) {
  const { type, query } = normalizeSearchPayload(payload);

  if (!SEARCH_TYPES.has(type)) {
    return safeStockCardFailure("INVALID_SEARCH_TYPE", "Gecersiz arama tipi. Fail-closed: Vega stok karti aramasi denenmedi.");
  }

  if (!query || query.length < 2) {
    return safeStockCardFailure("QUERY_TOO_SHORT", "Arama en az 2 karakter olmalidir. Fail-closed: sorgu denenmedi.");
  }

  if (query.length > 50) {
    return safeStockCardFailure("QUERY_TOO_LONG", "Arama en fazla 50 karakter olmalidir. Fail-closed: sorgu denenmedi.");
  }

  if (type === "stockNo" && !/^\d+$/.test(query)) {
    return safeStockCardFailure("QUERY_INVALID", "Stok no sadece rakamlardan olusmalidir. Fail-closed: sorgu denenmedi.");
  }

  const validated = validateEnvironment(buildStockCardMetadata, safeStockCardFailure);
  if (validated.error) return validated.error;

  const { env, limit, timeoutMs } = validated;
  const queryTextByType = {
    stockCode: `
SELECT TOP (${limit})
  s.IND,
  s.STOKKODU,
  s.MALINCINSI
FROM ${STOCK_CARD_TABLE} s
WHERE s.STOKKODU LIKE @query
ORDER BY s.STOKKODU
`,
    productName: `
SELECT TOP (${limit})
  s.IND,
  s.STOKKODU,
  s.MALINCINSI
FROM ${STOCK_CARD_TABLE} s
WHERE s.MALINCINSI LIKE @query
ORDER BY s.STOKKODU
`,
    stockNo: `
SELECT TOP (${limit})
  s.IND,
  s.STOKKODU,
  s.MALINCINSI
FROM ${STOCK_CARD_TABLE} s
WHERE s.IND = @stockNo
ORDER BY s.IND
`,
  };

  const queryText = queryTextByType[type];

  try {
    assertSafeStockCardSearchQuery(queryText, limit, type);
  } catch {
    return safeStockCardFailure("SQL_UNKNOWN_SAFE", "Stok karti arama guvenlik kontrolu basarisiz. Fail-closed: sorgu denenmedi.");
  }

  const pool = createPool(env, timeoutMs);

  try {
    await pool.connect();
    const request = pool.request();

    if (type === "stockNo") {
      request.input("stockNo", sql.Int, Number(query));
    } else {
      request.input("query", sql.NVarChar(50), `%${query}%`);
    }

    const result = await request.query(queryText);
    const items = result.recordset.slice(0, MAX_LIMIT).map(mapStockCardRow);

    return {
      status: "success",
      message: items.length ? "Stok karti read-only olarak bulundu. Veri yazilmadi." : "Bu arama icin stok karti bulunamadi.",
      items,
      columns: STOCK_CARD_COLUMNS,
      rowCount: items.length,
      metadata: buildStockCardMetadata(),
    };
  } catch (error) {
    return safeStockCardFailure(classifySqlError(error), "Vega stok karti aramasi basarisiz oldu. Ham hata gizlendi.");
  } finally {
    await pool.close().catch(() => undefined);
  }
}

async function listVegaStockMovementsByStockNoReadOnly(rawStockNo) {
  const stockNo = String(rawStockNo ?? "").trim();

  if (!stockNo || !/^\d+$/.test(stockNo)) {
    return safeStockMovementFailure("QUERY_INVALID", "Stok no sadece rakamlardan olusmalidir. Fail-closed: stok hareket sorgusu denenmedi.");
  }

  const validated = validateEnvironment(buildStockMovementMetadata, safeStockMovementFailure);
  if (validated.error) return validated.error;

  const { env, limit, timeoutMs } = validated;
  const queryText = `
SELECT TOP (${limit})
  STOKNO,
  ACIKLAMA,
  DEPO,
  GIREN,
  CIKAN,
  KALAN,
  TARIH
FROM ${STOCK_MOVEMENT_TABLE}
WHERE STOKNO = @stockNo
ORDER BY TARIH DESC
`;

  try {
    assertSafeStockMovementQuery(queryText, limit);
  } catch {
    return safeStockMovementFailure("SQL_UNKNOWN_SAFE", "Stok hareket guvenlik kontrolu basarisiz. Fail-closed: sorgu denenmedi.");
  }

  const pool = createPool(env, timeoutMs);

  try {
    await pool.connect();
    const result = await pool.request().input("stockNo", sql.Int, Number(stockNo)).query(queryText);
    const items = result.recordset.slice(0, MAX_LIMIT).map(mapStockMovementRow);

    return {
      status: "success",
      message: items.length ? "Stok hareketleri read-only olarak bulundu. Veri yazilmadi." : "Bu stok no icin hareket bulunamadi.",
      items,
      columns: STOCK_MOVEMENT_COLUMNS,
      rowCount: items.length,
      metadata: buildStockMovementMetadata(),
    };
  } catch (error) {
    return safeStockMovementFailure(classifySqlError(error), "Vega stok hareket aramasi basarisiz oldu. Ham hata gizlendi.");
  } finally {
    await pool.close().catch(() => undefined);
  }
}

module.exports = {
  listVegaStockMovementsByStockNoReadOnly,
  searchVegaStockCardsReadOnly,
};
