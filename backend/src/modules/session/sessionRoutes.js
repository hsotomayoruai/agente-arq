const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { createSession, getSessionByToken, getSessionSummary } = require('./sessionService');

const router = express.Router();

// POST /api/sessions - Create session (guest or identified)
router.post(
  '/',
  [body('qr_token').optional().isString().trim().notEmpty()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Datos inválidos', details: errors.array() });
    }

    try {
      const { qr_token } = req.body;
      const session = createSession(qr_token || null);
      return res.status(201).json({ session });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/sessions/:token - Get session by token
router.get(
  '/:token',
  [param('token').isString().trim().notEmpty()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    try {
      const session = getSessionByToken(req.params.token);
      return res.json({ session });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/sessions/:token/summary - Get session summary
router.get(
  '/:token/summary',
  [param('token').isString().trim().notEmpty()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    try {
      const summary = getSessionSummary(req.params.token);
      return res.json(summary);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
