import { HttpError } from './_lib/auth.js';
import { verifySignature, handleEvent, db } from './_lib/stripe.js';

export const config = { api: { bodyParser: false } }; // die Signatur braucht den unveränderten Text

const raw = req => new Promise((resolve, reject) => { const c = []; req.on('data', d => c.push(d)); req.on('end', () => resolve(Buffer.concat(c).toString('utf8'))); req.on('error', reject); });

/** Empfängt Ereignisse von Stripe, prüft die Signatur und vergibt die Rechte. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nur POST.' });
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ error: 'Nicht eingerichtet.' });
  try {
    const body = await raw(req);
    if (!verifySignature(body, req.headers['stripe-signature'], secret)) throw new HttpError(400, 'Signatur ungültig.');
    const result = await handleEvent(JSON.parse(body), db());
    console.log('stripe', JSON.parse(body).type, result);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('stripe-webhook', e.message);
    return res.status(e.status || 500).json({ error: e.status ? e.message : 'Fehler.' }); // 5xx lässt Stripe es erneut versuchen
  }
}
