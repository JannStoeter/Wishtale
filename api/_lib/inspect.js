/*
 * Liest aus einer Produktseite Name, Preis, Marke und Größe, damit niemand alles abtippen muss.
 * Der Server ruft die Seite im Auftrag der Nutzerin oder des Nutzers ab. Weil Adressen von außen kommen, gilt:
 *  - nur https auf Port 443, keine IP-Adressen als Host
 *  - jede Adresse, zu der verbunden wird (auch nach Weiterleitungen), muss öffentlich sein (nie intern, nie Metadaten-Dienste)
 *  - höchstens 4 Weiterleitungen, 7 Sekunden, 1,5 MB, nur HTML
 * Gelesen wird in dieser Reihenfolge: JSON-LD (schema.org/Product), Open Graph, Microdata, Seitentitel.
 */
import https from 'node:https';
import dns from 'node:dns';
import net from 'node:net';
import zlib from 'node:zlib';
import { HttpError } from './auth.js';

const MAX_BYTES = 1_500_000, MAX_HOPS = 4, TIMEOUT = 7000;

/** Ist die Adresse öffentlich erreichbar (und nicht intern, lokal oder reserviert)? */
export function isPublicIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
    if (a === 100 && b >= 64 && b <= 127) return false; // CGNAT
    if (a === 169 && b === 254) return false; // Link-local, Metadaten-Dienste
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && (b === 168 || (b === 0 && ip.startsWith('192.0.0.')) || (b === 0 && ip.startsWith('192.0.2.')))) return false;
    if (a === 198 && (b === 18 || b === 19 || (b === 51 && ip.startsWith('198.51.100.')))) return false;
    if (a === 203 && b === 0 && ip.startsWith('203.0.113.')) return false;
    return true;
  }
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v === '::' || v === '::1') return false;
    if (v.startsWith('::ffff:')) return isPublicIp(v.slice(7)); // IPv4 in IPv6
    if (/^f[cd]/.test(v) || /^fe[89ab]/.test(v) || v.startsWith('ff')) return false; // privat, link-local, multicast
    if (v.startsWith('2001:db8')) return false;
    return true;
  }
  return false;
}

/** Prüft die Adresse vor dem Abruf und gibt die URL zurück. */
export function checkUrl(raw) {
  let u;
  try { u = new URL(String(raw)); } catch { throw new HttpError(400, 'Das ist keine gültige Adresse.'); }
  if (u.protocol !== 'https:') throw new HttpError(400, 'Bitte einen Link mit https:// verwenden.');
  if (u.port && u.port !== '443') throw new HttpError(400, 'Diese Adresse können wir nicht lesen.');
  if (u.username || u.password) throw new HttpError(400, 'Diese Adresse können wir nicht lesen.');
  const host = u.hostname.toLowerCase();
  if (net.isIP(host) || host === 'localhost' || !host.includes('.') || /\.(local|internal|localhost|lan|home)$/.test(host)) throw new HttpError(400, 'Diese Adresse können wir nicht lesen.');
  if (/(^|\.)amazon\.[a-z.]+$|(^|\.)amzn\.(to|eu)$|^a\.co$/.test(host)) throw new HttpError(422, 'Amazon lässt das automatische Lesen nicht zu. Nutze dafür „Bei Amazon stöbern“ im Wunsch-Fenster.');
  return u;
}

/** Verbindet nur zu öffentlichen Adressen. Die Prüfung läuft beim Verbindungsaufbau selbst, darum hilft auch kein Tausch der DNS-Antwort. */
const safeLookup = (host, opts, cb) => dns.lookup(host, { ...opts, all: true }, (err, addrs) => {
  if (err) return cb(err);
  const ok = addrs.filter(a => isPublicIp(a.address));
  if (!ok.length) return cb(new Error('Diese Adresse können wir nicht lesen.'));
  if (opts && opts.all) return cb(null, ok);
  cb(null, ok[0].address, ok[0].family);
});

/** Ein einzelner Abruf ohne Weiterleitung. Kann in Tests ersetzt werden. */
export function request(u, test = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(u, {
      method: 'GET', lookup: test.lookup || safeLookup, timeout: TIMEOUT, ...(test.insecure ? { rejectUnauthorized: false } : {}),
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; WishtaleLinkReader/1.0; +https://wishtale.de)', accept: 'text/html,application/xhtml+xml', 'accept-language': 'de-DE,de;q=0.9', 'accept-encoding': 'gzip, br, deflate' },
    }, res => {
      const status = res.statusCode || 0;
      if (status >= 300 && status < 400 && res.headers.location) { res.resume(); return resolve({ status, location: res.headers.location }); }
      const type = String(res.headers['content-type'] || '');
      if (status >= 400 || !/text\/html|application\/xhtml/i.test(type)) { res.resume(); return resolve({ status, type, body: '' }); }
      const enc = String(res.headers['content-encoding'] || '').toLowerCase();
      const stream = enc === 'gzip' ? res.pipe(zlib.createGunzip()) : enc === 'br' ? res.pipe(zlib.createBrotliDecompress()) : enc === 'deflate' ? res.pipe(zlib.createInflate()) : res;
      const chunks = []; let n = 0;
      stream.on('data', c => { n += c.length; if (n > MAX_BYTES) { req.destroy(); resolve({ status, type, body: Buffer.concat(chunks).toString('utf8') }); } else chunks.push(c); });
      stream.on('end', () => resolve({ status, type, body: Buffer.concat(chunks).toString('utf8') }));
      stream.on('error', reject);
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end();
  });
}

