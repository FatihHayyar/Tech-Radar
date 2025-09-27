// app.js (optimized)
// Small, safe performance improvements:
// - gzip compression
// - helmet security headers
// - small in-memory cache for public GET /tech (published list)
// - smaller body parser limit
// - CORS configured via env (fallback to * for dev)
// - X-Cache header to observe hits/misses
//
// Install extras if needed:
//   npm install compression helmet
//

const express = require('express');
const db = require('./db');
const cors = require('cors');
require('dotenv').config();

// optional optimized middleware (install if missing)
let compression;
let helmet;
try {
  compression = require('compression');
} catch (e) {
  // if not installed, we'll skip compression but the app still runs
  compression = null;
}
try {
  helmet = require('helmet');
} catch (e) {
  helmet = null;
}

const app = express();

// ---- Basic middleware ----
// Enable gzip compression if available (improves transfer times)
if (compression) {
  app.use(compression());
}

// Basic security headers
if (helmet) {
  app.use(helmet());
}

// Configure CORS: allow env-defined origin or all (development)
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: CORS_ORIGIN }));

// Tighten JSON body size so huge payloads don't block event loop
app.use(express.json({ limit: process.env.JSON_LIMIT || '50kb' }));

// small request logger for development (optional)
// if you want to enable, install morgan and uncomment below
// const morgan = require('morgan');
// app.use(morgan('tiny'));

// ---- Simple in-memory cache for public /tech GET (published list) ----
// This caches the JSON response for GET /tech for a short TTL (seconds).
// Benefit: fewer DB queries on repeated frontend hits (esp. on Slow 4G).
// Important: this is an ephemeral in-memory cache — restarts clear it.
// We purposely cache ONLY the public endpoint (no auth) to avoid leaking admin responses.
const techCache = new Map(); // key -> { ts, data }
const TECH_CACHE_TTL = Number(process.env.TECH_CACHE_TTL_SECONDS || 8); // default 8s

function cacheMiddleware(req, res, next) {
  // Only handle GET / or root mounted path for published list
  // Note: router is mounted at /tech, so req.path will be '/' for /tech
  if (req.method === 'GET' && (req.path === '/' || req.path === '')) {
    const key = 'tech:published';
    const cached = techCache.get(key);
    if (cached && Date.now() - cached.ts < TECH_CACHE_TTL * 1000) {
      // serve cached copy
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', `public, max-age=${TECH_CACHE_TTL}`); // assist proxies
      return res.json(cached.data);
    }

    // no cached value -> intercept res.json to cache the response after router fills it
    // store original json
    const originalJson = res.json.bind(res);
    let called = false;
    res.json = (body) => {
      if (!called) {
        try {
          techCache.set(key, { ts: Date.now(), data: body });
          res.set('X-Cache', 'MISS');
          res.set('Cache-Control', `public, max-age=${TECH_CACHE_TTL}`);
        } catch (e) {
          // ignore caching errors
        }
      }
      called = true;
      return originalJson(body);
    };
    return next();
  }

  return next();
}

// Attach cacheMiddleware only to /tech mount (so it does not affect other routes)
app.use('/tech', cacheMiddleware);

// ---- Healthcheck endpoints (fast) ----
app.get('/health', (_, res) => res.json({ ok: true }));

app.get('/db-check', async (_, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ db_time: result.rows[0].now });
  } catch (err) {
    console.error('DB check failed', err);
    res.status(500).json({ error: 'DB connection failed' });
  }
});

// ---- Routes (unchanged) ----
const techRoutes = require('./technologies');
app.use('/tech', techRoutes);

const { router: authRoutes } = require('./auth');
app.use('/auth', authRoutes);

// ❌ users.js kaldırıldı, buradaki import da silindi

// ---- Graceful shutdown helpers (useful during tests / dev) ----
// Exported app will be used by server.js which calls app.listen; to help tests exit cleanly,
// we expose a small function to clear caches and allow a graceful shutdown if desired.
app.clearCaches = () => {
  techCache.clear();
};

// ---- error handler (small improvement) ----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
