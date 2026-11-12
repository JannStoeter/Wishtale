import { S, initials } from '../state.js';
import { ic, esc } from '../lib/util.js';
import { V } from '../data/content.js';

export function Header(v){
  const items=[['wuensche','Wünsche'],['entdecken','Inspiration'],['profil','Profil'],['historie','Historie']];
  return `<header class="hdr"><div class="wrap">
   <a class="mark" href="../" aria-label="wishtale, zur Startseite">wishtale<i></i></a>
   <nav class="nav" aria-label="Hauptnavigation">${items.map(([k,l])=>`<button class="${v===k?'on':''}" data-act="go" data-v="${k}">${l}</button>`).join('')}</nav>
   <div class="right">${S.auth.user?`<span id="syncst" class="syncst" data-state="${S.auth.sync}">${{saving:'Speichert …',saved:'Gespeichert',error:'Nicht gespeichert'}[S.auth.sync]||''}</span>`:'<span class="syncst" data-state="demo">Demo</span><button class="btn pri sm" data-act="exitdemo">Eigenes Wishtale</button>'}<button class="acctbtn" data-act="modal" data-v="accounts"><span class="av t${S.me.tone}">${initials(S.me.name)}</span><span class="hide-s">${esc(S.me.name)}${S.me.managed?' (Kind)':''}</span><span class="vh">, Konto und Einstellungen</span></button></div>
  </div></header>`;
}
export function BottomNav(v){
  const items=[['wuensche','star','Wünsche'],['entdecken','spark','Inspiration'],['profil','user','Profil'],['historie','clock','Historie']];
  return `<nav class="btm" aria-label="Hauptnavigation">${items.map(([k,i,l])=>`<button class="${v===k?'on':''}" data-act="go" data-v="${k}">${ic(i)}${l}</button>`).join('')}</nav>`;
}
export const Legend=()=>`<div class="legend">${Object.values(V).map(x=>`<span>${ic(x.i,'sm')}${x.l}</span>`).join('')}</div>`;
export const VisPill=(k,btn)=>{const x=V[k];return btn?`<button class="pill" data-act="vis" data-k="${btn}" title="Sichtbarkeit ändern">${ic(x.i,'sm')}${x.l}</button>`:`<span class="pill">${ic(x.i,'sm')}${x.l}</span>`};


/* Kopfzeile für Gäste: nur Logo und der Einstieg in ein eigenes Wishtale. */
export function GuestHeader(){
  return `<header class="hdr"><div class="wrap">
   <a class="mark" href="../" aria-label="wishtale, zur Startseite">wishtale<i></i></a>
   <div class="right">${S.given.length?`<button class="btn ghost sm" data-act="modal" data-v="given">Meine Geschenke (${S.given.length})</button>`:''}${S.auth.user?'':'<a class="btn ghost sm" href="#anmelden">Anmelden</a>'}<a class="btn pri sm" href="${S.auth.user?'#profil':'#start'}">${S.auth.user?'Zu meinem Wishtale':'Wishtale erstellen'}</a></div>
  </div></header>`;
}

/* Rechtliche Links, auf jeder Seite der App erreichbar. */
export const LegalFoot=()=>`<footer class="foot appfoot"><div class="wrap"><nav aria-label="Rechtliches" class="footnav"><a href="../impressum.html">Impressum</a><a href="../datenschutz.html">Datenschutz</a><a href="../barrierefreiheit.html">Barrierefreiheit</a></nav></div></footer>`;

export function LoginHeader(){
  return `<header class="hdr"><div class="wrap"><a class="mark" href="../" aria-label="wishtale, zur Startseite">wishtale<i></i></a></div></header>`;
}
