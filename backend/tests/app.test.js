const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Health- & DB-Endpunkte', () => {
  it('GET /health sollte ok:true zurückgeben', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('GET /db-check sollte db_time zurückgeben', async () => {
    const res = await request(app).get('/db-check');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('db_time');
  });
});

// Datenbank-Verbindung nach allen Tests schließen
afterAll(async () => {
  await db.end();
});
