import { S, initials, guestPerson } from '../state.js';
import { esc, ic, money, kwOf, gen } from '../lib/util.js';
import { art } from '../lib/art.js';
import { CATS, ABOUT, cat, crea, cprod } from '../data/content.js';
import { ownedOf, excluded, recommend } from '../logic.js';
import { densSeg, sortSeg, sortWishes, useList } from './wishes.js';
import { WishCard, WishRow } from './card.js';
import { AMAZON_DISCLOSURE, searchUrl, voucherLink } from '../lib/shops.js';
import { instagramUrl } from '../lib/social.js';
import { PastGifts } from './given.js';
import { ideasOf, aiStatus, gkey } from '../lib/ideas.js';
import { AiLoading } from './ailoading.js';

/* Gast-Ansicht: ein Freund öffnet den Link und sieht nur dieses eine Profil. */
export function Gast(){
  if(S.guest&&S.guest.handle===S.ui.person&&S.guest.status==='loading')return `<div class="wrap"><p class="muted" style="padding:60px 0;text-align:center" role="status">Profil wird geladen …</p></div>`;
  if(S.guest&&S.guest.handle===S.ui.person&&S.guest.status==='error')return `<div class="wrap"><div class="panel" style="max-width:520px;margin:40px auto;display:grid;gap:12px"><h2>Das hat nicht geklappt</h2><p class="muted">Das Profil lässt sich gerade nicht laden. Wirf bitte einen Blick auf deine Internetverbindung und versuche es gleich noch einmal.</p><button class="btn pri" data-act="guestretry" style="justify-self:start">Erneut versuchen</button></div></div>`;
  const p=guestPerson();
  if(!p)return `<div class="wrap"><div class="panel" style="max-width:520px;margin:40px auto;display:grid;gap:12px"><h2>Profil nicht gefunden</h2><p class="muted">Zu diesem Link finden wir leider kein Profil. Vielleicht hat sich beim Kopieren ein Zeichen verloren. Am einfachsten fragst du die Person noch einmal nach ihrem Link.</p><a class="btn pri" href="../" style="justify-self:start">Zu Wishtale</a></div></div>`;
  return GuestPage(p,{});
}

/* Dieselbe Seite sieht der Besitzer als "So sehen Schenkende es" (preview: ohne Reservierungen und Aktionen). */
export function GuestPage(p,{preview=false}={}){
  const wl=WishList(p,{preview});
  const none=!wl.count;
  return `<div class="${preview?'':'wrap'}">
   <div class="pgrid">
    <div class="pheadslot">${ProfileHead(p,{preview})}</div>
    <div class="pmain">
     ${preview?'':PastGifts(p)}
     ${none?'':wl.html}
     ${More(p,{preview,none,open:wl.open})}
     <p class="disc">Die Links zu Shops sind Partnerlinks (Anzeige). ${AMAZON_DISCLOSURE} Preise können abweichen, maßgeblich ist immer der Preis bei Amazon.</p>
    </div>
    <aside class="paside ${S.ui.asideOpen?'open':''}" aria-label="Mehr über ${esc(p.name)}">
     <button class="asidetoggle" data-act="aside" aria-expanded="${!!S.ui.asideOpen}"><span><b>Mehr über ${esc(p.name)}</b><small>Über ${esc(p.name)}, Interessen, Lieblingsmarken, Inspiration, was ${esc(p.name)} schon hat und lieber nicht möchte</small></span><i aria-hidden="true">${S.ui.asideOpen?'−':'+'}</i></button>
     <div class="asidebody" tabindex="0">${Facts(p,{preview})}</div>
    </aside>
   </div>
  </div>`;
}

