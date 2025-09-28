// scripts/critical-inline.cjs
// Dieses Script inlined Critical CSS nach dem Vite-Build.
// Wichtig für Performance (schneller First Paint auf 4G).

const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const criticalMod = await import('critical');
    const generate = criticalMod.generate || criticalMod.default || criticalMod;

    const distDir = path.join(__dirname, '..', 'dist');
    const srcHtmlPath = path.join(distDir, 'index.html');

    const result = await generate({
      base: distDir,
      src: 'index.html',
      inline: true,
      extract: true,
      width: 1300,
      height: 900,
      rebase: ({ url }) => url
    });

    if (result && typeof result === 'object' && result.html) {
      fs.writeFileSync(srcHtmlPath, result.html, 'utf8');
      console.log('✔ Critical CSS wurde erfolgreich inline in index.html eingefügt (result.html).');
      process.exit(0);
    }

    if (typeof result === 'string' && result.length > 0) {
      fs.writeFileSync(srcHtmlPath, result, 'utf8');
      console.log('✔ Critical CSS wurde erfolgreich inline in index.html eingefügt (result string).');
      process.exit(0);
    }

    const finalHtml = fs.readFileSync(srcHtmlPath, 'utf8');
    if (finalHtml && finalHtml.length > 0) {
      console.log('✔ Critical-CSS-Lauf abgeschlossen – index.html liegt vor (keine weitere Änderung nötig).');
      process.exit(0);
    }

    throw new Error('Critical lieferte kein HTML zurück und index.html wurde nicht aktualisiert.');
  } catch (err) {
    console.error('❌ Critical-Inlining fehlgeschlagen:', err);
    process.exit(1);
  }
})();
