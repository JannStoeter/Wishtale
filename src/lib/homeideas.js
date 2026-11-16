import { S } from '../state.js';

// Reine Anzeigepräferenz je Profil und Browser, ohne Serverübertragung.
// Ohne eigene Wahl sind die Vorschläge am Handy eingeklappt und am großen Bildschirm offen.
const KEY = 'wishtale:home-ideas-hidden';
const KEY_SHOWN = 'wishtale:home-ideas-shown';
let memory = null;
const profile = () => S.me.dbId || S.me.handle || S.ui.acct || 'me';
function read(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}
function lists() { return memory || (memory = { hidden: read(KEY), shown: read(KEY_SHOWN) }); }
const small = () => { try { return matchMedia('(max-width: 560px)').matches; } catch { return false; } };
export function homeIdeasVisible() {
  const p = profile(), l = lists();
  if (l.hidden.includes(p)) return false;
  if (l.shown.includes(p)) return true;
  return !small();
}
export function setHomeIdeasVisible(show) {
  const p = profile(), l = lists();
  l.hidden = l.hidden.filter(id => id !== p);
  l.shown = l.shown.filter(id => id !== p);
  (show ? l.shown : l.hidden).push(p);
  try { localStorage.setItem(KEY, JSON.stringify(l.hidden)); localStorage.setItem(KEY_SHOWN, JSON.stringify(l.shown)); } catch { /* Sitzung bleibt bedienbar. */ }
}
