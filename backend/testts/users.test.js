const request = require('supertest');
const app = require('../app');
const db = require('../db');

let ctoToken;
let empToken;

beforeAll(async () => {
  // cleanup önce
  await db.query("DELETE FROM users WHERE email = 'employee2@test.com'");

  // CTO login
  const res = await request(app)
    .post('/auth/login')
    .send({ email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD });
  ctoToken = res.body.token;

  // Employee (probe@test.com) login
  const empRes = await request(app)
    .post('/auth/login')
    .send({ email: 'probe@test.com', password: '111111' });
  empToken = empRes.body.token;
});

afterAll(async () => {
  await db.end();
});

describe('Users API', () => {
  it('CTO should create new EMPLOYEE user', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${ctoToken}`)
      .send({
        email: 'employee2@test.com',
        password: 'test123',
        role: 'EMPLOYEE'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.role).toBe('EMPLOYEE');
  });

  it('EMPLOYEE cannot create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${empToken}`)
      .send({
        email: 'illegal@test.com',
        password: 'test123',
        role: 'EMPLOYEE'
      });
    expect(res.statusCode).toBe(403);
  });
});
