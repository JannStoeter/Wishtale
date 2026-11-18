// Erzeugt die App-Symbole für die installierbare Web-App (Dev 095): node scripts/app-icons.mjs
// Schrift ist die Markenschrift Instrument Serif aus @fontsource, nichts wird aus dem Netz geladen.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const font = readFileSync(new URL('../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2', import.meta.url)).toString('base64');
// scale: Anteil der Fläche, den das Zeichen einnimmt (maskierbare Symbole brauchen Rand, weil Android sie rund zuschneidet)
const ICONS = [
  { file: 'icon-192.png', size: 192, scale: 1, round: true },
  { file: 'icon-512.png', size: 512, scale: 1, round: true },
  { file: 'maskable-512.png', size: 512, scale: 0.72, round: false },
  { file: 'apple-touch-icon.png', size: 180, scale: 1, round: false },
];
const html = ({ size, scale, round }) => `<!doctype html><html><head><style>
@font-face{font-family:IS;src:url(data:font/woff2;base64,${font}) format('woff2')}
html,body{margin:0;background:transparent}
.b{width:${size}px;height:${size}px;background:#2E3B2F;border-radius:${round ? size * 0.22 : 0}px;position:relative;overflow:hidden}
.w{position:absolute;left:0;right:0;top:${size * (0.5 - 0.36 * scale)}px;text-align:center;font:400 ${size * 0.78 * scale}px/1 IS;color:#F6F0E4;letter-spacing:0}
.d{position:absolute;width:${size * 0.11 * scale}px;height:${size * 0.11 * scale}px;border-radius:50%;background:#B8801F;left:${size * (0.5 + 0.23 * scale)}px;top:${size * (0.5 + 0.17 * scale)}px}
</style></head><body><div class="b"><div class="w">w</div><div class="d"></div></div></body></html>`;
const { chromium } = createRequire(import.meta.url)('playwright');
const b = await chromium.launch();
const p = await b.newPage();
for (const i of ICONS) {
  await p.setViewportSize({ width: i.size, height: i.size });
  await p.setContent(html(i));
  await p.evaluate(() => document.fonts.ready);
  await p.locator('.b').screenshot({ path: `public/app/icons/${i.file}`, omitBackground: true });
  console.log('geschrieben', i.file);
}
await b.close();
