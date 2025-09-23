const request = require('supertest');
const app = require('../app');

describe('Auth', () => {
  it('should fail with wrong credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@test.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });

  // Bu testin çalışması için DB’de test user olmalı
  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
const db = require('../db');
afterAll(async () => {
  await db.end();
});

