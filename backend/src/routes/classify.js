const express = require('express');
const multer = require('multer');
const { classifyWaste } = require('../services/wasteService');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes JPEG, PNG o WebP'));
    }
  },
});

/**
 * POST /api/classify
 * Body: multipart/form-data with field "image" and optional "customerId"
 */
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Se requiere una imagen' });
    }

    const customerId = req.body.customerId || null;
    const result = classifyWaste(req.file.originalname, req.file.buffer, customerId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error('Classification error:', err);
    return res.status(500).json({ error: 'Error al clasificar el residuo' });
  }
});

module.exports = router;
