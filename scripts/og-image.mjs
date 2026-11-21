// Erzeugt das Vorschaubild für geteilte Wunschlisten (Dev 102): node scripts/og-image.mjs -> public/og/wunschliste.jpg (1200 × 630)
// Schriften kommen aus @fontsource, nichts wird aus dem Netz geladen.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const font = (pkg, file) => readFileSync(new URL(`../node_modules/${pkg}/files/${file}`, import.meta.url)).toString('base64');
const serif = font('@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff2');
const serifI = font('@fontsource/instrument-serif', 'instrument-serif-latin-400-italic.woff2');
const sans = font('@fontsource-variable/schibsted-grotesk', 'schibsted-grotesk-latin-wght-normal.woff2');
const rows = [['Le Creuset Bräter, 24 cm', '#F4DCCB', '#8A3E22', 'L', 3], ['Wanderstöcke', '#D7E6DA', '#2D5A3B', 'W', 2], ['Ein Buch zum Schmökern', '#EADDF0', '#5B3772', 'B', 2], ['Kopfhörer', '#F6E6BF', '#80580F', 'K', 3]];
const html = `<!doctype html><html><head><style>
@font-face{font-family:IS;src:url(data:font/woff2;base64,${serif}) format('woff2')}
@font-face{font-family:IS;font-style:italic;src:url(data:font/woff2;base64,${serifI}) format('woff2')}
@font-face{font-family:SG;font-weight:400 900;src:url(data:font/woff2;base64,${sans}) format('woff2')}
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#2E3B2F;color:#F6F0E4;font-family:SG;display:grid;grid-template-columns:600px 600px;overflow:hidden}
.l{padding:64px 0 0 72px}.mark{font:400 46px/1 IS;letter-spacing:-.02em}.mark span{color:#D9A441}
h1{font:400 66px/1.02 IS;margin:58px 0 22px;letter-spacing:-.01em}h1 em{font-style:italic;color:#F3D9A4}
p{font-size:25px;line-height:1.4;margin:0;color:#DCE5D5;max-width:470px}
.r{position:relative}.list{position:absolute;left:40px;top:92px;width:470px;background:#FAF7F1;border-radius:26px;padding:10px 0;box-shadow:0 24px 60px rgba(0,0,0,.35);transform:rotate(-2.5deg)}
.row{display:flex;align-items:center;gap:18px;padding:16px 24px;border-bottom:1px solid #ECE5D8;color:#1F1B16}.row:last-child{border-bottom:0}
.ph{width:62px;height:62px;border-radius:14px;display:grid;place-items:center;font:700 26px SG}.t{flex:1;font:600 22px/1.25 SG}.d i{display:inline-block;width:10px;height:10px;border-radius:50%;background:#B8801F;margin-left:4px}.d i.o{background:#E4DBC9}
.badge{position:absolute;right:46px;top:440px;background:#D9A441;color:#1F1B16;font:700 20px SG;padding:12px 20px;border-radius:99px;transform:rotate(3deg);box-shadow:0 10px 24px rgba(0,0,0,.25)}
</style></head><body><div class="l"><div class="mark">wishtale<span>.</span></div><h1>Hier steht, worüber ich mich <em>freue</em></h1><p>Reserviere still einen Wunsch, und die Überraschung bleibt.</p></div>
<div class="r"><div class="list">${rows.map(([t, bg, fg, ch, pr]) => `<div class="row"><span class="ph" style="background:${bg};color:${fg}">${ch}</span><span class="t">${t}</span><span class="d">${[1, 2, 3].map(n => `<i class="${n <= pr ? '' : 'o'}"></i>`).join('')}</span></div>`).join('')}</div><div class="badge">Reserviert, psst</div></div></body></html>`;
const { chromium } = createRequire(import.meta.url)('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html);
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: 'public/og/wunschliste.jpg', type: 'jpeg', quality: 86 });
await b.close();
console.log('geschrieben public/og/wunschliste.jpg');
