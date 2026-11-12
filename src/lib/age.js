/* Alter und Kinder-Logik. Das Geburtsdatum bleibt bei den Eltern, Gäste sehen nur das Alter (öffentliche Sicht berechnet es in der Datenbank). */
export const ageOf = (iso, now = new Date()) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!m) return null;
  let a = now.getFullYear() - +m[1];
  if (now.getMonth() + 1 < +m[2] || (now.getMonth() + 1 === +m[2] && now.getDate() < +m[3])) a--;
  return a >= 0 && a < 120 ? a : null;
};
/** Kind-Konto oder unter 18: Inhalte müssen altersgerecht sein. */
export const isKid = p => !!(p && (p.managed || (p.age != null && p.age < 18)));
/** „5 Jahre“, „9 Monate“ (unter 2 Jahren wäre genauer, wir kennen aber nur das Alter in Jahren) */
export const ageText = a => (a == null ? '' : a === 1 ? '1 Jahr' : a + ' Jahre');
