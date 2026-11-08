/*
 * Zahlungsweg (Stripe) ohne Zusatzpaket: Checkout-Sitzung, Kundenportal, Prüfung der Webhook-Signatur und das Vergeben der Rechte.
 * Schlüssel stehen nur in Vercel (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET). Ohne Schlüssel bleibt der Zahlungsweg aus.
 * Rechte entstehen erst nach bestätigter Zahlung (Webhook), nie durch den Browser.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { HttpError, rest } from './auth.js';

export const paymentsConfigured = () => !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET;
export const SITE = () => process.env.SITE_URL || 'https://wishtale.de';
const dbKey = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
export const db = (fetchImpl = fetch) => { const k = dbKey(); if (!k) throw new HttpError(503, 'Die Datenbank ist für Zahlungen noch nicht eingerichtet.'); return rest(k, fetchImpl); };

/** Verschachtelte Felder als Stripe-Formular: a[b][0][c]=x */
export function form(obj, prefix = '', out = []) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v == null) continue;
    if (typeof v === 'object') form(v, key, out); else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
  }
  return out;
}

export async function stripe(path, params, fetchImpl = fetch) {
  const r = await fetchImpl(`https://api.stripe.com/v1/${path}`, {
    method: 'POST', signal: AbortSignal.timeout(20000),
    headers: { authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'content-type': 'application/x-www-form-urlencoded' },
    body: form(params).join('&'),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { console.error('stripe', r.status, j.error?.type, String(j.error?.message || '').slice(0, 200)); throw new HttpError(502, 'Der Zahlungsdienst antwortet gerade nicht. Bitte versuche es noch einmal.'); }
  return j;
}

/** Stripe-Signatur prüfen: Header „t=…,v1=…“, signiert wird „t.rohtext“. Toleranz 5 Minuten. */
export function verifySignature(raw, header, secret, now = Date.now()) {
  const parts = Object.fromEntries(String(header || '').split(',').map(p => p.split('=')));
  const t = +parts.t;
  if (!t || Math.abs(now / 1000 - t) > 300 || !parts.v1) return false;
  const want = createHmac('sha256', secret).update(`${t}.${raw}`).digest('hex');
  const a = Buffer.from(want), b = Buffer.from(parts.v1);
  return a.length === b.length && timingSafeEqual(a, b);
}

const DAY = 864e5;
/** Rechte aus den Grants eines Angebots anlegen. Doppelt hält nicht: gleiche Referenz + Schlüssel wird nicht erneut angelegt. */
export async function grant(q, userId, grants, ref, validUntil = null) {
  const rows = [];
  if (grants.plan) rows.push({ kind: 'plan', key: grants.plan, valid_until: validUntil });
  for (const f of grants.features || []) rows.push({ kind: 'feature', key: f, valid_until: grants.days ? new Date(Date.now() + grants.days * DAY).toISOString() : null });
  if (grants.credits > 0) rows.push({ kind: 'credit', key: 'credits', quantity: grants.credits | 0, valid_until: grants.days ? new Date(Date.now() + grants.days * DAY).toISOString() : null });
  for (const r of rows) {
    const ex = await q(`entitlements?select=id&user_id=eq.${userId}&external_ref=eq.${encodeURIComponent(ref)}&kind=eq.${r.kind}&key=eq.${encodeURIComponent(r.key)}&limit=1`);
    if (ex?.length) continue;
    await q('entitlements', { method: 'POST', body: { user_id: userId, source: 'stripe', external_ref: ref, ...r } });
  }
  return rows.length;
}

/** Ein Stripe-Ereignis verarbeiten. Gibt kurz zurück, was passiert ist (für Tests und Logs). */
export async function handleEvent(ev, q) {
  const o = ev.data?.object || {};
  if (ev.type === 'checkout.session.completed') {
    const [order] = await q(`orders?select=*&stripe_session_id=eq.${encodeURIComponent(o.id)}&limit=1`);
    if (!order) return 'unbekannte Sitzung';
    if (order.status === 'paid') return 'schon verbucht';
    if (o.payment_status && o.payment_status !== 'paid' && o.payment_status !== 'no_payment_required') return 'noch nicht bezahlt';
    await q(`orders?id=eq.${order.id}`, { method: 'PATCH', body: { status: 'paid', paid_at: new Date().toISOString() } });
    if (o.customer) await q('billing_customers?on_conflict=user_id', { method: 'POST', body: { user_id: order.user_id, customer_id: o.customer } }).catch(() => {});
    const sub = o.mode === 'subscription' ? o.subscription : null;
    const until = sub ? new Date(Date.now() + (order.grants?.interval === 'year' ? 367 : 32) * DAY).toISOString() : null;
    const n = await grant(q, order.user_id, order.grants || {}, sub || o.id, until);
    return `bezahlt, ${n} Rechte`;
  }
  if (ev.type === 'invoice.paid' && o.subscription) {
    const end = o.lines?.data?.[0]?.period?.end;
    if (!end) return 'kein Zeitraum';
    await q(`entitlements?external_ref=eq.${encodeURIComponent(o.subscription)}&kind=eq.plan`, { method: 'PATCH', body: { valid_until: new Date(end * 1000 + 2 * DAY).toISOString() } });
    return 'Abo verlängert';
  }
  if (ev.type === 'customer.subscription.deleted') {
    await q(`entitlements?external_ref=eq.${encodeURIComponent(o.id)}&kind=eq.plan`, { method: 'PATCH', body: { valid_until: new Date().toISOString() } });
    return 'Abo beendet';
  }
  if (ev.type === 'charge.refunded' && o.payment_intent) return 'Erstattung gemeldet (bitte im CMS prüfen)';
  return 'ignoriert';
}
