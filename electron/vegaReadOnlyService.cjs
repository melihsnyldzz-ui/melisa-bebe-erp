const fs = require("node:fs");
const path = require("node:path");
const sql = require("mssql");

const ENV_FILE = ".env.local";
const REQUIRED_ENV_KEYS = ["VEGA_SQL_SERVER", "VEGA_SQL_DATABASE", "VEGA_SQL_USER", "VEGA_SQL_PASSWORD"];
const FORBIDDEN_SQL_WORDS = ["INSERT", "UPDATE", "DELETE", "MERGE", "DROP", "ALTER", "CREATE", "TRUNCATE", "EXEC", "GRANT", "DENY", "REVOKE"];
const MAX_LIMIT = 20;
const DEFAULT_TIMEOUT_MS = 3000;
const STOCK_TABLE = "dbo.F0102D0001TBLSTOKHAREKETLERI";
const BARCODE_TABLE = "dbo.F0102TBLBIRIMLEREX";
const STOCK_CARD_TABLE = "dbo.F0102TBLSTOKLAR";
const STOCK_COLUMNS = [
  "STOKNO",
  "ACIKLAMA",
  "DEPO",
  "GIREN",
  "CIKAN",
  "KALAN",
  "TARIH",
];
const BARCODE_PRODUCT_COLUMNS = ["BARCODE", "STOKNO", "ACIKLAMA", "STOKKODU", "MALINCINSI"];
const METADATA_HINTS = ["STOK", "HAREKET", "HRK", "CIKIS", "ÇIKIŞ", "MIKTAR", "MİKTAR", "TARIH", "TARİH", "KOD"];
const METADATA_MAX_ROWS = 200;

const safeFailure = (errorClass, message) => ({
  status: "error",
  errorClass,
  message,
  items: [],
  columns: STOCK_COLUMNS,
  rowCount: 0,
  metadata: buildMetadata(),
});

const safeMetadataFailure = (errorClass, message) => ({
  status: "error",
  errorClass,
  message,
  items: [],
  rowCount: 0,
  metadata: buildMetadata(),
});

const safeBarcodeProductFailure = (errorClass, message) => ({
  status: "error",
  errorClass,
  message,
  items: [],
  columns: BARCODE_PRODUCT_COLUMNS,
  rowCount: 0,
  metadata: buildBarcodeProductMetadata(),
});

function buildMetadata() {
  return {
    mode: "manual-read-only-preview",
    tableScope: STOCK_TABLE,
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

function buildBarcodeProductMetadata() {
  return {
    mode: "barcode-product-read-only",
    tableScope: `${BARCODE_TABLE} -> ${STOCK_CARD_TABLE}`,
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

  if (/\betimeout\b|timeout|time-out|timed out|zaman asimi/i.test(signals)) {
    return "SQL_TIMEOUT";
  }

  if (/\be_login\b|login failed|authentication|auth failed|password|18456|giris basarisiz|oturum acma/i.test(signals)) {
    return "SQL_AUTH_FAILED";
  }

  if (/\besocket\b|\beconnrefused\b|\beconnreset\b|\benotfound\b|\beai_again\b|network|server.*not found|instance|port|connect|baglanti kurulamadi|sunucu/i.test(signals)) {
    return "SQL_NETWORK_FAILED";
  }

  if (/permission|denied|not authorized|authorization|229|230|yetki|izin/i.test(signals)) {
    return "SQL_PERMISSION_DENIED";
  }

  if (/invalid object|invalid column|object name|column name|could not find|208|207|tablo|kolon|column|object/i.test(signals)) {
    return "SQL_TABLE_OR_COLUMN_MISMATCH";
  }

  return "SQL_UNKNOWN_SAFE";
}

function assertSafeQuery(queryText, limit) {
  if (limit !== MAX_LIMIT) {
    throw new Error("LIMIT_NOT_EXACTLY_20");
  }

  for (const word of FORBIDDEN_SQL_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, "i");
    if (pattern.test(queryText)) {
      throw new Error("FORBIDDEN_SQL_WORD");
    }
  }

  if (!/\bFROM\s+dbo\.F0102D0001TBLSTOKHAREKETLERI\b/i.test(queryText)) {
    throw new Error("UNEXPECTED_TABLE_SCOPE");
  }

  if (!/\bORDER\s+BY\s+TARIH\s+DESC\b/i.test(queryText)) {
    throw new Error("ORDER_BY_REQUIRED");
  }
}

function assertSafeMetadataQuery(queryText) {
  for (const word of FORBIDDEN_SQL_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, "i");
    if (pattern.test(queryText)) {
      throw new Error("FORBIDDEN_SQL_WORD");
    }
  }

  if (!/\bINFORMATION_SCHEMA\.COLUMNS\b/i.test(queryText)) {
    throw new Error("UNEXPECTED_METADATA_SCOPE");
  }
}

function assertSafeBarcodeProductQuery(queryText, limit) {
  if (limit !== MAX_LIMIT) {
    throw new Error("LIMIT_NOT_EXACTLY_20");
  }

  for (const word of FORBIDDEN_SQL_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, "i");
    if (pattern.test(queryText)) {
      throw new Error("FORBIDDEN_SQL_WORD");
    }
  }

  if (!/\bFROM\s+dbo\.F0102TBLBIRIMLEREX\s+b\b/i.test(queryText)) {
    throw new Error("UNEXPECTED_BARCODE_TABLE_SCOPE");
  }

  if (!/\bINNER\s+JOIN\s+dbo\.F0102TBLSTOKLAR\s+s\b/i.test(queryText)) {
    throw new Error("UNEXPECTED_STOCK_TABLE_SCOPE");
  }

  if (!/\bON\s+b\.STOKNO\s*=\s*s\.IND\b/i.test(queryText)) {
    throw new Error("UNEXPECTED_JOIN_SCOPE");
  }

  if (!/\bWHERE\s+b\.BARCODE\s*=\s*@barcode\b/i.test(queryText)) {
    throw new Error("PARAMETER_REQUIRED");
  }
}

