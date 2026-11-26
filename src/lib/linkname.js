/*
 * Name aus einem Shop-Link, wenn die Seite selbst nichts verrät (Wunsch ohne Namen gespeichert). Aus dem längsten lesbaren Teil der
 * Adresse („/de/p/sony-wh-1000xm5-kopfhoerer-schwarz/123456“ wird „Sony Wh 1000xm5 Kopfhoerer Schwarz“). Steht dort nichts
 * Lesbares, kommt kein Name zurück, und die Person trägt kurz selbst ein, was es ist (nie „Wunsch von <Shop>“, Jann 2026-11-26).
 */
const SMALL = new Set(['mit', 'und', 'für', 'fuer', 'von', 'aus', 'in', 'im', 'der', 'die', 'das', 'ohne', 'zum', 'zur', 'the', 'and', 'with', 'for', 'of']);

export function nameFromLink(raw) {
  const s = String(raw || '').trim();
  let u; try { u = new URL(/^https?:\/\//i.test(s) ? s : 'https://' + s); } catch { return ''; }
  const parts = u.pathname.split('/').map(p => { try { return decodeURIComponent(p); } catch { return p; } })
    .map(p => p.replace(/\.(html?|php|aspx?)$/i, '').replace(/[-_+]+/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(p => /\p{L}{3,}/u.test(p) && p.split(' ').length >= 2 && !/^(dp|gp|product|produkt|p|de|en|shop|artikel|item|products)$/i.test(p));
  const best = parts.sort((a, b) => b.split(' ').length - a.split(' ').length)[0];
  if (best) {
    const words = best.split(' ').filter(w => !/^[a-z0-9]{8,}$/i.test(w) || /\p{L}{3,}/u.test(w) && !/\d{4,}/.test(w)).slice(0, 10);
    const t = words.map((w, i) => /^[a-zäöü]/.test(w) && (i === 0 || !SMALL.has(w)) ? w[0].toUpperCase() + w.slice(1) : w).join(' ').slice(0, 120);
    if (t.length >= 5) return t;
  }
  return '';
}
