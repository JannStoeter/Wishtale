/*
 * Prüft, ob der Aufruf von einem freigegebenen Administrator kommt.
 * Der Browser schickt das Anmelde-Token von Supabase mit. Wir fragen Supabase, wer das ist und ob is_admin() wahr ist.
 */
export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uzercrfhieipplgrjbvk.supabase.co';
export const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Fe851H8Bv5uUX5_xBrbXdg_6msn6N_X';

export class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }

export async function requireAdmin(req, fetchImpl = fetch) {
  const h = req.headers?.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) throw new HttpError(401, 'Bitte melde dich an.');
  const headers = { apikey: SUPABASE_KEY, authorization: `Bearer ${token}` };
  const u = await fetchImpl(`${SUPABASE_URL}/auth/v1/user`, { headers });
  if (!u.ok) throw new HttpError(401, 'Die Anmeldung ist abgelaufen. Bitte melde dich neu an.');
  const r = await fetchImpl(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body: '{}' });
  if (!r.ok || (await r.json()) !== true) throw new HttpError(403, 'Dieses Konto darf das nicht.');
  return { token };
}

/** REST-Aufruf an Supabase mit dem Token des Admins (die Regeln der Datenbank gelten) oder mit dem Dienstschlüssel (nur Cron). */
export function rest(token, fetchImpl = fetch) {
  // Neue geheime Schlüssel (sb_secret_…) gehören in apikey, alte (JWT) zusätzlich als Bearer.
  const headers = String(token).startsWith('sb_secret_') ? { apikey: token, 'content-type': 'application/json' } : { apikey: SUPABASE_KEY, authorization: `Bearer ${token}`, 'content-type': 'application/json' };
  return async (path, { method = 'GET', body } = {}) => {
    const r = await fetchImpl(`${SUPABASE_URL}/rest/v1/${path}`, { method, headers: { ...headers, prefer: 'return=representation' }, body: body ? JSON.stringify(body) : undefined });
    const text = await r.text(); let data = null; try { data = text ? JSON.parse(text) : null; } catch { /* leer */ }
    if (!r.ok) throw new HttpError(r.status, (data && (data.message || data.error)) || `Datenbank-Fehler ${r.status}`);
    return data;
  };
}

export const send = (res, status, body) => { res.status(status).setHeader('Cache-Control', 'no-store'); res.json(body); };
export const fail = (res, e) => send(res, e.status || 500, { error: e.status ? e.message : 'Unerwarteter Fehler. Bitte versuche es noch einmal.' });

/** Für Funktionen, die jede angemeldete Person nutzen darf (nicht nur Admins). Gibt die Nutzer-ID zurück. */
export async function requireUser(req, fetchImpl = fetch) {
  const h = req.headers?.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) throw new HttpError(401, 'Bitte melde dich an.');
  const u = await fetchImpl(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_KEY, authorization: `Bearer ${token}` } });
  if (!u.ok) throw new HttpError(401, 'Die Anmeldung ist abgelaufen. Bitte melde dich neu an.');
  const j = await u.json().catch(() => ({}));
  if (!j.id) throw new HttpError(401, 'Bitte melde dich an.');
  return { id: j.id, email: j.email || '', token };
}
