import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/schibsted-grotesk/index.css';
import './styles/main.css';
import { loadState } from './state.js';
import { S } from './state.js';
import { sb } from './lib/supabase.js';
import { enter, adoptDraft } from './lib/auth.js';
import { toast } from './lib/util.js';
import { maybeWelcome } from './views/welcome.js';
import { adoptInvite } from './lib/invite.js';
import { route, render } from './render.js';
import './actions.js';
import { loadPromo } from './lib/promo.js';
import { loadGiven, migrateGiven } from './lib/given.js';

async function boot(){
  const recoveryLink=/type=recovery/.test(location.hash); // vor getSession merken, Supabase räumt die Adresse danach auf
  loadState(); // Demo-Daten (nur ohne Konto relevant)
  // Verarbeitet auch Login-Links aus E-Mails (Tokens im URL-Fragment), bevor der Router läuft.
  let session=null;
  try{ session=(await sb.auth.getSession()).data.session; }catch(e){ console.error(e); }
  const fromLink=/access_token|error_description/.test(location.hash);
  if(session){
    await enter(session.user);
    await migrateGiven().catch(()=>0);await loadGiven().catch(()=>{});
    const adopted=recoveryLink?false:adoptDraft();
    const invd=recoveryLink?false:await adoptInvite().catch(()=>false);
    if(recoveryLink){
      history.replaceState(null,'',location.pathname+'#neues-passwort');
    }else if(invd&&invd.n){
      history.replaceState(null,'',location.pathname+'#wuensche');
      setTimeout(()=>toast(`Willkommen bei Wishtale. ${invd.from} hat dir ${invd.n===1?'einen Tipp':'ein paar Tipps'} mitgebracht, du findest ${invd.n===1?'ihn':'sie'} in deiner Wunschliste.`),500);
    }else if(adopted){
      history.replaceState(null,'',location.pathname+'#wuensche');
      if(adopted==='quick')setTimeout(()=>{toast('Schön, dass du da bist. Schreib jetzt deinen ersten Wunsch auf.');S.ui.modal='wish';S.ui.editWish=null;render()},500);
      else setTimeout(()=>toast(fromLink?'Deine E-Mail ist bestätigt, du bist angemeldet und dein Wishtale ist angelegt. Jetzt fehlen nur noch deine Wünsche.':'Dein Wishtale ist angelegt. Jetzt fehlen nur noch deine Wünsche.'),400);
    }else if(fromLink||!location.hash||['#login','#anmelden','#registrieren','#demo'].includes(location.hash)){
      const a=S.accounts.me;
      history.replaceState(null,'',location.pathname+(a&&!a.interests.length&&!a.wishes.length?'#start':'#wuensche'));
      if(fromLink)setTimeout(()=>toast('Deine E-Mail ist bestätigt und du bist jetzt angemeldet. Willkommen bei Wishtale.'),500);
    }
  }else if(fromLink){
    history.replaceState(null,'',location.pathname+'#anmelden');
  }
  if(!session)await loadGiven().catch(()=>{});
  window.addEventListener('hashchange',route);
  route();
  if(session)setTimeout(maybeWelcome,1200);
  loadPromo().then(p=>{S.promo=p;if(['entdecken','gast','profil','wuensche'].includes(S.ui.view)&&!S.ui.modal&&!document.activeElement?.matches?.('input,textarea,select'))render()});

  sb.auth.onAuthStateChange((event,sess)=>{
    // nicht direkt in der Callback-Funktion auf Supabase warten (Deadlock-Gefahr), daher setTimeout
    setTimeout(async()=>{
      if(event==='SIGNED_IN'&&sess&&!S.auth.user){
        const waiting=!!S.ui.authSent&&S.ui.authSent.kind!=='reset';
        await enter(sess.user);
        await migrateGiven().catch(()=>0);await loadGiven().catch(()=>{});
        if(location.hash==='#neues-passwort'){route();return}
        const adopted=adoptDraft();
        const invd=await adoptInvite().catch(()=>false);
        const a=S.accounts.me;
        location.hash=adopted||(invd&&invd.n)?'#wuensche':a&&!a.interests.length&&!a.wishes.length?'#start':'#wuensche';
        route();
        if(adopted==='quick'){toast('Schön, dass du da bist. Schreib jetzt deinen ersten Wunsch auf.');S.ui.modal='wish';S.ui.editWish=null;render()}
        else if(invd&&invd.n)toast(`Willkommen bei Wishtale. ${invd.from} hat dir ${invd.n===1?'einen Tipp':'ein paar Tipps'} mitgebracht, du findest ${invd.n===1?'ihn':'sie'} in deiner Wunschliste.`);
        else if(adopted)toast('Deine E-Mail ist bestätigt, du bist angemeldet und dein Wishtale ist angelegt. Jetzt fehlen nur noch deine Wünsche.');
        else if(waiting)toast('Deine E-Mail ist bestätigt und du bist jetzt angemeldet. Willkommen bei Wishtale.');
        if(adopted!=='quick')setTimeout(maybeWelcome,1500);
      }else if(event==='SIGNED_OUT'&&S.auth.user){
        S.auth.user=null;location.hash='#anmelden';location.reload();
      }
    },0);
  });
}
boot();
