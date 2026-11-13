import { S, W, switchTo, resetState, guestPerson, saveState } from './state.js';
import { $, toast, kwOf, nid, money, overlap } from './lib/util.js';
import { CATALOG, PRIO, cat } from './data/content.js';
import { check } from './logic.js';
import { offersFor, worldOffers, popularOffers, ownedTypeFor } from './lib/products.js';
import { guessCategory } from './lib/category.js';
import { parseAmazonInput, searchUrl, normUrl } from './lib/shops.js';
import { parsePinterest, parseInstagram, givePinConsent, revokePinConsent } from './lib/social.js';
import { sb } from './lib/supabase.js';
import { inspectLink, priceField, summary } from './lib/inspect.js';
import { hidePromo } from './views/inspiration.js';
import { track } from './lib/track.js';
import { saveGift, removeGift } from './lib/given.js';
import { readZettelRemote } from './lib/zettel.js';
import { findDupe } from './lib/dupes.js';
import { ageOf } from './lib/age.js';
import { markStep, hideSteps } from './lib/steps.js';
import { hideIdea, ideasOf, loadIdeas, skey, gkey, loadMatch } from './lib/ideas.js';
import { saveSignal, signalCount } from './lib/signals.js';
import { startCheckout, openPortal } from './lib/plan.js';
import { downscale, fetchProductImage, finalImage, imgBoxHtml, dropImage, storeImage, findAmazonLink } from './lib/wishimg.js';
import { render, route, refreshGuest } from './render.js';
import { WishRec, draftKey, concrete, altPrice } from './views/wishprev.js';
import { ZmRow } from './views/zettel.js';
import { createInvite, listInvites, revokeInvite, inviteLink, saveLocal, adoptInvite } from './lib/invite.js';
import { showScene, stopWelcome, markWelcomed } from './views/welcome.js';
import { guestRpc } from './lib/remote.js';
import { signIn, signUp, magicLink, signOut, friendly, resendSignup, resetPassword, setPassword } from './lib/auth.js';

export const MONTHS=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
export 
/* ---- Produktbild im Wunschformular ---- */
function showWishImg(wi){S.ui.wishImg=wi;const b=document.getElementById('wimg');if(b)b.innerHTML=wi&&!wi.remove?imgBoxHtml(wi):''}
/* ---- Amazon stöbern ---- */
const parsePrice=v=>{const n=parseFloat(String(v||'').replace(/\./g,'').replace(',','.'));return Number.isFinite(n)&&n>0?n:null};
function azApply(r){
  const z=S.ui.az;
  z.res=r;z.busy=false;
  if(!r.error){
    z.title=z.title||r.title||'';
    z.c=guessCategory(z.title||r.title,'wohnen');
    z.catAuto=true;
  }
  render();
}
/* Amazon-Links für Wünsche: Kurzlinks (amzn.to) werden aufgelöst, jeder Produktlink bekommt die Partner-Kennung (nur so zählt ein Kauf). */
const isAmazon=raw=>/amazon\.|amzn\.|(^|\/\/)a\.co/i.test(raw);
async function amazonRead(raw){
  const r=parseAmazonInput(raw);
  if(!r.short)return r;
  try{
    const d=await (await fetch('/api/resolve?u='+encodeURIComponent(r.shortUrl))).json();
    if(!d.url)throw new Error('x');
    const r2=parseAmazonInput(d.url);if(!r2.error&&!r2.title)r2.title=r.hint||'';return r2;
  }catch{return {error:'Diesen Kurzlink konnten wir leider nicht öffnen. Tippe in der Amazon-App auf „Teilen“ und wähle „Link kopieren“, oder öffne das Produkt im Browser und kopiere die Adresse.'}}
}
async function amazonLink(raw){
  if(!raw||!isAmazon(raw))return raw;
  const r=await amazonRead(raw);
  return r.url||normUrl(raw)||raw;
}
function azParse(text){
  const z=S.ui.az,r=parseAmazonInput(text);
  z.text=text;
  if(r.short){
    // Kurzlink: der Server verfolgt die Weiterleitung, damit niemand den Link selbst umwandeln muss
    z.res=null;z.busy=true;z.title=z.title||r.hint||'';render();
    fetch('/api/resolve?u='+encodeURIComponent(r.shortUrl)).then(x=>x.json()).then(d=>{
      if(!d.url)throw new Error('x');
      const r2=parseAmazonInput(d.url);
      if(!r2.error&&!r2.title)r2.title=r.hint||'';
      azApply(r2);
    }).catch(()=>azApply({error:'Diesen Kurzlink konnten wir leider nicht öffnen. Tippe in der Amazon-App auf „Teilen“ und wähle „Link kopieren“, oder öffne das Produkt im Browser und kopiere die Adresse.'}));
    return;
  }
  azApply(r);
}

/* Reservieren: entweder über die Datenbank (echtes Profil) oder lokal (Demo). Liefert true bei Erfolg. */
function reserveFlow(p,w){
  if(p.remote){
    return guestRpc('reserve_wish',w.id)
      .then(r=>{if(!r.ok){toast('Oh, da war jemand schneller: Dieser Wunsch ist schon reserviert.');}return refreshGuest().then(()=>!!r.ok)})
      .catch(()=>{toast('Das hat leider nicht geklappt. Magst du es bitte noch einmal versuchen?');return false});
  }
  w.res='me';return Promise.resolve(true);
}
/* Geschenk merken (nur echte Gast-Ansicht, nicht die Demo-Vorschau). Fehler bleiben still. */
function remember(p,w,patch){
  if(!p||!w||p.managed)return;
  const ref=(p.handle||p.id)+':'+w.id;
  saveGift({ref,recipient:p.name,handle:p.handle||'',wishTitle:w.t,what:w.t,occasion:'',price:w.price||null,...patch}).then(()=>render()).catch(()=>{});
}
/* KI-Varianten zu einem Wunsch ohne eigenen Link (nur echte Profile, nur für ungenaue Wünsche). */
function wishVariants(id,ctx){
  const p=ctx==='guest'?guestPerson():S.me,w=p&&p.wishes.find(x=>x.id===id);
  if(!w||w.noSuggest||!p.handle||!p.remote&&ctx==='guest'||w.link||w.kind==='erlebnis'||!/^[0-9a-f-]{36}$/i.test(String(id)))return;
  loadIdeas('wish:'+id,{h:p.handle,mode:'wish',w:id,t:w.t.slice(0,80)},()=>{if(S.ui.modal==='wishdetail'&&S.ui.pickId===id)render()});
}
/* Erkennung im Wunsch-Dialog (src/views/wishprev.js): S.ui.wr hält den Zustand, gezeichnet wird nur der Kasten #wprev,
   damit eingetippte Werte stehen bleiben. Das Namensfeld wird nur nach „Passt“ oder einem Klick auf eine Alternative überschrieben. */
