import { S, initials, guestDraft } from '../state.js';
import { ic, esc } from '../lib/util.js';
import { V } from '../data/content.js';
import { devMode } from '../lib/flags.js';

export function Header(v){
  const sync=S.auth.user?`<span id="syncst" class="syncst" data-state="${S.auth.sync}">${{saving:'Speichert …',saved:'Gespeichert',error:'Nicht gespeichert'}[S.auth.sync]||''}</span>`:'<span class="syncst" data-state="demo">Demo</span>';
  return `<header class="hdr"><div class="wrap">
   <a class="mark" href="#wuensche" data-act="go" data-v="wuensche" data-home="1" aria-label="Wishtale, zu meiner Wunschliste">wishtale<i></i></a>${devMode()?'<span class="pill gold devbadge" title="Entwicklermodus: ausgeblendete Bereiche sind sichtbar">Entwicklermodus</span>':''}
   <div class="right">${guestDraft()?`<a class="btn ghost sm hdrlogin" href="#anmelden">Anmelden</a><a class="btn pri sm" href="#registrieren">Konto anlegen</a>`:`${sync}<button class="btn ghost sm helpbtn" data-act="modal" data-v="tour" aria-label="Hilfe und Rundgang">${ic('help','sm')}<span>Hilfe und Rundgang</span></button>${AcctBtn()}`}</div>
  </div></header>`;
}
/* Avatar: öffnet das Menü. */
export function AcctBtn(){
  return `<button class="acctbtn" data-act="menu" aria-haspopup="dialog" aria-expanded="${S.ui.menu?'true':'false'}"><span class="av t${S.me.tone}">${initials(S.me.name)}</span><span class="hide-s">${esc(S.me.name)}${S.me.managed?' (Kind)':''}</span><span class="vh">, Menü öffnen</span></button>`;
}
export const Legend=()=>`<div class="legend">${[V.alle,V.privat].map(x=>`<span>${ic(x.i,'sm')}${x.l}</span>`).join('')}<span>Tippe auf das Zeichen neben einem Abschnitt, um die Sichtbarkeit zu ändern.</span></div>`;
export const VisPill=(k,btn)=>{const x=V[k];return btn?`<button class="pill pillbtn" data-act="vis" data-k="${btn}" title="Sichtbarkeit ändern" aria-label="Sichtbarkeit: ${x.l}, ändern">${ic(x.i,'sm')}<span class="vl">${x.l}</span><span class="vshort" aria-hidden="true">${x.s||x.l}</span><i aria-hidden="true">▾</i></button>`:`<span class="pill">${ic(x.i,'sm')}<span class="vl">${x.l}</span><span class="vshort" aria-hidden="true">${x.s||x.l}</span></span>`};


/* Kopfzeile für Gäste: nur Logo und der Einstieg in ein eigenes Wishtale. */
export function GuestHeader(){
  return `<header class="hdr"><div class="wrap">
   ${S.auth.user?`<a class="mark" href="#wuensche" data-act="go" data-v="wuensche" data-home="1" aria-label="Wishtale, zu meiner Wunschliste">wishtale<i></i></a>`:'<a class="mark" href="../" aria-label="wishtale, zur Startseite">wishtale<i></i></a>'}
   <div class="right">${S.given.length?`<button class="btn ghost sm givenbtn" data-act="modal" data-v="given" aria-label="Meine Geschenke (${S.given.length})">${ic('gift','sm')}<span class="gl">Meine Geschenke </span>(${S.given.length})</button>`:''}${S.auth.user?'':'<a class="btn ghost sm hdrlogin" href="#anmelden">Anmelden</a>'}${S.auth.user?AcctBtn():'<a class="btn pri sm" href="#start">Wishtale erstellen</a>'}</div>
  </div></header>`;
}

/* Rechtliche Links, auf jeder Seite der App erreichbar. */
export const LegalFoot=()=>`<footer class="foot appfoot"><div class="wrap"><nav aria-label="Rechtliches" class="footnav"><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><a href="/barrierefreiheit">Barrierefreiheit</a></nav></div></footer>`;

export function LoginHeader(){
  return `<header class="hdr"><div class="wrap"><a class="mark" href="../" aria-label="wishtale, zur Startseite">wishtale<i></i></a></div></header>`;
}
