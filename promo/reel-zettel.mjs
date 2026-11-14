/*
 * Reel „Jetzt neu: Wunschzettel hochladen“ (Dev 084): handschriftlicher Zettel, Foto hochladen, einlesen, Liste fertig.
 *   promo/out/reel-wunschzettel.mp4   (1080x1920, 9:16, 30 fps, ohne Ton)
 * Die Bildschirme sind echte Ausschnitte der App (gebauter Stand aus dist/, Konto und Server simuliert, Beispielperson Mia).
 * Benötigt: playwright (mit Chromium) und ffmpeg, vorher `npm run build`.   Aufruf: npm run promo:zettel
 * Schriften kommen aus node_modules (@fontsource), nichts wird aus dem Netz geladen.
 */
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const OUT = join(here, 'out'), SHOTS = join(OUT, '_shots');
mkdirSync(SHOTS, { recursive: true });
if (!existsSync(join(root, 'dist/index.html'))) throw new Error('Bitte zuerst `npm run build` ausführen.');

const font = (pkg, file) => readFileSync(join(root, 'node_modules', pkg, 'files', file)).toString('base64');
const FACES = `
@font-face{font-family:"Instrument Serif";font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${font('@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff2')}) format("woff2")}
@font-face{font-family:"Instrument Serif";font-style:italic;font-weight:400;src:url(data:font/woff2;base64,${font('@fontsource/instrument-serif', 'instrument-serif-latin-400-italic.woff2')}) format("woff2")}
@font-face{font-family:"Schibsted";font-weight:400 900;src:url(data:font/woff2;base64,${font('@fontsource-variable/schibsted-grotesk', 'schibsted-grotesk-latin-wght-normal.woff2')}) format("woff2")}
@font-face{font-family:"Caveat";font-weight:500;src:url(data:font/woff2;base64,${font('@fontsource/caveat', 'caveat-latin-500-normal.woff2')}) format("woff2")}
@font-face{font-family:"Caveat";font-weight:600;src:url(data:font/woff2;base64,${font('@fontsource/caveat', 'caveat-latin-600-normal.woff2')}) format("woff2")}`;

/* Die ersten beiden Wünsche sind sehr konkret: Wishtale erkennt das Produkt (m = simulierter Treffer, photo = Platzhalterbild aus public/photos, Beispielpreise). */
const WISHES = [
  { t: 'Sony WH-1000XM5 Kopfhörer', m: { t: 'Sony WH-1000XM5 Kabellose Kopfhörer', price: 299, host: 'sony.de', c: 'technik', photo: 'headphones' } },
  { t: 'Le Creuset Bräter, 24 cm', m: { t: 'Le Creuset Signature Bräter rund, 24 cm', price: 259, host: 'lecreuset.de', c: 'kochen', photo: 'pot' } },
  { t: 'Eine schöne Thermoskanne' },
  { t: 'Wanderstöcke' },
  { t: 'Ein Buch zum Schmökern' },
];
const NAME = 'Mia';

/* ---------------- Der Zettel (handschriftlich) ---------------- */
const zettelHtml = (w = 900, animate = false) => `
<div class="paper" style="width:${w}px">
 <div class="ph"><span class="hl" data-i="0">Mein Wunschzettel</span><span class="star hl" data-i="1">★</span></div>
 <ol>${WISHES.map((w, i) => `<li><span class="hl" data-i="${i + 2}">${w.t}</span></li>`).join('')}</ol>
 <div class="sig"><span class="hl" data-i="${WISHES.length + 2}">Danke, liebes Christkind! ${NAME}</span></div>
</div>`;
const ZETTEL_CSS = `
.paper{position:relative;background:#FFFDF6;border-radius:6px;padding:64px 70px 70px 120px;box-shadow:0 30px 60px rgba(60,40,10,.28),0 4px 10px rgba(60,40,10,.18);font-family:"Caveat",cursive;font-weight:500;color:#243b6b;
 background-image:linear-gradient(#FFFDF6 0,#FFFDF6 100%),repeating-linear-gradient(transparent 0,transparent 71px,#B9CBE6 72px);background-blend-mode:normal}
.paper::before{content:"";position:absolute;left:96px;top:0;bottom:0;width:3px;background:#E39A9A}
.paper::after{content:"";position:absolute;inset:0;border-radius:6px;background:repeating-linear-gradient(transparent 0,transparent 71px,rgba(120,150,200,.45) 72px);margin-top:52px;pointer-events:none}
.paper .ph{display:flex;align-items:center;gap:20px;font-size:92px;line-height:72px;font-weight:600;margin-bottom:6px;transform:rotate(-1deg)}
.paper .star{color:#D9A441;font-size:80px}
.paper ol{list-style:none;margin:0;padding:0;counter-reset:n}
.paper li{counter-increment:n;font-size:70px;line-height:72px;height:72px;white-space:nowrap;position:relative;transform:rotate(-.4deg)}
.paper li:nth-child(even){transform:rotate(.5deg);margin-left:8px}
.paper li::before{content:counter(n) ".";position:absolute;left:-78px;color:#6b7fa6;font-size:60px}
.paper .sig{margin-top:30px;font-size:64px;line-height:72px;transform:rotate(-1.2deg);color:#8a3f3f}
.hl{display:inline-block}`;