/* Zweiter Teil: erst wenn auf der Liste nichts passt (oder es keine Wünsche gibt). Hier gilt der Preisrahmen. „Bitte nicht“ und „Hat schon“ stehen in der Seitenleiste. */
function More(p,{preview=false,none=false,open=0}={}){
  const ai=['ready','loading'].includes(aiStatus(gkey(p.handle||p.id)));
  return `<section class="more${none?' first':''}" id="mehr" aria-labelledby="mehr-h">
   <p class="eyebrow">${none?'Tipps von Wishtale':'Wir empfehlen außerdem'}</p>
   <h2 id="mehr-h">${none?`${esc(p.name)} lässt sich noch inspirieren, hier findest du unsere Tipps`:'Nicht das Passende dabei?'}</h2>
   <p class="muted" style="margin:6px 0 14px">Wishtale kennt ${esc(gen(p.name))} Geschmack und schlägt dir Passendes vor. Sag uns, wie viel du ausgeben möchtest, der Rahmen gilt nur für diese Vorschläge.</p>
   ${PriceFilter()}
   ${AiIdeas(p)}
   ${ai?'':Curated(p,open)}
   ${preview?'':`<details class="sect ideacheck" id="ideen"><summary><h3>Eigene Idee prüfen</h3></summary><p class="muted" style="font-size:14.5px;margin:4px 0 12px">Du hast selbst eine Idee? Wir schauen für dich nach, ob sie zu ${esc(p.name)} passt und ob ${esc(p.name)} das schon hat.</p>${Ideen(p)}</details>`}
  </section>`;
}

/* Kopfbereich: Über mich, Interessen, Marken und No-Gos auf einen Blick, daneben der Anlass. */
export function ProfileHead(p,{preview=false}={}){
  const hide=k=>preview&&p.vis&&p.vis[k]==='privat';
  const likes=(hide('interests')?[]:p.interests).slice(0,3);
  const list=likes.length>1?likes.slice(0,-1).join(', ')+' und '+likes[likes.length-1]:likes[0]||'';
  return `<section class="phead compact" aria-label="Profil von ${esc(p.name)}">
    <div class="top"><span class="av t${p.tone}">${initials(p.name)}</span><div><p class="eyebrow">${p.managed?`Kind-Konto${p.age?', '+p.age+' Jahre':''}`:'Wishtale'}</p><h1>${esc(p.name)}</h1>${list?`<p class="taste">${esc(p.name)} liebt ${esc(list)}.</p>`:''}</div></div>
  </section>`;
}

/* Seitenleiste: was Schenkende zusätzlich wissen sollten. */
export function Facts(p,{preview=false}={}){
  const ctx=preview?'own':'guest';
  const block=(t,inner)=>inner?`<section class="fact"><h3 aria-level="2">${t}</h3>${inner}</section>`:'';
  const chips=(a,c='')=>a.length?`<div class="chips">${a.map(x=>`<span class="chip ${c}">${esc(x)}</span>`).join('')}</div>`:'';
  const worlds=p.cats.length?`<p class="muted" style="font-size:13.5px;margin-bottom:8px">Tippe auf eine Welt, dann erzählen wir dir, was dazu passen könnte.</p><div class="catrow">${p.cats.map(id=>{const c=cat(id);return `<button class="catmini" data-act="world" data-id="${c.id}" data-ctx="${ctx}" aria-label="Welt ${esc(c.n)} öffnen">${art(c.a,c.t)}<div>${esc(c.n)}</div></button>`}).join('')}</div>`:'';
  const alts=p.alts.length?`<p class="muted" style="font-size:13.5px;margin-bottom:8px">${esc(p.name)} freut sich auch über:</p><div class="chips">${p.alts.map(a=>{const v=voucherLink(a);return `<a class="chip ok" href="${v.url}" target="_blank" rel="noopener noreferrer${v.ad?' sponsored nofollow':''}">${esc(a)} ↗</a>`}).join('')}</div>${p.alts.some(a=>voucherLink(a).ad)?'<span class="ad">Enthält Anzeige (Amazon-Partnerlink)</span>':''}`:'';
  const soc=p.social||{};
  const inspo=(soc.pinterest||soc.instagram)?`<p class="muted" style="font-size:13.5px;margin-bottom:10px">Hier sammelt ${esc(p.name)} Ideen und Fundstücke. Ein Blick darauf verrät oft mehr als jede Wunschliste.</p><div class="social">${soc.pinterest?`<button class="btn sec sm" data-act="pins" data-ctx="${ctx}">Pins hier ansehen</button><a class="chip" href="${esc(soc.pinterest)}" target="_blank" rel="noopener noreferrer">Auf Pinterest öffnen ↗</a>`:''}${soc.instagram?`<a class="chip" href="${esc(instagramUrl(soc.instagram))}" target="_blank" rel="noopener noreferrer">Instagram: @${esc(soc.instagram)} ↗</a>`:''}</div>`:'';
  const hide=k=>preview&&p.vis&&p.vis[k]==='privat';
  const nogos=hide('nogos')?[]:p.nogos,owned=ownedOf(p).filter(w=>w.vis!=='privat').map(w=>w.t);
  const fold=(t,a,c,intro)=>a.length?`<details class="fact fold"><summary><h3 aria-level="2">${t}</h3><span class="cnt">${a.length}</span></summary>${intro?`<p class="muted" style="font-size:13.5px;margin:0">${intro}</p>`:''}${chips(a,c)}</details>`:'';
  const about=p.about||ABOUT[p.id]||'';
  return block('Über '+esc(p.name),about?`<p class="about" style="margin:0">${esc(about)}</p>`:'')
   +block('Interessen',hide('interests')?'':chips(p.interests))
   +block('Lieblingsmarken',hide('brands')?'':chips(p.brands))
   +block('Das inspiriert '+esc(p.name),inspo)
   +block('Möchte ausprobieren',chips(p.tries,'gold'))
   +block('Welten',worlds)
   +block('Wenn nichts passt',alts)
   +fold('Bitte nicht',nogos,'warn',`Damit liegst du bei ${esc(p.name)} eher daneben.`)
   +fold(`Hat ${esc(p.name)} schon`,owned,'ok','Das ist schon da und muss nicht doppelt kommen.');
}

