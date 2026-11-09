/*
 * Kompakte Wunschkarte (öffnet das Detail-Fenster). Fester Aufbau, jede Zeile überall gleich hoch:
 *   Bild (Kategorie, Priorität, Status) / Titel (2 Zeilen) / Vorschlag (1 Zeile) / Labels
 */
import { esc, ic } from '../lib/util.js';
import { art } from '../lib/art.js';
import { productFor } from '../lib/products.js';
import { cat, PRIO } from '../data/content.js';

/** Bild zum Wunsch: eigenes Foto, sonst passend zum vorgeschlagenen Produkt, sonst zur Kategorie. */
export function WishArt(w,pr){
  if(w.img)return `<span class="imgbox art"><img src="${w.img}" alt="" loading="lazy" decoding="async"></span>`;
  return art((pr&&pr.a)||w.a||cat(w.c).a,pr&&pr.tone!=null?pr.tone:(w.tone??0));
}

/** o.ctx: 'guest' | 'own' | 'preview'; o.status: {text,tone}; o.taken; o.dim; o.meta: HTML der Label-Zeile */
export function WishCard(w,p,o={}){
  const pr=(w.kind==='frei'||w.status==='selbst')?null:productFor(p,w);
  const line=w.status==='selbst'?'Schon vorhanden':pr?(pr.source==='link'?pr.t:'Vorschlag: '+pr.t):w.kind==='erlebnis'?'Erlebnis':w.kind==='frei'?'Ideen ansehen':'';
  return `<div class="wcard compact ${o.taken?'taken':''} ${o.dim?'dim':''} ${w.status==='selbst'?'done':''}" role="button" tabindex="0" data-act="wopen" data-id="${w.id}" data-ctx="${o.ctx||'guest'}">
   <div class="wmedia">${WishArt(w,pr)}
    <div class="top"><span class="tag">${esc(cat(w.c).n)}</span><span class="dots" title="${PRIO[w.prio]}" aria-label="Priorität: ${PRIO[w.prio]}">${[1,2,3].map(n=>`<i class="${n<=w.prio?'on':''}"></i>`).join('')}</span></div>
    ${o.status?`<span class="wstate ${o.status.tone}">${ic('lock','sm')}${esc(o.status.text)}</span>`:''}
   </div>
   <div class="wbody">
    <h3 class="wt">${esc(w.t)}</h3>
    <p class="wp">${esc(line)}</p>
    <div class="wm">${o.meta||''}<span class="wgo">Ansehen ›</span></div>
   </div>
  </div>`;
}
