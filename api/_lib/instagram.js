/*
 * Veröffentlicht ein Karussell (oder ein Einzelbild) über die Instagram Content Publishing API.
 * Ablauf: je Bild einen Container anlegen, warten bis er fertig ist, bei mehreren Bildern einen Karussell-Container bauen, veröffentlichen.
 * Voraussetzung: Instagram-Geschäftskonto, Meta-App, Token mit instagram_content_publish. Bilder müssen öffentlich als JPEG erreichbar sein.
 */
import { HttpError } from './auth.js';
import { withSiteLink } from '../../src/lib/iglink.js';

const HOST = () => process.env.META_API_HOST || 'https://graph.facebook.com';
const VERSION = () => process.env.META_GRAPH_VERSION || 'v23.0';

export const igConfig = () => ({ userId: process.env.META_IG_USER_ID || '', token: process.env.META_ACCESS_TOKEN || '' });
export const igConfigured = () => { const c = igConfig(); return !!(c.userId && c.token); };

async function call(path, { method = 'GET', params = {} } = {}, fetchImpl) {
  const c = igConfig();
  const q = new URLSearchParams({ ...params, access_token: c.token });
  const url = `${HOST()}/${VERSION()}/${path}`;
  const r = await fetchImpl(method === 'GET' ? `${url}?${q}` : url, method === 'GET' ? {} : { method, headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: q });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) {
    const e = j.error || {};
    console.error('instagram', r.status, JSON.stringify({ path: path.replace(/\d{6,}/g, '<id>'), code: e.code, subcode: e.error_subcode, type: e.type, msg: e.message, trace: e.fbtrace_id }));
    throw new HttpError(502, igMessage(e, r.status));
  }
  return j;
}

/** Macht aus einem Meta-Fehler eine verständliche Meldung samt Code, damit klar ist, wo es hakt. */
export function igMessage(e = {}, status = 0) {
  const text = e.error_user_msg || e.message || String(status || 'unbekannter Fehler');
  const code = e.code ? ` (Code ${e.code}${e.error_subcode ? '/' + e.error_subcode : ''})` : '';
  let hint = '';
  if (e.code === 190) hint = ' Der Zugangsschlüssel ist abgelaufen oder ungültig. Bitte in Meta einen neuen erzeugen und META_ACCESS_TOKEN in Vercel ersetzen.';
  else if (e.code === 200 && /blocked/i.test(e.message || '')) hint = ' Meta hat den Zugriff gesperrt. Meist ist die Meta-App eingeschränkt oder das Instagram-Konto muss eine Sicherheitsprüfung bestätigen. Bitte in der Instagram-App und unter developers.facebook.com › Meine Apps nachsehen.';
  else if ([10, 200].includes(e.code) || (e.code >= 200 && e.code < 300)) hint = ' Der Schlüssel hat nicht die nötige Berechtigung (instagram_content_publish).';
  else if ([4, 17, 32, 613].includes(e.code) || e.error_subcode === 2207042) hint = ' Instagram bremst gerade, bitte später noch einmal versuchen.';
  return `Instagram: ${text}${code}.${hint}`.replace(/\.\./g, '.');
}

async function waitReady(id, fetchImpl, tries = 12, delay = 2000) {
  for (let i = 0; i < tries; i++) {
    const s = await call(id, { params: { fields: 'status_code' } }, fetchImpl);
    if (s.status_code === 'FINISHED' || s.status_code === undefined) return;
    if (s.status_code === 'ERROR' || s.status_code === 'EXPIRED') throw new HttpError(502, 'Instagram konnte ein Bild nicht verarbeiten.');
    await new Promise(r => setTimeout(r, delay));
  }
  throw new HttpError(504, 'Instagram braucht zu lange. Bitte versuche es später noch einmal.');
}

export async function account(fetchImpl = fetch) {
  const c = igConfig();
  const j = await call(c.userId, { params: { fields: 'username,name' } }, fetchImpl);
  return { username: j.username || j.name || '' };
}

