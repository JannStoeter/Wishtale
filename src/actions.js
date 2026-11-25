import { beginGuide, endGuide, guideClick, guideSubmit, focusGuideTarget, currentGuideStep, syncGuide } from './lib/guide.js';
import { markDone, markShared } from './lib/tips.js';
window.addEventListener('wishtale:tips',()=>{if(!S.ui.modal)render()}); // Hinweis, der erst nach dem Nachladen feststeht (104/106)
import { setNewbarDone } from './views/wishes.js';
import { smartCats } from './lib/smartcats.js';
import { promptInstall } from './lib/pwa.js';
import { dismissAppHint } from './views/appinstall.js';
import { demoStart, demoStop, demoGo, demoStep, demoPlay } from './views/iosdemo.js';
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
import { homeIdeasVisible, setHomeIdeasVisible } from './lib/homeideas.js';
import { hidePromo } from './views/inspiration.js';
import { track } from './lib/track.js';
import { saveGift, removeGift } from './lib/given.js';
import { readZettelRemote } from './lib/zettel.js';
import { findDupe } from './lib/dupes.js';
import { ageOf } from './lib/age.js';
import { markStep, hideSteps } from './lib/steps.js';
import { createCoInvite, revokeCoInvites, removeMember, acceptCoInvite, coLink, saveCode, sharedKey } from './lib/coparent.js';
import { managersOf } from './lib/coparent.js';
import { loadMine, deleteProfile } from './lib/remote.js';
import { OCCASIONS } from './views/occasion.js';
import { buildRound, saveAnswer, removeAnswer, resetAnswers } from './lib/cards.js';
import { hideIdea, ideasOf, loadIdeas, skey, gkey, loadMatch } from './lib/ideas.js';
import { saveSignal, signalCount } from './lib/signals.js';
import { startCheckout, openPortal } from './lib/plan.js';
import { downscale, fetchProductImage, finalImage, imgBoxHtml, dropImage, storeImage, findAmazonLink, searchProducts } from './lib/wishimg.js';
import { amzFill, wantsAmazon } from './lib/amzfill.js';
import { priceFill, wantsPrice } from './lib/pricefill.js';
import { nameFromLink } from './lib/linkname.js';
import { imgFill, wantsImage, skipImage, prefetchImage } from './lib/imgfill.js';
import { render, route, refreshGuest } from './render.js';
import { WishRec, draftKey, concrete, altPrice } from './views/wishprev.js';
import { wishTab, SearchResults, IdeasPane } from './views/wishadd.js';
import { ZmRow } from './views/zettel.js';
import { createInvite, listInvites, revokeInvite, inviteLink, saveLocal, adoptInvite } from './lib/invite.js';
import { showScene, stopWelcome, markWelcomed } from './views/welcome.js';
import { guestRpc, guestToken } from './lib/remote.js';
import { signIn, signUp, magicLink, signOut, friendly, resendSignup, resetPassword, setPassword, signInGoogle } from './lib/auth.js';

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
    z.c=guessCategory(z.title||r.title);
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
/* Wunschdialog mit Reitern (124): Suche und Ideen zeichnen nur ihren eigenen Kasten neu. */
function drawSearch(){const b=document.getElementById('wsres');if(b)b.innerHTML=SearchResults()}
function drawIdeas(){const b=document.getElementById('wpane-ideen');if(b)b.innerHTML=IdeasPane()}
function loadSelfIdeas(){const h=S.me.handle;if(S.auth.user&&h)loadIdeas(skey(h),{h,mode:'self',n:signalCount()},()=>{if(S.ui.modal==='wish')drawIdeas()})}
let wsSeq=0;
function runSearch(q){
  q=String(q||'').trim().slice(0,120);if(q.length<2)return;
  if(/^https?:\/\//i.test(q)){A.wdtab({dataset:{v:'eingeben'}});const f=wform();if(f){f.elements.link.value=q;A.readlink(null,true)}return} // ein Link gehört ins Formular
  const seq=++wsSeq;S.ui.ws={q,st:'loading',items:[]};drawSearch();track('choice',{label:'wunsch_suche',path:'/app/'});
  searchProducts(q,'otto').then(items=>{if(seq!==wsSeq)return;S.ui.ws={q,st:items?'done':'error',items:items||[],err:items?'':'Die Suche ist gerade nicht eingeschaltet. Trag deinen Wunsch einfach selbst ein.'};drawSearch()})
   .catch(e=>{if(seq!==wsSeq)return;S.ui.ws={q,st:'error',items:[],err:e.message};drawSearch()});
}
function setRec(o){S.ui.wr=o;drawRec()}
const canAi=()=>S.auth.user&&S.me.handle&&/^[a-z0-9-]{3,31}$/.test(S.me.handle);
/** Bild zum Kandidaten im Hintergrund holen; die Karte bekommt es, sobald es da ist. */
function candImage(cand,imageUrl){
  if(!S.auth.user)return;
  const seq=S.ui.wr?.seq;
  fetchProductImage(imageUrl||null,imageUrl?undefined:cand.q||cand.t).then(im=>{if(S.ui.wr?.seq!==seq)return;cand.img={blob:im.blob,preview:im.preview,src:im.src};if(S.ui.wr.auto)takeImg(cand.img);drawRec()}).catch(()=>{});
}
/** Bild aus dem eigenen Link übernehmen, aber nie ein eigenes Foto, ein entferntes oder das Bild eines bestehenden Wunsches ersetzen. */
function takeImg(img){
  const wi=S.ui.wishImg,old=S.ui.editWish&&S.me.wishes.find(w=>w.id===S.ui.editWish);
  if(!img||wi&&(wi.manual||wi.remove)||old&&old.img)return;
  showWishImg({...img});
}
/** Ergebnis aus dem eigenen Link oder kopierten Titel von selbst übernehmen (Jann, 2026-11-25: erst einlesen, dann speichern war ein Stolperstein).
    Ist das Namensfeld leer, kommen Name, Preis und Bild hinein. Steht schon ein eigener Name da, bleibt er, nur Preis und Bild kommen dazu,
    und die Karte bietet „Passt“ für den Namen an. Ein eingetragener Preis wird nie überschrieben. Vorschläge von Wishtale (Erkennung,
    Alternativen) laufen weiter nur über einen Klick. */
function autoTake(cand){
  const f=wform(),r=S.ui.wr;if(!f||!r||r.cand!==cand)return false;
  const tEl=f.elements.t,empty=!tEl.value.trim();
  if(empty){tEl.value=cand.t.slice(0,160);tEl.classList.remove('attn');r.accepted=true;r.t=tEl.value.trim().slice(0,120);const sel=f.elements.c;if(sel&&!sel.dataset.touched)sel.value=guessCategory(tEl.value,sel.value)}
  if(cand.price&&f.elements.price&&!f.elements.price.value.trim())f.elements.price.value=String(cand.price).replace('.',',');
  r.auto=true;if(cand.img)takeImg(cand.img);drawRec();
  return empty;
}
/** Vor dem Speichern: Steht ein neuer Link im Feld, wartet das Speichern kurz auf das Ergebnis. Ohne Namen nimmt es den gelesenen Namen
    oder einen Namen aus der Adresse. Liefert null (sofort speichern) oder ein Promise mit true (jetzt speichern) oder false (abbrechen). */
function prepWish(f){
  const tEl=f.elements.t,lk=(f.elements.link?.value||'').trim();
  const orig=S.ui.editWish?(S.me.wishes.find(w=>w.id===S.ui.editWish)?.link||''):'';
  const fresh=lk&&lk!==orig&&!(f.dataset.read||'').split('\n').includes(lk);
  const wait=f._reading||(fresh?A.readlink(null,true):null);
  if(!wait&&tEl.value.trim())return null;
  const btn=f.querySelector('button[type=submit]'),label=btn?.textContent;
  return (async()=>{
    if(wait){if(btn){btn.disabled=true;btn.textContent='Link wird gelesen …'}
      await Promise.race([Promise.resolve(wait).catch(()=>{}),new Promise(r=>setTimeout(r,9000))]);
      if(btn){btn.disabled=false;btn.textContent=label}}
    if(wform()!==f)return false;
    if(!tEl.value.trim()){
      const r=S.ui.wr,name=(r&&r.cand&&r.cand.t)||nameFromLink((f.elements.link?.value||'').trim());
      if(!name){tEl.classList.add('attn');tEl.focus();const st=f.querySelector('#wdup');if(st){st.hidden=false;st.textContent='Schreib kurz, was du dir wünschst, oder füge einen Link ein.'}return false}
      tEl.value=name.slice(0,160);
    }
    return true;
  })();
}
function showCand(cand,t){const seq=(S.ui.wr?.seq||0)+1;S.ui.wr={st:'found',t:t||cand.t,c:wform()?.elements.c?.value,cand,seq};drawRec();return seq}
function previewWish(title){
  const f=wform();if(!f||S.ui.editWish)return;
  const t=String(title||'').trim().slice(0,120);
  if(S.ui.wr?.st==='found'&&S.ui.wr.accepted&&S.ui.wr.cand.t===t)return; // gerade übernommen
  const kind=f.querySelector('input[name=kind]:checked')?.value;
  const sel=f.elements.c;if(t.length>=3&&sel&&!sel.dataset.touched){const g=guessCategory(t);if(g!==sel.value)sel.value=g}
  if(t.length<3||f.elements.nosug?.checked||kind==='erlebnis'){setRec(null);return}
  if(kind==='frei'||kind==='kategorie'||!concrete(t)||!canAi()){setRec({st:'vague',t});return}
  const seq=(S.ui.wr?.seq||0)+1;setRec({st:'loading',t,seq,c:sel?.value});
  loadMatch(S.me.handle,t).then(m=>{
    if(S.ui.wr?.seq!==seq)return;
    if(m&&m.c&&sel&&!sel.dataset.touched)sel.value=m.c;
    if(!m||!m.ok){setRec({st:'unsure',t,seq});return}
    const web=m.src==='web',cand={t:m.t,q:m.q,price:m.price,est:!web,src:web?'web':'match',host:m.host||''};showCand(cand,t);S.ui.wr.seq=seq;candImage(cand,m.img||undefined);
    prefetchImage({t,link:(f.elements.link?.value||'').trim(),kind:'produkt',status:'offen'}); // Bild schon jetzt suchen, beim Speichern ist es dann meist da
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
    try{const im=await fetchProductImage(cand.img||null,cand.img?undefined:(cand.q||cand.t));if(im.blank)return;
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
    ff.elements.link.value=r.url;ff.querySelector('.wl-row')?.removeAttribute('hidden');
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
/** „Das habe ich schon“ aus dem Profil: als erledigter Wunsch speichern, nie auf der Wunschliste (Dev 101). */
function addOwned(t){
  t=String(t).trim().slice(0,120);if(!t||S.me.wishes.some(w=>w.status==='selbst'&&w.t.toLowerCase()===t.toLowerCase()))return;
  const g=CATALOG.find(i=>overlap(kwOf(t),i.kw));const c=g?g.c:guessCategory(t);
  S.me.wishes.unshift(W({t,c,kind:'produkt',prio:1,status:'selbst',vis:'alle',a:cat(c).a,tone:cat(c).t,kw:kwOf(t)}));
}
function toggleOwned(t){
  const w=S.me.wishes.find(x=>x.status==='selbst'&&x.t.toLowerCase()===String(t).toLowerCase());
  if(w){if(w.img)dropImage(w.img);S.me.wishes=S.me.wishes.filter(x=>x!==w)}else addOwned(t);
}

/** Liest den Link oder kopierten Titel im Link-Feld. Was aus dem eigenen Link kommt, übernimmt Wishtale von selbst (Jann, 2026-11-25). */
async function readLinkNow(f,raw0){
  const raw=raw0,st=document.getElementById('wlstat'),say=t=>{if(st){st.textContent=t;st.className='hint'}};
  const typed=f.elements.t.value.trim();
  if(!raw){say('Füge zuerst einen Link oder einen kopierten Titel ein.');return}
  if(!/https?:\/\//i.test(raw)&&/\s/.test(raw)){ // kein Link, sondern Text (zum Beispiel der kopierte Amazon-Titel)
    say('Wir lesen den Titel …');setRec({st:'loading',t:typed,seq:(S.ui.wr?.seq||0)+1});
    try{
      const r=await readZettelRemote({text:raw}),w=(r.wishes||[])[0];
      if(!w){setRec({st:'none',msg:'Aus dem Text konnten wir kein Produkt herauslesen. Dein Wunsch bleibt so, wie du ihn eingetragen hast.'});say('Füge den Titel einer Produktseite ein, zum Beispiel von Amazon.');return}
      f.elements.link.value='';
      const cand={t:w.t,q:w.t,price:w.price?Math.round(w.price*100)/100:null,est:false,src:'text'};showCand(cand,typed);candImage(cand);const took=autoTake(cand);
      say((r.wishes||[]).length>1?'Der Text enthält mehrere Produkte, für ganze Listen nutze „Liste einlesen“.':took?'Titel gelesen und übernommen. Du kannst ihn oben noch ändern.':'Titel gelesen. Wenn der Name oben besser passen soll, tippe auf „Passt“.');
    }catch(e){setRec({st:'none',msg:''});say(e.message||'Das hat nicht geklappt.')}
    return;
  }
  if(isAmazon(raw)){
    say('Wir übernehmen den Amazon-Link …');
    const r=await amazonRead(raw);
    if(r.error){say(r.error);return}
    f.elements.link.value=r.url;f.dataset.read=raw+'\n'+r.url;
    if(r.title){const cand={t:r.title,q:r.title,price:null,src:'amazon'};showCand(cand,typed);candImage(cand);autoTake(cand);say('Der Amazon-Link ist übernommen, den Namen haben wir aus der Adresse gelesen. Amazon gibt keinen Preis heraus, darum sucht Wishtale ihn nach dem Speichern auf der Seite des Herstellers.')}
    else{setRec({st:'none',msg:''});say(typed?'Der Amazon-Link ist gespeichert und gehört zu deinem Wunsch.':'Der Amazon-Link ist gespeichert. Trag oben noch kurz ein, was es ist, mehr ist nicht nötig.')}
    return;
  }
  say('Wir lesen den Link …');setRec({st:'loading',t:typed,seq:(S.ui.wr?.seq||0)+1});
  try{
    const p=await inspectLink(raw);
    const pf=priceField(p),cand={t:p.title.slice(0,160),q:p.title,price:pf?+pf.replace(',','.'):null,est:false,src:'link',size:p.size};
    showCand(cand,typed);if(p.imageUrl)candImage(cand,p.imageUrl);autoTake(cand);
    if(p.size&&f.elements.note&&!/gr(ö|oe)ße:/i.test(f.elements.note.value))f.elements.note.value=(f.elements.note.value.trim()?f.elements.note.value.trim()+'\n':'')+`Größe: ${p.size}`;
    say(`Link gelesen und übernommen: ${summary(p)}. Du kannst alles noch ändern, und der Preis im Shop kann sich ändern.${p.price&&p.currency&&p.currency!=='EUR'?' Der Preis steht nicht in Euro, bitte passe ihn an.':''}`);
  }catch(e){setRec({st:'none',msg:''});say(e.message||'Diese Seite konnten wir nicht lesen. Dein Wunsch und der Link bleiben trotzdem gespeichert.')}
 }

const A={
 scroll(el){document.getElementById(el.dataset.t)?.scrollIntoView({behavior:'smooth',block:'start'})},
 coinvite(el){const id=el.dataset.id,z=S.ui.mgm[id];if(!z||z.busy)return;z.busy=true;z.error='';render();
  createCoInvite(id).then(t=>{z.link=coLink(t);z.busy=false;return managersOf(id).then(d=>{z.data=d}).catch(()=>{})}).catch(e=>{z.busy=false;z.error=e.message||'Das hat leider nicht geklappt.'}).finally(()=>render())},
 cocopy(){const id=S.me.dbId,z=(S.ui.mgm||{})[id];if(!z||!z.link)return;const u=z.link;
  if(navigator.share){navigator.share({title:`Mitverwalten: ${S.me.name} bei Wishtale`,url:u}).catch(()=>{})}
  else if(navigator.clipboard)navigator.clipboard.writeText(u).then(()=>toast('Der Link ist kopiert.')).catch(()=>toast('Bitte kopiere den Link aus dem Feld.'));
  else toast('Bitte kopiere den Link aus dem Feld.')},
 corevoke(el){const id=el.dataset.id;revokeCoInvites(id).then(()=>managersOf(id)).then(d=>{S.ui.mgm[id]={data:d};toast('Die offenen Einladungen sind zurückgezogen.');render()}).catch(()=>{toast('Das hat leider nicht geklappt.')})},
 coremove(el){const id=el.dataset.id;if(!confirm(`${el.dataset.n} aus der Verwaltung entfernen? ${el.dataset.n} sieht das Wishtale von ${S.me.name} danach nicht mehr.`))return;
  removeMember(id).then(()=>managersOf(id)).then(d=>{S.ui.mgm[id]={data:d};toast('Das zweite Elternteil ist entfernt.');render()}).catch(()=>toast('Das hat leider nicht geklappt.'))},
 coleave(el){const id=el.dataset.id;if(!confirm(`Die Verwaltung von ${S.me.name} abgeben? Du siehst das Wishtale danach nicht mehr.`))return;
  removeMember(id).then(()=>loadMine(S.auth.user)).then(()=>{S.ui.mgm={};switchTo('me');location.hash='#wuensche';toast('Du verwaltest das Wishtale nicht mehr mit.');render(true)}).catch(()=>toast('Das hat leider nicht geklappt.'))},
 coaccept(){const c=S.ui.co;if(!c||c.busy)return;c.busy=true;c.error='';render(true);
  acceptCoInvite(c.code).then(async r=>{await loadMine(S.auth.user);const k=sharedKey(r.kid);S.ui.co=null;S.ui.mgm={};if(k)switchTo(k);location.hash='#wuensche';render(true);toast(`Du verwaltest jetzt gemeinsam mit ${r.from} das Wishtale von ${r.kid}.`)}).catch(e=>{c.busy=false;c.error=e.message;render(true)})},
 cologin(el){const c=S.ui.co;if(c)saveCode(c.code);location.hash='#'+(el.dataset.to||'anmelden')},
 cardcat(el){const c=S.ui.cards;if(c){c.cat=el.dataset.v;render()}},
 cardstart(){const c=S.ui.cards;if(!c)return;c.round=buildRound(c.cat);c.i=0;c.done=0;c.owned=false;c.hist=[];render();setTimeout(()=>document.getElementById('card-h')?.focus({preventScroll:true}),30)},
 cardmore(){A.cardstart()},
 cardown(){const c=S.ui.cards;c.owned=!c.owned;render();document.querySelector('.tchk')?.focus({preventScroll:true})},
 cardans(el){const c=S.ui.cards;if(!c||!c.round)return;const id=c.round[c.i],r=el.dataset.r,prev=c.map[id]||null;
  const rating=r==='like'||r==='dislike'?r:null;
  if(rating||c.owned){saveAnswer(id,{rating,owned:c.owned});c.done++}
  c.hist.push({id,prev,counted:!!(rating||c.owned)});c.i++;c.owned=false;render();setTimeout(()=>document.getElementById(c.i<c.round.length?'card-h':'main')?.focus({preventScroll:true}),30)},
 cardundo(){const c=S.ui.cards;if(!c||!c.hist.length)return;const h=c.hist.pop();c.i--;if(h.counted)c.done--;
  if(h.prev)saveAnswer(h.id,h.prev);else if(c.map[h.id])removeAnswer(h.id);c.owned=false;render();setTimeout(()=>document.getElementById('card-h')?.focus({preventScroll:true}),30)},
 cardend(){const c=S.ui.cards;if(c){c.i=c.round?c.round.length:0;render()}},
 cardchange(el){saveAnswer(el.dataset.id,{rating:el.dataset.r,owned:!!(S.ui.cards.map[el.dataset.id]||{}).owned}).then(()=>render());render()},
 cardremove(el){removeAnswer(el.dataset.id).then(()=>render());render()},
 cardreset(){if(!confirm('Alle deine Antworten zu den Karten löschen? Deine Wünsche und dein Profil bleiben, wie sie sind.'))return;resetAnswers().then(()=>{toast('Deine Antworten sind gelöscht.');render()});render()},
 jump(el){document.getElementById(el.dataset.to)?.scrollIntoView({behavior:'smooth',block:'start'})},
 helptab(el){S.ui.helpTab=el.dataset.v;render();document.querySelector('.help-switch [aria-pressed="true"]')?.focus({preventScroll:true})},
 guidestart(el){if(!beginGuide(el.dataset.id))return;if(S.ui.view==='wuensche')render(true);else location.hash='#wuensche'},
 guideend(){const step=currentGuideStep(),target=step&&document.querySelector(step.target);endGuide();document.querySelector('.guide-coach')?.remove();syncGuide();(target?.matches('input,button,textarea,a,select')?target:target?.querySelector('input,button,a,select')||(S.ui.modal?document.querySelector('.sheet input,.sheet button'):document.querySelector('.helpbtn')))?.focus({preventScroll:true})},
 guidefocus(){focusGuideTarget()},
 profilenext(el){
  const k=el.dataset.k;
  if(k==='wishes'){endGuide();S.ui.preview=false;S.ui.focusTarget='#wt';S.ui.editWish=null;S.ui.wishImg=null;S.ui.wr=null;S.ui.wtab='eingeben';S.ui.ws=null;S.ui.modal='wish';render();return}
  if(k==='history'){S.ui.focusTarget='#gw';S.ui.modal='gift';render();return}
  if(k==='about')S.ui.focusTarget='#about';
  else if(k==='owned')S.ui.focusTarget='#ownedt';
  else if(['interests','cats','brands','nogos','tries','alts'].includes(k)){S.ui.editK=k;S.ui.focusTarget='#sec-'+k+' [data-act=pick]'}
  else return;
  render();
 },
 menu(){S.ui.menu=!S.ui.menu;render()},
 menuclose(){S.ui.menu=false;render();document.querySelector('.acctbtn')?.focus({preventScroll:true})},
 menuclosebg(el,e){if(e.target===el)A.menuclose()},
 mgo(el){const v=el.dataset.v;if(el.dataset.home){S.ui.preview=false;S.ui.menu=false;}S.ui.menu=false;S.ui.scrollTo=el.dataset.to||'';if(v==='profil'&&el.dataset.to==='vis')S.ui.scrollTo='';if(location.hash==='#'+v){render(true)}else location.hash='#'+v},
 mdo(el,e){S.ui.menu=false;const f=A[el.dataset.do];if(f)f(el,e);else render()},
 go(el){const v=el.dataset.v;if(el.dataset.home){S.ui.preview=false;S.ui.menu=false;}if(v==='start')S.ui.step=0;location.hash='#'+v;if(location.hash==='#'+v&&S.ui.view===v)render(true)},
 pick(el){const k=el.dataset.k,v=el.dataset.v;if(k==='owned'){toggleOwned(v);render();return}const a=S.me[k],i=a.indexOf(v);i>-1?a.splice(i,1):a.push(v);render()},
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
  S.ui.step=0;location.hash='#wuensche';setTimeout(()=>{S.ui.modal='wish';S.ui.editWish=null;S.ui.wtab='eingeben';render()},50);
 },
 nudgehide(){try{localStorage.setItem('wishtale:nudge-hidden',String(Date.now()))}catch{/* nur für diese Sitzung */}S.ui.nudgeOff=true;render()},
 preview(el){S.ui.preview=el.dataset.v==='1';if(S.ui.preview)markStep('preview');render()},
 stepshide(){hideSteps(true);toast('Die Schritte sind ausgeblendet. Du findest sie unter deinem Namen oben rechts bei „Erste Schritte“.');render()},
 stepsshow(){hideSteps(false);S.ui.modal=null;location.hash='#wuensche';render(true);scrollTo({top:0,behavior:'smooth'})},
 vis(el){const k=el.dataset.k;S.me.vis[k]=(S.me.vis[k]||'alle')==='privat'?'alle':'privat';render()},
 wf(el){S.ui.wf=el.dataset.v;render()},wc(el){S.ui.wc=el.dataset.v;render()},
 selbst(el){const w=S.me.wishes.find(x=>x.id===el.dataset.id);w.status=w.status==='selbst'?'offen':'selbst';
  if(w.status==='selbst'&&(el.dataset.from==='view'||el.dataset.from==='undo')){if(el.dataset.from==='view'){S.ui.ff={id:w.id};S.ui.modal='fulfilled'}render();return} // 108: Glückwunsch statt Toast, Wunschfenster schließt
  if(el.dataset.from==='undo'){S.ui.ff=null;S.ui.modal=null;toast('Der Wunsch ist wieder auf deiner Liste.');render();return}
  toast(w.status==='selbst'?'Dann ist dieser Wunsch erledigt. Du findest ihn im Profil unter „Das habe ich schon“.':'Der Wunsch ist wieder auf deiner Liste.');render()},
 prio(el){const w=S.me.wishes.find(x=>x.id===el.dataset.id);w.prio=w.prio%3+1;toast('Priorität: '+PRIO[w.prio]);render()},
 delw(el){S.ui.modal=null;const old=S.me.wishes.find(x=>x.id===el.dataset.id);if(old&&old.img)dropImage(old.img);S.me.wishes=S.me.wishes.filter(x=>x.id!==el.dataset.id);render()},
 modal(el){if(el.dataset.v==='tour'){endGuide();S.ui.helpTab=el.dataset.help||'guides'}if(el.dataset.v==='wish'){S.ui.editWish=null;S.ui.wishImg=null;S.ui.wr=null;S.ui.wtab=el.dataset.tab||null;S.ui.ws=null;if(wishTab()==='ideen')loadSelfIdeas()}if(el.dataset.v==='zettel')S.ui.zt=null;if(el.dataset.v==='mailme')S.ui.mm=null;S.ui.modal=el.dataset.v;render();setTimeout(()=>(document.querySelector('.sheet .wpane:not([hidden]) input')||document.querySelector('.sheet input,.sheet select'))?.focus({preventScroll:true}),30)},
 close(){if(S.ui.guide)endGuide();if(S.ui.modal==='welcome'){markWelcomed();stopWelcome()}S.ui.modal=null;S.ui.editWish=null;render()},
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
 welcomego(){markWelcomed();stopWelcome();S.ui.editWish=null;S.ui.wishImg=null;S.ui.wr=null;S.ui.wtab='eingeben';S.ui.modal='wish';render();setTimeout(()=>document.querySelector('.sheet input,.sheet select')?.focus({preventScroll:true}),30)},
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
 google(){S.ui.authBusy=true;render();signInGoogle().then(({error})=>{if(error){S.ui.authBusy=false;S.ui.authMsg={type:'err',text:friendly(error)};render()}})},
 demo(){S.ui.authMsg=null;track('demo',{once:true,path:'/app/'});location.hash='#demo'},
 tologin(){S.ui.modal=null;S.ui.authMsg=null;location.hash='#start'},
 // Gast ohne Konto will ein eigenes Wishtale: UTM-Kürzel in die Adresse, damit signUp sie beim Konto speichert (Datenschutz Abschnitt 8)
 guestcta(el){const c=String(el?.dataset?.c||'liste').replace(/[^a-z-]/g,'')||'liste';
  try{history.replaceState(history.state,'',`/app/?utm_source=wishtale&utm_medium=gast&utm_campaign=${c}${location.hash}`)}catch{/* Adresse bleibt */}
  track('cta',{label:'gast-'+c,path:'/app/'});A.tologin()},
 exitdemo(){S.ui.modal=null;S.ui.authMsg=null;location.hash='#start'},
 logout(){signOut().finally(()=>{location.hash='';location.reload()})},
 guestretry(){S.guest=null;route()},
share(){
  markStep('share');markShared();
  // Echte Konten teilen den kurzen Link /w/<kürzel>: Er zeigt in WhatsApp und Co. eine Vorschau mit Namen und leitet zur Gastansicht (102)
  const url=S.auth.user&&S.me.handle&&!/^(localhost|127\.)/.test(location.hostname)?`${location.origin}/w/${S.me.handle}`:`${location.origin}${location.pathname}#p/${S.me.handle||S.ui.acct}`;
  const done=()=>toast('Dein Link ist kopiert und bereit zum Verschicken. (In der Demo öffnet er dein Profil nur in diesem Browser.)');
  if(navigator.share){navigator.share({title:`${S.me.name} bei Wishtale`,url}).catch(()=>{})}
  else if(navigator.clipboard?.writeText){navigator.clipboard.writeText(url).then(done,()=>toast(url))}
  else toast(url);
 },
 azopen(){
  /* Steht im Wunschformular schon ein Name, suchen wir damit direkt bei Amazon und tragen ihn im Fenster ein. */
  const q=(document.querySelector('form[data-form=wish] [name=t]')?.value||'').trim().slice(0,120);
  S.ui.az={q,text:'',res:null,title:'',price:'',c:'sonstiges',searched:!!q};S.ui.modal='amazon';
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
  reserveFlow(p,w).then(ok=>{if(ok)remember(p,w,{status:'reserved'});if(ok){const open=S.ui.modal!=='wishdetail'&&w.kind!=='erlebnis'&&w.kind!=='frei';toast(`Erledigt, der Wunsch ist für dich reserviert. ${p.name} erfährt davon nichts und andere Freunde sehen nur „reserviert“.`,open?{label:'Wo es das gibt',run:()=>{S.ui.pickId=w.id;S.ui.wishCtx='guest';S.ui.modal='wishdetail';render()}}:null)}render()}); // nach dem Reservieren aus der Liste führt der Hinweis zum Kaufweg (111)
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
readlink(el,auto){
  const f=wform();if(!f)return Promise.resolve();
  const raw0=f.elements.link.value.trim();
  if(raw0)f.querySelector('.wl-row')?.removeAttribute('hidden'); // die Link-Zeile erscheint erst, wenn es einen Link gibt (123)
  // Einfügen, Tippen und Verlassen des Feldes lösen alle aus: denselben Link nur einmal lesen.
  const seen=(f.dataset.read||'').split('\n');if(auto&&raw0&&seen.includes(raw0))return f._reading||Promise.resolve();
  f.dataset.read=raw0;
  // Speichern wartet auf dieses Ergebnis (prepWish), ein eigener Knopf zum Einlesen ist nicht mehr nötig.
  const job=readLinkNow(f,raw0);f._reading=job;job.finally(()=>{if(f._reading===job)f._reading=null});
  return job;
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
 ideaopen(el,e){ // 113: Karte als Fenster, Shop-Links und Knöpfe in der Karte wirken direkt
  const hit=e&&e.target.closest('a,button');if(hit&&hit!==el)return;
  S.ui.ideaOpen={k:el.dataset.k,t:el.dataset.t};S.ui.modal='idea';render();
 },
 ideano(el){if(S.ui.modal==='idea')S.ui.modal=null;hideIdea(el.dataset.t);if(el.dataset.self)saveSignal('no',el.dataset.t);track('choice',{label:'idea_no',path:'/app/'});render()},
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
  const c=guessCategory(w.t,w.c||'sonstiges');if(c!==w.c){w.c=c;w.a=cat(c).a;w.tone=cat(c).t}
  S.ui.modal=null;
  toast('Übernommen: Dein Wunsch ist jetzt „'+w.t+'“.',{label:'Rückgängig',run:()=>{Object.assign(w,old);render()}});render();
  // Direktlink und Bild im Hintergrund nachladen, nur wenn die Person den Wunsch inzwischen nicht zurückgesetzt hat
  const still=()=>w.t===i.t.slice(0,160);
  if(S.auth.user&&!w.link)findAmazonLink(i.t).then(r=>{if(r&&still()&&!w.link){w.link=r.url;render()}}).catch(()=>{});
  if(S.auth.user)fetchProductImage(null,i.q||i.t).then(async im=>{if(!still())return;let url=im.preview;if(S.me.dbId&&im.blob){try{url=await storeImage(im.blob)}catch{return}}w.img=url;w.imgSrc=im.src||'';render()}).catch(()=>{});
 },
 aivhave(el){ // „Habe ich schon“ bei einem Vorschlag zu einem Wunsch: als vorhanden notieren, nie wieder vorschlagen
  const i=ideasOf('wish:'+el.dataset.wid).find(x=>x.t===el.dataset.t);if(!i)return;
  const c=guessCategory(i.t);
  if(!S.me.wishes.some(w=>w.status==='selbst'&&w.t.toLowerCase()===i.t.toLowerCase()))S.me.wishes.unshift(W({t:i.t,c,kind:'produkt',prio:1,status:'selbst',vis:'alle',a:cat(c).a,tone:cat(c).t,kw:kwOf(i.t)}));
  saveSignal('have',i.t);hideIdea(i.t);toast('Notiert, das ist schon vorhanden. Solche Vorschläge zeigen wir nicht mehr.');render();
 },
 aihave(el){
  if(S.ui.modal==='idea')S.ui.modal=null;
  const i=[...ideasOf(skey(S.me.handle||'')),...ideasOf(gkey(S.me.handle||''))].find(x=>x.t===el.dataset.t);if(!i)return;
  const c=guessCategory(i.t);
  if(!S.me.wishes.some(w=>w.status==='selbst'&&w.t.toLowerCase()===i.t.toLowerCase()))S.me.wishes.unshift(W({t:i.t,c,kind:'produkt',prio:1,status:'selbst',vis:'alle',a:cat(c).a,tone:cat(c).t,kw:kwOf(i.t)}));
  saveSignal('have',i.t);hideIdea(i.t);toast('Notiert, das hast du schon. Solche Ideen zeigen wir dir nicht mehr.');render();
 },
 wdtab(el){ // Reiter im Wunschdialog wechseln, ohne neu zu zeichnen (Eingaben bleiben stehen)
  const v=el.dataset.v;S.ui.wtab=v;
  document.querySelectorAll('.wtab').forEach(b=>{const on=b.dataset.v===v;b.classList.toggle('on',on);b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});
  document.querySelectorAll('.wpane').forEach(p=>{p.hidden=p.id!=='wpane-'+v});
  if(v==='ideen'){loadSelfIdeas();drawIdeas()}
  if(!el.dataset.kb)setTimeout(()=>document.querySelector(`#wpane-${v} input`)?.focus({preventScroll:true}),20);
 },
 wsown(){ // Suchbegriff als eigenen Wunsch übernehmen
  const q=(S.ui.ws?.q||'').trim();A.wdtab({dataset:{v:'eingeben'}});
  const f=wform();if(f&&q&&!f.elements.t.value.trim()){f.elements.t.value=q;f.elements.t.dispatchEvent(new Event('input',{bubbles:true}))}
 },
 wsadd(el){ // Treffer aus der Suche speichern: Formular füllen und wie gewohnt speichern (Bild, Kategorie, Doppelte, Partnerlink)
  const z=S.ui.ws,i=+el.dataset.i,x=z&&z.items&&z.items[i],f=wform();if(!x||!f||z.adding!=null)return;
  z.adding=i;drawSearch();
  f.elements.t.value=x.t.slice(0,160);f.elements.link.value=x.url;f.dataset.read=x.url;f.querySelector('.wl-row')?.removeAttribute('hidden');
  if(f.elements.price)f.elements.price.value=x.price?String(x.price).replace('.',','):'';
  const sel=f.elements.c;if(sel&&!sel.dataset.touched)sel.value=guessCategory(x.t,sel.value);
  if(x.img)showWishImg({...x.img});
  S.ui.wr=null;f.requestSubmit();
  setTimeout(()=>{if(S.ui.modal==='wish'&&S.ui.ws){S.ui.ws.adding=null;const d=document.getElementById('wdup');if(d&&!d.hidden)A.wdtab({dataset:{v:'eingeben'}});drawSearch()}},1500); // doppelter Wunsch: Hinweis im Formular zeigen
 },
 aiplan(el){ // Idee: „Erfülle ich mir selbst“, privat und nur für den Geschmack (status plan)
  if(S.ui.modal==='idea')S.ui.modal=null;
  const i=ideasOf(skey(S.me.handle||'')).find(x=>x.t===el.dataset.t);if(!i)return;
  const c=guessCategory(i.t);
  S.me.wishes.unshift(W({t:i.t,c,kind:i.exp?'erlebnis':'produkt',prio:2,price:i.to||null,status:'plan',vis:'privat',a:i.exp?'ticket':cat(c).a,tone:cat(c).t,kw:kwOf(i.t)}));
  saveSignal('yes',i.t);hideIdea(i.t);toast('Notiert, das erfüllst du dir selbst. Niemand sieht es, und Wishtale schlägt es deinen Freunden nicht vor.');render();
 },
 aiadd(el){
  if(S.ui.modal==='idea')S.ui.modal=null;
  const i=[...ideasOf(skey(S.me.handle||'')),...ideasOf(gkey(S.me.handle||''))].find(x=>x.t===el.dataset.t);if(!i)return;
  const c=guessCategory(i.t);
  S.me.wishes.unshift(W({t:i.t,c,kind:i.exp?'erlebnis':'produkt',prio:2,price:i.to||null,a:i.exp?'ticket':cat(c).a,tone:cat(c).t,kw:kwOf(i.t)}));
  saveSignal('yes',i.t);hideIdea(i.t);toast('Schön, das steht jetzt auf deiner Wunschliste.');render();
  // Ideenkarten behalten ihr Symbol, das echte Bild kommt erst mit dem Wunsch (Jann, 2026-11-24): einmal suchen, im eigenen Speicher ablegen
  const w=S.me.wishes[0];
  if(S.auth.user&&S.me.dbId&&!i.exp)fetchProductImage(null,i.q||i.t).then(async im=>{if(w.img||w.t!==i.t||im.blank||Math.min(im.w||0,im.h||0)<200)return;const url=await storeImage(im.blob);if(w.img||w.t!==i.t)return;w.img=url;w.imgSrc=im.src||'';if(!S.ui.modal)render()}).catch(()=>{});
 },
 givenreact(el){
  const g=S.given.find(x=>x.id===el.dataset.id);if(!g)return;
  const o=['','ja','teils','nein'];saveGift({id:g.id,reaction:o[(o.indexOf(g.reaction||'')+1)%4]||null}).then(()=>render());
 },
 givendel(el){if(confirm('Dieses Geschenk aus deiner Liste entfernen?'))removeGift(el.dataset.id).then(()=>render())},
 homeideastoggle(){const show=!homeIdeasVisible();setHomeIdeasVisible(show);render();toast(show?'Die Vorschläge von Wishtale sind eingeblendet.':'Die Vorschläge sind eingeklappt, du kannst sie jederzeit wieder öffnen.');(document.getElementById('homeideas-toggle')||document.querySelector('.acctbtn'))?.focus({preventScroll:true})},
 demoprev(){demoStop();demoGo(demoStep()-1)},
 demonext(){demoStop();demoGo(demoStep()+1)},
 demotoggle(el){if(el.getAttribute('aria-pressed')==='true')demoStop();else{demoGo(demoStep()+1);demoPlay()}},
 ffsee(){S.ui.ff=null;S.ui.modal=null;S.ui.scrollTo='owned';if(location.hash==='#profil')render();else location.hash='#profil'},
 tipgo(el){const id=el.dataset.id;markDone(id);
  if(id==='kids'){S.ui.modal='accounts';render();setTimeout(()=>document.querySelector('form[data-form=child] input')?.focus(),60);return}
  if(id==='share'){A.share();render();return}
  if(id==='guestown'){A.guestcta({dataset:{c:'tipp'}});return}
  if(id==='coparent'){S.ui.scrollTo='managers';location.hash='#profil';return}
  render()},
 tipno(el){markDone(el.dataset.id);render();toast('Alles klar, dann zeigen wir das nicht mehr.')},
 previewres(){toast('So sehen es deine Freunde: Mit einem Tipp reservieren sie einen Wunsch, und du erfährst nicht, wer es war.')},
 newbar(){setNewbarDone();S.ui.zt=null;S.ui.modal='zettel';render()},
 newbarx(){setNewbarDone();render();toast('Alles klar. Einen Wunschzettel hochladen kannst du weiterhin über „Wunsch hinzufügen“ oder im Menü.')},
 apphintx(){dismissAppHint();render();toast('Alles klar. Du findest „Wishtale als App“ jederzeit im Menü.')},
 shopsave(){S.ui.menu=false;S.ui.modal='shopsave';render()},
 ssbm(el,e){e.preventDefault();toast('Zieh den Knopf in deine Lesezeichenleiste, dann wirkt er auf jeder Shopseite.')},
 async sscopy(el){try{await navigator.clipboard.writeText(el.dataset.v);toast('Adresse kopiert.')}catch{toast('Kopieren hat nicht geklappt, markier die Adresse bitte selbst.')}},
 async appinstall(){dismissAppHint();S.ui.menu=false;const r=await promptInstall();if(r==='manual'){S.ui.modal='appinstall';render();demoStart();return}S.ui.modal=null;render();if(r==='accepted')toast('Schön, Wishtale liegt jetzt auf deinem Home-Bildschirm.')},
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
 occnew(){S.ui.occEdit=null;S.ui.modal='occlist';render();setTimeout(()=>document.getElementById('on')?.focus({preventScroll:true}),30)},
 occedit(){if(!S.me.occasion)return;S.ui.occEdit=S.ui.acct;S.ui.modal='occlist';render()},
 occdel(el){ // Anlass-Liste mit allen Wünschen löschen, die eigene Wunschliste bleibt
  const id=el.dataset.id,a=S.accounts[id];if(!a||!a.occasion)return;
  if(!confirm(`Die Liste „${a.name}“ mit ${a.wishes.length===1?'einem Wunsch':a.wishes.length+' Wünschen'} löschen? Der Link funktioniert danach nicht mehr.`))return;
  a.wishes.forEach(w=>{if(w.img)dropImage(w.img)});
  deleteProfile(id).then(()=>{S.ui.modal=null;S.ui.occEdit=null;switchTo('me');location.hash='#wuensche';toast('Die Liste ist gelöscht. Deine eigene Wunschliste ist unverändert.');render(true)}).catch(()=>toast('Das Löschen hat gerade nicht geklappt. Bitte versuch es gleich noch einmal.'))},
 invite(){const m=S.me,n=['Onkel Tom','Patentante Sarah','Opa Heinz'].find(x=>!m.invited.includes(x));if(n){m.invited.push(n);toast('Simuliert: Einladung an '+n+' erstellt. Nur Eingeladene sehen das Profil.')}else toast('Alle Beispiel-Einladungen sind vergeben.');render()},
 pb(el){
  S.ui.pb=+el.dataset.v||0;
  const h=S.ui.view==='gast'?S.ui.person:S.me.handle;
  if(S.ui.view==='gast')loadIdeas(gkey(h),{h},()=>{if(S.ui.view==='gast'&&!S.ui.modal)render()});
  else if(S.auth.user&&h){loadIdeas(skey(h),{h,mode:'self',n:signalCount()},()=>{if(S.ui.view==='entdecken'&&!S.ui.modal)render()});if(S.ui.preview)loadIdeas(gkey(h),{h},()=>{if(S.ui.preview&&!S.ui.modal)render()})}
  render();
 },
 occ(el){S.ui.occ=el.dataset.v;S.ui.budget=el.dataset.v==='danke'?40:100;render()},
 onlyopen(el){S.ui.onlyOpen=el.dataset.v==='1';render()},
 wview(el){S.ui.wview=el.dataset.v;render()},
 suggest(el){S.ui.pickId=el.dataset.id;S.ui.wishCtx='guest';S.ui.modal='wishdetail';render()}
};
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;if(t.dataset.step==='people')markStep('people');const f=A[t.dataset.act];if(f){guideClick(t);f(t,e)}});
document.addEventListener('change',async e=>{
  if(e.target.name!=='img'||!e.target.closest('form[data-form=wish]')||!e.target.files||!e.target.files[0])return;
  try{const d=await downscale(e.target.files[0]);showWishImg({blob:d.blob,preview:d.preview,src:'',manual:true})}catch(err){toast(err.message||'Dieses Bild lässt sich nicht öffnen.')}
});
document.addEventListener('change',e=>{if(e.target.name==='t'&&e.target.closest?.('form[data-form=wish]')&&!S.ui.editWish&&!e.target.dataset.skip){const v=e.target.value.trim().slice(0,120);if(S.ui.wr&&S.ui.wr.t===v&&S.ui.wr.st)return;previewWish(e.target.value)}}); // beim Verlassen des Feldes (zum Beispiel Klick auf „Passt“) nicht noch einmal suchen
// Die Erkennung startet schon beim Tippen und Einfügen (nach kurzer Pause), nicht erst beim Verlassen des Feldes.
// Bei offenem Fenster scrollt am Handy nur das Fenster selbst, nie die Wunschliste dahinter (iOS ignoriert overflow allein manchmal)
document.addEventListener('touchmove',e=>{if(!document.querySelector('.scrim'))return;if(!e.target.closest?.('.sheet,.drawer,.tour'))e.preventDefault()},{passive:false});
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
let wlT;document.addEventListener('input',e=>{if(e.target.id!=='wl')return;clearTimeout(wlT);const v=e.target.value.trim();if(/^https?:\/\/\S+\.\S+/i.test(v))wlT=setTimeout(()=>{if(e.target.value.trim()===v)A.readlink(null,true)},700)}); // getippter Link wird nach kurzer Pause gelesen
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
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(S.ui.guide){A.guideend();return}if(S.ui.menu)A.menuclose();else if(S.ui.modal)A.close()}});
document.addEventListener('submit',e=>{
  const f=e.target.closest('form[data-form]');if(!f)return;e.preventDefault();
  if(f.dataset.form==='wish'&&!f.dataset.ready){const p=prepWish(f);if(p){if(f.dataset.busy)return;f.dataset.busy='1';p.then(ok=>{delete f.dataset.busy;if(ok&&f.isConnected){f.dataset.ready='1';f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));delete f.dataset.ready}});return}}
  if(f.dataset.form==='wsearch'){runSearch(new FormData(f).get('q'));return}
  guideSubmit(f);
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
  if(kind==='mailme'){ // Gast: Link zu den eigenen Reservierungen per Mail (106)
    const email=(fd.get('email')||'').trim(),handle=S.guest?.handle||S.ui.person||'';
    S.ui.mm={email,busy:true};render();
    fetch('/api/account?op=mailme',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,handle,token:guestToken()})})
      .then(async r=>{const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Das hat leider nicht geklappt.');S.ui.mm={sent:true};render()})
      .catch(e=>{S.ui.mm={email,error:e.message};render()});
    return;
  }
  if(kind==='owned'){
    const t=(fd.get('t')||'').trim();if(!t)return;
    addOwned(t);
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
  if(kind==='occlist'){ // Liste für einen Anlass anlegen oder ändern (Dev 009)
    const name=String(fd.get('name')||'').trim().slice(0,60);if(!name)return;
    const occ=OCCASIONS.some(([k])=>k===fd.get('occ'))?fd.get('occ'):'sonstiges';
    const date=/^\d{4}-\d{2}-\d{2}$/.test(String(fd.get('date')||''))?String(fd.get('date')):'';
    const ed=S.ui.occEdit&&S.accounts[S.ui.occEdit];
    if(ed){ed.name=name;ed.occasion=occ;ed.odate=date;S.ui.modal=null;S.ui.occEdit=null;toast('Gespeichert.');render(true);return}
    const id=nid('o');
    S.accounts[id]={id,name,occasion:occ,odate:date,managed:false,tone:Object.keys(S.accounts).length%6,invited:[],interests:[],cats:[],brands:[],tries:[],nogos:[],alts:[],vis:{},wishes:[],history:[],inbox:[]};
    S.ui.modal=null;switchTo(id);location.hash='#wuensche';
    toast(`Die Liste „${name}“ ist angelegt. Trag die ersten Wünsche ein und teile dann den Link.`);render(true);return;
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
  if(kind==='custom'){const v=(fd.get('v')||'').trim(),k=fd.get('k');if(k==='owned'){if(v)addOwned(v);render();return}if(v&&!S.me[k].includes(v))S.me[k].push(v);render()}
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
      const c=(m&&(m.cand?.c||m.c))||guessCategory(t);
      const nw=W({t,c,kind:w.kind,prio:2,price:cand&&cand.price?cand.price:w.price,note:w.note||'',a:w.kind==='erlebnis'?'ticket':cat(c).a,tone:cat(c).t,kw:kwOf(t)});
      S.me.wishes.unshift(nw);if(cand&&S.auth.user)imgs.push({w:nw,cand});n++;
    });
    if(imgs.length)setTimeout(()=>zettelImages(imgs),50);
    if(n)setTimeout(()=>smartCats(S.me.wishes.slice(0,n),()=>{if(!S.ui.modal)render()}),400); // Unklare Wünsche ordnet die KI nach (100)
    if(n)setTimeout(()=>amzFill(S.me.wishes.slice(0,n).filter(w=>!imgs.some(x=>x.w===w)),()=>{if(!S.ui.modal)render()}),1500); // genaue Wünsche ohne Treffer direkt mit Amazon verlinken (111)
    if(n)setTimeout(()=>imgFill(S.me.wishes.slice(0,n).filter(w=>!imgs.some(x=>x.w===w)),()=>{if(!S.ui.modal)render()},{max:6}),2500); // echte Produktbilder für genaue Wünsche ohne Treffer
    if(n)setTimeout(()=>priceFill(S.me.wishes.slice(0,n),()=>{if(!S.ui.modal)render()},{max:6}),4000); // echte Preise von Produktseiten, nie geschätzt
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
  if(kind==='firstwish'){const t=String(fd.get('t')||'').trim().slice(0,120);S.ui.editWish=null;S.ui.wishImg=null;S.ui.wr=null;S.ui.wtab='eingeben';S.ui.ws=null;S.ui.prefill=t;S.ui.modal='wish';render();setTimeout(()=>{S.ui.prefill=''},300);setTimeout(()=>{const f=wform();if(f&&t){f.elements.t.value=t;previewWish(t)}document.getElementById(t?'wl':'wt')?.focus({preventScroll:true})},60);return}
  if(kind==='wish'){
    // Doppelt? Einmal freundlich hinweisen, beim zweiten Klick trotzdem speichern.
    const dup=findDupe(S.me.wishes,{t:(fd.get('t')||'').trim(),link:(fd.get('link')||'').trim()},S.ui.editWish);
    if(dup&&f.dataset.dupok!==dup.id){f.dataset.dupok=dup.id;const el=f.querySelector('#wdup');if(el){el.hidden=false;el.textContent=`„${dup.t}“ steht schon auf deiner Wunschliste. Wenn du ihn trotzdem noch einmal anlegen möchtest, tippe noch einmal auf Speichern.`;el.scrollIntoView({block:'center',behavior:'smooth'})}return}
    Promise.all([amazonLink((fd.get('link')||'').trim()),finalImage()]).then(([link,fi])=>{const done=(img,imgSrc,removed)=>{
      const c=fd.get('c'),t=fd.get('t').trim(),k=fd.get('kind'),plan=fd.get('plan')==='1',noSuggest=fd.get('nosug')==='1';
      if(S.ui.editWish){
        const w=S.me.wishes.find(x=>x.id===S.ui.editWish);
        if(w){const keep=w.c===c&&w.kind===k;if(w.img&&(removed||(img&&img!==w.img)))dropImage(w.img);Object.assign(w,{noSuggest,t,c,kind:k,prio:+fd.get('prio'),link,price:parsePrice(fd.get('price')),occ:fd.getAll('occ'),budget:+fd.get('budget')||null,note:(fd.get('note')||'').trim(),vis:plan?'privat':fd.get('vis'),status:plan?'plan':(w.status==='plan'?'offen':w.status),kw:kwOf(t),img:removed?null:(img||w.img||null),imgSrc:removed?'':(img?(imgSrc||''):(w.imgSrc||'')),...(keep?{}:{a:k==='erlebnis'?'ticket':cat(c).a,tone:cat(c).t})})}
        if(w&&removed)skipImage(w);else if(w&&wantsImage(w))setTimeout(()=>imgFill([w],()=>{if(!S.ui.modal)render()}),50); // neuer Name oder Link ohne Bild: echtes Produktbild suchen
        if(w&&wantsPrice(w))setTimeout(()=>priceFill([w],()=>{if(!S.ui.modal)render()}),1200); // ohne Preis: echten Preis der Produktseite holen
        S.ui.editWish=null;S.ui.modal=null;toast('Gespeichert.');render();return;
      }
      S.me.wishes.unshift(W({noSuggest,t,c,kind:k,prio:+fd.get('prio'),link,price:parsePrice(fd.get('price')),occ:fd.getAll('occ'),budget:+fd.get('budget')||null,note:(fd.get('note')||'').trim(),vis:plan?'privat':fd.get('vis'),status:plan?'plan':'offen',a:k==='erlebnis'?'ticket':cat(c).a,tone:cat(c).t,img,imgSrc:imgSrc||''}));
      if(!f.elements.c?.dataset.touched){const nw=S.me.wishes[0];setTimeout(()=>smartCats([nw],()=>{if(!S.ui.modal)render()}),300)} // nur wenn niemand die Kategorie selbst gewählt hat (100)
      {const nw=S.me.wishes[0];if(removed)skipImage(nw);else if(wantsImage(nw))setTimeout(()=>imgFill([nw],()=>{if(!S.ui.modal)render()}),50)} // echtes Produktbild im Hintergrund, eigenes Foto bleibt immer
      {const nw=S.me.wishes[0];if(wantsPrice(nw))setTimeout(()=>priceFill([nw],()=>{if(!S.ui.modal)render()}),1100)} // ohne Preis: echten Preis der Produktseite holen, nie schätzen
      {const nw=S.me.wishes[0];if(wantsAmazon(nw))setTimeout(()=>amzFill([nw],(w,r)=>{if(!S.ui.modal)render();toast('Wishtale hat genau dieses Produkt bei Amazon gefunden und verlinkt: '+r.title,{label:'Rückgängig',run:()=>{w.link='';render()}})}),900)} // direkte Produktseite statt Suche (111)
      S.ui.modal=null;S.ui.wf='offen';S.ui.wc='alle';const ideas=!link&&k!=='erlebnis'&&!noSuggest&&!plan;S.ui.wr=null;toast(ideas?'Der Wunsch ist gespeichert, und deine Freunde sehen dazu passende Ideen von Wishtale.':'Der Wunsch ist gespeichert.',ideas?{label:'So sehen es Freunde',run:()=>{S.ui.preview=true;markStep('preview');render();scrollTo({top:0,behavior:'smooth'})}}:null);render();
    };
    if(fi.failed)toast('Das Bild konnte nicht gespeichert werden. Der Wunsch ist ohne Bild gespeichert, du kannst es später erneut versuchen.');
    S.ui.wishImg=null;done(fi.img,fi.src,fi.removed);
    });
  }
});

document.addEventListener('keydown',e=>{
 if(e.key!=='Tab'||S.ui.modal!=='tour')return;
 const list=[...document.querySelectorAll('.tour button,.tour summary,.tour a[href]')].filter(el=>el.getClientRects().length&&!el.disabled);
 const first=list[0],last=list.at(-1);if(!first)return;
 if(e.shiftKey&&(document.activeElement===first||!document.activeElement?.closest('.tour'))){e.preventDefault();last.focus()}
 else if(!e.shiftKey&&(document.activeElement===last||!document.activeElement?.closest('.tour'))){e.preventDefault();first.focus()}
});
/* Reiter im Wunschdialog: Pfeiltasten, Pos1 und Ende wechseln wie bei Reitern üblich */
document.addEventListener('keydown',e=>{
 const t=e.target;if(!t.matches?.('.wtab'))return;
 const all=[...document.querySelectorAll('.wtab')],i=all.indexOf(t);
 const j={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:all.length-1}[e.key];if(j===undefined)return;
 e.preventDefault();const n=all[(j+all.length)%all.length];A.wdtab({dataset:{v:n.dataset.v,kb:1}});n.focus();
});
