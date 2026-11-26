import { S, guestDraft } from '../state.js';
import { esc, ic, money } from '../lib/util.js';
import { WishCard, WishRow } from './card.js';
import { V, cat, occL, PRIO } from '../data/content.js';
import { AppPromo, HomeIdeas } from './inspiration.js';
import { completeness } from '../lib/tale.js';
import { viaName } from '../lib/invite.js';
import { GuestPage } from './giver.js';
import { TasteHint } from './taste.js';
import { Steps } from './steps.js';
import { AppHint } from './appinstall.js';
import { Tip } from './tips.js';
import { occLine } from './occasion.js';

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
export function ViewSeg(){return S.ui.preview?`<button class="btn ghost sm" data-act="preview" data-v="0">${ic('back','sm')}Zurück zu meinen Wünschen</button>`:`<button class="linkbtn viewlink" data-act="preview" data-v="1">${ic('eye','sm')}So sehen es deine Freunde</button>`}
export const PreviewBanner=()=>`<div class="banner green" style="margin-top:12px">${ic('eye')}<span>So sieht deine Seite für Freunde aus. Alles, was du auf „Privat“ gestellt hast, und dein persönliches Feedback bleiben dabei verborgen.</span></div>`;
/** Leere Wunschliste: ein einziges Feld, sonst nichts. Der Rest erscheint erst mit dem ersten Wunsch. */
function EmptyWishes(m){
  const kid=m.managed,n=esc(m.name),occ=!!m.occasion;
  return `<section class="firstwish" aria-labelledby="fw-h">
   ${occ?`<p class="eyebrow">${occLine(m)} · <button type="button" class="linkbtn" data-act="occedit">Bearbeiten</button></p>`:''}
   <h1 id="fw-h">${occ?n:kid?`Was wünscht sich ${n}?`:'Was wünschst du dir?'}</h1>
   <p class="fw-sub">${occ?'Trag ein, was ihr euch zu diesem Anlass wünscht. Diese Liste hat einen eigenen Link, deine Wunschliste bleibt davon unberührt.':'Schreib einfach auf, was dir einfällt. Ein Produkt, ein Erlebnis oder eine Idee reicht.'}</p>
   <form data-form="firstwish" class="fw-form">
    <label class="vh" for="fw-t">${kid?'Wunsch':'Dein erster Wunsch'}</label>
    <input id="fw-t" name="t" class="inp big" placeholder="${kid?'z. B. SIKU Traktor':'z. B. Hochwertige Pfanne'}" autocomplete="off" maxlength="120">
    <button class="btn pri" type="submit">Weiter ${ic('arrow','sm')}</button>
   </form>
   <p class="fw-alt">Schon eine Liste auf Papier oder bei Amazon? <button type="button" class="linkbtn" data-act="modal" data-v="zettel">Liste einlesen</button></p>
  </section>`;
}
const GLOGO='<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.9 6.2C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"/><path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.2C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.2C6.6 42.6 14.6 48 24 48z"/></svg>';
/** Wunschliste ohne Konto (136): ein ruhiger Hinweis über der Liste, sichern geht mit Google in einem Klick oder per E-Mail. */
function SaveHint(n){
  return `<section class="savehint" aria-labelledby="sh-h"><div class="sh-txt"><h2 id="sh-h">${n===1?'Dein erster Wunsch steht':'Deine Wunschliste wächst'}</h2>
   <p>Bisher liegt deine Wunschliste nur in diesem Browser. Damit deine Wünsche sicher sind und du sie teilen kannst, leg schnell ein Konto an.</p></div>
   <div class="sh-acts">${S.ui.google?`<button type="button" class="btn gbtn" data-act="google">${GLOGO}<span>Mit Google sichern</span></button><a class="btn sec" href="#registrieren">Mit E-Mail</a>`:`<a class="btn pri" href="#registrieren">Konto anlegen</a>`}</div></section>`;
}
/* Das Band „Jetzt neu“ bleibt nur, bis man es benutzt oder wegklickt (103). Hochladen gibt es danach weiter im Wunschdialog und im Menü. */
const NB='wishtale:newbar-done';
export const newbarDone=()=>{try{return localStorage.getItem(NB)==='1'}catch{return false}};
export const setNewbarDone=()=>{try{localStorage.setItem(NB,'1')}catch{/* egal */}};
export function Wuensche(){
  const m=S.me,u=S.ui;
  if(u.preview)return `<div class="wrap"><div class="row" style="margin:18px 0 4px">${ViewSeg()}</div>${PreviewBanner()}${GuestPage(m,{preview:true})}</div>`;
  let list=m.wishes.filter(w=>w.status==='offen'||w.status==='plan');  // Erledigtes steht im Profil unter „Das habe ich schon“ (Dev 083)
  if(u.wc!=='alle')list=list.filter(w=>w.c===u.wc);
  list=sortWishes(list);
  const used=[...new Set(m.wishes.map(w=>w.c))];
  const open=m.wishes.filter(w=>w.status==='offen'||w.status==='plan').length;
  if(!m.wishes.length)return `<div class="wrap first">${m.managed&&!m.occasion?Tip():''}${EmptyWishes(m)}</div>`; // im leeren Kind-Konto passt nur der Elternteil-Hinweis (106)
  const active=(u.wc!=='alle'?1:0)+((u.wsort||'prio')!=='prio'?1:0);
  const filt=m.wishes.length>=6?`<details class="fsort"><summary>${ic('filter','sm')}Filtern und sortieren${active?` <span class="chip gold">${active}</span>`:''}</summary><div class="fsort-body">${used.length>1?`<label class="sortsel"><span class="vh">Kategorie</span><select class="sel sm" data-wc="1" aria-label="Kategorie"><option value="alle">Alle Kategorien</option>${used.map(c=>`<option value="${c}" ${u.wc===c?'selected':''}>${cat(c).n}</option>`).join('')}</select></label>`:''}${sortSeg()}${PrioKey()}<span class="desk-only">${densSeg(list.length)}</span></div></details>`:'';
  const draft=guestDraft(),occ=!!m.occasion,tip=occ||draft?'':Tip(); // Hinweis im passenden Moment steht über der Liste und ersetzt solange die übrigen (104)
  const note=m.managed?`Als Elternteil siehst du, was reserviert oder gekauft ist. ${esc(m.name)} sieht es nicht.`:'Die Überraschung bleibt: Du siehst nie, ob jemand einen deiner Wünsche reserviert oder gekauft hat.';
  return `<div class="wrap">
   <div class="pagehead">${occ?`<p class="eyebrow">${occLine(m)} · <button type="button" class="linkbtn" data-act="occedit">Bearbeiten</button></p><h1>${esc(m.name)}</h1>`:`<p class="eyebrow">Meine Wünsche</p><h1${open&&!m.managed?' class="oneline"':''}>${open===0?(m.managed?`Hier beginnt die Wunschliste von ${esc(m.name)}`:'Hier beginnt deine Wunschliste'):m.managed?`${open} Wünsche von ${esc(m.name)}`:open===1?'1 Ding, über das ich mich freuen würde':`${open} Dinge, über die ich mich freuen würde`}</h1>`}</div>
   <div class="row homebar">${ViewSeg()}${m.handle||!S.auth.user?`<button class="btn gold sm" data-act="share">Teilen</button>`:""}</div>
   ${draft?SaveHint(open):''}
   ${newbarDone()||occ||draft?'':`<div class="newbar-wrap"><button class="newbar" data-act="newbar"><span class="nb-tag">Jetzt neu</span><span class="nb-t"><b>Einfach Wunschliste hochladen</b><small>Foto vom Wunschzettel oder Text, Wishtale macht daraus Wünsche</small></span>${ic('arrow','sm')}</button><button class="newbar-x" data-act="newbarx" aria-label="Hinweis ausblenden">×</button></div>`}
   ${tip}
   ${filt}
   <h2 class="vh">Deine Wünsche</h2>
   ${list.length&&!filt?PrioKey():''}<div class="${useList(list.length)?'wlist':'wgrid'}">${list.map(w=>(useList(list.length)?WishRow:WishCard)(w,m,{
      meta:(w.status==='plan'?'<span class="chip ok">Nur für dich</span>':'')+(w.kind==='kategorie'?`<span class="chip gold">Kategorie${w.budget?' bis '+money(w.budget):''}</span>`:'')+(w.kind==='erlebnis'?'<span class="chip">Erlebnis</span>':'')+(w.kind==='frei'?'<span class="chip">Freier Wunsch</span>':'')+(w.via?`<span class="chip gold">Tipp von ${esc(viaName(w.via))}</span>`:'')+w.occ.map(o=>`<span class="chip">${occL(o)}</span>`).join(''),
      status:m.managed&&(w.res||w.bought)?{text:w.bought?'Gekauft':'Reserviert',tone:w.bought?'me':'res'}:null,
      taken:false,
      ctx:'own'
    })).join('')||`<p class="muted" style="font-size:16px">Dein erster Wunsch wartet schon auf dich. Schreib ihn auf, füge einen Link ein oder lies eine ganze Liste ein, und Wishtale macht den Rest.</p>`}</div>
   <p class="surprise">${ic('lock','sm')}<span>${note}</span></p>
   ${occ?'':HomeIdeas()}
   ${tip||occ||draft?'':Steps(m)||AppHint(open)||TasteHint()||Nudge(m)}
   ${AppPromo()}
   <div class="fabspace" aria-hidden="true"></div>
   <div class="fab"><button class="btn pri" data-act="modal" data-v="wish">${ic('plus','sm')}Wunsch hinzufügen</button></div>
  </div>`;
}
