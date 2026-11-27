/*
 * App-Szenen für Instagram-Folien (Art „App-Ansicht“): ein schlicht gezeichnetes Handy mit einer echten Funktion von Wishtale.
 * Gezeichnet wird alles auf dem Canvas, ohne Bildschirmfotos und ohne echte Personendaten. Die Namen sind Beispiele.
 * Neue Szene = ein Eintrag in SCENES. Nur Funktionen zeigen, die es wirklich gibt.
 * Bausteine (k): bar, h, tabs, search, label, chips, row, zone, link, note, arrow, button, gap, toast.
 */
import { glyph } from '../lib/glyphcanvas.js';

const C = {
  bg: '#FAF7F1', card: '#FFFFFF', line: '#E9E1D3', ink: '#1F1B16', muted: '#6B6358', green: '#2E3B2F', onGreen: '#F6F0E4',
  gold: '#B8801F', zone: '#ECF1E8', soft: '#F1ECE2',
};
// Kategorietöne wie in der App (.art.mono.t0 bis t5)
const TONE = [['#F4DCCB', '#8A3E22'], ['#D7E6DA', '#2D5A3B'], ['#DCE6F3', '#2E557A'], ['#EADDF0', '#5B3772'], ['#F6E6BF', '#80580F'], ['#F7D9DE', '#8C3346']];
const BADGE = { res: ['#E3EDE3', '#2D5A3B'], mine: ['#F6E6BF', '#80580F'], priv: ['#EFEAE0', '#5E564C'], tip: ['#E6EDF6', '#2E557A'] };
const DISP = '"Instrument Serif", Georgia, serif', BODY = '"Schibsted Grotesk Variable", "Schibsted Grotesk", system-ui, sans-serif';

const r = (t, s, g, tone, more = {}) => ({ k: 'row', t, s, g, tone, ...more });

