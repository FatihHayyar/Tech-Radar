const request = require('supertest');
const app = require('../app');
const db = require('../db');

let token;

beforeAll(async () => {
  // CTO ile login
  const res = await request(app)
    .post('/auth/login')
    .send({ email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD });
  token = res.body.token;

  // test user cleanup (önceki run’lardan kalan varsa)
  await db.query("DELETE FROM users WHERE email = 'employee2@test.com'");
});

afterAll(async () => {
  await db.end();
});

describe('Users API', () => {
  it('CTO should create new EMPLOYEE user', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'employee2@test.com',   // ✅ aynı email her iki testte
        password: 'test123',
        role: 'EMPLOYEE'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.role).toBe('EMPLOYEE');
  });

  it('User should change own password', async () => {
    // önce employee2 login yap
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'employee2@test.com', password: 'test123' });

    expect(loginRes.statusCode).toBe(200);
    const empToken = loginRes.body.token;

    const res = await request(app)
      .put('/users/me/password')
      .set('Authorization', `Bearer ${empToken}`)
      .send({
        oldPassword: 'test123',
        newPassword: 'newpass123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('erfolgreich');
  });
});
