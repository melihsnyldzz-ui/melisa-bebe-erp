const fs = require("node:fs");
const path = require("node:path");

function createDatabaseBackup({ app, activeDb, databasePath, targetDirectory }) {
  const backupDirectory = targetDirectory || path.join(app.getPath("userData"), "Backups");
  const backupPath = path.join(backupDirectory, buildBackupFileName());

  try {
    if (!databasePath || !fs.existsSync(databasePath)) {
      return { ok: false, error: "Veritabanı dosyası bulunamadı.", path: backupPath, createdAt: new Date().toISOString() };
    }

    fs.mkdirSync(backupDirectory, { recursive: true });
    activeDb.pragma("wal_checkpoint(TRUNCATE)");
    fs.copyFileSync(databasePath, backupPath);

    return { ok: true, path: backupPath, directory: backupDirectory, createdAt: new Date().toISOString() };
  } catch (error) {
    console.error("SQLite yedekleme dosyası oluşturulamadı:", error);
    return {
      ok: false,
      error: mapBackupError(error),
      path: backupPath,
      directory: backupDirectory,
      createdAt: new Date().toISOString(),
    };
  }
}

function buildBackupFileName(date = new Date()) {
  const timestamp = [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("-");

  return `melisa-bebe-erp-backup-${timestamp}.sqlite`;
}

function mapBackupError(error) {
  const code = error?.code || "";
  if (code === "EACCES" || code === "EPERM") return "Yedek klasörüne yazma izni yok. Lütfen farklı bir klasör deneyin.";
  if (code === "ENOENT") return "Veritabanı dosyası veya yedek klasörü bulunamadı.";
  if (code === "ENOSPC") return "Diskte yeterli boş alan yok. Yedek oluşturulamadı.";
  return "Yedekleme sırasında dosya kopyalama başarısız oldu.";
}

function pad(value) {
  return String(value).padStart(2, "0");
}

module.exports = { buildBackupFileName, createDatabaseBackup };
