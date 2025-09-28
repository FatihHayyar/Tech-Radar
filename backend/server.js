// server.js
// Startpunkt der Anwendung

const app = require('./app');

if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`✅ API läuft auf Port ${port}`);
  });
}