function getMetadataHint(tableName, columnName) {
  const target = `${tableName} ${columnName}`.toLocaleUpperCase("tr-TR");
  return METADATA_HINTS.find((hint) => target.includes(hint)) || "KOD";
}

function getPossibleUsage(hint, columnName) {
  const target = `${hint} ${columnName}`.toLocaleUpperCase("tr-TR");

  if (target.includes("TARIH") || target.includes("TARİH")) return "Tarih alanı adayı";
  if (target.includes("MIKTAR") || target.includes("MİKTAR")) return "Miktar alanı adayı";
  if (target.includes("CIKIS") || target.includes("ÇIKIŞ")) return "Çıkış yönü alanı adayı";
  if (target.includes("HAREKET") || target.includes("HRK")) return "Hareket tablosu/kolonu adayı";
  if (target.includes("STOK")) return "Stok bağlantı alanı adayı";
  return "Kod veya eşleme alanı adayı";
}

function mapMetadataRow(row) {
  const hint = getMetadataHint(row.TABLE_NAME, row.COLUMN_NAME);
  return {
    candidateTable: row.TABLE_NAME,
    candidateColumn: row.COLUMN_NAME,
    matchedHint: hint,
    possibleUsage: getPossibleUsage(hint, row.COLUMN_NAME),
    controlNote: "Metadata adayıdır; canlı hareket satırı okunmadı.",
  };
}

