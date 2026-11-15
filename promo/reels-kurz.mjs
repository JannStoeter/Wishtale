/*
 * Drei kurze Reels mit Aufhänger im ersten Bild (Dev 087), weil das lange Wunschzettel-Reel fast immer übersprungen wurde.
 *   promo/out/reel-a-geschenk.mp4    „Was du dir gewünscht hast / was du bekommen hast“
 *   promo/out/reel-b-zettel.mp4      „Wunschzettel abtippen? fotografieren“
 *   promo/out/reel-c-pov.mp4         „POV: Mia schickt dir ihren Wishtale-Link“
 * 1080x1920, 30 fps, ohne Ton (Musik in der Instagram-App ergänzen). Gleiche Beispielperson Mia wie Reel und Landingpage.
 * Braucht die Aufnahmen aus `npm run promo:zettel` (promo/out/_shots) und nimmt die Gastansicht selbst auf.
 * Aufruf: npm run promo:kurz   (einzelnes Reel: REEL=a, Vorschaubilder: ONLY=0.3,2,5)
 */
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const OUT = join(here, 'out'), SHOTS = join(OUT, '_shots');
for (const f of ['ergebnis.png', 'liste.png', 'produkt.png', 'freunde.png', 'wunschzettel.jpg'])
  if (!existsSync(join(SHOTS, f))) throw new Error(`Aufnahme ${f} fehlt: bitte zuerst CAPTURE_ONLY=1 npm run promo:zettel ausführen.`);

const font = (pkg, file) => readFileSync(join(root, 'node_modules', pkg, 'files', file)).toString('base64');
const FACES = `
@font-face{font-family:"Instrument Serif";font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${font('@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff2')}) format("woff2")}
@font-face{font-family:"Instrument Serif";font-style:italic;font-weight:400;src:url(data:font/woff2;base64,${font('@fontsource/instrument-serif', 'instrument-serif-latin-400-italic.woff2')}) format("woff2")}
@font-face{font-family:"Schibsted";font-weight:400 900;src:url(data:font/woff2;base64,${font('@fontsource-variable/schibsted-grotesk', 'schibsted-grotesk-latin-wght-normal.woff2')}) format("woff2")}`;
const img = (f, type = 'png') => `data:image/${type};base64,` + readFileSync(join(SHOTS, f)).toString('base64');
const photo = k => 'data:image/jpeg;base64,' + readFileSync(join(root, 'public/photos', `${k}-1200.jpg`)).toString('base64');

