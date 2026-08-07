const crypto = require('crypto');
const { getDb } = require('../../database/db');

function generateToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

function createSession(qrToken) {
  const db = getDb();

  let customerId = null;
  let isGuest = 1;

  if (qrToken) {
    const customer = db.prepare('SELECT id FROM customers WHERE qr_token = ?').get(qrToken);
    if (!customer) {
      const err = new Error('QR token inválido o cliente no encontrado');
      err.status = 404;
      throw err;
    }
    customerId = customer.id;
    isGuest = 0;
  }

  const sessionToken = generateToken(32);
  const stmt = db.prepare(
    'INSERT INTO sessions (session_token, customer_id, is_guest) VALUES (?, ?, ?)'
  );
  const result = stmt.run(sessionToken, customerId, isGuest);

  return getSessionById(result.lastInsertRowid);
}

function getSessionByToken(token) {
  const db = getDb();
  const session = db.prepare('SELECT * FROM sessions WHERE session_token = ?').get(token);
  if (!session) {
    const err = new Error('Sesión no encontrada');
    err.status = 404;
    throw err;
  }
  return session;
}

function getSessionById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
}

function getSessionSummary(token) {
  const db = getDb();
  const session = db.prepare('SELECT * FROM sessions WHERE session_token = ?').get(token);
  if (!session) {
    const err = new Error('Sesión no encontrada');
    err.status = 404;
    throw err;
  }

  const classifications = db
    .prepare('SELECT * FROM classifications WHERE session_id = ? ORDER BY created_at ASC')
    .all(session.id);

  let customer = null;
  if (session.customer_id) {
    customer = db
      .prepare('SELECT id, name, email, total_points FROM customers WHERE id = ?')
      .get(session.customer_id);
  }

  const totalPoints = classifications.reduce((sum, c) => sum + (c.points_awarded || 0), 0);

  return {
    session,
    customer,
    classifications,
    totalPoints
  };
}

module.exports = { createSession, getSessionByToken, getSessionById, getSessionSummary };
