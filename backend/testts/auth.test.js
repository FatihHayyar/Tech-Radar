const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Auth', () => {
  it('should fail with wrong credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@test.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);

    // login_audit kaydı eklendi mi?
    const audit = await db.query('SELECT * FROM login_audit ORDER BY created_at DESC LIMIT 1');
    expect(audit.rows[0].success).toBe(false);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');

    // login_audit kaydı eklendi mi?
    const audit = await db.query('SELECT * FROM login_audit ORDER BY created_at DESC LIMIT 1');
    expect(audit.rows[0].success).toBe(true);
  });
});

afterAll(async () => {
  await db.end();
});
