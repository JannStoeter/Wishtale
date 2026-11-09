import { S } from '../state.js';
import { esc, ic, money } from '../lib/util.js';
import { WishCard } from './card.js';
import { V, cat, crea, occL } from '../data/content.js';
import { AppPromo } from './inspiration.js';
import { completeness } from '../lib/tale.js';

/** Freundlicher Hinweis, solange das Profil noch dünn ist. Verschwindet für eine Woche, wenn man „Später“ wählt. */
function Nudge(m){
  if(S.ui.nudgeOff||m.managed)return '';
  try{const t=+localStorage.getItem('wishtale:nudge-hidden');if(t&&Date.now()-t<6048e5)return ''}catch{/* ohne Speicher */}
  if(completeness(m).pct>=45)return '';
  return `<div class="banner green nudge" role="note">${ic('user')}<span><b>Deine Wunschliste steht.</b> Wenn du uns noch ein paar Dinge über dich verrätst, zum Beispiel was du magst, welche Marken du liebst und was du schon hast, passen die Vorschläge für deine Freunde viel besser. Das dauert nur zwei Minuten.</span><span class="row" style="gap:8px;margin:0"><button class="btn pri sm" data-act="edit">Profil einrichten</button><button class="linkbtn" data-act="nudgehide">Später</button></span></div>`;
}

export function VisIcon(k){const x=V[k];return `<span class="pill" title="${x.l}" aria-label="${x.l}">${ic(x.i,'sm')}</span>`}
export function densSeg(){return `<div class="seg" role="group" aria-label="Darstellung"><button class="${!S.ui.big?'on':''}" data-act="dens" data-v="0">Kompakt</button><button class="${S.ui.big?'on':''}" data-act="dens" data-v="1">Groß</button></div>`}
export function Wuensche(){
  const m=S.me,u=S.ui;
  let list=m.wishes.filter(w=>u.wf==='alle'||(u.wf==='offen'?(w.status==='offen'||w.status==='plan'):w.status==='selbst'));
  if(u.wc!=='alle')list=list.filter(w=>w.c===u.wc);
  list=[...list].sort((a,b)=>b.prio-a.prio);
  const used=[...new Set(m.wishes.map(w=>w.c))];
  const open=m.wishes.filter(w=>w.status==='offen'||w.status==='plan').length;
  return `<div class="wrap">
   ${AppPromo()}
   ${Nudge(m)}
   <div class="pagehead"><p class="eyebrow">Meine Wünsche</p><h1>${m.managed?`${open} Wünsche von ${esc(m.name)}.`:`${open} Dinge, über die ich mich freuen würde.`}</h1></div>
   <div class="banner" style="margin-bottom:8px">${ic('lock')}<span>${m.managed?`Als Elternteil siehst du, was reserviert oder gekauft ist. ${esc(m.name)} sieht es nicht.`:'Die Überraschung bleibt: Du siehst nie, ob jemand einen deiner Wünsche reserviert oder gekauft hat.'}</span></div>
   <p class="muted" style="font-size:14px;margin-bottom:16px">Du musst nicht jedes Produkt kennen. Schreib zum Beispiel „Hochwertige Pfanne bis 100 €“, dann suchen wir für deine Freunde passende Vorschläge heraus. Auch ohne Link finden wir bei Amazon etwas Passendes.</p>
   <p style="margin:-6px 0 16px"><button class="btn ghost sm" data-act="modal" data-v="zettel">Du hast schon einen Wunschzettel? Lade ihn hoch</button></p>
   <div class="row" style="justify-content:space-between;margin-bottom:16px">
     <div class="seg" role="group" aria-label="Status">${[['offen','Offen'],['selbst','Selbst gekauft'],['alle','Alle']].map(([k,l])=>`<button class="${u.wf===k?'on':''}" data-act="wf" data-v="${k}">${l}</button>`).join('')}</div>
     <div class="seg" role="group" aria-label="Kategorie"><button class="${u.wc==='alle'?'on':''}" data-act="wc" data-v="alle">Alle</button>${used.map(c=>`<button class="${u.wc===c?'on':''}" data-act="wc" data-v="${c}">${cat(c).n}</button>`).join('')}</div>
     ${densSeg()}
   </div>
   <h2 class="vh">Deine Wünsche</h2>
   <div class="wgrid ${u.big?'big':''}">${list.map(w=>WishCard(w,m,{
      meta:(w.status==='plan'?'<span class="chip ok">Nur für dich</span>':'')+(w.kind==='kategorie'?`<span class="chip gold">Kategorie${w.budget?' bis '+money(w.budget):''}</span>`:'')+(w.kind==='erlebnis'?'<span class="chip">Erlebnis</span>':'')+(w.kind==='frei'?'<span class="chip">Freier Wunsch</span>':'')+(w.via?`<span class="chip gold">via ${esc(crea(w.via).handle)}</span>`:'')+w.occ.map(o=>`<span class="chip">${occL(o)}</span>`).join(''),
      status:m.managed&&(w.res||w.bought)?{text:w.bought?'Gekauft':'Reserviert',tone:w.bought?'me':'res'}:null,
      taken:false,
      ctx:'own'
    })).join('')||`<p class="muted">Hier ist noch nichts. Mit „Wunsch hinzufügen“ legst du deinen ersten an.</p>`}</div>
   <div class="fab"><button class="btn amz" data-act="azopen">Bei Amazon stöbern</button><button class="btn pri" data-act="modal" data-v="wish">${ic('plus','sm')}Wunsch hinzufügen</button></div>
  </div>`;
}
