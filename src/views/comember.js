/* Zweites Elternteil: Bereich im Kind-Profil („Verwaltet von“) und die Einladungsseite (Dev 046). */
import { S } from '../state.js';
import { esc, ic } from '../lib/util.js';

/** Im Profil eines Kind-Kontos: Wer verwaltet es, einladen, entfernen, Verwaltung abgeben. */
export function ManagersBlock(m) {
  const z = (S.ui.mgm || {})[m.dbId];
  if (!m.dbId) return '';
  if (!z || z.loading) return `<div class="comgr"><h4>Verwaltet von</h4><p class="muted" role="status">Wird geladen …</p></div>`;
  const d = z.data;
  if (!d) return '';
  const kid = esc(m.name);
  const rules = `<p class="muted comnote">Beide dürfen Profil, Wünsche und Geschenke bearbeiten und sehen, was reserviert ist. ${kid} bekommt davon nichts mit. Einladen, entfernen und das Konto löschen kann nur ${esc(d.owner)} als Hauptkonto.</p>`;
  const err = z.error ? `<p role="alert" class="comerr">${esc(z.error)}</p>` : '';
  if (!d.is_owner) {
    return `<div class="comgr"><h4>Verwaltet von</h4><p>${esc(d.owner)} und du verwalten das Wishtale von ${kid} gemeinsam.</p>${rules}${err}
     <div class="row"><button class="btn ghost sm" data-act="coleave" data-id="${m.dbId}">Verwaltung abgeben</button></div></div>`;
  }
  if (d.member) {
    return `<div class="comgr"><h4>Verwaltet von</h4><p>Du und ${esc(d.member)} verwaltet das Wishtale von ${kid} gemeinsam.</p>${rules}${err}
     <div class="row"><button class="btn ghost sm" data-act="coremove" data-id="${m.dbId}" data-n="${esc(d.member)}">${esc(d.member)} entfernen</button></div></div>`;
  }
  return `<div class="comgr"><h4>Verwaltet von</h4><p>Bisher verwaltest nur du das Wishtale von ${kid}. Du kannst ein zweites Elternteil einladen, damit ihr es gemeinsam pflegt.</p>
   ${z.link ? `<div class="banner green" style="margin:8px 0"><span>Der Link ist fertig. Er gilt 14 Tage und lässt sich einmal einlösen.</span></div>
    <div class="fld"><label for="col">Einladungslink</label><input id="col" class="inp" readonly value="${esc(z.link)}" onclick="this.select()"></div>
    <div class="row" style="margin:6px 0"><button class="btn pri sm" data-act="cocopy">Link teilen oder kopieren</button></div>`
   : `<div class="row" style="margin:6px 0"><button class="btn sec sm" data-act="coinvite" data-id="${m.dbId}" ${z.busy ? 'disabled' : ''}>${ic('plus', 'sm')}${z.busy ? 'Einen Moment …' : 'Zweites Elternteil einladen'}</button></div>`}
   ${d.open_invites > 0 ? `<p class="muted comnote">${d.open_invites === 1 ? 'Eine Einladung ist noch offen.' : `${d.open_invites} Einladungen sind noch offen.`} <button class="linkbtn" data-act="corevoke" data-id="${m.dbId}">Offene Einladungen zurückziehen</button></p>` : ''}
   ${rules}${err}</div>`;
}

/** Seite für den Link „#mitverwalten/<Code>“. */
export function Mitverwalten() {
  const c = S.ui.co || {}, u = S.auth.user;
  if (c.status === 'loading' || !c.status) return `<div class="wrap narrow"><p class="muted" role="status">Die Einladung wird geprüft …</p></div>`;
  if (c.status === 'bad') return `<div class="wrap narrow"><div class="card"><h1>Diese Einladung gilt nicht mehr</h1><p class="muted">Sie ist abgelaufen, schon benutzt oder zurückgezogen worden. Bitte lass dir einen neuen Link schicken.</p><a class="btn pri" href="#wuensche">Zu Wishtale</a></div></div>`;
  const d = c.data, kid = esc(d.kid), from = esc(d.from);
  return `<div class="wrap narrow"><div class="card">
   <p class="eyebrow">Einladung</p><h1>${from} lädt dich ein, das Wishtale von ${kid} mitzuverwalten</h1>
   <p class="muted">Ihr pflegt dann gemeinsam Profil, Wünsche und Geschenke von ${kid} und seht beide, was reserviert ist, damit nichts doppelt kommt. ${kid} bekommt davon nichts mit, die Überraschung bleibt. Ihr seid höchstens zu zweit. Einladen, entfernen und das Konto löschen kann nur ${from}. Du kannst die Verwaltung jederzeit abgeben.</p>
   ${c.error ? `<p role="alert" class="comerr">${esc(c.error)}</p>` : ''}
   ${u ? `<div class="row"><button class="btn pri" data-act="coaccept" ${c.busy ? 'disabled' : ''}>${c.busy ? 'Einen Moment …' : `Mitverwalten übernehmen`}</button><a class="btn ghost" href="#wuensche">Nicht jetzt</a></div>`
    : `<p class="muted">Dafür brauchst du ein kostenloses Wishtale-Konto. Deine eigenen Wünsche bleiben getrennt vom Kind-Konto.</p>
      <div class="row"><button class="btn pri" data-act="cologin" data-to="registrieren">Konto erstellen</button><button class="btn ghost" data-act="cologin" data-to="anmelden">Ich habe schon ein Konto</button></div>`}
  </div></div>`;
}
