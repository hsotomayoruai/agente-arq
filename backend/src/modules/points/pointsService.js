const { getDb } = require('../../database/db');
const { getRuleForWasteType } = require('../rules/recyclingRules');

const POINTS_PER_TYPE = {
  plastic: 10,
  glass: 15,
  paper: 8,
  metal: 20,
  organic: 5
};

function awardPoints(customerId, classificationId, wasteType) {
  if (!customerId) {
    return 0; // guests don't get points
  }

  const points = POINTS_PER_TYPE[wasteType];
  if (points === undefined) {
    return 0;
  }

  const db = getDb();

  // Record the movement
  db.prepare(
    'INSERT INTO point_movements (customer_id, classification_id, points) VALUES (?, ?, ?)'
  ).run(customerId, classificationId, points);

  // Update customer total
  db.prepare(
    'UPDATE customers SET total_points = total_points + ? WHERE id = ?'
  ).run(points, customerId);

  return points;
}

function getPointsForWasteType(wasteType) {
  return POINTS_PER_TYPE[wasteType] || 0;
}

function getCustomerPoints(customerId) {
  const db = getDb();
  const customer = db.prepare('SELECT total_points FROM customers WHERE id = ?').get(customerId);
  return customer ? customer.total_points : 0;
}

module.exports = { awardPoints, getPointsForWasteType, getCustomerPoints, POINTS_PER_TYPE };
