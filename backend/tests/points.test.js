const Database = require('better-sqlite3');
const { createSchema } = require('../src/database/schema');

let mockDb;

jest.mock('../src/database/db', () => ({
  getDb: () => mockDb,
  closeDb: () => {}
}));

const { awardPoints, getPointsForWasteType, POINTS_PER_TYPE } = require('../src/modules/points/pointsService');

beforeEach(() => {
  mockDb = new Database(':memory:');
  mockDb.pragma('journal_mode = WAL');
  mockDb.pragma('foreign_keys = ON');
  createSchema(mockDb);
});

afterEach(() => {
  mockDb.close();
});

function createCustomer() {
  const result = mockDb.prepare(
    "INSERT INTO customers (name, email, qr_token) VALUES (?, ?, ?)"
  ).run('Test User', 'test@example.com', 'test-token-' + Date.now());
  return result.lastInsertRowid;
}

function createSession(customerId, isGuest = 0) {
  const token = require('crypto').randomBytes(32).toString('hex');
  const result = mockDb.prepare(
    'INSERT INTO sessions (session_token, customer_id, is_guest) VALUES (?, ?, ?)'
  ).run(token, customerId, isGuest);
  return { id: result.lastInsertRowid, token };
}

function createClassification(sessionId, wasteType) {
  const result = mockDb.prepare(
    'INSERT INTO classifications (session_id, waste_type, confidence, container, points_awarded) VALUES (?, ?, ?, ?, ?)'
  ).run(sessionId, wasteType, 0.95, 'blue', 0);
  return result.lastInsertRowid;
}

describe('Points Service', () => {
  test('awards correct points for plastic to identified customer', () => {
    const customerId = createCustomer();
    const session = createSession(customerId, 0);
    const classId = createClassification(session.id, 'plastic');

    const points = awardPoints(customerId, classId, 'plastic');
    expect(points).toBe(10);
  });

  test('awards correct points for glass', () => {
    const customerId = createCustomer();
    const session = createSession(customerId, 0);
    const classId = createClassification(session.id, 'glass');

    const points = awardPoints(customerId, classId, 'glass');
    expect(points).toBe(15);
  });

  test('awards correct points for metal', () => {
    const customerId = createCustomer();
    const session = createSession(customerId, 0);
    const classId = createClassification(session.id, 'metal');

    const points = awardPoints(customerId, classId, 'metal');
    expect(points).toBe(20);
  });

  test('does NOT award points when customerId is null (guest)', () => {
    const session = createSession(null, 1);
    const classId = createClassification(session.id, 'plastic');

    const points = awardPoints(null, classId, 'plastic');
    expect(points).toBe(0);
  });

  test('records point movement in database', () => {
    const customerId = createCustomer();
    const session = createSession(customerId, 0);
    const classId = createClassification(session.id, 'paper');

    awardPoints(customerId, classId, 'paper');

    const movement = mockDb
      .prepare('SELECT * FROM point_movements WHERE customer_id = ? AND classification_id = ?')
      .get(customerId, classId);

    expect(movement).toBeDefined();
    expect(movement.points).toBe(8);
  });

  test('updates customer total_points after awarding', () => {
    const customerId = createCustomer();
    const session = createSession(customerId, 0);

    const classId1 = createClassification(session.id, 'plastic');
    const classId2 = createClassification(session.id, 'metal');

    awardPoints(customerId, classId1, 'plastic'); // 10
    awardPoints(customerId, classId2, 'metal');   // 20

    const customer = mockDb.prepare('SELECT total_points FROM customers WHERE id = ?').get(customerId);
    expect(customer.total_points).toBe(30);
  });

  test('getPointsForWasteType returns correct values', () => {
    expect(getPointsForWasteType('plastic')).toBe(10);
    expect(getPointsForWasteType('glass')).toBe(15);
    expect(getPointsForWasteType('paper')).toBe(8);
    expect(getPointsForWasteType('metal')).toBe(20);
    expect(getPointsForWasteType('organic')).toBe(5);
    expect(getPointsForWasteType('unknown')).toBe(0);
  });

  test('does not award points for unknown waste type', () => {
    const customerId = createCustomer();
    const session = createSession(customerId, 0);
    const classId = createClassification(session.id, 'unknown');

    const points = awardPoints(customerId, classId, 'unknown');
    expect(points).toBe(0);
  });
});
