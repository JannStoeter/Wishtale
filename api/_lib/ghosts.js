/*
 * Gastkonten aufräumen (141): Wer „Wunschliste anlegen“ tippt, bekommt ein anonymes Konto in Supabase.
 * Wird es nicht mit Google oder E-Mail gesichert, löscht der tägliche Lauf es 30 Tage nach der letzten Änderung samt Wünschen und Bildern.
 * Gesicherte Konten sind nicht mehr anonym und bleiben unberührt.
 */
import { SUPABASE_URL } from './auth.js';

export const GHOST_DAYS = 30;
const svc = k => (String(k).startsWith('sb_secret_') ? { apikey: k } : { apikey: k, authorization: `Bearer ${k}` });
const t = v => (v ? Date.parse(v) || 0 : 0);

/** Letzte Aktivität eines Gastkontos: Anlage, Anmeldung oder die jüngste Änderung an Profil oder Wünschen. */
export const lastActive = (user, touched = 0) => Math.max(t(user.created_at), t(user.last_sign_in_at), t(user.updated_at), touched);

/** Liefert die IDs der Gastkonten, die seit GHOST_DAYS Tagen ruhen. */
export async function staleGhosts(k, fetchImpl = fetch, now = Date.now()) {
  const h = svc(k), ghosts = [];
  for (let page = 1; page <= 20; page++) {
    const r = await fetchImpl(`${SUPABASE_URL}/auth/v1/admin/users?page=${page}&per_page=200`, { headers: h });
    if (!r.ok) break;
    const j = await r.json().catch(() => ({}));
    const users = Array.isArray(j.users) ? j.users : [];
    ghosts.push(...users.filter(u => u && u.is_anonymous && /^[0-9a-f-]{36}$/i.test(u.id)));
    if (users.length < 200) break;
  }
  const cut = now - GHOST_DAYS * 864e5, old = ghosts.filter(u => lastActive(u) < cut);
  if (!old.length) return [];
  // Jüngste Änderung an Profil und Wünschen dazunehmen, damit niemand gelöscht wird, der die Liste noch pflegt
  const ids = old.map(u => u.id).join(',');
  const pr = await fetchImpl(`${SUPABASE_URL}/rest/v1/profiles?select=id,owner_id,updated_at&owner_id=in.(${ids})`, { headers: h });
  const profs = pr.ok ? await pr.json().catch(() => []) : [];
  const touched = new Map();
  for (const p of profs) touched.set(p.owner_id, Math.max(touched.get(p.owner_id) || 0, t(p.updated_at)));
  if (profs.length) {
    const wr = await fetchImpl(`${SUPABASE_URL}/rest/v1/wishes?select=profile_id,updated_at&profile_id=in.(${profs.map(p => p.id).join(',')})&order=updated_at.desc`, { headers: h });
    const ws = wr.ok ? await wr.json().catch(() => []) : [];
    const owner = new Map(profs.map(p => [p.id, p.owner_id]));
    for (const w of ws) { const o = owner.get(w.profile_id); if (o) touched.set(o, Math.max(touched.get(o) || 0, t(w.updated_at))); }
  }
  return old.filter(u => lastActive(u, touched.get(u.id) || 0) < cut).map(u => u.id);
}

/** Löscht ruhende Gastkonten (höchstens 50 je Lauf), zuerst die Bilder, dann das Konto. Profile und Wünsche folgen über „on delete cascade“. */
export async function sweepGhosts(k, removeImages, fetchImpl = fetch, now = Date.now()) {
  if (!k) return 0;
  const ids = (await staleGhosts(k, fetchImpl, now)).slice(0, 50);
  let n = 0;
  for (const id of ids) {
    try {
      await removeImages(id, fetchImpl);
      const d = await fetchImpl(`${SUPABASE_URL}/auth/v1/admin/users/${id}`, { method: 'DELETE', headers: svc(k) });
      if (d.ok) n++;
    } catch { /* nächster Lauf versucht es wieder */ }
  }
  return n;
}
