// serve-dist.cjs
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');
const compression = require('compression');
app.use(compression()); // gzip
// static serve with long cache for assets
app.use('/assets', express.static(path.join(dist, 'assets'), {
  maxAge: '365d', // cache uzun süre
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Basit var kontrolü
if (!fs.existsSync(DIST_DIR)) {
  console.error('dist dizini bulunamadı:', DIST_DIR);
  process.exit(1);
}
if (!fs.existsSync(INDEX_FILE)) {
  console.error('index.html bulunamadı:', INDEX_FILE);
  process.exit(1);
}

// 1) Statik dosyaları servis et (CSS/JS/görseller)
//    express.static önce denenecek; eğer dosya varsa cevap verilir ve middleware zinciri sonlanır.
app.use(express.static(DIST_DIR, {
  extensions: ['html'],
  index: false,
  maxAge: '1d' // basit cache başlığı
}));

// 2) SPA fallback: var olmayan GET HTML isteklerini index.html ile yanıtla
//    Burada route desenleri kullanmıyoruz, normal middleware ile kontrol yapıyoruz.
//    Böylece path-to-regexp hatası olmaz.
app.use((req, res, next) => {
  // Sadece GET isteklerini ele al
  if (req.method !== 'GET') return next();

  // Tarayıcı HTML isteği mi? (API, JSON, css, js vb. değilse)
  const accept = req.headers.accept || '';
  if (!accept.includes('text/html')) {
    return next();
  }

  // index.html gönder
  res.sendFile(INDEX_FILE, (err) => {
    if (err) {
      console.error('index.html gönderilirken hata:', err);
      res.status(500).send('Server error');
    }
  });
});

// (İsteğe bağlı) küçük health endpoint
app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Serving dist on http://localhost:${PORT}`);
});