/* ---------------- Gastansicht von Mia (für Reel C) ---------------- */
const STORE = 'https://uzercrfhieipplgrjbvk.supabase.co/storage/v1/object/public/wish-images/demo/';
async function captureGuest(base) {
  const browser = await chromium.launch();
  try {
    const p = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
    const W = (id, title, prio, extra = {}) => ({ id, title, kind: 'produkt', prio, note: '', link: '', price: null, budget: null, category: 'wohnen', occ: [], status: 'offen', kw: [], tone: 0, img_url: '', img_src: '', reserved: false, mine: false, bought: false, ...extra });
    const mia = {
      id: '00000000-0000-0000-0000-0000000000a1', handle: 'mia-ab12cd', name: 'Mia', managed: false, tone: 0,
      about: 'Ich koche gern für Freunde, bin am Wochenende in den Bergen unterwegs und lese abends gern ein gutes Buch.',
      interests: ['Kochen', 'Wandern', 'Lesen'], cats: [], brands: ['Le Creuset', 'Patagonia'], tries: ['Töpferkurs'], nogos: ['Duftkerzen'], alts: [], style: [], social: {},
      wishes: [
        W('00000000-0000-0000-0000-0000000000b1', 'Le Creuset Signature Bräter rund, 24 cm', 3, { price: 259, category: 'kochen', img_url: STORE + 'pot.jpg', link: 'https://www.amazon.de/s?k=Le+Creuset+Signature+Br%C3%A4ter&tag=jannst-21' }),
        W('00000000-0000-0000-0000-0000000000b2', 'Sony WH-1000XM5 Kabellose Kopfhörer', 3, { price: 299, category: 'technik', img_url: STORE + 'headphones.jpg', link: 'https://www.amazon.de/s?k=Sony+WH-1000XM5&tag=jannst-21' }),
        W('00000000-0000-0000-0000-0000000000b3', 'Ein Buch zum Schmökern', 2, { category: 'buecher' }),
        W('00000000-0000-0000-0000-0000000000b4', 'Wanderstöcke', 2, { category: 'outdoor' }),
        W('00000000-0000-0000-0000-0000000000b5', 'Eine schöne Thermoskanne', 2, { category: 'outdoor' }),
      ],
      hidden: [], gifts: [],
    };
    let reserved = false;
    // Playwright prüft zuletzt angelegte Regeln zuerst: allgemeine Regeln zuerst, die genaue zuletzt
    await p.route(/rest\/v1\//, r => r.fulfill({ json: [] }));
    await p.route(/rest\/v1\/rpc\//, r => r.fulfill({ json: null }));
    await p.route(/rest\/v1\/rpc\/public_profile/, r => r.fulfill({ json: reserved ? { ...mia, wishes: mia.wishes.map((w, i) => i === 1 ? { ...w, reserved: true, mine: true } : w) } : mia }));
    await p.route(/\/api\/account\?op=reserve/, r => { reserved = true; return r.fulfill({ json: { ok: true } }); });
    await p.route(/\/api\/ideas\?/, r => r.fulfill({ json: { ideas: [] } }));
    await p.route(/storage\/v1\/object\/public\/wish-images\/demo\/(\w+)\.jpg/, r => { const k = r.request().url().match(/demo\/(\w+)\.jpg/)[1]; return r.fulfill({ contentType: 'image/jpeg', body: readFileSync(join(root, 'public/photos', `${k}-600.jpg`)) }); });
    await p.goto(base + '/app/#p/mia-ab12cd');
    await p.waitForTimeout(2200);
    await p.screenshot({ path: join(SHOTS, 'gast-oben.png') });
    await p.locator('.wrow, .wcard', { hasText: 'Sony' }).first().click();
    await p.waitForTimeout(900);
    await p.screenshot({ path: join(SHOTS, 'gast-detail.png') });
    await p.locator('[data-act=choose], [data-act=reserve]').first().click();
    await p.waitForTimeout(1600);
    await p.screenshot({ path: join(SHOTS, 'gast-reserviert.png') });
  } finally { await browser.close(); }
}

/* ---------------- Gemeinsamer Rahmen ---------------- */
const W = 1080, H = 1920, FPS = 30;
const CSS = `${FACES}
*{box-sizing:border-box}html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#F3EDE2;font-family:"Schibsted",system-ui,sans-serif;color:#1F1B16}
.sc{position:absolute;inset:0;overflow:hidden;opacity:0}
.cream{background:#F3EDE2}.green{background:#2E3B2F;color:#F6F0E4}.ink{background:#1F1B16;color:#F6F0E4}
.cap{position:absolute;left:70px;right:70px;top:230px;z-index:5;text-align:center}
.box{display:inline;font-weight:800;font-size:76px;line-height:1.28;padding:6px 22px;-webkit-box-decoration-break:clone;box-decoration-break:clone;border-radius:14px;background:#1F1B16;color:#fff}
.box.gold{background:#D9A441;color:#1F1B16}.box.rust{background:#A5402A;color:#fff}.box.light{background:#fff;color:#1F1B16}
.big{font-family:"Instrument Serif",serif;font-weight:400;font-size:150px;line-height:.98;letter-spacing:-.015em;margin:0}
.big em{font-style:italic;color:#D9A441}
.card{position:absolute;left:150px;right:150px;top:640px;background:#fff;border-radius:44px;overflow:hidden;box-shadow:0 40px 80px rgba(40,30,10,.25)}
.card img{display:block;width:100%;height:620px;object-fit:cover}
.card p{margin:0;padding:30px 40px 38px;font-size:56px;font-weight:700;text-align:center}
.phone{position:absolute;left:170px;top:560px;width:740px;border:20px solid #1b1f1c;border-radius:84px;background:#1b1f1c;overflow:hidden;box-shadow:0 40px 90px rgba(20,25,20,.45)}
.phone .screen{position:relative;width:700px;height:1500px;border-radius:64px;overflow:hidden;background:#F3EDE2}
.phone img{display:block;width:700px;position:absolute;left:0;top:0}
.logo{font-family:"Instrument Serif",serif;font-size:130px;letter-spacing:-.02em}.logo i{display:inline-block;width:22px;height:22px;border-radius:50%;background:#D9A441;margin-left:6px}
.center{position:absolute;left:80px;right:80px;top:50%;transform:translateY(-50%);text-align:center}
.sub{font-size:52px;line-height:1.3;color:#C9D3BD;margin:36px 0 0}
.pill{display:inline-block;background:#D9A441;color:#1F1B16;font-weight:800;font-size:52px;padding:26px 54px;border-radius:99px;margin-top:56px}
.tag{display:inline-block;background:#D9A441;color:#1F1B16;font-weight:800;font-size:36px;letter-spacing:.1em;text-transform:uppercase;padding:14px 28px;border-radius:99px;margin-bottom:36px}
.tap{position:absolute;width:130px;height:130px;border-radius:50%;background:rgba(217,164,65,.45);border:7px solid #D9A441;z-index:7;opacity:0}
.strike{position:relative;display:inline-block}
.strike::after{content:"";position:absolute;left:-6px;right:-6px;top:52%;height:10px;background:#A5402A;transform-origin:left;transform:scaleX(var(--s,0))}
.zettel{position:absolute;left:60px;top:520px;width:960px;transform:rotate(-2deg)}
.zettel img{width:100%;display:block;border-radius:10px;box-shadow:0 30px 60px rgba(60,40,10,.3)}
.scan{position:absolute;left:0;right:0;height:12px;background:linear-gradient(90deg,transparent,#D9A441,transparent);box-shadow:0 0 50px 18px rgba(217,164,65,.6);z-index:6;opacity:0}
.timer{position:absolute;right:90px;top:470px;z-index:8;background:#2E3B2F;color:#F6F0E4;font-weight:800;font-size:54px;padding:18px 34px;border-radius:99px}
.timer b{color:#D9A441}
`;
/** Zeitleiste: Szenen schneiden hart (0,12 s Überblendung), jede Szene beginnt schon sichtbar, damit das erste Bild nie leer ist. */
const JS = (scenes, extra) => `
const SC=${JSON.stringify(scenes)}, tl=[];const $=s=>document.querySelector(s);
function anim(el,kf,start,dur,ease,fill){if(!el)return;const a=el.animate(kf,{duration:dur*1000,delay:start*1000,fill:fill||'both',easing:ease||'cubic-bezier(.2,.8,.2,1)'});a.pause();tl.push(a)}
SC.forEach(([s,e],i)=>{const el=$('#s'+i),d=e-s,f=.12,last=i===SC.length-1;
  anim(el,[{opacity:i===0?1:0,offset:0},{opacity:1,offset:Math.min(.5,f/d)},{opacity:1,offset:last?1:1-f/d},{opacity:last?1:0,offset:1}],s,d,'linear');
  el.querySelectorAll('.pop').forEach((u,j)=>anim(u,[{transform:'scale(1.12)',opacity:i===0?1:0},{transform:'scale(1)',opacity:1}],s+(i===0?0:.08+j*.18),.35,'cubic-bezier(.2,1.3,.4,1)'));
  el.querySelectorAll('.zoom').forEach(u=>anim(u,[{transform:'scale(1)'},{transform:'scale(1.06)'}],s,d,'linear'));
});
${extra}
window.seek=t=>{tl.forEach(a=>{a.currentTime=Math.max(0,t*1000)})};
window.ready=document.fonts.ready.then(()=>true);seek(0);`;
const page = (body, scenes, extra = '') => `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}<script>${JS(scenes, extra)}</script></body></html>`;
const phone = (src, id = '') => `<div class="phone pop"><div class="screen"><img ${id ? `id="${id}"` : ''} src="${src}" alt=""></div></div>`;
const cta = (i, head, sub) => `<section class="sc green" id="s${i}"><div class="center"><div class="logo pop">wishtale<i></i></div><p class="big pop" style="font-size:120px;margin-top:40px">${head}</p><p class="sub pop">${sub}</p><span class="pill pop">wishtale.de</span></div></section>`;

/* ---------------- Reel A: Geschenk-Fail ---------------- */
const reelA = () => {
  const SC = [[0, 1.6], [1.6, 3.2], [3.2, 4.6], [4.6, 6.6], [6.6, 8.6], [8.6, 11]];
  return { name: 'reel-a-geschenk', total: 11, html: page(`
<section class="sc cream" id="s0"><div class="cap"><span class="box pop">Was du dir gewünscht hast</span></div><div class="card zoom"><img src="${photo('headphones')}" alt=""><p>Diese Kopfhörer</p></div></section>
<section class="sc cream" id="s1"><div class="cap"><span class="box rust pop">Was du bekommen hast</span></div><div class="card zoom" id="mug"><img src="${photo('mug')}" alt=""><p>Die fünfte Tasse</p></div></section>
<section class="sc ink" id="s2"><div class="center"><p class="big pop">Das geht auch <em>anders</em>.</p></div></section>
<section class="sc cream" id="s3"><div class="cap"><span class="box pop">Deine Wunschliste mit allem, was dich ausmacht</span></div>${phone(img('liste.png'), 'li')}</section>
<section class="sc cream" id="s4"><div class="cap"><span class="box gold pop">Ein Link, und Freunde schenken, was passt</span></div>${phone(img('freunde.png'), 'fr')}</section>
${cta(5, 'Die Wunschliste, die <em>dich</em> kennt.', 'Kostenlos und ohne App-Download')}`, SC, `
anim($('#mug'),[{transform:'rotate(0)'},{transform:'rotate(-3deg)',offset:.25},{transform:'rotate(3deg)',offset:.5},{transform:'rotate(-2deg)',offset:.75},{transform:'rotate(0)'}],SC[1][0]+.3,.5,'linear');
anim($('#li'),[{transform:'translateY(0)'},{transform:'translateY(-120px)'}],SC[3][0],2,'ease-in-out');
anim($('#fr'),[{transform:'translateY(0)'},{transform:'translateY(-260px)'}],SC[4][0]+.3,1.7,'ease-in-out');`) };
};

/* ---------------- Reel B: Zettel fotografieren ---------------- */
const reelB = () => {
  const SC = [[0, 2.4], [2.4, 4.8], [4.8, 7.0], [7.0, 9.6]];
  return { name: 'reel-b-zettel', total: 9.6, html: page(`
<section class="sc cream" id="s0"><div class="cap" style="top:200px"><span class="box pop">Zettel <span class="strike" id="st">abtippen</span>?</span><div style="height:30px"></div><span class="box gold" id="foto" style="opacity:0">Einfach fotografieren</span></div><div class="zettel zoom"><img src="${img('wunschzettel.jpg', 'jpeg')}" alt=""></div></section>
<section class="sc cream" id="s1"><div class="cap"><span class="box pop">Wishtale liest alles heraus</span></div><div class="timer pop" id="tm"><b>Ein Foto</b> genügt</div><div class="phone pop"><div class="screen"><img id="er" src="${img('ergebnis.png')}" alt=""><div class="scan" id="sc"></div></div></div></section>
<section class="sc cream" id="s2"><div class="cap"><span class="box gold pop">Mit Produkt, Bild und Preis</span></div>${phone(img('liste.png'), 'li')}</section>
${cta(3, 'Jetzt neu: <em>Wunschzettel</em> hochladen', 'Fertig ist die Wunschliste zum Teilen')}`, SC, `
anim($('#st'),[{'--s':0},{'--s':1}],.9,.35,'ease-out');
anim($('#foto'),[{opacity:0,transform:'scale(1.15)'},{opacity:1,transform:'scale(1)'}],1.3,.35,'cubic-bezier(.2,1.3,.4,1)');
anim($('#er'),[{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)'}],SC[1][0]+.3,1.5,'ease-in-out');
anim($('#sc'),[{top:'0px',opacity:1},{top:'1490px',opacity:1,offset:.95},{top:'1490px',opacity:0}],SC[1][0]+.3,1.5,'ease-in-out');
anim($('#li'),[{transform:'translateY(0)'},{transform:'translateY(-120px)'}],SC[2][0],2.2,'ease-in-out');`) };
};

/* ---------------- Reel C: POV Gast ---------------- */
const reelC = () => {
  const SC = [[0, 2.4], [2.4, 4.8], [4.8, 7.4], [7.4, 10]];
  return { name: 'reel-c-pov', total: 10, html: page(`
<section class="sc cream" id="s0"><div class="cap" style="top:200px"><span class="box pop">POV: Mia schickt dir ihren Wishtale-Link</span></div>${phone(img('gast-oben.png'))}</section>
<section class="sc cream" id="s1"><div class="cap"><span class="box pop">Alles, was Mia sich wünscht, auf einer Seite</span></div>${phone(img('gast-oben.png'), 'go')}</section>
<section class="sc cream" id="s2"><div class="cap"><span class="box gold pop">Reservieren, und Mia erfährt nichts davon</span></div><div class="phone pop"><div class="screen"><img src="${img('gast-detail.png')}" alt=""><img id="rv" src="${img('gast-reserviert.png')}" alt="" style="opacity:0"><span class="tap" id="tp" style="left:460px;top:1066px"></span></div></div></section>
${cta(3, 'Und wann schickst du <em>deinen</em> Link?', 'Deine Wunschliste, kostenlos und in wenigen Minuten')}`, SC, `
anim($('#go'),[{transform:'translateY(0)'},{transform:'translateY(-300px)'}],SC[1][0]+.2,2,'ease-in-out');
anim($('#tp'),[{opacity:0,transform:'scale(1.6)'},{opacity:1,transform:'scale(1)',offset:.4},{opacity:0,transform:'scale(1.3)'}],SC[2][0]+.7,.7,'cubic-bezier(.2,.8,.2,1)');
anim($('#rv'),[{opacity:0},{opacity:1}],SC[2][0]+1.25,.2,'linear');`) };
};

/* ---------------- Ablauf ---------------- */
const PORT = 4181;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' });
try {
  for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://localhost:${PORT}/app/`)).ok) break; } catch { /* noch nicht bereit */ } await new Promise(r => setTimeout(r, 500)); }
  await captureGuest(`http://localhost:${PORT}`);
  console.log('Gastansicht aufgenommen');
  const browser = await chromium.launch();
  const reels = [reelA, reelB, reelC].map(f => f()).filter(r => !process.env.REEL || r.name.includes('-' + process.env.REEL + '-'));
  for (const r of reels) {
    const p = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    await p.setContent(r.html, { waitUntil: 'load' });
    await p.evaluate(() => window.ready);
    await p.waitForTimeout(300);
    const only = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : null;
    if (only) {
      for (const t of only) { await p.evaluate(x => window.seek(x), t); await p.screenshot({ path: join(OUT, `_${r.name}-${String(t).replace('.', '_')}.png`) }); }
      continue;
    }
    const frames = join(OUT, '_frames-' + r.name);
    if (existsSync(frames)) rmSync(frames, { recursive: true });
    mkdirSync(frames);
    const n = Math.round(r.total * FPS);
    for (let f = 0; f < n; f++) { await p.evaluate(t => window.seek(t), f / FPS); await p.screenshot({ path: join(frames, `f${String(f).padStart(4, '0')}.png`) }); }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(frames, 'f%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', join(OUT, r.name + '.mp4')]);
    rmSync(frames, { recursive: true });
    console.log('Reel →', join(OUT, r.name + '.mp4'), `(${r.total}s)`);
    await p.close();
  }
  await browser.close();
} finally { server.kill(); }
