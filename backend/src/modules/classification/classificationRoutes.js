const express = require('express');
const multer = require('multer');
const { validationResult } = require('express-validator');
const validateSession = require('../../middleware/validateSession');
const { classifyImage } = require('./classificationService');

const router = express.Router();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de imagen no soportado. Use JPEG, PNG o WEBP'), false);
    }
  }
});

// POST /api/classify
router.post('/', validateSession, (req, res, next) => {
  upload.single('image')(req, res, async (uploadErr) => {
    if (uploadErr) {
      if (uploadErr.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          error: 'Archivo demasiado grande. Máximo permitido: 5MB',
          code: 'FILE_TOO_LARGE'
        });
      }
      return res.status(400).json({
        error: uploadErr.message,
        code: 'INVALID_FORMAT'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'No se recibió ninguna imagen',
        code: 'NO_IMAGE'
      });
    }

    try {
      const result = await classifyImage(req.file.buffer, req.file.mimetype, req.session);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });
});

module.exports = router;
