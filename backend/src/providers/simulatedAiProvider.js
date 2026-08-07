const AiProvider = require('./aiProvider');
const { getSupportedWasteTypes } = require('../modules/rules/recyclingRules');

/**
 * Simulated AI Provider for MVP testing.
 * Returns deterministic results based on a hash of the image buffer,
 * so the same image always returns the same waste type.
 * Confidence is between 0.70 and 0.99.
 */
class SimulatedAiProvider extends AiProvider {
  constructor() {
    super();
    this.wasteTypes = getSupportedWasteTypes();
  }

  /**
   * Compute a simple hash of the buffer to deterministically pick a waste type.
   * @param {Buffer} buf
   * @returns {number}
   */
  _hashBuffer(buf) {
    let hash = 0;
    const len = Math.min(buf.length, 256);
    for (let i = 0; i < len; i++) {
      hash = (hash * 31 + buf[i]) >>> 0;
    }
    return hash;
  }

  /**
   * @param {Buffer} imageBuffer
   * @returns {Promise<{waste_type: string, confidence: number}>}
   */
  async classify(imageBuffer) {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error('AI Provider: empty image buffer');
    }

    const hash = this._hashBuffer(imageBuffer);
    const index = hash % this.wasteTypes.length;
    const waste_type = this.wasteTypes[index];

    // Deterministic confidence between 0.70 and 0.99 based on hash
    const confidenceRaw = ((hash >>> 4) % 30) / 100; // 0.00 to 0.29
    const confidence = parseFloat((0.70 + confidenceRaw).toFixed(2));

    return { waste_type, confidence };
  }
}

module.exports = SimulatedAiProvider;
