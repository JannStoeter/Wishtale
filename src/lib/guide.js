/* Freiwillige Klickführung auf echten Bedienelementen. Keine Eingaben oder Speicheraktionen. */
import { S } from '../state.js';
import { esc, ic } from './util.js';

const step = (target, text, action = '', value = '', last = false) => ({ target, text, action, value, last });
export const GUIDES = {
  wish: { icon: 'plus', title: 'Wunschliste erstellen', steps: [
    step('.fab [data-v="wish"], .fw-form button', 'Tippe auf „Wunsch hinzufügen“. Bei einer leeren Liste schreibst du deinen ersten Wunsch und wählst „Weiter“.', 'modal', 'wish'),
    step('#wt', 'Hier schreibst du deinen Wunsch, ein Produkt oder ein Erlebnis, oder du fügst einen Shop-Link ein. Prüfe die Angaben und speichere erst, wenn alles passt.', '', '', true),
  ] },
  upload: { icon: 'gift', title: 'Eine Liste hochladen', steps: [
    step('.newbar, .wq-chip[data-v="zettel"], .fw-alt button', 'Öffne hier den Import für ein Foto oder den Text deiner Wunschliste.', 'modal', 'zettel'),
    step('#zt-f', 'Wähle ein Foto deiner Liste oder füge darunter den Text ein. Nach „Wünsche herauslesen“ prüfst du jeden Wunsch, bevor du ihn übernimmst.', '', '', true),
  ] },
  profile: { icon: 'user', title: 'Profil ergänzen', steps: [
    step('.acctbtn', 'Tippe auf deinen Avatar. Dahinter findest du dein Profil und die weiteren Bereiche.', 'menu'),
    step('[data-act="mgo"][data-v="profil"]', 'Öffne „Profil und Persönlichkeit“. Hier entsteht die persönliche Note deiner Wunschliste.', 'mgo', 'profil'),
    step('#about', 'Erzähl etwas über dich. Darunter kannst du Interessen, Lieblingsmarken und Dinge ergänzen, die du lieber nicht möchtest. Der Hinweis „Als Nächstes“ bringt dich direkt zum nächsten passenden Punkt.', '', '', true),
  ] },
  taste: { icon: 'spark', title: 'Geschmack schärfen', steps: [
    step('.acctbtn', 'Öffne dein Menü über den Avatar.', 'menu'),
    step('[data-act="mgo"][data-v="geschmack"]', 'Wähle „Geschmack schärfen“, um die Karten zu finden.', 'mgo', 'geschmack'),
    step('.tastecats, #card-h', 'Such dir ein Thema und starte eine Kartenrunde. „Gefällt mir“ hilft Wishtale beim Kennenlernen und legt keinen Wunsch an. „Habe ich schon“ bezieht sich auf die konkrete gezeigte Idee.', '', '', true),
  ] },
  share: { icon: 'link', title: 'Wunschliste teilen', steps: [
    step('.homebar [data-act="preview"]', 'Schau zuerst nach, wie deine Freunde deine Wunschliste sehen.', 'preview', '1'),
    step('[data-act="preview"][data-v="0"]', 'Das ist deine Vorschau für Schenkende. Gehe jetzt zurück zu deinen eigenen Wünschen.', 'preview', '0'),
    step('.homebar [data-act="share"]', 'Über „Teilen“ öffnest du das Teilen-Menü deines Geräts oder kopierst deinen Link. Du entscheidest selbst, an wen du ihn schickst.', '', '', true),
  ] },
};
export const currentGuideStep = () => { const g = S.ui.guide; return g && GUIDES[g.id]?.steps[g.index]; };
export function beginGuide(id) {
  if (!GUIDES[id] || (id === 'taste' && S.me.managed) || (id === 'share' && !S.me.wishes.length)) return false;
  S.ui.guide = { id, index: 0 };
  S.ui.modal = null; S.ui.menu = false; S.ui.preview = false;
  return true;
}
export function endGuide() { S.ui.guide = null; }
/** Vor der echten Aktion voranschreiten, damit deren Render schon den nächsten Hinweis zeigt. */
export function guideClick(el) {
  const s = currentGuideStep();
  if (!s || !s.action || el.dataset.act !== s.action || (s.value && el.dataset.v !== s.value)) return;
  if (!el.matches(s.target)) return;
  S.ui.guide.index++;
}
export function guideSubmit(form) {
  if (S.ui.guide?.id === 'wish' && S.ui.guide.index === 0 && form.dataset.form === 'firstwish') S.ui.guide.index++;
}
export function Guide() {
  const g = S.ui.guide, s = currentGuideStep(); if (!s) return '';
  return `<aside class="guide-coach" role="region" aria-label="Geführter Rundgang" tabindex="-1">
   <div class="guide-head"><p class="eyebrow">${esc(GUIDES[g.id].title)} · ${g.index + 1} von ${GUIDES[g.id].steps.length}</p><button type="button" class="iconbtn" data-act="guideend" aria-label="Rundgang beenden">${ic('x','sm')}</button></div>
   <p class="guide-text" role="status">${esc(s.text)}</p>
   <p class="guide-missing" hidden>Der Bereich ist gerade nicht sichtbar. Du kannst den Rundgang beenden und später neu starten.</p>
   <div class="guide-actions"><button type="button" class="btn ${s.last?'pri':'ghost'} sm" data-act="guideend">${s.last?'Hier selbst weitermachen':'Rundgang beenden'}</button>${!s.last?'<button type="button" class="linkbtn" data-act="guidefocus">Markierten Bereich zeigen</button>':''}</div>
  </aside>`;
}
let shown = '', frame, positionFrame;
function targetOf(s) { return [...document.querySelectorAll(s.target)].find(el => el.getClientRects().length); }
export function focusGuideTarget() {
  const s = currentGuideStep(), target = s && targetOf(s); if (!target) return;
  target.scrollIntoView({ block: 'center', behavior: 'instant' });
  (target.matches('input,button,textarea,a,select') ? target : target.querySelector('input,button,a,select'))?.focus({ preventScroll: true });
  positionGuide();
}
export function positionGuide() {
  const s = currentGuideStep(), box = document.querySelector('.guide-coach'); if (!s || !box) return;
  const target = targetOf(s), missing = box.querySelector('.guide-missing');
  missing.hidden = !!target;
  if (!target) return;
  target.classList.add('guide-target');
  const r = target.getBoundingClientRect(), h = box.getBoundingClientRect().height;
  // Hinweis gegenüber dem Ziel platzieren, damit auch auf kleinen Displays das Ziel bedienbar bleibt.
  box.style.top = r.top + r.height / 2 > innerHeight / 2 ? '76px' : `${Math.max(76, innerHeight - h - 16)}px`;
}
export function syncGuide() {
  document.querySelectorAll('.guide-target').forEach(el => el.classList.remove('guide-target'));
  const s = currentGuideStep(), box = document.querySelector('.guide-coach');
  if (!s || !box) { shown = ''; return; }
  // Bei offenem Dialog gehört die Hilfe in dessen zugänglichen Bereich.
  const dialog = document.querySelector('.sheet,.drawer');
  if (dialog) dialog.append(box);
  const key = S.ui.guide.id + ':' + S.ui.guide.index;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    if (key !== shown && targetOf(s)) { shown = key; focusGuideTarget(); }
    positionGuide();
  });
}
if (typeof window !== 'undefined') {
  window.addEventListener('resize', positionGuide);
  window.addEventListener('scroll', () => { cancelAnimationFrame(positionFrame); positionFrame = requestAnimationFrame(positionGuide); }, true);
}
