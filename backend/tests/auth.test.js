const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Authentifizierung', () => {
  it('soll mit falschen Zugangsdaten fehlschlagen', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@test.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);

    // Wurde ein login_audit-Eintrag erstellt?
    const audit = await db.query('SELECT * FROM login_audit ORDER BY created_at DESC LIMIT 1');
    expect(audit.rows[0].success).toBe(false);
  });

  it('soll mit korrekten Zugangsdaten erfolgreich einloggen', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');

    // Wurde ein login_audit-Eintrag erstellt?
    const audit = await db.query('SELECT * FROM login_audit ORDER BY created_at DESC LIMIT 1');
    expect(audit.rows[0].success).toBe(true);
  });
});

// Datenbank-Verbindung nach allen Tests schließen
afterAll(async () => {
  await db.end();
});
