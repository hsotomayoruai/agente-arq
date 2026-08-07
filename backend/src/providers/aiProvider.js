/**
 * AI Provider interface contract.
 * Any real provider must implement: classify(imageBuffer) → { waste_type, confidence }
 */
class AiProvider {
  /**
   * @param {Buffer} imageBuffer
   * @returns {Promise<{waste_type: string, confidence: number}>}
   */
  async classify(imageBuffer) {
    throw new Error('classify() must be implemented by the AI provider');
  }
}

module.exports = AiProvider;
