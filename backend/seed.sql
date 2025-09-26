-- seed.sql (Deutsch)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

TRUNCATE technologies RESTART IDENTITY CASCADE;
TRUNCATE users RESTART IDENTITY CASCADE;
TRUNCATE login_audit RESTART IDENTITY CASCADE;

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

CREATE TABLE IF NOT EXISTS login_audit (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  email_snapshot text,
  success boolean NOT NULL DEFAULT false,
  ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);

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

-- Standard-Benutzer (Passwörter: CTO -> 111111, TECH_LEAD -> test123, EMPLOYEE -> test123)
INSERT INTO users (email, password_hash, role)
VALUES
  ('cto@test.com',    '$2b$10$xRFpKpbfv0uDSoFkm1il6.JySMsAldVe/YRyeZ9R.XcPl.y2/K9Gu', 'CTO'),
  ('techlead@test.com','$2b$10$xRFpKpbfv0uDSoFkm1il6.JySMsAldVe/YRyeZ9R.XcPl.y2/K9Gu', 'TECH_LEAD'),
  ('employee@test.com','$2b$10$xRFpKpbfv0uDSoFkm1il6.JySMsAldVe/YRyeZ9R.XcPl.y2/K9Gu', 'EMPLOYEE')
ON CONFLICT (email) DO NOTHING;
