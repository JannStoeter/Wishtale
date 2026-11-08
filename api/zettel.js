import { requireUser, send, fail, HttpError } from './_lib/auth.js';
import { readZettel } from './_lib/zettel.js';
import { entitlementsOf, can, recordUsage } from './_lib/entitlements.js';

const seen = new Map(); // einfache Bremse pro Instanz: höchstens 6 Zettel in 10 Minuten je Person
const limited = id => { const now = Date.now(), l = (seen.get(id) || []).filter(t => now - t < 600000); l.push(now); seen.set(id, l); return l.length > 6; };

/** Liest einen Wunschzettel (Bilder oder Text). Body: { text, images: [{ media, data }] } (nur angemeldete Personen) */
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Nur POST.' });
  try {
    const { id } = await requireUser(req);
    if (limited(id)) throw new HttpError(429, 'Das waren gerade etwas viele Zettel. Bitte versuche es in ein paar Minuten noch einmal.');
    if (!can(await entitlementsOf(id), 'zettel')) throw new HttpError(402, 'Das Einlesen von Wunschzetteln gehört zu Wishtale Plus.');
    return send(res, 200, await readZettel({ ...(req.body || {}), onUsage: (u, model) => recordUsage(id, `zettel:${model}`, u) }));
  } catch (e) { return fail(res, e); }
}
