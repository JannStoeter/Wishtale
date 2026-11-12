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
import { hideIdea, ideasOf, loadIdeas, skey, gkey } from './lib/ideas.js';
import { saveSignal, signalCount } from './lib/signals.js';
import { startCheckout, openPortal } from './lib/plan.js';
import { downscale, fetchProductImage, finalImage, imgBoxHtml, dropImage } from './lib/wishimg.js';
import { render, route, refreshGuest } from './render.js';
import { WishPrev, draftKey } from './views/wishprev.js';
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
/* Vorschau im Wunschformular: Kategorie raten, passende Produkte laden und im Formular anzeigen, ohne eingetippte Werte zu verlieren. */
function previewWish(title,msg){
  const f=document.querySelector('form[data-form=wish]'),box=document.getElementById('wprev');
  if(!f||!box||S.ui.editWish)return;
  const t=String(title||'').trim().slice(0,120);
  if(t.length<3){box.innerHTML='';return}
  const kind=f.querySelector('input[name=kind]:checked')?.value;
  if(f.elements.nosug?.checked){box.innerHTML='';return}
  const sel=f.elements.c;if(sel&&sel.value==='wohnen'){const g=guessCategory(t,'wohnen');if(g!==sel.value)sel.value=g}
  S.ui.wprevMsg=msg||'';
  const draw=()=>{const b=document.getElementById('wprev'),ff=document.querySelector('form[data-form=wish]');if(b&&ff&&ff.elements.t.value.trim().slice(0,120)===t)b.innerHTML=WishPrev(t,ff.elements.c?.value)};
  if(kind!=='erlebnis'&&kind!=='frei'&&S.me.handle&&/^[a-z0-9-]{3,31}$/.test(S.me.handle))loadIdeas(draftKey(t),{h:S.me.handle,mode:'wish',t},draw);
  draw();
}
const A={
 scroll(el){document.getElementById(el.dataset.t)?.scrollIntoView({behavior:'smooth',block:'start'})},
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
 preview(el){S.ui.preview=el.dataset.v==='1';render()},
 vis(el){const k=el.dataset.k;S.me.vis[k]=(S.me.vis[k]||'alle')==='privat'?'alle':'privat';render()},
 wf(el){S.ui.wf=el.dataset.v;render()},wc(el){S.ui.wc=el.dataset.v;render()},
 selbst(el){const w=S.me.wishes.find(x=>x.id===el.dataset.id);w.status=w.status==='selbst'?'offen':'selbst';toast(w.status==='selbst'?'Dann ist dieser Wunsch erledigt. Deine Freunde sehen jetzt, dass du das schon hast.':'Der Wunsch ist wieder offen.');render()},
 prio(el){const w=S.me.wishes.find(x=>x.id===el.dataset.id);w.prio=w.prio%3+1;toast('Priorität: '+PRIO[w.prio]);render()},
 delw(el){S.ui.modal=null;const old=S.me.wishes.find(x=>x.id===el.dataset.id);if(old&&old.img)dropImage(old.img);S.me.wishes=S.me.wishes.filter(x=>x.id!==el.dataset.id);render()},
 modal(el){if(el.dataset.v==='wish'){S.ui.editWish=null;S.ui.wishImg=null;S.ui.wprevMsg=''}if(el.dataset.v==='zettel')S.ui.zt=null;S.ui.modal=el.dataset.v;render();setTimeout(()=>document.querySelector('.sheet input,.sheet select')?.focus({preventScroll:true}),30)},
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
 welcomego(){markWelcomed();stopWelcome();S.ui.editWish=null;S.ui.wishImg=null;S.ui.wprevMsg='';S.ui.modal='wish';render();setTimeout(()=>document.querySelector('.sheet input,.sheet select')?.focus({preventScroll:true}),30)},
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
async readlink(el,ev){
  const auto=ev===true,f=document.querySelector('form[data-form=wish]');if(!f)return;
  const raw=f.elements.link.value.trim(),st=document.getElementById('wlstat'),say=t=>{if(st){st.textContent=t;st.className='hint'}},mark=(k,t)=>{if(st){st.textContent=t;st.className='hint '+k}};
  if(!raw){say('Füge zuerst einen Link oder einen Titel ein.');return}
  if(!/https?:\/\//i.test(raw)&&/\s/.test(raw)){ // kein Link, sondern Text (zum Beispiel der kopierte Amazon-Titel): die KI erkennt das Produkt
    say('Wir lesen den Text …');
    try{
      const r=await readZettelRemote({text:raw}),w=(r.wishes||[])[0];
      if(!w){mark('attn','Daraus konnten wir leider keinen Wunsch herauslesen. Trage den Namen bitte unten selbst ein.');return}
      const t=f.elements.t,pr=f.elements.price,nt=f.elements.note;
      t.value=w.t.slice(0,160);
      if(w.price&&!pr.value.trim())pr.value=w.price.toFixed(2).replace('.',',');
      if(w.note&&nt&&!nt.value.trim())nt.value=w.note;
      f.elements.link.value='';
      previewWish(w.t,'✓ Titel gelesen, so sehen Freunde diesen Wunsch');
      mark('ok',`✓ Titel gelesen: ${w.t}${w.price?` für ${w.price.toFixed(2).replace('.',',')} €`:''}. Bitte prüfe die Angaben, einen Link kannst du später ergänzen.${(r.wishes||[]).length>1?' Der Text enthält mehrere Produkte, für ganze Listen nutze „Liste einlesen“.':''}`);
    }catch(e){mark('attn',e.message||'Das hat nicht geklappt.')}
    return;
  }
  if(isAmazon(raw)){
    say('Wir übernehmen den Amazon-Link …');
    const r=await amazonRead(raw);
    if(r.error){say(r.error);return}
    f.elements.link.value=r.url;
    if(r.title&&!f.elements.t.value.trim())f.elements.t.value=r.title;
    const nm=f.elements.t.value.trim(),tf=f.elements.t;
    tf.classList.remove('attn');
    if(nm){previewWish(nm);mark('ok',`✓ Amazon-Link gespeichert, Name übernommen. Den Preis gibt Amazon nicht heraus, trage ihn gern selbst ein oder lass ihn offen.`)}
    else{mark('attn','✓ Amazon-Link gespeichert. Amazon verrät uns den Namen nicht, bitte trage ihn jetzt im Feld „Was wünschst du dir?“ ein, mehr ist nicht nötig.');tf.classList.add('attn');tf.scrollIntoView({block:'center',behavior:'smooth'});setTimeout(()=>tf.focus({preventScroll:true}),350)}
    if(nm&&!S.ui.wishImg){try{const im=await fetchProductImage(null,nm);showWishImg({blob:im.blob,preview:im.preview,src:im.src});mark('ok','✓ Amazon-Link gespeichert und ein passendes Bild im Netz gefunden. Bitte prüfe, ob es zum Produkt passt, du kannst es entfernen.')}catch(e){console.warn('Bildsuche:',e.message)}}
    return;
  }
  say('Wir lesen den Link …');
  try{
    const p=await inspectLink(raw);
    const t=f.elements.t,pr=f.elements.price,nt=f.elements.note;
    if(!t.value.trim())t.value=p.title.slice(0,160);
    const pf=priceField(p);if(pf&&(!auto||!pr.value.trim()))pr.value=pf;
    if(p.size&&!/gr(ö|oe)ße:/i.test(nt.value)&&(!auto||!nt.value.trim()))nt.value=(nt.value.trim()?nt.value.trim()+'\n':'')+`Größe: ${p.size}`;
    say(`Gefunden: ${summary(p)}. Bitte prüfe die Angaben, der Preis kann sich ändern.${p.price&&p.currency&&p.currency!=='EUR'?' Der Preis steht nicht in Euro, bitte passe ihn an.':''}`);
    if(p.imageUrl&&!S.ui.wishImg){
      try{const im=await fetchProductImage(p.imageUrl);showWishImg({blob:im.blob,preview:im.preview,src:im.src});say(`Gefunden: ${summary(p)} und das Produktbild. Bitte prüfe die Angaben, der Preis kann sich ändern.`)}catch(e){console.warn('Produktbild:',e.message)}
    }
  }catch(e){say(e.message||'Das hat nicht geklappt.')}
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
 aivhave(el){ // „Habe ich schon“ bei einem Vorschlag zu einem Wunsch: als vorhanden notieren, nie wieder vorschlagen
  const i=ideasOf('wish:'+el.dataset.wid).find(x=>x.t===el.dataset.t);if(!i)return;
  const c=guessCategory(i.t,'wohnen');
  if(!S.me.wishes.some(w=>w.status==='selbst'&&w.t.toLowerCase()===i.t.toLowerCase()))S.me.wishes.unshift(W({t:i.t,c,kind:'produkt',prio:1,status:'selbst',vis:'alle',a:cat(c).a,tone:cat(c).t,kw:kwOf(i.t)}));
  saveSignal('have',i.t);hideIdea(i.t);toast('Notiert, das ist schon vorhanden. Solche Vorschläge zeigen wir nicht mehr.');render();
 },
 aihave(el){
  const i=ideasOf(skey(S.me.handle||'')).find(x=>x.t===el.dataset.t);if(!i)return;
  const c=guessCategory(i.t,'wohnen');
  if(!S.me.wishes.some(w=>w.status==='selbst'&&w.t.toLowerCase()===i.t.toLowerCase()))S.me.wishes.unshift(W({t:i.t,c,kind:'produkt',prio:1,status:'selbst',vis:'alle',a:cat(c).a,tone:cat(c).t,kw:kwOf(i.t)}));
  saveSignal('have',i.t);hideIdea(i.t);toast('Notiert, das hast du schon. Solche Ideen zeigen wir dir nicht mehr.');render();
 },
 aiadd(el){
  const i=ideasOf(skey(S.me.handle||'')).find(x=>x.t===el.dataset.t);if(!i)return;
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
  else if(S.auth.user&&h)loadIdeas(skey(h),{h,mode:'self',n:signalCount()},()=>{if(S.ui.view==='entdecken'&&!S.ui.modal)render()});
  render();
 },
 occ(el){S.ui.occ=el.dataset.v;S.ui.budget=el.dataset.v==='danke'?40:100;render()},
 onlyopen(el){S.ui.onlyOpen=el.dataset.v==='1';render()},
 wview(el){S.ui.wview=el.dataset.v;render()},
 suggest(el){S.ui.pickId=el.dataset.id;S.ui.wishCtx='guest';S.ui.modal='wishdetail';render()}
};
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;const f=A[t.dataset.act];if(f)f(t,e)});
document.addEventListener('change',async e=>{
  if(e.target.name!=='img'||!e.target.closest('form[data-form=wish]')||!e.target.files||!e.target.files[0])return;
  try{const d=await downscale(e.target.files[0]);showWishImg({blob:d.blob,preview:d.preview,src:''})}catch(err){toast(err.message||'Dieses Bild lässt sich nicht öffnen.')}
});
document.addEventListener('change',e=>{if(e.target.name==='t'&&e.target.closest?.('form[data-form=wish]')&&!S.ui.editWish&&!e.target.dataset.skip)previewWish(e.target.value)});
document.addEventListener('input',e=>{if(e.target.name==='t'&&e.target.classList?.contains('attn'))e.target.classList.remove('attn')});
document.addEventListener('input',e=>{if(e.target.id==='bud'){S.ui.budget=+e.target.value;$('#budv').textContent=money(S.ui.budget)}});
document.addEventListener('change',e=>{const sf=e.target.closest?.('form[data-form=social]');if(sf)sf.requestSubmit()});
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
document.addEventListener('input',e=>{const f=e.target.dataset?.prof;if(f){S.me[f]=e.target.value;saveState()}});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('[role=button][data-act]')){e.preventDefault();e.target.click()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.ui.modal)A.close()});
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
    const id=nid('c');
    S.accounts[id]={id,name,age:+fd.get('age')||null,tone:Object.keys(S.accounts).length%6,managed:true,invited:[],interests:[],cats:[],brands:[],tries:[],nogos:[],alts:[],vis:{interests:'giver',cats:'giver',brands:'giver',tries:'giver',nogos:'giver',alts:'giver'},wishes:[],history:[],inbox:[]};
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
      track('choice',{label:'zettel',once:true,path:'/app/'});render();
    }).catch(e=>{S.ui.zt={error:e.message||'Das hat nicht geklappt.'};render()});
    return;
  }
  if(kind==='zettelsave'){
    const z=S.ui.zt||{},on=fd.getAll('on').map(Number);let n=0;
    on.forEach(i=>{
      const w=(z.items||[])[i],t=(fd.get('t'+i)||'').trim();if(!w||!t)return;
      const c=guessCategory(t,'wohnen');
      S.me.wishes.unshift(W({t,c,kind:w.kind,prio:2,price:w.price,note:w.note||'',a:w.kind==='erlebnis'?'ticket':cat(c).a,tone:cat(c).t,kw:kwOf(t)}));n++;
    });
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
      S.ui.modal=null;S.ui.wf='offen';S.ui.wc='alle';toast('Der Wunsch ist gespeichert.');render();
    };
    if(fi.failed)toast('Das Bild konnte nicht gespeichert werden. Der Wunsch ist ohne Bild gespeichert, du kannst es später erneut versuchen.');
    S.ui.wishImg=null;done(fi.img,fi.src,fi.removed);
    });
  }
});
