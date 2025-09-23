const request = require('supertest');
const app = require('../app');

describe('Health & DB endpoints', () => {
  it('GET /health should return ok:true', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('GET /db-check should return db_time', async () => {
    const res = await request(app).get('/db-check');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('db_time');
  });
});
const db = require('../db');
afterAll(async () => {
  await db.end();
});

