/*
 * Zweites Elternteil für Kind-Konten (Entscheidung 046, Migration 0026).
 * Ein Kind-Profil hat einen Hauptnutzer und höchstens ein weiteres Elternteil. Eingeladen wird per Link (Zufallscode, nur der Hash liegt in der
 * Datenbank, 14 Tage, einmal einlösbar). Alle Rechte prüft die Datenbank (can_manage), die Oberfläche zeigt nur den Weg dorthin.
 */
import { sb } from './supabase.js';
import { S } from '../state.js';
import { loadMine } from './remote.js';

const KEY = 'wishtale:coinvite';
export const validCode = c => /^[0-9a-f]{16,100}$/i.test(String(c || ''));
export const coLink = code => `${location.origin}/app/#mitverwalten/${code}`;
export const saveCode = c => { try { localStorage.setItem(KEY, String(c)); } catch { /* nur für diese Sitzung */ } };
const loadCode = () => { try { const v = localStorage.getItem(KEY); return validCode(v) ? v : null; } catch { return null; } };
export const clearCode = () => { try { localStorage.removeItem(KEY); } catch { /* ignorieren */ } };

/** Wer verwaltet das Kind-Konto? { is_owner, owner, member, open_invites } oder null (nur für die beiden Eltern). */
export async function managersOf(profileId) {
  const { data, error } = await sb.rpc('managers_of', { p_profile: profileId });
  if (error) throw error;
  return data || null;
}
export async function createCoInvite(profileId) {
  const { data, error } = await sb.rpc('create_member_invite', { p_profile: profileId });
  if (error) throw error;
  if (!data || !data.ok) throw new Error({ full: 'Es gibt schon ein zweites Elternteil.', limit: 'Du hast schon drei offene Einladungen. Zieh eine zurück, bevor du eine neue anlegst.', owner: 'Nur das Hauptkonto kann einladen.' }[data && data.reason] || 'Das hat leider nicht geklappt.');
  return data.token;
}
export async function revokeCoInvites(profileId) {
  const { error } = await sb.from('member_invites').delete().eq('profile_id', profileId).is('used_at', null);
  if (error) throw error;
}
/** Entfernt das zweite Elternteil (Hauptkonto) oder gibt die Verwaltung ab (das zweite Elternteil selbst). */
export async function removeMember(profileId) {
  const { error } = await sb.from('profile_members').delete().eq('profile_id', profileId);
  if (error) throw error;
}
export async function peekCoInvite(code) {
  const { data, error } = await sb.rpc('peek_member_invite', { p_token: code });
  if (error) throw error;
  return data && data.ok ? data : null;
}
export async function acceptCoInvite(code) {
  const { data, error } = await sb.rpc('accept_member_invite', { p_token: code });
  if (error) throw error;
  if (!data || !data.ok) throw new Error({ self: 'Das ist dein eigener Link: Du verwaltest dieses Wishtale schon.', full: 'Dieses Kind-Konto hat schon zwei Eltern.', invalid: 'Der Link gilt nicht mehr. Bitte lass dir einen neuen schicken.' }[data && data.reason] || 'Das hat leider nicht geklappt.');
  return data;
}

/** Nach der Anmeldung: eine vor der Anmeldung gemerkte Einladung einlösen und die Konten neu laden. Liefert { kid, from } oder null. */
export async function adoptCoInvite() {
  const code = loadCode(); if (!code || !S.auth.user) return null;
  clearCode();
  try { const r = await acceptCoInvite(code); await loadMine(S.auth.user); return r; } catch (e) { S.ui.coError = e.message; return null; }
}
/** Konto-Schlüssel eines mitverwalteten Kindes (nach dem Laden), bevorzugt mit dem Vornamen. */
export const sharedKey = name => { const e = Object.entries(S.accounts || {}).filter(([, a]) => a.shared); return (e.find(([, a]) => a.name.split(' ')[0] === name) || e[0] || [])[0] || null; };
