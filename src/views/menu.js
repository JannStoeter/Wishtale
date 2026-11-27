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
import { IG_URL } from '../lib/iglink.js';

/** Ein Eintrag. `go` wechselt die Ansicht (optional zu einem Abschnitt), `do` ruft eine vorhandene Aktion auf. */
const item = (icon, label, a, cur, note = '') => `<li><button class="mi${cur ? ' on' : ''}" ${a}${cur ? ' aria-current="page"' : ''}>${ic(icon)}<span>${label}${note ? `<small>${note}</small>` : ''}</span></button></li>`;
const go = (v, to = '') => `data-act="mgo" data-v="${v}"${to ? ` data-to="${to}"` : ''}`;
const dd = (d, extra = '') => `data-act="mdo" data-do="${d}" ${extra}`;

export function Menu() {
  if (!S.ui.menu) return '';
  const v = S.ui.view, u = S.auth.user, m = S.me;
  const accts = Object.entries(S.accounts || {});
  const prof = ([id, a]) => {
    const on = S.ui.acct === id, occ = isOcc(a);
    const note = occ ? occLine(a) : a.shared ? 'Kind-Konto, mitverwaltet' : a.managed ? 'Kind-Konto' : '';
    return `<li><button class="mi mprof${on ? ' on' : ''}" ${dd('acct', `data-id="${id}"`)}${on ? ' aria-current="true"' : ''}>${occ ? `<span class="av occ">${ic('gift', 'sm')}</span>` : `<span class="av t${a.tone}">${initials(a.name)}</span>`}<span>${esc(a.name)}${note ? `<small>${note}</small>` : ''}</span>${on ? `<span class="mcheck" aria-hidden="true">${ic('check', 'sm')}</span>` : ''}</button></li>`;
  };
  // Profile stehen oben (Dev 130): eigenes Profil, Kind-Konten, danach die Listen für besondere Anlässe (Dev 009)
  const profiles = [...accts.filter(([, a]) => !isOcc(a)), ...(u ? accts.filter(([, a]) => isOcc(a)) : [])].map(prof).join('');
  const adds = `<div class="madd"><button class="madd-b" ${dd('modal', 'data-v="accounts"')}>${ic('plus', 'sm')}Kind-Konto</button>${u ? `<button class="madd-b" ${dd('occnew')}>${ic('plus', 'sm')}Liste für einen Anlass</button>` : ''}</div>`;
  const g = (t, body, extra = '') => body.trim() ? `<section class="mgrp"><h3>${t}</h3><ul>${body}</ul>${extra}</section>` : '';
  return `<div class="scrim menu-scrim" data-act="menuclosebg"><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="menu-t">
   <div class="drawer-head"><div class="mhead"><strong id="menu-t">Menü</strong><span class="muted">${u ? esc(u.email || '') : 'Demo, nur in diesem Browser'}</span></div>
    <button class="sheet-x mclose" data-act="menuclose" aria-label="Menü schließen">×</button></div>
   <nav aria-label="Menü">
    ${g('Profile', profiles, adds)}
    ${m.occasion ? g(esc(m.name), item('star', 'Wünsche dieser Liste', go('wuensche'), v === 'wuensche') + item('user', 'Liste bearbeiten', dd('occedit'), false) + item('link', 'Link teilen', dd('share'), false)) : ''}
    ${m.occasion ? '' : g('Wunschliste', item('star', 'Meine Wünsche', go('wuensche'), v === 'wuensche') + item('bag', 'Aus jedem Shop speichern', dd('shopsave'), false) + (u ? item('camera', 'Wunschzettel hochladen', dd('modal', 'data-v="zettel"'), false) : ''))}
    ${m.occasion ? '' : g('Über mich', item('user', 'Profil', go('profil'), v === 'profil') + item('spark', 'Geschmack schärfen', go('geschmack'), v === 'geschmack') + (inspirationOn() ? item('gift', 'Inspiration', go('entdecken'), v === 'entdecken') : '') + (u ? item('eye', homeIdeasVisible() ? 'Vorschläge ausblenden' : 'Vorschläge einblenden', dd('homeideastoggle'), false) : ''))}
    ${m.occasion ? '' : g('Social Media', item('globe', 'Instagram und Pinterest verbinden', go('profil', 'social'), false) + `<li><a class="mi" href="${IG_URL}" target="_blank" rel="noopener" data-ig="menue">${ic('insta')}<span>Wishtale auf Instagram folgen<small>Ideen und Neuigkeiten von @wishtale.de</small></span></a></li>`)}
    ${m.occasion ? '' : g('Teilen und Schenken', item('link', 'Link teilen', dd('share'), false) + item('lock', 'Wer sieht was', go('profil', 'vis'), false) + (u ? item('mail', 'Jemanden einladen', dd('inviteopen'), false) : '') + item('clock', 'Verschenkt und bekommen', go('historie'), v === 'historie'))}
    ${g('Konto', (u ? item('bag', 'Mein Plan', go('plan'), v === 'plan') + item('filter', 'Einstellungen', dd('modal', 'data-v="accounts"'), false) : '') + (offerInstall() ? item('phone', 'Wishtale als App', dd('appinstall'), false) : '') + item('help', 'Hilfe und FAQ', dd('modal', 'data-v="tour" data-help="faq"'), false) + (u ? item('back', 'Abmelden', dd('logout'), false) : item('arrow', 'Eigenes Wishtale anlegen', dd('exitdemo'), false)))}
   </nav></aside></div>`;
}

/** Zurück-Knopf für Ebenen über der Wunschliste (Profil, Historie, Inspiration, Plan). */
export const BackBar = () => `<div class="backbar"><a class="btn ghost sm" href="#wuensche" data-act="go" data-v="wuensche">${ic('back', 'sm')}Zurück zur Wunschliste</a></div>`;
