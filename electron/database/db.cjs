const path = require("node:path");
const Database = require("better-sqlite3");
const { runMigrations } = require("./schema.cjs");
const { seedDatabase } = require("./seed.cjs");

let db;

function initializeDatabase(app) {
  if (db) return db;

  const dbPath = path.join(app.getPath("userData"), "melisa_bebe.db");
  db = new Database(dbPath);
  runMigrations(db);
  seedDatabase(db);

  return db;
}

module.exports = { initializeDatabase };
