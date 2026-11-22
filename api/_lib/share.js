/*
 * Teilen-Link mit Vorschau (Dev 102): wishtale.de/w/<kürzel> liefert eine kleine Seite mit Titel, Beschreibung und Bild
 * für WhatsApp, Signal, iMessage und Co. und leitet Menschen sofort zur Gastansicht weiter (/app/#p/<kürzel>).
 * Gezeigt wird nur, was Gäste ohnehin sehen: Vorname und Zahl der offenen Wünsche.
 */
import { fetchProfile } from './ideas.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const gen = n => (/[sßxz]$/i.test(String(n)) ? n + '’' : n + 's');
export const validHandle = h => /^[a-z0-9][a-z0-9-]{1,59}$/i.test(String(h || ''));
const ORIGIN = 'https://wishtale.de';

export function shareText(p) {
  const name = String(p?.name || '').trim().slice(0, 40);
  const open = (p?.wishes || []).filter(w => !w.reserved && !w.bought && (w.status || 'offen') === 'offen').length;
  if (!name) return { title: 'Eine Wunschliste bei Wishtale', desc: 'Schau dir die Wünsche an und reserviere still einen davon, die Überraschung bleibt.' };
  return {
    title: `${gen(name)} Wunschliste`,
    desc: open
      ? `${name} hat ${open === 1 ? 'einen Wunsch' : `${open} Wünsche`} gesammelt. Reserviere still einen davon, ${name} erfährt nicht, von wem.`
      : `Schau dir an, worüber ${name} sich freut, und reserviere still etwas davon.`,
  };
}

export function sharePage(handle, t) {
  const target = handle ? `/app/?via=link#p/${encodeURIComponent(handle)}` : '/app/'; // via=link: die Gastansicht zählt den Aufruf als „über geteilten Link“ (105)
  const url = `${ORIGIN}/w/${encodeURIComponent(handle)}`;
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)} · Wishtale</title>
<meta name="description" content="${esc(t.desc)}"><meta name="robots" content="noindex">
<meta property="og:type" content="website"><meta property="og:site_name" content="Wishtale"><meta property="og:locale" content="de_DE">
<meta property="og:title" content="${esc(t.title)}"><meta property="og:description" content="${esc(t.desc)}"><meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${ORIGIN}/og/wunschliste.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Wishtale, die Wunschliste, die dich kennt">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0;url=${esc(target)}">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#FAF7F1;color:#1F1B16;font:16px/1.5 system-ui,sans-serif}a{color:#2E3B2F;font-weight:600}</style>
</head><body><p>Einen Moment, die Wunschliste öffnet sich … <a href="${esc(target)}">Zur Wunschliste</a></p>
<script>location.replace(${JSON.stringify(target)})</script></body></html>`;
}

export async function shareHandler(req, res) {
  const h = String(req.query?.h || '').toLowerCase();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (!validHandle(h)) { res.setHeader('Cache-Control', 'public, s-maxage=60'); return res.status(404).send(sharePage('', shareText(null))); }
  let p = null;
  try { p = await fetchProfile(h); } catch { p = null; }
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
  return res.status(200).send(sharePage(h, shareText(p)));
}
