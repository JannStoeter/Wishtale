import { requireAdmin, send, fail } from '../auth.js';
import { igConfigured, account } from '../instagram.js';
import { gadsConfigured } from '../gads.js';
import { aiConfigured } from '../draft.js';
import { paymentsConfigured } from '../stripe.js';

/** Zeigt, welche Verbindungen eingerichtet sind. Gibt nie Schlüssel heraus, nur ja oder nein. */
export default async function handler(req, res) {
  try {
    await requireAdmin(req);
    const ig = { configured: igConfigured(), username: '', error: '' };
    if (ig.configured) { try { ig.username = (await account()).username; } catch (e) { ig.error = e.message; } }
    return send(res, 200, {
      instagram: ig,
      googleAds: { configured: gadsConfigured() },
      ai: { configured: aiConfigured() },
      payments: { configured: paymentsConfigured(), secret: !!process.env.STRIPE_SECRET_KEY, webhook: !!process.env.STRIPE_WEBHOOK_SECRET },
      cron: { secret: !!process.env.CRON_SECRET, serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
    });
  } catch (e) { return fail(res, e); }
}
