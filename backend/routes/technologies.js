// routes/technologies.js
// Routen für Verwaltung und Anzeige von Technologien

const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware: Authentifizierung
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Kein Token bereitgestellt' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Ungültiges Token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id + role
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Ungültiges oder abgelaufenes Token' });
  }
}

// 1. Neue Technologie erfassen (Ring + Rationale optional, immer als DRAFT gespeichert)
router.post('/', authenticate, async (req, res) => {
  if (!['CTO', 'TECH_LEAD'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Nur CTO/Tech-Lead dürfen Technologien hinzufügen' });
  }

  const { name, category, ring, description, rationale } = req.body;

  if (!name || !category || !description) {
    return res.status(400).json({
      error: 'Name, Kategorie und Beschreibung sind erforderlich'
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO technologies (name, category, ring, tech_description, rationale, status, created_at, created_by)
       VALUES ($1, $2, $3, $4, $5, 'DRAFT', NOW(), $6)
       RETURNING *`,
      [name, category, ring || null, description, rationale || null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Technologie konnte nicht erstellt werden' });
  }
});

// 2. Alle Technologien (Admin-Bereich)
router.get('/all', authenticate, async (req, res) => {
  if (!['CTO', 'TECH_LEAD'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Nur CTO/Tech-Lead dürfen alle Technologien sehen' });
  }

  try {
    const result = await db.query(
      `SELECT t.*, u.email AS created_by_email
       FROM technologies t
       LEFT JOIN users u ON u.id = t.created_by
       ORDER BY t.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Alle Technologien konnten nicht geladen werden' });
  }
});

// 3. Alle veröffentlichten Technologien (Viewer)
router.get('/', async (_, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM technologies WHERE status = 'PUBLISHED' ORDER BY category, ring"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Veröffentlichte Technologien konnten nicht geladen werden' });
  }
});

// 4. Technologie publizieren
router.put('/:id/publish', authenticate, async (req, res) => {
  if (!['CTO', 'TECH_LEAD'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Nur CTO/Tech-Lead dürfen Technologien publizieren' });
  }

  const { id } = req.params;
  const { ring, rationale } = req.body;

  if (!ring || !rationale) {
    return res.status(400).json({ error: 'Ring und Begründung sind erforderlich' });
  }

  try {
    const result = await db.query(
      `UPDATE technologies
       SET ring = $1,
           rationale = $2,
           status = 'PUBLISHED',
           published_at = NOW(),
           updated_at = NOW()
       WHERE id = $3
         AND status = 'DRAFT'
       RETURNING *`,
      [ring, rationale, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entwurf nicht gefunden oder bereits publiziert' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Technologie konnte nicht publiziert werden' });
  }
});

// 5. Technologie ändern
router.put('/:id', authenticate, async (req, res) => {
  if (!['CTO', 'TECH_LEAD'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Nur CTO/Tech-Lead dürfen Technologien ändern' });
  }

  const { id } = req.params;
  const { name, category, description } = req.body;

  if (!name || !category || !description) {
    return res.status(400).json({ error: 'Name, Kategorie und Beschreibung sind erforderlich' });
  }

  try {
    const result = await db.query(
      `UPDATE technologies
       SET name = $1,
           category = $2,
           tech_description = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [name, category, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Technologie nicht gefunden' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Technologie konnte nicht geändert werden' });
  }
});

// 6. Technologie-Einordnung ändern (Ring / Begründung)
router.put('/:id/reclassify', authenticate, async (req, res) => {
  if (!['CTO', 'TECH_LEAD'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Nur CTO/Tech-Lead dürfen die Einordnung ändern' });
  }

  const { id } = req.params;
  const { ring, rationale } = req.body;

  if (!ring || !rationale) {
    return res.status(400).json({ error: 'Ring und Begründung sind erforderlich' });
  }

  try {
    const result = await db.query(
      `UPDATE technologies
       SET ring = $1,
           rationale = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [ring, rationale, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Technologie nicht gefunden' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Technologie konnte nicht neu eingestuft werden' });
  }
});

module.exports = router;
