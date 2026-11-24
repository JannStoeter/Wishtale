/*
 * Direkte Amazon-Produktseite statt Amazon-Suche (Dev 111, Jann): Genaue Wünsche ohne Link bekommen im Hintergrund den direkten
 * Produktlink aus der Websuche (findAmazonLink -> api/inspect.js -> amazonDirect, Brave). Eine Produktseite verkauft besser als eine
 * Trefferliste, und die Partner-Kennung bleibt sicher dran. Nur für angemeldete Personen, nur genaue Produkt-Wünsche, nie über einen
 * Link, den jemand selbst gesetzt hat. Jeder Titel wird in diesem Browser nur einmal gesucht (wishtale:amz-tried).
 */
import { S } from '../state.js';
import { isSpecific } from './products.js';
import { findAmazonLink } from './wishimg.js';
import { scheduleSync } from './remote.js';

const TRIED = 'wishtale:amz-tried', ONCE = 'wishtale:amz-v1';
const key = t => String(t || '').toLowerCase().replace(/\s+/g, ' ').trim();
const read = k => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ohne Speicher sucht die nächste Sitzung erneut */ } };

/** Kommt der Wunsch für einen direkten Amazon-Link in Frage? */
export const wantsAmazon = w => !!w && !w.link && w.kind === 'produkt' && (w.status || 'offen') === 'offen' && isSpecific(w);

/** Sucht für höchstens `max` Wünsche nacheinander den direkten Link und trägt ihn ein, wenn der Link noch leer und der Titel unverändert ist. */
export async function amzFill(list, onChange, { max = 6 } = {}) {
  if (!S.auth.user) return 0;
  const tried = read(TRIED);
  const todo = (list || []).filter(w => wantsAmazon(w) && !tried.includes(key(w.t))).slice(0, max);
  let n = 0;
  for (const w of todo) {
    const t = w.t;
    tried.push(key(t)); write(TRIED, tried.slice(-300));
    try {
      const r = await findAmazonLink(t);
      if (r && r.url && !w.link && w.t === t) { w.link = r.url; n++; scheduleSync(); onChange && onChange(w, r); }
    } catch { /* ohne Treffer bleibt die Amazon-Suche mit Partner-Kennung */ }
  }
  return n;
}

/** Einmal je Profil: ältere genaue Wünsche ohne Link nachträglich verlinken (still, sichtbar an der Zeile „Bei Amazon“). */
export function amzBackfillOnce(onChange) {
  const m = S.me;
  if (!S.auth.user || !m || !m.dbId || !Array.isArray(m.wishes)) return;
  const done = read(ONCE);
  if (done.includes(m.dbId)) return;
  if (!m.wishes.some(wantsAmazon)) return;
  done.push(m.dbId); write(ONCE, done.slice(-50));
  setTimeout(() => amzFill(m.wishes, () => onChange && onChange(), { max: 8 }), 1500);
}
