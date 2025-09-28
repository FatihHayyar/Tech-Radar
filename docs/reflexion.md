# Fazit & Reflexion – Technologie-Radar

## Was ist gut gelaufen?
- Das Projekt konnte vollständig umgesetzt werden: Backend (Express + PostgreSQL), Frontend (React), Authentifizierung (JWT) sowie die Kernfunktionalitäten (Technologien erfassen, publizieren, anzeigen).
- Die Backend-Entwicklung lief vergleichsweise reibungslos, insbesondere die Datenbankanbindung und die grundlegenden Endpunkte konnten zügig implementiert werden.
- Durch die Tests (Vitest, Cypress) konnte die Funktionalität automatisiert überprüft und Fehler frühzeitig gefunden werden.
- Die Dokumentation (arc42) und die Projektorganisation (Arbeitsjournal, README) haben geholfen, einen klaren Überblick zu behalten.

## Herausforderungen
- **User Stories im Frontend umsetzen:** Die Abbildung der Anforderungen (z.B. Draft-/Publish-Logik, Validierungen, Rollenrechte) im React-Frontend war deutlich aufwändiger als erwartet. Es brauchte mehrere Iterationen, bis die Logik korrekt funktionierte.
- **Responsive Design:** Die Anpassung für Mobile/Tablet-Ansichten war zeitintensiv. Besonders die Tabellenansicht im Viewer machte Schwierigkeiten, da Inhalte auch auf kleinen Bildschirmen sinnvoll dargestellt werden mussten.
- **Performance:** Den Viewer so zu optimieren, dass er unter realistischen Bedingungen (4G, Fast Network Throttling) innerhalb von <1s lädt, war eine große technische Herausforderung. Es mussten Bundles verkleinert, unnötige Abhängigkeiten entfernt und ein Lighthouse-Test erfolgreich bestanden werden.
- **Zusammenarbeit mit dem Build-Tool (Vite):** Mehrfach kam es zu Problemen beim Deployment und bei den Proxy-Einstellungen im Produktionsmodus. Erst durch Debugging und Anpassungen im `vite.config.js` konnte dies stabil gelöst werden.

## Was würde ich nächstes Mal anders machen?
- **Frühzeitiger Fokus auf das Frontend:** Beim nächsten Projekt würde ich früher mit der Umsetzung und den Tests der User Stories im Frontend beginnen. Dadurch könnten Probleme (z.B. mit Routing oder Zustandshandling) früher sichtbar werden.
- **Bessere Zeitplanung für das Responsive Design:** Ich habe den Aufwand für Mobile/Tablet-Anpassungen unterschätzt. Nächstes Mal würde ich das von Anfang an als festen Bestandteil der Entwicklung einplanen.
- **Performance von Anfang an mitdenken:** Statt erst am Ende mit Lighthouse und Bundle-Optimierung zu beginnen, wäre es besser gewesen, die Performance bereits während der Entwicklung regelmäßig zu prüfen.
- **Feature-Flags oder Staging-Umgebung nutzen:** Damit neue Funktionen (z.B. Publishing-Flow) unabhängig vom restlichen System getestet werden können, bevor sie in die Hauptversion integriert werden.

---

## Persönliches Fazit
Das Projekt war herausfordernd, aber auch sehr lehrreich. Besonders die Kombination aus Backend, Datenbank, Frontend und automatisierten Tests hat gezeigt, wie wichtig eine saubere Architektur und iterative Entwicklung sind.  
Trotz der Schwierigkeiten bei der Umsetzung der User Stories im Frontend, dem Responsive Design und den Performance-Anforderungen konnte am Ende ein funktionsfähiger Technologie-Radar fertiggestellt werden.  
