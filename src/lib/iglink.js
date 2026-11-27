/*
 * Link zu wishtale.de in jeder Instagram-Bildunterschrift (Jann, 26.11.2026: „Man muss abtippen“).
 * Links sind in Bildunterschriften bei Instagram nicht anklickbar, darum steht die Adresse gut lesbar da und der Hinweis auf die Bio.
 * Wird beim Erstellen im Studio und noch einmal serverseitig beim Veröffentlichen angewendet; doppelt kommt die Zeile nie.
 */
export const SITE_LINE = 'Zu Wishtale: wishtale.de (der Link steht auch in unserer Bio)';

/** Fügt die Zeile vor dem Hashtag-Block ein, falls „wishtale.de“ noch nirgends im Text steht. */
export function withSiteLink(caption) {
  const c = String(caption || '').trim();
  if (/wishtale\.de/i.test(c)) return c;
  if (!c) return SITE_LINE;
  const m = c.match(/\n\n((?:#[^\s#]+\s*)+)$/);
  if (m) return `${c.slice(0, m.index)}\n\n${SITE_LINE}\n\n${m[1].trim()}`;
  return `${c}\n\n${SITE_LINE}`;
}

/** Das Instagram-Konto von Wishtale (Dev 140). Folgen-Links auf Landingpage, Ratgeber, Gastansicht und im Menü. */
export const IG_HANDLE = 'wishtale.de';
export const IG_URL = 'https://www.instagram.com/wishtale.de/';
