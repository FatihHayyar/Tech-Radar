# Technologie-Radar

Dieses Repository enthält die Umsetzung des Projekts **Technologie-Radar** im Modul _Web Programming Lab_.

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
- **Frontend:** React-Viewer (tabellarische Anzeige)
- **Dokumentation:** arc42 (Architekturdokumentation)

---

## Abgrenzungen

- Kein Multi-Tenant-Setup (System-Administration wird nicht umgesetzt).
- Frontend wird zunächst tabellarisch umgesetzt, kein grafisches Radar.
- Fokus liegt auf Backend-Funktionalität und Datenbank-Anbindung.

---

## Installation & Setup

1. Repository klonen

```bash
git clone https://github.com/FatihHayyar/Tech-Radar.git
cd Tech-Radar

2. Environment konfigurieren
Im Verzeichnis backend/ eine .env Datei erstellen:
PORT=4000
JWT_SECRET=supersecret_dev
DATABASE_URL=postgres://postgres:password@localhost:5432/techradar

3. Datenbank einrichten
Datenbank erstellen:
createdb techradar
Seed und Schema importieren:
psql -U postgres -d techradar -f backend/db/seed.sql

4. Standard-Accounts
Nach dem Seed sind folgende Benutzer verfügbar:
CTO → cto@test.com / Passwort: 111111
Nachher kann CTO andere Benutzer einfügen

5.Backend starten
cd backend
npm install
npm run dev   # Entwicklung (nodemon)
# oder
node server.js
API läuft unter http://localhost:4000.
Wichtige Endpoints:
POST /auth/login — Login mit Email/Passwort
POST /users — neuen Benutzer anlegen (nur CTO/Tech-Lead)
GET /tech — publizierte Technologien (Viewer)
POST /tech — neue Technologie (DRAFT)
PUT /tech/:id/publish — Technologie veröffentlichen

6.Frontend starten
cd frontend
npm install
npm start
Routen:
/ → Login
/admin → Admin-Oberfläche (nur CTO/Tech-Lead)
/tech → Viewer (nur PUBLISHED sichtbar)

7.Tests
Im backend/:
npm test
Die Tests prüfen u.a. Login, Technologie-Endpoints und Rollentrennung.

Offene Punkte
Responsive Design für Viewer verbessern
Performance-Test (Viewer unter 1s Ladezeit mit 4G)
arc42 Architekturdokumentation ergänzen
Reflexion / Arbeitsjournal erstellen
```
Hinweis
Dieses Projekt ist für Lehr- und Demonstrationszwecke. Die Standard-Accounts dienen nur zur lokalen Entwicklung und Abnahme.
