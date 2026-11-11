import { timingSafeEqual } from 'node:crypto';
import { rest, send, fail, HttpError } from './_lib/auth.js';
import { publish, publishStories, startReel, containerStatus, finish, igConfigured } from './_lib/instagram.js';

/**
 * Geplante Beiträge veröffentlichen. Vercel ruft das täglich auf (vercel.json) und schickt CRON_SECRET mit.
 * Braucht SUPABASE_SERVICE_ROLE_KEY, weil hier kein angemeldeter Admin dabei ist.
 * Reels brauchen Zeit: Der erste Lauf legt den Container an, ein späterer Lauf (oder „Fertigstellen“ im CMS) veröffentlicht.
 */
export default async function handler(req, res) {
  try {
    const secret = process.env.CRON_SECRET, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const got = Buffer.from(String(req.headers.authorization || '')), want = Buffer.from(`Bearer ${secret || ''}`);
    if (!secret || got.length !== want.length || !timingSafeEqual(got, want)) throw new HttpError(401, 'Nicht erlaubt.');
    if (key) await rest(key)(`rate_limits?window_start=lt.${new Date(Date.now() - 3 * 864e5).toISOString()}`, { method: 'DELETE' }).catch(() => {}); // Zähler der Begrenzung nach 3 Tagen leeren
    if (key) await rest(key)(`idea_cache?created_at=lt.${new Date(Date.now() - 60 * 864e5).toISOString()}`, { method: 'DELETE' }).catch(() => {}); // KI-Zwischenspeicher nach 60 Tagen leeren
    if (key) await rest(key)(`events?ts=lt.${new Date(Date.now() - 400 * 864e5).toISOString()}`, { method: 'DELETE' }).catch(() => {}); // Statistik nach etwa 13 Monaten löschen
    if (key) await rest(key)(`invites?expires_at=lt.${new Date(Date.now() - 7 * 864e5).toISOString()}`, { method: 'DELETE' }).catch(() => {}); // abgelaufene Einladungen nach einer Woche löschen
    if (key) await rest(key)(`invites?used_at=lt.${new Date(Date.now() - 30 * 864e5).toISOString()}`, { method: 'DELETE' }).catch(() => {}); // eingelöste nach 30 Tagen
    if (!key || !igConfigured()) return send(res, 200, { ok: true, skipped: 'nicht verbunden' });
    const db = rest(key);
    const due = await db(`social_posts?status=eq.ready&scheduled_for=lte.${new Date().toISOString()}&select=*&order=scheduled_for.asc&limit=3`);
    const out = [];
    for (const p of due) {
      try {
        let r;
        if (p.format === 'reel') {
          let creation = p.ig_creation_id;
          if (!creation) { creation = await startReel({ videoUrl: p.video_url, caption: p.caption }); await db(`social_posts?id=eq.${p.id}`, { method: 'PATCH', body: { ig_creation_id: creation } }); }
          // Bis zu ca. 40 Sekunden warten, dann im nächsten Lauf weitermachen
          let st = 'IN_PROGRESS';
          for (let i = 0; i < 8 && st !== 'FINISHED'; i++) { st = await containerStatus(creation); if (st !== 'FINISHED') await new Promise(x => setTimeout(x, 5000)); }
          if (st !== 'FINISHED') { out.push({ id: p.id, processing: true }); continue; }
          r = await finish(creation);
        } else if (!Array.isArray(p.image_urls) || !p.image_urls.length) { out.push({ id: p.id, skipped: 'keine Bilder' }); continue; }
        else r = p.format === 'story' ? await publishStories({ imageUrls: p.image_urls }) : await publish({ imageUrls: p.image_urls, caption: p.caption });
        await db(`social_posts?id=eq.${p.id}`, { method: 'PATCH', body: { status: 'posted', posted_at: new Date().toISOString(), ig_media_id: r.mediaId, ig_permalink: r.permalink, publish_error: null, ig_creation_id: null } });
        out.push({ id: p.id, ok: true });
      } catch (e) {
        await db(`social_posts?id=eq.${p.id}`, { method: 'PATCH', body: { publish_error: String(e.message).slice(0, 400) } }).catch(() => {});
        out.push({ id: p.id, error: e.message });
      }
    }
    return send(res, 200, { ok: true, results: out });
  } catch (e) { return fail(res, e); }
}
