const crypto = require('crypto');
const QRCode = require('qrcode');
const { getDb } = require('../../database/db');

function generateQrToken() {
  return crypto.randomBytes(16).toString('hex');
}

function createCustomer(name, email) {
  const db = getDb();

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    const err = new Error('El nombre es requerido');
    err.status = 400;
    throw err;
  }

  if (email) {
    const existing = db.prepare('SELECT id FROM customers WHERE email = ?').get(email.trim());
    if (existing) {
      const err = new Error('El email ya está registrado');
      err.status = 409;
      throw err;
    }
  }

  const qrToken = generateQrToken();
  const stmt = db.prepare(
    'INSERT INTO customers (name, email, qr_token) VALUES (?, ?, ?)'
  );

  try {
    const result = stmt.run(name.trim(), email ? email.trim() : null, qrToken);
    return db.prepare('SELECT id, name, email, qr_token, total_points, created_at FROM customers WHERE id = ?').get(result.lastInsertRowid);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      const e = new Error('El email ya está registrado');
      e.status = 409;
      throw e;
    }
    throw err;
  }
}

function getCustomerByQrToken(qrToken) {
  const db = getDb();
  const customer = db
    .prepare('SELECT id, name, email, qr_token, total_points, created_at FROM customers WHERE qr_token = ?')
    .get(qrToken);

  if (!customer) {
    const err = new Error('Cliente no encontrado');
    err.status = 404;
    throw err;
  }

  return customer;
}

async function generateQrCodeDataUrl(qrToken) {
  return QRCode.toDataURL(qrToken);
}

module.exports = { createCustomer, getCustomerByQrToken, generateQrCodeDataUrl };
