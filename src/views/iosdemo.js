// Nachgebauter iPhone-Bildschirm, der Schritt für Schritt zeigt, wie Wishtale auf den Home-Bildschirm kommt (Dev 096).
// Reine Darstellung mit eigenen, schlichten Formen. Der Text daneben ist die eigentliche, barrierefreie Anleitung.

const ua = () => (typeof navigator === 'undefined' ? '' : navigator.userAgent || '');
/** Safari ab Version 26 versteckt „Teilen“ hinter den drei Punkten, ältere Versionen zeigen das Teilen-Symbol direkt. */
export function iosFlow() {
  const u = ua();
  const other = /CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(u);
  const v = +((u.match(/Version\/(\d+)/) || [])[1] || 0);
  return { other, modern: !v || v >= 26 };
}

const STEPS_MODERN = [
  'Tippe unten rechts auf die drei Punkte neben der Adresse.',
  'Wähle im Menü „Teilen“.',
  'Wische im Teilen-Fenster etwas nach oben und tippe auf „Zum Home-Bildschirm“.',
  'Lass „Als Web-App öffnen“ eingeschaltet und tippe oben rechts auf „Hinzufügen“.',
  'Fertig, Wishtale liegt jetzt bei deinen Apps und öffnet sich mit einem Tipp.',
];
const STEPS_OLD = [
  'Tippe unten in der Mitte auf das Teilen-Symbol, das Quadrat mit dem Pfeil nach oben.',
  'Wische im Teilen-Fenster etwas nach oben und tippe auf „Zum Home-Bildschirm“.',
  'Tippe oben rechts auf „Hinzufügen“.',
  'Fertig, Wishtale liegt jetzt bei deinen Apps und öffnet sich mit einem Tipp.',
];
export const iosSteps = flow => (flow.modern ? STEPS_MODERN : STEPS_OLD);

const dots = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';
const share = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 10H6v10h12V10h-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
const plusSq = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const icon = '<img src="/app/icons/apple-touch-icon.png" alt="" width="40" height="40">';

function page() {
  return `<div class="ip-page"><div class="ip-mark">wishtale<span>.</span></div><div class="ip-h">Meine Wünsche</div>
   <div class="ip-card"></div><div class="ip-card"></div><div class="ip-card short"></div></div>`;
}
function bar(modern) {
  return modern
    ? `<div class="ip-bar"><span class="ip-b">‹</span><span class="ip-url">wishtale.de</span><span class="ip-b ip-dots">${dots}</span></div>`
    : `<div class="ip-url old">wishtale.de</div><div class="ip-bar old"><span class="ip-b">‹</span><span class="ip-b">›</span><span class="ip-b ip-share">${share}</span><span class="ip-b">▢</span><span class="ip-b">⧉</span></div>`;
}

/** Bildschirme: start, menu (nur modern), sheet, add, home. Der Finger wandert per CSS zu data-step. */
export function IosDemo(flow) {
  const screens = flow.modern ? ['start', 'menu', 'sheet', 'add', 'home'] : ['start', 'sheet', 'add', 'home'];
  const sc = {
    start: `<div class="ip-s">${page()}${bar(flow.modern)}</div>`,
    menu: `<div class="ip-s">${page()}<div class="ip-dim"></div><div class="ip-menu"><div class="ip-mi on">${share}<span>Teilen</span></div><div class="ip-mi">☆<span>Zu Favoriten</span></div><div class="ip-mi">▢<span>Lesezeichen</span></div><div class="ip-mi">⌕<span>Seite durchsuchen</span></div></div>${bar(true)}</div>`,
    sheet: `<div class="ip-s">${page()}<div class="ip-dim"></div><div class="ip-sheet"><div class="ip-sh-head">${icon}<div><b>Wishtale</b><small>wishtale.de</small></div><span class="ip-x">×</span></div>
      <div class="ip-apps"><i></i><i></i><i></i><i></i></div>
      <div class="ip-list"><div class="ip-li">Kopieren<span>⧉</span></div><div class="ip-li">Zur Leseliste<span>○○</span></div><div class="ip-li on">Zum Home-Bildschirm<span>${plusSq}</span></div><div class="ip-li">Lesezeichen<span>▢</span></div></div></div></div>`,
    add: `<div class="ip-s ip-addscr"><div class="ip-top"><span>Abbrechen</span><b>Zum Home-Bildschirm</b><span class="ip-add">Hinzufügen</span></div>
      <div class="ip-addrow">${icon}<div><b>Wishtale</b><small>wishtale.de</small></div></div>${flow.modern ? '<div class="ip-toggle"><span>Als Web-App öffnen</span><i></i></div>' : ''}
      <p class="ip-note">Ein Symbol wird zu deinem Home-Bildschirm hinzugefügt.</p></div>`,
    home: `<div class="ip-s ip-home"><div class="ip-grid">${'<i></i>'.repeat(11)}<span class="ip-app">${icon}<small>Wishtale</small></span></div></div>`,
  };
  return `<div class="iosdemo" id="iosdemo" data-step="0" data-flow="${flow.modern ? 'modern' : 'old'}" aria-hidden="true">
   <div class="ip-phone"><div class="ip-island"></div><div class="ip-screen">${screens.map((s, i) => `<div class="ip-scr" data-i="${i}">${sc[s]}</div>`).join('')}<span class="ip-finger"></span></div></div></div>`;
}

let timer = null;
const reduce = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
/** Setzt den Schritt in Bild und Text, ohne die ganze Seite neu zu zeichnen. */
export function demoGo(n) {
  const d = document.getElementById('iosdemo');
  const items = [...document.querySelectorAll('.appsteps.ios li')];
  if (!d || !items.length) return;
  const max = items.length - 1;
  const i = ((n % (max + 1)) + max + 1) % (max + 1);
  d.dataset.step = String(i);
  d.classList.remove('tap'); void d.offsetWidth; if (i < max) d.classList.add('tap');
  items.forEach((li, k) => { li.classList.toggle('on', k === i); if (k === i) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
  const lbl = document.getElementById('iosdemo-pos'); if (lbl) lbl.textContent = `Schritt ${i + 1} von ${max + 1}`;
}
export const demoStep = () => +(document.getElementById('iosdemo')?.dataset.step || 0);
export function demoStop() { clearInterval(timer); timer = null; const b = document.getElementById('iosdemo-play'); if (b) { b.textContent = 'Abspielen'; b.setAttribute('aria-pressed', 'false'); } }
export function demoPlay() {
  clearInterval(timer);
  const b = document.getElementById('iosdemo-play'); if (b) { b.textContent = 'Anhalten'; b.setAttribute('aria-pressed', 'true'); }
  timer = setInterval(() => { if (!document.getElementById('iosdemo')) { clearInterval(timer); timer = null; return; } demoGo(demoStep() + 1); }, 2600);
}
/** Nach dem Öffnen des Fensters: erster Schritt, und ohne Wunsch nach weniger Bewegung automatisch weiter. */
export function demoStart() {
  setTimeout(() => { if (!document.getElementById('iosdemo')) return; demoGo(0); if (reduce()) demoStop(); else demoPlay(); }, 60);
}
