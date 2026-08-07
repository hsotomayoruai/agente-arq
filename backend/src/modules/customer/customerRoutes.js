const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { createCustomer, getCustomerByQrToken, generateQrCodeDataUrl } = require('./customerService');

const router = express.Router();

// POST /api/customers - Create customer
router.post(
  '/',
  [
    body('name').isString().trim().notEmpty().withMessage('El nombre es requerido'),
    body('email').optional({ nullable: true }).isEmail().withMessage('Email inválido').normalizeEmail()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Datos inválidos', details: errors.array() });
    }

    try {
      const { name, email } = req.body;
      const customer = createCustomer(name, email);
      const qrCodeDataUrl = await generateQrCodeDataUrl(customer.qr_token);
      return res.status(201).json({ customer, qrCode: qrCodeDataUrl });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/customers/qr/:token - Get customer by QR token
router.get(
  '/qr/:token',
  [param('token').isString().trim().notEmpty()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    try {
      const customer = getCustomerByQrToken(req.params.token);
      return res.json({ customer });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
