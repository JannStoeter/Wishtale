import { send, fail, HttpError } from './_lib/auth.js';
import { ideasFor, OCCASIONS } from './_lib/ideas.js';

const seen = new Map(); // einfache Bremse pro Instanz: höchstens 20 Abrufe in 10 Minuten je Adresse
const limited = ip => { const now = Date.now(), l = (seen.get(ip) || []).filter(t => now - t < 600000); l.push(now); seen.set(ip, l); return l.length > 20; };

/** Ideen zu einem Profil (öffentlich, wie die Gast-Ansicht). Query: h (Kürzel), occ. Ergebnis wird beim CDN zwischengespeichert. */
export default async function handler(req, res) {
  try {
    const h = String(req.query?.h || '').toLowerCase();
    if (!/^[a-z0-9-]{3,31}$/.test(h)) throw new HttpError(400, 'Ungültiges Profil.');
    const occ = OCCASIONS.includes(req.query?.occ) ? req.query.occ : 'ohne';
    const ip = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim() || 'x';
    if (limited(ip)) throw new HttpError(429, 'Bitte versuche es in ein paar Minuten noch einmal.');
    const out = await ideasFor(h, occ);
    res.status(200).setHeader('Cache-Control', out.off || !out.ideas.length ? 'public, s-maxage=300' : 'public, s-maxage=21600, stale-while-revalidate=86400');
    return res.json(out);
  } catch (e) { return fail(res, e); }
}
