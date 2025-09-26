// scripts/critical-inline.cjs
// Bu CJS dosyası içinde ESM paketini dynamic import ile çağırıyoruz.

const path = require('path');
const fs = require('fs');

(async () => {
  try {
    // dynamic import kullan (ESM paketiyle uyumlu)
    const criticalMod = await import('critical');
    // critical paketinin farklı ihracat (export) şekillerine karşı koruma:
    const generate = criticalMod.generate || criticalMod.default || criticalMod;

    const distDir = path.join(__dirname, '..', 'dist');
    const srcHtml = 'index.html';
    const srcHtmlPath = path.join(distDir, srcHtml);

    // generate çalıştır
    const result = await generate({
      base: distDir,
      src: srcHtml,
      inline: true,
      extract: true,
      width: 1300,
      height: 900,
      rebase: ({ url }) => url
    });

    // result, generate()'in döndürdüğü yapıya göre html içerebilir
    if (result && typeof result === 'object' && result.html) {
      fs.writeFileSync(srcHtmlPath, result.html, 'utf8');
      console.log('✔ Critical CSS inlined and index.html updated (result.html)');
      process.exit(0);
    }

    // Eğer result doğrudan HTML string döndürdüyse:
    if (typeof result === 'string' && result.length > 0) {
      fs.writeFileSync(srcHtmlPath, result, 'utf8');
      console.log('✔ Critical CSS inlined and index.html updated (result string)');
      process.exit(0);
    }

    // Fallback: CLI ile index.html zaten güncellenmiş olabilir — kontrol et
    const finalHtml = fs.readFileSync(srcHtmlPath, 'utf8');
    if (finalHtml && finalHtml.length > 0) {
      console.log('✔ critical run completed - index.html present (no extra write needed)');
      process.exit(0);
    }

    throw new Error('Critical did not return html and index.html not updated.');
  } catch (err) {
    console.error('critical-inline failed:', err);
    process.exit(1);
  }
})();
