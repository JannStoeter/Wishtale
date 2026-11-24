/*
 * Nutzungsstatistik, die nichts auf dem Gerät speichert: kein Cookie, keine ID, kein localStorage-Eintrag zum Wiedererkennen.
 * Ein Ereignis ist nur „diese Seite wurde so aufgerufen“. Der Server bildet daraus einen täglich wechselnden Hash (api/event.js).
 * Wer „Do Not Track“ oder „Global Privacy Control“ nutzt oder die Statistik selbst ausschaltet, wird nicht gezählt.
 */
const OFF = 'wishtale:no-stats';

export const statsOff = () => {
  try { if (localStorage.getItem(OFF) === '1') return true; } catch { /* ohne Speicher */ }
  return navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
};
export const setStatsOff = on => { try { on ? localStorage.setItem(OFF, '1') : localStorage.removeItem(OFF); } catch { /* ignorieren */ } };

/** UTM-Kürzel aus der Adresse, nur im Speicher dieser Seite. */
export const utmFromUrl = (search = location.search) => {
  const q = new URLSearchParams(search), o = {};
  for (const k of ['source', 'medium', 'campaign']) { const v = (q.get('utm_' + k) || '').trim().slice(0, 60); if (/^[a-z0-9_.\-+ ]+$/i.test(v)) o[k] = v.toLowerCase(); }
  return o;
};

let sent = new Set();
/** Meldet ein Ereignis. once: pro Seitenaufruf höchstens einmal (zum Beispiel „Einrichtung gestartet“). */
export function track(name, { label, path = location.pathname, once = false } = {}) {
  try {
    if (statsOff()) return;
    const key = name + '|' + (label || '');
    if (once) { if (sent.has(key)) return; sent.add(key); }
    const u = utmFromUrl();
    const body = JSON.stringify({ name, label, path, ref: document.referrer ? new URL(document.referrer).hostname : '', utm_source: u.source, utm_medium: u.medium, utm_campaign: u.campaign });
    if (navigator.sendBeacon && navigator.sendBeacon('/api/event', new Blob([body], { type: 'text/plain' }))) return;
    fetch('/api/event', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'text/plain' } }).catch(() => {});
  } catch { /* Statistik darf nie etwas kaputt machen */ }
}

/**
 * Klicks auf Partner- und Shop-Links zählen (Dev 109, Ereignis shop_click): nur welcher Shop (amazon, otto, vergleich oder shop),
 * ob eigene Ansicht oder Gastansicht und von welcher Stelle (wunsch, ideen, liste, reserviert). Kein Produkt, keine Adresse.
 */
export const shopLabel = (a, hash = location.hash) => {
  let h = '';
  try { h = new URL(a.href).hostname.replace(/^www\./, ''); } catch { return null; }
  const shop = /(^|\.)amazon\.|amzn\./.test(h) ? 'amazon' : /(^|\.)otto\.de$/.test(h) ? 'otto' : /idealo\.|google\./.test(h) ? 'vergleich' : 'shop';
  const ctx = /^#p\//.test(hash) ? 'gast' : 'eigen';
  const place = a.dataset.place || (a.closest('.ideas-zone') ? 'ideen' : a.closest('.sheet') ? 'wunsch' : 'liste');
  return `${shop}.${ctx}.${place}`;
};
export function watchShopClicks(path = '/app/') {
  document.addEventListener('click', e => {
    const a = e.target && e.target.closest && e.target.closest('a[rel~="sponsored"]');
    if (!a) return;
    const label = shopLabel(a);
    if (label) track('shop_click', { label, path });
  }, true);
}
