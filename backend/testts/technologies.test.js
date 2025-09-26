const request = require('supertest');
const app = require('../app');
const db = require('../db');

let ctoToken;
let employeeToken;
let techId;

beforeAll(async () => {
  // CTO login
  const res = await request(app)
    .post('/auth/login')
    .send({ email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD });
  ctoToken = res.body.token;

  // EMPLOYEE login (probe@test.com)
  const empRes = await request(app)
    .post('/auth/login')
    .send({ email: 'probe@test.com', password: '111111' });
  employeeToken = empRes.body.token;
});

describe('Technologies API', () => {
  it('CTO should create new technology (draft) with ring', async () => {
    const res = await request(app)
      .post('/tech')
      .set('Authorization', `Bearer ${ctoToken}`)
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

  it('CTO should create new technology without ring (still draft)', async () => {
    const res = await request(app)
      .post('/tech')
      .set('Authorization', `Bearer ${ctoToken}`)
      .send({
        name: 'DraftTech',
        category: 'Languages & Frameworks',
        description: 'A draft technology without ring'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('DRAFT');
    expect(res.body.ring).toBeNull();
  });

  it('EMPLOYEE cannot create new technology', async () => {
    const res = await request(app)
      .post('/tech')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        name: 'ForbiddenTech',
        category: 'Tools',
        description: 'Should fail'
      });
    expect(res.statusCode).toBe(403);
  });

  it('CTO should publish technology', async () => {
    const res = await request(app)
      .put(`/tech/${techId}/publish`)
      .set('Authorization', `Bearer ${ctoToken}`)
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
    expect(techNames).not.toContain('DraftTech');
  });

  it('CTO should update a technology', async () => {
    const res = await request(app)
      .put(`/tech/${techId}`)
      .set('Authorization', `Bearer ${ctoToken}`)
      .send({
        name: 'ArgoCD',
        category: 'Tools',
        description: 'Updated description'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.tech_description).toBe('Updated description');
  });

  it('CTO should reclassify a technology', async () => {
    const res = await request(app)
      .put(`/tech/${techId}/reclassify`)
      .set('Authorization', `Bearer ${ctoToken}`)
      .send({
        ring: 'Adopt',
        rationale: 'Proven in production'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.ring).toBe('Adopt');
  });
});

afterAll(async () => {
  await db.end();
});
