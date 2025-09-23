const request = require('supertest');
const app = require('../app');

let token;
let techId;

beforeAll(async () => {
  // login as CTO
  const res = await request(app)
    .post('/auth/login')
    .send({ email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD });
  token = res.body.token;
});

describe('Technologies API', () => {
  it('CTO should create new technology (draft)', async () => {
    const res = await request(app)
      .post('/tech')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'ArgoCD',
        category: 'Tools',
        ring: 'Trial',
        description: 'CD tool for Kubernetes',
        rationale: 'Test rationale'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('DRAFT');
    techId = res.body.id;
  });

  it('CTO should publish technology', async () => {
    const res = await request(app)
      .put(`/tech/${techId}/publish`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ring: 'Trial',
        rationale: 'We recommend to test ArgoCD'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('PUBLISHED');
  });

  it('Employees should see only published technologies', async () => {
    const res = await request(app).get('/tech');
    expect(res.statusCode).toBe(200);
    const techNames = res.body.map(t => t.name);
    expect(techNames).toContain('ArgoCD');
  });

  it('CTO should update a technology', async () => {
    const res = await request(app)
      .put(`/tech/${techId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'ArgoCD',
        category: 'Tools',
        ring: 'Trial',
        tech_description: 'Updated description',
        rationale: 'Updated rationale'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.tech_description).toBe('Updated description');
  });
});
const db = require('../db');
afterAll(async () => {
  await db.end();
});

