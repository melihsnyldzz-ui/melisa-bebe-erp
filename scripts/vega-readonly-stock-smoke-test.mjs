import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import sql from "mssql";

const ENV_FILE = ".env.local";
const REQUIRED_ENV_KEYS = ["VEGA_SQL_SERVER", "VEGA_SQL_DATABASE", "VEGA_SQL_USER", "VEGA_SQL_PASSWORD"];
const FORBIDDEN_SQL_WORDS = ["INSERT", "UPDATE", "DELETE", "MERGE", "DROP", "ALTER", "CREATE", "TRUNCATE", "EXEC"];
const MAX_LIMIT = 20;
const DEFAULT_TIMEOUT_MS = 3000;

const safeLog = (message) => {
  console.log(`[vega-readonly-stock-smoke] ${message}`);
};

const safeError = (message) => {
  console.error(`[vega-readonly-stock-smoke] ${message}`);
};

const parseEnvFile = (filePath) => {
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
};

const parseBoolean = (value, fallback) => {
  if (value === undefined || value === "") return fallback;
  return String(value).toLowerCase() === "true";
};

const parsePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const assertSafeQuery = (queryText, limit) => {
  if (limit !== MAX_LIMIT) {
    throw new Error("LIMIT_NOT_EXACTLY_20");
  }

  for (const word of FORBIDDEN_SQL_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, "i");
    if (pattern.test(queryText)) {
      throw new Error("FORBIDDEN_SQL_WORD");
    }
  }

  if (!/\bFROM\s+F0102TBLSTOKLAR\b/i.test(queryText)) {
    throw new Error("UNEXPECTED_TABLE_SCOPE");
  }
};

const renderRows = (rows) => {
  if (!rows.length) {
    safeLog("Okunan stok kartı bulunamadı.");
    return;
  }

  const previewRows = rows.map((row) => ({
    IND: row.IND,
    STOKKODU: row.STOKKODU,
    MALINCINSI: row.MALINCINSI,
    KOD1: row.KOD1,
    KOD2: row.KOD2,
    KOD4: row.KOD4,
    KOD6: row.KOD6,
    ALISFIYATI: row.ALISFIYATI,
    ISKSATISFIYATI2: row.ISKSATISFIYATI2,
    ISKSATISFIYATI3: row.ISKSATISFIYATI3,
    KDVGRUBU: row.KDVGRUBU,
  }));

  console.table(previewRows);
};

const main = async () => {
  const envPath = path.resolve(process.cwd(), ENV_FILE);

  if (!fs.existsSync(envPath)) {
    safeError(".env.local bulunamadı. Fail-closed: bağlantı denenmedi.");
    process.exitCode = 1;
    return;
  }

  const env = parseEnvFile(envPath);
  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !env[key]);
  if (missingKeys.length) {
    safeError(`Eksik env değişkenleri: ${missingKeys.join(", ")}. Fail-closed: bağlantı denenmedi.`);
    process.exitCode = 1;
    return;
  }

  const limit = parsePositiveInteger(env.VEGA_READONLY_LIMIT, MAX_LIMIT);
  if (limit !== MAX_LIMIT || limit > MAX_LIMIT) {
    safeError("VEGA_READONLY_LIMIT tam olarak 20 olmalıdır. Fail-closed: bağlantı denenmedi.");
    process.exitCode = 1;
    return;
  }

  const timeoutMs = parsePositiveInteger(env.VEGA_SQL_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  if (timeoutMs > DEFAULT_TIMEOUT_MS) {
    safeError("VEGA_SQL_TIMEOUT_MS 3000 ms değerini aşamaz. Fail-closed: bağlantı denenmedi.");
    process.exitCode = 1;
    return;
  }

  const queryText = `
SELECT TOP (${limit})
  IND,
  STOKKODU,
  MALINCINSI,
  KOD1,
  KOD2,
  KOD4,
  KOD6,
  ALISFIYATI,
  ISKSATISFIYATI2,
  ISKSATISFIYATI3,
  KDVGRUBU
FROM F0102TBLSTOKLAR
`;

  try {
    assertSafeQuery(queryText, limit);
  } catch {
    safeError("Güvenlik kontrolü başarısız. Fail-closed: bağlantı denenmedi.");
    process.exitCode = 1;
    return;
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
    safeLog("Read-only stok kartı smoke test başlıyor. Kapsam: F0102TBLSTOKLAR, limit: 20.");
    await pool.connect();
    const result = await pool.request().query(queryText);
    safeLog(`Okunan satır sayısı: ${result.recordset.length}`);
    renderRows(result.recordset);
    safeLog("Read-only smoke test tamamlandı. Sonuç dosyaya yazılmadı.");
  } catch {
    safeError("Read-only stok kartı okuma denemesi başarısız oldu. Ham hata gizlendi; tekrar denemeden önce raporlayın.");
    process.exitCode = 1;
  } finally {
    await pool.close().catch(() => undefined);
  }
};

await main();
