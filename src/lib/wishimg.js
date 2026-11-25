/*
 * Produktbilder zu Wünschen. Ein Bild wird einmal verkleinert und in unseren eigenen Speicher (wish-images) geladen.
 * So geht beim Anzeigen keine Adresse eines Besuchers an einen fremden Server, und es gibt kein Hotlinking.
 * Quelle: die Produktseite, die die Person selbst verlinkt hat (Vorschaubild der Seite), oder ein eigenes Foto.
 * Von Amazon übernehmen wir keine Bilder.
 */
import { sb } from './supabase.js';
import { S } from '../state.js';
import { esc } from './util.js';

const MAX = 640;
const load = src => new Promise((resolve, reject) => { const i = new Image(); i.onload = () => resolve(i); i.onerror = () => reject(new Error('Dieses Bild lässt sich nicht öffnen.')); i.src = src; });

/**
 * Fast leeres Bild (ein Platzhalter, ein leeres transparentes Bild)? Verglichen wird mit der Farbe der Ecken, nicht mit Weiß, damit ein
 * weißes Produkt auf weißem Grund (etwa ein Hue-Bewegungsmelder) erhalten bleibt: Es reicht, wenn sich ein kleiner Teil vom Grund abhebt.
 */
function isBlank(g, w, h) {
  try {
    const d = g.getImageData(0, 0, w, h).data, at = (x, y) => { const k = (y * w + x) * 4; return [d[k], d[k + 1], d[k + 2]]; };
    const cs = [at(0, 0), at(w - 1, 0), at(0, h - 1), at(w - 1, h - 1)], bg = [0, 1, 2].map(c => cs.reduce((a, p) => a + p[c], 0) / 4);
    const step = Math.max(1, Math.floor((w * h) / 4000)) * 4;
    let n = 0, busy = 0;
    for (let k = 0; k < d.length; k += step) { n++; if (Math.abs(d[k] - bg[0]) + Math.abs(d[k + 1] - bg[1]) + Math.abs(d[k + 2] - bg[2]) > 24) busy++; }
    return busy / n < 0.005;
  } catch { return false; }
}

/** Verkleinert ein Bild (Blob oder Adresse) auf höchstens 640 Pixel als JPEG. Rückgabe: { blob, preview } */
export async function downscale(source) {
  const url = typeof source === 'string' ? source : URL.createObjectURL(source);
  try {
    const img = await load(url), k = Math.min(1, MAX / Math.max(img.width, img.height)), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.82));
    if (!blob) throw new Error('Das Bild konnte nicht verarbeitet werden.');
    return { blob, preview: c.toDataURL('image/jpeg', 0.82), w: img.width, h: img.height, blank: isBlank(g, c.width, c.height) };
  } finally { if (typeof source !== 'string') URL.revokeObjectURL(url); }
}

/** Holt das Vorschaubild einer Produktseite über unseren Server (api/inspect) und verkleinert es. */
export async function fetchProductImage(imageUrl, query) {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) throw new Error('Bitte melde dich an.');
  const r = await fetch('/api/inspect', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + session.access_token }, body: JSON.stringify(query ? { imageQuery: query } : { imageUrl }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Das Bild konnte nicht geladen werden.');
  if (!j.image) throw new Error('Kein Bild gefunden.');
  const d = await downscale(`data:${j.image.type};base64,${j.image.data}`);
  return { ...d, src: j.image.source };
}

/** Bild zu einem gespeicherten Wunsch über die Websuche (eigener Shop-Link zuerst). Rückgabe wie fetchProductImage oder null. */
export async function fetchWishImage(w) {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return null;
  const r = await fetch('/api/inspect', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ imageFor: { t: String(w.t || '').slice(0, 120), q: String(w.q || '').slice(0, 120), brand: String(w.brand || '').slice(0, 40), link: String(w.link || ''), img: String(w.imgHint || '').slice(0, 800) } }), signal: AbortSignal.timeout(25000) });
  if (r.status === 429) throw Object.assign(new Error('limit'), { limit: true });
  const j = r.ok ? await r.json().catch(() => ({})) : {};
  if (!j.image) return null;
  const d = await downscale(`data:${j.image.type};base64,${j.image.data}`);
  if (Math.min(d.w, d.h) < 200 || d.blank) return null; // zu klein oder fast leer, dann lieber das Symbol
  return { ...d, src: j.image.source };
}

