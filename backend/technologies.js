// technologies.js
const express = require('express');
const db = require('./db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware: Auth check
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id + role
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// 👉 1. Neue Technologie erfassen (ring artık opsiyonel)
router.post('/', authenticate, async (req, res) => {
  if (!['CTO', 'TECH_LEAD'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only CTO/Tech-Lead can add technologies' });
  }

  const { name, category, ring, description, rationale } = req.body;

  if (!name || !category || !description) {
    return res.status(400).json({ error: 'Name, category and description are required' });
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
    res.status(500).json({ error: 'Technology could not be created' });
  }
});

// 👉 Admin: Tüm teknolojileri getir (auth gerekli)
router.get('/all', authenticate, async (req, res) => {
  if (!['CTO', 'TECH_LEAD'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only CTO/Tech-Lead can see all technologies' });
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
    res.status(500).json({ error: 'Could not fetch all technologies' });
  }
});

// 👉 2. Alle veröffentlichten Technologien auflisten
router.get('/', async (_, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM technologies WHERE status = 'PUBLISHED' ORDER BY category, ring"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch technologies' });
  }
});

// 👉 3. Technologie publizieren
router.put('/:id/publish', authenticate, async (req, res) => {
  if (!['CTO', 'TECH_LEAD'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only CTO/Tech-Lead can publish technologies' });
  }

  const { id } = req.params;
  const { ring, rationale } = req.body;

  if (!ring || !rationale) {
    return res.status(400).json({ error: 'Ring and rationale are required to publish' });
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
       RETURNING *`,
      [ring, rationale, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Technology not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Technology could not be published' });
  }
});

// 👉 4. Technologie ändern
router.put('/:id', authenticate, async (req, res) => {
  if (!['CTO', 'TECH_LEAD'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only CTO/Tech-Lead can update technologies' });
  }

  const { id } = req.params;
  const { name, category, description } = req.body;

  if (!name || !category || !description) {
    return res.status(400).json({ error: 'Name, category and description are required' });
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
      return res.status(404).json({ error: 'Technology not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Technology could not be updated' });
  }
});

// 👉 5. Technologie-Einordnung ändern (Ring / Rationale)
router.put('/:id/reclassify', authenticate, async (req, res) => {
  if (!['CTO', 'TECH_LEAD'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only CTO/Tech-Lead can reclassify technologies' });
  }

  const { id } = req.params;
  const { ring, rationale } = req.body;

  if (!ring || !rationale) {
    return res.status(400).json({ error: 'Ring and rationale are required' });
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
      return res.status(404).json({ error: 'Technology not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Technology could not be reclassified' });
  }
});

module.exports = router;
