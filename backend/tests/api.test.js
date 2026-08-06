process.env.DB_PATH = ':memory:';
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../src/index');

// Create a minimal test image
const TEST_IMAGE_PATH = path.join(__dirname, 'test_plastic_bottle.jpg');

beforeAll(() => {
  // Create a minimal valid JPEG file for testing
  // JPEG magic bytes + minimal data
  const jpegHeader = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46,
    0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
    0x00, 0x01, 0x00, 0x00, 0xff, 0xd9,
  ]);
  fs.writeFileSync(TEST_IMAGE_PATH, jpegHeader);
});

afterAll(() => {
  if (fs.existsSync(TEST_IMAGE_PATH)) fs.unlinkSync(TEST_IMAGE_PATH);
});

describe('API Routes', () => {
  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('POST /api/classify without image returns 400', async () => {
    const res = await request(app).post('/api/classify');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  test('POST /api/classify with image returns classification', async () => {
    const res = await request(app)
      .post('/api/classify')
      .attach('image', TEST_IMAGE_PATH, 'plastic_bottle.jpg');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.wasteType).toBeTruthy();
    expect(res.body.data.containerLabel).toBeTruthy();
    expect(res.body.data.containerColor).toBeTruthy();
  });

  test('POST /api/classify with customer awards points', async () => {
    const res = await request(app)
      .post('/api/classify')
      .field('customerId', 'cust-001')
      .attach('image', TEST_IMAGE_PATH, 'plastic_bottle.jpg');
    expect(res.status).toBe(200);
    expect(res.body.data.pointsAwarded).toBeGreaterThan(0);
    expect(res.body.data.customer).toBeTruthy();
  });

  test('GET /api/customers/qr/:qrCode returns customer', async () => {
    const res = await request(app).get('/api/customers/qr/QR-ANA-001');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Ana García');
  });

  test('GET /api/customers/qr/:qrCode with invalid QR returns 404', async () => {
    const res = await request(app).get('/api/customers/qr/INVALID');
    expect(res.status).toBe(404);
  });

  test('GET /api/customers/:id returns customer', async () => {
    const res = await request(app).get('/api/customers/cust-001');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('cust-001');
  });

  test('GET /api/customers/:id with invalid id returns 404', async () => {
    const res = await request(app).get('/api/customers/nonexistent');
    expect(res.status).toBe(404);
  });

  test('GET /api/customers/:id/history returns array', async () => {
    const res = await request(app).get('/api/customers/cust-001/history');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
