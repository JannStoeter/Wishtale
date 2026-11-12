/* Doppelte Wünsche erkennen: gleicher Link oder (fast) gleicher Titel. */
const norm = t => String(t || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const words = t => new Set(norm(t).split(' ').filter(x => x.length > 1).map(x => (x.length > 4 ? x.replace(/s$/, '') : x)));
const linkKey = u => { try { const x = new URL(u); return x.hostname.replace(/^www\./, '') + x.pathname.replace(/\/$/, ''); } catch { return ''; } };

export function sameWish(a, b) {
  if (a.link && b.link && linkKey(a.link) && linkKey(a.link) === linkKey(b.link)) return true;
  const x = norm(a.t), y = norm(b.t);
  if (!x || !y) return false;
  if (x === y) return true;
  const nums = t => norm(t).split(' ').filter(w => /^\d+$/.test(w)).join(' ');
  if (nums(a.t) && nums(b.t) && nums(a.t) !== nums(b.t)) return false; // AirPods Pro 2 ist nicht AirPods Pro 3
  const A = words(a.t), B = words(b.t), inter = [...A].filter(w => B.has(w)).length;
  return inter >= 2 && inter / Math.min(A.size, B.size) >= 0.8;
}
/** Erster offener Wunsch, der dem neuen entspricht (ohne den Wunsch selbst beim Bearbeiten). */
export const findDupe = (wishes, w, skipId) => wishes.find(o => o.id !== skipId && (o.status === 'offen' || o.status === 'plan') && sameWish(o, w));