/** Lädt das verkleinerte Bild in den eigenen Ordner (<user-id>/…) und gibt die öffentliche Adresse zurück. */
export async function storeImage(blob) {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) throw new Error('Nicht angemeldet.');
  const path = `${session.user.id}/${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await sb.storage.from('wish-images').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
  if (error) throw error;
  return sb.storage.from('wish-images').getPublicUrl(path).data.publicUrl;
}

/** Entfernt ein Bild aus unserem Speicher (nur im eigenen Ordner möglich). Fehler sind egal, das Bild ist dann nur noch Rest. */
export function dropImage(url) {
  const m = /\/storage\/v1\/object\/public\/wish-images\/(.+)$/.exec(String(url || ''));
  if (m) sb.storage.from('wish-images').remove([decodeURIComponent(m[1])]).catch(() => {});
}

/** Nur Bilder aus unserem Speicher oder lokale Vorschauen (Demo) werden angezeigt. */
export const safeImg = u => { const s = String(u || ''); return /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/wish-images\//.test(s) || /^data:image\/jpeg;base64,/.test(s) ? s : null; };

/** Vorschau-Kasten im Wunschformular. cur: { preview, src } oder null */
export const imgBoxHtml = cur => (cur && cur.preview
  ? `<div class="wimg-row"><span class="imgbox art"><img src="${esc(cur.preview)}" alt="Vorschau des Produktbilds"></span><div><b>Produktbild</b>${cur.src ? `<br><span class="muted tiny">von ${esc(cur.src)}</span>` : ''}<br><button type="button" class="btn ghost sm" data-act="wimgdel" style="padding-left:0">Bild entfernen</button></div></div>`
  : '');

/** Endgültiges Bild beim Speichern: lädt ein neues Bild hoch (angemeldet) oder behält die lokale Vorschau (Demo). */
export async function finalImage() {
  const wi = S.ui.wishImg;
  if (!wi) return { img: null, src: '', removed: false };
  if (wi.remove) return { img: null, src: '', removed: true };
  if (S.auth.user && S.me.dbId && wi.blob) {
    try { return { img: await storeImage(wi.blob), src: wi.src || '', removed: false }; } catch { return { img: null, src: '', removed: false, failed: true }; }
  }
  return { img: wi.preview, src: wi.src || '', removed: false };
}

/** Direkter Amazon-Produktlink (mit Partner-Kennung) zu einem Produktnamen über die Websuche, oder null. */
export async function findAmazonLink(query) {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return null;
  const r = await fetch('/api/inspect', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ amazonQuery: String(query).slice(0, 120) }), signal: AbortSignal.timeout(12000) });
  if (!r.ok) return null;
  return (await r.json().catch(() => ({}))).amazon || null;
}

/** Echter Preis zu einem Wunsch (eigener Shop-Link zuerst, sonst Hersteller- oder Shopseite), oder null. Nur Euro, nie geschätzt. */
export async function fetchWishPrice(w) {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return null;
  const r = await fetch('/api/inspect', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ priceFor: { t: String(w.t || '').slice(0, 120), q: String(w.q || '').slice(0, 120), brand: String(w.brand || '').slice(0, 40), link: String(w.link || '') } }), signal: AbortSignal.timeout(25000) });
  if (r.status === 429) throw Object.assign(new Error('limit'), { limit: true });
  const j = r.ok ? await r.json().catch(() => ({})) : {};
  return j.price && j.price.price > 0 ? j.price : null;
}

/** Produktsuche im Wunschdialog (124). Liefert Treffer { t, price, url, host, img: { blob, preview, src } } oder null ohne Suchdienst. */
export async function searchProducts(q) {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) throw new Error('Melde dich an, dann sucht Wishtale für dich in vielen Shops.');
  const r = await fetch('/api/inspect', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ searchQuery: String(q || '').slice(0, 120) }) });
  const j = await r.json().catch(() => ({}));
  if (r.status === 429) throw new Error('Für heute hat Wishtale schon sehr oft gesucht. Trag deinen Wunsch gern direkt ein.');
  if (!r.ok) throw new Error(j.error || 'Die Suche hat gerade nicht geklappt.');
  if (!j.results) return null;
  const out = await Promise.all(j.results.map(async x => {
    try { const d = await downscale(`data:${x.image.type};base64,${x.image.data}`); if (d.blank) return null; return { t: x.t, price: x.price, url: x.url, host: x.host, img: { blob: d.blob, preview: d.preview, src: x.host } }; } catch { return null; }
  }));
  return out.filter(Boolean);
}
