import { esc, ic, money } from '../lib/util.js';
import { AMAZON_TAG, searchUrl } from '../lib/shops.js';
import { PRICE_DATE } from '../data/content.js';

const REL = 'noopener noreferrer sponsored nofollow';
const SOURCE = {
  erzeugt: 'Vorschlag von Wishtale',
  vorschlag: 'Vorschlag im Budget',
  katalog: 'Passendes Produkt',
  link: 'Gewünschtes Produkt'
};

export function priceLine(pr){
  // Amazon-Preise lesen wir nicht (Partnerbedingungen), ein Preis an einem Amazon-Wunsch stammt aus dem Eintrag oder von einer anderen Seite. Darum „ca.“ und der Hinweis auf Amazon (Jann, 2026-11-25).
  const amz=/(^|\.)amazon\./.test(pr.host||'');
  if(pr.price&&pr.priceBy==='user')return `<div class="price"><b>${amz?'ca. ':''}${money(pr.price)}</b><span>${amz?'Den aktuellen Preis siehst du bei Amazon.':'Preis laut Eintrag, im Shop kann er sich ändern.'}</span></div>`;
  if(pr.price)return `<div class="price"><b>${money(pr.price)}</b><span>Stand ${PRICE_DATE}, kann abweichen</span></div>`;
  return `<div class="price"><b>Preis bei Amazon</b><span>${pr.range?'Wir schätzen ca. '+money(pr.range)+'. Den genauen Preis siehst du dort.':'Dort siehst du den aktuellen Preis.'}</span></div>`;
}

/** Produktkarte unter einem Wunsch: Titel, Preis und Amazon-Button. opts.more: Wunsch-ID für weitere Vorschläge. */
export function ProductBlock(pr,opts={}){
  if(!pr)return '';
  const amazon=pr.host==='amazon.de'||pr.host.endsWith('.amazon.de');
  const label=amazon?(pr.direct?'Bei Amazon ansehen':'Bei Amazon suchen'):`Zu ${esc(pr.host)}`;
  return `<div class="prod">
   <span class="eyebrow">${SOURCE[pr.source]}</span>
   <strong class="prodt">${esc(pr.t)}</strong>
   ${priceLine(pr)}
   <a class="btn amz sm" href="${pr.url}" target="_blank" rel="${REL}">${label} ${ic('arrow','sm')}</a>
   <div class="prodft"><span class="ad">Anzeige</span>${opts.more?`<button class="linkbtn" data-act="suggest" data-id="${opts.more}">Weitere Vorschläge</button>`:''}</div>
  </div>`;
}

/** Ideen zu freien Wünschen. */
export function IdeasBlock(list){
  if(!list.length)return '';
  return `<div class="prod"><div class="prodhd"><span class="eyebrow">Ideen zu diesem Wunsch</span></div>
   ${list.map(i=>`<a class="idea" href="${searchUrl.amazon(i.q||i.t)}" target="_blank" rel="${REL}"><span>${esc(i.t)}</span><span class="muted">Preisrahmen ca. ${money(i.p)}</span></a>`).join('')}
   <span class="ad">Anzeige · Amazon-Suche</span></div>`;
}

export { AMAZON_TAG };

export function EmptyBlock(title,text){
  return `<div class="prod empty"><div class="prodhd"><span class="eyebrow">${esc(title)}</span></div><p class="muted" style="font-size:14px">${esc(text)}</p></div>`;
}
