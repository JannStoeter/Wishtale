/* KI-Ideen zu einem Profil (api/ideas.js). Ohne Schlüssel oder bei Fehlern bleibt die Liste leer, die übrigen Vorschläge bleiben. */
import { S } from '../state.js';

export function loadIdeas(handle, done) {
  if (!/^[a-z0-9-]{3,31}$/.test(handle || '')) return;
  if (S.ui.ai && S.ui.ai.handle === handle) return;
  S.ui.ai = { handle, list: [] };
  const occ = S.ui.occ || 'ohne';
  fetch(`/api/ideas?h=${encodeURIComponent(handle)}&occ=${encodeURIComponent(occ)}`)
    .then(r => (r.ok ? r.json() : { ideas: [] }))
    .then(j => { if (S.ui.ai && S.ui.ai.handle === handle) { S.ui.ai.list = Array.isArray(j.ideas) ? j.ideas : []; done && done(); } })
    .catch(() => {});
}
