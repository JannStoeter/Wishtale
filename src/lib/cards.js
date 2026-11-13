/*
 * Geschmackskarten (Dev 082): Antworten je Karte, eine Zeile je Profil und Karte. Die neueste Antwort zählt.
 * Mit Konto in der Tabelle taste_cards, ohne Konto in localStorage. „Gefällt mir“ legt nie einen Wunsch an.
 */
import { sb } from './supabase.js';
import { S } from '../state.js';
import { CARDS, CARDS_VERSION } from '../data/cards.js';

const KEY = 'wishtale:cards';
export const ROUND = 10;
const local = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { return {}; } };
const saveLocal = m => { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch { /* nur für diese Sitzung */ } };

const remote = () => !!(S.auth.user && S.me.dbId);
export const answers = () => (S.ui.cards && S.ui.cards.map) || {};
export const answeredCount = () => Object.values(answers()).filter(a => a.rating || a.owned).length;

/** Lädt die bisherigen Antworten (einmal je Sitzung und Konto). Liefert true, wenn gerade neu geladen wurde. */
export async function loadAnswers() {
  const id = remote() ? S.me.dbId : 'lokal';
  if (S.ui.cards && S.ui.cards.id === id && S.ui.cards.loaded) return false;
  S.ui.cards = { id, loaded: false, map: {}, round: null, i: 0, done: 0, owned: false, cat: 'alle' };
  if (remote()) {
    const { data, error } = await sb.from('taste_cards').select('card_id,rating,owned').eq('profile_id', S.me.dbId).limit(300);
    if (!error) for (const r of data || []) S.ui.cards.map[r.card_id] = { rating: r.rating, owned: !!r.owned };
  } else S.ui.cards.map = local();
  S.ui.cards.loaded = true;
  return true;
}

export function saveAnswer(cardId, { rating = null, owned = false }) {
  const c = S.ui.cards; c.map[cardId] = { rating, owned };
  if (!remote()) { saveLocal(c.map); return Promise.resolve(); }
  return sb.from('taste_cards').upsert({ profile_id: S.me.dbId, card_id: cardId, rating, owned, version: CARDS_VERSION, updated_at: new Date().toISOString() }).then(() => {}, e => console.error(e));
}
export function removeAnswer(cardId) {
  const c = S.ui.cards; delete c.map[cardId];
  if (!remote()) { saveLocal(c.map); return Promise.resolve(); }
  return sb.from('taste_cards').delete().eq('profile_id', S.me.dbId).eq('card_id', cardId).then(() => {}, e => console.error(e));
}
export function resetAnswers() {
  const c = S.ui.cards; c.map = {}; c.round = null;
  if (!remote()) { saveLocal({}); return Promise.resolve(); }
  return sb.from('taste_cards').delete().eq('profile_id', S.me.dbId).then(() => {}, e => console.error(e));
}

/** Mischen mit einem Startwert, damit jede Runde anders ist, aber innerhalb einer Runde stabil bleibt. */
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

/**
 * Nächste Runde: höchstens ROUND noch unbeantwortete Karten, quer durch die Kategorien gemischt (reihum je Kategorie, Reihenfolge je Runde anders).
 * Bei einer gewählten Kategorie nur daraus. Leer, wenn alles beantwortet ist.
 */
export function buildRound(cat = 'alle') {
  const map = answers(), pool = CARDS.filter(c => !map[c.id] && (cat === 'alle' || c.c === cat));
  const r = rng(Date.now() % 1000003 + Object.keys(map).length * 7919);
  const by = {}; for (const c of pool) (by[c.c] = by[c.c] || []).push(c);
  const lists = Object.values(by).map(l => l.sort(() => r() - 0.5)).sort(() => r() - 0.5);
  const out = [];
  for (let i = 0; out.length < ROUND && lists.some(l => l.length); i++) { const l = lists[i % lists.length]; if (l.length) out.push(l.shift()); }
  return out.map(c => c.id);
}
export const remaining = (cat = 'alle') => CARDS.filter(c => !answers()[c.id] && (cat === 'alle' || c.c === cat)).length;
