const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");
const { authenticate } = require("./auth");

const router = express.Router();


// 👉 CTO / TECH_LEAD kann neue Benutzer anlegen
router.post("/", authenticate, async (req, res) => {
  if (!["CTO", "TECH_LEAD"].includes(req.user.role)) {
    return res.status(403).json({ error: "Nur CTO/Tech Lead darf Benutzer anlegen" });
  }

  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, Passwort und Rolle sind erforderlich" });
  }

  if (!["EMPLOYEE", "TECH_LEAD"].includes(role)) {
    return res.status(400).json({ error: "Nur EMPLOYEE oder TECH_LEAD können angelegt werden" });
  }

  try {
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Benutzer existiert bereits" });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (id, email, password_hash, role, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())
       RETURNING id, email, role, created_at`,
      [email, hash, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Benutzer konnte nicht angelegt werden" });
  }
});





module.exports = router;
