const { getSessionByToken } = require('../modules/session/sessionService');

function validateSession(req, res, next) {
  const token = req.headers['x-session-token'];

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return res.status(401).json({
      error: 'Sesión requerida. Incluya el header X-Session-Token',
      code: 'MISSING_SESSION_TOKEN'
    });
  }

  try {
    const session = getSessionByToken(token.trim());
    req.session = session;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Sesión inválida o expirada',
      code: 'INVALID_SESSION'
    });
  }
}

module.exports = validateSession;
