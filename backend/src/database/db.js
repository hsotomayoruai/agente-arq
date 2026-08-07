const Database = require('better-sqlite3');
const path = require('path');
const { createSchema } = require('./schema');

let db;

function getDb() {
  if (!db) {
    const dbPath = process.env.DB_PATH
      ? path.resolve(process.env.DB_PATH)
      : path.join(__dirname, '../../..', 'reciclapp.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    createSchema(db);
  }
  return db;
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, closeDb };
