import { createHash } from 'node:crypto';
import { requireUser, send, fail, HttpError, SUPABASE_URL, SUPABASE_KEY } from './_lib/auth.js';
import { ipHash } from './_lib/limits.js';

/*
 * Sammelstelle für Aufrufe, die nicht direkt aus dem Browser an die Datenbank gehen dürfen (Befund 043):
 *   POST ?op=reserve | release | bought   Reservieren, Freigeben, „gekauft“ (Gäste, ohne Konto, je Adresse begrenzt)
 *   POST ?op=delete                       Konto löschen inklusive der Wunschbilder im Speicher (nur angemeldete Person)
 * Der Dienstschlüssel steht nur in Vercel (SUPABASE_SECRET_KEY oder SUPABASE_SERVICE_ROLE_KEY).
 */
const key = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const svc = k => (String(k).startsWith('sb_secret_') ? { apikey: k } : { apikey: k, authorization: `Bearer ${k}` });
const sha = t => createHash('sha256').update(t).digest('hex');

async function hit(k, bucket, seconds, max, fetchImpl = fetch) {
  try {
    const r = await fetchImpl(`${SUPABASE_URL}/rest/v1/rpc/hit_limit`, { method: 'POST', headers: { ...svc(k), 'content-type': 'application/json' }, body: JSON.stringify({ p_bucket: bucket, p_window_seconds: seconds, p_max: max }) });
    if (!r.ok) return true; // bei Fehlern der Datenbank nicht sperren
    return (await r.json()).ok !== false;
  } catch { return true; }
}

const GUEST_FN = { reserve: 'reserve_wish', release: 'release_wish', bought: 'mark_bought' };
const MAX_ACTIVE_PER_TOKEN = 12; // ein Gast reserviert nicht mehr als zwölf Wünsche

export async function guestOp(op, body, ip, fetchImpl = fetch) {
  const k = key();
  if (!k) throw new HttpError(503, 'Reservieren ist gerade nicht möglich.');
  const wish = String(body?.wish || ''), token = String(body?.token || '');
  if (!/^[0-9a-f-]{36}$/i.test(wish) || token.length < 16 || token.length > 200) throw new HttpError(400, 'Ungültige Anfrage.');
  const who = ipHash(ip || 'x');
  if (!(await hit(k, `acct:${op}:${who}`, 3600, op === 'reserve' ? 20 : 60, fetchImpl))) throw new HttpError(429, 'Das waren gerade sehr viele Aktionen. Bitte versuche es später noch einmal.');
  if (op === 'reserve') {
    const r = await fetchImpl(`${SUPABASE_URL}/rest/v1/reservations?select=id&token_hash=eq.${sha(token)}&limit=${MAX_ACTIVE_PER_TOKEN + 1}`, { headers: svc(k) });
    const rows = r.ok ? await r.json() : [];
    if (Array.isArray(rows) && rows.length >= MAX_ACTIVE_PER_TOKEN) throw new HttpError(429, 'Du hast schon viele Wünsche reserviert. Gib erst einen frei, bevor du weitere reservierst.');
  }
  const r = await fetchImpl(`${SUPABASE_URL}/rest/v1/rpc/${GUEST_FN[op]}`, { method: 'POST', headers: { ...svc(k), 'content-type': 'application/json' }, body: JSON.stringify({ p_wish_id: wish, p_token: token }) });
  if (!r.ok) throw new HttpError(502, 'Das hat nicht geklappt. Bitte versuche es noch einmal.');
  return r.json();
}

/** Löscht alle Dateien im Ordner <Konto>/ im Bucket wish-images. */
export async function removeImages(userId, fetchImpl = fetch) {
  const k = key();
  if (!k || !/^[0-9a-f-]{36}$/i.test(userId)) return 0;
  let removed = 0;
  for (let i = 0; i < 20; i++) { // höchstens 20 Runden à 100 Dateien
    const l = await fetchImpl(`${SUPABASE_URL}/storage/v1/object/list/wish-images`, { method: 'POST', headers: { ...svc(k), 'content-type': 'application/json' }, body: JSON.stringify({ prefix: `${userId}/`, limit: 100 }) });
    const items = l.ok ? await l.json() : [];
    const paths = (Array.isArray(items) ? items : []).map(o => `${userId}/${o.name}`);
    if (!paths.length) break;
    const d = await fetchImpl(`${SUPABASE_URL}/storage/v1/object/wish-images`, { method: 'DELETE', headers: { ...svc(k), 'content-type': 'application/json' }, body: JSON.stringify({ prefixes: paths }) });
    if (!d.ok) throw new HttpError(502, 'Die Bilder konnten nicht gelöscht werden.');
    removed += paths.length;
  }
  return removed;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Nur POST.' });
  try {
    const op = String(req.query?.op || '');
    if (GUEST_FN[op]) {
      const ip = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim();
      return send(res, 200, await guestOp(op, req.body, ip));
    }
    if (op === 'delete') {
      const { token, id } = await requireUser(req);
      await removeImages(id); // zuerst die Bilder, dann das Konto
      const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/delete_my_account`, { method: 'POST', headers: { apikey: SUPABASE_KEY, authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: '{}' });
      if (!r.ok || (await r.json()) !== true) throw new HttpError(502, 'Das Konto konnte nicht gelöscht werden.');
      return send(res, 200, { ok: true });
    }
    return send(res, 404, { error: 'Unbekannte Funktion.' });
  } catch (e) { return fail(res, e); }
}