function mapStockRow(row) {
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

function mapBarcodeProductRow(row) {
  return {
    BARCODE: row.BARCODE,
    STOKNO: row.STOKNO,
    ACIKLAMA: row.ACIKLAMA,
    STOKKODU: row.STOKKODU,
    MALINCINSI: row.MALINCINSI,
  };
}

async function findVegaProductByBarcodeReadOnly(rawBarcode) {
  const barcode = String(rawBarcode ?? "").trim();
  if (!barcode) {
    return safeBarcodeProductFailure("BARCODE_EMPTY", "Barkod bos. Fail-closed: Vega barkod urun aramasi denenmedi.");
  }

  if (barcode.length > 20) {
    return safeBarcodeProductFailure("BARCODE_TOO_LONG", "Barkod 20 karakteri asamaz. Fail-closed: Vega barkod urun aramasi denenmedi.");
  }

  const envPath = path.resolve(process.cwd(), ENV_FILE);

  if (!fs.existsSync(envPath)) {
    return safeBarcodeProductFailure("ENV_MISSING", ".env.local yok. Fail-closed: Vega barkod urun aramasi denenmedi.");
  }

  const env = parseEnvFile(envPath);
  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !env[key]);
  if (missingKeys.length) {
    return safeBarcodeProductFailure("ENV_MISSING", `Eksik env degiskenleri: ${missingKeys.join(", ")}. Fail-closed: Vega barkod urun aramasi denenmedi.`);
  }

  if (String(env.VEGA_SQL_USER).toLowerCase() === "sa") {
    return safeBarcodeProductFailure("SQL_AUTH_FAILED", "sa kullanicisi yasaktir. Fail-closed: Vega barkod urun aramasi denenmedi.");
  }

  const limit = parsePositiveInteger(env.VEGA_READONLY_LIMIT, MAX_LIMIT);
  if (limit !== MAX_LIMIT || limit > MAX_LIMIT) {
    return safeBarcodeProductFailure("ENV_MISSING", "VEGA_READONLY_LIMIT tam olarak 20 olmalidir. Fail-closed: Vega barkod urun aramasi denenmedi.");
  }

  const timeoutMs = parsePositiveInteger(env.VEGA_SQL_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  if (timeoutMs > DEFAULT_TIMEOUT_MS) {
    return safeBarcodeProductFailure("SQL_TIMEOUT", "VEGA_SQL_TIMEOUT_MS 3000 ms degerini asamaz. Fail-closed: Vega barkod urun aramasi denenmedi.");
  }

  const queryText = `
SELECT TOP (${limit})
  b.BARCODE,
  b.STOKNO,
  b.ACIKLAMA,
  s.STOKKODU,
  s.MALINCINSI
FROM ${BARCODE_TABLE} b
INNER JOIN ${STOCK_CARD_TABLE} s
ON b.STOKNO = s.IND
WHERE b.BARCODE = @barcode
`;

  try {
    assertSafeBarcodeProductQuery(queryText, limit);
  } catch {
    return safeBarcodeProductFailure("SQL_UNKNOWN_SAFE", "Guvenlik kontrolu basarisiz. Fail-closed: Vega barkod urun aramasi denenmedi.");
  }

  const pool = new sql.ConnectionPool({
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

  try {
    await pool.connect();
    const result = await pool.request().input("barcode", sql.NVarChar(20), barcode).query(queryText);
    const items = result.recordset.slice(0, MAX_LIMIT).map(mapBarcodeProductRow);

    return {
      status: "success",
      message: items.length
        ? "Barkod eslesmesi read-only olarak bulundu. Veri yazilmadi."
        : "Bu barkod icin read-only urun eslesmesi bulunamadi.",
      items,
      columns: BARCODE_PRODUCT_COLUMNS,
      rowCount: items.length,
      metadata: buildBarcodeProductMetadata(),
    };
  } catch (error) {
    return safeBarcodeProductFailure(classifySqlError(error), "Vega barkod urun aramasi basarisiz oldu. Ham hata gizlendi.");
  } finally {
    await pool.close().catch(() => undefined);
  }
}

async function listVegaStockReadOnly() {
  const envPath = path.resolve(process.cwd(), ENV_FILE);

  if (!fs.existsSync(envPath)) {
    return safeFailure("ENV_MISSING", ".env.local yok. Fail-closed: Vega stok onizleme denenmedi.");
  }

  const env = parseEnvFile(envPath);
  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !env[key]);
  if (missingKeys.length) {
    return safeFailure("ENV_MISSING", `Eksik env degiskenleri: ${missingKeys.join(", ")}. Fail-closed: Vega stok onizleme denenmedi.`);
  }

  if (String(env.VEGA_SQL_USER).toLowerCase() === "sa") {
    return safeFailure("SQL_AUTH_FAILED", "sa kullanicisi yasaktir. Fail-closed: Vega stok onizleme denenmedi.");
  }

  const limit = parsePositiveInteger(env.VEGA_READONLY_LIMIT, MAX_LIMIT);
  if (limit !== MAX_LIMIT || limit > MAX_LIMIT) {
    return safeFailure("ENV_MISSING", "VEGA_READONLY_LIMIT tam olarak 20 olmalidir. Fail-closed: Vega stok onizleme denenmedi.");
  }

  const timeoutMs = parsePositiveInteger(env.VEGA_SQL_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  if (timeoutMs > DEFAULT_TIMEOUT_MS) {
    return safeFailure("SQL_TIMEOUT", "VEGA_SQL_TIMEOUT_MS 3000 ms degerini asamaz. Fail-closed: Vega stok onizleme denenmedi.");
  }

  const queryText = `
SELECT TOP (${limit})
  STOKNO,
  ACIKLAMA,
  DEPO,
  GIREN,
  CIKAN,
  KALAN,
  TARIH
FROM ${STOCK_TABLE}
ORDER BY TARIH DESC
`;

  try {
    assertSafeQuery(queryText, limit);
  } catch {
    return safeFailure("SQL_UNKNOWN_SAFE", "Guvenlik kontrolu basarisiz. Fail-closed: Vega stok onizleme denenmedi.");
  }

  const pool = new sql.ConnectionPool({
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

  try {
    await pool.connect();
    const result = await pool.request().query(queryText);
    const items = result.recordset.slice(0, MAX_LIMIT).map(mapStockRow);

    return {
      status: "success",
      message: items.length
        ? "Vega stok hareketleri read-only olarak gecici onizlendi. Veri yazilmadi."
        : "Kayit bulunamadi veya secilen donem/prefix bos.",
      items,
      columns: STOCK_COLUMNS,
      rowCount: items.length,
      metadata: buildMetadata(),
    };
  } catch (error) {
    return safeFailure(classifySqlError(error), "Vega stok onizleme basarisiz oldu. Ham hata gizlendi.");
  } finally {
    await pool.close().catch(() => undefined);
  }
}

async function discoverVegaStockMovementMetadata() {
  const envPath = path.resolve(process.cwd(), ENV_FILE);

  if (!fs.existsSync(envPath)) {
    return safeMetadataFailure("ENV_MISSING", ".env.local yok. Fail-closed: metadata keşfi denenmedi.");
  }

  const env = parseEnvFile(envPath);
  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !env[key]);
  if (missingKeys.length) {
    return safeMetadataFailure("ENV_MISSING", "Eksik env değişkeni var. Fail-closed: metadata keşfi denenmedi.");
  }

  const timeoutMs = parsePositiveInteger(env.VEGA_SQL_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  if (timeoutMs > DEFAULT_TIMEOUT_MS) {
    return safeMetadataFailure("SQL_TIMEOUT", "Metadata keşfi için timeout güvenlik sınırı aşıldı. Fail-closed: metadata keşfi denenmedi.");
  }

  const queryText = `
SELECT TOP (${METADATA_MAX_ROWS})
  TABLE_NAME,
  COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME LIKE 'F0102%'
  AND (
    TABLE_NAME LIKE '%STOK%' OR COLUMN_NAME LIKE '%STOK%' OR
    TABLE_NAME LIKE '%HAREKET%' OR COLUMN_NAME LIKE '%HAREKET%' OR
    TABLE_NAME LIKE '%HRK%' OR COLUMN_NAME LIKE '%HRK%' OR
    TABLE_NAME LIKE '%CIKIS%' OR COLUMN_NAME LIKE '%CIKIS%' OR
    TABLE_NAME LIKE '%MIKTAR%' OR COLUMN_NAME LIKE '%MIKTAR%' OR
    TABLE_NAME LIKE '%TARIH%' OR COLUMN_NAME LIKE '%TARIH%' OR
    COLUMN_NAME LIKE '%KOD%'
  )
ORDER BY TABLE_NAME, COLUMN_NAME
`;

  try {
    assertSafeMetadataQuery(queryText);
  } catch {
    return safeMetadataFailure("SQL_UNKNOWN_SAFE", "Metadata güvenlik kontrolü başarısız. Fail-closed: metadata keşfi denenmedi.");
  }

  const pool = new sql.ConnectionPool({
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

  try {
    await pool.connect();
    const result = await pool.request().query(queryText);
    const items = result.recordset.slice(0, METADATA_MAX_ROWS).map(mapMetadataRow);

    return {
      status: "success",
      message: "Stok hareket metadata adayları güvenli şekilde geçici olarak listelendi. Canlı hareket satırı okunmadı.",
      items,
      rowCount: items.length,
      metadata: {
        ...buildMetadata(),
        mode: "manual-metadata-discovery",
        tableScope: "F0102 metadata",
        maxRowsLimit: METADATA_MAX_ROWS,
        liveMovementRowsRead: false,
        top100QueryEnabled: false,
      },
    };
  } catch (error) {
    return safeMetadataFailure(classifySqlError(error), "Metadata keşfi başarısız oldu. Ham hata gizlendi.");
  } finally {
    await pool.close().catch(() => undefined);
  }
}

module.exports = {
  discoverVegaStockMovementMetadata,
  findVegaProductByBarcodeReadOnly,
  listVegaStockReadOnly,
};
