// Installierbare Web-App (Dev 095): Service Worker, Installationsangebot und „Teilen an Wishtale“.
// Nichts davon wird an Wishtale gemeldet, alles bleibt im Browser.

let deferred = null;
const listeners = new Set();
const changed = () => listeners.forEach(f => { try { f(); } catch { /* egal */ } });
export const onInstallChange = f => listeners.add(f);

export const standalone = () => {
  try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch { return false; }
};
const ua = () => (typeof navigator === 'undefined' ? '' : navigator.userAgent || '');
// iPad mit Desktop-Kennung meldet sich als Mac mit Touch
export const isIOS = () => /iphone|ipad|ipod/i.test(ua()) || (/macintosh/i.test(ua()) && navigator.maxTouchPoints > 1);
export const canPrompt = () => !!deferred;
/** Der Menüpunkt erscheint nur, wenn Wishtale noch nicht als App läuft und es einen Weg gibt. */
export const offerInstall = () => !standalone() && (canPrompt() || isIOS() || /android/i.test(ua()));

export async function promptInstall() {
  if (!deferred) return 'manual';
  const d = deferred; deferred = null;
  d.prompt();
  const r = await d.userChoice.catch(() => ({ outcome: 'dismissed' }));
  changed();
  return r.outcome === 'accepted' ? 'accepted' : 'dismissed';
}

export function initPwa() {
  if (typeof window === 'undefined') return;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; changed(); });
  window.addEventListener('appinstalled', () => { deferred = null; changed(); });
  // Nur im echten Build: im Entwicklungsserver würde ein Service Worker alte Dateien festhalten.
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('/app/sw.js', { scope: '/app/' }).catch(() => {}); });
  }
}

const SKEY = 'wishtale:shared';
/** Geteilte Links (Android „Teilen an Wishtale“) kommen als ?share_url=… an. Merken und die Adresse aufräumen. */
export function takeShare() {
  try {
    const q = new URLSearchParams(location.search);
    if (!q.has('share_url') && !q.has('share_text') && !q.has('share_title')) return;
    const all = [q.get('share_url'), q.get('share_text'), q.get('share_title')].filter(Boolean).join(' ');
    const url = (all.match(/https?:\/\/[^\s<>"']+/i) || [''])[0].replace(/[).,;!?]+$/, '');
    const title = (q.get('share_title') || (q.get('share_text') || '').replace(url, '')).trim().slice(0, 120);
    if (url || title) sessionStorage.setItem(SKEY, JSON.stringify({ url: url.slice(0, 2000), title: /^https?:/i.test(title) ? '' : title }));
    history.replaceState(null, '', location.pathname + (location.hash || '#wuensche'));
  } catch { /* ohne Speicher einfach ignorieren */ }
}
/** Einmal abholen, danach ist der geteilte Link verbraucht. */
export function pendingShare() {
  try {
    const v = JSON.parse(sessionStorage.getItem(SKEY) || 'null');
    sessionStorage.removeItem(SKEY);
    return v && (v.url || v.title) ? v : null;
  } catch { return null; }
}
