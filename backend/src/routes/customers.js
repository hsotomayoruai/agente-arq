const express = require('express');
const rateLimit = require('express-rate-limit');
const { findCustomerByQr, getCustomerHistory } = require('../services/wasteService');
const { getDb } = require('../models/database');

const router = express.Router();

const customerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intente de nuevo en un minuto' },
});

router.use(customerLimiter);

/**
 * GET /api/customers/qr/:qrCode
 * Identify a customer by their QR code.
 */
router.get('/qr/:qrCode', (req, res) => {
  try {
    const customer = findCustomerByQr(req.params.qrCode);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    return res.json({ success: true, data: customer });
  } catch (err) {
    console.error('Customer lookup error:', err);
    return res.status(500).json({ error: 'Error al buscar cliente' });
  }
});

/**
 * GET /api/customers/:id/history
 * Get classification history for a customer.
 */
router.get('/:id/history', (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const history = getCustomerHistory(req.params.id, limit);
    return res.json({ success: true, data: history });
  } catch (err) {
    console.error('History error:', err);
    return res.status(500).json({ error: 'Error al obtener historial' });
  }
});

/**
 * GET /api/customers/:id
 * Get customer details.
 */
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const customer = db.prepare('SELECT id, name, email, qr_code, points FROM customers WHERE id = ?').get(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    return res.json({ success: true, data: customer });
  } catch (err) {
    console.error('Customer get error:', err);
    return res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

module.exports = router;
