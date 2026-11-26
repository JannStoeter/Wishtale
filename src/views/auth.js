import { S, draftHasData } from '../state.js';
import { esc } from '../lib/util.js';
import { loadLocal } from '../lib/invite.js';

function Forgot(m,busy){
  const msg=m?`<div class="banner" role="alert" style="margin-bottom:14px"><span>${esc(m.text)}</span></div>`:'';
  return `<div class="wrap"><div class="authcard">
   <p class="eyebrow">Wishtale</p><h1>Passwort vergessen</h1>
   <p class="muted" style="margin:6px 0 18px">Gib deine E-Mail-Adresse ein. Wir schicken dir einen Link, mit dem du ein neues Passwort festlegst.</p>
   ${msg}<form data-form="forgot" class="authform">
    <div class="fld"><label for="fe">E-Mail</label><input id="fe" name="email" type="email" class="inp" required autocomplete="email" value="${esc(S.ui.authEmail||'')}"></div>
    <button class="btn pri" type="submit" ${busy?'disabled':''}>Link schicken</button></form>
   <div class="authalt"><button class="btn ghost sm" data-act="authtab" data-v="in" style="padding-left:0">Zurück zur Anmeldung</button></div>
  </div></div>`;
}

export function Recovery(){
  const m=S.ui.authMsg,busy=S.ui.authBusy;
  const msg=m?`<div class="banner" role="alert" style="margin-bottom:14px"><span>${esc(m.text)}</span></div>`:'';
  return `<div class="wrap"><div class="authcard">
   <p class="eyebrow">Wishtale</p><h1>Neues Passwort festlegen</h1>
   <p class="muted" style="margin:6px 0 18px">Wähle ein Passwort mit mindestens 8 Zeichen. Danach bist du angemeldet.</p>
   ${msg}<form data-form="newpw" class="authform">
    <div class="fld"><label for="np1">Neues Passwort</label><input id="np1" name="password" type="password" class="inp" required minlength="8" autocomplete="new-password"></div>
    <div class="fld"><label for="np2">Noch einmal</label><input id="np2" name="password2" type="password" class="inp" required minlength="8" autocomplete="new-password"></div>
    <button class="btn pri" type="submit" ${busy?'disabled':''}>Passwort speichern</button></form>
  </div></div>`;
}

function Sent(){
  const a=S.ui.authSent,busy=S.ui.authBusy;
  const mail=esc(a.email);
  return `<div class="wrap"><div class="authcard" role="status">
   <p class="eyebrow">Wishtale</p>
   <h1>${a.kind==='signup'?'Fast geschafft, wir haben dir eine E-Mail geschickt':a.kind==='reset'?'Wir haben dir einen Link geschickt':'Schau in dein Postfach'}</h1>
   <p style="margin:10px 0 6px;font-size:17px">Wir haben eine E-Mail an <b>${mail}</b> geschickt. Tippe darin auf den Link, dann ${a.kind==='signup'?'bist du mit deinem Wishtale gleich startklar':a.kind==='reset'?'kannst du ein neues Passwort festlegen':'bist du sofort angemeldet'}.</p>
   <p class="muted" style="margin:0 0 16px">${a.kind==='reset'?'Der Link gilt eine Stunde.':'Du musst nichts weiter ausfüllen. Du kannst diese Seite offen lassen, sie geht von allein weiter, sobald du den Link auf diesem Gerät öffnest.'}</p>
   <div class="banner green"><span>Nichts angekommen? Schau bitte auch im Spam-Ordner nach. Die Mail kommt von Wishtale und kann ein paar Minuten brauchen.</span></div>
   ${S.ui.authResent?`<p class="muted" style="margin-top:10px" role="status">${esc(S.ui.authResent)}</p>`:''}
   <div class="row" style="margin-top:14px;gap:8px">${a.kind==='signup'?`<button class="btn sec sm" data-act="resend" ${busy?'disabled':''}>Mail erneut senden</button>`:''}<button class="btn ghost sm" data-act="authback">Andere E-Mail-Adresse verwenden</button></div>
  </div></div>`;
}

