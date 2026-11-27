import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/schibsted-grotesk/index.css';
import './styles/main.css';
import { loadState, switchTo, unsaved } from './state.js';
import { S } from './state.js';
import { sb } from './lib/supabase.js';
import { enter, adoptDraft, googleOn, viaOAuth, isGhost, startGhost, signInGoogle, nameFromUser } from './lib/auth.js';
import { scheduleSync } from './lib/remote.js';
import { adoptCoInvite, sharedKey } from './lib/coparent.js';
import { toast } from './lib/util.js';
import { adoptInvite } from './lib/invite.js';
import { route, render } from './render.js';
import './actions.js';
import { loadPromo } from './lib/promo.js';
import { initPwa, takeShare, pendingShare, standalone } from './lib/pwa.js';
import { track, setStatsOff, watchShopClicks, watchIgClicks } from './lib/track.js';
import { loadGiven, migrateGiven } from './lib/given.js';

initPwa();
const savedMsg=n=>`Geschafft, ${n===1?'dein Wunsch ist':`deine ${n} Wünsche sind`} jetzt in deinem Konto gespeichert und bereit zum Teilen.`;
/** Ein an Wishtale geteilter Link (Android) öffnet nach der Anmeldung den Wunschdialog und wird dort eingelesen. */
function openShared(){
  const sh=pendingShare();if(!sh)return;
  S.ui.modal='wish';S.ui.editWish=null;S.ui.wishImg=null;S.ui.wr=null;S.ui.wtab='eingeben';S.ui.prefill=sh.title||'';render();
  setTimeout(()=>{const l=document.getElementById('wl');if(l&&sh.url){l.value=sh.url;l.dispatchEvent(new Event('change',{bubbles:true}))}S.ui.prefill='';},80);
}
/** Admins zählen nicht mit (bleibt im Browser gemerkt), alle anderen melden einmal „App geöffnet“, im Browser oder vom Home-Bildschirm. */
async function countOpen(){
  try{const {data}=await sb.rpc('is_admin');if(data===true){setStatsOff(true);return}}catch{/* ohne Antwort einfach zählen */}
  if(S.ui.view!=='gast')track('app_open',{once:true,label:standalone()?'pwa':'browser',path:'/app/'});
}
/** Link aus der Reservierungs-Mail (?gt=…): Gast-Schlüssel auf diesem Gerät übernehmen, Adresse aufräumen (106). */
function takeGuestToken(){
  try{
    const q=new URLSearchParams(location.search),t=q.get('gt');if(!t)return;
    if(/^[0-9a-f]{32,200}$/i.test(t)){const old=localStorage.getItem('wishtale:guest');if(old&&old!==t)localStorage.setItem('wishtale:guest-prev',old);localStorage.setItem('wishtale:guest',t);setTimeout(()=>toast('Deine Reservierungen sind jetzt auch auf diesem Gerät da.'),900)}
    q.delete('gt');history.replaceState(null,'',location.pathname+(q.toString()?'?'+q:'')+location.hash);
  }catch{/* ohne Speicher bleibt es beim bisherigen Schlüssel */}
}
/** Stilles Gastkonto anlegen (141): Die Wunschliste ist sofort da, Suche, Ideen und Fotoimport laufen wie mit Konto. Ohne Erlaubnis in Supabase bleibt es beim Entwurf im Browser. */
let ghostBusy=false;
async function beginGhost(h){
  if(ghostBusy||S.auth.user)return;ghostBusy=true;S.ui.ghosting=true;
  const u=await startGhost();
  if(!u){S.ui.ghosting=false;ghostBusy=false;
    if(h==='abfotografieren'){S.ui.authMsg={type:'ok',text:'Zum Einlesen deines Wunschzettels brauchst du ein Konto. Mit Google geht das mit einem Klick.'};location.hash='#registrieren'}
    return}
  await enter(u);
  await migrateGiven().catch(()=>0);await loadGiven().catch(()=>{});
  adoptDraft(); // was im Browser schon stand, kommt ins Gastkonto
  S.ui.ghosting=false;ghostBusy=false;
  track('step',{label:'ghost_start',once:true,path:'/app/'});
  if(h==='abfotografieren')S.ui.after='zettel';
  history.replaceState(null,'',location.pathname+location.search+'#wuensche');
  route();countOpen();
  if(!S.ui.google)googleOn().then(v=>{S.ui.google=v;if(v&&!S.ui.modal&&!document.activeElement?.matches?.('input,textarea'))render()});
}
window.addEventListener('wishtale:ghost',e=>{beginGhost(e.detail)});
/**
 * Verlassen ohne Konto (141): Einmal je Sitzung erscheint „Sichere deine Wunschliste“, am Computer wenn die Maus oben aus der Seite geht,
 * am Handy wenn man nach einer Weile in einer anderen App zurückkommt oder ab dem dritten Wunsch. Ein Browser-Dialog beim Schließen bleibt bewusst aus.
 */
