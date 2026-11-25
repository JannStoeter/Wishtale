// Hinweise im richtigen Moment (Dev 104): Wishtale zeigt eine Funktion nur, wenn sie gerade zum eigenen Tun passt,
// höchstens einen Hinweis zur Zeit, jeder lässt sich dauerhaft wegklicken. Keine Werbung, kein Wiederholen.
// Neue Hinweise als Eintrag in RULES: id, when() und der Text in src/views/tips.js.
import { S, guestPerson } from '../state.js';
import { managersOf } from './coparent.js';

const KEY = 'wishtale:tips-done';
function done() { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } }
export const isDone = id => done().includes(id);
export function markDone(id) { try { const d = done(); if (!d.includes(id)) d.push(id); localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* egal */ } }

/** Klingt der Wunsch nach etwas für ein Kind? Bewusst eng: Brettspiele, Puzzle oder LEGO wünschen sich auch Erwachsene. */
const KIDISH = /\btonies?\b|toniebox|hörfigur|tiptoi|duplo|playmobil|paw patrol|schleich|siku|\bbrio\b|\bhaba\b|bobby-?car|laufrad|kuscheltier|plüschtier|puppenhaus|\bpuppe\b|kinder(buch|küche|fahrrad|wagen|zimmer|garten|lieder|spiel)|\bbaby|kleinkind|spielzeug|bilderbuch|malbuch|holzeisenbahn|sandkasten|rutschauto|kinderroller/i;
export const kidLike = w => w && w.status !== 'selbst' && (w.c === 'baby' || KIDISH.test(String(w.t || '')));
const hasKids = () => Object.values(S.accounts || {}).some(a => a && a.managed);
const ownAdult = () => !S.me?.managed && !S.ui.preview && (S.ui.acct === 'me' || !S.ui.acct);

/* Schon einmal geteilt? Merkt sich nur dieser Browser (für den Hinweis „Teilen“). */
const SHARED = 'wishtale:shared-once';
export const markShared = () => { try { localStorage.setItem(SHARED, '1'); } catch { /* egal */ } };
const sharedOnce = () => { try { return localStorage.getItem(SHARED) === '1'; } catch { return true; } };

/* Zweites Elternteil: nur fürs Hauptkonto eines Kind-Kontos, und nur wenn noch niemand mitverwaltet (wird einmal nachgeladen). */
function soloParent() {
  const m = S.me, a = (S.accounts || {})[S.ui.acct];
  if (!S.auth.user || !m?.managed || !m.dbId || (a && a.shared) || S.ui.preview) return false;
  S.ui.mgm = S.ui.mgm || {};
  const z = S.ui.mgm[m.dbId];
  if (!z) { const id = m.dbId; S.ui.mgm[id] = { loading: true }; managersOf(id).then(d => { S.ui.mgm[id] = { data: d }; window.dispatchEvent(new Event('wishtale:tips')); }).catch(() => { S.ui.mgm[id] = { data: null }; }); return false; }
  return !!(z.data && z.data.is_owner && !z.data.member);
}
/* Lesezeichen-Knopf (Dev 116): nur am Computer mit Maus, nie auf Handy oder Tablet. */
const bigScreen = () => { try { return matchMedia('(min-width: 900px) and (pointer: fine)').matches && !/iphone|ipad|android/i.test(navigator.userAgent || ''); } catch { return false; } };
const openCount = () => (S.me?.wishes || []).filter(w => w.status === 'offen' || w.status === 'plan').length;

const RULES = [
  { id: 'kids', where: 'own', when: () => ownAdult() && !hasKids() && (S.me.wishes || []).some(kidLike) },
  { id: 'coparent', where: 'own', when: soloParent },
  { id: 'share', where: 'own', when: () => S.auth.user && !S.ui.preview && !!S.me?.handle && openCount() >= 3 && !sharedOnce() },
  { id: 'bookmark', where: 'own', when: () => !S.ui.preview && bigScreen() && (S.me?.wishes || []).length >= 2 },
  { id: 'guestown', where: 'guest', when: () => !S.auth.user && (guestPerson()?.wishes || []).some(w => w.res === 'me') },
];
/** Der passende Hinweis für diesen Moment oder null. */
export function currentTip(where = 'own') { return RULES.find(r => r.where === where && !isDone(r.id) && r.when())?.id || null; }
