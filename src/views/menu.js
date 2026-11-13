/*
 * Menü hinter dem Avatar (Dev 075): zentraler Zugang zu allem außer der Wunschliste, die der feste Startpunkt ist.
 * Gäste ohne Konto sehen es nie, eingeloggte Schenkende öffnen darüber das eigene Menü.
 */
import { S, initials } from '../state.js';
import { esc, ic } from '../lib/util.js';
import { inspirationOn } from '../lib/flags.js';

/** Ein Eintrag. `go` wechselt die Ansicht (optional zu einem Abschnitt), `do` ruft eine vorhandene Aktion auf. */
const item = (icon, label, a, cur, note = '') => `<li><button class="mi${cur ? ' on' : ''}" ${a}${cur ? ' aria-current="page"' : ''}>${ic(icon)}<span>${label}${note ? `<small>${note}</small>` : ''}</span></button></li>`;
const go = (v, to = '') => `data-act="mgo" data-v="${v}"${to ? ` data-to="${to}"` : ''}`;
const dd = (d, extra = '') => `data-act="mdo" data-do="${d}" ${extra}`;

export function Menu() {
  if (!S.ui.menu) return '';
  const v = S.ui.view, u = S.auth.user, m = S.me;
  const accts = Object.entries(S.accounts || {});
  const mine = [
    ...accts.map(([id, a]) => `<li><button class="mi${S.ui.acct === id ? ' on' : ''}" ${dd('acct', `data-id="${id}"`)}${S.ui.acct === id ? ' aria-current="true"' : ''}><span class="av t${a.tone}">${initials(a.name)}</span><span>${esc(a.name)}${a.managed ? '<small>Kind-Konto</small>' : '<small>Mein Profil</small>'}</span></button></li>`),
    item('plus', 'Kind-Konto hinzufügen', dd('modal', 'data-v="accounts"'), false),
    u ? item('gift', 'Jemanden einladen', dd('inviteopen'), false, 'mit vorbereitetem Entwurf') : '',
  ].join('');
  const g = (t, body) => body.trim() ? `<section class="mgrp"><h3>${t}</h3><ul>${body}</ul></section>` : '';
  return `<div class="scrim menu-scrim" data-act="menuclosebg"><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="menu-t">
   <div class="drawer-head"><div class="who"><span class="av t${m.tone}">${initials(m.name)}</span><div><strong id="menu-t">${esc(m.name)}</strong><span class="muted">${u ? esc(u.email || '') : 'Demo, nur in diesem Browser'}</span></div></div>
    <button class="sheet-x mclose" data-act="menuclose" aria-label="Menü schließen">×</button></div>
   <nav aria-label="Menü">
    ${g('Mein Wishtale', item('star', 'Meine Wünsche', go('wuensche'), v === 'wuensche') + item('user', 'Profil und Persönlichkeit', go('profil'), v === 'profil') + item('globe', 'Social Media', go('profil', 'social'), false, 'Pinterest und Instagram') + item('clock', 'Historie und Meine Geschenke', go('historie'), v === 'historie'))}
    ${g('Für dich', item('spark', 'Geschmack schärfen', go('geschmack'), v === 'geschmack', 'Karten, die Wishtale dich besser kennenlernen lassen') + (inspirationOn() ? item('gift', 'Inspiration', go('entdecken'), v === 'entdecken', 'Ideen von Wishtale für dich') : ''))}
    ${g('Meine Profile', mine)}
    ${g('Organisation', item('link', 'Link teilen', dd('share'), false) + item('eye', 'Wer sieht was', go('profil', 'vis'), false, 'Sichtbarkeit im Profil') + (u ? item('bag', 'Mein Plan', go('plan'), v === 'plan') + item('lock', 'Einstellungen und Konto', dd('modal', 'data-v="accounts"'), false, 'Passwort, Konto löschen') + item('back', 'Abmelden', dd('logout'), false) : item('arrow', 'Eigenes Wishtale anlegen', dd('exitdemo'), false)))}
   </nav></aside></div>`;
}

/** Zurück-Knopf für Ebenen über der Wunschliste (Profil, Historie, Inspiration, Plan). */
export const BackBar = () => `<div class="backbar"><a class="btn ghost sm" href="#wuensche" data-act="go" data-v="wuensche">${ic('back', 'sm')}Zurück zur Wunschliste</a></div>`;
