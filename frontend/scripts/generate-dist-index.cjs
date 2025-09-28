// scripts/generate-dist-index.cjs
// Erstellt eine saubere index.html nach dem Vite-Build
// Wichtig: Stellt sicher, dass die richtigen JS/CSS Assets eingebunden sind.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..'); 
const dist = path.join(root, 'dist');
const assetsDir = path.join(dist, 'assets');

if (!fs.existsSync(dist) || !fs.existsSync(assetsDir)) {
  console.error('❌ "dist" oder "dist/assets" wurde nicht gefunden. Bitte zuerst "npm run build" ausführen.');
  process.exit(1);
}

const assets = fs.readdirSync(assetsDir);
const jsFile = assets.find(f => f.endsWith('.js'));
const cssFile = assets.find(f => f.endsWith('.css'));

if (!jsFile) {
  console.error('❌ Keine .js-Datei in dist/assets gefunden!');
  process.exit(1);
}

const html = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Technologie-Radar</title>
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ''}
    <link rel="modulepreload" href="/assets/${jsFile}">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${jsFile}" defer></script>
  </body>
</html>
`;

fs.writeFileSync(path.join(dist, 'index.html'), html, 'utf8');
console.log(`✔ dist/index.html wurde aktualisiert → ${jsFile} ${cssFile || '(kein CSS gefunden)'}`);
