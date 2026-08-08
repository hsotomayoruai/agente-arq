const { analyze, WASTE_CATALOG } = require('../src/services/aiClassifier');

describe('aiClassifier', () => {
  test('classifies plastic by filename keyword', () => {
    const result = analyze('plastic_bottle.jpg', null);
    expect(result.wasteType).toBe('Plástico');
    expect(result.containerColor).toBe('yellow');
    expect(result.points).toBeGreaterThan(0);
    expect(result.provider).toBe('simulated');
  });

  test('classifies paper/cardboard by filename keyword', () => {
    const result = analyze('old_newspaper.jpg', null);
    expect(result.wasteType).toBe('Papel y Cartón');
    expect(result.containerColor).toBe('blue');
  });

  test('classifies glass by filename keyword', () => {
    const result = analyze('glass_jar.png', null);
    expect(result.wasteType).toBe('Vidrio');
    expect(result.containerColor).toBe('green');
  });

  test('classifies metal by filename keyword', () => {
    const result = analyze('aluminum_can.jpg', null);
    expect(result.wasteType).toBe('Metal');
    expect(result.containerColor).toBe('gray');
  });

  test('classifies organic waste by filename keyword', () => {
    const result = analyze('fruit_peel.jpg', null);
    expect(result.wasteType).toBe('Orgánico');
    expect(result.containerColor).toBe('brown');
  });

  test('classifies hazardous by filename keyword', () => {
    const result = analyze('old_battery.jpg', null);
    expect(result.wasteType).toBe('Residuo Especial');
    expect(result.containerColor).toBe('orange');
    expect(result.points).toBe(20);
  });

  test('returns a valid classification for unknown filename', () => {
    const result = analyze('unknown_image_xyz.jpg', null);
    expect(result.wasteType).toBeTruthy();
    expect(result.containerColor).toBeTruthy();
    expect(result.containerLabel).toBeTruthy();
    expect(typeof result.points).toBe('number');
    expect(result.confidence).toBeGreaterThan(0);
  });

  test('returns a valid classification for empty filename', () => {
    const result = analyze('', null);
    expect(result.wasteType).toBeTruthy();
  });

  test('all catalog entries have required fields', () => {
    for (const entry of WASTE_CATALOG) {
      expect(entry.wasteType).toBeTruthy();
      expect(entry.containerColor).toBeTruthy();
      expect(entry.containerLabel).toBeTruthy();
      expect(entry.containerIcon).toBeTruthy();
      expect(typeof entry.points).toBe('number');
      expect(entry.points).toBeGreaterThan(0);
    }
  });

  test('confidence is between 0 and 1', () => {
    const result = analyze('plastic_bottle.jpg', null);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});
