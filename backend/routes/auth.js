// routes/auth.js
// Routen für Authentifizierung (Login) + Middleware zum Token-Check

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// Middleware: JWT-Authentifizierung
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Kein Token bereitgestellt" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Ungültiges Token-Format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Ungültiges oder abgelaufenes Token" });
  }
}

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort erforderlich' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      // fehlgeschlagene Anmeldung protokollieren (Benutzer existiert nicht)
      await db.query(
        'INSERT INTO login_audit (email_snapshot, success, ip) VALUES ($1, $2, $3)',
        [email, false, req.ip]
      );
      return res.status(401).json({ error: 'Ungültige Zugangsdaten' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      // fehlgeschlagene Anmeldung protokollieren (falsches Passwort)
      await db.query(
        'INSERT INTO login_audit (user_id, email_snapshot, success, ip) VALUES ($1, $2, $3, $4)',
        [user.id, user.email, false, req.ip]
      );
      return res.status(401).json({ error: 'Ungültige Zugangsdaten' });
    }

    // Erfolgreiche Anmeldung: 1) last_login_at aktualisieren, 2) Audit protokollieren, 3) JWT erzeugen
    const upd = await db.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1 RETURNING last_login_at',
      [user.id]
    );
    const lastLoginAt = upd.rows[0] ? upd.rows[0].last_login_at : null;

    // JWT erzeugen
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // erfolgreiche Anmeldung protokollieren
    await db.query(
      'INSERT INTO login_audit (user_id, email_snapshot, success, ip) VALUES ($1, $2, $3, $4)',
      [user.id, user.email, true, req.ip]
    );

    // Antwort: Token + Rolle + optional last_login_at
    res.json({
      token,
      role: user.role,
      id: user.id,
      last_login_at: lastLoginAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login fehlgeschlagen' });
  }
});

module.exports = { router, authenticate };
