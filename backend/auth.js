const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const router = express.Router();

// 👉 middleware ekle
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

// LOGIN
// auth.js (login route - replace existing login handler with this)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      // başarısız giriş logla (kullanıcı yok)
      await db.query(
        'INSERT INTO login_audit (email_snapshot, success, ip) VALUES ($1, $2, $3)',
        [email, false, req.ip]
      );
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      // başarısız giriş logla (şifre yanlış)
      await db.query(
        'INSERT INTO login_audit (user_id, email_snapshot, success, ip) VALUES ($1, $2, $3, $4)',
        [user.id, user.email, false, req.ip]
      );
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Başarılı giriş: 1) last_login_at güncelle, 2) audit kaydet, 3) token üret
    // UPDATE ve aynı anda last_login_at döndürelim
    const upd = await db.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1 RETURNING last_login_at',
      [user.id]
    );
    const lastLoginAt = upd.rows[0] ? upd.rows[0].last_login_at : null;

    // JWT oluştur
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // başarılı giriş logla
    await db.query(
      'INSERT INTO login_audit (user_id, email_snapshot, success, ip) VALUES ($1, $2, $3, $4)',
      [user.id, user.email, true, req.ip]
    );

    // Response: token + opsiyonel last_login_at
    res.json({
      token,
      role: user.role,
      id: user.id,
      last_login_at: lastLoginAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});


// router + authenticate export et
module.exports = { router, authenticate };
