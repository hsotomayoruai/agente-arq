const request = require('supertest');
const Database = require('better-sqlite3');
const { createSchema } = require('../src/database/schema');

// Each test file uses its own in-memory db
// NOTE: jest.mock factory must only reference variables prefixed with 'mock'
let mockDb;

jest.mock('../src/database/db', () => ({
  getDb: () => mockDb,
  closeDb: () => {}
}));

const { createApp } = require('../src/app');

let app;

beforeEach(() => {
  mockDb = new Database(':memory:');
  mockDb.pragma('journal_mode = WAL');
  mockDb.pragma('foreign_keys = ON');
  createSchema(mockDb);
  app = createApp();
});

afterEach(() => {
  mockDb.close();
});

describe('POST /api/sessions', () => {
  test('creates a guest session when no qr_token provided', async () => {
    const res = await request(app).post('/api/sessions').send({});
    expect(res.status).toBe(201);
    expect(res.body.session).toBeDefined();
    expect(res.body.session.is_guest).toBe(1);
    expect(res.body.session.customer_id).toBeNull();
    expect(res.body.session.session_token).toHaveLength(64);
  });

  test('creates identified session when valid qr_token provided', async () => {
    // First create a customer
    const customer = mockDb
      .prepare("INSERT INTO customers (name, email, qr_token) VALUES (?, ?, ?)")
      .run('Ana López', 'ana@example.com', 'valid-qr-token-abc123');

    const res = await request(app)
      .post('/api/sessions')
      .send({ qr_token: 'valid-qr-token-abc123' });

    expect(res.status).toBe(201);
    expect(res.body.session.is_guest).toBe(0);
    expect(res.body.session.customer_id).toBe(customer.lastInsertRowid);
  });

  test('returns 404 when qr_token does not match any customer', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .send({ qr_token: 'nonexistent-token' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('rejects empty qr_token string', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .send({ qr_token: '   ' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/sessions/:token', () => {
  test('retrieves session by token', async () => {
    const createRes = await request(app).post('/api/sessions').send({});
    const token = createRes.body.session.session_token;

    const res = await request(app).get(`/api/sessions/${token}`);
    expect(res.status).toBe(200);
    expect(res.body.session.session_token).toBe(token);
  });

  test('returns 404 for unknown token', async () => {
    const res = await request(app).get('/api/sessions/unknown-token-xyz');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/sessions/:token/summary', () => {
  test('returns session summary with empty classifications', async () => {
    const createRes = await request(app).post('/api/sessions').send({});
    const token = createRes.body.session.session_token;

    const res = await request(app).get(`/api/sessions/${token}/summary`);
    expect(res.status).toBe(200);
    expect(res.body.classifications).toHaveLength(0);
    expect(res.body.totalPoints).toBe(0);
  });

  test('returns 404 for unknown token', async () => {
    const res = await request(app).get('/api/sessions/bad-token/summary');
    expect(res.status).toBe(404);
  });
});
