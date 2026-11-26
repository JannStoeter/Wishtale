/*
 * Namen älterer Link-Wünsche reparieren (Jann, 2026-11-26): Früher hießen Wünsche, deren Seite Wishtale nicht lesen konnte,
 * „Wunsch von amazon.de“ oder „Wunsch von thalia.de“, und Amazon-Wünsche trugen die Suchwörter aus der Adresse
 * („LEGO 10460 Kleinkinder Ausstellen Geburtstag“). Einmal je Profil sucht Wishtale für solche Wünsche den echten Namen über die
 * Produktnummer im Link (linkTitle -> api/inspect.js titleFor). Nur Namen, die die Person nie geändert hat, werden ersetzt.
 * Danach kommen Bild und Preis wie bei jedem neuen Wunsch.
 */
import { S } from '../state.js';
import { cat } from '../data/content.js';
import { guessCategory } from './category.js';
import { parseAmazonInput } from './shops.js';
import { linkTitle } from './inspect.js';
import { scheduleSync } from './remote.js';
import { kwOf } from './util.js';
import { imgFill } from './imgfill.js';
import { priceFill } from './pricefill.js';

const ONCE = 'wishtale:namefix-v2';
const read = () => { try { return JSON.parse(localStorage.getItem(ONCE) || '[]'); } catch { return []; } };
const write = v => { try { localStorage.setItem(ONCE, JSON.stringify(v)); } catch { /* dann versucht es die nächste Sitzung erneut */ } };

/** Trägt der Wunsch noch einen Ersatznamen aus dem Link? */
export function placeholderName(w) {
  if (!w || !w.link || !w.t || (w.status || 'offen') !== 'offen') return false;
  if (/^Wunsch von \S+$/.test(w.t)) return true;
  if (!/amazon\.|amzn\./i.test(w.link)) return false;
  const r = parseAmazonInput(w.link);
  return !!r.title && r.title === w.t;
}

export function nameFixOnce(onChange) {
  const m = S.me;
  if (!S.auth.user || !m || !m.dbId || !Array.isArray(m.wishes)) return;
  const done = read();
  if (done.includes(m.dbId)) return;
  // Dazu Amazon-Wünsche, deren Name vielleicht zu stark gekürzt wurde (Buchreihe ohne Titel): ersetzt wird nur, wenn der gefundene Name mit dem jetzigen beginnt
  const amz = w => !!w && !!w.link && /amazon\.|amzn\./i.test(w.link) && (w.status || 'offen') === 'offen';
  const todo = m.wishes.filter(w => placeholderName(w) || amz(w)).slice(0, 10);
  done.push(m.dbId); write(done.slice(-50));
  if (!todo.length) return;
  setTimeout(async () => {
    const fixed = [];
    for (const w of todo) {
      const t = w.t, r = await linkTitle(w.link);
      if (!r || !r.title || w.t !== t) continue;
      const longer = r.title.length > t.length && r.title.toLowerCase().startsWith(t.toLowerCase());
      if (!placeholderName(w) && !longer) continue;
      w.t = r.title.slice(0, 120); w.kw = kwOf(w.t);
      if (w.c === 'sonstiges' || !w.c) { const c = guessCategory(w.t, ''); if (c) { w.c = c; if (w.kind !== 'erlebnis') w.a = cat(c).a; w.tone = cat(c).t; } }
      fixed.push(w);
    }
    if (!fixed.length) return;
    scheduleSync(); onChange && onChange();
    imgFill(fixed, onChange, { max: 6 }).finally(() => priceFill(fixed, onChange, { max: 6 }));
  }, 2500);
}
