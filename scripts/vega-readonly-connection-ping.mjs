const fs = await import("node:fs");
const path = await import("node:path");
const sqlModule = await import("mssql");
const sql = sqlModule.default ?? sqlModule;

const ENV_FILE = ".env.local";
const REQUIRED_ENV_KEYS = ["VEGA_SQL_SERVER", "VEGA_SQL_DATABASE", "VEGA_SQL_USER", "VEGA_SQL_PASSWORD"];
const DEFAULT_TIMEOUT_MS = 3000;

const safeLog = (message) => {
  console.log(`[vega-readonly-connection-ping] ${message}`);
};

const safeError = (message) => {
  console.error(`[vega-readonly-connection-ping] ${message}`);
};

const errorDescriptions = {
  ENV_MISSING: ".env.local yok veya gerekli alanlar eksik. Baglanti bilgileri gizlendi ve oturum denenmedi.",
  SQL_AUTH_FAILED: "SQL kullanici adi veya sifre hatali olabilir. Baglanti bilgileri gizlendi.",
  SQL_NETWORK_FAILED: "SQL Server, instance veya port erisilemiyor olabilir. Sunucu bilgileri gizlendi.",
  SQL_TIMEOUT: "Baglanti 3000 ms hedef suresini asmis olabilir.",
  SQL_UNKNOWN_SAFE: "Hata guvenli sekilde siniflandirilamadi. Ham hata gizlendi.",
};

const reportSafeFailure = (errorClass, detail) => {
  safeError(`Hata sinifi: ${errorClass}`);
  safeError(`Aciklama: ${errorDescriptions[errorClass] ?? errorDescriptions.SQL_UNKNOWN_SAFE}`);
  if (detail) {
    safeError(detail);
  }
};

const collectSafeErrorSignals = (error) =>
  [
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

const classifySqlError = (error) => {
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

  return "SQL_UNKNOWN_SAFE";
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

const main = async () => {
  const envPath = path.resolve(process.cwd(), ENV_FILE);

  if (!fs.existsSync(envPath)) {
    reportSafeFailure("ENV_MISSING", "Eksik dosya: .env.local. Fail-closed: oturum denenmedi.");
    process.exitCode = 1;
    return;
  }

  const env = parseEnvFile(envPath);
  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !env[key]);
  if (missingKeys.length) {
    reportSafeFailure("ENV_MISSING", `Eksik env degiskenleri: ${missingKeys.join(", ")}. Fail-closed: oturum denenmedi.`);
    process.exitCode = 1;
    return;
  }

  const timeoutMs = parsePositiveInteger(env.VEGA_SQL_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  if (timeoutMs > DEFAULT_TIMEOUT_MS) {
    safeError("VEGA_SQL_TIMEOUT_MS 3000 ms degerini asamaz. Fail-closed: oturum denenmedi.");
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
    safeLog("Read-only SQL baglanti ping basliyor. Veri okunmayacak.");
    await pool.connect();
    safeLog("SQL baglanti oturumu acildi ve kapatildi. Veri okunmadi.");
  } catch (error) {
    reportSafeFailure(classifySqlError(error), "Read-only baglanti ping basarisiz oldu. Ham hata gizlendi; tekrar denemeden once raporlayin.");
    process.exitCode = 1;
  } finally {
    await pool.close().catch(() => undefined);
  }
};

await main();
