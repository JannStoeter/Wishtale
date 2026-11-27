import { sb, SUPABASE_URL } from './supabase.js';
import { SUPABASE_KEY } from './config.js';
import { S, W, draftHasData, ensureDraft, clearDraft } from '../state.js';
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

/** Grobe Art eines Fehlers bei der Registrierung für die Statistik (Funnel), nie die Meldung selbst. */
export function errKind(err) {
  const m = (err && (err.message || String(err))) || '', c = err && err.code;
  if (/already registered|already been registered/i.test(m)) return 'exists';
  if (/password should be at least|weak/i.test(m)) return 'password';
  if (c === 'over_email_send_rate_limit' || /rate limit|too many/i.test(m)) return 'ratelimit';
  if (/invalid.*email|unable to validate email/i.test(m)) return 'email';
  if (/failed to fetch|network/i.test(m)) return 'network';
  return 'other';
}

export const signIn = (email, password) => sb.auth.signInWithPassword({ email, password });
/** Der Entwurf aus der Einrichtung reist im Konto mit. So geht nichts verloren, auch wenn der Bestätigungslink auf einem anderen Gerät oder in einem anderen Browser geöffnet wird. */
const draftPayload = () => {
  const d = S.accounts.draft;
  if (!draftHasData() || !d) return undefined;
  const cut = a => (a || []).slice(0, 30).map(x => String(x).slice(0, 60));
  // Wünsche ohne Konto reisen mit (nur Text, Link und Preis, keine Bilder), damit sie auch ankommen, wenn der Bestätigungslink auf einem anderen Gerät geöffnet wird
  const wishes = (d.wishes || []).filter(w => w.status === 'offen' || w.status === 'plan').slice(0, 40).map(w => ({ id: w.id, t: String(w.t || '').slice(0, 120), link: String(w.link || '').slice(0, 500), price: w.price || null, note: String(w.note || '').slice(0, 300), c: w.c, kind: w.kind, prio: w.prio, status: w.status, vis: w.vis }));
  return { interests: cut(d.interests), cats: cut(d.cats), brands: cut(d.brands), tries: cut(d.tries), nogos: cut(d.nogos), alts: cut(d.alts), quick: !!d.quick, wishes };
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

/** Anmelden mit Google (Supabase OAuth). Entwurf, Einladung und UTM-Kürzel bleiben im Browser und werden nach der Rückkehr übernommen. */
export const signInGoogle = () => {
  const u = utmFromUrl();
  try { if (Object.keys(u).length) sessionStorage.setItem('wishtale:utm', JSON.stringify(u)); } catch { /* ohne Speicher ohne Kürzel */ }
  return sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl(), queryParams: { prompt: 'select_account' } } });
};
/** Ist Google in Supabase eingeschaltet? Erst dann zeigt die Anmeldung den Knopf. */
export async function googleOn() {
  try {
    const r = await fetch(SUPABASE_URL + '/auth/v1/settings', { headers: { apikey: SUPABASE_KEY } });
    if (!r.ok) return false;
    const j = await r.json();
    return !!(j && j.external && j.external.google);
  } catch { return false; }
}
/* ---- Stilles Gastkonto (141): Wer „Wunschliste anlegen“ tippt, bekommt sofort ein anonymes Supabase-Konto. Damit laufen Suche, Ideen, Bilder und Fotoimport wie mit Konto.
   Sichern mit Google (linkIdentity) oder E-Mail (updateUser) macht daraus ein echtes Konto, dieselbe Nutzer-ID, nichts zieht um. ---- */
