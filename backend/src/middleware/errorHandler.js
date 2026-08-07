function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  const code = err.code || 'INTERNAL_ERROR';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${status} ${code}: ${message}`);
    if (status === 500) {
      console.error(err.stack);
    }
  }

  const response = { error: message, code };
  if (err.details) {
    response.details = err.details;
  }

  return res.status(status).json(response);
}

module.exports = errorHandler;
