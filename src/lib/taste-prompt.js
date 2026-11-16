import { S } from '../state.js';
import { sb } from './supabase.js';
import { answeredCount } from './cards.js';
import { promptEligible } from './taste-prompt-rules.js';

const states = new Map();
export const tastePrompt = () => states.get(S.me.dbId);

/** Einmal je Profil und Sitzung laden. Fehlende Migration oder Lesefehler zeigen keinen Hinweis. */
export async function loadTastePrompt() {
  const p = S.me, id = p.dbId;
  if (!S.auth.user || !id || p.managed || p.wishes.filter(w => w.status === 'offen').length < 3 || states.has(id)
    || S.ui.cards?.id !== id || !S.ui.cards.loaded || S.ui.cards.error) return false;
  const state = { visible: false, busy: true };
  states.set(id, state);
  try {
    if (S.me.dbId !== id || !S.ui.cards?.loaded || S.ui.cards.error) return false;
    const { data, error } = await sb.from('taste_prompt_preferences').select('last_shown_at,dismissals').eq('profile_id', id).maybeSingle();
    if (error) return false;
    state.preference = data || {};
    if (!promptEligible({ managed: p.managed, wishes: p.wishes.filter(w => w.status === 'offen').length, answered: answeredCount(), preference: state.preference })) return false;
    const saved = await sb.rpc('claim_taste_prompt', { p_profile_id: id });
    if (saved.error || !saved.data?.length) return false;
    state.preference = saved.data[0];
    state.visible = true;
    return true;
  } finally { state.busy = false; }
}

export async function dismissTastePrompt() {
  const id = S.me.dbId, state = states.get(id);
  if (!state?.visible) return false;
  const next = { ...state.preference, profile_id: id, dismissals: Math.min(3, (state.preference.dismissals || 0) + 1) };
  state.visible = false;
  const { data, error } = await sb.rpc('dismiss_taste_prompt', { p_profile_id: id });
  if (error || !data) return false;
  state.preference = next;
  return true;
}
