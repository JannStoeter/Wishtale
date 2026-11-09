import { requireAdmin, rest, send, fail, HttpError } from '../auth.js';
import { gadsConfigured, campaigns, setStatus, setBudget, createFromPlan } from '../gads.js';

/** Google Ads steuern (nur Admins). Body: { action: 'campaigns' | 'status' | 'budget' | 'create', … } */
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Nur POST.' });
  try {
    const { token } = await requireAdmin(req);
    if (!gadsConfigured()) throw new HttpError(400, 'Google Ads ist noch nicht verbunden.');
    const b = req.body || {};
    if (b.action === 'campaigns') return send(res, 200, { campaigns: await campaigns() });
    if (b.action === 'status') { await setStatus(b.campaignId, b.status); return send(res, 200, { ok: true }); }
    if (b.action === 'budget') { await setBudget(b.budgetId, b.euro); return send(res, 200, { ok: true }); }
    if (b.action === 'create') {
      if (!/^[0-9a-f-]{36}$/i.test(String(b.planId))) throw new HttpError(400, 'Ungültiger Plan.');
      const [plan] = await rest(token)(`ad_plans?id=eq.${b.planId}&select=*`);
      if (!plan) throw new HttpError(404, 'Plan nicht gefunden.');
      const out = await createFromPlan(plan);
      return send(res, 200, { ok: true, ...out });
    }
    throw new HttpError(400, 'Unbekannte Aktion.');
  } catch (e) { return fail(res, e); }
}
