import { requireUser, send, fail, HttpError } from './_lib/auth.js';
import { paymentsConfigured, stripe, db, SITE } from './_lib/stripe.js';

/** Startet eine Zahlung für ein Angebot. Body: { offer: 'code' }. Antwort: { url } zur Stripe-Kasse. Nur angemeldete Personen. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Nur POST.' });
  try {
    if (!paymentsConfigured()) throw new HttpError(503, 'Bezahlen ist noch nicht freigeschaltet.');
    const { id: userId, email } = await requireUser(req);
    const code = String(req.body?.offer || '');
    if (!/^[a-z0-9_]{3,40}$/.test(code)) throw new HttpError(400, 'Unbekanntes Angebot.');
    const q = db(), now = new Date().toISOString();
    // Das Angebot lesen wir selbst: Preis und Inhalt kommen nie aus dem Browser.
    const [offer] = await q(`offers?select=*&code=eq.${code}&active=eq.true&or=(starts_at.is.null,starts_at.lte.${now})&or=(ends_at.is.null,ends_at.gt.${now})&limit=1`);
    if (!offer) throw new HttpError(404, 'Dieses Angebot ist gerade nicht buchbar.');
    const sub = !!offer.interval;
    const session = await stripe('checkout/sessions', {
      mode: sub ? 'subscription' : 'payment',
      line_items: [{ quantity: 1, price_data: { currency: 'eur', unit_amount: offer.price_cents, product_data: { name: `Wishtale: ${offer.title}` }, ...(sub ? { recurring: { interval: offer.interval } } : {}) } }],
      success_url: `${SITE()}/app/#plan`, cancel_url: `${SITE()}/app/#plan`,
      client_reference_id: userId, customer_email: email || undefined,
      locale: 'de', allow_promotion_codes: 'true', billing_address_collection: 'auto',
    });
    await q('orders', { method: 'POST', body: { user_id: userId, offer_code: offer.code, offer_title: offer.title, amount_cents: offer.price_cents, grants: { ...offer.grants, interval: offer.interval }, stripe_session_id: session.id } });
    return send(res, 200, { url: session.url });
  } catch (e) { return fail(res, e); }
}