export const SCENES = {
  liste: { label: 'Eigene Wunschliste', avatar: 'M', blocks: [
    { k: 'bar' }, { k: 'h', t: 'Mias Wunschliste', s: '5 offene Wünsche' },
    r('Handkaffeemühle', 'Küche', 'mug', 4, { right: 'ca. 45 €' }),
    r('Keramikkurs', 'Erlebnis', 'gift', 0, { right: 'ca. 90 €' }),
    r('Wanderrucksack', 'Outdoor', 'backpack', 1, { right: 'ca. 80 €' }),
    r('Ein gutes Kochbuch', 'Bücher', 'book', 2),
    r('Kopfhörer zum Joggen', 'Technik', 'headphones', 3, { right: 'ca. 60 €' }),
  ] },
  link: { label: 'Link im Chat teilen', avatar: 'M', blocks: [
    { k: 'chat', t: 'Familie' }, { k: 'bubble', t: 'Hier ist meine Wunschliste für Weihnachten' }, { k: 'link', t: 'Mias Wunschliste', s: '5 offene Wünsche' },
    { k: 'bubble', t: 'Danke, dann muss ich nicht raten', left: true },
  ] },
  linkkind: { label: 'Kinderliste im Familienchat', avatar: 'A', blocks: [
    { k: 'chat', t: 'Oma und Opa' }, { k: 'bubble', t: 'Hier ist Emils Wunschliste für Weihnachten' }, { k: 'link', t: 'Emils Wunschliste', s: '4 offene Wünsche' },
    { k: 'bubble', t: 'Wie schön, dann suchen wir uns etwas aus', left: true },
  ] },
  gast: { label: 'Gastansicht mit Reservieren', avatar: 'L', blocks: [
    { k: 'bar', guest: true }, { k: 'h', t: 'Mias Wunschliste', s: 'Was frei ist, kannst du reservieren' },
    r('Handkaffeemühle', 'ca. 45 €', 'mug', 4, { btn: 'Reservieren', hl: true }),
    r('Keramikkurs', 'ca. 90 €', 'gift', 0, { btn: 'Reservieren' }),
    r('Wanderrucksack', 'Reserviert von jemandem', 'backpack', 1, { badge: ['Reserviert', 'res'], dim: true }),
    r('Ein gutes Kochbuch', 'Bücher', 'book', 2, { btn: 'Reservieren' }),
  ] },
  reserviert: { label: 'Gast hat reserviert', avatar: 'L', blocks: [
    { k: 'bar', guest: true }, { k: 'h', t: 'Mias Wunschliste', s: 'Du hast einen Wunsch reserviert' },
    r('Handkaffeemühle', 'ca. 45 €', 'mug', 4, { badge: ['Von dir reserviert', 'mine'], hl: true }),
    r('Keramikkurs', 'ca. 90 €', 'gift', 0, { btn: 'Reservieren' }),
    r('Wanderrucksack', 'Reserviert von jemandem', 'backpack', 1, { badge: ['Reserviert', 'res'], dim: true }),
    r('Ein gutes Kochbuch', 'Bücher', 'book', 2, { btn: 'Reservieren' }),
    { k: 'toast', t: 'Mia sieht nicht, was reserviert ist' },
  ] },
  kgast: { label: 'Kinderliste: was Oma sieht', avatar: 'U', blocks: [
    { k: 'bar', guest: true }, { k: 'h', t: 'Emils Wunschliste', s: 'Emil wird 4 · Was frei ist, kannst du reservieren' },
    r('Laufrad', 'ca. 70 €', 'bike', 1, { btn: 'Reservieren', hl: true }),
    r('Dino-Bilderbuch', 'ca. 15 €', 'book', 2, { btn: 'Reservieren' }),
    r('Holzeisenbahn', 'Reserviert von jemandem', 'blocks', 4, { badge: ['Reserviert', 'res'], dim: true }),
    r('Kuscheltier Fuchs', 'ca. 20 €', 'teddy', 0, { btn: 'Reservieren' }),
  ] },
  kreserviert: { label: 'Kinderliste: Oma hat reserviert', avatar: 'U', blocks: [
    { k: 'bar', guest: true }, { k: 'h', t: 'Emils Wunschliste', s: 'Du hast einen Wunsch reserviert' },
    r('Laufrad', 'ca. 70 €', 'bike', 1, { badge: ['Von dir reserviert', 'mine'], hl: true }),
    r('Dino-Bilderbuch', 'ca. 15 €', 'book', 2, { btn: 'Reservieren' }),
    r('Holzeisenbahn', 'Reserviert von jemandem', 'blocks', 4, { badge: ['Reserviert', 'res'], dim: true }),
    r('Kuscheltier Fuchs', 'ca. 20 €', 'teddy', 0, { btn: 'Reservieren' }),
    { k: 'toast', t: 'Jetzt schenkt niemand dasselbe noch einmal' },
  ] },
  kkaufen: { label: 'Kinderliste: Oma kauft im Shop', avatar: 'U', blocks: [
    { k: 'bar', guest: true }, { k: 'hero', g: 'bike', tone: 1 }, { k: 'h', t: 'Laufrad', s: 'Aus Emils Wunschliste · ca. 70 €' },
    { k: 'banner', t: 'Du hast diesen Wunsch reserviert. Emil erfährt davon nichts.' },
    { k: 'shopbtn', t: 'Bei Amazon ansehen', alt: 'Bei Otto' },
    { k: 'small', t: 'Anzeige · oder in einem Laden deiner Wahl' },
  ] },
  kinfo: { label: 'Kinderliste: Über Emil', avatar: 'U', blocks: [
    { k: 'bar', guest: true }, { k: 'h', t: 'Über Emil', s: 'Emil wird 4 und trägt zurzeit Größe 104' },
    { k: 'label', t: 'Emil mag' }, { k: 'chips', items: ['*Dinos', 'Bauen', 'Malen', 'Fahrzeuge'] },
    { k: 'label', t: 'Hat schon' }, { k: 'chips', items: ['Kinderfahrrad', 'Duplo-Kiste'] },
    { k: 'label', t: 'Lieber nicht' }, { k: 'chips', items: ['Süßigkeiten', 'Viel Plastik'] },
  ] },
  kaufen: { label: 'Gast kauft direkt im Shop', avatar: 'L', blocks: [
    { k: 'bar', guest: true }, { k: 'hero', g: 'mug', tone: 4 }, { k: 'h', t: 'Handkaffeemühle', s: 'Aus Mias Wunschliste · ca. 45 €' },
    { k: 'banner', t: 'Du hast diesen Wunsch reserviert. Mia erfährt davon nichts.' },
    { k: 'shopbtn', t: 'Bei Amazon ansehen', alt: 'Bei Otto' },
    { k: 'small', t: 'Anzeige · oder in einem Laden deiner Wahl' },
  ] },
  eigen: { label: 'So sieht Mia die Liste danach', avatar: 'M', blocks: [
    { k: 'bar' }, { k: 'h', t: 'Mias Wunschliste', s: '5 offene Wünsche' },
    r('Handkaffeemühle', 'Küche', 'mug', 4, { right: 'ca. 45 €', hl: true }),
    r('Keramikkurs', 'Erlebnis', 'gift', 0, { right: 'ca. 90 €' }),
    r('Wanderrucksack', 'Outdoor', 'backpack', 1, { right: 'ca. 80 €' }),
    r('Ein gutes Kochbuch', 'Bücher', 'book', 2),
    { k: 'toast', t: 'Hier verrät nichts, was schon besorgt ist' },
  ] },
  suche: { label: 'Wunsch suchen (Otto, Amazon)', avatar: 'M', blocks: [
    { k: 'bar' }, { k: 'h', t: 'Neuer Wunsch' }, { k: 'tabs', items: ['Ideen', '*Suchen', 'Eingeben'] }, { k: 'search', t: 'Holzeisenbahn' },
    r('Holzeisenbahn, Starterset', 'otto.de', 'blocks', 4, { right: 'ca. 40 €', shops: true, hl: true }),
    r('Eisenbahn mit Brücke', 'otto.de', 'blocks', 4, { right: 'ca. 55 €', shops: true }),
  ] },
  ideen: { label: 'Ideen von Wishtale', avatar: 'M', blocks: [
    { k: 'bar' }, { k: 'h', t: 'Mias Wunschliste', s: '5 offene Wünsche' },
    r('Handkaffeemühle', 'Küche', 'mug', 4, { right: 'ca. 45 €' }),
    { k: 'zone', label: 'Vorschläge von Wishtale', rows: [
      r('Kaffeebecher aus Keramik', 'Passt zu Kaffee und Keramik', 'mug', 0, { add: true }),
      r('Thermobecher für unterwegs', 'Du wanderst gern und trinkst Kaffee', 'bottle', 1, { add: true }),
    ] },
  ] },
  kind: { label: 'Kind-Konto', avatar: 'A', blocks: [
    { k: 'bar' }, { k: 'chips', items: ['Ich', '*Emil', 'Lotta'] }, { k: 'h', t: 'Emils Wunschliste', s: 'Verwaltet von dir und Tom' },
    r('Laufrad', 'Draußen', 'bike', 1, { right: 'ca. 70 €' }),
    r('Bilderbuch über Dinos', 'Bücher', 'book', 2, { right: 'ca. 15 €' }),
    r('Holzeisenbahn', 'Spielzeug', 'blocks', 4, { badge: ['Reserviert', 'res'] }),
    r('Kuscheltier Fuchs', 'Spielzeug', 'teddy', 0, { right: 'ca. 20 €' }),
  ] },
  zettel: { label: 'Wunschzettel abfotografieren', avatar: 'A', blocks: [
    { k: 'bar' }, { k: 'h', t: 'Wunschzettel lesen' },
    { k: 'note', lines: ['Laufrad', 'Buch über Dinos', 'Bastelset mit Perlen'] }, { k: 'arrow' },
    { k: 'label', t: '3 Wünsche erkannt' },
    r('Laufrad', 'Neuer Wunsch', 'bike', 1, { check: true }),
    r('Buch über Dinos', 'Neuer Wunsch', 'book', 2, { check: true }),
    r('Bastelset mit Perlen', 'Neuer Wunsch', 'gift', 0, { check: true }),
  ] },
  // Kamera-Ansicht (Jann, 27.11.): Das Handy fotografiert einen Wunschzettel, gezeichnet in drawCamera()
  kamera: { label: 'Kamera: Wunschzettel fotografieren', avatar: 'A', camera: { title: 'Mein Wunschzettel', lines: ['Laufrad', 'Buch über Dinos', 'Bastelset mit Perlen'] }, blocks: [] },
  geschmack: { label: 'Profil und Geschmack', avatar: 'M', blocks: [
    { k: 'bar' }, { k: 'h', t: 'Über Mia' },
    { k: 'label', t: 'Interessen' }, { k: 'chips', items: ['*Kaffee', 'Wandern', 'Keramik', 'Krimis'] },
    { k: 'label', t: 'Das habe ich schon' }, { k: 'chips', items: ['Siebträgermaschine', 'Wanderschuhe'] },
    { k: 'label', t: 'Lieber nicht' }, { k: 'chips', items: ['Duftkerzen', 'Deko'] },
  ] },
  eingeben: { label: 'Wunsch mit Link eintragen', avatar: 'M', blocks: [
    { k: 'bar' }, { k: 'h', t: 'Neuer Wunsch' }, { k: 'tabs', items: ['Ideen', 'Suchen', '*Eingeben'] },
    { k: 'label', t: 'Link aus einem Shop' }, { k: 'search', t: 'shop.de/kaffeemuehle', link: true },
    r('Handkaffeemühle', 'Name, Preis und Bild übernommen', 'mug', 4, { right: 'ca. 45 €', hl: true }),
    { k: 'button', t: 'Wunsch speichern' },
  ] },
};

