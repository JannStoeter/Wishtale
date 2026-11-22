// Hinweise im richtigen Moment (Dev 104): Wishtale zeigt eine Funktion nur, wenn sie gerade zum eigenen Tun passt,
// höchstens einen Hinweis zur Zeit, jeder lässt sich dauerhaft wegklicken. Keine Werbung, kein Wiederholen.
// Neue Hinweise als Eintrag in RULES: id, when() und der Text in src/views/tips.js.
import { S } from '../state.js';

const KEY = 'wishtale:tips-done';
function done() { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } }
export const isDone = id => done().includes(id);
export function markDone(id) { try { const d = done(); if (!d.includes(id)) d.push(id); localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* egal */ } }

/** Klingt der Wunsch nach etwas für ein Kind? Bewusst eng: Brettspiele, Puzzle oder LEGO wünschen sich auch Erwachsene. */
const KIDISH = /\btonies?\b|toniebox|hörfigur|tiptoi|duplo|playmobil|paw patrol|schleich|siku|\bbrio\b|\bhaba\b|bobby-?car|laufrad|kuscheltier|plüschtier|puppenhaus|\bpuppe\b|kinder(buch|küche|fahrrad|wagen|zimmer|garten|lieder|spiel)|\bbaby|kleinkind|spielzeug|bilderbuch|malbuch|holzeisenbahn|sandkasten|rutschauto|kinderroller/i;
export const kidLike = w => w && w.status !== 'selbst' && (w.c === 'baby' || KIDISH.test(String(w.t || '')));
const hasKids = () => Object.values(S.accounts || {}).some(a => a && a.managed);
const ownAdult = () => !S.me?.managed && !S.ui.preview && (S.ui.acct === 'me' || !S.ui.acct);

const RULES = [
  { id: 'kids', when: () => ownAdult() && !hasKids() && (S.me.wishes || []).some(kidLike) },
];
/** Der passende Hinweis für diesen Moment oder null. */
export function currentTip() { return RULES.find(r => !isDone(r.id) && r.when())?.id || null; }
