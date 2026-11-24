/*
 * Echte Produktbilder für Wünsche ohne Bild (Jann, 2026-11-24): Nach dem Speichern und für ältere Wünsche holt Wishtale im Hintergrund
 * ein Bild über die Websuche (fetchWishImage -> api/inspect.js imageFor -> imageForWish, Brave). Reihenfolge: eigener Shop-Link der
 * Person, Herstellerseite, Bildersuche. Ohne guten Treffer bleibt das Symbol. Das Bild wird verkleinert in den eigenen Speicher gelegt
 * und lässt sich wie jedes andere Bild entfernen. Ein eigenes Foto wird nie ersetzt. Gesucht wird nur für angemeldete Personen, jeder
 * Wunsch höchstens einmal je Browser (wishtale:img-tried), ältere Wünsche höchstens 8 je Tag und Profil (wishtale:img-day).
 */
import { S } from '../state.js';
import { isSpecific } from './products.js';
import { fetchWishImage, storeImage } from './wishimg.js';
import { scheduleSync } from './remote.js';

const TRIED = 'wishtale:img-tried', DAY = 'wishtale:img-day';
const key = w => String(w.t || '').toLowerCase().replace(/\s+/g, ' ').trim() + '|' + (w.link || '');
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* dann sucht die nächste Sitzung erneut */ } };

/** Kommt der Wunsch für ein gesuchtes Bild in Frage? Nur Produkte ohne Bild, die genau genug benannt sind oder einen Shop-Link haben. */
export const wantsImage = w => !!w && !w.img && w.kind !== 'erlebnis' && w.kind !== 'kategorie' && w.kind !== 'frei'
  && ['offen', 'plan'].includes(w.status || 'offen') && (isSpecific(w) || (!!w.link && !/amazon\.|amzn\./i.test(w.link)));

/** Die Person hat das Bild selbst entfernt: für diesen Wunsch nicht mehr automatisch suchen. */
export function skipImage(w) { if (!w) return; const tried = read(TRIED, []); if (!tried.includes(key(w))) { tried.push(key(w)); write(TRIED, tried.slice(-400)); } }

/** Holt für höchstens `max` Wünsche nacheinander ein Bild und trägt es ein, wenn der Wunsch inzwischen kein Bild bekommen hat und gleich heißt. */
export async function imgFill(list, onChange, { max = 4 } = {}) {
  if (!S.auth.user || !S.me?.dbId) return 0;
  const tried = read(TRIED, []);
  const todo = (list || []).filter(w => wantsImage(w) && !tried.includes(key(w))).slice(0, max);
  let n = 0;
  for (const w of todo) {
    const t = w.t, k = key(w);
    tried.push(k); write(TRIED, tried.slice(-400));
    try {
      const im = await fetchWishImage(w);
      if (!im || w.img || w.t !== t) continue;
      const url = await storeImage(im.blob);
      if (w.img || w.t !== t) continue;
      w.img = url; w.imgSrc = im.src || ''; n++; scheduleSync(); onChange && onChange(w);
    } catch (e) { if (e && e.limit) break; /* ohne Treffer bleibt das Symbol */ }
  }
  return n;
}

/** Ältere Wünsche nachziehen: je Profil und Tag höchstens 8 Suchen, still im Hintergrund. */
export function imgBackfill(onChange) {
  const m = S.me;
  if (!S.auth.user || !m || !m.dbId || !Array.isArray(m.wishes) || imgBackfill.busy) return;
  const today = new Date().toISOString().slice(0, 10), d = read(DAY, {});
  const used = d.day === today ? (d[m.dbId] || 0) : 0;
  if (used >= 8) return;
  const tried = read(TRIED, []);
  const open = m.wishes.filter(w => wantsImage(w) && !tried.includes(key(w)));
  if (!open.length) return;
  const max = Math.min(8 - used, open.length);
  write(DAY, { ...(d.day === today ? d : {}), day: today, [m.dbId]: used + max });
  imgBackfill.busy = true;
  setTimeout(() => imgFill(open, onChange, { max }).finally(() => { imgBackfill.busy = false; }), 4000);
}