/* ---------- Hilfen ---------- */
const rr = (ctx, x, y, w, h, rad) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, rad); };
const font = (ctx, f) => { ctx.font = f; };
function fit(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text; while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t.trimEnd() + '…';
}
function pill(ctx, x, y, text, { bg, fg, line, size = 12, weight = 600, h = 26, align = 'left' } = {}) {
  font(ctx, `${weight} ${size}px ${BODY}`);
  const w = ctx.measureText(text).width + h * 0.9, x0 = align === 'right' ? x - w : x;
  rr(ctx, x0, y, w, h, h / 2);
  if (bg) { ctx.fillStyle = bg; ctx.fill(); }
  if (line) { ctx.strokeStyle = line; ctx.lineWidth = 1.2; ctx.stroke(); }
  ctx.fillStyle = fg; ctx.fillText(text, x0 + h * 0.45, y + h / 2 + size * 0.36);
  return w;
}

/* ---------- Bausteine (logische Breite 360) ---------- */
const LW = 360, P = 18;
const H_OF = { bar: 54, tabs: 50, search: 54, label: 26, arrow: 30, button: 58, chat: 50 };

function rowHeight(b) { return 68 + (b.shops || b.add ? 34 : 0); }

function drawRow(ctx, b, x, y, w) {
  const h = rowHeight(b) - 10;
  ctx.save(); if (b.dim) ctx.globalAlpha = 0.6;
  rr(ctx, x, y, w, h, 14); ctx.fillStyle = C.card; ctx.fill();
  ctx.strokeStyle = b.hl ? C.gold : C.line; ctx.lineWidth = b.hl ? 2.2 : 1; ctx.stroke();
  const [tb, tf] = TONE[(b.tone || 0) % TONE.length];
  rr(ctx, x + 10, y + 8, 42, 42, 11); ctx.fillStyle = tb; ctx.fill();
  glyph(ctx, b.g, x + 19, y + 17, 24, tf);
  // rechte Seite
  let rightW = 0;
  if (b.check) {
    rr(ctx, x + w - 34, y + 18, 22, 22, 6); ctx.fillStyle = C.green; ctx.fill();
    ctx.strokeStyle = C.onGreen; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + w - 28, y + 29); ctx.lineTo(x + w - 24, y + 33); ctx.lineTo(x + w - 17, y + 24); ctx.stroke();
    rightW = 40;
  } else if (b.btn) rightW = pill(ctx, x + w - 10, y + 16, b.btn, { fg: C.green, line: C.green, h: 28, size: 12.5, align: 'right' }) + 14;
  else if (b.badge) { const [bb, bf] = BADGE[b.badge[1]] || BADGE.res; rightW = pill(ctx, x + w - 10, y + 17, b.badge[0], { bg: bb, fg: bf, size: 11.5, h: 24, align: 'right' }) + 14; }
  else if (b.right) { font(ctx, `600 14px ${BODY}`); ctx.fillStyle = C.ink; ctx.textAlign = 'right'; ctx.fillText(b.right, x + w - 14, y + 34); ctx.textAlign = 'left'; rightW = ctx.measureText(b.right).width + 22; }
  const tx = x + 64, tw = w - 64 - Math.max(rightW, 12);
  font(ctx, `600 15px ${BODY}`); ctx.fillStyle = C.ink; ctx.fillText(fit(ctx, b.t, tw), tx, y + 26);
  if (b.s) { font(ctx, `400 12.5px ${BODY}`); ctx.fillStyle = C.muted; ctx.fillText(fit(ctx, b.s, tw), tx, y + 44); }
  if (b.shops) {
    let px = x + 64; const py = y + 60;
    px += pill(ctx, px, py, 'Bei Amazon', { fg: C.ink, line: C.line, size: 11.5, h: 24 }) + 6;
    px += pill(ctx, px, py, 'Bei Otto', { fg: C.ink, line: C.line, size: 11.5, h: 24 }) + 8;
    font(ctx, `400 10.5px ${BODY}`); ctx.fillStyle = C.muted; ctx.fillText('Anzeige', px, py + 16);
  }
  if (b.add) pill(ctx, x + 64, y + 60, 'Auf meine Wunschliste', { bg: C.green, fg: C.onGreen, size: 11.5, h: 24 });
  ctx.restore();
  return h + 10;
}

