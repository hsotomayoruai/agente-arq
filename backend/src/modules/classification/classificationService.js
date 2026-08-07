const { getDb } = require('../../database/db');
const { getRuleForWasteType } = require('../rules/recyclingRules');
const { awardPoints } = require('../points/pointsService');
const SimulatedAiProvider = require('../../providers/simulatedAiProvider');

const MIN_CONFIDENCE = 0.6;
const aiProvider = new SimulatedAiProvider();

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Magic bytes for file type validation
const MAGIC_BYTES = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46] // RIFF header - need extra check
};

function validateMagicBytes(buffer, mimetype) {
  if (!buffer || buffer.length < 4) return false;
  const magic = MAGIC_BYTES[mimetype];
  if (!magic) return false;

  for (let i = 0; i < magic.length; i++) {
    if (buffer[i] !== magic[i]) return false;
  }

  // Extra check for webp: bytes 8-11 must be 'WEBP'
  if (mimetype === 'image/webp') {
    if (buffer.length < 12) return false;
    const webp = [0x57, 0x45, 0x42, 0x50];
    for (let i = 0; i < 4; i++) {
      if (buffer[8 + i] !== webp[i]) return false;
    }
  }

  return true;
}

async function classifyImage(imageBuffer, mimetype, session) {
  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    const err = new Error('Formato de imagen no soportado. Use JPEG, PNG o WEBP');
    err.status = 400;
    err.code = 'INVALID_FORMAT';
    throw err;
  }

  // Validate magic bytes
  if (!validateMagicBytes(imageBuffer, mimetype)) {
    const err = new Error('El archivo no es una imagen válida');
    err.status = 400;
    err.code = 'INVALID_FILE';
    throw err;
  }

  // Call AI provider
  let aiResult;
  try {
    aiResult = await aiProvider.classify(imageBuffer);
  } catch (providerError) {
    const err = new Error('Error del proveedor de IA: ' + providerError.message);
    err.status = 503;
    err.code = 'AI_PROVIDER_ERROR';
    throw err;
  }

  const { waste_type, confidence } = aiResult;

  // Validate confidence
  if (confidence < MIN_CONFIDENCE) {
    const err = new Error('Clasificación rechazada: nivel de confianza insuficiente');
    err.status = 422;
    err.code = 'LOW_CONFIDENCE';
    err.details = { confidence, threshold: MIN_CONFIDENCE };
    throw err;
  }

  // Get recycling rule
  const rule = getRuleForWasteType(waste_type);
  if (!rule) {
    const err = new Error('Tipo de residuo desconocido: ' + waste_type);
    err.status = 422;
    err.code = 'UNKNOWN_WASTE_TYPE';
    throw err;
  }

  const db = getDb();

  // Award points (only for identified sessions)
  const customerId = session.is_guest ? null : session.customer_id;

  // Insert classification (points_awarded will be updated after)
  const classResult = db.prepare(
    'INSERT INTO classifications (session_id, waste_type, confidence, container, points_awarded) VALUES (?, ?, ?, ?, ?)'
  ).run(session.id, waste_type, confidence, rule.container, 0);

  const classificationId = classResult.lastInsertRowid;
  const pointsAwarded = awardPoints(customerId, classificationId, waste_type);

  // Update points_awarded
  if (pointsAwarded > 0) {
    db.prepare('UPDATE classifications SET points_awarded = ? WHERE id = ?')
      .run(pointsAwarded, classificationId);
  }

  const classification = db.prepare('SELECT * FROM classifications WHERE id = ?').get(classificationId);

  // Get updated customer if identified
  let updatedCustomer = null;
  if (customerId) {
    updatedCustomer = db
      .prepare('SELECT id, name, total_points FROM customers WHERE id = ?')
      .get(customerId);
  }

  return {
    classification,
    waste_type,
    confidence,
    container: rule.container,
    containerName: rule.containerName,
    label: rule.label,
    emoji: rule.emoji,
    points_awarded: pointsAwarded,
    customer: updatedCustomer
  };
}

module.exports = { classifyImage, validateMagicBytes };
