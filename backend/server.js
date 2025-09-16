const express = require('express');
const db = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());



app.get('/health', (_, res) => res.json({ ok: true }));

app.get('/db-check', async (_, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ db_time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB connection failed' });
  }
});
// routen
const authRoutes = require('./auth');
app.use('/auth', authRoutes);

const techRoutes = require('./technologies');
app.use('/tech', techRoutes);


// server start
app.listen(process.env.PORT, () => {
  console.log('API listening on ' + process.env.PORT);
});
