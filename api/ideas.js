import { send, fail, HttpError, requireUser } from './_lib/auth.js';
import { ideasFor, OCCASIONS } from './_lib/ideas.js';
import { entitlementsOf, can, recordUsage, ownerOf } from './_lib/entitlements.js';
import { guardLlm } from './_lib/limits.js';

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
    const mode = ['self', 'wish'].includes(req.query?.mode) ? req.query.mode : 'gift';
    const wid = String(req.query?.w || '');
    if (mode === 'wish' && !/^[0-9a-f-]{36}$/i.test(wid)) throw new HttpError(400, 'Ungültiger Wunsch.');
    // Eigene Ansicht (mode=self mit Anmeldung): auch Privates fließt ein, das Ergebnis bleibt nur im eigenen Browser.
    const own = mode === 'self' && /^Bearer /.test(req.headers?.authorization || '') ? await requireUser(req) : null;
    const feature = mode === 'self' ? 'ideas.self' : mode === 'wish' ? 'ideas.wish' : 'ideas.guest';
    const payer = own?.id || await ownerOf(h); // der Verbrauch geht auf das Konto, um dessen Profil es geht
    if (payer && !can(await entitlementsOf(payer), feature)) { res.status(200).setHeader('Cache-Control', 'public, s-maxage=600'); return res.json({ ideas: [], locked: true }); }
    const out = await ideasFor(h, occ, fetch, { mode, wid, budget: req.query?.b, token: own?.token, onUsage: (u, model) => payer && recordUsage(payer, `${feature}:${model}`, u), guard: () => guardLlm({ ip: own ? '' : ip, payer, feature }) });
    res.status(200).setHeader('Cache-Control', own ? 'private, max-age=21600' : out.off || !out.ideas.length ? 'public, s-maxage=300' : 'public, s-maxage=21600, stale-while-revalidate=86400');
    return res.json(out);
  } catch (e) { return fail(res, e); }
}