export async function publish({ imageUrls, caption }, fetchImpl = fetch, opts = {}) {
  caption = withSiteLink(caption);
  if (!igConfigured()) throw new HttpError(400, 'Instagram ist noch nicht verbunden.');
  if (!imageUrls?.length) throw new HttpError(400, 'Der Beitrag hat noch keine Bilder.');
  if (imageUrls.length > 10) throw new HttpError(400, 'Ein Karussell darf höchstens 10 Bilder haben.');
  const c = igConfig(), wait = opts.wait || waitReady;
  let container;
  if (imageUrls.length === 1) {
    container = (await call(`${c.userId}/media`, { method: 'POST', params: { image_url: imageUrls[0], caption } }, fetchImpl)).id;
  } else {
    const kids = [];
    for (const url of imageUrls) kids.push((await call(`${c.userId}/media`, { method: 'POST', params: { image_url: url, is_carousel_item: 'true' } }, fetchImpl)).id);
    for (const k of kids) await wait(k, fetchImpl);
    container = (await call(`${c.userId}/media`, { method: 'POST', params: { media_type: 'CAROUSEL', children: kids.join(','), caption } }, fetchImpl)).id;
  }
  await wait(container, fetchImpl);
  return finish(container, fetchImpl);
}

/** Veröffentlicht einen fertig verarbeiteten Container und holt die Adresse des Beitrags. */
export async function finish(container, fetchImpl = fetch) {
  const c = igConfig();
  const pub = await call(`${c.userId}/media_publish`, { method: 'POST', params: { creation_id: container } }, fetchImpl);
  let permalink = '';
  try { permalink = (await call(pub.id, { params: { fields: 'permalink' } }, fetchImpl)).permalink || ''; } catch { /* nicht kritisch */ }
  return { mediaId: pub.id, permalink };
}

/** Stories: jedes Bild wird eine eigene Story (ohne Bildunterschrift). Gibt die Medien-ID der letzten zurück. */
export async function publishStories({ imageUrls }, fetchImpl = fetch, opts = {}) {
  if (!igConfigured()) throw new HttpError(400, 'Instagram ist noch nicht verbunden.');
  if (!imageUrls?.length) throw new HttpError(400, 'Die Story hat noch keine Bilder.');
  if (imageUrls.length > 10) throw new HttpError(400, 'Bitte höchstens 10 Stories auf einmal.');
  const c = igConfig(), wait = opts.wait || waitReady;
  let last = { mediaId: '', permalink: '' };
  for (const url of imageUrls) {
    const id = (await call(`${c.userId}/media`, { method: 'POST', params: { media_type: 'STORIES', image_url: url } }, fetchImpl)).id;
    await wait(id, fetchImpl);
    last = await finish(id, fetchImpl);
  }
  return last;
}

/** Reel: legt den Container an. Instagram verarbeitet das Video einige Sekunden bis Minuten, danach folgt finish(). */
export async function startReel({ videoUrl, caption }, fetchImpl = fetch) {
  if (!igConfigured()) throw new HttpError(400, 'Instagram ist noch nicht verbunden.');
  if (!/^https:\/\//.test(videoUrl || '')) throw new HttpError(400, 'Das Reel hat noch kein Video.');
  const c = igConfig();
  const r = await call(`${c.userId}/media`, { method: 'POST', params: { media_type: 'REELS', video_url: videoUrl, caption: withSiteLink(caption), share_to_feed: 'true' } }, fetchImpl);
  return r.id;
}

/** Fragt ab, ob ein Container fertig ist: 'FINISHED', 'IN_PROGRESS' oder wirft bei Fehlern. */
export async function containerStatus(id, fetchImpl = fetch) {
  const s = await call(id, { params: { fields: 'status_code,status' } }, fetchImpl);
  if (s.status_code === 'ERROR' || s.status_code === 'EXPIRED') throw new HttpError(502, `Instagram konnte das Video nicht verarbeiten${s.status ? ': ' + s.status : '.'}`);
  return s.status_code || 'IN_PROGRESS';
}
