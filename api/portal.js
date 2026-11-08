import { requireUser, send, fail, HttpError } from './_lib/auth.js';
import { paymentsConfigured, stripe, db, SITE } from './_lib/stripe.js';

/** Link zum Kundenportal (Abo ansehen, Zahlungsart ändern, kündigen). Nur angemeldete Personen mit früherer Zahlung. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Nur POST.' });
  try {
    if (!paymentsConfigured()) throw new HttpError(503, 'Bezahlen ist noch nicht freigeschaltet.');
    const { id } = await requireUser(req);
    const [c] = await db()(`billing_customers?select=customer_id&user_id=eq.${id}&limit=1`);
    if (!c) throw new HttpError(404, 'Zu deinem Konto gibt es noch keine Zahlung.');
    const s = await stripe('billing_portal/sessions', { customer: c.customer_id, return_url: `${SITE()}/app/#plan`, locale: 'de' });
    return send(res, 200, { url: s.url });
  } catch (e) { return fail(res, e); }
}
