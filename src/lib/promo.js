/*
 * Aktionen und hervorgehobene Produkte aus dem CMS (Tabellen campaigns und products).
 * Besucher sehen nur, was aktiv ist und im Zeitraum liegt (Regeln in der Datenbank).
 * Fehlt die Tabelle oder ist die Verbindung weg, bleibt alles einfach leer.
 */
import { sb } from './supabase.js';
import { withAmazonTag } from './shops.js';
import { setWeights } from './weights.js';
import { setCatalogOff } from './catalog.js';
import { loadDbCatalog } from './dbcatalog.js';

let cache = null;
export async function loadPromo() {
  if (cache) return cache;
  try {
    const [c, p, st] = await Promise.all([
      sb.from('campaigns').select('*').order('starts_at', { ascending: false }),
      sb.from('products').select('*').order('sort', { ascending: true }),
      sb.from('settings').select('key,value').in('key', ['category_weights', 'catalog_disabled']),
    ]);
    if (!st.error && st.data) for (const r of st.data) { if (r.key === 'category_weights') setWeights(r.value); if (r.key === 'catalog_disabled') setCatalogOff(r.value); }
    await loadDbCatalog();
    cache = { campaigns: c.error ? [] : c.data, products: p.error ? [] : p.data };
  } catch { cache = { campaigns: [], products: [] }; }
  return cache;
}
export const safeUrl = u => { try { const x = new URL(u, location.origin); return /^https?:$/.test(x.protocol) ? withAmazonTag(x.href) : '#'; } catch { return '#'; } };
