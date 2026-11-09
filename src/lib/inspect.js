/* Angaben aus einem Produktlink lesen (Name, Preis, Größe). Die eigentliche Arbeit macht api/inspect.js auf dem Server. */
import { sb } from './supabase.js';
import { normUrl } from './shops.js';

export async function inspectLink(raw) {
  const url = normUrl(raw);
  if (!url) throw new Error('Bitte füge einen vollständigen Link ein.');
  const { data: { session } } = await sb.auth.getSession();
  if (!session) throw new Error('Melde dich an, dann liest Wishtale Name und Preis aus dem Link.');
  let r;
  try { r = await fetch('/api/inspect', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ url }) }); }
  catch { throw new Error('Keine Verbindung. Bitte versuche es gleich noch einmal.'); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Das hat nicht geklappt.');
  return j.product;
}

/** Produktbild über den Server holen (Bytes als Base64). Siehe wishimg.js. */

/** „49,90“ für das Preisfeld, nur bei Euro */
export const priceField = p => (p.price && (!p.currency || p.currency === 'EUR') ? p.price.toFixed(2).replace('.', ',') : '');

/** Kurze Zusammenfassung, was gefunden wurde. */
export function summary(p) {
  const bits = [p.title.length > 70 ? p.title.slice(0, 68) + '…' : p.title];
  if (p.price) bits.push(p.currency && p.currency !== 'EUR' ? `${p.price} ${p.currency}` : `${priceField(p)} €`);
  if (p.size) bits.push(p.size);
  return bits.join(' · ');
}
