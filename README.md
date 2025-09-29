# Technologie-Radar

Dieses Repository enthält die Umsetzung des Projekts _Technologie-Radar_ im Modul **Web Programming Lab**.

---

## Kontext

Der Technologie-Radar ist ein Werkzeug für das Technologie-Management in einem Unternehmen.  
Technologien werden in vier Kategorien (Quadranten) eingeteilt:

- **Techniques**
- **Tools**
- **Platforms**
- **Languages & Frameworks**

Zusätzlich werden sie nach ihrer Reife (Ringen) klassifiziert:

- **Assess**
- **Trial**
- **Adopt**
- **Hold**

Das Projekt bildet zwei Hauptteile ab:

- **Administration:** CTO/Tech-Lead kann neue Technologien erfassen, ändern und publizieren.
- **Viewer:** Mitarbeitende können publizierte Technologien strukturiert einsehen.

---

## Fachliche Anforderungen (User Stories, MoSCoW-Priorisierung)

**Must**

- User Story 2: Technologie erfassen
- User Story 6: Technologien anzeigen

**Should**

- User Story 3: Technologie publizieren
- User Story 4: Technologie ändern
- User Story 5: Technologie-Einordnung ändern

**Could**

- User Story 1: Anmelden in der Administration
- User Story 7: Anmelden im Viewer

---

## Technologie-Stack

- **Backend:** Node.js + Express
- **Datenbank:** PostgreSQL
- **Authentifizierung:** JWT (JSON Web Tokens)
- **Passwort-Hashing:** bcrypt
- **Frontend:** React (tabellarische Anzeige, TailwindCSS)
- **Dokumentation:** arc42 (Architekturdokumentation)
- **Tests:** Vitest (Unit), Cypress (Integration/E2E)

---

## Abgrenzungen

- Kein Multi-Tenant-Setup (System-Administration wird nicht umgesetzt).
- Frontend wird zunächst tabellarisch umgesetzt, kein grafisches Radar.
- Fokus liegt auf Backend-Funktionalität und Datenbank-Anbindung.

---

## Installation & Setup

### 1. Repository klonen

git clone https://github.com/FatihHayyar/Tech-Radar.git

cd Tech-Radar

### 2. Environment konfigurieren

Im Verzeichnis backend/ eine .env Datei erstellen:

PORT=4000

JWT_SECRET=supersecret_dev

DATABASE_URL=postgres://postgres:<yourpassword>@localhost:5432/techradar

Im Verzeichnis frontend/ eine .env Datei erstellen:

VITE_API_URL=http://localhost:4000

### 3. Datenbank einrichten (PostgreSQL)

psql -U postgres -c "CREATE DATABASE techradar;"

psql -U postgres -d techradar -f backend/seed.sql

⚠️ Hinweis: Falls bereits eine Datenbank mit dem Namen `techradar` existiert,

> bitte zuerst löschen oder einen anderen Namen wählen.

Löschen: psql -U postgres -c "DROP DATABASE techradar;"

Oder neuen Namen verwenden: psql -U postgres -c "CREATE DATABASE techradar_demo;"

### 4. Standard-Accounts

Nach dem Seed sind folgende Benutzer verfügbar:

**CTO →** `cto@test.com` / Passwort: `111111`  
**Tech-Lead →** `techlead@test.com` / Passwort: `111111`  
**Mitarbeiter →** `user@test.com` / Passwort: `111111`

### 5. Backend starten

cd backend

npm install

npm run dev # Entwicklung (nodemon)
oder
node server.js
API läuft unter http://localhost:4000.

Wichtige Endpoints:

POST /auth/login — Login mit Email/Passwort

POST /users — neuen Benutzer anlegen (nur CTO/Tech-Lead)

GET /tech — publizierte Technologien (Viewer)

POST /tech — neue Technologie (DRAFT)

PUT /tech/:id/publish — Technologie veröffentlichen

### 6. Frontend starten

cd frontend

npm install

npm start

Routen:

/ → Login

/admin → Admin-Oberfläche (nur CTO/Tech-Lead)

/tech → Viewer (nur PUBLISHED sichtbar)

### 7. Tests

Backend

cd backend

npm test

Die Tests prüfen u.a. Login, Technologie-Endpoints und Rollentrennung.

Frontend
Unit-Tests (Vitest/RTL):

cd frontend
npm test

Integration-/E2E-Tests (Cypress):

cd frontend
npx cypress open

### 8. Qualitätsanforderungen

Der Technologie-Radar-Viewer ist responsive (Desktop, Tablet, Mobile).
Der Viewer lädt bei einer 4G-Verbindung innerhalb von 1s (gemessen mit Lighthouse).

## Performance Tests

- ✅ Backend Load Test: Passed (20 req/s, avg ~58 ms, 0 errors)
- ✅ Lighthouse (Mobile / 4G)
  - First Contentful Paint (FCP): 0.4s
  - Largest Contentful Paint (LCP): 0.5s
  - Total Blocking Time (TBT): 110ms
  - Cumulative Layout Shift (CLS): 0
  - Performance Score: 99/100
  - Accessibility: 100/100
  - Best Practices: 96/100
  - SEO: 82/100

📊 [👉 Full Lighthouse Report](./lighthouse-report.html)
Sämtliche Anmeldungen werden im Backend protokolliert.
Funktionalitäten sind durch automatisierte Unit- und Integrationstests abgedeckt.

### 9. Dokumentation

- [arc42 Architekturdokumentation](docs/arc42.md)
- [Arbeitsjournal](docs/arbeitsjournal.md)
- [Fazit & Reflexion](docs/reflexion.md)

Hinweis
Dieses Projekt ist für Lehr- und Demonstrationszwecke.
Die Standard-Accounts dienen nur zur lokalen Entwicklung und Abnahme.