export async function fetchPage(raw, doRequest = request) {
  let u = checkUrl(raw);
  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    let r;
    try { r = await doRequest(u); } catch (e) { throw new HttpError(502, /timeout/i.test(String(e.message)) ? 'Die Seite hat nicht rechtzeitig geantwortet.' : 'Die Seite konnte nicht geladen werden.'); }
    if (r.location) { try { u = checkUrl(new URL(r.location, u).href); } catch (e) { throw e.status === 422 ? e : new HttpError(422, 'Die Seite leitet auf eine Adresse weiter, die wir nicht lesen können.'); } continue; }
    if (r.status === 403 || r.status === 429 || r.status === 503) throw new HttpError(422, 'Diese Seite lässt automatisches Lesen nicht zu.');
    if (r.status >= 400) throw new HttpError(422, 'Die Seite wurde nicht gefunden.');
    if (!r.body) throw new HttpError(422, 'Auf dieser Seite haben wir kein Produkt gefunden.');
    return { html: r.body, url: u.href };
  }
  throw new HttpError(422, 'Die Seite leitet zu oft weiter.');
}

/* ---------- Auslesen ---------- */
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ouml: 'ö', Ouml: 'Ö', auml: 'ä', Auml: 'Ä', uuml: 'ü', Uuml: 'Ü', szlig: 'ß', euro: '€', ndash: '–', mdash: '—', reg: '®', copy: '©', trade: '™', oslash: 'ø', Oslash: 'Ø' };
export const decode = s => String(s ?? '').replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') { const c = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(c) && c > 0 && c < 0x110000 ? String.fromCodePoint(c) : ''; }
  return ENT[e] ?? ENT[e.toLowerCase()] ?? m;
});
const clean = (s, n = 200) => decode(String(s ?? '')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);

/** „49,90“, „1.299,00“, „49.9“, „EUR 49,90“ → 49.9 */
export function parsePrice(v) {
  if (v == null) return null;
  if (typeof v === 'number') return v > 0 && v < 100000 ? Math.round(v * 100) / 100 : null;
  let s = String(v).replace(/[^\d.,]/g, '');
  if (!s) return null;
  const lc = s.lastIndexOf(','), ld = s.lastIndexOf('.');
  if (lc > -1 && ld > -1) s = lc > ld ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  else if (lc > -1) s = /,\d{1,2}$/.test(s) ? s.replace(',', '.') : s.replace(/,/g, '');
  else if (ld > -1 && !/\.\d{1,2}$/.test(s)) s = s.replace(/\./g, '');
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0 && n < 100000 ? Math.round(n * 100) / 100 : null;
}

const metaOf = html => {
  const m = {};
  for (const t of html.match(/<meta\b[^>]*>/gi) || []) {
    const k = (/(?:property|name|itemprop)\s*=\s*["']([^"']+)["']/i.exec(t) || [])[1], v = (/content\s*=\s*["']([^"']*)["']/i.exec(t) || [])[1];
    if (k && v != null && !(k.toLowerCase() in m)) m[k.toLowerCase()] = decode(v);
  }
  return m;
};