/* ---------------- App-Ausschnitte (echt, mit simuliertem Konto) ---------------- */
const jpegOf = buf => { const i = buf.indexOf(Buffer.from([0xff, 0xd8])), j = buf.lastIndexOf(Buffer.from([0xff, 0xd9])); return i >= 0 && j > i ? buf.subarray(i, j + 2) : buf; };
const photo = k => readFileSync(join(root, 'public/photos', `${k}-600.jpg`));
let GEO = {}; // Positionen der erkannten Zeilen im Ergebnis-Dialog (für den Zoom im Film)

async function capture(base) {
  const browser = await chromium.launch();
  try {
    // Zettel als Bild (für die Datei-Auswahl in der App)
    const zp = await browser.newPage({ viewport: { width: 1100, height: 1000 }, deviceScaleFactor: 1 });
    await zp.setContent(`<!doctype html><meta charset="utf-8"><style>${FACES}${ZETTEL_CSS}body{margin:0;background:#c9b48f;display:grid;place-items:center;height:100vh}</style>${zettelHtml(900)}`);
    await zp.evaluate(() => document.fonts.ready);
    const zfile = join(SHOTS, 'wunschzettel.jpg');
    await zp.screenshot({ path: zfile, type: 'jpeg', quality: 90 });
    await zp.close();

    const user = { id: 'u1', email: 'mia@example.com', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: { full_name: NAME } };
    const session = { access_token: 'x', refresh_token: 'y', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, token_type: 'bearer', user };
    const prof = { id: 'p1', owner_id: 'u1', handle: 'mia-ab12cd', name: NAME, managed: false, tone: 0, about: '', interests: [], cats: [], brands: [], tries: [], nogos: [], alts: [], style: [], vis: {}, social: {}, created_at: new Date().toISOString() };
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    await p.addInitScript(s => { localStorage.setItem('sb-uzercrfhieipplgrjbvk-auth-token', JSON.stringify(s)); localStorage.setItem('wishtale:steps:u1', JSON.stringify({ hidden: true })); }, session);
    await p.route('**/auth/v1/user*', r => r.fulfill({ json: user }));
    await p.route(/rest\/v1\/profiles/, r => r.fulfill({ json: [prof] }));
    await p.route(/rest\/v1\/(wishes|gifts|campaigns|products|settings|given_gifts|taste_signals|taste_cards|catalog_items|catalog_disabled|invites|entitlements|profile_members)/, r => r.fulfill({ json: [] }));
    await p.route(/rest\/v1\/rpc/, r => r.fulfill({ json: null }));
    await p.route(/\/api\/zettel/, async r => { await new Promise(x => setTimeout(x, 900)); r.fulfill({ json: { name: NAME, unclear: false, wishes: WISHES.map(w => ({ t: w.t, kind: 'produkt', note: '' })) } }); });
    // Produkterkennung: sehr konkrete Wünsche bekommen einen Treffer, die anderen nicht
    await p.route(/\/api\/ideas\?/, async r => {
      const u = new URL(r.request().url());
      if (u.searchParams.get('mode') !== 'match') return r.fulfill({ json: { ideas: [] } });
      const t = u.searchParams.get('t') || '', w = WISHES.find(x => x.t === t);
      await new Promise(x => setTimeout(x, 700 + Math.random() * 600));
      return r.fulfill({ json: { match: w && w.m ? { ok: true, conf: 0.95, src: 'web', t: w.m.t, q: w.m.t, price: w.m.price, img: null, host: w.m.host, c: w.m.c } : { ok: false, conf: 0.2 } } });
    });
    // Produktbild und Amazon-Link zum erkannten Produkt (Bild: Platzhalter aus unseren eigenen Fotos)
    await p.route(/\/api\/inspect/, async r => {
      const b = JSON.parse(r.request().postData() || '{}'), q = String(b.imageQuery || b.amazonQuery || '');
      const w = WISHES.find(x => x.m && (q.includes(x.m.t) || q.includes(x.t)));
      if (b.imageQuery && w) return r.fulfill({ json: { image: { type: 'image/jpeg', data: photo(w.m.photo).toString('base64'), source: w.m.host } } });
      if (b.amazonQuery && w) return r.fulfill({ json: { amazon: { url: `https://www.amazon.de/s?k=${encodeURIComponent(w.m.t)}&tag=jannst-21`, title: w.m.t } } });
      return r.fulfill({ status: 404, json: { error: 'x' } });
    });
    // Eigener Bildspeicher (simuliert): hochgeladene Bilder merken und wieder ausliefern
    const store = new Map();
    await p.route(/\/storage\/v1\/object\/(public\/)?wish-images\//, async r => {
      const req = r.request(), path = req.url().split('wish-images/')[1].split('?')[0];
      if (req.method() === 'POST' || req.method() === 'PUT') { store.set(path, jpegOf(req.postDataBuffer() || Buffer.alloc(0))); return r.fulfill({ status: 200, json: { Key: 'wish-images/' + path } }); }
      const img = store.get(path); return img ? r.fulfill({ status: 200, contentType: 'image/jpeg', body: img }) : r.fulfill({ status: 404, body: '' });
    });
    await p.goto(base + '/app/#wuensche');
    await p.waitForTimeout(2200);
    await p.addStyleTag({ content: '.toast,.fab{display:none!important}' });
    await p.locator('[data-act=modal][data-v=zettel]').first().click();
    await p.waitForTimeout(500);
    await p.setInputFiles('#zt-f', zfile);
    await p.waitForTimeout(300);
    await p.screenshot({ path: join(SHOTS, 'upload.png') });
    await p.locator('form[data-form=zettel] button[type=submit]').click();
    await p.waitForSelector('form[data-form=zettelsave]');
    await p.waitForSelector('.zm-ok', { timeout: 12000 });
    await p.waitForTimeout(3500);
    GEO = await p.evaluate(() => { const s = document.querySelector('.sheet'), sb = s.getBoundingClientRect(); return { sheetTop: sb.top, rows: [...document.querySelectorAll('.zrow')].map(e => { const r = e.getBoundingClientRect(); return { y: r.top, h: r.height, ok: !!e.querySelector('.zm-ok') }; }) }; });
    await p.screenshot({ path: join(SHOTS, 'ergebnis.png') });
    await p.locator('form[data-form=zettelsave] button[type=submit]').click();
    await p.waitForTimeout(4500); // Produktbilder und Links werden im Hintergrund geholt
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.screenshot({ path: join(SHOTS, 'liste.png') });
    await p.locator('.wrow, .wcard', { hasText: 'Sony' }).first().click();
    await p.waitForTimeout(1800);
    await p.screenshot({ path: join(SHOTS, 'produkt.png') });
    await ctx.close();
  } finally { await browser.close(); }
}

