import { loadIdeas, gkey, skey } from './lib/ideas.js';
import { signalCount } from './lib/signals.js';
import { S, saveState, setDemo, ensureDraft } from './state.js';
import { $, esc } from './lib/util.js';
import { Header, BottomNav, GuestHeader, LoginHeader, LegalFoot } from './views/shared.js';
import { Start, Profil } from './views/profile.js';
import { Wuensche } from './views/wishes.js';
import { Historie } from './views/history.js';
import { Entdecken } from './views/inspiration.js';
import { Plan } from './views/plan.js';
import { loadPlan } from './lib/plan.js';
import { Gast } from './views/giver.js';
import { Login, Recovery } from './views/auth.js';
import { Einladung } from './views/invite.js';
import { peekInvite } from './lib/invite.js';
import { fetchPublic, scheduleSync } from './lib/remote.js';
import { loadPinterest, pinConsent } from './lib/social.js';
import { Modal } from './views/modals.js';
import { track } from './lib/track.js';

export const VIEWS={plan:Plan,start:Start,profil:Profil,wuensche:Wuensche,historie:Historie,entdecken:Entdecken,gast:Gast,login:Login,recovery:Recovery,einladung:Einladung};
const DEFAULT_VIEW='wuensche';

let lastModalKey='';
function afterRender(){
  if(S.ui.modal!=='pins'||!pinConsent())return;
  const box=document.querySelector('.pinwrap');if(!box)return;
  loadPinterest().then(ok=>{
    if(!document.body.contains(box))return;
    if(ok&&window.PinUtils){window.PinUtils.build(box)}
    else{const a=box.querySelector('a');box.innerHTML=`<p class="muted">Die Pins konnten nicht geladen werden. Vielleicht blockiert ein Werbeblocker Pinterest. Du kannst sie ${a?`<a href="${a.href}" target="_blank" rel="noopener noreferrer">direkt auf Pinterest öffnen</a>`:'direkt auf Pinterest öffnen'}.</p>`}
  });
}
export function render(top){
  const y=window.scrollY,v=S.ui.view;
  // Scrollposition im Fenster merken: gleiches Fenster bleibt, wo es war, ein neues beginnt ganz oben.
  const oldSheet=document.querySelector('.sheet');
  const sheetY=oldSheet?oldSheet.scrollTop:0;
  const modalKey=S.ui.modal?`${S.ui.modal}:${S.ui.pickId||''}:${S.ui.worldId||''}`:'';
  // Vorladen: Gast-Ideen und eigene Inspiration im Hintergrund holen, damit sie beim Öffnen schon da sind (der Server antwortet bei unverändertem Profil aus dem Zwischenspeicher).
  if(S.auth.user&&S.me.handle&&v!=='gast'){loadIdeas(gkey(S.me.handle),{h:S.me.handle},()=>{if(S.ui.preview&&['profil','wuensche'].includes(S.ui.view)&&!S.ui.modal)render()});if(v!=='entdecken')loadIdeas(skey(S.me.handle),{h:S.me.handle,mode:'self',n:signalCount()},()=>{if(S.ui.view==='entdecken'&&!S.ui.modal)render()})}
  if(v==='entdecken'&&S.auth.user&&S.me.handle)loadIdeas(skey(S.me.handle),{h:S.me.handle,mode:'self',n:signalCount()},()=>{if(S.ui.view==='entdecken'&&!S.ui.modal)render()});
  if((v==='profil'||v==='wuensche')&&S.ui.preview&&S.auth.user&&S.me.handle)loadIdeas(gkey(S.me.handle),{h:S.me.handle},()=>{if(S.ui.view===v&&S.ui.preview&&!S.ui.modal)render()});
  if(v==='plan'&&S.auth.user)loadPlan(()=>{if(S.ui.view==='plan'&&!S.ui.modal)render()});
  const body=VIEWS[v]();
  if(v==='login'||v==='recovery'||v==='einladung'){
    $('#app').innerHTML=LoginHeader()+`<main id="main" class="appmain">${body}</main>`+LegalFoot();
    window.scrollTo(0,0);
    return;
  }
  if(v==='start'&&!S.auth.user){
    // Einrichtung ohne Konto: ruhige Seite ohne App-Navigation, das Konto kommt erst danach
    $('#app').innerHTML=LoginHeader()+`<main id="main" class="appmain">${body}</main>`+LegalFoot();
    window.scrollTo(0,top?0:y);
    saveState();
    return;
  }
  if(v==='gast'){
    $('#app').innerHTML=GuestHeader()+`<main id="main" class="appmain">${body}</main>`+LegalFoot()+Modal();
    window.scrollTo(0,top?0:y);
    const gs=document.querySelector('.sheet');
    if(gs)gs.scrollTop=(modalKey&&modalKey===lastModalKey)?sheetY:0;
    lastModalKey=modalKey;
    afterRender();
    return;
  }
  $('#app').innerHTML=Header(v)
    +(S.me.managed?`<div class="mgbar">Du verwaltest das Konto von ${esc(S.me.name)}.<button data-act="acct" data-id="me">Zurück zu ${esc(S.accounts.me.name)}</button></div>`:'')
    +`<main id="main" class="appmain">${body}</main>`
    +LegalFoot()+BottomNav(v)+Modal();
  window.scrollTo(0,top?0:y);
  const sheet=document.querySelector('.sheet');
  if(sheet)sheet.scrollTop=(modalKey&&modalKey===lastModalKey)?sheetY:0;
  lastModalKey=modalKey;
  afterRender();
  saveState();
  scheduleSync();
}

