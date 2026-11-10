/*
 * Löst Amazon-Kurzlinks (amzn.to, amzn.eu, a.co) zur langen amazon.de-Adresse auf.
 * Der Browser darf das nicht selbst (CORS), darum läuft es hier auf dem Server.
 * Sicherheit: Es werden nur Adressen von Amazon-Hosts aufgerufen, auch bei jeder Weiterleitung.
 */
const SHORT = /^(amzn\.(to|eu)|a\.co)$/i;
const LONG = /(^|\.)amazon\.de$/i;
const allowed = h => SHORT.test(h) || LONG.test(h);

/* Pinterest-Kurzlinks (pin.it) führen über api.pinterest.com zur langen Adresse. Es wird nur diese Kette aufgerufen, die Zielseite selbst nie. */
const PIN_SHORT = /^(pin\.it|api\.pinterest\.com)$/i;
const PIN_LONG = /^(www\.|[a-z]{2}\.)?pinterest\.(com|de|at|ch|fr|es|it|nl|co\.uk)$/i;
export async function followPin(start, fetchImpl = fetch, maxHops = 4) {
  let url;
  try { url = new URL(start); } catch { return null; }
  for (let i = 0; i < maxHops; i++) {
    if (url.protocol !== 'https:') return null;
    if (PIN_LONG.test(url.hostname)) { url.search = ''; url.hash = ''; return url.href; }
    if (!PIN_SHORT.test(url.hostname) || (url.hostname.toLowerCase() === 'api.pinterest.com' && !url.pathname.startsWith('/url_shortener/'))) return null;
    const r = await fetchImpl(url.href, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(6000), headers: { 'user-agent': 'Mozilla/5.0 (compatible; Wishtale link resolver)' } });
    const loc = r.headers.get('location');
    if (!loc || r.status < 300 || r.status > 399) return null;
    try { url = new URL(loc, url); } catch { return null; }
  }
  return null;
}

export async function follow(start, fetchImpl = fetch, maxHops = 5) {
  let url;
  try { url = new URL(start); } catch { return null; }
  for (let i = 0; i < maxHops; i++) {
    if (url.protocol !== 'https:' || !allowed(url.hostname)) return null;
    if (LONG.test(url.hostname) && /\/(dp|gp\/product|gp\/aw\/d)\/[A-Z0-9]{10}/i.test(url.pathname)) return url.href;
    const r = await fetchImpl(url.href, {
      method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(6000),
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; Wishtale link resolver)', 'accept-language': 'de-DE,de;q=0.9' },
    });
    const loc = r.headers.get('location');
    if (!loc || r.status < 300 || r.status > 399) return null;
    try { url = new URL(loc, url); } catch { return null; }
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'public, s-maxage=86400');
  const u = String(req.query?.u || '');
  try {
    const out = req.query?.k === 'pin' ? await followPin(u) : await follow(u);
    if (!out) return res.status(422).json({ error: 'Der Kurzlink konnte nicht aufgelöst werden.' });
    return res.status(200).json({ url: out });
  } catch {
    return res.status(502).json({ error: 'Der Dienst hat nicht rechtzeitig geantwortet.' });
  }
}
