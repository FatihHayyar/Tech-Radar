
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Vorhandene Daten löschen
TRUNCATE technologies RESTART IDENTITY CASCADE;
TRUNCATE users RESTART IDENTITY CASCADE;
TRUNCATE login_audit RESTART IDENTITY CASCADE;

-- Benutzer-Tabelle
CREATE TABLE IF NOT EXISTS users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz,
  PRIMARY KEY (id),
  CONSTRAINT users_role_check CHECK (role = ANY (ARRAY['CTO'::text, 'TECH_LEAD'::text, 'EMPLOYEE'::text]))
);

-- Login-Audit-Tabelle
CREATE TABLE IF NOT EXISTS login_audit (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  email_snapshot text,
  success boolean NOT NULL DEFAULT false,
  ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Technologien-Tabelle
CREATE TABLE IF NOT EXISTS technologies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  ring text,
  tech_description text NOT NULL,
  rationale text,
  status text NOT NULL DEFAULT 'DRAFT',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  published_at timestamptz,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (id)
);

-- Performance Index für Viewer
CREATE INDEX IF NOT EXISTS idx_technologies_status_category_ring
  ON technologies(status, category, ring);

-- Standard-Benutzer (Passwörter: 111111 für alle)
INSERT INTO users (email, password_hash, role)
VALUES
  ('cto@test.com',    '$2b$10$xRFpKpbfv0uDSoFkm1il6.JySMsAldVe/YRyeZ9R.XcPl.y2/K9Gu', 'CTO'),
  ('techlead@test.com','$2b$10$xRFpKpbfv0uDSoFkm1il6.JySMsAldVe/YRyeZ9R.XcPl.y2/K9Gu', 'TECH_LEAD'),
  ('employe@test.com',  '$2b$10$xRFpKpbfv0uDSoFkm1il6.JySMsAldVe/YRyeZ9R.XcPl.y2/K9Gu', 'EMPLOYEE')
ON CONFLICT (email) DO NOTHING;

-- Beispiel-Technologien (10 PUBLISHED, 10 DRAFT)
INSERT INTO technologies (id, name, category, ring, tech_description, rationale, status, created_at, updated_at, published_at, created_by)
VALUES
-- 10 PUBLISHED
(gen_random_uuid(), 'React', 'Languages & Frameworks', 'Adopt', 'Frontend JavaScript library', 'Sehr etabliert in der Industrie', 'PUBLISHED', NOW(), NOW(), NOW(), (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Angular', 'Languages & Frameworks', 'Trial', 'Frontend Framework von Google', 'Komplex, aber mächtig', 'PUBLISHED', NOW(), NOW(), NOW(), (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Vue.js', 'Languages & Frameworks', 'Assess', 'Progressives JavaScript Framework', 'Noch jung, aber wachsend', 'PUBLISHED', NOW(), NOW(), NOW(), (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Kubernetes', 'Platforms', 'Adopt', 'Container-Orchestrierung', 'Standard für Cloud-Native', 'PUBLISHED', NOW(), NOW(), NOW(), (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Docker', 'Platforms', 'Adopt', 'Containerisierung', 'Weit verbreitet', 'PUBLISHED', NOW(), NOW(), NOW(), (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Terraform', 'Tools', 'Trial', 'Infrastructure as Code', 'Wächst stark im DevOps Bereich', 'PUBLISHED', NOW(), NOW(), NOW(), (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'GitHub Actions', 'Tools', 'Adopt', 'CI/CD Plattform', 'Sehr beliebt für Automatisierung', 'PUBLISHED', NOW(), NOW(), NOW(), (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Jenkins', 'Tools', 'Hold', 'CI Server', 'Wird nach und nach abgelöst', 'PUBLISHED', NOW(), NOW(), NOW(), (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'PostgreSQL', 'Platforms', 'Adopt', 'Relationale Datenbank', 'Stabil, Open-Source', 'PUBLISHED', NOW(), NOW(), NOW(), (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'MongoDB', 'Platforms', 'Trial', 'NoSQL Datenbank', 'Flexibel, aber nicht für alles geeignet', 'PUBLISHED', NOW(), NOW(), NOW(), (SELECT id FROM users WHERE email='cto@test.com')),

-- 10 DRAFT
(gen_random_uuid(), 'ArgoCD', 'Tools', NULL, 'GitOps für Kubernetes', NULL, 'DRAFT', NOW(), NOW(), NULL, (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Grafana', 'Tools', NULL, 'Monitoring Dashboard', NULL, 'DRAFT', NOW(), NOW(), NULL, (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Prometheus', 'Tools', NULL, 'Metrics Monitoring', NULL, 'DRAFT', NOW(), NOW(), NULL, (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Next.js', 'Languages & Frameworks', NULL, 'React Framework', NULL, 'DRAFT', NOW(), NOW(), NULL, (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Svelte', 'Languages & Frameworks', NULL, 'Frontend Framework', NULL, 'DRAFT', NOW(), NOW(), NULL, (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Elixir', 'Languages & Frameworks', NULL, 'Functional Programming Language', NULL, 'DRAFT', NOW(), NOW(), NULL, (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Redis', 'Platforms', NULL, 'In-Memory Database', NULL, 'DRAFT', NOW(), NOW(), NULL, (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'Kafka', 'Platforms', NULL, 'Event Streaming', NULL, 'DRAFT', NOW(), NOW(), NULL, (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'AWS Lambda', 'Platforms', NULL, 'Serverless Computing', NULL, 'DRAFT', NOW(), NOW(), NULL, (SELECT id FROM users WHERE email='cto@test.com')),
(gen_random_uuid(), 'TailwindCSS', 'Techniques', NULL, 'Utility-first CSS Framework', NULL, 'DRAFT', NOW(), NOW(), NULL, (SELECT id FROM users WHERE email='cto@test.com'));
