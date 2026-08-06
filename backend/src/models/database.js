const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'reciclapp.db');

let _db = null;

function getDb() {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    initSchema(_db);
  }
  return _db;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      qr_code TEXT UNIQUE NOT NULL,
      points INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS classifications (
      id TEXT PRIMARY KEY,
      customer_id TEXT,
      waste_type TEXT NOT NULL,
      container_color TEXT NOT NULL,
      container_label TEXT NOT NULL,
      points_awarded INTEGER DEFAULT 0,
      image_path TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
  `);

  // Seed demo customers
  const existing = db.prepare('SELECT COUNT(*) as cnt FROM customers').get();
  if (existing.cnt === 0) {
    const insert = db.prepare(
      'INSERT INTO customers (id, name, email, qr_code, points) VALUES (?, ?, ?, ?, ?)'
    );
    insert.run('cust-001', 'Ana García', 'ana@example.com', 'QR-ANA-001', 120);
    insert.run('cust-002', 'Carlos López', 'carlos@example.com', 'QR-CARLOS-002', 45);
    insert.run('cust-003', 'Demo User', 'demo@example.com', 'QR-DEMO-003', 0);
  }
}

module.exports = { getDb };
