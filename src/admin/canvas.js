/* Zeichnet Instagram-Folien (1080 x 1350) direkt auf ein Canvas. Keine Fremdbibliothek, Schriften kommen von der eigenen Domain. */
import { drawPhone } from './scenes.js';
export const W = 1080, H = 1350, PAD = 84;
export const THEMES = {
  creme: { bg: '#F3EDE2', ink: '#1F1B16', muted: '#5E564C', gold: '#B8801F', chip: '#FBF8F1', line: '#DDD3C2', on: '#2E3B2F', onInk: '#F6F0E4' },
  gruen: { bg: '#2E3B2F', ink: '#F6F0E4', muted: '#C9D3BD', gold: '#D9A441', chip: '#3A4A3B', line: '#4B5E4C', on: '#D9A441', onInk: '#1F1B16' },
};
export const TYPES = { cover: 'Titel', chips: 'Auswahl (Chips)', quote: 'Zitat', photo: 'Foto', screen: 'App-Ansicht (Handy)', cta: 'Abschluss' };
export const DISP = '"Instrument Serif", Georgia, serif', BODY = '"Schibsted Grotesk Variable", "Schibsted Grotesk", system-ui, sans-serif';

export async function loadFonts() {
  await Promise.all([
    document.fonts.load(`400 100px ${DISP}`), document.fonts.load(`italic 400 56px ${DISP}`),
    document.fonts.load(`400 40px ${BODY}`), document.fonts.load(`600 30px ${BODY}`),
  ]).catch(() => {});
}

function wrap(ctx, text, maxW) {
  const out = [];
  for (const para of String(text || '').split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const t = line ? line + ' ' + word : word;
      if (ctx.measureText(t).width > maxW && line) { out.push(line); line = word; } else line = t;
    }
    out.push(line);
  }
  return out;
}
const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };

/** Berechnet Schriftgröße und Zeilen so, dass der Titel in maxLines passt. */
function fitTitle(ctx, text, maxW, maxLines, from, to) {
  for (let s = from; s >= to; s -= 4) {
    ctx.font = `400 ${s}px ${DISP}`;
    const lines = wrap(ctx, text, maxW);
    if (lines.length <= maxLines) return { size: s, lines };
  }
  ctx.font = `400 ${to}px ${DISP}`;
  return { size: to, lines: wrap(ctx, text, maxW).slice(0, maxLines) };
}

export const FORMATS = { post: { label: 'Beitrag (Karussell)', w: 1080, h: 1350 }, story: { label: 'Story', w: 1080, h: 1920 }, reel: { label: 'Reel (Video)', w: 1080, h: 1920 } };

