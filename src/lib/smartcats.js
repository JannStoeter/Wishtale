// Kategorien smart zuordnen (Dev 100, Stufe 1).
// Die Wortliste (guessCategory) entscheidet sofort und ohne KI. Was sie nicht kennt, ordnet das leichte Modell über
// /api/ideas?mode=cat nach; es geht nur der Name des Wunsches raus. Einmal je Profil werden ältere Wünsche neu sortiert,
// weil früher alles Unbekannte in „Wohnen“ landete.
import { S } from '../state.js';
import { sb } from './supabase.js';
import { cat, CATS } from '../data/content.js';
import { guessCategory } from './category.js';
import { scheduleSync } from './remote.js';

const IDS = new Set(CATS.map(c => c.id));
const NEW = new Set(['fitness', 'wintersport', 'radsport', 'gaming', 'beauty', 'musik', 'garten', 'heimwerken', 'baby', 'haustier']);
const BROAD = new Set(['sport', 'outdoor', 'technik', 'spielen', 'mode', 'kochen', 'genuss', 'wohnen']);
const KEY = 'wishtale:cats-v2';
const busy = new Set();

function setCat(w, c) {
  if (!IDS.has(c) || w.c === c) return false;
  w.c = c;
  if (w.kind !== 'erlebnis') w.a = cat(c).a;
  w.tone = cat(c).t;
  return true;
}
const needsAi = w => w.kind !== 'erlebnis' && (w.c === 'sonstiges' || !IDS.has(w.c)) && !guessCategory(w.t, '');

async function askAi(list) {
  if (!S.auth.user || !S.me.handle || !list.length) return [];
  const { data } = await sb.auth.getSession();
  if (!data.session) return [];
  const r = await fetch('/api/ideas?' + new URLSearchParams({ h: S.me.handle, mode: 'cat', t: list.map(w => w.t.slice(0, 120)).join('\n') }), {
    headers: { authorization: 'Bearer ' + data.session.access_token }, signal: AbortSignal.timeout(25000),
  }).catch(() => null);
  if (!r || !r.ok) return [];
  const j = await r.json().catch(() => ({}));
  return Array.isArray(j.cats) ? j.cats : [];
}

/** Ordnet unklare Wünsche (Kategorie „Sonstiges“, Wortliste kennt sie nicht) per KI ein. Gibt true zurück, wenn sich etwas geändert hat. */
export async function smartCats(wishes, onChange) {
  const todo = (wishes || []).filter(w => needsAi(w) && !busy.has(w.id)).slice(0, 24);
  if (!todo.length) return false;
  todo.forEach(w => busy.add(w.id));
  try {
    const cats = await askAi(todo);
    let changed = false;
    todo.forEach((w, i) => { if (cats[i] && cats[i] !== 'sonstiges' && setCat(w, cats[i])) changed = true; });
    if (changed) { scheduleSync(); if (onChange) onChange(); }
    return changed;
  } finally { todo.forEach(w => busy.delete(w.id)); }
}

/** Einmal je Profil: ältere Wünsche neu einordnen. Zuerst mit der Wortliste, Unklares danach per KI. */
export function recatOnce(onChange) {
  const m = S.me;
  if (!S.auth.user || !m || !m.dbId || !Array.isArray(m.wishes) || !m.wishes.length) return;
  let done = [];
  try { done = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { /* ohne Speicher einmal je Sitzung */ }
  if (done.includes(m.dbId)) return;
  done.push(m.dbId);
  try { localStorage.setItem(KEY, JSON.stringify(done.slice(-50))); } catch { /* egal */ }
  let changed = false;
  for (const w of m.wishes) {
    if (w.kind === 'erlebnis') continue;
    const g = guessCategory(w.t, '');
    if (!IDS.has(w.c)) { changed = setCat(w, g || 'sonstiges') || changed; continue; }
    if (w.c === 'wohnen' && g !== 'wohnen') { changed = setCat(w, g || 'sonstiges') || changed; continue; } // früher Sammelbecken
    if (BROAD.has(w.c) && NEW.has(g)) changed = setCat(w, g) || changed; // zum Beispiel Hanteln von Sport zu Fitness
  }
  if (changed) { scheduleSync(); if (onChange) onChange(); }
  smartCats(m.wishes, onChange);
}