/** Noch ohne echtes Konto (anonym angemeldet)? */
export const isGhost = user => !!(user && user.is_anonymous);
/** Gastkonto anlegen. Gibt false zurück, wenn Supabase anonyme Anmeldung nicht erlaubt; dann bleibt der Entwurf im Browser (137). */
export async function startGhost() {
  try {
    const { data, error } = await sb.auth.signInAnonymously({ options: { data: { utm: utmFromUrl() } } });
    if (error || !data || !data.session) return false;
    return data.session.user;
  } catch { return false; }
}
/** Die Wünsche des Gastkontos als Entwurf im Browser ablegen. Falls am Ende ein anderes, schon bestehendes Konto angemeldet wird, übernimmt adoptDraft() sie dorthin. */
export function stashGhost() {
  if (!isGhost(S.auth.user) || !S.accounts.me) return;
  const me = S.accounts.me, d = ensureDraft();
  d.quick = true;
  d.wishes = me.wishes.filter(w => w.status === 'offen' || w.status === 'plan').slice(0, 60).map(w => ({ ...w }));
  for (const k of ['interests', 'cats', 'brands', 'tries', 'nogos', 'alts']) d[k] = [...(me[k] || [])];
  try { localStorage.setItem('wishtale:draft', JSON.stringify(d)); } catch { /* ohne Speicher bleibt nur das Gastkonto */ }
}
/** Gastkonto mit Google sichern. Gehört das Google-Konto schon jemandem, meldet boot() sich danach normal an und übernimmt den Entwurf. */
export const ghostGoogle = () => {
  stashGhost();
  try { sessionStorage.setItem('wishtale:ghostlink', '1'); } catch { /* egal */ }
  return sb.auth.linkIdentity({ provider: 'google', options: { redirectTo: redirectUrl(), queryParams: { prompt: 'select_account' } } });
};
/** Gastkonto per E-Mail sichern: Supabase schickt eine Bestätigung an die Adresse, danach ist es ein normales Konto (Anmelden per Link, Passwort jederzeit über „Passwort vergessen“). */
export const ghostEmail = (name, email) => sb.auth.updateUser({ email, data: { full_name: name } }, { emailRedirectTo: redirectUrl() });
/** Profilname nach dem Sichern: Gastkonten heißen „Ich“, bis ein Name bekannt ist. */
export function nameFromUser(user) {
  const m = user && user.user_metadata || {};
  const idn = ((user && user.identities) || []).map(i => i.identity_data || {}).find(d => d.full_name || d.name || d.given_name) || {};
  const full = String(m.full_name || m.name || idn.given_name || idn.full_name || idn.name || '').trim();
  return full ? (viaOAuth(user) || idn.given_name ? full.split(/\s+/)[0] : full).slice(0, 60) : '';
}

/** Über Google angemeldet (nicht per E-Mail und Passwort)? */
export const viaOAuth = user => { const a = (user && user.app_metadata) || {}; return [a.provider, ...(a.providers || [])].some(p => p && p !== 'email' && p !== 'anonymous'); };

/** Nach dem Login: eigene Daten laden. */
export async function enter(user) {
  S.auth.user = user;
  S.ui.authSent = null; S.ui.authResent = null;
  S.auth.error = '';
  if (viaOAuth(user) && !(user.user_metadata && user.user_metadata.utm)) {
    // Kürzel aus der Adresse vor dem Sprung zu Google beim Konto ablegen, wie es signUp für E-Mail-Konten tut
    let u = null;
    try { u = JSON.parse(sessionStorage.getItem('wishtale:utm') || 'null'); sessionStorage.removeItem('wishtale:utm'); } catch { /* nichts */ }
    if (u) sb.auth.updateUser({ data: { utm: u } }).catch(() => {});
  }
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
    const ws = Array.isArray(meta.wishes) ? meta.wishes.filter(w => w && typeof w.t === 'string' && w.t.trim()).slice(0, 40).map(w => W({ id: /^[0-9a-f-]{36}$/i.test(String(w.id)) ? w.id : undefined, t: w.t.slice(0, 120), link: typeof w.link === 'string' ? w.link.slice(0, 500) : '', price: typeof w.price === 'number' ? w.price : null, note: typeof w.note === 'string' ? w.note.slice(0, 300) : '', c: typeof w.c === 'string' ? w.c : 'sonstiges', kind: ['produkt', 'kategorie', 'erlebnis', 'frei'].includes(w.kind) ? w.kind : 'produkt', prio: [1, 2, 3].includes(w.prio) ? w.prio : 2, status: w.status === 'plan' ? 'plan' : 'offen', vis: w.vis === 'privat' ? 'privat' : 'alle' })) : [];
    d = { quick: !!meta.quick, name: S.auth.user.user_metadata.full_name || '', interests: list(meta.interests), cats: list(meta.cats), brands: list(meta.brands), tries: list(meta.tries), nogos: list(meta.nogos), alts: list(meta.alts), wishes: ws };
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
  // Wünsche, die ohne Konto entstanden sind, kommen dazu. Was schon gleich heißt, wird nicht doppelt angelegt, nichts im Konto wird überschrieben.
  let moved = 0;
  if (a && (d.wishes || []).length) {
    const have = new Set(a.wishes.map(w => String(w.t).trim().toLowerCase()));
    const ids = new Set(a.wishes.map(w => w.id));
    const add = d.wishes.filter(w => (w.status === 'offen' || w.status === 'plan') && w.t && !have.has(String(w.t).trim().toLowerCase()) && !ids.has(w.id))
      .map(w => ({ ...w, img: /^https:\/\//.test(w.img || '') ? w.img : null, res: null, bought: false }));
    if (add.length) { a.wishes = [...add, ...a.wishes]; moved = add.length; }
  }
  const quick = !!d.quick && !took && !moved && !(a && a.wishes.length); // ein Konto mit Wünschen ist kein Neuanfang
  clearDraft();
  if (moved) return { wishes: moved };
  return quick ? 'quick' : took;
}