/* Preisrahmen für die Ideen: viele Geschenke liegen um 20 Euro, nicht um 100. */
export function PriceFilter(){
  const pb=S.ui.pb||0;
  return `<div class="occ pocc"><p class="eyebrow">Wie viel möchtest du ausgeben?</p><div class="seg" role="group" aria-label="Preisrahmen">${[[0,'Egal'],[20,'Bis 20 €'],[50,'Bis 50 €'],[100,'Bis 100 €']].map(([k,l])=>`<button class="${pb===k?'on':''}" data-act="pb" data-v="${k}">${l}</button>`).join('')}</div></div>`;
}

/* Die Wunschliste: steht direkt unter dem Profilkopf. */
export function WishList(p,{preview=false}={}){
  const only=S.ui.onlyOpen&&!preview;
  const rel=()=>1;
  const all=sortWishes(p.wishes.filter(w=>w.status==='offen'&&w.vis!=='privat'));
  const vw=all.map(w0=>preview?{...w0,res:null,bought:false}:w0);
  const shown=only?vw.filter(w=>w.res!=='other'):vw;
  const cardOf=w=>{
    const r=rel(w),isMine=w.res==='me',taken=w.res==='other';
    let status=null;
    if(w.bought)status={text:'Von dir gekauft',tone:'me'};
    else if(isMine)status={text:'Von dir reserviert',tone:'me'};
    else if(taken)status={text:'Reserviert',tone:'res'};
    const meta=(w.via?`<span class="chip gold">Tipp</span>`:'')+(w.kind==='kategorie'?`<span class="chip">bis ${w.budget?money(w.budget):'offen'}</span>`:'');
    return (useList(all.length)?WishRow:WishCard)(w,p,{ctx:preview?'preview':'guest',meta,status,taken:taken||(w.bought&&!isMine),dim:r===0&&!taken});
  };
  const free=vw.filter(w=>w.res!=='other').length;
  const html=`<section id="wunschliste" aria-label="Wunschliste von ${esc(p.name)}">
   <div class="row" style="justify-content:space-between;margin-bottom:8px"><div><p class="eyebrow">Wunschliste · ${only?`${shown.length} offen`:`${all.length} ${all.length===1?'Wunsch':'Wünsche'}`}</p><h2 style="font-size:clamp(30px,4vw,44px)">Was ${esc(p.name)} sich wünscht</h2></div>
    <div class="row" style="gap:8px">${preview?'':`<div class="seg" role="group" aria-label="Filter"><button class="${!only?'on':''}" data-act="onlyopen" data-v="0">Alle</button><button class="${only?'on':''}" data-act="onlyopen" data-v="1">Nur offene${free!==all.length?` (${free})`:''}</button></div>`}${sortSeg()}${densSeg(all.length)}</div></div>
   <p class="muted" style="font-size:14px;margin-bottom:14px">${ic('lock','sm')} ${p.managed?`${esc(p.parent||'Die Eltern')} pflegt die Wünsche und sieht, was reserviert ist. ${esc(p.name)} bekommt davon nichts mit.`:`Deine Reservierung bleibt anonym. ${esc(p.name)} erfährt nie, was reserviert oder gekauft wurde, damit die Überraschung bleibt.`}</p>
   <div class="${useList(all.length)?'wlist':'wgrid'}">${shown.map(cardOf).join('')||`<p class="muted">Alle Wünsche sind schon vergeben. Schau dir unten die Ideen an.</p>`}</div></section>`;
  return {html,open:free,count:all.length};
}

