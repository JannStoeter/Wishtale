/* KI-Ideen (api/ideas.js). Ohne Schlüssel oder bei Fehlern bleibt die Liste leer, die übrigen Vorschläge bleiben. */
import { S } from '../state.js';

const HID = 'wishtale:idea-hidden';
const hidden = () => { try { return JSON.parse(localStorage.getItem(HID) || '[]'); } catch { return []; } };
export const isHidden = i => hidden().includes(i.t);
export const hideIdea = t => { try { localStorage.setItem(HID, JSON.stringify([...hidden(), t].slice(-100))); } catch { /* nur für diese Sitzung */ } };

/** key: 'guest:<handle>' | 'self:<handle>' | 'wish:<wishId>' */
export function loadIdeas(key, params, done) {
  S.ui.aiMap = S.ui.aiMap || {};
  if (S.ui.aiMap[key]) return;
  const e = S.ui.aiMap[key] = { list: [], loaded: false };
  const q = new URLSearchParams({ occ: S.ui.occ || 'ohne', ...params });
  fetch('/api/ideas?' + q)
    .then(r => (r.ok ? r.json() : { ideas: [] }))
    .then(j => { e.list = Array.isArray(j.ideas) ? j.ideas : []; e.loaded = true; done && done(); })
    .catch(() => {});
}
export const ideasOf = key => ((S.ui.aiMap || {})[key]?.list || []).filter(i => !isHidden(i));
