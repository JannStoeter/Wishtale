/*
 * Nutzungsstatistik ohne Cookies und ohne gespeicherte Kennungen.
 * Gespeichert wird nur: Ereignis, Seite, Herkunft (Domain), UTM-Kürzel, Gerätegruppe, Land und ein Hash aus IP, Browserkennung und Tag.
 * Der Hash wechselt täglich (Salz mit Datum), daher lassen sich Besuche über Tage nicht verknüpfen. IP und User-Agent selbst werden nie gespeichert.
 */
import crypto from 'node:crypto';

export const EVENTS = new Set(['view', 'cta', 'start', 'choice', 'signup_submit', 'demo', 'guest_view', 'app_open', 'shop_click', 'step']);
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|headless|lighthouse|monitor|curl|wget|python|node-fetch|axios/i;
const token = (v, n = 60, re = /^[a-z0-9_.\-+ ]+$/i) => { const s = String(v ?? '').trim().slice(0, n); return re.test(s) ? s.toLowerCase() : null; };
const cleanPath = v => { const s = String(v ?? '').split(/[?#]/)[0].slice(0, 120); return /^\/[\w\-./]*$/.test(s) ? s : null; };

export const deviceOf = ua => (/ipad|tablet|kindle|silk/i.test(ua) ? 'tablet' : /mobi|iphone|android/i.test(ua) ? 'mobile' : 'desktop');

export function visitorHash(ip, ua, day, salt) {
  return crypto.createHash('sha256').update(`${salt}|${day}|${ip}|${ua}`).digest('hex').slice(0, 16);
}

/** Baut die Zeile für die Datenbank oder gibt null zurück, wenn nichts gezählt werden soll (Bots, Do-Not-Track, ungültig). */
export function buildEvent(body, headers, salt, now = new Date()) {
  const ua = String(headers['user-agent'] || '');
  if (!ua || BOT.test(ua)) return null;
  if (headers.dnt === '1' || headers['sec-gpc'] === '1') return null;
  const b = body && typeof body === 'object' ? body : {};
  if (!EVENTS.has(b.name)) return null;
  const ip = String(headers['x-forwarded-for'] || '').split(',')[0].trim() || String(headers['x-real-ip'] || '');
  const country = String(headers['x-vercel-ip-country'] || '').toUpperCase();
  let ref = null;
  try { const h = new URL(`https://${String(b.ref || '').replace(/^https?:\/\//, '')}`).hostname.replace(/^www\./, ''); if (h && !/(^|\.)wishtale\.de$|\.vercel\.app$/.test(h)) ref = h.slice(0, 80); } catch { /* kein Verweis */ }
  return {
    name: b.name, path: cleanPath(b.path), label: token(b.label, 40, /^[a-z0-9_.\-+: ]+$/i), ref,
    utm_source: token(b.utm_source), utm_medium: token(b.utm_medium), utm_campaign: token(b.utm_campaign),
    device: deviceOf(ua), country: /^[A-Z]{2}$/.test(country) ? country : null,
    visitor: visitorHash(ip, ua, now.toISOString().slice(0, 10), salt),
  };
}