const b64 = f => 'data:image/png;base64,' + readFileSync(join(SHOTS, f)).toString('base64');

/* ---------------- Der Film ---------------- */
const FPS = 30, W = 1080, H = 1920;
const SC = [[0, 3.2], [3.2, 8.2], [8.2, 12.6], [12.6, 17.0], [17.0, 21.4], [21.4, 25.4], [25.4, 30.2], [30.2, 33.4]]; // Szenen (Sekunden)
const TOTAL = SC[SC.length - 1][1];

/* Zoom auf die erkannten Zeilen (Positionen aus der Aufnahme, 1 CSS-Pixel der App = 1,692 Pixel im Film) */
const KF = 660 / 390;
let ZOOM = { k: 1, ox: 330, oy: 860, dy: -240 }, ZOOM_BOXES = '';
const setupZoom = () => {
  const rowsOk = (GEO.rows || []).filter(r => r.ok);
  const zy0 = rowsOk.length ? Math.min(...rowsOk.map(r => r.y)) - 4 : 370, zy1 = rowsOk.length ? Math.max(...rowsOk.map(r => r.y + r.h)) + 4 : 650;
  ZOOM = { k: 1, ox: 330, oy: Math.round(((zy0 + zy1) / 2) * KF), dy: 0 };
  ZOOM.dy = Math.round(720 - ZOOM.oy); // die Kamera fährt so nach oben, dass die erkannten Zeilen in der Bildmitte des Handys liegen
  ZOOM_BOXES = rowsOk.map(r => `<i class="zb" style="left:${Math.round(18 * KF)}px;top:${Math.round((r.y - 4) * KF)}px;width:${Math.round(354 * KF)}px;height:${Math.round((r.h + 8) * KF)}px"></i>`).join('');
};
const reelHtml = () => `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
${FACES}${ZETTEL_CSS}
:root{--bg:#F3EDE2;--ink:#1F1B16;--muted:#5E564C;--green:#2E3B2F;--gold:#D9A441;--cream:#F6F0E4}
*{box-sizing:border-box}html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:var(--bg);font-family:"Schibsted",system-ui,sans-serif;color:var(--ink)}
.sc{position:absolute;inset:0;opacity:0;overflow:hidden}
.green{background:var(--green);color:var(--cream)}
.cream{background:#EFE6D4}
.logo{position:absolute;left:0;right:0;top:92px;text-align:center;font-family:"Instrument Serif",serif;font-size:60px;letter-spacing:-.02em;z-index:5}
.logo i{display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--gold);margin-left:3px}
.cap{position:absolute;left:80px;right:80px;top:200px;z-index:4}
.eyebrow{font-size:28px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;color:var(--gold);margin:0 0 18px}
.green .eyebrow{color:var(--gold)}
h1,h2{font-family:"Instrument Serif",serif;font-weight:400;line-height:.98;letter-spacing:-.015em;margin:0}
h1{font-size:164px}h2{font-size:96px}
h1 em,h2 em{font-style:italic;color:var(--gold)}
.sub{font-size:44px;line-height:1.35;margin:34px 0 0;color:#C9D3BD}
.tag{display:inline-block;background:var(--gold);color:#1F1B16;font-weight:700;font-size:34px;letter-spacing:.1em;text-transform:uppercase;padding:14px 28px;border-radius:99px;margin-bottom:34px}
.phone{position:absolute;left:190px;top:470px;width:700px;border:20px solid #1b1f1c;border-radius:80px;background:#1b1f1c;overflow:hidden;box-shadow:0 40px 80px rgba(20,25,20,.4)}
.phone .screen{position:relative;width:660px;height:1430px;border-radius:60px;overflow:hidden;background:#F3EDE2}
.phone img{display:block;width:660px;position:absolute;left:0;top:0}
.vf{position:absolute;inset:0;background:#2a2620;display:grid;place-items:center}
.vf .z{position:absolute;left:50%;top:46%;width:900px;transform:translate(-50%,-50%) scale(.68) rotate(-2deg);transform-origin:center}
.br{position:absolute;width:90px;height:90px;border:8px solid #fff;opacity:.9}
.br.a{left:60px;top:150px;border-right:0;border-bottom:0}.br.b{right:60px;top:150px;border-left:0;border-bottom:0}
.br.c{left:60px;bottom:210px;border-right:0;border-top:0}.br.d{right:60px;bottom:210px;border-left:0;border-top:0}
.shutter{position:absolute;left:50%;bottom:70px;width:130px;height:130px;margin-left:-65px;border-radius:50%;border:10px solid #fff;display:grid;place-items:center}
.shutter i{width:86px;height:86px;border-radius:50%;background:#fff}
.flash{position:absolute;inset:0;background:#fff;opacity:0;z-index:6}
.tap{position:absolute;width:120px;height:120px;border-radius:50%;background:rgba(217,164,65,.4);border:6px solid var(--gold);z-index:7;opacity:0}
.scan{position:absolute;left:0;right:0;height:10px;background:linear-gradient(90deg,transparent,var(--gold),transparent);box-shadow:0 0 40px 14px rgba(217,164,65,.6);z-index:5;opacity:0}
.badge{position:absolute;left:50%;transform:translateX(-50%);bottom:260px;z-index:8;background:var(--green);color:var(--cream);font-size:44px;font-weight:600;padding:24px 44px;border-radius:99px;box-shadow:0 20px 40px rgba(20,25,20,.35);white-space:nowrap;opacity:0}
.badge b{color:var(--gold)}
.zwrap{position:absolute;left:90px;top:520px;transform:rotate(-2.2deg);opacity:0}
.spark{position:absolute;font-size:70px;color:var(--gold);opacity:0;z-index:7}
.pill{display:inline-block;background:var(--gold);color:#1F1B16;font-weight:700;font-size:48px;padding:26px 52px;border-radius:99px;margin-top:50px}
.url{font-size:50px;margin-top:40px;color:var(--cream);font-weight:600}
.small{font-size:36px;color:#C9D3BD;margin-top:18px}
.zoom{position:absolute;inset:0;transform-origin:${ZOOM.ox}px ${ZOOM.oy}px}
.zoom img{position:absolute;left:0;top:0;width:660px}
.zb{position:absolute;border:7px solid var(--gold);border-radius:34px;box-shadow:0 0 0 10px rgba(217,164,65,.25);opacity:0}
.foot{position:absolute;left:80px;right:80px;top:372px;font-size:30px;line-height:1.35;color:#6b6155;margin:0;z-index:4}
em{font-style:italic;color:var(--gold)}
</style></head><body>

<div class="logo" id="logo">wishtale<i></i></div>

<!-- 0 Haken -->
<section class="sc green" id="s0"><div class="cap" style="top:520px"><span class="tag u">Jetzt neu</span><h1 class="u">Der Wunschzettel, <em>einfach</em> hochgeladen</h1><p class="sub u">Foto machen, Wishtale liest mit, und die Wunschliste steht.</p></div></section>

<!-- 1 Zettel -->
<section class="sc cream" id="s1">
 <div class="cap"><p class="eyebrow u">Wie früher</p><h2 class="u">Der Wunschzettel liegt auf dem Tisch</h2></div>
 <div class="zwrap" id="zw">${zettelHtml(900, true)}</div>
</section>

<!-- 2 Foto hochladen -->
<section class="sc cream" id="s2">
 <div class="cap"><p class="eyebrow u">Schritt 1</p><h2 class="u">Foto machen und hochladen</h2></div>
 <div class="phone" id="ph2"><div class="screen">
  <div class="vf" id="vf"><div class="z">${zettelHtml(900)}</div><i class="br a"></i><i class="br b"></i><i class="br c"></i><i class="br d"></i><div class="shutter"><i></i></div></div>
  <img id="up" src="${b64('upload.png')}" style="opacity:0" alt="">
  <div class="flash" id="fl"></div>
  <span class="tap" id="tp2" style="left:330px;top:1130px"></span>
 </div></div>
</section>

<!-- 3 Einlesen -->
<section class="sc cream" id="s3">
 <div class="cap"><p class="eyebrow u">Schritt 2</p><h2 class="u">Wishtale liest die Wünsche heraus</h2></div>
 <div class="phone"><div class="screen"><img id="er" src="${b64('ergebnis.png')}" alt=""><div class="scan" id="sc3"></div></div></div>
 <div class="badge" id="b3"><b>5 Wünsche</b> erkannt</div>
</section>

<!-- 4 Konkrete Produkte erkannt (Zoom) -->
<section class="sc cream" id="s4">
 <div class="cap"><p class="eyebrow u">Bei sehr konkreten Wünschen</p><h2 class="u">Wishtale erkennt das <em>echte Produkt</em></h2></div>
 <div class="phone"><div class="screen"><div class="zoom" id="zm"><img src="${b64('ergebnis.png')}" alt="">${ZOOM_BOXES}</div></div></div>
 <div class="badge" id="b4a">Mit <b>Name, Preis und Bild</b></div>
</section>

<!-- 5 Liste fertig -->
<section class="sc cream" id="s5">
 <div class="cap"><p class="eyebrow u">Schritt 3</p><h2 class="u">Fertig: die Wunschliste steht</h2></div>
 <div class="phone"><div class="screen"><img id="li" src="${b64('liste.png')}" alt=""></div></div>
 <span class="spark" id="k1" style="left:90px;top:660px">✦</span><span class="spark" id="k2" style="right:100px;top:900px">✦</span><span class="spark" id="k3" style="left:120px;top:1240px">✦</span>
 <div class="badge" id="b5"><b>Produkte</b> mit Bild und Preis</div>
</section>

<!-- 6 Produktansicht -->
<section class="sc cream" id="s6">
 <div class="cap"><p class="eyebrow u">Ein Tipp auf den Wunsch</p><h2 class="u">Und hier ist <em>das Produkt</em></h2></div>
 <div class="phone" id="ph6"><div class="screen"><img id="pr" src="${b64('produkt.png')}" alt=""><span class="tap" id="tp6" style="left:155px;top:950px"></span></div></div>
 <div class="badge" id="b6">Mit <b>Preis und Link</b> zum Shop</div>
 <p class="foot">Beispielperson und Beispielpreise, die Preise schwanken.</p>
</section>

<!-- 7 Abschluss -->
<section class="sc green" id="s7"><div class="cap" style="top:560px"><span class="tag u">Jetzt neu</span><h1 class="u" style="font-size:130px">Einfach <em>Wunschliste</em> hochladen</h1><p class="small u">Für Weihnachten, Geburtstage und alles dazwischen.</p><span class="pill u">Jetzt ausprobieren</span><p class="url u">wishtale.de</p></div></section>

<script>
const TOTAL=${TOTAL}, SC=${JSON.stringify(SC)}, tl=[];
const E='cubic-bezier(.2,.8,.2,1)';
const $=s=>document.querySelector(s);
function anim(el,kf,start,dur,ease,fill){const a=el.animate(kf,{duration:dur*1000,delay:start*1000,fill:fill||'both',easing:ease||E});a.pause();tl.push(a);return a}
SC.forEach(([s,e],i)=>{
  const el=$('#s'+i),d=e-s,fi=.4,fo=i===SC.length-1?0:.4;
  anim(el,[{opacity:0,offset:0},{opacity:1,offset:fi/d},{opacity:1,offset:1-fo/d},{opacity:i===SC.length-1?1:0,offset:1}],s,d,'linear');
  el.querySelectorAll('.u').forEach((u,j)=>anim(u,[{opacity:0,transform:'translateY(40px)'},{opacity:1,transform:'none'}],s+.2+j*.3,.7));
});
// Logo: auf Grün hell, auf Creme dunkel
anim($('#logo'),[{color:'#F6F0E4'},{color:'#F6F0E4',offset:SC[0][1]/TOTAL-.01},{color:'#1F1B16',offset:SC[0][1]/TOTAL},{color:'#1F1B16',offset:SC[6][1]/TOTAL-.01},{color:'#F6F0E4',offset:SC[6][1]/TOTAL}],0,TOTAL,'linear');
// Szene 1: Zettel erscheint, Schrift wird Zeile für Zeile geschrieben
const s1=SC[1][0];
anim($('#zw'),[{opacity:0,transform:'translateY(120px) rotate(-6deg)'},{opacity:1,transform:'rotate(-2.2deg)'}],s1+.5,1,E);
document.querySelectorAll('#s1 .hl').forEach(h=>{const i=+h.dataset.i;h.style.clipPath='inset(-45% 100% -45% -5%)';anim(h,[{clipPath:'inset(-45% 100% -45% -5%)'},{clipPath:'inset(-45% -20% -45% -5%)'}],s1+1.2+i*.38,.55,'ease-out')});
// Szene 2: Handy kommt, Sucher, Auslöser, Blitz, dann die App
const s2=SC[2][0];
anim($('#ph2'),[{transform:'translateY(300px)',opacity:0},{transform:'none',opacity:1}],s2+.3,.8,E);
anim($('#fl'),[{opacity:0},{opacity:.95,offset:.3},{opacity:0}],s2+1.9,.45,'linear');
anim($('#vf'),[{opacity:1},{opacity:1,offset:.001},{opacity:0}],s2+2.05,.4,'linear');
anim($('#up'),[{opacity:0},{opacity:1}],s2+2.05,.4,'linear');
anim($('#tp2'),[{opacity:0,transform:'scale(1.6)'},{opacity:1,transform:'scale(1)',offset:.4},{opacity:0,transform:'scale(1.3)'}],s2+3.5,.9,E);
// Szene 3: Ergebnis wird abgetastet und sichtbar
const s3=SC[3][0];
anim($('#er'),[{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)'}],s3+1.2,2.0,'ease-in-out');
anim($('#sc3'),[{top:'0px',opacity:1},{top:'1420px',opacity:1,offset:.97},{top:'1420px',opacity:0}],s3+1.2,2.0,'ease-in-out');
anim($('#b3'),[{opacity:0,transform:'translate(-50%,40px)'},{opacity:1,transform:'translate(-50%,0)'}],s3+3.3,.6,'cubic-bezier(.2,1.3,.4,1)');
// Szene 4: auf die erkannten Produkte zoomen, Rahmen pulsieren
const s4=SC[4][0];
anim($('#zm'),[{transform:'translate(0,0) scale(1)'},{transform:'translate(0,${ZOOM.dy}px) scale(${ZOOM.k})'}],s4+.7,1.6,'ease-in-out');
document.querySelectorAll('.zb').forEach((z,i)=>anim(z,[{opacity:0},{opacity:1}],s4+1.9+i*.5,.5,'linear'));
anim($('#b4a'),[{opacity:0,transform:'translate(-50%,40px)'},{opacity:1,transform:'translate(-50%,0)'}],s4+2.8,.6,'cubic-bezier(.2,1.3,.4,1)');
// Szene 5: Liste, Funkeln, Hinweis
const s5=SC[5][0];
anim($('#li'),[{transform:'translateY(0)'},{transform:'translateY(-40px)'}],s5,SC[5][1]-s5,'linear');
[['#k1',.8],['#k2',1.1],['#k3',1.4]].forEach(([q,t])=>anim($(q),[{opacity:0,transform:'scale(.2) rotate(0)'},{opacity:1,transform:'scale(1.1) rotate(40deg)',offset:.5},{opacity:0,transform:'scale(.6) rotate(90deg)'}],s5+t,1.1,'ease-out'));
anim($('#b5'),[{opacity:0,transform:'translate(-50%,40px)'},{opacity:1,transform:'translate(-50%,0)'}],s5+2.0,.6,'cubic-bezier(.2,1.3,.4,1)');
// Szene 6: Produktansicht kommt hoch, Tipp auf „Bei Amazon ansehen“
const s6=SC[6][0];
anim($('#ph6'),[{transform:'translateY(260px)',opacity:0},{transform:'none',opacity:1}],s6+.3,.9,E);
anim($('#tp6'),[{opacity:0,transform:'scale(1.6)'},{opacity:1,transform:'scale(1)',offset:.4},{opacity:0,transform:'scale(1.3)'}],s6+3.0,.9,E);
anim($('#b6'),[{opacity:0,transform:'translate(-50%,40px)'},{opacity:1,transform:'translate(-50%,0)'}],s6+1.6,.6,'cubic-bezier(.2,1.3,.4,1)');
window.seek=t=>{tl.forEach(a=>{a.currentTime=Math.max(0,t*1000)})};
window.ready=document.fonts.ready.then(()=>true);
seek(0);
</script></body></html>`;

