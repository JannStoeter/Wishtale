/* KI-Ideen (api/ideas.js). Ohne Schlüssel oder bei Fehlern bleibt die Liste leer, die übrigen Vorschläge bleiben. */
import { S } from '../state.js';
import { sb } from './supabase.js';

const HID = 'wishtale:idea-hidden';
const hidden = () => { try { return JSON.parse(localStorage.getItem(HID) || '[]'); } catch { return []; } };
export const isHidden = i => hidden().includes(i.t);
export const hideIdea = t => { try { localStorage.setItem(HID, JSON.stringify([...hidden(), t].slice(-100))); } catch { /* nur für diese Sitzung */ } };

/** key: 'guest:<handle>' | 'self:<handle>' | 'wish:<wishId>' */
export function loadIdeas(key, params, done) {
  S.ui.aiMap = S.ui.aiMap || {};
  if (S.ui.aiMap[key]) return;
  const e = S.ui.aiMap[key] = { list: [], loaded: false };
  const q = new URLSearchParams({ ...(S.ui.pb ? { b: S.ui.pb } : {}), ...params });
  (params.mode === 'self' || (params.mode === 'wish' && params.t && !params.w) ? sb.auth.getSession().then(({ data }) => (data.session ? { authorization: 'Bearer ' + data.session.access_token } : {})) : Promise.resolve({}))
    .then(headers => fetch('/api/ideas?' + q, { headers, signal: AbortSignal.timeout(50000) }))
    .then(r => (r.ok ? r.json() : { ideas: [] }))
    .then(j => { e.list = Array.isArray(j.ideas) ? j.ideas : []; e.loaded = true; done && done(); })
    .catch(() => { e.loaded = true; done && done(); });
}
/** Schlüssel je Ansicht und Preisrahmen, damit ein anderer Rahmen neue Ideen holt. */
export const gkey = h => `guest:${h}:${S.ui.pb || 0}`;
export const skey = h => `self:${h}:${S.ui.pb || 0}`;

/** 'none' | 'loading' | 'ready' | 'empty' */
export const aiStatus = key => { const e = (S.ui.aiMap || {})[key]; return !e ? 'none' : !e.loaded ? 'loading' : e.list.some(i => !isHidden(i)) ? 'ready' : 'empty'; };
export const ideasOf = key => ((S.ui.aiMap || {})[key]?.list || []).filter(i => !isHidden(i));
