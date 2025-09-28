// app.js (optimiert)
// Kleine, sichere Performance-Verbesserungen:
// - gzip-Kompression
// - Helmet-Sicherheits-Header
// - kleiner In-Memory-Cache für GET /tech (nur veröffentlichte Technologien)
// - kleinere Body-Parser-Limits
// - CORS über Umgebungsvariable konfigurierbar (Fallback * für Entwicklung)
// - X-Cache Header zur Beobachtung von Hits/Misses
//
// Zusätzliche Pakete falls notwendig installieren:
//   npm install compression helmet
//

const express = require('express');
const db = require('./db');
const cors = require('cors');
require('dotenv').config();

// optionale Middleware (läuft auch ohne installiert zu sein)
let compression;
let helmet;
try {
  compression = require('compression');
} catch (e) {
  compression = null;
}
try {
  helmet = require('helmet');
} catch (e) {
  helmet = null;
}

const app = express();

// ---- Basis-Middleware ----
// Gzip-Kompression aktivieren (falls installiert)
if (compression) {
  app.use(compression());
}

// Sicherheits-Header setzen
if (helmet) {
  app.use(helmet());
}

// CORS: über ENV konfigurierbar, sonst Standard * (für Entwicklung)
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: CORS_ORIGIN }));

// JSON Body Limit enger setzen (gegen sehr große Payloads)
app.use(express.json({ limit: process.env.JSON_LIMIT || '50kb' }));

// ---- Einfacher In-Memory-Cache für GET /tech (nur veröffentlichte Daten) ----
const techCache = new Map(); // key -> { ts, data }
const TECH_CACHE_TTL = Number(process.env.TECH_CACHE_TTL_SECONDS || 8); // Standard 8 Sekunden

function cacheMiddleware(req, res, next) {
  if (req.method === 'GET' && (req.path === '/' || req.path === '')) {
    const key = 'tech:published';
    const cached = techCache.get(key);
    if (cached && Date.now() - cached.ts < TECH_CACHE_TTL * 1000) {
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', `public, max-age=${TECH_CACHE_TTL}`);
      return res.json(cached.data);
    }

    // Antwort abfangen und im Cache speichern
    const originalJson = res.json.bind(res);
    let called = false;
    res.json = (body) => {
      if (!called) {
        try {
          techCache.set(key, { ts: Date.now(), data: body });
          res.set('X-Cache', 'MISS');
          res.set('Cache-Control', `public, max-age=${TECH_CACHE_TTL}`);
        } catch (e) {
          // Ignorieren von Cache-Fehlern
        }
      }
      called = true;
      return originalJson(body);
    };
    return next();
  }
  return next();
}

app.use('/tech', cacheMiddleware);

// ---- Healthcheck ----
app.get('/health', (_, res) => res.json({ ok: true }));

app.get('/db-check', async (_, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ db_time: result.rows[0].now });
  } catch (err) {
    console.error('DB-Check fehlgeschlagen', err);
    res.status(500).json({ error: 'DB-Verbindung fehlgeschlagen' });
  }
});

// ---- Routen ----
const techRoutes = require('./routes/technologies');
app.use('/tech', techRoutes);

const { router: authRoutes } = require('./routes/auth');
app.use('/auth', authRoutes);


// ---- Hilfsfunktionen für Tests / Shutdown ----
app.clearCaches = () => {
  techCache.clear();
};

// ---- Fehler-Handler ----
app.use((err, req, res, next) => {
  console.error('Unbehandelter Fehler:', err && err.stack ? err.stack : err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

module.exports = app;
