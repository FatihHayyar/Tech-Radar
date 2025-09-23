-- backend/db/seed.sql
-- Seed + minimales Schema für das Tech-Radar
-- Hinweis: Dieses Script kann mehrfach ausgeführt werden (ON CONFLICT DO NOTHING).
-- Falls die bestehenden Daten komplett gelöscht werden sollen, die TRUNCATE-Zeilen aktivieren.

-- 1) Erweiterung für UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ********** (Optional) Sauberer Start: Tabellen leeren
TRUNCATE technologies RESTART IDENTITY CASCADE;
TRUNCATE users RESTART IDENTITY CASCADE;
TRUNCATE login_audit RESTART IDENTITY CASCADE;

-- 2) users Tabelle (falls nicht vorhanden)
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

-- 3) login_audit Tabelle (für Logins)
CREATE TABLE IF NOT EXISTS login_audit (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  email_snapshot text,
  success boolean NOT NULL DEFAULT false,
  ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4) technologies Tabelle (vereinfacht; kann erweitert werden)
CREATE TABLE IF NOT EXISTS technologies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  ring text,
  tech_description text NOT NULL,
  rationale text,
  status text NOT NULL DEFAULT 'DRAFT', -- DRAFT | PUBLISHED
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  published_at timestamptz,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (id)
);

-- 5) Standard-Benutzer (für erste Anmeldung)
-- Passwörter im Klartext: CTO -> 111111, TECH_LEAD -> test123, EMPLOYEE -> test123
-- (Hashes wurden mit bcrypt erzeugt)

INSERT INTO users (email, password_hash, role)
VALUES
  ('cto@test.com',    '$2b$10$xRFpKpbfv0uDSoFkm1il6.JySMsAldVe/YRyeZ9R.XcPl.y2/K9Gu', 'CTO')         -- Passwort: 111111
ON CONFLICT (email) DO NOTHING;

-- (Optional) Beispiel-Technologie einfügen (Kommentar entfernen falls benötigt)
-- INSERT INTO technologies (name, category, ring, tech_description, rationale, status, created_by, created_at)
-- VALUES ('ArgoCD', 'Tools', 'Trial', 'Argo CD Beschreibung...', 'Empfohlen für GitOps', 'PUBLISHED', (SELECT id FROM users WHERE email='cto@test.com' LIMIT 1), NOW())
-- ON CONFLICT (name) DO NOTHING;
