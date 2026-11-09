/*
 * Bildsuche für Wünsche ohne Bild (zum Beispiel Amazon-Links). Gesucht wird nur mit dem Produktnamen über die
 * Brave-Search-API (BRAVE_SEARCH_API_KEY, nur in Vercel). Die Treffer werden über fetchImage geladen (SSRF-Schutz,
 * keine Amazon-Hosts) und vom Browser in unseren eigenen Speicher kopiert. Ohne Schlüssel bleibt alles aus.
 */
import { fetchImage } from './inspect.js';

const clean = q => String(q || '').replace(/\s+/g, ' ').trim().slice(0, 120);

/** Wählt aus der Antwort der Bildsuche die brauchbaren Kandidaten (mindestens 300 px, https). */
export function candidates(json) {
  return (json?.results || [])
    .map(r => ({ img: r?.properties?.url, w: +r?.properties?.width || 0, h: +r?.properties?.height || 0, page: r?.source || '' }))
    .filter(c => /^https:\/\//i.test(c.img || '') && c.img.length <= 800 && (!c.w || c.w >= 300) && (!c.h || c.h >= 300))
    .slice(0, 6);
}

export async function searchImage(query, { fetchJson, load = fetchImage } = {}) {
  const key = process.env.BRAVE_SEARCH_API_KEY, q = clean(query);
  if (!q || (!key && !fetchJson)) return null;
  const json = fetchJson ? await fetchJson(q) : await fetch('https://api.search.brave.com/res/v1/images/search?count=10&safesearch=strict&country=de&search_lang=de&q=' + encodeURIComponent(q + ' Produktbild'), { headers: { 'x-subscription-token': key, accept: 'application/json' }, signal: AbortSignal.timeout(6000) }).then(r => (r.ok ? r.json() : null)).catch(() => null);
  for (const c of candidates(json)) {
    try { const im = await load(c.img); return { ...im, source: c.page || im.source }; } catch { /* nächster Treffer */ }
  }
  return null;
}