function jsonLdNodes(html) {
  const out = [];
  const walk = n => { if (!n || typeof n !== 'object') return; if (Array.isArray(n)) return n.forEach(walk); out.push(n); if (n['@graph']) walk(n['@graph']); if (n.mainEntity) walk(n.mainEntity); if (n.hasVariant) walk(n.hasVariant); };
  for (const m of html.matchAll(/<script\b[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) { try { walk(JSON.parse(m[1].trim())); } catch { /* defekter Block */ } }
  return out;
}
const typeIs = (n, t) => [].concat(n['@type'] || []).some(x => String(x).toLowerCase().endsWith(t));

/** Größe, wie sie im Namen oder in den Eigenschaften steht („28 cm“, „Ø 24 cm“, „1,5 l“). */
export function findSize(...texts) {
  const t = texts.filter(Boolean).join(' ');
  const m = /(Ø|durchmesser)?\s*(\d{1,3}(?:[.,]\d{1,2})?)\s*(cm|mm|ml|liter|l|zoll|kg|g)\b/i.exec(t.replace(/(\d)\s*x\s*(\d)/g, '$1x$2'));
  if (!m) return '';
  const unit = /^liter$/i.test(m[3]) ? 'l' : m[3].toLowerCase();
  return `${m[1] ? 'Ø ' : ''}${m[2].replace('.', ',')} ${unit}`;
}

export function extractProduct(html, pageUrl = '') {
  const meta = metaOf(html);
  const nodes = jsonLdNodes(html);
  const prod = nodes.find(n => typeIs(n, 'product')) || nodes.find(n => typeIs(n, 'productgroup'));
  let title = '', price = null, currency = '', brand = '', desc = '', size = '', source = '', image = '';
  if (prod) {
    source = 'jsonld';
    title = clean(prod.name, 200);
    const b = prod.brand; brand = clean(typeof b === 'string' ? b : b && b.name, 60);
    desc = clean(prod.description, 400);
    const img = [].concat(prod.image || [])[0]; image = typeof img === 'string' ? img : img && img.url || '';
    const offers = [].concat(prod.offers || []).flatMap(o => (o && o.offers ? [].concat(o.offers) : [o])).filter(Boolean);
    for (const o of offers) {
      const p = parsePrice(o.price ?? o.lowPrice ?? (o.priceSpecification && o.priceSpecification.price));
      if (p) { price = p; currency = String(o.priceCurrency || (o.priceSpecification && o.priceSpecification.priceCurrency) || ''); break; }
    }
    for (const a of [].concat(prod.additionalProperty || [])) if (a && /gr[öo]ße|größe|size|durchmesser|abmessung|dimension|volumen|fassungs/i.test(String(a.name || ''))) { size = clean(`${a.value ?? ''} ${a.unitText || ''}`, 40); if (size) break; }
    if (!size && prod.size) size = clean(typeof prod.size === 'string' ? prod.size : prod.size.name || prod.size.value, 40);
  }
  if (!title) { title = clean(meta['og:title'] || meta['twitter:title'], 200); if (title) source = source || 'og'; }
  if (price == null) {
    price = parsePrice(meta['product:price:amount'] ?? meta['og:price:amount'] ?? meta['product:sale_price:amount']);
    if (price) currency = meta['product:price:currency'] || meta['og:price:currency'] || currency;
    if (price) source = source || 'og';
  }
  if (price == null) {
    const mi = /itemprop\s*=\s*["']price["'][^>]*?(?:content\s*=\s*["']([^"']+)["']|>\s*([^<]+))/i.exec(html);
    if (mi) { price = parsePrice(mi[1] || mi[2]); if (price) { source = source || 'microdata'; const c = /itemprop\s*=\s*["']priceCurrency["'][^>]*content\s*=\s*["']([^"']+)["']/i.exec(html); currency = currency || (c && c[1]) || ''; } }
  }
  if (!title) { const t = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html); title = clean(t && t[1], 200).replace(/\s*[|–—-]\s*[^|–—-]{2,40}$/, ''); if (title) source = source || 'title'; }
  if (!desc) desc = clean(meta['og:description'] || meta['description'], 400);
  if (!brand) brand = clean(meta['product:brand'] || meta['og:brand'], 60);
  if (!image) image = meta['og:image'] || '';
  if (!size) size = findSize(title, desc);
  if (!title) throw new HttpError(422, 'Auf dieser Seite haben wir kein Produkt gefunden.');
  let host = ''; try { host = new URL(pageUrl).hostname.replace(/^www\./, ''); } catch { /* ohne Host */ }
  return { title, price, currency: price ? (String(currency).toUpperCase() || 'EUR') : '', brand, size, description: desc, host, source, hasImage: !!image };
}

/**
 * Shopify-Shops (und viele andere) legen die gewählte Variante in den Link (?variant=…). Das öffentliche Produkt-JSON nennt sie genau:
 * Titel, Größe und Preis der Variante. Ohne diese Angabe stünde oft die erste Variante im Seitenquelltext (zum Beispiel die kleinste Größe).
 */
export function applyVariant(product, json, variantId) {
  let data; try { data = JSON.parse(json); } catch { return product; }
  const v = (data.variants || []).find(x => String(x.id) === String(variantId));
  if (!v) return product;
  const vt = String(v.title || '').trim();
  const named = vt && !/^default title$/i.test(vt) ? vt : '';
  const out = { ...product };
  if (data.title) out.title = clean(data.title, 160) + (named ? ` (${clean(named, 60)})` : '');
  const cents = Number(v.price);
  if (Number.isFinite(cents) && cents > 0) { out.price = String(v.price).includes('.') ? cents : cents / 100; out.currency = out.currency || 'EUR'; }
  const size = findSize(named, v.option1, v.option2);
  if (size) out.size = size; else if (named) out.size = clean(named, 60);
  out.source = (out.source || 'jsonld') + '+variante';
  return out;
}

export async function inspect(raw, doRequest = request) {
  const page = await fetchPage(raw, doRequest);
  let product = extractProduct(page.html, page.url);
  try {
    const u = new URL(page.url), vid = u.searchParams.get('variant'), m = /^(\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?products\/[^/?#]+)/i.exec(u.pathname);
    if (vid && /^\d{5,20}$/.test(vid) && m) {
      const js = await fetchPage(`${u.origin}${m[1]}.js`, doRequest);
      product = applyVariant(product, js.html, vid);
    }
  } catch { /* ohne Variante weiter */ }
  return { ...product, url: page.url };
}
