import { requireAdmin, send, fail } from '../auth.js';
import { loadTopics } from '../tribunal.js';

/** Liefert die Fragen und Positionen der Entwickler-Seite (nur Admins). */
export default async function handler(req, res) {
  try {
    await requireAdmin(req);
    return send(res, 200, { topics: loadTopics() });
  } catch (e) { return fail(res, e); }
}
