import { S } from '../state.js';

// Reine Anzeigepräferenz je Profil und Browser, ohne Serverübertragung.
const KEY = 'wishtale:home-ideas-hidden';
let memory = null;
const profile = () => S.me.dbId || S.me.handle || S.ui.acct || 'me';
function hidden() {
  if (memory) return memory;
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}
export const homeIdeasVisible = () => !hidden().includes(profile());
export function setHomeIdeasVisible(show) {
  memory = hidden().filter(id => id !== profile());
  if (!show) memory.push(profile());
  try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch { /* Sitzung bleibt bedienbar. */ }
}
