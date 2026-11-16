export const WEEK = 7 * 24 * 60 * 60 * 1000;
export function promptEligible({ managed, wishes, answered, preference = {}, now = Date.now() }) {
  return !managed && wishes >= 3 && answered < 10 && (preference.dismissals || 0) < 3
    && (!preference.last_shown_at || now - Date.parse(preference.last_shown_at) >= WEEK);
}
