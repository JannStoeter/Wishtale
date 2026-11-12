import { S } from '../state.js';
import { WORLDS } from '../lib/flags.js';
import { esc, ic } from '../lib/util.js';
import { thinProfile } from '../lib/tale.js';
import { art, artIllu } from '../lib/art.js';
import { worldOffers, popularOffers, promoOffers } from '../lib/products.js';
import { CATS, cat } from '../data/content.js';
import { priceLine } from './product.js';
import { safeUrl } from '../lib/promo.js';
import { money } from '../lib/util.js';
import { searchUrl } from '../lib/shops.js';
import { ideasOf, aiStatus, skey } from '../lib/ideas.js';
import { AiLoading } from './ailoading.js';
import { PriceFilter } from './giver.js';

const REL='noopener noreferrer sponsored nofollow';

export function Card(o,cid,have){
  const amazon=o.host==='amazon.de';
  const label=o.cta||(amazon?(o.direct?'Bei Amazon ansehen':'Bei Amazon suchen'):`Zu ${esc(o.host)}`);
  return `<article class="offer">
   ${o.brand?`<span class="otn brand" aria-hidden="true"><b>${esc(o.brand.slice(0,1))}</b><small>${esc(o.brand)}</small></span>`:`<span class="otn">${artIllu(o.a||'gift',o.tone||0)}</span>`}
   <div class="obody">
    ${o.exp?'<span class="eyebrow">Erlebnis</span>':''}
    <strong class="ot">${esc(o.t)}</strong>
    ${o.exp?'':priceLine(o)}
    ${(o.why||[]).slice(0,2).map(t=>`<span class="why">${esc(t)}</span>`).join('')}
   </div>
   <div class="oa">
    <a class="btn amz sm" href="${o.url}" target="_blank" rel="${REL}">${label} ${ic('arrow','sm')}</a>
    ${have?`<span class="chip ok">${ic('check','sm')}Auf deiner Liste</span>`:`<button class="btn sec sm" data-act="oadd" data-cid="${cid}" data-id="${esc(o.id)}">${ic('plus','sm')}Als Wunsch</button>`}
    ${o.exp?'':`<button class="btn ghost sm" data-act="ihave" data-id="${esc(o.id)}">Habe ich schon</button>`}
   </div>
  </article>`;
}

export function CmsProduct(x){
  return `<article class="offer">
   <span class="otn">${artIllu('gift',0)}</span>
   <div class="obody"><strong class="ot">${esc(x.title)}</strong>${x.price?`<div class="price"><b>${money(x.price)}</b><span>Preis kann abweichen</span></div>`:''}${x.note?`<span class="why">${esc(x.note)}</span>`:''}<span class="ad">Anzeige</span></div>
   <div class="oa"><a class="btn amz sm" href="${esc(safeUrl(x.url))}" target="_blank" rel="${REL}">Ansehen ${ic('arrow','sm')}</a></div></article>`;
}
const HIDE='wishtale:promo-hidden';
const hiddenIds=()=>{try{return JSON.parse(localStorage.getItem(HIDE)||'[]')}catch{return[]}};
export const hidePromo=id=>{try{localStorage.setItem(HIDE,JSON.stringify([...hiddenIds(),id].slice(-20)))}catch{/* nur für diese Sitzung */}};
const ACT={share:['share',''],wishes:['go','wuensche'],inspiration:['go','entdecken']};

/** Aktion aus dem CMS, für Menschen mit eigenem Wishtale: kurze Botschaft, ein Knopf und ein paar passende Ideen. */
export function AppPromo(){
  const P=S.promo;if(!P)return '';
  const gone=hiddenIds();
  const c=P.campaigns.find(x=>(x.placement||[]).includes('app')&&!gone.includes(x.id));
  if(!c)return '';
  const head=c.app_headline||c.headline||c.title,body=c.app_headline?c.app_body:c.body;
  const act=ACT[c.app_cta_action];
  const byId=new Map(P.products.map(p=>[p.id,p]));
  const own=(c.product_ids||[]).map(i=>byId.get(i)).filter(Boolean).slice(0,2);
  const auto=own.length||!WORLDS?[]:promoOffers(S.me,2);
  const mine=new Set(S.me.wishes.map(w=>w.t.toLowerCase()));
  return `<section class="promocard" aria-label="Aktion"><div class="pc-top"><p class="eyebrow">Aktion</p><button class="linkbtn" data-act="promohide" data-id="${esc(c.id)}" aria-label="Aktion ausblenden">Ausblenden</button></div>
   <h2 class="pc-h">${esc(head)}</h2>${body?`<p class="muted pc-b">${esc(body)}</p>`:''}
   ${act&&c.app_cta_label?`<p><button class="btn pri" data-act="${act[0]}" ${act[1]?`data-v="${act[1]}"`:''}>${esc(c.app_cta_label)}</button></p>`:''}
   ${own.length||auto.length?`<p class="eyebrow" style="margin-top:14px">Das könnte dir gefallen</p><div class="offers">${own.map(CmsProduct).join('')}${auto.map(o=>Card(o,o._cid,mine.has(o.t.toLowerCase()))).join('')}</div><p class="disc" style="margin-top:6px"><b>Anzeige:</b> Links zu Amazon sind Partnerlinks. Preise sind Richtwerte und können abweichen.</p>`:''}
  </section>`;
}
function Promo(){
  const P=S.promo;if(!P)return '';
  const now=P.campaigns.filter(c=>(c.placement||[]).includes('app'));
  const inCamp=new Set(now.flatMap(c=>c.product_ids||[]));
  const feat=P.products.filter(p=>p.featured&&!inCamp.has(p.id));
  const fs=feat.length?`<section class="psec" style="margin-bottom:18px"><p class="eyebrow">Empfehlung von Wishtale</p><h3 aria-level="2">Ausgesucht für dich</h3><div class="offers" style="margin-top:10px">${feat.map(CmsProduct).join('')}</div></section>`:'';
  return AppPromo()+fs;
}

