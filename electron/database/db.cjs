const path = require("node:path");
const fs = require("node:fs");
const Database = require("better-sqlite3");
const { createDatabaseBackup } = require("./backup.cjs");
const { runMigrations } = require("./schema.cjs");
const { seedDatabase } = require("./seed.cjs");

const DATABASE_FILE_NAME = "melisa-bebe-erp.sqlite";
const LEGACY_DATABASE_FILE_NAME = "melisa_bebe.db";
let db;
let databasePath;

function initializeDatabase(app) {
  if (db) return db;

  databasePath = getDatabasePath(app);
  migrateLegacyDatabase(app, databasePath);
  db = new Database(databasePath);
  runMigrations(db);
  seedDatabase(db);

  return db;
}

function getDatabasePath(app) {
  return path.join(app.getPath("userData"), DATABASE_FILE_NAME);
}

function exportDatabaseBackup(app, targetDirectory) {
  const activeDb = initializeDatabase(app);
  return createDatabaseBackup({ app, activeDb, databasePath, targetDirectory });
}

function migrateLegacyDatabase(app, targetPath) {
  const legacyPath = path.join(app.getPath("userData"), LEGACY_DATABASE_FILE_NAME);
  if (fs.existsSync(targetPath) || !fs.existsSync(legacyPath)) return;

  try {
    fs.copyFileSync(legacyPath, targetPath);
    copyIfExists(`${legacyPath}-wal`, `${targetPath}-wal`);
    copyIfExists(`${legacyPath}-shm`, `${targetPath}-shm`);
  } catch (error) {
    console.error("Eski SQLite dosyası yeni kalıcı veritabanı adına taşınamadı:", error);
  }
}

function copyIfExists(source, target) {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target);
  }
}

module.exports = { exportDatabaseBackup, getDatabasePath, initializeDatabase };
