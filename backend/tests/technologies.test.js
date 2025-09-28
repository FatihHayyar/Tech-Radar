const request = require('supertest');
const app = require('../app');
const db = require('../db');

let ctoToken;
let employeeToken;
let techId;

beforeAll(async () => {
  // CTO-Login
  const res = await request(app)
    .post('/auth/login')
    .send({ email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD });
  ctoToken = res.body.token;

  // Mitarbeiter-Login (employe@test.com)
  const empRes = await request(app)
    .post('/auth/login')
    .send({ email: 'employe@test.com', password: '111111' });
  employeeToken = empRes.body.token;
});

describe('Technologien-API', () => {
  it('CTO soll neue Technologie (Entwurf) mit Ring erstellen können', async () => {
    const res = await request(app)
      .post('/tech')
      .set('Authorization', `Bearer ${ctoToken}`)
      .send({
        name: 'ArgoCD',
        category: 'Tools',
        ring: 'Trial',
        description: 'CD-Tool für Kubernetes',
        rationale: 'Test-Rationale'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('DRAFT');
    techId = res.body.id;
  });

  it('CTO soll neue Technologie ohne Ring erstellen können (immer Entwurf)', async () => {
    const res = await request(app)
      .post('/tech')
      .set('Authorization', `Bearer ${ctoToken}`)
      .send({
        name: 'DraftTech',
        category: 'Languages & Frameworks',
        description: 'Eine Entwurfs-Technologie ohne Ring'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('DRAFT');
    expect(res.body.ring).toBeNull();
  });

  it('Mitarbeiter darf keine neue Technologie erstellen', async () => {
    const res = await request(app)
      .post('/tech')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        name: 'ForbiddenTech',
        category: 'Tools',
        description: 'Sollte fehlschlagen'
      });
    expect(res.statusCode).toBe(403);
  });

  it('CTO soll eine Technologie publizieren können', async () => {
    const res = await request(app)
      .put(`/tech/${techId}/publish`)
      .set('Authorization', `Bearer ${ctoToken}`)
      .send({
        ring: 'Trial',
        rationale: 'Wir empfehlen, ArgoCD zu testen'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('PUBLISHED');
  });

  it('Mitarbeiter sollen nur veröffentlichte Technologien sehen', async () => {
    const res = await request(app).get('/tech');
    expect(res.statusCode).toBe(200);
    const techNames = res.body.map(t => t.name);
    expect(techNames).toContain('ArgoCD');
    expect(techNames).not.toContain('DraftTech');
  });

  it('CTO soll eine Technologie aktualisieren können', async () => {
    const res = await request(app)
      .put(`/tech/${techId}`)
      .set('Authorization', `Bearer ${ctoToken}`)
      .send({
        name: 'ArgoCD',
        category: 'Tools',
        description: 'Aktualisierte Beschreibung'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.tech_description).toBe('Aktualisierte Beschreibung');
  });

  it('CTO soll eine Technologie neu klassifizieren können', async () => {
    const res = await request(app)
      .put(`/tech/${techId}/reclassify`)
      .set('Authorization', `Bearer ${ctoToken}`)
      .send({
        ring: 'Adopt',
        rationale: 'In Produktion bewährt'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.ring).toBe('Adopt');
  });
});

// DB-Verbindung nach allen Tests schließen
afterAll(async () => {
  await db.end();
});
