/*
 * Bildsuche für Wünsche ohne Bild (zum Beispiel Amazon-Links). Gesucht wird nur mit dem Produktnamen über die
 * Brave-Search-API (BRAVE_SEARCH_API_KEY, nur in Vercel). Die Treffer werden über fetchImage geladen (SSRF-Schutz,
 * keine Amazon-Hosts) und vom Browser in unseren eigenen Speicher kopiert. Ohne Schlüssel bleibt alles aus.
 */
import { fetchImage, inspect } from './inspect.js';

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

/* Herstellerseite zuerst: Websuche nach dem Produktnamen, erster Treffer, der kein Marktplatz oder Preisvergleich ist,
   davon das Produktbild der Seite (og:image, wie bei „Link lesen“). Das offizielle Bild passt fast immer besser als eine Bildersuche. */
const MARKET = /(^|\.)(amazon\.|ebay\.|idealo\.|geizhals\.|billiger\.de|guenstiger\.de|otto\.de|kaufland\.|check24\.|preis\.de|youtube\.|facebook\.|instagram\.|pinterest\.|reddit\.|wikipedia\.)/i;
const words = q => clean(q).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter(w => w.length > 2);

/** Ordnet Treffer: Seiten, deren Adresse die Marke (erstes Wort) enthält, zuerst; Marktplätze fallen raus. */
export function pageCandidates(json, query) {
  const brand = words(query)[0] || '';
  return (json?.web?.results || [])
    .map(r => { try { return { url: r.url, host: new URL(r.url).hostname.replace(/^www\./, '') }; } catch { return null; } })
    .filter(c => c && /^https:\/\//i.test(c.url) && !MARKET.test(c.host))
    .map((c, i) => ({ ...c, score: (brand && c.host.includes(brand) ? 10 : 0) - i }))
    .sort((a, b) => b.score - a.score).slice(0, 3);
}

/** Websuche über Brave (nur mit Schlüssel). Liefert die rohe Antwort oder null. */
export async function webJson(query, { fetchJson } = {}) {
  const key = process.env.BRAVE_SEARCH_API_KEY, q = clean(query);
  if (!q || (!key && !fetchJson)) return null;
  return fetchJson ? fetchJson(q) : fetch('https://api.search.brave.com/res/v1/web/search?count=8&safesearch=strict&country=de&search_lang=de&q=' + encodeURIComponent(q), { headers: { 'x-subscription-token': key, accept: 'application/json' }, signal: AbortSignal.timeout(6000) }).then(r => (r.ok ? r.json() : null)).catch(() => null);
}

export async function searchOfficialImage(query, { fetchJson, read = inspect, load = fetchImage } = {}) {
  const q = clean(query);
  const json = await webJson(q, { fetchJson });
  if (!json) return null;
  for (const c of pageCandidates(json, q)) {
    try { const p = await read(c.url); if (!p?.imageUrl) continue; const im = await load(p.imageUrl); return { ...im, source: c.host }; } catch { /* nächster Treffer */ }
  }
  return null;
}

/** Erst die Herstellerseite, dann die Bildersuche. */
export async function findProductImage(query, deps = {}) {
  return (await searchOfficialImage(query, deps).catch(() => null)) || searchImage(query, deps.images || {});
}
