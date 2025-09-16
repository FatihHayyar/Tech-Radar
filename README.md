# Technologie-Radar

Dieses Repository enthält die Umsetzung des Projekts **Technologie-Radar** im Modul _Web Programming Lab_.

## Kontext

Der Technologie-Radar ist ein Werkzeug für das Technologie-Management in einem Unternehmen.
Technologien werden in **vier Kategorien (Quadranten)** eingeteilt (_Techniques, Tools, Platforms, Languages & Frameworks_)
und nach ihrer **Reife (Ringen)** klassifiziert (_Assess, Trial, Adopt, Hold_).

Das Projekt bildet zwei Hauptteile ab:

- **Administration**: CTO/Tech-Lead kann neue Technologien erfassen, ändern und publizieren.
- **Viewer**: Mitarbeitende können publizierte Technologien strukturiert einsehen.

## Fachliche Anforderungen (User Stories, MoSCoW-Priorisierung)

- **Must**
  - User Story 2: Technologie erfassen
  - User Story 6: Technologien anzeigen
- **Should**
  - User Story 3: Technologie publizieren
  - User Story 4: Technologie ändern
  - User Story 5: Technologie-Einordnung ändern
- **Could**
  - User Story 1: Anmelden in der Administration
  - User Story 7: Anmelden im Viewer

## Angedachter Technologie-Stack

- **Backend**: Node.js + Express
- **Datenbank**: PostgreSQL
- **Authentifizierung**: JWT (JSON Web Tokens)
- **Passwort-Hashing**: bcrypt
- **Frontend**: später mit einfachem HTML/JS-Viewer (Tabellenanzeige)
- **Dokumentation**: arc42 (Architekturdokumentation)

## Abgrenzungen

- Kein Multi-Tenant-Setup (System-Administration wird nicht umgesetzt).
- Frontend wird **zunächst tabellarisch** umgesetzt, kein grafisches Radar.
- Fokus liegt auf Backend-Funktionalität und Datenbank-Anbindung.

## Installation

1. Repository klonen:
   ```bash
   git clone https://github.com/FatihHayyar/Tech-Radar.git
   cd Tech-Radar/backend
   ```
   > Hinweis: Aktuell ist nur das Backend implementiert.
   > Das Frontend (Viewer) folgt in den nächsten Schritten.