const wform=()=>document.querySelector('form[data-form=wish]');
function drawRec(){const b=document.getElementById('wprev');if(b)b.innerHTML=WishRec()}
function setRec(o){S.ui.wr=o;drawRec()}
const canAi=()=>S.auth.user&&S.me.handle&&/^[a-z0-9-]{3,31}$/.test(S.me.handle);
/** Bild zum Kandidaten im Hintergrund holen; die Karte bekommt es, sobald es da ist. */
function candImage(cand,imageUrl){
  if(!S.auth.user)return;
  const seq=S.ui.wr?.seq;
  fetchProductImage(imageUrl||null,imageUrl?undefined:cand.q||cand.t).then(im=>{if(S.ui.wr?.seq!==seq)return;cand.img={blob:im.blob,preview:im.preview,src:im.src};drawRec()}).catch(()=>{});
}
function showCand(cand,t){const seq=(S.ui.wr?.seq||0)+1;S.ui.wr={st:'found',t:t||cand.t,c:wform()?.elements.c?.value,cand,seq};drawRec();return seq}
function previewWish(title){
  const f=wform();if(!f||S.ui.editWish)return;
  const t=String(title||'').trim().slice(0,120);
  if(S.ui.wr?.st==='found'&&S.ui.wr.accepted&&S.ui.wr.cand.t===t)return; // gerade übernommen
  const kind=f.querySelector('input[name=kind]:checked')?.value;
  const sel=f.elements.c;if(t.length>=3&&sel&&sel.value==='wohnen'){const g=guessCategory(t,'wohnen');if(g!==sel.value)sel.value=g}
  if(t.length<3||f.elements.nosug?.checked||kind==='erlebnis'){setRec(null);return}
  if(kind==='frei'||kind==='kategorie'||!concrete(t)||!canAi()){setRec({st:'vague',t});return}
  const seq=(S.ui.wr?.seq||0)+1;setRec({st:'loading',t,seq,c:sel?.value});
  loadMatch(S.me.handle,t).then(m=>{
    if(S.ui.wr?.seq!==seq)return;
    if(m&&m.c&&sel&&!sel.dataset.touched)sel.value=m.c;
    if(!m||!m.ok){setRec({st:'unsure',t,seq});return}
    const web=m.src==='web',cand={t:m.t,q:m.q,price:m.price,est:!web,src:web?'web':'match',host:m.host||''};showCand(cand,t);S.ui.wr.seq=seq;candImage(cand,m.img||undefined);
  }).catch(()=>{if(S.ui.wr?.seq===seq)setRec({st:'unsure',t,seq,err:true})});
}
/** Wunschzettel: Wünsche im Hintergrund abgleichen (höchstens 12, drei gleichzeitig), das Ergebnis erscheint unter der jeweiligen Zeile. */
function zettelMatch(){
  const z=S.ui.zt;if(!z||!z.items||!canAi())return;
  z.m={};const run=z.items.map((w,i)=>({w,i})).filter(x=>concrete(x.w.t)&&x.w.kind!=='erlebnis').slice(0,12);
  run.forEach(x=>{z.m[x.i]={st:'loading'}});
  const draw=i=>{const el=document.getElementById('zm'+i);if(el&&S.ui.zt===z)el.innerHTML=ZmRow(i,z.items[i])};
  run.forEach(x=>draw(x.i));
  let n=0;
  const worker=async()=>{while(n<run.length){const {w,i}=run[n++];
    try{const m=await loadMatch(S.me.handle,w.t);
      if(m&&m.ok){z.m[i]={st:'ok',cand:{t:m.t,q:m.q,price:m.price,host:m.host||'',img:m.img||null,c:m.c||null,web:m.src==='web'}}}
      else{z.m[i]={st:'none',c:m&&m.c||null}}
    }catch{z.m[i]={st:'none'}}
    draw(i)}};
  for(let k=0;k<3;k++)worker();
}
/** Nach dem Speichern: Bilder zu den genauer gemachten Wünschen im Hintergrund holen. */
function zettelImages(list){
  list.forEach(async({w,cand})=>{
    if(!w.link)findAmazonLink(cand.t).then(r=>{if(r&&!w.link){w.link=r.url;render()}}).catch(()=>{});
    try{const im=await fetchProductImage(cand.img||null,cand.img?undefined:(cand.q||cand.t));
      let url=im.preview,src=im.src||'';
      if(S.auth.user&&S.me.dbId&&im.blob){try{url=await storeImage(im.blob)}catch{return}}
      w.img=url;w.imgSrc=src;render()}catch{/* ohne Bild bleibt das Monogramm */}
  });
}
/** Nach „Passt“: direkten Amazon-Link zum Produkt suchen und, wenn das Link-Feld leer ist, eintragen (sichtbar und änderbar). */
async function attachAmazon(cand){
  const f=wform();if(!f||!f.elements.link||f.elements.link.value.trim()||!S.auth.user)return;
  const st=document.getElementById('wlstat');
  try{const r=await findAmazonLink(cand.t);
    const ff=wform();if(!r||!ff||ff.elements.link.value.trim())return;
    ff.elements.link.value=r.url;
    if(st){st.textContent='Direkter Amazon-Link gefunden und angehängt: '+r.title+'. Du kannst ihn im Feld ändern oder löschen.';st.className='hint ok'}
  }catch{/* ohne Link bleibt die Amazon-Suche */}
}
/** Übernimmt Name, Preis und Bild eines Kandidaten ins Formular (nur nach Klick). */
function applyCand(cand){
  const f=wform();if(!f)return;
  f.elements.t.value=cand.t.slice(0,160);f.elements.t.classList.remove('attn');
  if(cand.price&&f.elements.price)f.elements.price.value=String(cand.price).replace('.',',');
  if(cand.img&&!(S.ui.wishImg&&!S.ui.wishImg.remove&&S.ui.wishImg.manual))showWishImg({...cand.img});
}
const A={
 scroll(el){document.getElementById(el.dataset.t)?.scrollIntoView({behavior:'smooth',block:'start'})},
 jump(el){document.getElementById(el.dataset.to)?.scrollIntoView({behavior:'smooth',block:'start'})},
 menu(){S.ui.menu=!S.ui.menu;render()},
 menuclose(){S.ui.menu=false;render();document.querySelector('.acctbtn')?.focus({preventScroll:true})},
 menuclosebg(el,e){if(e.target===el)A.menuclose()},
 mgo(el){const v=el.dataset.v;S.ui.menu=false;S.ui.scrollTo=el.dataset.to||'';if(v==='profil'&&el.dataset.to==='vis')S.ui.scrollTo='';if(location.hash==='#'+v){render(true)}else location.hash='#'+v},
 mdo(el,e){S.ui.menu=false;const f=A[el.dataset.do];if(f)f(el,e);else render()},
 go(el){const v=el.dataset.v;if(v==='start')S.ui.step=0;location.hash='#'+v;if(location.hash==='#'+v&&S.ui.view===v)render(true)},
 pick(el){const k=el.dataset.k,v=el.dataset.v,a=S.me[k],i=a.indexOf(v);i>-1?a.splice(i,1):a.push(v);render()},
 next(){
  if(S.ui.view==='start'&&S.ui.step===1&&!S.auth.user)track('choice',{label:'profile',once:true,path:'/app/'});
  if(!S.auth.user&&S.ui.step===0&&!(S.me.name||'').trim()){toast('Magst du uns zuerst deinen Vornamen verraten?');document.getElementById('dn')?.focus();return}
  S.ui.step++;render(true)},prev(){S.ui.step--;render(true)},
 finish(){
  if(!S.auth.user){S.me.name=(S.me.name||'').trim();saveState();S.ui.step=0;location.hash='#registrieren';return}
  toast('Geschafft! Dein Wishtale ist startklar.');location.hash='#wuensche'},
 pedit(el){S.ui.editK=S.ui.editK===el.dataset.k?null:el.dataset.k;render()},
 edit(){S.ui.step=S.auth.user?1:0;location.hash='#start'},
 quick(){
  // Direkt zur Wunschliste. Ohne Konto wird zuerst eines angelegt, danach geht es mit dem ersten Wunsch weiter.
  track('choice',{label:'quick',once:true,path:'/app/'});
  if(!S.auth.user){S.me.quick=true;S.me.name=(S.me.name||'').trim();saveState();S.ui.step=0;location.hash='#registrieren';return}
  S.ui.step=0;location.hash='#wuensche';setTimeout(()=>{S.ui.modal='wish';S.ui.editWish=null;render()},50);
 },
 nudgehide(){try{localStorage.setItem('wishtale:nudge-hidden',String(Date.now()))}catch{/* nur für diese Sitzung */}S.ui.nudgeOff=true;render()},
 preview(el){S.ui.preview=el.dataset.v==='1';if(S.ui.preview)markStep('preview');render()},
 stepshide(){hideSteps(true);toast('Die Schritte sind ausgeblendet. Du findest sie unter deinem Namen oben rechts bei „Erste Schritte“.');render()},
 stepsshow(){hideSteps(false);S.ui.modal=null;location.hash='#wuensche';render(true);scrollTo({top:0,behavior:'smooth'})},
 vis(el){const k=el.dataset.k;S.me.vis[k]=(S.me.vis[k]||'alle')==='privat'?'alle':'privat';render()},
 wf(el){S.ui.wf=el.dataset.v;render()},wc(el){S.ui.wc=el.dataset.v;render()},
 selbst(el){const w=S.me.wishes.find(x=>x.id===el.dataset.id);w.status=w.status==='selbst'?'offen':'selbst';toast(w.status==='selbst'?'Dann ist dieser Wunsch erledigt. Deine Freunde sehen jetzt, dass du das schon hast.':'Der Wunsch ist wieder offen.');render()},
 prio(el){const w=S.me.wishes.find(x=>x.id===el.dataset.id);w.prio=w.prio%3+1;toast('Priorität: '+PRIO[w.prio]);render()},
 delw(el){S.ui.modal=null;const old=S.me.wishes.find(x=>x.id===el.dataset.id);if(old&&old.img)dropImage(old.img);S.me.wishes=S.me.wishes.filter(x=>x.id!==el.dataset.id);render()},
 modal(el){if(el.dataset.v==='wish'){S.ui.editWish=null;S.ui.wishImg=null;S.ui.wr=null}if(el.dataset.v==='zettel')S.ui.zt=null;S.ui.modal=el.dataset.v;render();setTimeout(()=>document.querySelector('.sheet input,.sheet select')?.focus({preventScroll:true}),30)},
 close(){if(S.ui.modal==='welcome'){markWelcomed();stopWelcome()}S.ui.modal=null;S.ui.editWish=null;render()},
 wtab(el){showScene(+el.dataset.i,true)},
 inviteopen(){S.ui.invm={list:[],link:'',error:'',busy:false};S.ui.modal='invite';render();listInvites().then(l=>{if(S.ui.invm)S.ui.invm.list=l;if(S.ui.modal==='invite')render()}).catch(()=>{})},
 invitenew(){if(S.ui.invm){S.ui.invm.link='';S.ui.invm.error=''}render()},
 invitecopy(){
  const url=S.ui.invm&&S.ui.invm.link;if(!url)return;
  const done=()=>toast('Der Link ist kopiert. Schick ihn der Person, für die du das Wishtale vorbereitet hast.');
  if(navigator.share){navigator.share({title:'Ich habe ein Wishtale für dich vorbereitet',url}).catch(()=>{})}
  else if(navigator.clipboard?.writeText){navigator.clipboard.writeText(url).then(done,()=>toast(url))}
  else toast(url);
 },
 inviterevoke(el){revokeInvite(el.dataset.id).then(()=>{if(S.ui.invm)S.ui.invm.list=S.ui.invm.list.filter(i=>i.id!==el.dataset.id);toast('Die Einladung ist zurückgezogen.');render()}).catch(()=>toast('Das hat nicht geklappt.'))},
 invitelogin(){const v=S.ui.inv;if(v&&v.data)saveLocal({code:v.code,name:'',keep:(v.data.tips||[]).map(()=>true)})},
 welcomeskip(el,e){if(el.dataset.bg&&e&&e.target!==el)return;A.close()},
 welcomego(){markWelcomed();stopWelcome();S.ui.editWish=null;S.ui.wishImg=null;S.ui.wr=null;S.ui.modal='wish';render();setTimeout(()=>document.querySelector('.sheet input,.sheet select')?.focus({preventScroll:true}),30)},
 welcomeimport(){markWelcomed();stopWelcome();S.ui.zt=null;S.ui.modal='zettel';render()},
 wedit(el){S.ui.editWish=el.dataset.id;S.ui.wishImg=null;S.ui.modal='wish';render();setTimeout(()=>document.getElementById('wt')?.focus({preventScroll:true}),30)},
 resend(){
  const em=S.ui.authSent?.email;if(!em)return;S.ui.authBusy=true;render();
  resendSignup(em).then(({error})=>{S.ui.authBusy=false;S.ui.authResent=error?friendly(error):'Die Mail ist unterwegs. Das kann einen Moment dauern.';render()}).catch(()=>{S.ui.authBusy=false;S.ui.authResent='Das hat nicht geklappt. Bitte versuche es gleich noch einmal.';render()});
 },
 forgot(){S.ui.authMsg=null;S.ui.authSent=null;location.hash='#passwort-vergessen'},
 newpw(){S.ui.modal=null;location.hash='#neues-passwort'},
 authback(){S.ui.authSent=null;S.ui.authResent=null;S.ui.authMsg=null;render()},
 authtab(el){S.ui.authSent=null;S.ui.authMsg=null;location.hash=el.dataset.v==='up'?'#registrieren':'#anmelden'},
 demo(){S.ui.authMsg=null;track('demo',{once:true,path:'/app/'});location.hash='#demo'},
 tologin(){S.ui.modal=null;S.ui.authMsg=null;location.hash='#start'},
 exitdemo(){S.ui.modal=null;S.ui.authMsg=null;location.hash='#start'},
 logout(){signOut().finally(()=>{location.hash='';location.reload()})},
 guestretry(){S.guest=null;route()},
share(){
  markStep('share');
  const url=`${location.origin}${location.pathname}#p/${S.me.handle||S.ui.acct}`;
  const done=()=>toast('Dein Link ist kopiert und bereit zum Verschicken. (In der Demo öffnet er dein Profil nur in diesem Browser.)');
  if(navigator.share){navigator.share({title:`${S.me.name} bei Wishtale`,url}).catch(()=>{})}
  else if(navigator.clipboard?.writeText){navigator.clipboard.writeText(url).then(done,()=>toast(url))}
  else toast(url);
 },
 azopen(){
  /* Steht im Wunschformular schon ein Name, suchen wir damit direkt bei Amazon und tragen ihn im Fenster ein. */
  const q=(document.querySelector('form[data-form=wish] [name=t]')?.value||'').trim().slice(0,120);
  S.ui.az={q,text:'',res:null,title:'',price:'',c:'wohnen',searched:!!q};S.ui.modal='amazon';
  if(q)window.open(searchUrl.amazon(q),'_blank','noopener');
render();setTimeout(()=>$('#azq')?.focus({preventScroll:true}),30)},
 azq(el){S.ui.az.q=el.dataset.v;render()},
 azclip(){
  if(!navigator.clipboard?.readText){toast('Dein Browser lässt das Einfügen per Knopf leider nicht zu. Füge den Link bitte mit Strg+V (am Handy mit langem Tippen) in das Feld ein.');return}
  navigator.clipboard.readText().then(azParse).catch(()=>toast('Wir kommen gerade nicht an deine Zwischenablage. Füge den Link bitte mit Strg+V in das Feld ein.'));
 },
 reset(){if(confirm('Alle Änderungen verwerfen und die Beispieldaten wiederherstellen?'))resetState()},
 closebg(el,e){if(e.target===el)A.close()},
 liked(el){const g=S.me.history.find(x=>x.id===el.dataset.id),o=['ja','teils','nein'];g.liked=o[(o.indexOf(g.liked)+1)%3];render()},
 have(el){const g=S.me.history.find(x=>x.id===el.dataset.id);g.have=!g.have;render()},
 again(el){const g=S.me.history.find(x=>x.id===el.dataset.id);g.again=!g.again;render()},
 fb(el){
  const g=S.me.inbox.find(x=>x.id===el.dataset.id),v=el.dataset.v;
  if(v==='swap'){S.ui.swap=g.id;S.ui.swapSel=S.me.alts.slice(0,2);render();return}
  const map={love:['ja',true,true,'Wie schön, das freut uns! Wir merken uns, was dir gefällt.'],happy:['ja',true,true,'Danke dir! Das fließt in künftige Vorschläge ein.'],meh:['teils',true,false,'Notiert. Das siehst nur du.'],have:['teils',true,false,'Verstanden. Ähnliches schlagen wir künftig nicht mehr vor.']};
  const [l,h,a,msg]=map[v];
  S.me.inbox=S.me.inbox.filter(x=>x.id!==g.id);
  S.me.history.unshift({id:g.id,what:g.what,from:g.from,when:'November 2026',liked:l,have:h,again:a,a:g.a,tone:g.tone,kw:g.kw});
  toast(msg);render();
 },
 swapsel(el){const v=el.dataset.v,a=S.ui.swapSel,i=a.indexOf(v);i>-1?a.splice(i,1):a.push(v);render()},
 swapcancel(){S.ui.swap=null;render()},
 swapsend(el){
  const g=S.me.inbox.find(x=>x.id===el.dataset.id);
  S.me.inbox=S.me.inbox.filter(x=>x.id!==g.id);
  S.me.history.unshift({id:g.id,what:g.what,from:g.from,when:'November 2026',liked:'teils',have:false,again:false,a:g.a,tone:g.tone,kw:g.kw});
  S.ui.swap=null;toast(`Das ist eine Vorschau: ${g.from} würde jetzt eine freundliche Nachricht bekommen, ganz ohne Bewertung.`);render();
 },
 reserve(el){
  const p=guestPerson(),w=p&&p.wishes.find(x=>x.id===el.dataset.id);if(!w)return;
  reserveFlow(p,w).then(ok=>{if(ok)remember(p,w,{status:'reserved'});if(ok)toast(`Erledigt, der Wunsch ist für dich reserviert. ${p.name} erfährt davon nichts und andere Freunde sehen nur „reserviert“.`);render()});
 },
 choose(el){
  const p=guestPerson(),w=p&&p.wishes.find(x=>x.id===el.dataset.wid);if(!w)return;
  const o=offersFor(p,w),pick=[o.main,...o.alts].filter(Boolean).find(x=>String(x.id)===el.dataset.pid);
  reserveFlow(p,w).then(ok=>{
   if(ok&&pick){S.ui.chosen[w.id]={t:pick.t,url:pick.url,price:pick.price||null};remember(p,w,{status:'reserved',what:pick.t,url:pick.url||'',price:pick.price||w.price||null});toast(`Reserviert: ${pick.t}. Du kannst ihn jederzeit hier wiederfinden.`)}
   render();
  });
 },
 release(el){
  const p=guestPerson(),w=p&&p.wishes.find(x=>x.id===el.dataset.id);if(!w)return;
  delete S.ui.chosen[w.id];
  const gg=S.given.find(x=>x.ref===(p.handle||p.id)+':'+w.id&&x.status==='reserved');if(gg)removeGift(gg.id);
  if(p.remote){guestRpc('release_wish',w.id).then(refreshGuest).catch(()=>toast('Das hat nicht geklappt.'));return}
  w.res=null;render();
 },
 bought(el){
  const p=guestPerson(),w=p&&p.wishes.find(x=>x.id===el.dataset.id);if(!w)return;
  const done=()=>{toast('Prima, als gekauft markiert. Die Überraschung bleibt natürlich bestehen.')};
  if(p.remote){guestRpc('mark_bought',w.id).then(()=>{remember(p,w,{status:'bought'});done();return refreshGuest()}).catch(()=>toast('Das hat nicht geklappt.'));return}
  w.bought=true;remember(p,w,{status:'bought'});done();render();
 },
 world(el){S.ui.worldId=el.dataset.id;S.ui.worldCtx=el.dataset.ctx||'guest';S.ui.modal='world';render();setTimeout(()=>document.querySelector('.sheet [data-act=close]')?.focus({preventScroll:true}),30)},
 ownedel(el){const old=S.me.wishes.find(x=>x.id===el.dataset.id);if(old&&old.img)dropImage(old.img);S.me.wishes=S.me.wishes.filter(x=>x.id!==el.dataset.id);render()},
 pins(el){S.ui.pinsCtx=el.dataset.ctx||'guest';S.ui.modal='pins';render()},
 pinconsent(){givePinConsent();render()},
async readlink(){
  const f=wform();if(!f)return;
  const raw=f.elements.link.value.trim(),st=document.getElementById('wlstat'),say=t=>{if(st){st.textContent=t;st.className='hint'}};
  const typed=f.elements.t.value.trim();
  if(!raw){say('Füge zuerst einen Link oder einen kopierten Titel ein.');return}
  if(!/https?:\/\//i.test(raw)&&/\s/.test(raw)){ // kein Link, sondern Text (zum Beispiel der kopierte Amazon-Titel)
    say('Wir lesen den Titel …');setRec({st:'loading',t:typed,seq:(S.ui.wr?.seq||0)+1});
    try{
      const r=await readZettelRemote({text:raw}),w=(r.wishes||[])[0];
      if(!w){setRec({st:'none',msg:'Aus dem Text konnten wir kein Produkt herauslesen. Dein Wunsch bleibt so, wie du ihn eingetragen hast.'});say('Füge den Titel einer Produktseite ein, zum Beispiel von Amazon.');return}
      f.elements.link.value='';
      const cand={t:w.t,q:w.t,price:w.price?Math.round(w.price*100)/100:null,est:false,src:'text'};showCand(cand,typed);candImage(cand);
      say((r.wishes||[]).length>1?'Der Text enthält mehrere Produkte, für ganze Listen nutze „Liste einlesen“.':'Titel gelesen. Prüfe die Karte oben und tippe auf „Passt“, wenn es stimmt.');
    }catch(e){setRec({st:'none',msg:''});say(e.message||'Das hat nicht geklappt.')}
    return;
  }
  if(isAmazon(raw)){
    say('Wir übernehmen den Amazon-Link …');
    const r=await amazonRead(raw);
    if(r.error){say(r.error);return}
    f.elements.link.value=r.url;
    if(r.title){const cand={t:r.title,q:r.title,price:null,src:'amazon'};showCand(cand,typed);candImage(cand);say('Der Link ist gespeichert. Den Namen haben wir aus der Adresse gelesen, einen Preis gibt Amazon nicht heraus.')}
    else{setRec({st:'none',msg:''});say(typed?'Der Amazon-Link ist gespeichert und gehört zu deinem Wunsch.':'Der Amazon-Link ist gespeichert. Trag oben noch kurz ein, was es ist, mehr ist nicht nötig.')}
    return;
  }
  say('Wir lesen den Link …');setRec({st:'loading',t:typed,seq:(S.ui.wr?.seq||0)+1});
  try{
    const p=await inspectLink(raw);
    const pf=priceField(p),cand={t:p.title.slice(0,160),q:p.title,price:pf?+pf.replace(',','.'):null,est:false,src:'link',size:p.size};
    showCand(cand,typed);if(p.imageUrl)candImage(cand,p.imageUrl);
    if(p.size&&f.elements.note&&!/gr(ö|oe)ße:/i.test(f.elements.note.value))f.elements.note.value=(f.elements.note.value.trim()?f.elements.note.value.trim()+'\n':'')+`Größe: ${p.size}`;
    say(`Link gelesen: ${summary(p)}. Der Preis kann sich ändern.${p.price&&p.currency&&p.currency!=='EUR'?' Der Preis steht nicht in Euro, bitte passe ihn an.':''}`);
  }catch(e){setRec({st:'none',msg:''});say(e.message||'Diese Seite konnten wir nicht lesen. Dein Wunsch und der Link bleiben trotzdem gespeichert.')}
 },
 wraccept(){const r=S.ui.wr;if(!r||!r.cand)return;applyCand(r.cand);r.accepted=true;drawRec();if(r.cand.src!=='link')attachAmazon(r.cand)},
 wrreject(){
  const r=S.ui.wr,f=wform();if(!r||!f)return;
  const t=(f.elements.t.value.trim()||r.t||r.cand?.t||'').slice(0,120);
  setRec({st:'alts',t,seq:(r.seq||0)+1,chosen:null});
  if(canAi())loadIdeas(draftKey(t),{h:S.me.handle,mode:'wish',t},()=>{if(S.ui.wr?.st==='alts')drawRec()});
  else setRec({st:'alts',t,chosen:null});
 },
 wrpick(el){
  const r=S.ui.wr;if(!r)return;const i=+el.dataset.i,it=ideasOf(draftKey(r.t))[i];if(!it)return;
  const cand={t:it.t,q:it.q,price:altPrice(it),est:true,src:'alt'};r.chosen=i;applyCand(cand);drawRec();attachAmazon(cand);
  const seq=r.seq;fetchProductImage(null,it.q||it.t).then(im=>{if(S.ui.wr?.seq===seq&&S.ui.wr.chosen===i)showWishImg({blob:im.blob,preview:im.preview,src:im.src})}).catch(()=>{});
 },
 wimgdel(){const f=document.querySelector('form[data-form=wish]');if(f&&f.elements.img)f.elements.img.value='';showWishImg({remove:true})},
 ihave(el){
  const t=ownedTypeFor(el.dataset.id);if(!t)return;
  if(!S.me.wishes.some(w=>w.status==='selbst'&&w.t.toLowerCase()===t.label.toLowerCase()))S.me.wishes.unshift(W({t:t.label,c:t.c,kind:'produkt',prio:1,status:'selbst',vis:'alle',a:t.a,tone:t.tone,kw:t.kw}));
  toast(`Notiert: ${t.label} hast du schon. Solche Vorschläge blenden wir aus. Unter „Das habe ich schon“ im Profil kannst du es wieder entfernen.`);render();
 },
 aichoose(el){
  const p=guestPerson(),w=p&&p.wishes.find(x=>x.id===el.dataset.wid);if(!w)return;
  const i=ideasOf('wish:'+w.id).find(x=>x.t===el.dataset.t);if(!i)return;
  const url=searchUrl.amazon(i.q);
  reserveFlow(p,w).then(ok=>{
   if(ok){S.ui.chosen[w.id]={t:i.t,url,price:i.to||null};remember(p,w,{status:'reserved',what:i.t,url,price:i.to||w.price||null});toast(`Reserviert: ${i.t}. Du kannst es jederzeit hier wiederfinden.`)}
   render();
  });
 },
 buy(el){
  if(!S.plan||S.plan.busy)return;
  S.plan.busy=true;S.plan.error='';render();
  startCheckout(el.dataset.code).then(r=>{location.href=r.url}).catch(e=>{S.plan.busy=false;S.plan.error=e.message;render()});
 },
 portal(){
  openPortal().then(r=>{location.href=r.url}).catch(e=>{S.plan.error=e.message;render()});
 },
 ideano(el){hideIdea(el.dataset.t);if(el.dataset.self)saveSignal('no',el.dataset.t);track('choice',{label:'idea_no',path:'/app/'});render()},
 wnosug(el){ // Vorschläge für einen Wunsch aus- oder wieder einschalten
  const w=S.me.wishes.find(x=>x.id===el.dataset.id);if(!w)return;
  w.noSuggest=!w.noSuggest;toast(w.noSuggest?'Für diesen Wunsch zeigt Wishtale keine Vorschläge mehr.':'Wishtale darf für diesen Wunsch wieder Vorschläge zeigen.');
  if(!w.noSuggest)wishVariants(w.id,'own');render();
 },
 async wamz(el){ // direkten Amazon-Produktlink zu einem bestehenden Wunsch suchen (Partner-Kennung inklusive), rückgängig machbar
  const w=S.me.wishes.find(x=>x.id===el.dataset.id);if(!w||w.link)return;
  S.ui.amzBusy=w.id;render();
  try{const r=await findAmazonLink(w.t);S.ui.amzBusy=null;
   if(r&&!w.link){w.link=r.url;toast('Direkter Amazon-Link gefunden: '+r.title,{label:'Rückgängig',run:()=>{w.link='';render()}})}
   else toast('Dazu haben wir bei Amazon keinen sicheren Treffer gefunden. Die Amazon-Suche mit deiner Partner-Kennung bleibt.');
  }catch{S.ui.amzBusy=null;toast('Die Suche hat gerade nicht geklappt.')}
  render();
 },
 aiuse(el){ // Vorschlag zum Wunsch übernehmen: der ungenaue Wunsch wird zu diesem Produkt (Name, Preis, direkter Amazon-Link, Bild), rückgängig machbar
  const w=S.me.wishes.find(x=>x.id===el.dataset.wid),i=ideasOf('wish:'+el.dataset.wid).find(x=>x.t===el.dataset.t);if(!w||!i)return;
  const old={t:w.t,price:w.price,link:w.link,img:w.img,imgSrc:w.imgSrc,kw:w.kw,a:w.a,tone:w.tone,c:w.c};
  w.t=i.t.slice(0,160);w.kw=kwOf(w.t);if(altPrice(i))w.price=altPrice(i);
  const c=guessCategory(w.t,w.c||'wohnen');if(c!==w.c){w.c=c;w.a=cat(c).a;w.tone=cat(c).t}
  S.ui.modal=null;
  toast('Übernommen: Dein Wunsch ist jetzt „'+w.t+'“.',{label:'Rückgängig',run:()=>{Object.assign(w,old);render()}});render();
  // Direktlink und Bild im Hintergrund nachladen, nur wenn die Person den Wunsch inzwischen nicht zurückgesetzt hat
  const still=()=>w.t===i.t.slice(0,160);
  if(S.auth.user&&!w.link)findAmazonLink(i.t).then(r=>{if(r&&still()&&!w.link){w.link=r.url;render()}}).catch(()=>{});
  if(S.auth.user)fetchProductImage(null,i.q||i.t).then(async im=>{if(!still())return;let url=im.preview;if(S.me.dbId&&im.blob){try{url=await storeImage(im.blob)}catch{return}}w.img=url;w.imgSrc=im.src||'';render()}).catch(()=>{});
 },
 aivhave(el){ // „Habe ich schon“ bei einem Vorschlag zu einem Wunsch: als vorhanden notieren, nie wieder vorschlagen
  const i=ideasOf('wish:'+el.dataset.wid).find(x=>x.t===el.dataset.t);if(!i)return;
  const c=guessCategory(i.t,'wohnen');
  if(!S.me.wishes.some(w=>w.status==='selbst'&&w.t.toLowerCase()===i.t.toLowerCase()))S.me.wishes.unshift(W({t:i.t,c,kind:'produkt',prio:1,status:'selbst',vis:'alle',a:cat(c).a,tone:cat(c).t,kw:kwOf(i.t)}));
  saveSignal('have',i.t);hideIdea(i.t);toast('Notiert, das ist schon vorhanden. Solche Vorschläge zeigen wir nicht mehr.');render();
 },
 aihave(el){
  const i=[...ideasOf(skey(S.me.handle||'')),...ideasOf(gkey(S.me.handle||''))].find(x=>x.t===el.dataset.t);if(!i)return;
  const c=guessCategory(i.t,'wohnen');
  if(!S.me.wishes.some(w=>w.status==='selbst'&&w.t.toLowerCase()===i.t.toLowerCase()))S.me.wishes.unshift(W({t:i.t,c,kind:'produkt',prio:1,status:'selbst',vis:'alle',a:cat(c).a,tone:cat(c).t,kw:kwOf(i.t)}));
  saveSignal('have',i.t);hideIdea(i.t);toast('Notiert, das hast du schon. Solche Ideen zeigen wir dir nicht mehr.');render();
 },
 aiadd(el){
  const i=[...ideasOf(skey(S.me.handle||'')),...ideasOf(gkey(S.me.handle||''))].find(x=>x.t===el.dataset.t);if(!i)return;
  const c=guessCategory(i.t,'wohnen');
  S.me.wishes.unshift(W({t:i.t,c,kind:i.exp?'erlebnis':'produkt',prio:2,price:i.to||null,a:i.exp?'ticket':cat(c).a,tone:cat(c).t,kw:kwOf(i.t)}));
  saveSignal('yes',i.t);hideIdea(i.t);toast('Schön, das steht jetzt auf deiner Wunschliste.');render();
 },
 givenreact(el){
  const g=S.given.find(x=>x.id===el.dataset.id);if(!g)return;
  const o=['','ja','teils','nein'];saveGift({id:g.id,reaction:o[(o.indexOf(g.reaction||'')+1)%4]||null}).then(()=>render());
 },
 givendel(el){if(confirm('Dieses Geschenk aus deiner Liste entfernen?'))removeGift(el.dataset.id).then(()=>render())},
 promohide(el){hidePromo(el.dataset.id);render()},
 pinrevoke(){revokePinConsent();location.reload()},
 delacct(){
  if(!confirm('Möchtest du dein Konto mit allen Wünschen und Einträgen wirklich löschen? Das lässt sich nicht rückgängig machen.'))return;
  sb.auth.getSession().then(({data:{session}})=>fetch('/api/account?op=delete',{method:'POST',headers:{authorization:'Bearer '+(session?session.access_token:'')}})).then(r=>({data:r.ok,error:r.ok?null:true})).catch(()=>({data:false,error:true})).then(({data,error})=>{
   if(error||!data){toast('Das hat leider nicht geklappt. Bitte versuche es noch einmal oder schreib uns.');return}
   try{Object.keys(localStorage).filter(k=>k.startsWith('wishtale:')||k.startsWith('sb-')).forEach(k=>localStorage.removeItem(k))}catch{/* ignorieren */}
   sb.auth.signOut().catch(()=>{}).finally(()=>{location.hash='#anmelden';location.reload()});
  });
 },
 aside(){S.ui.asideOpen=!S.ui.asideOpen;render()},
 focusabout(el,e){e?.preventDefault();const t=document.getElementById('about');if(t){t.scrollIntoView({block:'center',behavior:'smooth'});t.focus({preventScroll:true})}},
 about(el){S.ui.aboutCtx=el.dataset.ctx||'guest';S.ui.modal='about';render();setTimeout(()=>document.querySelector('.ab-x')?.focus({preventScroll:true}),30)},
 wopen(el){S.ui.pickId=el.dataset.id;wishVariants(el.dataset.id,el.dataset.ctx||'guest');S.ui.wishCtx=el.dataset.ctx||'guest';S.ui.modal='wishdetail';render();setTimeout(()=>document.querySelector('.sheet [data-act=close]')?.focus({preventScroll:true}),30)},
 try(el){const p=guestPerson();S.ui.idea=el.dataset.v;S.ui.ideaRes=check(p,el.dataset.v);render()},
 oadd(el){
  const o=[...worldOffers(S.me,el.dataset.cid,12),...popularOffers(12)].find(x=>String(x.id)===el.dataset.id);if(!o)return;
  S.me.wishes.unshift(W({t:o.t,c:el.dataset.cid,kind:o.exp?'erlebnis':'produkt',prio:2,link:o.exp?'':o.url,price:o.price||null,a:o.a||cat(el.dataset.cid).a,tone:o.tone||0,kw:kwOf(o.t)}));
  toast('Schön, das steht jetzt auf deiner Wunschliste.');render();
 },
 save(el){const id=el.dataset.id;S.ui.saved[id]=!S.ui.saved[id];render()},
 kind(el){S.ui.kind=el.dataset.v;render()},
 acct(el){switchTo(el.dataset.id);render(true)},
 invite(){const m=S.me,n=['Onkel Tom','Patentante Sarah','Opa Heinz'].find(x=>!m.invited.includes(x));if(n){m.invited.push(n);toast('Simuliert: Einladung an '+n+' erstellt. Nur Eingeladene sehen das Profil.')}else toast('Alle Beispiel-Einladungen sind vergeben.');render()},
 pb(el){
  S.ui.pb=+el.dataset.v||0;
  const h=S.ui.view==='gast'?S.ui.person:S.me.handle;
  if(S.ui.view==='gast')loadIdeas(gkey(h),{h},()=>{if(S.ui.view==='gast'&&!S.ui.modal)render()});
  else if(S.auth.user&&h){loadIdeas(skey(h),{h,mode:'self',n:signalCount()},()=>{if(S.ui.view==='entdecken'&&!S.ui.modal)render()});loadIdeas(gkey(h),{h},()=>{if(['wuensche','profil'].includes(S.ui.view)&&!S.ui.modal)render()})}
  render();
 },
 occ(el){S.ui.occ=el.dataset.v;S.ui.budget=el.dataset.v==='danke'?40:100;render()},
 onlyopen(el){S.ui.onlyOpen=el.dataset.v==='1';render()},
 wview(el){S.ui.wview=el.dataset.v;render()},
 suggest(el){S.ui.pickId=el.dataset.id;S.ui.wishCtx='guest';S.ui.modal='wishdetail';render()}
};
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;if(t.dataset.step==='people')markStep('people');const f=A[t.dataset.act];if(f)f(t,e)});
document.addEventListener('change',async e=>{
  if(e.target.name!=='img'||!e.target.closest('form[data-form=wish]')||!e.target.files||!e.target.files[0])return;
  try{const d=await downscale(e.target.files[0]);showWishImg({blob:d.blob,preview:d.preview,src:'',manual:true})}catch(err){toast(err.message||'Dieses Bild lässt sich nicht öffnen.')}
});
document.addEventListener('change',e=>{if(e.target.name==='t'&&e.target.closest?.('form[data-form=wish]')&&!S.ui.editWish&&!e.target.dataset.skip){const v=e.target.value.trim().slice(0,120);if(S.ui.wr&&S.ui.wr.t===v&&S.ui.wr.st)return;previewWish(e.target.value)}}); // beim Verlassen des Feldes (zum Beispiel Klick auf „Passt“) nicht noch einmal suchen
// Die Erkennung startet schon beim Tippen und Einfügen (nach kurzer Pause), nicht erst beim Verlassen des Feldes.
document.addEventListener('toggle',e=>{if(e.target.classList?.contains('fsteps'))S.ui.stepsOpen=e.target.open},true);
let recT;
// Ein Link im Namensfeld wandert von selbst ins Link-Feld und wird gelesen, ein Feld reicht für alles.
document.addEventListener('input',e=>{const t=e.target;if(t.name!=='t'||!t.closest?.('form[data-form=wish]')||S.ui.editWish)return;const v=t.value.trim();if(/^https?:\/\/\S+$/i.test(v)){const f=wform();if(f&&f.elements.link&&!f.elements.link.value.trim()){f.elements.link.value=v;t.value='';t.dataset.moved='1';clearTimeout(recT);A.readlink()}}});
document.addEventListener('input',e=>{if(e.target.name!=='t'||!e.target.closest?.('form[data-form=wish]')||S.ui.editWish)return;if(e.target.dataset.moved){delete e.target.dataset.moved;return}clearTimeout(recT);const v=e.target.value;recT=setTimeout(()=>{if(wform()?.elements.t===e.target&&e.target.value===v&&v.trim()!==S.ui.wr?.t)previewWish(v)},e.inputType==='insertFromPaste'?150:800)});
document.addEventListener('input',e=>{if(e.target.name==='t'&&e.target.classList?.contains('attn'))e.target.classList.remove('attn')});
document.addEventListener('input',e=>{if(e.target.id==='bud'){S.ui.budget=+e.target.value;$('#budv').textContent=money(S.ui.budget)}});
document.addEventListener('change',e=>{const sf=e.target.closest?.('form[data-form=social]');if(sf)sf.requestSubmit()});
document.addEventListener('change',e=>{if(e.target.id==='wc2')e.target.dataset.touched='1'});
document.addEventListener('change',e=>{if(e.target.dataset?.prio){const w=S.me.wishes.find(x=>x.id===e.target.dataset.prio);if(w){w.prio=+e.target.value;toast('Wichtigkeit: '+PRIO[w.prio]);render()}}});
document.addEventListener('change',e=>{if(e.target.dataset?.sort){S.ui.wsort=e.target.value;render()}if(e.target.dataset?.wc){S.ui.wc=e.target.value;render()}});
document.addEventListener('change',e=>{if(e.target.id==='bud'){S.ui.budget=+e.target.value;render()}});
document.addEventListener('input',e=>{const f=e.target.dataset?.az;if(f&&S.ui.az)S.ui.az[f]=e.target.value});
document.addEventListener('change',e=>{
  const f=e.target.dataset?.az;if(f&&S.ui.az)S.ui.az[f]=e.target.value;
  if(f==='c'&&S.ui.az)S.ui.az.catAuto=false;
  if(f==='title'&&S.ui.az?.catAuto){S.ui.az.c=guessCategory(e.target.value,S.ui.az.c);const s=document.getElementById('azc');if(s)s.value=S.ui.az.c}
  if(f==='text'&&S.ui.az&&e.target.value.trim())azParse(e.target.value);
  // Neuer Wunsch: Kategorie passend zum Titel vorschlagen, solange noch nichts anderes gewählt wurde
  if(e.target.id==='wt'){const s=document.getElementById('wc2');if(s&&!s.dataset.touched)s.value=guessCategory(e.target.value,s.value)}
  if(e.target.id==='wc2')e.target.dataset.touched='1';
  if(e.target.id==='wl'&&e.target.value.trim())A.readlink(null,true);
});
document.addEventListener('paste',e=>{if(e.target.id==='wl'){setTimeout(()=>A.readlink(null,true),0);return}if(e.target.dataset?.az==='text'){const el=e.target;setTimeout(()=>{if(el.value.trim())azParse(el.value)},0)}});
document.addEventListener('paste',e=>{
  if(e.target.id!=='azurl')return;
  e.preventDefault();azParse(e.clipboardData.getData('text'));
});
/* Zurück aus dem Amazon-Tab: Link aus der Zwischenablage automatisch übernehmen, falls erlaubt. */
window.addEventListener('focus',()=>{
  const z=S.ui.az;
  if(S.ui.modal!=='amazon'||!z?.searched||(z.res&&!z.res.error)||!navigator.clipboard?.readText)return;
  navigator.clipboard.readText().then(t=>{if(/amazon\.de\//i.test(t))azParse(t)}).catch(()=>{});
});
document.addEventListener('input',e=>{const f=e.target.dataset?.prof;if(f){S.me[f]=e.target.value;if(f==='birthdate'){const ag=ageOf(e.target.value);if(ag!=null)S.me.age=ag}saveState()}});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('[role=button][data-act]')){e.preventDefault();e.target.click()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(S.ui.menu)A.menuclose();else if(S.ui.modal)A.close()}});
document.addEventListener('submit',e=>{
  const f=e.target.closest('form[data-form]');if(!f)return;e.preventDefault();
  const fd=new FormData(f),kind=f.dataset.form;
  if(kind==='forgot'){
    const email=(fd.get('email')||'').trim();S.ui.authBusy=true;S.ui.authEmail=email;render();
    resetPassword(email).then(({error})=>{S.ui.authBusy=false;if(error){S.ui.authMsg={type:'error',text:friendly(error)}}else S.ui.authSent={kind:'reset',email};render()}).catch(e=>{S.ui.authBusy=false;S.ui.authMsg={type:'error',text:friendly(e)};render()});
    return;
  }
  if(kind==='newpw'){
    const pw=fd.get('password')||'',pw2=fd.get('password2')||'';
    if(pw!==pw2){S.ui.authMsg={type:'error',text:'Die beiden Passwörter sind nicht gleich.'};render();return}
    S.ui.authBusy=true;S.ui.authMsg=null;render();
    setPassword(pw).then(({error})=>{S.ui.authBusy=false;if(error){S.ui.authMsg={type:'error',text:friendly(error)};render();return}
      toast('Dein neues Passwort ist gespeichert.');location.hash='#wuensche'}).catch(e=>{S.ui.authBusy=false;S.ui.authMsg={type:'error',text:friendly(e)};render()});
    return;
  }
  if(kind==='signin'||kind==='signup'||kind==='magic'){
    const email=(fd.get('email')||'').trim(),pw=fd.get('password')||'';
    if(kind==='signup')track('signup_submit',{path:'/app/'});
    S.ui.authBusy=true;S.ui.authMsg=null;S.ui.authEmail=email;render();
    const job=kind==='signin'?signIn(email,pw):kind==='signup'?signUp((fd.get('name')||'').trim(),email,pw):magicLink(email);
    job.then(({data,error})=>{
      S.ui.authBusy=false;
      if(error){S.ui.authMsg={type:'error',text:friendly(error)};render();return}
      // Schon registrierte Adresse: Supabase meldet keinen Fehler, schickt aber auch keine Mail
      if(kind==='signup'&&data&&data.user&&data.user.identities&&data.user.identities.length===0){S.ui.authMsg={type:'error',text:friendly({message:'already registered'})};render();return}
      if(kind==='signup'&&!data.session)S.ui.authSent={kind:'signup',email};
      else if(kind==='magic')S.ui.authSent={kind:'magic',email};
      render();
    }).catch(e=>{S.ui.authBusy=false;S.ui.authMsg={type:'error',text:friendly(e)};render()});
    return;
  }
  if(kind==='invitemake'){
    const z=S.ui.invm||(S.ui.invm={list:[]});z.error='';z.busy=true;render();
    createInvite((fd.get('name')||'').trim(),[fd.get('tip1'),fd.get('tip2')].map(x=>(x||'').trim()).filter(Boolean))
      .then(t=>{z.busy=false;z.link=inviteLink(t);return listInvites().then(l=>{z.list=l}).catch(()=>{})})
      .catch(e=>{z.busy=false;z.error=e.message||'Das hat nicht geklappt.'}).finally(()=>{if(S.ui.modal==='invite')render()});
    return;
  }
  if(kind==='inviteaccept'){
    const v=S.ui.inv;if(!v||!v.data)return;
    const picked=fd.getAll('tip'),keep=(v.data.tips||[]).map((_,i)=>picked.includes(String(i)));
    const name=(fd.get('name')||'').trim().slice(0,40);
    v.name=name;v.keep=keep;saveLocal({code:v.code,name,keep});
    if(S.auth.user){adoptInvite().then(r=>{toast(r&&r.n?`Die Tipps von ${r.from} stehen jetzt auf deiner Wunschliste.`:'Die Einladung ist eingelöst.');location.hash='#wuensche';render(true)});return}
    location.hash='#registrieren';return;
  }
  if(kind==='draftname'){A.next();return}
  if(kind==='social'){
    const raw=String(fd.get('pinterest')||'').trim();
    if(/(^|\/\/)pin\.it\//i.test(raw)){ // Kurzlink aus der Pinterest-App: der Server verfolgt die Weiterleitung
      toast('Wir öffnen den Pinterest-Kurzlink …');
      fetch('/api/resolve?k=pin&u='+encodeURIComponent(/^https?:/i.test(raw)?raw:'https://'+raw)).then(r=>r.json()).then(d=>{
        if(!d.url)throw new Error('x');
        if(f.elements.pinterest)f.elements.pinterest.value=d.url;
        f.requestSubmit();
      }).catch(()=>toast('Diesen Kurzlink konnten wir leider nicht öffnen. Öffne dein Profil oder Board in Pinterest und kopiere die Adresse aus dem Browser.'));
      return;
    }
    const p=parsePinterest(fd.get('pinterest')),i=parseInstagram(fd.get('instagram'));
    if(!p.ok){toast(p.error);return}
    if(!i.ok){toast(i.error);return}
    S.me.social={...(p.value?{pinterest:p.value}:{}),...(i.value?{instagram:i.value}:{})};
    toast(p.value||i.value?'Gespeichert. Deine Freunde sehen jetzt, was dich inspiriert.':'Die Links sind wieder entfernt.');render();return;
  }
  if(kind==='owned'){
    const t=(fd.get('t')||'').trim();if(!t)return;
    const g=CATALOG.find(i=>overlap(kwOf(t),i.kw));const c=g?g.c:'wohnen';
    S.me.wishes.unshift(W({t,c,kind:'produkt',prio:1,status:'selbst',vis:'alle',a:cat(c).a,tone:cat(c).t,kw:kwOf(t)}));
    toast(`„${t}“ ist eingetragen. Das schlagen wir dir und deinen Freunden nicht mehr vor.`);render();return;
  }
  if(kind==='azsearch'){
    const q=(fd.get('q')||'').trim();S.ui.az.q=q;S.ui.az.searched=true;
    window.open(q?searchUrl.amazon(q):'https://www.amazon.de/?tag=jannst-21','_blank','noopener');return;
  }
  if(kind==='azlink'){azParse(fd.get('text')||'');return}
  if(kind==='azadd'){
    const z=S.ui.az,t=(fd.get('t')||'').trim();if(!t||!z.res||z.res.error)return;
    const c=fd.get('c');
    S.me.wishes.unshift(W({t,c,kind:'produkt',prio:2,link:z.res.url,price:parsePrice(fd.get('price')),a:cat(c).a,tone:cat(c).t,kw:kwOf(t)}));
    S.ui.modal=null;S.ui.az=null;S.ui.wf='offen';S.ui.wc='alle';toast('Schön, der Wunsch steht auf deiner Liste. Den Link zu Amazon haben wir direkt dazu gespeichert.');render();return;
  }
  if(kind==='child'){
    const name=(fd.get('name')||'').trim();if(!name)return;
    const bd=String(fd.get('birthdate')||''),ag=ageOf(bd);
    if(ag==null||ag>17){toast(ag>17?'Kind-Konten sind für Kinder und Jugendliche unter 18 Jahren. Wer volljährig ist, legt sein eigenes Wishtale an.':'Bitte gib das Geburtsdatum an, damit Vorschläge zum Alter passen.');return}
    const id=nid('c');
    S.accounts[id]={id,name,age:ag,birthdate:bd,size:String(fd.get('size')||'').trim().slice(0,20),tone:Object.keys(S.accounts).length%6,managed:true,invited:[],interests:[],cats:[],brands:[],tries:[],nogos:[],alts:[],vis:{interests:'giver',cats:'giver',brands:'giver',tries:'giver',nogos:'giver',alts:'giver'},wishes:[],history:[],inbox:[]};
    switchTo(id);S.ui.step=0;toast(`Das Konto für ${name} ist angelegt. Jetzt könnt ihr das Profil gemeinsam einrichten.`);
    if(location.hash==='#start')render(true);else location.hash='#start';
    return;
  }
  if(kind==='custom'){const v=(fd.get('v')||'').trim(),k=fd.get('k');if(v&&!S.me[k].includes(v))S.me[k].push(v);render()}
  if(kind==='idea'){const v=(fd.get('idea')||'').trim();S.ui.idea=v;S.ui.ideaRes=v?check(guestPerson(),v):null;render()}
  if(kind==='zettel'){
    const files=[...f.elements.files.files],text=(fd.get('text')||'').trim();
    if(!files.length&&!text){S.ui.zt={error:'Bitte wähle ein Foto aus oder füge den Text ein.'};render();return}
    S.ui.zt={busy:true};render();
    readZettelRemote({text,files}).then(r=>{
      S.ui.zt=r.wishes.length?{items:r.wishes,name:r.name,unclear:r.unclear}:{error:'Auf dem Zettel konnten wir keine Wünsche finden. Ein schärferes oder helleres Foto hilft oft, oder du fügst den Text ein.'};
      track('choice',{label:'zettel',once:true,path:'/app/'});render();if(S.ui.zt&&S.ui.zt.items)zettelMatch();
    }).catch(e=>{S.ui.zt={error:e.message||'Das hat nicht geklappt.'};render()});
    return;
  }
  if(kind==='zettelsave'){
    const z=S.ui.zt||{},on=fd.getAll('on').map(Number);let n=0;const imgs=[];
    on.forEach(i=>{
      const w=(z.items||[])[i];let t=(fd.get('t'+i)||'').trim();if(!w||!t)return;
      const m=z.m&&z.m[i],use=m&&m.st==='ok'&&fd.get('use'+i)==='1',cand=use?m.cand:null;
      if(cand)t=cand.t;
      const c=(m&&(m.cand?.c||m.c))||guessCategory(t,'wohnen');
      const nw=W({t,c,kind:w.kind,prio:2,price:cand&&cand.price?cand.price:w.price,note:w.note||'',a:w.kind==='erlebnis'?'ticket':cat(c).a,tone:cat(c).t,kw:kwOf(t)});
      S.me.wishes.unshift(nw);if(cand&&S.auth.user)imgs.push({w:nw,cand});n++;
    });
    if(imgs.length)setTimeout(()=>zettelImages(imgs),50);
    S.ui.zt=null;S.ui.modal=null;
    if(n)toast(`${n===1?'Ein Wunsch steht':n+' Wünsche stehen'} jetzt auf der Wunschliste. Bei jedem Wunsch kannst du den Link ergänzen.`);
    location.hash='#wuensche';render();return;
  }
  if(kind==='givengift'){
    saveGift({recipient:(fd.get('recipient')||'').trim(),what:(fd.get('what')||'').trim(),occasion:fd.get('occasion')||'',when:fd.get('when')||undefined,price:parsePrice(fd.get('price')),reaction:fd.get('reaction')||null,note:(fd.get('note')||'').trim(),status:'given'}).then(()=>{S.ui.modal=null;toast('Das Geschenk steht jetzt in deiner Liste.');render()});
    return;
  }
  if(kind==='gift'){
    const [y,mo]=(fd.get('when')||'2026-11').split('-');
    const what=fd.get('what').trim();
    S.me.history.unshift({id:nid('h'),what,from:fd.get('from').trim(),when:`${MONTHS[+mo-1]} ${y}`,liked:fd.get('liked'),have:fd.get('have')==='1',again:fd.get('again')==='1',a:'gift',tone:S.me.history.length%6,kw:kwOf(what)});
    S.ui.modal=null;toast('Das Geschenk ist eingetragen.');render();
  }
  if(kind==='firstwish'){const t=String(fd.get('t')||'').trim().slice(0,120);S.ui.editWish=null;S.ui.wishImg=null;S.ui.wr=null;S.ui.prefill=t;S.ui.modal='wish';render();setTimeout(()=>{S.ui.prefill=''},300);setTimeout(()=>{const f=wform();if(f&&t){f.elements.t.value=t;previewWish(t)}document.getElementById(t?'wl':'wt')?.focus({preventScroll:true})},60);return}
  if(kind==='wish'){
    // Doppelt? Einmal freundlich hinweisen, beim zweiten Klick trotzdem speichern.
    const dup=findDupe(S.me.wishes,{t:(fd.get('t')||'').trim(),link:(fd.get('link')||'').trim()},S.ui.editWish);
    if(dup&&f.dataset.dupok!==dup.id){f.dataset.dupok=dup.id;const el=f.querySelector('#wdup');if(el){el.hidden=false;el.textContent=`„${dup.t}“ steht schon auf deiner Wunschliste. Wenn du ihn trotzdem noch einmal anlegen möchtest, tippe noch einmal auf Speichern.`;el.scrollIntoView({block:'center',behavior:'smooth'})}return}
    Promise.all([amazonLink((fd.get('link')||'').trim()),finalImage()]).then(([link,fi])=>{const done=(img,imgSrc,removed)=>{
      const c=fd.get('c'),t=fd.get('t').trim(),k=fd.get('kind'),plan=fd.get('plan')==='1',noSuggest=fd.get('nosug')==='1';
      if(S.ui.editWish){
        const w=S.me.wishes.find(x=>x.id===S.ui.editWish);
        if(w){const keep=w.c===c&&w.kind===k;if(w.img&&(removed||(img&&img!==w.img)))dropImage(w.img);Object.assign(w,{noSuggest,t,c,kind:k,prio:+fd.get('prio'),link,price:parsePrice(fd.get('price')),occ:fd.getAll('occ'),budget:+fd.get('budget')||null,note:(fd.get('note')||'').trim(),vis:plan?'privat':fd.get('vis'),status:plan?'plan':(w.status==='plan'?'offen':w.status),kw:kwOf(t),img:removed?null:(img||w.img||null),imgSrc:removed?'':(img?(imgSrc||''):(w.imgSrc||'')),...(keep?{}:{a:k==='erlebnis'?'ticket':cat(c).a,tone:cat(c).t})})}
        S.ui.editWish=null;S.ui.modal=null;toast('Gespeichert.');render();return;
      }
      S.me.wishes.unshift(W({noSuggest,t,c,kind:k,prio:+fd.get('prio'),link,price:parsePrice(fd.get('price')),occ:fd.getAll('occ'),budget:+fd.get('budget')||null,note:(fd.get('note')||'').trim(),vis:plan?'privat':fd.get('vis'),status:plan?'plan':'offen',a:k==='erlebnis'?'ticket':cat(c).a,tone:cat(c).t,img,imgSrc:imgSrc||''}));
      S.ui.modal=null;S.ui.wf='offen';S.ui.wc='alle';const ideas=!link&&k!=='erlebnis'&&!noSuggest&&!plan;S.ui.wr=null;toast(ideas?'Der Wunsch ist gespeichert, und deine Freunde sehen dazu passende Ideen von Wishtale.':'Der Wunsch ist gespeichert.',ideas?{label:'So sehen es Freunde',run:()=>{S.ui.preview=true;markStep('preview');render();scrollTo({top:0,behavior:'smooth'})}}:null);render();
    };
    if(fi.failed)toast('Das Bild konnte nicht gespeichert werden. Der Wunsch ist ohne Bild gespeichert, du kannst es später erneut versuchen.');
    S.ui.wishImg=null;done(fi.img,fi.src,fi.removed);
    });
  }
});
