/*
 * Einladung mit vorbereitetem Entwurf (Entscheidung 039, Migration 0025).
 * Der Link enthält nur einen Zufallscode. Name und Tipps liegen in der Datenbank (invites), erst die eingeladene Person legt ein Konto an.
 * Vor der Registrierung merkt der Browser Code, Name und die behaltenen Tipps (wishtale:invite), sie reisen im Konto mit (user_metadata.invite),
 * damit es auch klappt, wenn der Bestätigungslink auf einem anderen Gerät geöffnet wird.
 */
import { sb } from './supabase.js';
import { S, W } from '../state.js';
import { cat, crea } from '../data/content.js';
import { guessCategory } from './category.js';

const KEY = 'wishtale:invite';
const clean = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
export const validCode = c => /^[0-9a-f]{16,100}$/i.test(String(c || ''));

/** Name, der bei „Tipp von …“ steht: eigene Einladung (invite:<Name>) oder ein Ersteller aus dem Katalog. */
export const viaName = v => (String(v || '').startsWith('invite:') ? String(v).slice(7) : ((crea(v) || {}).handle || ''));

export const inviteLink = code => `${location.origin}/app/#einladung/${code}`;

export const saveLocal = st => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* nur für diese Sitzung */ } };
export const loadLocal = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && validCode(v.code) ? v : null; } catch { return null; } };
export const clearLocal = () => { try { localStorage.removeItem(KEY); } catch { /* ignorieren */ } };

/** Für die Registrierung: das Wenige, das im Konto mitreist. */
export const invitePayload = () => { const v = loadLocal(); return v ? { code: v.code, name: clean(v.name, 40), keep: (v.keep || []).slice(0, 2).map(Boolean) } : undefined; };

export async function createInvite(name, tips) {
  const { data, error } = await sb.rpc('create_invite', { p_name: name, p_tips: tips });
  if (error) throw error;
  if (!data || !data.ok) throw new Error(data && data.reason === 'limit' ? 'Du hast schon zehn offene Einladungen. Widerrufe eine, bevor du eine neue anlegst.' : data && data.reason === 'name' ? 'Bitte gib einen Vornamen ein.' : 'Die Einladung konnte nicht angelegt werden.');
  return data.token;
}
export async function peekInvite(code) {
  const { data, error } = await sb.rpc('peek_invite', { p_token: code });
  if (error) throw error;
  return data && data.ok ? data : null;
}
export async function listInvites() {
  const { data, error } = await sb.from('invites').select('id,name,tips,created_at,expires_at,used_at').order('created_at', { ascending: false }).limit(20);
  if (error) throw error;
  return data || [];
}
export const revokeInvite = id => sb.from('invites').delete().eq('id', id);

/**
 * Nach der Anmeldung: Einladung einlösen und Name und behaltene Tipps ins neue Wishtale übernehmen.
 * Tipps erscheinen als Wünsche mit „Tipp von <Name>“ (via = invite:<Name>). Gibt { from, n } zurück oder false.
 */
export async function adoptInvite() {
  if (!S.auth.user) return false;
  const meta = S.auth.user.user_metadata && S.auth.user.user_metadata.invite;
  const st = meta && validCode(meta.code) ? meta : loadLocal();
  if (!st) return false;
  let r = null;
  try { const { data } = await sb.rpc('redeem_invite', { p_token: st.code }); r = data; } catch { /* ignorieren */ }
  clearLocal();
  if (meta) sb.auth.updateUser({ data: { invite: null } }).catch(() => {});
  if (!r || !r.ok) return false;
  const a = S.accounts.me;
  if (!a) return false;
  const keep = Array.isArray(st.keep) ? st.keep : [];
  let n = 0;
  (r.tips || []).forEach((t, i) => {
    if (keep.length && !keep[i]) return;
    const title = clean(t, 80);
    if (!title || a.wishes.some(w => w.t.toLowerCase() === title.toLowerCase())) return;
    const c = guessCategory(title, 'wohnen');
    a.wishes.unshift(W({ t: title, c, kind: 'produkt', prio: 2, vis: 'alle', via: 'invite:' + clean(r.from, 30), a: cat(c).a, tone: cat(c).t }));
    n++;
  });
  return { from: r.from, n };
}
