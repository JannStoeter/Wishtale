/*
 * Katalog aus der Datenbank (im CMS geprüfte Einträge). Sie werden in dieselbe Liste gelegt wie die festen Ideen (CATALOG),
 * dadurch nutzen Empfehlungen, Inspiration und Prüfung sie ohne weitere Änderung. Kostet zur Laufzeit keine KI-Aufrufe.
 */
import { sb } from './supabase.js';
import { CATALOG, cat } from '../data/content.js';

let done = false;
export async function loadDbCatalog() {
  if (done) return 0;
  done = true;
  try {
    const { data, error } = await sb.from('catalog_items').select('*').eq('status', 'approved').limit(1500);
    if (error || !data) return 0;
    const have = new Set(CATALOG.map(i => i.t.toLowerCase()));
    let n = 0;
    for (const r of data) {
      const t = r.brand && !r.title.toLowerCase().includes(r.brand.toLowerCase()) ? `${r.brand} ${r.title}` : r.title;
      if (have.has(t.toLowerCase())) continue;
      have.add(t.toLowerCase());
      const p = r.price_to ? Math.round(((r.price_from || r.price_to) + r.price_to) / 2) : r.price_from || 40;
      CATALOG.push({ id: 'db' + r.id.slice(0, 8), t, q: r.search || t, p, c: r.world, k: r.kind, a: cat(r.world).a, tags: r.tags || [], kw: r.kw || [], comp: '', occ: r.occ && r.occ.length ? r.occ : ['weihnachten', 'geburtstag'], db: true });
      n++;
    }
    return n;
  } catch { return 0; }
}