/** opts.format: 'post' (4:5), 'story' oder 'reel' (9:16, mit Rand für die Instagram-Bedienelemente oben und unten). */
export function drawSlide(canvas, s, index, total, opts = {}) {
  const fmt = opts.format || 'post', tall = fmt !== 'post', H = tall ? 1920 : 1350, TOP = tall ? 170 : 0, BOT = tall ? 250 : 0;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d'), th = THEMES[s.theme] || THEMES.creme, cw = W - PAD * 2;
  ctx.fillStyle = th.bg; ctx.fillRect(0, 0, W, H);

  // Kopf: Logo und Seitenzahl
  ctx.textBaseline = 'alphabetic'; ctx.fillStyle = th.ink; ctx.font = `400 58px ${DISP}`;
  ctx.fillText('wishtale', PAD, 140 + TOP);
  const lw = ctx.measureText('wishtale').width;
  ctx.fillStyle = th.gold; ctx.beginPath(); ctx.arc(PAD + lw + 14, 134 + TOP, 7, 0, Math.PI * 2); ctx.fill();
  if (!tall && total > 1 && s.type !== 'cta') { ctx.fillStyle = th.muted; ctx.font = `500 30px ${BODY}`; ctx.textAlign = 'right'; ctx.fillText(`${index + 1} / ${total}`, W - PAD, 136); ctx.textAlign = 'left'; }

  if (s.type === 'screen') { screenSlide(ctx, s, th, { H, TOP, BOT, tall, cw, last: index >= total - 1 }); return; }

  // Inhalt vorbereiten, damit er senkrecht mittig steht
  const blocks = [];
  const eyebrow = (s.eyebrow || '').toUpperCase();
  if (eyebrow) blocks.push({ h: 30, draw: y => { ctx.fillStyle = th.muted; ctx.font = `600 26px ${BODY}`; try { ctx.letterSpacing = '4px'; } catch { /* ältere Browser */ } ctx.fillText(eyebrow, PAD, y + 26); try { ctx.letterSpacing = '0px'; } catch { /* */ } } });
  const big = s.type === 'cta' || s.type === 'cover';
  const t = fitTitle(ctx, s.title, cw, s.type === 'photo' ? 3 : 5, big ? 148 : 112, 60);
  const tl = Math.round(t.size * 0.98);
  blocks.push({ h: t.lines.length * tl, gap: 30, draw: y => { ctx.fillStyle = th.ink; ctx.font = `400 ${t.size}px ${DISP}`; t.lines.forEach((l, i) => ctx.fillText(l, PAD, y + t.size * 0.82 + i * tl)); } });

  if (s.type === 'photo') {
    ctx.font = `400 40px ${BODY}`;
    const subH = s.sub ? wrap(ctx, s.sub, cw).length * 56 + 34 : 0;
    const ph = Math.max(220, Math.min(tall ? 820 : 470, (H - 210 - 190 - TOP - BOT) - (eyebrow ? 60 : 0) - t.lines.length * tl - 30 - 34 - subH));
    blocks.push({ h: ph, gap: 34, draw: y => {
      ctx.save(); rr(ctx, PAD, y, cw, ph, 36); ctx.clip();
      if (opts.image) { const r = Math.max(cw / opts.image.width, ph / opts.image.height), iw = opts.image.width * r, ih = opts.image.height * r; ctx.drawImage(opts.image, PAD + (cw - iw) / 2, y + (ph - ih) / 2, iw, ih); }
      else { ctx.fillStyle = th.chip; ctx.fillRect(PAD, y, cw, ph); ctx.fillStyle = th.muted; ctx.font = `500 34px ${BODY}`; ctx.textAlign = 'center'; ctx.fillText('Foto auswählen', W / 2, y + ph / 2 + 12); ctx.textAlign = 'left'; }
      ctx.restore();
    } });
  }
  if (s.type === 'quote' && s.quote) {
    ctx.font = `italic 400 58px ${DISP}`; const ql = wrap(ctx, '„' + s.quote + '“', cw - 40);
    blocks.push({ h: ql.length * 66, gap: 36, draw: y => { ctx.fillStyle = th.gold; ctx.fillRect(PAD, y + 6, 6, ql.length * 66 - 12); ctx.fillStyle = th.ink; ctx.font = `italic 400 58px ${DISP}`; ql.forEach((l, i) => ctx.fillText(l, PAD + 40, y + 48 + i * 66)); } });
  }
  if (s.sub) {
    ctx.font = `400 40px ${BODY}`; const sl = wrap(ctx, s.sub, cw);
    blocks.push({ h: sl.length * 56, gap: 34, draw: y => { ctx.fillStyle = th.muted; ctx.font = `400 40px ${BODY}`; sl.forEach((l, i) => ctx.fillText(l, PAD, y + 40 + i * 56)); } });
  }
  if (s.type === 'chips' && (s.chips || []).length) {
    ctx.font = `500 34px ${BODY}`;
    const rows = []; let row = [], rw = 0;
    for (const raw of s.chips) {
      const on = raw.startsWith('*'), label = raw.replace(/^\*/, ''), w = ctx.measureText(label).width + 68;
      if (rw + w > cw && row.length) { rows.push(row); row = []; rw = 0; }
      row.push({ label, on, w }); rw += w + 16;
    }
    if (row.length) rows.push(row);
    blocks.push({ h: rows.length * 92 - 16, gap: 44, draw: y => rows.forEach((r, ri) => { let x = PAD; r.forEach(c => {
      rr(ctx, x, y + ri * 92, c.w, 76, 38); ctx.fillStyle = c.on ? th.on : th.chip; ctx.fill();
      if (!c.on) { ctx.strokeStyle = th.line; ctx.lineWidth = 2; ctx.stroke(); }
      ctx.fillStyle = c.on ? th.onInk : th.ink; ctx.font = `500 34px ${BODY}`; ctx.fillText(c.label, x + 34, y + ri * 92 + 50); x += c.w + 16;
    }); }) });
  }
  if (s.type === 'cta' && (s.handle || s.domain)) {
    blocks.push({ h: 50, gap: 44, draw: y => { ctx.fillStyle = th.ink; ctx.font = `600 44px ${BODY}`; const a = s.handle || ''; ctx.fillText(a, PAD, y + 42); const aw = ctx.measureText(a).width; ctx.font = `400 44px ${BODY}`; ctx.fillText((a && s.domain ? '  ·  ' : '') + (s.domain || ''), PAD + aw, y + 42); } });
  }
  const total_h = blocks.reduce((a, b, i) => a + b.h + (i ? blocks[i - 1].gap || 24 : 0), 0);
  let y = Math.max(210 + TOP, 210 + TOP + (H - 210 - 190 - TOP - BOT - total_h) / 2);
  blocks.forEach((b, i) => { b.draw(y); y += b.h + (b.gap || 24); });

  // Fuß
  ctx.fillStyle = th.muted; ctx.font = `400 32px ${BODY}`;
  ctx.fillText(s.footer ?? 'Jeder Wunsch hat eine Geschichte.', PAD, H - 96 - BOT);
  if (!tall && index < total - 1) { ctx.strokeStyle = th.ink; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(W - PAD - 44, H - 106); ctx.lineTo(W - PAD, H - 106); ctx.moveTo(W - PAD - 16, H - 122); ctx.lineTo(W - PAD, H - 106); ctx.lineTo(W - PAD - 16, H - 90); ctx.stroke(); }
}

