/* Funktionen und Pläne für Beschriftungen in der App und im CMS. Muss zu FEATURES in api/_lib/entitlements.js passen (dort wird durchgesetzt). */
export const FEATURES = {
  'ideas.guest': { plan: 'plus', label: 'KI-Ideen in der Gast-Ansicht deines Wishtale' },
  'ideas.self': { plan: 'plus', label: 'KI-Ideen für dich in der Inspiration' },
  'ideas.wish': { plan: 'plus', label: 'Produktvorschläge zu deinen Wünschen' },
  zettel: { plan: 'plus', label: 'Wunschzettel einlesen' },
  inspect: { plan: 'free', label: 'Produktlinks lesen' },
};
export const PLANS = { free: 'Kostenlos', plus: 'Plus' };
export const FREE_CORE = ['Dein Profil und deine Wunschliste mit Link zum Teilen', 'Reservieren ohne Konto, die Überraschung bleibt', 'Kind-Konten ohne Begrenzung', '„Was ich verschenkt habe“ und „Habe ich schon“', 'Vorschläge aus dem Wishtale-Katalog'];