export function Login(){
  if(S.ui.authSent)return Sent();
  const tab=S.ui.authTab||'in',m=S.ui.authMsg,busy=S.ui.authBusy;
  if(tab==='forgot')return Forgot(m,busy);
  const msg=m?`<div class="banner ${m.type==='ok'?'green':''}" role="status" style="margin-bottom:14px"><span>${esc(m.text)}</span></div>`:'';
  const err=S.auth.error?`<div class="banner" style="margin-bottom:14px"><span>${esc(S.auth.error)}</span></div>`:'';
  const dr=tab==='up'&&draftHasData()&&!S.accounts.draft.quick?S.accounts.draft:null; // beim schnellen Einstieg kein Zusatztext (136)
  const nw=S.accounts.draft&&S.accounts.draft.quick?(S.accounts.draft.wishes||[]).filter(w=>w.status==='offen'||w.status==='plan').length:0; // Wünsche ohne Konto kommen mit (136)
  const note=dr?`<div class="banner green" role="status" style="margin-bottom:14px"><span>${dr.name?`Dein Wishtale ist fast fertig, ${esc(dr.name)}. `:'Dein Wishtale ist fast fertig. '}Lege jetzt ein Konto an, damit nichts verloren geht.</span></div>`:'';
  return `<div class="wrap"><div class="authcard">
   <p class="eyebrow">Wishtale</p>
   <h1>${tab==='up'?'Schön, dass du da bist':'Schön, dich wiederzusehen'}</h1>
   <p class="muted" style="margin:6px 0 18px">${tab==='up'?'Leg dein Konto an, und deine Wunschliste ist sofort startklar. Alles Weitere kannst du später ergänzen, wenn du magst.':'Melde dich an, dann geht es genau dort weiter, wo du aufgehört hast.'}</p>
   <div class="seg" role="tablist" style="margin-bottom:16px"><button role="tab" aria-selected="${tab==='in'}" class="${tab==='in'?'on':''}" data-act="authtab" data-v="in">Anmelden</button><button role="tab" aria-selected="${tab==='up'}" class="${tab==='up'?'on':''}" data-act="authtab" data-v="up">Registrieren</button></div>
   ${note}${nw&&!m?`<div class="banner green" role="status" style="margin-bottom:14px"><span>${nw===1?'Dein Wunsch kommt':`Deine ${nw} Wünsche kommen`} mit ins Konto. <a href="#wuensche">Zurück zur Wunschliste</a></span></div>`:''}${err}${msg}
   ${S.ui.google?`<button type="button" class="btn gbtn" data-act="google" ${busy?'disabled':''}><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.9 6.2C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"/><path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.2C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.2C6.6 42.6 14.6 48 24 48z"/></svg><span>Mit Google ${tab==='up'?'registrieren':'anmelden'}</span></button>
   <div class="auth-or" aria-hidden="true"><span>oder mit E-Mail</span></div>`:''}
   ${tab==='up'?`<form data-form="signup" class="authform">
     <div class="fld"><label for="an">Dein Vorname</label><input id="an" name="name" class="inp" required maxlength="60" value="${dr&&dr.name?esc(dr.name):esc((loadLocal()||{}).name||'')}" autocomplete="given-name"></div>
     <div class="fld"><label for="ae">E-Mail</label><input id="ae" name="email" type="email" class="inp" required autocomplete="email" value="${esc(S.ui.authEmail||'')}"></div>
     <div class="fld"><label for="ap">Passwort (mindestens 8 Zeichen)</label><input id="ap" name="password" type="password" class="inp" required minlength="8" autocomplete="new-password"></div>
     <button class="btn pri" type="submit" ${busy?'disabled':''}>Konto anlegen</button>
     <p class="disc" style="margin:0">Wie wir mit deinen Daten umgehen, steht in der <a href="/datenschutz">Datenschutzerklärung</a>.</p></form>`
   :`<form data-form="signin" class="authform">
     <div class="fld"><label for="ae">E-Mail</label><input id="ae" name="email" type="email" class="inp" required autocomplete="email" value="${esc(S.ui.authEmail||'')}"></div>
     <div class="fld"><label for="ap">Passwort</label><input id="ap" name="password" type="password" class="inp" required autocomplete="current-password"></div>
     <button class="btn pri" type="submit" ${busy?'disabled':''}>Anmelden</button>
     <button class="linkbtn" type="button" data-act="forgot" style="justify-self:start">Passwort vergessen?</button></form>`}
   <details class="authalt"><summary>Lieber ohne Passwort? Wir schicken dir einen Link per E-Mail</summary>
    <form data-form="magic" class="authform" style="margin-top:10px">
     <div class="fld"><label for="am">E-Mail</label><input id="am" name="email" type="email" class="inp" required autocomplete="email"></div>
     <button class="btn sec" type="submit" ${busy?'disabled':''}>Link senden</button></form></details>
   <div class="authalt" style="border-top:1px solid var(--line);padding-top:14px;margin-top:6px"><button class="btn ghost sm" data-act="demo" style="padding-left:0">Ich möchte mich erst einmal umsehen, ohne Konto (Demo)</button></div>
  </div></div>`;
}