/* ---------------- Ablauf ---------------- */
const PORT = 4179;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' });
try {
  for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://localhost:${PORT}/app/`)).ok) break; } catch { /* noch nicht bereit */ } await new Promise(r => setTimeout(r, 500)); }
  await capture(`http://localhost:${PORT}`);
  console.log('Bildschirme aufgenommen');
  if (process.env.CAPTURE_ONLY) { console.log(JSON.stringify(GEO)); process.exit(0); }

  setupZoom();
  const html = reelHtml();
  writeFileSync(join(OUT, '_reel-zettel.html'), html);
  const browser = await chromium.launch();
  const rp = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await rp.setContent(html, { waitUntil: 'load' });
  await rp.evaluate(() => window.ready);
  await rp.waitForTimeout(300);
  const frames = join(OUT, '_frames');
  if (existsSync(frames)) rmSync(frames, { recursive: true });
  mkdirSync(frames);
  const only = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : null; // Vorschau einzelner Bilder (Sekunden)
  if (only) {
    for (const t of only) { await rp.evaluate(x => window.seek(x), t); await rp.screenshot({ path: join(OUT, `_vorschau-${String(t).replace('.', '_')}.png`) }); }
  } else {
    const n = Math.round(TOTAL * FPS);
    for (let f = 0; f < n; f++) {
      await rp.evaluate(t => window.seek(t), f / FPS);
      await rp.screenshot({ path: join(frames, `f${String(f).padStart(4, '0')}.png`) });
      if (f % 100 === 0) console.log('Reel-Bild', f, '/', n);
    }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(frames, 'f%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'slow', '-movflags', '+faststart', join(OUT, 'reel-wunschzettel.mp4')]);
    rmSync(frames, { recursive: true });
    console.log('Reel →', join(OUT, 'reel-wunschzettel.mp4'), `(${TOTAL}s)`);
  }
  await browser.close();
} finally { server.kill(); }
