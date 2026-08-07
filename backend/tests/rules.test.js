const { getRuleForWasteType, getAllRules, getSupportedWasteTypes } = require('../src/modules/rules/recyclingRules');

describe('Recycling Rules Module', () => {
  test('plastic maps to blue container', () => {
    const rule = getRuleForWasteType('plastic');
    expect(rule).not.toBeNull();
    expect(rule.container).toBe('blue');
    expect(rule.points).toBe(10);
  });

  test('glass maps to green container', () => {
    const rule = getRuleForWasteType('glass');
    expect(rule).not.toBeNull();
    expect(rule.container).toBe('green');
    expect(rule.points).toBe(15);
  });

  test('paper maps to yellow container', () => {
    const rule = getRuleForWasteType('paper');
    expect(rule).not.toBeNull();
    expect(rule.container).toBe('yellow');
    expect(rule.points).toBe(8);
  });

  test('metal maps to gray container', () => {
    const rule = getRuleForWasteType('metal');
    expect(rule).not.toBeNull();
    expect(rule.container).toBe('gray');
    expect(rule.points).toBe(20);
  });

  test('organic maps to brown container', () => {
    const rule = getRuleForWasteType('organic');
    expect(rule).not.toBeNull();
    expect(rule.container).toBe('brown');
    expect(rule.points).toBe(5);
  });

  test('returns null for unknown waste type', () => {
    const rule = getRuleForWasteType('nuclear');
    expect(rule).toBeNull();
  });

  test('returns null for empty string', () => {
    const rule = getRuleForWasteType('');
    expect(rule).toBeNull();
  });

  test('all rules have required fields', () => {
    const rules = getAllRules();
    Object.entries(rules).forEach(([type, rule]) => {
      expect(rule.container).toBeDefined();
      expect(rule.containerName).toBeDefined();
      expect(rule.label).toBeDefined();
      expect(rule.emoji).toBeDefined();
      expect(typeof rule.points).toBe('number');
      expect(rule.points).toBeGreaterThan(0);
    });
  });

  test('getSupportedWasteTypes returns all 5 types', () => {
    const types = getSupportedWasteTypes();
    expect(types).toHaveLength(5);
    expect(types).toContain('plastic');
    expect(types).toContain('glass');
    expect(types).toContain('paper');
    expect(types).toContain('metal');
    expect(types).toContain('organic');
  });
});