const AI_REL='noopener noreferrer sponsored nofollow';
/* Ideen von der KI für die eigene Wunschliste (api/ideas.js, mode=self), nur mit gespeichertem Konto. */
function AiSelf(){
  const h=S.me.handle;if(!h||!S.auth.user)return '';
  const list=ideasOf(skey(h));if(!list.length)return '';
  return `<section class="psec" style="margin-bottom:18px"><p class="eyebrow">Vorschläge von Wishtale</p><h3 aria-level="2">Ideen, die zu dir passen</h3>
   <p class="muted" style="font-size:14.5px;margin:6px 0 12px">Wishtale schreibt sie nach dem, was du über dich angegeben hast. Was dir gefällt, setzt du mit einem Tipp auf deine Wunschliste.</p>
   ${thinProfile(S.me)?`<p class="thinnote">${ic('spark','sm')}<span>Dein Profil ist noch recht leer, darum sind diese Ideen noch allgemein. Wenn du ein paar Interessen und Lieblingsmarken ergänzt, werden sie spürbar persönlicher. <a href="#profil" class="linkbtn">Profil ergänzen</a></span></p>`:''}
   <div class="recs grid">${list.map(i=>`<article class="rec" style="display:block"><div><h3>${esc(i.t)}</h3><p class="why">${esc(i.why)}</p>
    <div class="row" style="gap:6px"><span class="chip ${i.exp?'gold':''}">${i.exp?'Erlebnis':'Geschenk'}</span>${i.to?`<span class="chip" title="Grobe Schätzung, kein Live-Preis">${i.from?`ca. ${i.from} bis ${i.to} €`:`bis ca. ${i.to} €`}</span>`:''}</div>
    <div class="row" style="margin-top:8px"><button class="btn pri sm" data-act="aiadd" data-t="${esc(i.t)}">Auf meine Wunschliste</button><a class="btn amz sm" href="${i.exp?`https://www.google.de/search?q=${encodeURIComponent(i.q)}+in+meiner+N%C3%A4he`:searchUrl.amazon(i.q)}" target="_blank" rel="${AI_REL}">${i.exp?'In der Nähe suchen':'Bei Amazon ansehen (Anzeige)'}</a><button class="btn ghost sm" data-act="aihave" data-t="${esc(i.t)}">Habe ich schon</button><button class="btn ghost sm" data-act="ideano" data-self="1" data-t="${esc(i.t)}">Passt nicht</button></div></div></article>`).join('')}</div></section>`;
}

export function Entdecken(){
  const m=S.me;
  const ids=m.cats.length?m.cats:CATS.slice(0,4).map(c=>c.id);
  const mine=new Set(m.wishes.map(w=>w.t.toLowerCase()));
  const st=m.handle&&S.auth.user?aiStatus(skey(m.handle)):'none';
  const useCatalog=WORLDS&&(st==='empty'||st==='none');   // Katalog nur, wenn die KI nichts liefert, nie währenddessen
  const secs=(useCatalog?ids:[]).map(id=>{
    const c=cat(id),list=worldOffers(m,id,3);
    if(!list.length)return '';
    return `<section class="psec" style="margin-bottom:18px">
     <div class="row" style="gap:12px;margin-bottom:10px"><span class="wm-img" style="width:56px;height:56px">${art(c.a,c.t)}</span><div><p class="eyebrow">Deine Welt</p><h3 aria-level="2" style="font-size:26px">${esc(c.n)}</h3></div></div>
     <div class="offers">${list.map(o=>Card(o,id,mine.has(o.t.toLowerCase()))).join('')}</div>
    </section>`;
  }).filter(Boolean);
  return `<div class="wrap">
   <div class="pagehead"><p class="eyebrow">Inspiration</p><h1>${WORLDS?'Ideen aus deinen Welten':'Ideen für dich'}</h1>
    <p class="muted" style="max-width:620px">${WORLDS?(m.cats.length?'Wir haben für jede deiner Welten ein paar Dinge herausgesucht, die zu deinen Interessen und Marken passen. Was dir gefällt, setzt du mit einem Tipp auf deine Wunschliste.':'Sobald du in deinem Profil ein paar Welten auswählst, schlagen wir dir hier passende Dinge vor. Bis dahin findest du ein paar Anregungen aus beliebten Bereichen.'):'Wishtale sucht Ideen, die zu deinen Interessen, Marken und Wünschen passen. Was dir gefällt, setzt du mit einem Tipp auf deine Wunschliste.'}</p></div>
   ${Promo()}
   ${m.handle&&S.auth.user?PriceFilter():''}
   ${AiSelf()}
   ${st==='loading'?`<section class="psec" style="margin-bottom:18px">${AiLoading('Deine individuellen Empfehlungen werden erstellt …')}</section>`:''}
   ${!useCatalog?'':secs.length?secs.join(''):`<section class="psec" style="margin-bottom:18px"><p class="eyebrow">Zum Anfangen</p><h3 aria-level="2">Beliebte Wunschideen</h3><p class="muted">Sobald du in deinem Profil Interessen und Marken angibst, wird es persönlicher. Bis dahin ein paar Anregungen.</p><div class="offers" style="margin-top:10px">${popularOffers(4).map(o=>Card(o,'wohnen',mine.has(o.t.toLowerCase()))).join('')}</div></section>`}
   <p class="disc" style="margin-top:18px"><b>Anzeige:</b> Links zu Amazon sind Partnerlinks. ${'Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.'} Preise sind Richtwerte und können abweichen.</p>
  </div>`;
}
