/* „Erste Schritte“: kleine Checkliste auf der Wunschliste. Erledigtes hakt sich selbst ab, manches merken wir uns im Browser. */
import { S } from '../state.js';
import { completeness } from './tale.js';

const key = () => 'wishtale:steps:' + (S.auth.user ? S.auth.user.id : 'demo');
const read = () => { try { return JSON.parse(localStorage.getItem(key()) || '{}'); } catch { return {}; } };
const write = o => { try { localStorage.setItem(key(), JSON.stringify(o)); } catch { /* nur für diese Sitzung */ } };

export const markStep = k => { const o = read(); if (!o[k]) { o[k] = 1; write(o); } };
export const hideSteps = v => { const o = read(); o.hidden = v ? 1 : 0; write(o); };
export const stepsHidden = () => !!read().hidden;

/** Liste der Schritte mit Stand. act/v/ is data-act der Schaltfläche. */
export function stepList(m) {
  const o = read(), kids = Object.values(S.accounts || {}).some(a => a && a.managed);
  const s = [
    { k: 'wish', t: 'Ersten Wunsch anlegen', d: 'Ein Produkt, ein Erlebnis oder einfach eine Idee.', done: m.wishes.length > 0, btn: 'Wunsch anlegen', act: 'modal', v: 'wish' },
    { k: 'preview', t: 'So sehen es deine Freunde', d: 'Wirf einen Blick auf deine Seite, wie Schenkende sie sehen.', done: !!o.preview, btn: 'Vorschau ansehen', act: 'preview', v: '1' },
    { k: 'profile', t: 'Profil ergänzen', d: 'Interessen und Marken machen die Vorschläge persönlicher.', done: completeness(m).pct >= 45, btn: 'Zum Profil', act: 'go', v: 'profil' },
    { k: 'share', t: 'Link teilen', d: 'Schick deinen Link an die Menschen, die für dich schenken.', done: !!o.share, btn: 'Link teilen', act: 'share', v: '' },
  ];
  if (!m.managed) s.push({ k: 'people', t: 'Ein Kind-Konto anlegen oder jemanden einladen', d: 'Für Kinder pflegst du die Wünsche selbst, Freunde laden wir mit einem Entwurf ein.', done: kids || !!o.people, btn: 'Kind-Konto', act: 'modal', v: 'accounts', btn2: S.auth.user ? 'Einladen' : '', act2: 'inviteopen' });
  return s;
}
export const stepsProgress = m => { const l = stepList(m); return { done: l.filter(x => x.done).length, total: l.length, all: l.every(x => x.done) }; };
