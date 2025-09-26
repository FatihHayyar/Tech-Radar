// generate-dist-index.cjs
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..'); // tech_lab
const dist = path.join(root, 'dist');
const assetsDir = path.join(dist, 'assets');

if (!fs.existsSync(dist) || !fs.existsSync(assetsDir)) {
  console.error('dist veya dist/assets bulunamadı. Önce build çalıştırın.');
  process.exit(1);
}

const assets = fs.readdirSync(assetsDir);
const jsFile = assets.find(f => f.endsWith('.js'));
const cssFile = assets.find(f => f.endsWith('.css'));

if (!jsFile) {
  console.error('dist/assets içinde .js dosyası bulunamadı!');
  process.exit(1);
}

// Eğer critical sonucu üretilmiş inline CSS (result.html veya benzeri) varsa bunu kullanabilirsin.
// Burada basit ve güvenli bir index.html oluşturuyoruz:
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Tech Radar</title>
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
console.log('dist/index.html güncellendi ->', jsFile, cssFile || '(css yok)');
