import { requireAdmin, send, fail, HttpError } from '../auth.js';
import { draft } from '../draft.js';

/** Schreibassistent (nur Admins). Body: { mode: 'draft' | 'revise', idea, format, goal, current, instruction } */
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Nur POST.' });
  try {
    await requireAdmin(req);
    const b = req.body || {};
    if (b.mode === 'revise' ? !String(b.instruction || '').trim() || !b.current : !String(b.idea || '').trim()) throw new HttpError(400, 'Bitte beschreibe zuerst deine Idee.');
    return send(res, 200, { post: await draft(b) });
  } catch (e) { return fail(res, e); }
}
