# arc42 Architekturdokumentation – Technologie-Radar

---

## 1. Einführung und Ziele
Der Technologie-Radar ist ein Werkzeug für das Technologie-Management in einem Unternehmen.  
Ziel ist es, eine einfache und klare Lösung bereitzustellen, um Technologien zu verwalten und Mitarbeitenden strukturiert zugänglich zu machen.

Hauptziele:
- CTO/Tech-Lead kann neue Technologien erfassen, ändern und publizieren.
- Mitarbeitende können publizierte Technologien im Viewer einsehen.
- Schnelle Ladezeiten (< 1s bei 4G).
- Einfache, aber funktionale Authentifizierung.

---

## 2. Randbedingungen
- Umsetzung im Rahmen des Moduls *Web Programming Lab* (Einzelarbeit, ca. 60h).
- Keine Multi-Tenant-Architektur.
- Darstellung in Tabellenform, kein grafisches Radar.
- Einfaches Login (nur CTO/Tech-Lead).
- Lokales Deployment ausreichend.

Technologie-Stack:
- **Frontend:** React + TailwindCSS
- **Backend:** Node.js (Express)
- **Datenbank:** PostgreSQL
- **Auth:** JWT
- **Tests:** Vitest & Cypress

---

## 3. Kontextabgrenzung
**Akteure:**
- **CTO/Tech-Lead** → Verwaltung über Admin-Oberfläche.
- **Mitarbeitende** → Zugriff auf Viewer mit publizierten Technologien.

**Systemumgebung:**
- Datenbank PostgreSQL (lokal).
- REST-API (Node.js/Express).
- Frontend (React, Single Page Application).

---

## 4. Lösungsstrategie
- **Architektur:** Client-Server mit klarer Trennung von Frontend, Backend und Datenbank.
- **Authentifizierung:** JWT-basierte Sessionverwaltung.
- **Technologie-Verwaltung:** Speicherung in PostgreSQL, Zugriff über REST-Endpunkte.
- **Frontend:** React SPA, responsive Design für Desktop und Mobile.
- **Tests:** Unit-Tests (Vitest), Integration-Tests (Cypress).
- **Performance:** Optimierung des Bundles (Vite Build, Code-Splitting, Lighthouse-Test).

---

## 5. Bausteinsicht
### Backend-Komponenten
- **AuthController** → Login, JWT-Erstellung.
- **UserController** → Benutzerverwaltung (nur CTO).
- **TechController** → CRUD für Technologien, Publizieren.
- **Database** → PostgreSQL-Anbindung über `pg`.

### Frontend-Komponenten
- **LoginPage** → Login-Maske.
- **AdminPage** → Übersicht, neue Technologie erfassen.
- **TechAdd** → Formular zur Erfassung.
- **TechList** → Anzeige der publizierten Technologien.
- **AppRouter** → Routing zwischen `/`, `/admin`, `/tech`.

---

## 6. Laufzeitsicht
### Login Flow
1. Nutzer gibt E-Mail und Passwort ein.
2. Backend prüft Zugangsdaten, generiert JWT.
3. Token wird im LocalStorage gespeichert.
4. Frontend leitet auf `/admin` weiter.

### Technologie-Erfassung
1. CTO erfasst Technologie in AdminPage.
2. Backend speichert Draft in DB.
3. Technologie erscheint in Entwürfen.
4. Mit „Publizieren“ wird sie freigegeben.
5. Viewer zeigt publizierte Technologie in der Liste.

---

## 7. Verteilungssicht
- **Frontend:** React-Anwendung (Vite-Build, läuft lokal oder auf einfachem Webserver).
- **Backend:** Node.js/Express-Server auf Port 4000.
- **Datenbank:** PostgreSQL lokal.

---

## 8. Querschnittliche Konzepte
- **Sicherheit:** Passwort-Hashing (bcrypt), JWT-Auth.
- **Performance:** Bundle-Minimierung, Code-Splitting, Lighthouse-Test.
- **Responsivität:** TailwindCSS, Mobile-First Layout.
- **Logging:** Alle Logins werden protokolliert.
- **Tests:** Unit- & Integration-Tests automatisiert.

---

## 9. Architekturentscheidungen
- **React statt Angular:** Bessere Integration mit Vite, modernere SPA-Entwicklung.
- **PostgreSQL statt NoSQL:** Relationale Speicherung, klare Struktur.
- **JWT statt Session-Cookies:** Standard bei SPAs, einfache Integration.
- **Tabellen statt Radar-Chart:** Reduzierte Komplexität, Fokus auf Kernfunktionalität.

---

## 10. Qualitätsanforderungen
- Responsive Design (Desktop, Tablet, Mobile).
- Ladezeit < 1 Sekunde bei 4G (Chrome Network-Throttling: Fast 4G).
- Alle Logins werden aufgezeichnet.
- Unit- & Integration-Tests decken die Hauptfunktionalitäten ab.

---

## 11. Risiken und technische Schulden
- Kein grafisches Radar (nur Tabelle).
- Kein Multi-Tenant-Support.
- Keine umfangreiche Rechteverwaltung.
- Performance abhängig von Browser-Cache und Netzwerk.

---

## 12. Glossar
- **CTO:** Chief Technology Officer.
- **Viewer:** Oberfläche für Mitarbeitende.
- **JWT:** JSON Web Token, Standard für Authentifizierung.
- **Draft:** Entwurf einer Technologie vor der Publikation.
- **Publish:** Veröffentlichung einer Technologie, sichtbar für Mitarbeitende.

---

## Anhang: Technische Details
### API-Routen
- **POST /auth/login** → Login mit E-Mail/Passwort.
- **POST /users** → neuen Benutzer anlegen (nur CTO).
- **GET /tech** → publizierte Technologien abrufen.
- **POST /tech** → neue Technologie als Draft erfassen.
- **PUT /tech/:id/publish** → Technologie veröffentlichen.
- **PUT /tech/:id** → Technologie ändern.

### Datenbankschema (vereinfacht)
**Tabelle `users`:**
- `id` (UUID, PK)
- `email` (unique)
- `password_hash`
- `role` (CTO, TECHLEAD)
- `last_login_at`

**Tabelle `tech`:**
- `id` (UUID, PK)
- `name`
- `category` (Techniques, Tools, Platforms, Languages & Frameworks)
- `ring` (Assess, Trial, Adopt, Hold)
- `description`
- `classification_description`
- `created_at`
- `updated_at`
- `published_at` (nullable)
