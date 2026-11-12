import { requireUser, send, fail, HttpError } from './_lib/auth.js';
import { inspect, fetchImage } from './_lib/inspect.js';
import { findProductImage } from './_lib/imgsearch.js';

const seen = new Map(); // einfache Bremse pro Instanz: höchstens 20 Abrufe in 10 Minuten je Person
const limited = id => { const now = Date.now(), l = (seen.get(id) || []).filter(t => now - t < 600000); l.push(now); seen.set(id, l); return l.length > 40; };

/** Liest Name, Preis, Marke, Größe und Bildadresse einer Produktseite (Body: { url }) oder holt ein Produktbild (Body: { imageUrl }). Nur angemeldete Personen. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Nur POST.' });
  try {
    const { id } = await requireUser(req);
    if (limited(id)) throw new HttpError(429, 'Das waren gerade etwas viele Abrufe. Bitte versuche es in ein paar Minuten noch einmal.');
    if (req.body?.imageUrl) { // Produktbild holen (Bytes kommen als Base64 zurück, der Browser verkleinert und speichert es bei uns)
      const iu = String(req.body.imageUrl).trim();
      if (iu.length > 800) throw new HttpError(400, 'Das ist keine gültige Bildadresse.');
      return send(res, 200, { image: await fetchImage(iu) });
    }
    if (req.body?.imageQuery) return send(res, 200, { image: await findProductImage(req.body.imageQuery) }); // Bild per Websuche (nur mit Schlüssel), sonst null
    const url = String(req.body?.url || '').trim();
    if (!url || url.length > 1000) throw new HttpError(400, 'Bitte füge einen Link ein.');
    return send(res, 200, { product: await inspect(url) });
  } catch (e) { return fail(res, e); }
}
