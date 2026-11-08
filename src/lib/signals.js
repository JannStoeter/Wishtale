/* Rückmeldungen zu KI-Ideen („gefällt“, „passt nicht“, „habe ich schon“): Der Server nutzt sie für bessere Ideen (api/_lib/ideas.js). */
import { sb } from './supabase.js';
import { S } from '../state.js';

const CNT = 'wishtale:sigs';
export const signalCount = () => { try { return +localStorage.getItem(CNT) || 0; } catch { return 0; } };

export function saveSignal(kind, term) {
  try { localStorage.setItem(CNT, String(signalCount() + 1)); } catch { /* nur für diese Sitzung */ }
  if (!S.auth.user || !S.me.dbId) return Promise.resolve();
  return sb.from('taste_signals').insert({ profile_id: S.me.dbId, kind, term: String(term).slice(0, 120) }).then(() => {}, e => console.error(e));
}
