const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/database');
const { analyze } = require('./aiClassifier');

/**
 * Classifies a waste image and optionally awards points to a customer.
 * @param {string} imageFilename
 * @param {Buffer|null} imageBuffer
 * @param {string|null} customerId
 * @returns {object} classification + points info
 */
function classifyWaste(imageFilename, imageBuffer, customerId) {
  const db = getDb();
  const classification = analyze(imageFilename, imageBuffer);

  let pointsAwarded = 0;
  let customer = null;

  if (customerId) {
    customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId);
    if (customer) {
      pointsAwarded = classification.points;
      db.prepare('UPDATE customers SET points = points + ? WHERE id = ?').run(pointsAwarded, customerId);
      customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId);
    }
  }

  const record = {
    id: uuidv4(),
    customer_id: customer ? customerId : null,
    waste_type: classification.wasteType,
    container_color: classification.containerColor,
    container_label: classification.containerLabel,
    points_awarded: pointsAwarded,
    image_path: imageFilename || null,
  };

  db.prepare(`
    INSERT INTO classifications (id, customer_id, waste_type, container_color, container_label, points_awarded, image_path)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(record.id, record.customer_id, record.waste_type, record.container_color, record.container_label, record.points_awarded, record.image_path);

  return {
    classificationId: record.id,
    wasteType: classification.wasteType,
    containerColor: classification.containerColor,
    containerLabel: classification.containerLabel,
    containerIcon: classification.containerIcon,
    confidence: classification.confidence,
    provider: classification.provider,
    pointsAwarded,
    totalPoints: customer ? customer.points : null,
    customer: customer ? { id: customer.id, name: customer.name, points: customer.points } : null,
  };
}

/**
 * Looks up a customer by QR code.
 * @param {string} qrCode
 * @returns {object|null}
 */
function findCustomerByQr(qrCode) {
  const db = getDb();
  return db.prepare('SELECT id, name, email, qr_code, points FROM customers WHERE qr_code = ?').get(qrCode) || null;
}

/**
 * Returns recent classifications for a customer.
 * @param {string} customerId
 * @param {number} limit
 */
function getCustomerHistory(customerId, limit = 10) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM classifications WHERE customer_id = ? ORDER BY created_at DESC LIMIT ?
  `).all(customerId, limit);
}

module.exports = { classifyWaste, findCustomerByQr, getCustomerHistory };
