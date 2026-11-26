/*
 * Preise von selbst (Jann, 2026-11-25): Wünsche ohne Preis bekommen im Hintergrund den echten Preis einer Produktseite.
 * Reihenfolge: eigener Shop-Link der Person (nicht Amazon, das lesen wir nicht), sonst die Hersteller- oder Shopseite aus der
 * Websuche, deren Titel eng zum Produkt passt (fetchWishPrice -> api/inspect.js priceFor -> priceForWish). Ohne eigenen Link nur,
 * wenn die Produkterkennung sicher ein Produkt erkennt. Ein Preis aus der Erkennung zählt nur, wenn er von einer Seite stammt
 * (src 'web'), eine Schätzung des Modells nie. Ein selbst eingetragener Preis wird nie ersetzt. Jeder Wunsch höchstens einmal je
 * Browser (wishtale:price-tried1), ältere Wünsche höchstens 8 je Tag und Profil (wishtale:price-day).
 */
import { S } from '../state.js';
import { isSpecific } from './products.js';
import { fetchWishPrice } from './wishimg.js';
import { scheduleSync } from './remote.js';
import { loadMatch } from './ideas.js';

const TRIED = 'wishtale:price-tried2', DAY = 'wishtale:price-day';
const key = w => String(w.t || '').toLowerCase().replace(/\s+/g, ' ').trim() + '|' + (w.link || '');
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* dann versucht es die nächste Sitzung erneut */ } };
const ownLink = w => !!w.link && /^https:\/\//i.test(w.link) && !/amazon\.|amzn\.|awin1\./i.test(w.link);

/** Kommt der Wunsch für einen Preis in Frage? Nur Produkte ohne Preis, die einen eigenen Shop-Link haben oder genau benannt sind. */
export const wantsPrice = w => !!w && !w.price && w.kind !== 'erlebnis' && w.kind !== 'kategorie' && w.kind !== 'frei'
  && ['offen', 'plan'].includes(w.status || 'offen') && (ownLink(w) || amazonLink(w) || isSpecific(w));

const amazonLink = w => !!w.link && /amazon\.|amzn\./i.test(w.link) && !/^Wunsch von /.test(w.t || '');
async function target(w) {
  if (ownLink(w)) return { goal: { t: w.t, link: w.link } };
  if (amazonLink(w)) return { goal: { t: w.t, link: w.link } }; // Name aus dem Amazon-Link ist sicher: Preis bei Otto, dann Hersteller (134)
  const h = S.me?.handle;
  if (!h || !/^[a-z0-9-]{3,31}$/.test(h)) return null;
  const m = await loadMatch(h, w.t).catch(() => null);
  if (!m || !m.ok) return null; // nur sicher erkannte Produkte
  if (m.src === 'web' && m.price > 0) return { price: { price: m.price, source: m.host || '', via: 'erkannt' } }; // Preis stand auf der gefundenen Seite
  return { goal: { t: w.t, q: m.t || m.q || '', brand: m.brand || '' } };
}

/** Holt für höchstens `max` Wünsche nacheinander einen Preis und trägt ihn ein, wenn der Wunsch inzwischen keinen Preis hat und gleich heißt. */
export async function priceFill(list, onChange, { max = 4 } = {}) {
  if (!S.auth.user) return 0;
  const tried = read(TRIED, []);
  const todo = (list || []).filter(w => wantsPrice(w) && !tried.includes(key(w))).slice(0, max);
  let n = 0;
  for (const w of todo) {
    const t = w.t, link = w.link || '';
    tried.push(key(w)); write(TRIED, tried.slice(-400));
    try {
      const x = await target(w);
      if (!x) continue;
      const p = x.price || await fetchWishPrice(x.goal);
      if (!p || !(p.price > 0) || w.price || w.t !== t || (w.link || '') !== link) continue;
      w.price = p.price; n++; scheduleSync(); onChange && onChange(w, p);
    } catch (e) { if (e && e.limit) break; /* ohne Treffer bleibt der Preis offen */ }
  }
  return n;
}

/** Ältere Wünsche nachziehen: je Profil und Tag höchstens 8 Suchen, still im Hintergrund. */
export function priceBackfill(onChange) {
  const m = S.me;
  if (!S.auth.user || !m || !m.dbId || !Array.isArray(m.wishes) || priceBackfill.busy) return;
  const today = new Date().toISOString().slice(0, 10), d = read(DAY, {});
  const used = d.day === today ? (d[m.dbId] || 0) : 0;
  if (used >= 8) return;
  const tried = read(TRIED, []);
  const open = m.wishes.filter(w => wantsPrice(w) && !tried.includes(key(w)));
  if (!open.length) return;
  const max = Math.min(8 - used, open.length);
  write(DAY, { ...(d.day === today ? d : {}), day: today, [m.dbId]: used + max });
  priceBackfill.busy = true;
  setTimeout(() => priceFill(open, onChange, { max }).finally(() => { priceBackfill.busy = false; }), 6000);
}