export function route(){
  let h=location.hash.replace('#','');
  if(h==='login')h='anmelden';  // alter Link
  const guest=h.match(/^p\/([\w-]+)$/);
  const inv=h.match(/^einladung\/([0-9a-f]{16,100})$/i);
  const anon=!S.auth.user;
  if(!(anon&&h==='start')&&S.ui.acct==='draft')S.ui.acct='me';
  if(inv){S.ui.view='einladung';startInvite(inv[1])}
  else if(guest){
    S.ui.person=guest[1];S.ui.view='gast';startGuest(guest[1]);
  }
  else if(!anon&&h==='neues-passwort'){S.ui.view='recovery'}
  else if(anon&&h==='demo'){setDemo(true);history.replaceState(null,'',location.pathname+'#wuensche');S.ui.view='wuensche'}
  else if(anon&&h==='start'){setDemo(false);ensureDraft();S.ui.acct='draft';S.ui.view='start'}
  else if(anon&&(h==='registrieren'||h==='anmelden'||h==='passwort-vergessen'||!S.auth.demo)){
    // Anmelden und Registrieren sind eigene Seiten und beenden die Demo
    setDemo(false);ensureDraft();
    S.ui.authTab=h==='registrieren'?'up':h==='passwort-vergessen'?'forgot':'in';S.ui.view='login';
  }
  else if(h==='schenken'){location.hash='#p/jonas';return}  // alter Link
  else S.ui.view=(h in VIEWS&&h!=='gast'&&h!=='login'&&h!=='recovery'&&!(anon&&h==='start'))?h:DEFAULT_VIEW;
  S.ui.modal=null;
  if(S.ui.view==='start'&&anon)track('start',{once:true,path:'/app/'});
  if(S.ui.view==='gast')track('guest_view',{once:true,path:'/app/'});
  render(true);
}

/* Gast-Profil aus der Datenbank laden. Gibt es das Handle dort nicht, greifen die lokalen Demo-Profile. */
function startInvite(code){
  if(S.ui.inv&&S.ui.inv.code===code&&S.ui.inv.status!=='bad')return;
  S.ui.inv={code,status:'loading',data:null,keep:[],name:undefined};
  peekInvite(code).then(d=>{if(S.ui.inv?.code!==code)return;S.ui.inv=d?{code,status:'ok',data:d,keep:(d.tips||[]).map(()=>true),name:undefined}:{code,status:'bad'};if(S.ui.view==='einladung')render(true)})
   .catch(()=>{if(S.ui.inv?.code!==code)return;S.ui.inv={code,status:'bad'};if(S.ui.view==='einladung')render(true)});
}
function startGuest(handle){
  if(S.guest&&S.guest.handle===handle&&S.guest.status!=='error'){return}
  S.guest={handle,status:'loading',person:null};
  fetchPublic(handle)
    .then(p=>{if(S.guest?.handle!==handle)return;S.guest={handle,status:'ready',person:p};if(S.ui.view==='gast')render(true);loadIdeas(gkey(handle),{h:handle},()=>{if(S.ui.view==='gast'&&!S.ui.modal)render()})})
    .catch(e=>{console.error(e);if(S.guest?.handle!==handle)return;S.guest={handle,status:S.people[handle]?'ready':'error',person:null};if(S.ui.view==='gast')render(true)});
}
export function refreshGuest(){
  const h=S.guest?.handle;if(!h)return Promise.resolve();
  return fetchPublic(h).then(p=>{if(S.guest?.handle===h){S.guest.person=p;render()}});
}
