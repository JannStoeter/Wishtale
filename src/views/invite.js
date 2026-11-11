/* Einladung: Seite für die eingeladene Person und Fenster zum Einladen (Entscheidung 039). */
import { S } from '../state.js';
import { esc } from '../lib/util.js';
import { inviteLink } from '../lib/invite.js';

/** Seite hinter dem Link: zeigt, was vorbereitet wurde, und lässt Name und Tipps ändern, bevor die Person sich registriert. */
export function Einladung() {
  const v = S.ui.inv;
  if (!v || v.status === 'loading') return `<div class="wrap"><div class="authcard"><p class="eyebrow">Wishtale</p><h1>Einen Moment …</h1><p class="muted">Wir öffnen deine Einladung.</p></div></div>`;
  if (v.status === 'bad') return `<div class="wrap"><div class="authcard"><p class="eyebrow">Wishtale</p><h1>Diese Einladung gilt nicht mehr</h1>
   <p class="muted" style="margin:6px 0 18px">Sie wurde schon benutzt, ist abgelaufen oder zurückgezogen. Du kannst trotzdem dein eigenes Wishtale anlegen, kostenlos und in einer Minute.</p>
   <a class="btn pri" href="#start">Mein Wishtale anlegen</a></div></div>`;
  const d = v.data, from = esc(d.from), loggedIn = !!S.auth.user;
  return `<div class="wrap"><div class="authcard">
   <p class="eyebrow">Eine Einladung von ${from}</p>
   <h1>${from} hat ein Wishtale für dich vorbereitet</h1>
   <p class="muted" style="margin:6px 0 16px">Wishtale ist die Wunschliste, die dich kennt. ${from} hat schon einen Anfang gemacht, und du entscheidest, was davon bleibt. Nichts davon ist schon dein Wunsch, solange du es nicht übernimmst.</p>
   <form data-form="inviteaccept" class="authform">
    ${loggedIn ? '' : `<div class="fld"><label for="inm">Wie sollen wir dich nennen?</label><input id="inm" name="name" class="inp" required maxlength="40" value="${esc(v.name ?? d.name)}" autocomplete="given-name"></div>`}
    ${(d.tips || []).length ? `<fieldset class="fld" style="border:0;padding:0"><legend class="lb">Tipps von ${from}</legend>${d.tips.map((t, i) => `<label class="chk"><input type="checkbox" name="tip" value="${i}" ${v.keep[i] === false ? '' : 'checked'}><span>${esc(t)}</span></label>`).join('')}<span class="muted" style="font-size:13.5px">Du kannst die Tipps jederzeit ändern oder löschen.</span></fieldset>` : ''}
    <button class="btn pri" type="submit">${loggedIn ? 'Tipps übernehmen' : 'Mein Wishtale anlegen'}</button>
   </form>
   ${loggedIn ? '' : `<p class="muted" style="font-size:13.5px;margin-top:12px">Dafür legst du kostenlos ein Konto an. Deine Wünsche sehen nur die, denen du den Link gibst, und die Überraschung bleibt für dich erhalten. Du hast schon ein Konto? <a href="#anmelden" data-act="invitelogin">Melde dich an</a>, dann gehen die Tipps in dein Wishtale.</p>`}
  </div></div>`;
}

/** Fenster im eigenen Profil: Einladung anlegen, Link teilen, offene Einladungen ansehen und zurückziehen. */
export function InviteModal() {
  const z = S.ui.invm || {};
  const open = (z.list || []).filter(i => !i.used_at && new Date(i.expires_at) > new Date());
  return `<div class="scrim" data-act="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt">
   <h2 id="mt">Jemanden einladen</h2>
   <p class="muted" style="margin:6px 0 14px">Bereite ein Wishtale für jemanden vor, zum Beispiel zu Weihnachten. Du gibst den Vornamen ein und auf Wunsch ein oder zwei Tipps und schickst den Link selbst weiter. Das Konto legt die Person erst an, wenn sie es möchte, und kann Name und Tipps vorher ändern.</p>
   ${z.link ? `<div class="banner green" style="margin-bottom:12px"><span>Der Link ist fertig. Er gilt 30 Tage und lässt sich einmal einlösen.</span></div>
    <div class="fld"><label for="il">Dein Einladungslink</label><input id="il" class="inp" readonly value="${esc(z.link)}" onclick="this.select()"></div>
    <div class="row" style="margin:8px 0 14px"><button type="button" class="btn pri" data-act="invitecopy">Link teilen oder kopieren</button><button type="button" class="btn ghost" data-act="invitenew">Noch eine Einladung</button></div>`
  : `<form data-form="invitemake">
    <div class="fld"><label for="in1">Vorname der Person</label><input id="in1" name="name" class="inp" required maxlength="40" autocomplete="off"></div>
    <div class="fld"><label for="in2">Tipp 1 (optional)</label><input id="in2" name="tip1" class="inp" maxlength="80" placeholder="zum Beispiel Handkaffeemühle" autocomplete="off"></div>
    <div class="fld"><label for="in3">Tipp 2 (optional)</label><input id="in3" name="tip2" class="inp" maxlength="80" autocomplete="off"></div>
    <p class="muted" style="font-size:13.5px;margin-bottom:10px">Die Tipps erscheinen bei der Person als „Tipp von dir“ und sind keine Wünsche, bis sie sie übernimmt.</p>
    ${z.error ? `<p role="alert" style="color:var(--bad,#a33)">${esc(z.error)}</p>` : ''}
    <div class="row"><button class="btn pri" type="submit" ${z.busy ? 'disabled' : ''}>${z.busy ? 'Einen Moment …' : 'Einladungslink erstellen'}</button></div>
   </form>`}
   ${open.length ? `<div style="margin-top:16px"><p class="eyebrow">Offene Einladungen</p>${open.map(i => `<div class="row" style="justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid var(--line)"><span>${esc(i.name)} <span class="muted" style="font-size:13px">bis ${new Date(i.expires_at).toLocaleDateString('de-DE')}</span></span><button type="button" class="linkbtn" data-act="inviterevoke" data-id="${i.id}">Zurückziehen</button></div>`).join('')}</div>` : ''}
   <div class="row" style="justify-content:flex-end;margin-top:12px"><button type="button" class="btn ghost" data-act="close">Schließen</button></div>
  </div></div>`;
}
export { inviteLink };
