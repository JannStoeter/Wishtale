import { S } from '../state.js';
import { esc, ic, money } from '../lib/util.js';
import { WishCard, WishRow } from './card.js';
import { V, cat, occL, PRIO } from '../data/content.js';
import { AppPromo } from './inspiration.js';
import { completeness } from '../lib/tale.js';
import { viaName } from '../lib/invite.js';
import { GuestPage } from './giver.js';
import { Steps } from './steps.js';

/** Freundlicher Hinweis, solange das Profil noch dünn ist. Verschwindet für eine Woche, wenn man „Später“ wählt. */
function Nudge(m){
  if(S.ui.nudgeOff||m.managed||!m.wishes.length)return ''; // bei leerer Liste zählt erst der erste Wunsch
  try{const t=+localStorage.getItem('wishtale:nudge-hidden');if(t&&Date.now()-t<6048e5)return ''}catch{/* ohne Speicher */}
  if(completeness(m).pct>=45)return '';
  return `<div class="banner green nudge" role="note">${ic('user')}<span><b>Deine Wunschliste steht.</b> Wenn du uns noch ein paar Dinge über dich verrätst, zum Beispiel was du magst, welche Marken du liebst und was du schon hast, passen die Vorschläge für deine Freunde viel besser. Das dauert nur zwei Minuten.</span><span class="row" style="gap:8px;margin:0"><button class="btn pri sm" data-act="edit">Profil einrichten</button><button class="linkbtn" data-act="nudgehide">Später</button></span></div>`;
}