function drawChips(ctx, items, x, y, w) {
  font(ctx, `500 13px ${BODY}`);
  let cx = x, cy = y;
  for (const raw of items) {
    const on = raw.startsWith('*'), t = raw.replace(/^\*/, ''), cw = ctx.measureText(t).width + 26;
    if (cx + cw > x + w && cx > x) { cx = x; cy += 36; }
    pill(ctx, cx, cy, t, on ? { bg: C.green, fg: C.onGreen, size: 13, weight: 500, h: 28 } : { bg: C.card, fg: C.ink, line: C.line, size: 13, weight: 500, h: 28 });
    cx += cw + 8;
  }
  return cy - y + 40;
}

function wrapLines(ctx, text, maxW) {
  const out = []; let line = '';
  for (const word of String(text).split(/\s+/)) { const t = line ? line + ' ' + word : word; if (ctx.measureText(t).width > maxW && line) { out.push(line); line = word; } else line = t; }
  if (line) out.push(line); return out;
}

function drawBlock(ctx, b, x, y, w, sc) {
  switch (b.k) {
    case 'bar': {
      font(ctx, `400 22px ${DISP}`); ctx.fillStyle = C.ink; ctx.fillText('wishtale', x, y + 30);
      const lw = ctx.measureText('wishtale').width; ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(x + lw + 6, y + 27, 2.8, 0, Math.PI * 2); ctx.fill();
      if (b.guest) { font(ctx, `500 12px ${BODY}`); ctx.fillStyle = C.muted; ctx.textAlign = 'right'; ctx.fillText('Ohne Konto', x + w, y + 29); ctx.textAlign = 'left'; }
      else { ctx.fillStyle = C.green; ctx.beginPath(); ctx.arc(x + w - 15, y + 24, 15, 0, Math.PI * 2); ctx.fill(); font(ctx, `600 13px ${BODY}`); ctx.fillStyle = C.onGreen; ctx.textAlign = 'center'; ctx.fillText(sc.avatar || 'M', x + w - 15, y + 29); ctx.textAlign = 'left'; }
      return H_OF.bar;
    }
    case 'h': {
      font(ctx, `400 30px ${DISP}`); ctx.fillStyle = C.ink; ctx.fillText(fit(ctx, b.t, w), x, y + 28);
      if (!b.s) return 46;
      font(ctx, `400 13px ${BODY}`); ctx.fillStyle = C.muted; ctx.fillText(fit(ctx, b.s, w), x, y + 50);
      return 66;
    }
    case 'tabs': {
      rr(ctx, x, y, w, 36, 12); ctx.fillStyle = C.soft; ctx.fill();
      const n = b.items.length, sw = (w - 6) / n;
      b.items.forEach((raw, i) => {
        const on = raw.startsWith('*'), t = raw.replace(/^\*/, '');
        if (on) { ctx.save(); ctx.shadowColor = 'rgba(31,27,22,.12)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 1; rr(ctx, x + 3 + i * sw, y + 3, sw, 30, 10); ctx.fillStyle = C.card; ctx.fill(); ctx.restore(); }
        font(ctx, `${on ? 600 : 500} 13px ${BODY}`); ctx.fillStyle = on ? C.ink : C.muted; ctx.textAlign = 'center'; ctx.fillText(t, x + 3 + i * sw + sw / 2, y + 23); ctx.textAlign = 'left';
      });
      return H_OF.tabs;
    }
    case 'search': {
      rr(ctx, x, y, w, 42, 12); ctx.fillStyle = C.card; ctx.fill(); ctx.strokeStyle = C.line; ctx.lineWidth = 1.2; ctx.stroke();
      if (b.link) glyph(ctx, 'gift', x + 12, y + 12, 18, C.muted);
      else { ctx.strokeStyle = C.muted; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(x + 20, y + 19, 6, 0, Math.PI * 2); ctx.moveTo(x + 24.5, y + 23.5); ctx.lineTo(x + 29, y + 28); ctx.stroke(); }
      font(ctx, `400 14.5px ${BODY}`); ctx.fillStyle = C.ink; ctx.fillText(fit(ctx, b.t, w - 54), x + 40, y + 26);
      return H_OF.search;
    }
    case 'label': {
      font(ctx, `600 11px ${BODY}`); ctx.fillStyle = C.muted; try { ctx.letterSpacing = '1.4px'; } catch { /* ältere Browser */ }
      ctx.fillText(b.t.toUpperCase(), x, y + 14); try { ctx.letterSpacing = '0px'; } catch { /* */ }
      return H_OF.label;
    }
    case 'chips': return drawChips(ctx, b.items, x, y, w) + 4;
    case 'row': return drawRow(ctx, b, x, y, w);
    case 'zone': {
      const inner = b.rows.reduce((a, rw) => a + rowHeight(rw), 0), h = 42 + inner + 4;
      rr(ctx, x - 6, y, w + 12, h, 18); ctx.fillStyle = C.zone; ctx.fill();
      font(ctx, `600 11px ${BODY}`); ctx.fillStyle = '#2D5A3B'; try { ctx.letterSpacing = '1.4px'; } catch { /* */ }
      ctx.fillText(b.label.toUpperCase(), x + 6, y + 26); try { ctx.letterSpacing = '0px'; } catch { /* */ }
      let yy = y + 40; for (const rw of b.rows) yy += drawRow(ctx, rw, x + 4, yy, w - 8);
      return h + 12;
    }
    case 'chat': {
      ctx.fillStyle = C.soft; ctx.fillRect(x - P, y, LW, H_OF.chat - 6);
      ctx.fillStyle = TONE[1][0]; ctx.beginPath(); ctx.arc(x + 16, y + 22, 15, 0, Math.PI * 2); ctx.fill();
      glyph(ctx, 'gift', x + 7, y + 13, 18, TONE[1][1]);
      font(ctx, `600 15px ${BODY}`); ctx.fillStyle = C.ink; ctx.fillText(b.t, x + 40, y + 28);
      return H_OF.chat + 10;
    }
    case 'bubble': {
      font(ctx, `400 14px ${BODY}`); const lines = wrapLines(ctx, b.t, w * 0.68), bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 26, bh = lines.length * 19 + 18;
      const bx = b.left ? x : x + w - bw;
      rr(ctx, bx, y, bw, bh, 14); ctx.fillStyle = b.left ? C.card : C.zone; ctx.fill(); if (b.left) { ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.fillStyle = C.ink; lines.forEach((l, i) => ctx.fillText(l, bx + 13, y + 23 + i * 19));
      return bh + 10;
    }
    case 'link': {
      const bw = w * 0.82, bx = x + w - bw, ih = 120;
      rr(ctx, bx, y, bw, ih + 70, 14); ctx.fillStyle = C.zone; ctx.fill();
      ctx.save(); rr(ctx, bx + 6, y + 6, bw - 12, ih + 58, 10); ctx.clip();
      ctx.fillStyle = '#F3EDE2'; ctx.fillRect(bx + 6, y + 6, bw - 12, ih);
      font(ctx, `400 30px ${DISP}`); ctx.fillStyle = C.ink; ctx.fillText('wishtale', bx + 20, y + 50);
      const lw = ctx.measureText('wishtale').width; ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(bx + 20 + lw + 7, y + 46, 3.4, 0, Math.PI * 2); ctx.fill();
      font(ctx, `400 13px ${BODY}`); ctx.fillStyle = C.muted; ctx.fillText(fit(ctx, 'Die Wunschliste, die dich kennt', bw - 100), bx + 20, y + 74);
      glyph(ctx, 'gift', bx + bw - 62, y + 22, 40, C.gold);
      ctx.fillStyle = C.card; ctx.fillRect(bx + 6, y + 6 + ih, bw - 12, 52);
      font(ctx, `600 14px ${BODY}`); ctx.fillStyle = C.ink; ctx.fillText(fit(ctx, b.t || 'Mias Wunschliste', bw - 32), bx + 16, y + ih + 28);
      font(ctx, `400 12px ${BODY}`); ctx.fillStyle = C.muted; ctx.fillText(`${b.s || '5 offene Wünsche'} · wishtale.de`, bx + 16, y + ih + 47);
      ctx.restore();
      return ih + 80;
    }
    case 'note': {
      const h = 24 + b.lines.length * 30;
      ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(-0.03);
      ctx.shadowColor = 'rgba(31,27,22,.14)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3;
      ctx.fillStyle = '#FFFDF6'; ctx.fillRect(-w * 0.4, -h / 2, w * 0.8, h); ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#E6DCC8'; ctx.lineWidth = 1;
      b.lines.forEach((l, i) => { const ly = -h / 2 + 40 + i * 30; ctx.beginPath(); ctx.moveTo(-w * 0.4 + 14, ly + 4); ctx.lineTo(w * 0.4 - 14, ly + 4); ctx.stroke(); });
      font(ctx, `italic 400 22px ${DISP}`); ctx.fillStyle = '#2E557A';
      b.lines.forEach((l, i) => ctx.fillText(l, -w * 0.4 + 20, -h / 2 + 38 + i * 30));
      ctx.restore();
      return h + 10;
    }
    case 'arrow': {
      ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const cx = x + w / 2; ctx.beginPath(); ctx.moveTo(cx, y + 4); ctx.lineTo(cx, y + 22); ctx.moveTo(cx - 6, y + 16); ctx.lineTo(cx, y + 22); ctx.lineTo(cx + 6, y + 16); ctx.stroke();
      return H_OF.arrow;
    }
    case 'button': {
      rr(ctx, x, y + 6, w, 44, 22); ctx.fillStyle = C.green; ctx.fill();
      font(ctx, `600 15px ${BODY}`); ctx.fillStyle = C.onGreen; ctx.textAlign = 'center'; ctx.fillText(b.t, x + w / 2, y + 33); ctx.textAlign = 'left';
      return H_OF.button;
    }
    case 'hero': {
      const [tb, tf] = TONE[(b.tone || 0) % TONE.length];
      rr(ctx, x, y, w, 150, 18); ctx.fillStyle = tb; ctx.fill();
      glyph(ctx, b.g, x + w / 2 - 36, y + 39, 72, tf);
      return 166;
    }
    case 'banner': {
      font(ctx, `500 13.5px ${BODY}`); const lines = wrapLines(ctx, b.t, w - 54), h = lines.length * 19 + 22;
      rr(ctx, x, y, w, h, 14); ctx.fillStyle = BADGE.res[0]; ctx.fill();
      ctx.strokeStyle = BADGE.res[1]; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x + 14, y + h / 2); ctx.lineTo(x + 19, y + h / 2 + 5); ctx.lineTo(x + 28, y + h / 2 - 5); ctx.stroke();
      ctx.fillStyle = BADGE.res[1]; lines.forEach((l, i) => ctx.fillText(l, x + 40, y + 25 + i * 19));
      return h + 12;
    }
    case 'shopbtn': {
      const aw = b.alt ? 104 : 0, mw = w - (aw ? aw + 8 : 0);
      rr(ctx, x, y, mw, 44, 22); ctx.fillStyle = C.green; ctx.fill();
      font(ctx, `600 15px ${BODY}`); ctx.fillStyle = C.onGreen; ctx.textAlign = 'center'; ctx.fillText(b.t, x + mw / 2, y + 27);
      if (aw) { rr(ctx, x + mw + 8, y, aw, 44, 22); ctx.fillStyle = C.card; ctx.fill(); ctx.strokeStyle = C.green; ctx.lineWidth = 1.4; ctx.stroke(); ctx.fillStyle = C.green; ctx.fillText(b.alt, x + mw + 8 + aw / 2, y + 27); }
      ctx.textAlign = 'left';
      return 54;
    }
    case 'small': { font(ctx, `400 12px ${BODY}`); ctx.fillStyle = C.muted; ctx.textAlign = 'center'; ctx.fillText(b.t, x + w / 2, y + 14); ctx.textAlign = 'left'; return 26; }
    case 'gap': return b.h || 12;
    default: return 0;
  }
}

/**
 * Zeichnet ein Handy mit der Szene. x, y: obere linke Ecke des Bildschirms auf der Folie, w: Bildschirmbreite in Pixeln.
 * visH: wie viel vom Bildschirm sichtbar ist (bis zum unteren Rand der Folie oder der sicheren Zone), das Handy läuft unten aus dem Bild.
 */
/** Kamerabild: Tisch, schräg liegender Wunschzettel, Fokusrahmen und Auslöser. `vis` ist die sichtbare Höhe in logischen Punkten. */
function drawCamera(ctx, cam, vis, full) {
  ctx.fillStyle = '#151311'; ctx.fillRect(0, 0, LW, full);
  const top = 52, bot = vis - 112, vh = Math.max(220, bot - top);
  const g = ctx.createLinearGradient(0, top, LW, top + vh); g.addColorStop(0, '#C7AA86'); g.addColorStop(1, '#A88A66');
  ctx.fillStyle = g; ctx.fillRect(0, top, LW, vh);
  ctx.strokeStyle = 'rgba(90,64,40,.18)'; ctx.lineWidth = 1.2;
  for (let i = 0; i < 7; i++) { const yy = top + 18 + i * vh / 7; ctx.beginPath(); ctx.moveTo(0, yy); ctx.bezierCurveTo(LW * 0.3, yy + 6, LW * 0.6, yy - 6, LW, yy + 3); ctx.stroke(); }
  // Zettel
  const pw = 228, ph = Math.min(300, vh - 56), cx = LW / 2, cy = top + vh / 2;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.07);
  ctx.shadowColor = 'rgba(31,27,22,.35)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#FFFDF6'; ctx.fillRect(-pw / 2, -ph / 2, pw, ph); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#E3D8C2'; ctx.lineWidth = 1;
  for (let ly = -ph / 2 + 70; ly < ph / 2 - 12; ly += 30) { ctx.beginPath(); ctx.moveTo(-pw / 2 + 12, ly); ctx.lineTo(pw / 2 - 12, ly); ctx.stroke(); }
  ctx.strokeStyle = '#E9B8B0'; ctx.beginPath(); ctx.moveTo(-pw / 2 + 30, -ph / 2); ctx.lineTo(-pw / 2 + 30, ph / 2); ctx.stroke();
  font(ctx, `italic 400 27px ${DISP}`); ctx.fillStyle = '#B5473A'; ctx.fillText(cam.title, -pw / 2 + 40, -ph / 2 + 46);
  font(ctx, `italic 400 23px ${DISP}`); ctx.fillStyle = '#2E557A';
  cam.lines.forEach((l, i) => { const ly = -ph / 2 + 96 + i * 30; if (ly < ph / 2 - 8) ctx.fillText(`${i + 1}. ${l}`, -pw / 2 + 40, ly - 4); });
  // kleiner gemalter Stern
  const sx = pw / 2 - 34, sy = ph / 2 - 34; ctx.strokeStyle = '#D9A441'; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let i = 0; i < 10; i++) { const r = i % 2 ? 7 : 16, a = -Math.PI / 2 + i * Math.PI / 5; ctx[i ? 'lineTo' : 'moveTo'](sx + r * Math.cos(a), sy + r * Math.sin(a)); }
  ctx.closePath(); ctx.stroke();
  ctx.restore();
  // Fokusrahmen
  const fx = cx - pw / 2 - 16, fy = cy - ph / 2 - 16, fw = pw + 32, fh = ph + 32, L = 22;
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (const [x0, y0, dx, dy] of [[fx, fy, 1, 1], [fx + fw, fy, -1, 1], [fx, fy + fh, 1, -1], [fx + fw, fy + fh, -1, -1]]) {
    ctx.beginPath(); ctx.moveTo(x0, y0 + dy * L); ctx.lineTo(x0, y0); ctx.lineTo(x0 + dx * L, y0); ctx.stroke();
  }
  // Leiste unten: Modus und Auslöser
  font(ctx, `600 11px ${BODY}`); ctx.fillStyle = '#D9A441'; ctx.textAlign = 'center';
  try { ctx.letterSpacing = '2px'; } catch { /* ältere Browser */ }
  ctx.fillText('FOTO', LW / 2, bot + 24);
  try { ctx.letterSpacing = '0px'; } catch { /* */ }
  ctx.textAlign = 'left';
  const sy2 = bot + 66;
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(LW / 2, sy2, 30, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(LW / 2, sy2, 24, 0, Math.PI * 2); ctx.fill();
  rr(ctx, 44, sy2 - 18, 36, 36, 8); ctx.fillStyle = '#3A3530'; ctx.fill();
}

