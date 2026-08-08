function errorHandler(err, _req, res, _next) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'La imagen supera el tamaño máximo de 10MB' });
  }
  if (err.message && err.message.startsWith('Solo se permiten')) {
    return res.status(400).json({ error: err.message });
  }
  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = { errorHandler };
