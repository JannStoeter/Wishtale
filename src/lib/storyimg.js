/*
 * Wunschliste als Instagram-Story (Dev 140): ein Bild 1080×1920 mit den wichtigsten offenen Wünschen, dem eigenen Link und @wishtale.de.
 * Nur was Gäste ohnehin sehen (offen, nicht privat), nie Reservierungen. Alles entsteht im Browser, nichts wird hochgeladen.
 */
import { glyph } from './glyphcanvas.js';
import { wishIcon } from './wishicon.js';
import { IG_HANDLE } from './iglink.js';

const W = 1080, H = 1920, PAD = 80;
const C = { bg: '#FAF7F1', card: '#FFFFFF', ink: '#1F1B16', muted: '#5E564C', line: '#E6DDCD', gold: '#B8801F', green: '#2E3B2F', greenInk: '#F6F0E4', tint: '#E9EEE4' };
const DISP = '"Instrument Serif", Georgia, serif', BODY = '"Schibsted Grotesk Variable", "Schibsted Grotesk", system-ui, sans-serif';

/** Wünsche, die auf das Bild dürfen: offen, für alle mit Link, wichtigste zuerst. */
export function storyWishes(wishes) {
  const list = (wishes || []).filter(w => w.status === 'offen' && w.vis !== 'privat' && String(w.t || '').trim());
  return list.map((w, i) => [w, i]).sort((a, b) => (b[0].prio || 0) - (a[0].prio || 0) || a[1] - b[1]).map(([w]) => w);
}

/** Titel des Bildes, ohne Pronomen. */
export function storyTitle(me) {
  return me?.managed ? `Was sich ${me.name} wünscht` : 'Was ich mir wünsche';
}

function fit(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text; while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t.trimEnd() + '…';
}
function lines(ctx, text, maxW, max) {
  const out = []; let cur = '';
  for (const word of String(text).split(/\s+/)) {
    const next = cur ? cur + ' ' + word : word;
    if (ctx.measureText(next).width <= maxW || !cur) cur = next; else { out.push(cur); cur = word; }
  }
  if (cur) out.push(cur);
  if (out.length > max) { out.length = max; out[max - 1] = fit(ctx, out[max - 1] + ' …', maxW); }
  return out;
}

/** Zeichnet das Bild und liefert eine PNG-Datei. `url` ist der Link zur Liste (ohne https). */
export async function storyImage(me, url) {
  try { await Promise.all([document.fonts.load(`110px ${DISP}`), document.fonts.load(`500 44px ${BODY}`)]); } catch { /* Ersatzschrift */ }
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = 'alphabetic';

  // Kopf: Marke, Kennung, Überschrift
  ctx.fillStyle = C.ink; ctx.font = `64px ${DISP}`; ctx.fillText('Wishtale', PAD, 250);
  ctx.fillStyle = C.gold; ctx.font = `600 30px ${BODY}`;
  ctx.fillText((me?.occasion ? 'WUNSCHLISTE' : me?.managed ? 'KINDER-WUNSCHLISTE' : 'MEINE WUNSCHLISTE').split('').join(String.fromCharCode(8202)), PAD, 420);
  ctx.fillStyle = C.ink; ctx.font = `118px ${DISP}`;
  const head = lines(ctx, me?.occasion ? me.name : storyTitle(me), W - PAD * 2, 2);
  head.forEach((l, i) => ctx.fillText(l, PAD, 540 + i * 118));
  let y = 540 + (head.length - 1) * 118 + 80;

  // Wünsche als weiße Karten
  const all = storyWishes(me?.wishes), show = all.slice(0, head.length > 1 ? 3 : 4), cardH = 148, gap = 22;
  for (const w of show) {
    ctx.fillStyle = C.card; ctx.strokeStyle = C.line; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(PAD, y, W - PAD * 2, cardH, 32); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.tint; ctx.beginPath(); ctx.arc(PAD + 34 + 42, y + cardH / 2, 42, 0, Math.PI * 2); ctx.fill();
    glyph(ctx, wishIcon(w.t, w.c), PAD + 34 + 42 - 24, y + cardH / 2 - 24, 48, C.green);
    ctx.fillStyle = C.ink; ctx.font = `500 42px ${BODY}`;
    ctx.fillText(fit(ctx, String(w.t).trim(), W - PAD * 2 - 300), PAD + 150, y + cardH / 2 + 15);
    ctx.fillStyle = C.gold; for (let n = 0; n < 3; n++) { ctx.globalAlpha = n < (w.prio || 0) ? 1 : 0.22; ctx.beginPath(); ctx.arc(W - PAD - 92 + n * 26, y + cardH / 2, 8, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
    y += cardH + gap;
  }
  if (!show.length) {
    ctx.fillStyle = C.muted; ctx.font = `44px ${BODY}`;
    lines(ctx, 'Meine Liste füllt sich gerade, schau gern bald vorbei.', W - PAD * 2, 2).forEach((l, i) => ctx.fillText(l, PAD, y + 40 + i * 58));
    y += 140;
  }
  if (all.length > show.length) {
    const more = all.length - show.length;
    ctx.fillStyle = C.muted; ctx.font = `40px ${BODY}`;
    ctx.fillText(`Und ${more} ${more === 1 ? 'weiterer Wunsch steht' : 'weitere Wünsche stehen'} noch auf der Liste`, PAD, y + 36);
  }

  // Unten: Link-Kasten, Hinweis auf Reservieren, Absender
  const boxY = H - 500;
  ctx.fillStyle = C.green; ctx.beginPath(); ctx.roundRect(PAD, boxY, W - PAD * 2, 200, 40); ctx.fill();
  ctx.fillStyle = C.greenInk; ctx.font = `38px ${BODY}`;
  ctx.fillText('Reservieren geht ganz ohne Konto', PAD + 56, boxY + 82);
  ctx.font = `600 46px ${BODY}`; ctx.fillText(fit(ctx, url, W - PAD * 2 - 112), PAD + 56, boxY + 148);
  ctx.fillStyle = C.muted; ctx.font = `36px ${BODY}`; ctx.textAlign = 'center';
  ctx.fillText(`Gemacht mit Wishtale · @${IG_HANDLE}`, W / 2, H - 240);
  ctx.textAlign = 'left';

  const blob = await new Promise(res => cv.toBlob(res, 'image/png'));
  return blob ? new File([blob], 'wishtale-wunschliste.png', { type: 'image/png' }) : null;
}
