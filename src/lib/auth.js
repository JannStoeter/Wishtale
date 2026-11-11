import { sb } from './supabase.js';
import { S, draftHasData, ensureDraft, clearDraft } from '../state.js';
import { loadMine } from './remote.js';
import { utmFromUrl } from './track.js';
import { invitePayload } from './invite.js';

/** Ziel nach dem Klick auf den Link in der Mail: immer die App der Seite, auf der man sich angemeldet hat. */
export const redirectUrl = () => location.origin + '/app/';

export function friendly(err) {
  const m = (err && (err.message || String(err))) || '';
  const c = err && err.code;
  if (/invalid login credentials/i.test(m)) return 'E-Mail oder Passwort stimmt nicht.';
  if (/email not confirmed/i.test(m)) return 'Bitte bestätige zuerst deine E-Mail. Wir haben dir einen Link geschickt.';
  if (/already registered|already been registered/i.test(m)) return 'Diese E-Mail ist schon registriert. Bitte melde dich an.';
  if (/same password|different from the old/i.test(m)) return 'Bitte wähle ein Passwort, das du bisher nicht benutzt hast.';
  if (/password should be at least|weak/i.test(m)) return 'Das Passwort ist zu kurz oder zu einfach (mindestens 8 Zeichen).';
  if (c === 'over_email_send_rate_limit' || /rate limit|too many/i.test(m)) return 'Zu viele E-Mails in kurzer Zeit. Bitte warte ein paar Minuten.';
  if (/invalid.*email|unable to validate email/i.test(m)) return 'Diese E-Mail-Adresse sieht ungültig aus.';
  if (/failed to fetch|network/i.test(m)) return 'Keine Verbindung zum Server. Bitte prüfe dein Internet.';
  return m || 'Das hat nicht geklappt. Bitte versuche es noch einmal.';
}

export const signIn = (email, password) => sb.auth.signInWithPassword({ email, password });
/** Der Entwurf aus der Einrichtung reist im Konto mit. So geht nichts verloren, auch wenn der Bestätigungslink auf einem anderen Gerät oder in einem anderen Browser geöffnet wird. */
const draftPayload = () => {
  const d = S.accounts.draft;
  if (!draftHasData() || !d) return undefined;
  const cut = a => (a || []).slice(0, 30).map(x => String(x).slice(0, 60));
  return { interests: cut(d.interests), cats: cut(d.cats), brands: cut(d.brands), tries: cut(d.tries), nogos: cut(d.nogos), alts: cut(d.alts), quick: !!d.quick };
};
export const signUp = (name, email, password) =>
  sb.auth.signUp({ email, password, options: { data: { full_name: name, draft: draftPayload(), utm: utmFromUrl(), invite: invitePayload() }, emailRedirectTo: redirectUrl() } });
export const resendSignup = email =>
  sb.auth.resend({ type: 'signup', email, options: { emailRedirectTo: redirectUrl() } });
export const magicLink = email =>
  sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectUrl(), shouldCreateUser: true } });
export const resetPassword = email => sb.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl() });
export const setPassword = password => sb.auth.updateUser({ password });
export const signOut = () => sb.auth.signOut();

/** Nach dem Login: eigene Daten laden. */
export async function enter(user) {
  S.auth.user = user;
  S.ui.authSent = null; S.ui.authResent = null;
  S.auth.error = '';
  try { await loadMine(user); }
  catch (e) { S.auth.error = friendly(e); console.error(e); }
}

/**
 * Hat jemand sein Wishtale ohne Konto eingerichtet, wandert der Entwurf nach der Anmeldung ins neue Konto.
 * Ein Konto, das schon Inhalte hat, wird nie überschrieben. Gibt true zurück, wenn etwas übernommen wurde.
 */
export function adoptDraft() {
  ensureDraft();
  let d = draftHasData() ? S.accounts.draft : null;
  const meta = S.auth.user && S.auth.user.user_metadata && S.auth.user.user_metadata.draft;
  if (!d && meta && typeof meta === 'object') {
    // Kein Entwurf in diesem Browser (zum Beispiel Link am Handy geöffnet): aus dem Konto nehmen
    const list = v => (Array.isArray(v) ? v.filter(x => typeof x === 'string').slice(0, 30).map(x => x.slice(0, 60)) : []);
    d = { quick: !!meta.quick, name: S.auth.user.user_metadata.full_name || '', interests: list(meta.interests), cats: list(meta.cats), brands: list(meta.brands), tries: list(meta.tries), nogos: list(meta.nogos), alts: list(meta.alts) };
  }
  if (meta) sb.auth.updateUser({ data: { draft: null } }).catch(() => {}); // einmal übernommen, dann weg
  const a = S.accounts.me;
  if (!d) { clearDraft(); return false; }
  const empty = a && !a.interests.length && !a.cats.length && !a.brands.length && !a.wishes.length;
  let took = false;
  if (empty) {
    if (d.name && d.name.trim()) a.name = d.name.trim();
    for (const k of ['interests', 'cats', 'brands', 'tries', 'nogos', 'alts']) a[k] = [...d[k]];
    took = d.interests.length + d.cats.length + d.brands.length + d.tries.length + d.nogos.length + d.alts.length > 0;
  }
  const quick = !!d.quick && !took;
  clearDraft();
  return quick ? 'quick' : took;
}
