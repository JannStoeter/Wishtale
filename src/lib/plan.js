/* Mein Plan: Rechte, Verbrauch und buchbare Angebote. Durchgesetzt wird auf dem Server, hier wird nur angezeigt und die Kasse gestartet. */
import { sb } from './supabase.js';
import { S } from '../state.js';

export async function loadPlan(done) {
  if (S.plan) return;
  S.plan = { ent: null, offers: [], busy: false, error: '' };
  try {
    const [e, o] = await Promise.all([sb.rpc('my_entitlements'), sb.from('offers').select('*').order('sort', { ascending: true })]);
    S.plan.ent = e.error ? null : e.data;
    S.plan.offers = o.error ? [] : o.data;
  } catch { /* Anzeige bleibt leer */ }
  S.plan.loaded = true; done && done();
}

async function post(path, body) {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) throw new Error('Bitte melde dich an.');
  const r = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + session.access_token }, body: JSON.stringify(body || {}) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Das hat nicht geklappt.');
  return j;
}
export const startCheckout = offer => post('/api/checkout', { offer });
export const openPortal = () => post('/api/portal');