/* "Das würde auch gut passen": von uns kuratiert. Steht bewusst unter der Wunschliste. */
const AI_REL='noopener noreferrer sponsored nofollow';
/* Ideen von der KI (api/ideas.js): Produktarten mit Suchbegriff, klar als Vorschlag von Wishtale gekennzeichnet. */
export function AiIdeas(p){
  const st=aiStatus(gkey(p.handle||p.id));
  if(st==='loading')return `<section class="sect curated" id="ideen-ki">${AiLoading(`Wishtale erstellt individuelle Empfehlungen für ${esc(p.name)} …`)}</section>`;
  const list=ideasOf(gkey(p.handle||p.id));if(!list.length)return '';
  const price=i=>i.from&&i.to?`ca. ${i.from} bis ${i.to} €`:i.to?`bis ca. ${i.to} €`:'';
  return `<section class="sect curated" id="ideen-ki"><p class="eyebrow">Vorschläge von Wishtale</p><h3 style="font-size:clamp(24px,3vw,32px)">Ideen, die zu ${esc(p.name)} passen</h3>
   <p class="muted" style="font-size:14.5px;margin:6px 0 16px">Diese Ideen schreibt Wishtale nach dem, was wir über ${esc(p.name)} wissen. Es sind Anregungen und keine ausgewählten Produkte: ${esc(p.name)} hat sich dafür nichts Bestimmtes gewünscht.</p>
   <div class="recs grid">${list.map(i=>`<article class="rec" style="display:block"><div><h3>${esc(i.t)}</h3><p class="why">${esc(i.why)}</p>
    <div class="row" style="gap:6px"><span class="chip ${i.exp?'gold':''}">${i.exp?'Erlebnis':'Geschenk'}</span>${price(i)?`<span class="chip" title="Grobe Schätzung, kein Live-Preis">${price(i)}</span>`:''}</div>
    <div class="row" style="margin-top:8px"><a class="btn amz sm" href="${i.exp?`https://www.google.de/search?q=${encodeURIComponent(i.q)}+in+meiner+N%C3%A4he`:searchUrl.amazon(i.q)}" target="_blank" rel="${AI_REL}">${i.exp?'In der Nähe suchen':'Bei Amazon suchen (Anzeige)'}</a><button class="btn ghost sm" data-act="ideano" data-t="${esc(i.t)}">Passt nicht</button></div></div></article>`).join('')}</div></section>`;
}
export function Curated(p,openWishes){
  const few=openWishes<4;
  return `<section class="sect curated" id="passt"><p class="eyebrow">Von Wishtale kuratiert</p><h3 style="font-size:clamp(24px,3vw,32px)">Das würde auch gut passen</h3>
   <p class="muted" style="font-size:14.5px;margin:6px 0 16px">${few?`${esc(p.name)} hat noch nicht viele Wünsche eingetragen, deshalb haben wir hier ein paar Ideen mehr für dich. `:'Falls dir auf der Wunschliste nichts zusagt, haben wir hier noch ein paar Ideen. '}Wir haben sie aus den Interessen, Lieblingsmarken und dem Anlass zusammengestellt und dabei beachtet, was ${esc(p.name)} schon besitzt.</p>
   ${Recs(p)}</section>`;
}
export function Ideen(p){
  const u=S.ui,r=u.ideaRes;
  let out='';
  if(r){
    const bad=r.res.length>0;
    const cards=r.res.map(x=>{
      if(x.type==='wish')return `<div class="res-card bad"><strong>Steht schon auf der Liste</strong><p>${esc(x.w.t)}${x.w.res==='other'?' ist bereits von jemandem reserviert.':' ist noch frei.'}</p>${x.w.res?'':`<div class="row">${x.w.kind==='kategorie'?`<button class="btn gold sm" data-act="suggest" data-id="${x.w.id}">Produkt vorschlagen</button>`:''}<button class="btn pri sm" data-act="reserve" data-id="${x.w.id}" data-stay="1">Jetzt reservieren</button></div>`}</div>`;
      if(x.type==='have')return `<div class="res-card bad"><strong>Das hat ${esc(p.name)} schon</strong><p>${esc(p.name)} hat sich bereits selbst gekauft: ${esc(x.w.t)}.</p></div>`;
      if(x.type==='given')return `<div class="res-card bad"><strong>Das gibt es schon</strong><p>${esc(p.name)} hat so etwas schon bekommen.</p></div>`;
      return `<div class="res-card bad"><strong>Lieber nicht</strong><p>${esc(p.name)} möchte keine ${esc(x.n)} geschenkt bekommen.</p></div>`;
    }).join('');
    let verdict='';
    if(!bad){
      const f=r.hitTags.length||r.fits.length;
      verdict=`<div class="res-card ${f?'good':'info'}"><strong>${f?'Gute Idee':'Kein Konflikt gefunden'}</strong><p>${f?`Passt zu ${esc(gen(p.name))} Interessen${r.fits.length?`: ${r.fits.map(esc).join(', ')}`:''}. Außerdem steht es weder auf der Wunschliste, noch ist es schon vorhanden.`:`Nichts spricht dagegen, aber wir sehen keinen direkten Bezug zu ${esc(gen(p.name))} Interessen. Schau dir die Ideen unten an.`}</p></div>`;
    }
    const rc=recommend(p).good.filter(g=>!r.ctags.length||g.it.tags.some(t=>r.ctags.includes(t))||g.it.comp).slice(0,3);
    const sug=(rc.length?rc:recommend(p).good.slice(0,3));
    out=`${cards}${verdict}<section class="sect"><h3>${bad?'Stattdessen passt vielleicht':'Dazu passen auch'}</h3><div class="recs grid">${sug.map(RecCard).join('')}</div></section>`;
  }
  return `<form data-form="idea" class="ibar"><label for="idea" style="position:absolute;left:-9999px">Deine Geschenkidee</label><input id="idea" name="idea" class="inp" placeholder="Deine Idee, z. B. Kaffeemühle, Pfanne, Duftkerze" value="${esc(u.idea)}" autocomplete="off"><button class="btn pri" type="submit">${ic('search','sm')}Prüfen</button></form>
   <div class="chips" style="margin-bottom:6px"><span class="muted" style="font-size:13px;align-self:center">Probier:</span>${['Kaffeemühle','Pfanne','Duftkerze','Vase'].map(x=>`<button class="chip" data-act="try" data-v="${x}">${x}</button>`).join('')}</div>
   ${out}`;
}
export function RecCard(g){
  const {it,why}=g,saved=S.ui.saved[it.id];
  return `<article class="rec">${art(it.a,CATS.find(c=>c.id===it.c).t)}<div>
   <h3>${esc(it.t)}</h3>
   <p class="why">${why.slice(0,3).join(' ')}</p>
   <div class="row" style="gap:6px"><span class="chip" title="Schätzung, kein Live-Preis">Preisrahmen ca. ${money(it.p)}</span><span class="chip ${it.k==='erlebnis'?'gold':''}">${it.k==='erlebnis'?'Erlebnis':'Geschenk'}</span>${it.k==='ding'?`<a class="btn amz sm" href="${searchUrl.amazon(it.q||it.t)}" target="_blank" rel="noopener noreferrer sponsored nofollow">Bei Amazon suchen</a>`:''}<button class="chip ${saved?'on':''}" data-act="save" data-id="${it.id}" aria-pressed="${!!saved}">${saved?'Gemerkt':'Merken'}</button></div></div></article>`;
}
export function StyleBlock(p){
  const out=(p.style||[]).map(x=>{
    const c=crea(x.id);
    const items=c.items.map(cprod).filter(it=>it.p<=S.ui.budget&&!excluded(p,{kw:kwOf(it.t)})).slice(0,3);
    if(!items.length)return '';
    return `<section class="panel" style="margin-bottom:20px;display:grid;gap:10px"><div><p class="eyebrow" style="color:var(--gold)">Im Notfall</p><h3 style="font-size:26px;margin-top:4px">${esc(c.scope)} von ${esc(c.handle)}</h3>
     <p class="muted" style="font-size:14.5px;margin-top:4px">${esc(p.name)} verweist auf diesen Stil. Wenn dir nichts Konkretes einfällt, passt etwas aus der Liste.</p></div>
     <div class="recs grid">${items.map(it=>`<article class="rec">${art(it.a,it.tone)}<div><h3>${esc(it.t)}</h3><p class="quote" style="margin:4px 0 8px">„${esc(it.note)}“</p><div class="row" style="gap:6px"><span class="chip" title="Schätzung, kein Live-Preis">Preisrahmen ca. ${money(it.p)}</span><button class="chip on" data-act="cbuy" data-id="${it.id}" data-cid="${c.id}">Ansehen · Anzeige</button></div></div></article>`).join('')}</div>
     <p class="disc" style="margin:0">Anzeige: Kaufst du über diese Links, erhält ${esc(c.handle)} eine Provision. Für dich ändert sich der Preis nicht.</p></section>`;
  }).join('');
  return out;
}
export function Recs(p){
  const u=S.ui,{good,skip}=recommend(p);
  const list=good.filter(g=>(u.kind==='alle'||g.it.k===u.kind)&&g.it.p<=u.budget).slice(0,8);
  return `${StyleBlock(p)}<div class="row" style="justify-content:space-between;margin-bottom:14px">
    <div class="seg" role="group" aria-label="Art">${[['alle','Alle'],['ding','Geschenke'],['erlebnis','Erlebnisse']].map(([k,l])=>`<button class="${u.kind===k?'on':''}" data-act="kind" data-v="${k}">${l}</button>`).join('')}</div>
    <label class="range" for="bud">Preisrahmen bis <b style="color:var(--ink)" id="budv">${money(u.budget)}</b><input id="bud" type="range" min="20" max="100" step="5" value="${u.budget}"></label></div>
  <div class="recs grid">${list.map(RecCard).join('')||'<p class="muted">Nichts im Budget. Erhöhe es etwas.</p>'}</div>
  ${skip.length?`<div class="skipped"><p class="eyebrow">Bewusst ausgelassen</p>${skip.slice(0,5).map(s=>`<span>${ic('x','sm')} ${esc(s.it.t)}: ${esc(s.why)}</span>`).join('')}</div>`:''}`;
}

export function RecSection(p,openWishes){
  const few=openWishes<4;
  return `<section class="sect recsec"><details ${few?'open':''}><summary><span class="eyebrow">${few?'Noch wenig auf der Liste':'Zusätzlich'}</span><h3>Produkte, die wir auf Basis der Vorlieben empfehlen</h3></summary>
   <p class="muted" style="font-size:14.5px;margin:6px 0 16px">${few?`${esc(p.name)} hat wenig offene Wünsche. Diese Produkte passen zu Interessen, Marken und Anlass:`:`Nur falls nichts von der Wunschliste passt: Ideen aus ${esc(gen(p.name))} Profil.`}</p>
   ${Recs(p)}</details></section>`;
}
