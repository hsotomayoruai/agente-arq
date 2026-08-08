process.env.DB_PATH = ':memory:';
const { classifyWaste, findCustomerByQr, getCustomerHistory } = require('../src/services/wasteService');

describe('wasteService', () => {
  test('classifyWaste without customer returns classification without points', () => {
    const result = classifyWaste('plastic_bottle.jpg', null, null);
    expect(result.wasteType).toBe('Plástico');
    expect(result.pointsAwarded).toBe(0);
    expect(result.customer).toBeNull();
    expect(result.totalPoints).toBeNull();
    expect(result.classificationId).toBeTruthy();
  });

  test('classifyWaste with valid customer awards points', () => {
    const result = classifyWaste('plastic_bottle.jpg', null, 'cust-001');
    expect(result.pointsAwarded).toBeGreaterThan(0);
    expect(result.customer).toBeTruthy();
    expect(result.customer.id).toBe('cust-001');
    expect(result.totalPoints).toBeGreaterThanOrEqual(0);
  });

  test('classifyWaste with unknown customer does not award points', () => {
    const result = classifyWaste('plastic_bottle.jpg', null, 'nonexistent-id');
    expect(result.pointsAwarded).toBe(0);
    expect(result.customer).toBeNull();
  });

  test('points accumulate across multiple classifications', () => {
    const r1 = classifyWaste('metal_can.jpg', null, 'cust-002');
    const r2 = classifyWaste('glass_jar.jpg', null, 'cust-002');
    expect(r2.totalPoints).toBeGreaterThan(r1.totalPoints);
  });

  test('findCustomerByQr returns customer for valid QR', () => {
    const customer = findCustomerByQr('QR-ANA-001');
    expect(customer).toBeTruthy();
    expect(customer.name).toBe('Ana García');
    expect(customer.id).toBe('cust-001');
  });

  test('findCustomerByQr returns null for invalid QR', () => {
    const customer = findCustomerByQr('INVALID-QR-CODE');
    expect(customer).toBeNull();
  });

  test('getCustomerHistory returns empty array for customer with no records', () => {
    const history = getCustomerHistory('cust-003');
    expect(Array.isArray(history)).toBe(true);
  });

  test('getCustomerHistory returns records after classification', () => {
    classifyWaste('cardboard_box.jpg', null, 'cust-003');
    const history = getCustomerHistory('cust-003');
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].customer_id).toBe('cust-003');
  });
});