export function VisIcon(k){const x=V[k];return `<span class="pill" title="${x.l}" aria-label="${x.l}">${ic(x.i,'sm')}</span>`}
/** Kacheln oder Liste: bei vielen Wünschen ist die Liste übersichtlicher (Voreinstellung ab 9 Wünschen). */
export const isMobile=()=>typeof matchMedia==='function'&&matchMedia('(max-width:719px)').matches;
export const useList=n=>isMobile()?true:S.ui.wview?S.ui.wview==='liste':n>8;  // Handy: immer Liste (Dev 075)
export function densSeg(n=0){const l=useList(n);return `<div class="seg" role="group" aria-label="Darstellung"><button class="${!l?'on':''}" data-act="wview" data-v="kacheln">Kacheln</button><button class="${l?'on':''}" data-act="wview" data-v="liste">Liste</button></div>`}
export const PrioKey=()=>`<span class="priokey" aria-hidden="true">${[3,2,1].map(n=>`<span><span class="dots">${[1,2,3].map(k=>`<i class="${k<=n?'on':''}"></i>`).join('')}</span>${PRIO[n]}</span>`).join('')}</span>`;
export function sortSeg(){const v=S.ui.wsort||'prio';return `<label class="sortsel"><span class="vh">Sortieren</span><select class="sel sm" data-sort="1" aria-label="Sortieren"><option value="prio" ${v==='prio'?'selected':''}>Wichtigste zuerst</option><option value="preis" ${v==='preis'?'selected':''}>Günstigste zuerst</option><option value="neu" ${v==='neu'?'selected':''}>Neueste zuerst</option></select></label>`}
const priceOf=w=>w.price||(w.kind==='kategorie'&&w.budget)||null;
export function sortWishes(list){
  const v=S.ui.wsort||'prio',idx=new Map(list.map((w,i)=>[w,i]));
  if(v==='preis')return [...list].sort((a,b)=>(priceOf(a)??1e9)-(priceOf(b)??1e9)||b.prio-a.prio);
  if(v==='neu')return [...list].reverse();
  return [...list].sort((a,b)=>b.prio-a.prio||idx.get(a)-idx.get(b));
}
/** Umschalter „Meine Ansicht | So sehen Schenkende es“ (Wünsche und Profil). */
export function ViewSeg(){const pv=S.ui.preview;return `<div class="seg" role="group" aria-label="Ansicht"><button class="${!pv?'on':''}" data-act="preview" data-v="0">Meine Ansicht</button><button class="${pv?'on':''}" data-act="preview" data-v="1"><span class="hide-s">So sehen Schenkende es</span><span class="show-s">Vorschau</span></button></div>`}
export const PreviewBanner=()=>`<div class="banner green" style="margin-top:12px">${ic('eye')}<span>So sieht deine Seite für Freunde aus. Alles, was du auf „Privat“ gestellt hast, und dein persönliches Feedback bleiben dabei verborgen.</span></div>`;
/** Leere Wunschliste: ein einziges Feld, sonst nichts. Der Rest erscheint erst mit dem ersten Wunsch. */
function EmptyWishes(m){
  const kid=m.managed,n=esc(m.name);
  return `<section class="firstwish" aria-labelledby="fw-h">
   <h1 id="fw-h">${kid?`Was wünscht sich ${n}?`:'Was wünschst du dir?'}</h1>
   <p class="fw-sub">Schreib einfach auf, was dir einfällt. Ein Produkt, ein Erlebnis oder eine Idee reicht.</p>
   <form data-form="firstwish" class="fw-form">
    <label class="vh" for="fw-t">${kid?'Wunsch':'Dein erster Wunsch'}</label>
    <input id="fw-t" name="t" class="inp big" placeholder="${kid?'z. B. SIKU Traktor':'z. B. Hochwertige Pfanne'}" autocomplete="off" maxlength="120">
    <button class="btn pri" type="submit">Weiter ${ic('arrow','sm')}</button>
   </form>
   <p class="fw-alt">Schon eine Liste? <button type="button" class="linkbtn" data-act="modal" data-v="zettel">Liste einlesen</button></p>
  </section>`;
}
export function Wuensche(){
  const m=S.me,u=S.ui;
  if(u.preview)return `<div class="wrap"><div class="row" style="margin:18px 0 4px">${ViewSeg()}</div>${PreviewBanner()}${GuestPage(m,{preview:true})}</div>`;
  let list=m.wishes.filter(w=>u.wf==='alle'||(u.wf==='offen'?(w.status==='offen'||w.status==='plan'):w.status==='selbst'));
  if(u.wc!=='alle')list=list.filter(w=>w.c===u.wc);
  list=sortWishes(list);
  const used=[...new Set(m.wishes.map(w=>w.c))];
  const open=m.wishes.filter(w=>w.status==='offen'||w.status==='plan').length;
  if(!m.wishes.length)return `<div class="wrap first">${EmptyWishes(m)}</div>`;
  const active=(u.wc!=='alle'?1:0)+((u.wsort||'prio')!=='prio'?1:0);
  const filt=m.wishes.length>=6?`<details class="fsort"><summary>${ic('search','sm')}Filtern und sortieren${active?` <span class="chip gold">${active}</span>`:''}</summary><div class="fsort-body">${used.length>1?`<label class="sortsel"><span class="vh">Kategorie</span><select class="sel sm" data-wc="1" aria-label="Kategorie"><option value="alle">Alle Kategorien</option>${used.map(c=>`<option value="${c}" ${u.wc===c?'selected':''}>${cat(c).n}</option>`).join('')}</select></label>`:''}${sortSeg()}<span class="desk-only">${densSeg(list.length)}</span></div></details>`:'';
  const note=m.managed?`Als Elternteil siehst du, was reserviert oder gekauft ist. ${esc(m.name)} sieht es nicht.`:'Die Überraschung bleibt: Du siehst nie, ob jemand einen deiner Wünsche reserviert oder gekauft hat.';
  return `<div class="wrap">
   <div class="pagehead"><p class="eyebrow">Meine Wünsche</p><h1>${open===0?(m.managed?`Hier beginnt die Wunschliste von ${esc(m.name)}`:'Hier beginnt deine Wunschliste'):m.managed?`${open} Wünsche von ${esc(m.name)}.`:open===1?'1 Ding, über das ich mich freuen würde.':`${open} Dinge, über die ich mich freuen würde.`}</h1></div>
   <div class="row homebar">${ViewSeg()}${m.handle||!S.auth.user?`<button class="btn gold sm" data-act="share">Teilen</button>`:""}</div>
   <button class="importrow" data-act="modal" data-v="zettel">${ic('plus','sm')}<span><b>Schon eine Liste? Liste einlesen</b><small>Text oder Foto übernehmen</small></span>${ic('arrow','sm')}</button>
   <div class="row" style="margin:10px 0 12px;gap:8px;flex-wrap:wrap"><div class="seg" role="group" aria-label="Status">${[['offen','Offen'],['selbst','Erledigt'],['alle','Alle Wünsche']].map(([k,l])=>`<button class="${u.wf===k?'on':''}" data-act="wf" data-v="${k}">${l}</button>`).join('')}</div></div>
   ${filt}
   <h2 class="vh">Deine Wünsche</h2>
   ${list.length?PrioKey():''}<div class="${useList(list.length)?'wlist':'wgrid'}">${list.map(w=>(useList(list.length)?WishRow:WishCard)(w,m,{
      meta:(w.status==='plan'?'<span class="chip ok">Nur für dich</span>':'')+(w.kind==='kategorie'?`<span class="chip gold">Kategorie${w.budget?' bis '+money(w.budget):''}</span>`:'')+(w.kind==='erlebnis'?'<span class="chip">Erlebnis</span>':'')+(w.kind==='frei'?'<span class="chip">Freier Wunsch</span>':'')+(w.via?`<span class="chip gold">Tipp von ${esc(viaName(w.via))}</span>`:'')+w.occ.map(o=>`<span class="chip">${occL(o)}</span>`).join(''),
      status:m.managed&&(w.res||w.bought)?{text:w.bought?'Gekauft':'Reserviert',tone:w.bought?'me':'res'}:null,
      taken:false,
      ctx:'own'
    })).join('')||`<p class="muted" style="font-size:16px">Dein erster Wunsch wartet schon auf dich. Schreib ihn auf, füge einen Link ein oder lies eine ganze Liste ein, und Wishtale macht den Rest.</p>`}</div>
   <p class="surprise">${ic('lock','sm')}<span>${note}</span></p>
   <details class="tips"><summary>Tipps zu deiner Wunschliste</summary><p class="muted">Du musst nicht jedes Produkt kennen. Schreib zum Beispiel „Hochwertige Pfanne bis 100 €“, dann suchen wir für deine Freunde passende Vorschläge heraus. Auch ohne Link finden wir bei Amazon etwas Passendes.</p></details>
   ${Steps(m)||Nudge(m)}
   ${AppPromo()}
   <div class="fabspace" aria-hidden="true"></div>
   <div class="fab"><button class="btn pri" data-act="modal" data-v="wish">${ic('plus','sm')}Wunsch hinzufügen</button></div>
  </div>`;
}