/** Folie mit App-Ansicht: Text oben, darunter ein Handy mit einer Szene aus scenes.js, das unten aus dem Bild läuft. */
function screenSlide(ctx, s, th, { H, TOP, BOT, tall, cw, last }) {
  let y = 200 + TOP;
  const eyebrow = (s.eyebrow || '').toUpperCase();
  if (eyebrow) { ctx.fillStyle = th.muted; ctx.font = `600 26px ${BODY}`; try { ctx.letterSpacing = '4px'; } catch { /* ältere Browser */ } ctx.fillText(eyebrow, PAD, y + 26); try { ctx.letterSpacing = '0px'; } catch { /* */ } y += 56; }
  const t = fitTitle(ctx, s.title, cw, 3, tall ? 104 : 92, 56), tl = Math.round(t.size * 0.98);
  ctx.fillStyle = th.ink; ctx.font = `400 ${t.size}px ${DISP}`; t.lines.forEach((l, i) => ctx.fillText(l, PAD, y + t.size * 0.82 + i * tl)); y += t.lines.length * tl;
  if (s.sub) { ctx.font = `400 36px ${BODY}`; const sl = wrap(ctx, s.sub, cw).slice(0, 2); ctx.fillStyle = th.muted; sl.forEach((l, i) => ctx.fillText(l, PAD, y + 30 + 36 + i * 50)); y += 30 + sl.length * 50; }
  const pw = tall ? 700 : 620, px = (W - pw) / 2, py = y + (tall ? 70 : 54);
  drawPhone(ctx, s.scene, px, py, pw, H - BOT - py, H);
  if (!tall && !last) { ctx.fillStyle = th.bg; ctx.beginPath(); ctx.arc(W - PAD - 22, H - 106, 40, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = th.ink; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(W - PAD - 44, H - 106); ctx.lineTo(W - PAD, H - 106); ctx.moveTo(W - PAD - 16, H - 122); ctx.lineTo(W - PAD, H - 106); ctx.lineTo(W - PAD - 16, H - 90); ctx.stroke(); }
}

export const blank = type => ({
  type, theme: type === 'cta' ? 'gruen' : 'creme', eyebrow: '', title: type === 'cta' ? 'Dein Wishtale wartet schon auf dich' : 'Neue Folie',
  sub: '', quote: '', chips: [], scene: type === 'screen' ? 'liste' : '', handle: type === 'cta' ? '@wishtale.de' : '', domain: type === 'cta' ? 'wishtale.de' : '',
});

export const blob = (canvas, type = 'image/png', q) => new Promise(res => canvas.toBlob(res, type, q));
