/*
 * Menü hinter dem Avatar (Dev 075): zentraler Zugang zu allem außer der Wunschliste, die der feste Startpunkt ist.
 * Gäste ohne Konto sehen es nie, eingeloggte Schenkende öffnen darüber das eigene Menü.
 */
import { S, initials } from '../state.js';
import { offerInstall } from '../lib/pwa.js';
import { esc, ic } from '../lib/util.js';
import { homeIdeasVisible } from '../lib/homeideas.js';
import { inspirationOn } from '../lib/flags.js';
import { isOcc, occLine } from './occasion.js';

/** Ein Eintrag. `go` wechselt die Ansicht (optional zu einem Abschnitt), `do` ruft eine vorhandene Aktion auf. */
const item = (icon, label, a, cur, note = '') => `<li><button class="mi${cur ? ' on' : ''}" ${a}${cur ? ' aria-current="page"' : ''}>${ic(icon)}<span>${label}${note ? `<small>${note}</small>` : ''}</span></button></li>`;
const go = (v, to = '') => `data-act="mgo" data-v="${v}"${to ? ` data-to="${to}"` : ''}`;
const dd = (d, extra = '') => `data-act="mdo" data-do="${d}" ${extra}`;

export function Menu() {
  if (!S.ui.menu) return '';
  const v = S.ui.view, u = S.auth.user, m = S.me;
  const accts = Object.entries(S.accounts || {});
  const mine = [
    ...accts.filter(([, a]) => !isOcc(a)).map(([id, a]) => `<li><button class="mi${S.ui.acct === id ? ' on' : ''}" ${dd('acct', `data-id="${id}"`)}${S.ui.acct === id ? ' aria-current="true"' : ''}><span class="av t${a.tone}">${initials(a.name)}</span><span>${esc(a.name)}${a.shared ? '<small>Kind-Konto, mitverwaltet</small>' : a.managed ? '<small>Kind-Konto</small>' : '<small>Mein Profil</small>'}</span></button></li>`),
    item('plus', 'Kind-Konto hinzufügen', dd('modal', 'data-v="accounts"'), false),
  ].join('');
  // Listen für besondere Anlässe stehen bewusst unten im Menü, die eigene Wunschliste bleibt der Kern (Dev 009)
  const occ = u ? [
    ...accts.filter(([, a]) => isOcc(a)).map(([id, a]) => `<li><button class="mi${S.ui.acct === id ? ' on' : ''}" ${dd('acct', `data-id="${id}"`)}${S.ui.acct === id ? ' aria-current="true"' : ''}>${ic('gift')}<span>${esc(a.name)}<small>${occLine(a)}</small></span></button></li>`),
    item('plus', 'Liste für einen Anlass', dd('occnew'), false, 'Hochzeit, Taufe, Einzug und mehr'),
  ].join('') : '';
  const g = (t, body) => body.trim() ? `<section class="mgrp"><h3>${t}</h3><ul>${body}</ul></section>` : '';
  return `<div class="scrim menu-scrim" data-act="menuclosebg"><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="menu-t">
   <div class="drawer-head"><div class="who"><span class="av t${m.tone}">${initials(m.name)}</span><div><strong id="menu-t">${esc(m.name)}</strong><span class="muted">${u ? esc(u.email || '') : 'Demo, nur in diesem Browser'}</span></div></div>
    <button class="sheet-x mclose" data-act="menuclose" aria-label="Menü schließen">×</button></div>
   <nav aria-label="Menü">
    ${m.occasion ? g(esc(m.name), item('star', 'Wünsche dieser Liste', go('wuensche'), v === 'wuensche') + item('user', 'Liste bearbeiten', dd('occedit'), false, 'Name, Anlass, Datum oder löschen') + item('back', 'Zurück zu meiner Wunschliste', dd('acct', 'data-id="me"'), false)) : ''}
    ${m.occasion ? '' : g('Mein Wishtale', item('star', 'Meine Wünsche', go('wuensche'), v === 'wuensche') + item('user', 'Profil und Persönlichkeit', go('profil'), v === 'profil') + item('globe', 'Social Media', go('profil', 'social'), false, 'Pinterest und Instagram') + item('clock', 'Historie und Meine Geschenke', go('historie'), v === 'historie'))}
    ${g('Wünsche hinzufügen', item('bag', 'Aus jedem Shop speichern', dd('shopsave'), false, 'mit einem Tipp auf „Teilen“ im Shop') + (u ? item('plus', 'Wunschzettel hochladen', dd('modal', 'data-v="zettel"'), false, 'Foto oder Text, Wishtale macht daraus Wünsche') : '') + (offerInstall() ? item('plus', 'Wishtale als App', dd('appinstall'), false, 'mit eigenem Symbol auf dem Handy') : ''))}
    ${m.occasion ? '' : g('Für dich', (u ? item('eye', homeIdeasVisible() ? 'Vorschläge auf der Wunschliste ausblenden' : 'Vorschläge auf der Wunschliste einblenden', dd('homeideastoggle'), false) : '') + item('spark', 'Geschmack schärfen', go('geschmack'), v === 'geschmack', 'Karten, die Wishtale dich besser kennenlernen lassen') + (inspirationOn() ? item('gift', 'Inspiration', go('entdecken'), v === 'entdecken', 'Ideen von Wishtale für dich') : ''))}
    ${g('Teilen', item('link', 'Link teilen', dd('share'), false) + (m.occasion ? '' : item('eye', 'Wer sieht was', go('profil', 'vis'), false, 'Sichtbarkeit im Profil') + (u ? item('gift', 'Jemanden einladen', dd('inviteopen'), false, 'mit vorbereitetem Entwurf') : '')))}
    ${g('Meine Profile', mine)}
    ${g('Besondere Anlässe', occ)}
    ${g('Konto und Hilfe', (u ? item('bag', 'Mein Plan', go('plan'), v === 'plan') + item('lock', 'Einstellungen und Konto', dd('modal', 'data-v="accounts"'), false, 'Passwort, Konto löschen') : '') + item('help', 'Hilfe und FAQ', dd('modal', 'data-v="tour" data-help="faq"'), false) + (u ? item('back', 'Abmelden', dd('logout'), false) : item('arrow', 'Eigenes Wishtale anlegen', dd('exitdemo'), false)))}
   </nav></aside></div>`;
}

/** Zurück-Knopf für Ebenen über der Wunschliste (Profil, Historie, Inspiration, Plan). */
export const BackBar = () => `<div class="backbar"><a class="btn ghost sm" href="#wuensche" data-act="go" data-v="wuensche">${ic('back', 'sm')}Zurück zur Wunschliste</a></div>`;
