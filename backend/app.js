const express = require('express');
const db = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/health', (_, res) => res.json({ ok: true }));

app.get('/db-check', async (_, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'DB connection failed' });
  }
});

// Routes
const techRoutes = require('./technologies');
app.use('/tech', techRoutes);

const { router: authRoutes } = require('./auth');
app.use('/auth', authRoutes);

const userRoutes = require('./users');
app.use('/users', userRoutes);

module.exports = app;