function guardLeave(){
  const open=()=>(S.me?.wishes||[]).filter(w=>w.status==='offen'||w.status==='plan').length;
  let asked=false;try{asked=sessionStorage.getItem('wishtale:save-asked')==='1'}catch{/* ohne Speicher je Seitenaufruf */}
  const ask=why=>{
    if(asked||!unsaved()||!open()||S.ui.modal||S.ui.menu||S.ui.view!=='wuensche'||document.activeElement?.matches?.('input,textarea'))return;
    asked=true;try{sessionStorage.setItem('wishtale:save-asked','1')}catch{/* egal */}
    S.ui.saveWhy='exit';S.ui.modal='sichern';track('step',{label:'save_prompt:'+why,path:'/app/'});render();
  };
  document.addEventListener('mouseout',e=>{if(!e.relatedTarget&&e.clientY<=0)ask('exit')});
  let hid=0;document.addEventListener('visibilitychange',()=>{if(document.hidden)hid=Date.now();else if(hid&&Date.now()-hid>15000)ask('back')});
  window.addEventListener('wishtale:wishadded',()=>{if(open()>=3&&matchMedia('(max-width:719px)').matches)setTimeout(()=>ask('third'),900)});
}
guardLeave();
/** Name nach dem Sichern übernehmen: Gastkonten heißen bis dahin „Ich“. */
function nameAfterSave(user){
  const n=nameFromUser(user),me=S.accounts.me;
  if(n&&me&&(!me.name||me.name==='Ich')){me.name=n;scheduleSync()}
}
async function boot(){
  takeShare();takeGuestToken();
  const recoveryLink=/type=recovery/.test(location.hash); // vor getSession merken, Supabase räumt die Adresse danach auf
  loadState(); // Demo-Daten (nur ohne Konto relevant)
  // Verarbeitet auch Login-Links aus E-Mails (Tokens im URL-Fragment), bevor der Router läuft.
  let session=null;
  try{ session=(await sb.auth.getSession()).data.session; }catch(e){ console.error(e); }
  const fromLink=/access_token|error_description/.test(location.hash);
  let linked=false;
  try{linked=sessionStorage.getItem('wishtale:ghostlink')==='1';sessionStorage.removeItem('wishtale:ghostlink')}catch{/* nichts */}
  if(session&&linked&&isGhost(session.user)&&/identity_already_exists|already.*linked|already.*exists/i.test(decodeURIComponent(location.hash))){
    // Das Google-Konto gibt es schon: dort anmelden, die Wünsche aus dem Gastkonto liegen im Entwurf und kommen mit (adoptDraft)
    track('step',{label:'ghost_save:exists',path:'/app/'});
    await signInGoogle();return;
  }
  if(session){
    await enter(session.user);
    await migrateGiven().catch(()=>0);await loadGiven().catch(()=>{});
    const saved=fromLink&&!isGhost(session.user)&&(linked||/type=email_change/.test(location.hash)||S.accounts.me?.name==='Ich');
    if(saved){nameAfterSave(session.user);track('step',{label:'ghost_saved:'+(viaOAuth(session.user)?'google':'email'),path:'/app/'})}
    const adopted=recoveryLink||isGhost(session.user)?false:adoptDraft();
    const invd=recoveryLink?false:await adoptInvite().catch(()=>false);
    const cod=recoveryLink?null:await adoptCoInvite().catch(()=>null);
    if(cod){const k=sharedKey(cod.kid);if(k)switchTo(k);history.replaceState(null,'',location.pathname+'#wuensche');setTimeout(()=>toast(`Du verwaltest jetzt gemeinsam mit ${cod.from} das Wishtale von ${cod.kid}.`),500)}
    if(recoveryLink){
      history.replaceState(null,'',location.pathname+'#neues-passwort');
    }else if(saved&&!(adopted&&adopted.wishes)){
      history.replaceState(null,'',location.pathname+'#wuensche');
      setTimeout(()=>toast('Deine Wunschliste ist gesichert. Jetzt kannst du sie teilen.'),500);
    }else if(invd&&invd.n){
      history.replaceState(null,'',location.pathname+'#wuensche');
      setTimeout(()=>toast(`Willkommen bei Wishtale. ${invd.from} hat dir ${invd.n===1?'einen Tipp':'ein paar Tipps'} mitgebracht, du findest ${invd.n===1?'ihn':'sie'} in deiner Wunschliste.`),500);
    }else if(adopted){
      history.replaceState(null,'',location.pathname+'#wuensche');
      // Neues Konto ohne Profil: die leere Wunschliste mit ihrem einen Feld ist der erste Bildschirm, ohne Fenster darüber (137)
      if(adopted&&adopted.wishes)setTimeout(()=>toast(savedMsg(adopted.wishes)),500);
      else if(adopted==='quick'){if(fromLink&&!viaOAuth(session.user))setTimeout(()=>toast('Deine E-Mail ist bestätigt. Schreib jetzt einfach deinen ersten Wunsch auf.'),500)}
      else setTimeout(()=>toast(fromLink&&!viaOAuth(session.user)?'Deine E-Mail ist bestätigt, du bist angemeldet und dein Wishtale ist angelegt. Jetzt fehlen nur noch deine Wünsche.':'Dein Wishtale ist angelegt. Jetzt fehlen nur noch deine Wünsche.'),400);
    }else if(fromLink||!location.hash||['#login','#anmelden','#registrieren','#demo'].includes(location.hash)){
      history.replaceState(null,'',location.pathname+'#wuensche');
      if(fromLink)setTimeout(()=>toast(viaOAuth(session.user)?'Du bist mit Google angemeldet. Willkommen bei Wishtale.':'Deine E-Mail ist bestätigt und du bist jetzt angemeldet. Willkommen bei Wishtale.'),500);
    }
  }else if(fromLink){
    history.replaceState(null,'',location.pathname+'#anmelden');
  }
  if(!session||isGhost(session.user)){if(!session)await loadGiven().catch(()=>{});googleOn().then(v=>{S.ui.google=v;if(v&&(!S.auth.user||isGhost(S.auth.user))&&(S.ui.view==='login'||S.ui.acct==='draft'||isGhost(S.auth.user))&&!S.ui.modal&&!document.activeElement?.matches?.('input'))render()})}
  window.addEventListener('hashchange',route);
  watchShopClicks(); // Klicks zu Shops zählen, ohne Produkt (111)
  watchIgClicks('/app/'); // Folgen-Links zu Instagram (140)
  route();
  if(session){openShared();countOpen()}
  /* Kein Willkommens-Rundgang mehr: Der erste Bildschirm ist die Wunschliste mit einem Feld (Feedback der ersten Testerinnen). */
  loadPromo().then(p=>{S.promo=p;if(['entdecken','gast','profil','wuensche'].includes(S.ui.view)&&!S.ui.modal&&!document.activeElement?.matches?.('input,textarea,select'))render()});

  sb.auth.onAuthStateChange((event,sess)=>{
    // nicht direkt in der Callback-Funktion auf Supabase warten (Deadlock-Gefahr), daher setTimeout
    setTimeout(async()=>{
      if(event==='SIGNED_IN'&&sess&&!S.auth.user&&!S.ui.ghosting&&!isGhost(sess.user)){
        const waiting=!!S.ui.authSent&&S.ui.authSent.kind!=='reset';
        await enter(sess.user);
        await migrateGiven().catch(()=>0);await loadGiven().catch(()=>{});
        if(location.hash==='#neues-passwort'){route();return}
        const adopted=adoptDraft();
        const invd=await adoptInvite().catch(()=>false);
        const cod=await adoptCoInvite().catch(()=>null);
        if(cod){const k=sharedKey(cod.kid);if(k)switchTo(k)}
        location.hash='#wuensche';
        route();
        openShared();countOpen();
        if(cod)toast(`Du verwaltest jetzt gemeinsam mit ${cod.from} das Wishtale von ${cod.kid}.`);
        else if(adopted&&adopted.wishes)toast(savedMsg(adopted.wishes));
        else if(adopted==='quick'){if(waiting)toast('Deine E-Mail ist bestätigt. Schreib jetzt einfach deinen ersten Wunsch auf.')}
        else if(invd&&invd.n)toast(`Willkommen bei Wishtale. ${invd.from} hat dir ${invd.n===1?'einen Tipp':'ein paar Tipps'} mitgebracht, du findest ${invd.n===1?'ihn':'sie'} in deiner Wunschliste.`);
        else if(adopted)toast('Deine E-Mail ist bestätigt, du bist angemeldet und dein Wishtale ist angelegt. Jetzt fehlen nur noch deine Wünsche.');
        else if(waiting)toast('Deine E-Mail ist bestätigt und du bist jetzt angemeldet. Willkommen bei Wishtale.');
      }else if(event==='SIGNED_OUT'&&S.auth.user){
        S.auth.user=null;location.hash='#anmelden';location.reload();
      }
    },0);
  });
}
boot();
