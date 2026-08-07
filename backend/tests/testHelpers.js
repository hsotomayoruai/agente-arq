/**
 * Helper to create an isolated in-memory database for tests.
 * Call this in beforeEach and pass the returned db to jest.mock or module reset.
 */
const Database = require('better-sqlite3');
const { createSchema } = require('../src/database/schema');

function createTestDb() {
  const db = new Database(':memory:');
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  createSchema(db);
  return db;
}

module.exports = { createTestDb };