export function drawPhone(ctx, key, x, y, w, visH, bleedTo) {
  const sc = SCENES[key] || SCENES.liste, k = w / LW, bez = Math.round(14 * k / 1.8);
  const fullH = Math.max(visH, bleedTo - y) + 80;
  ctx.save();
  ctx.shadowColor = 'rgba(31,27,22,.20)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 18;
  rr(ctx, x - bez, y - bez, w + bez * 2, fullH + bez * 2, 46 * k / 1.8 + bez); ctx.fillStyle = '#1F1B16'; ctx.fill();
  ctx.restore();
  ctx.save();
  rr(ctx, x, y, w, fullH, 46 * k / 1.8); ctx.clip();
  ctx.fillStyle = C.bg; ctx.fillRect(x, y, w, fullH);
  ctx.translate(x, y); ctx.scale(k, k);
  // Kamera-Aussparung
  rr(ctx, LW / 2 - 46, 10, 92, 26, 13); ctx.fillStyle = '#1F1B16'; ctx.fill();
  if (sc.camera) { drawCamera(ctx, sc.camera, visH / k, fullH / k); ctx.restore(); return; }
  let yy = 44;
  ctx.textBaseline = 'alphabetic';
  for (const b of sc.blocks) { if (b.k === 'toast') continue; yy += drawBlock(ctx, b, P, yy, LW - P * 2, sc); }
  const toast = sc.blocks.find(b => b.k === 'toast');
  if (toast) {
    const vis = visH / k; font(ctx, `600 13.5px ${BODY}`);
    const lines = wrapLines(ctx, toast.t, LW - P * 2 - 40), th = lines.length * 19 + 24, ty = Math.min(yy + 6, vis - th - 22);
    ctx.save(); ctx.shadowColor = 'rgba(31,27,22,.25)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
    rr(ctx, P, ty, LW - P * 2, th, 16); ctx.fillStyle = C.green; ctx.fill(); ctx.restore();
    ctx.fillStyle = C.onGreen; ctx.textAlign = 'center'; lines.forEach((l, i) => ctx.fillText(l, LW / 2, ty + 28 + i * 19)); ctx.textAlign = 'left';
  }
  ctx.restore();
}
