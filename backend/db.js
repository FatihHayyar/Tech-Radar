// db.js
// PostgreSQL-Verbindungspool
// Liest Konfig aus .env (DATABASE_URL)
// Stellt den Pool für alle Module bereit

const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL ist nicht gesetzt (siehe .env Datei)');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Optional: Test der Verbindung beim Start
pool.connect()
  .then(client => {
    console.log('✅ Datenbankverbindung erfolgreich');
    client.release();
  })
  .catch(err => {
    console.error('❌ Fehler bei der DB-Verbindung:', err.message);
  });

module.exports = pool;
