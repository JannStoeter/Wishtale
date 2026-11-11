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

/** Verkleinert ein Bild (Blob oder Adresse) auf höchstens 640 Pixel als JPEG. Rückgabe: { blob, preview } */
export async function downscale(source) {
  const url = typeof source === 'string' ? source : URL.createObjectURL(source);
  try {
    const img = await load(url), k = Math.min(1, MAX / Math.max(img.width, img.height)), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.82));
    if (!blob) throw new Error('Das Bild konnte nicht verarbeitet werden.');
    return { blob, preview: c.toDataURL('image/jpeg', 0.82) };
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
