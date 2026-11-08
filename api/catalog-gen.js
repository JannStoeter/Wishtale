import { requireAdmin, send, fail } from './_lib/auth.js';
import { generate } from './_lib/catalog.js';
import { aiConfigured } from './_lib/llm.js';

/** Katalog-Entwürfe schreiben lassen (nur Admins). Body: { world, topic, n, existing: [Titel] }. Speichert nichts, die Entwürfe prüft das CMS. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Nur POST.' });
  try {
    await requireAdmin(req);
    if (!aiConfigured()) return send(res, 400, { error: 'Die KI ist noch nicht verbunden.' });
    const out = await generate(req.body || {});
    return send(res, 200, { items: out.items, usage: out.usage, model: out.model });
  } catch (e) { return fail(res, e); }
}
