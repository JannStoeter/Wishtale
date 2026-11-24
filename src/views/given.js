/* Ansichten zu „Was ich verschenkt habe“: Liste im Verlauf, Eintragen, Hinweis bei Beschenkten, Merken nach dem Reservieren. */
import { S } from '../state.js';
import { esc, ic } from '../lib/util.js';
import { OCC, occL } from '../data/content.js';
import { STATUS, giftsFor } from '../lib/given.js';
import { partnerLink, partnerOf } from '../lib/shops.js';

const when = d => { const x = new Date(String(d).slice(0, 10) + 'T12:00:00'); return Number.isNaN(+x) ? '' : x.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }); };
const REACT = { ja: 'Kam gut an', teils: 'Teils, teils', nein: 'Kam nicht so gut an' };

function Item(g) {
  return `<article class="gitem"><span class="av t${(g.recipient || '?').length % 6}" aria-hidden="true">${esc((g.recipient || '?').slice(0, 1).toUpperCase())}</span><div>
   <h3 aria-level="2">${esc(g.what)}</h3><p class="muted" style="font-size:14px">Für ${esc(g.recipient)}${g.occasion ? ' · ' + esc(occL(g.occasion) || g.occasion) : ''} · ${esc(when(g.when))}${g.price ? ' · ' + g.price.toFixed(2).replace('.', ',') + ' €' : ''}</p>
   ${g.note ? `<p style="font-size:14px;margin-top:4px">${esc(g.note)}</p>` : ''}
   <div class="chips" style="margin-top:8px"><span class="chip ${g.status === 'reserved' ? 'gold' : 'ok'}">${esc(STATUS[g.status] || g.status)}</span>
    <button class="chip" data-act="givenreact" data-id="${esc(g.id)}" title="Wie kam es an? Das siehst nur du.">${g.reaction ? esc(REACT[g.reaction]) : 'Wie kam es an?'}</button>
    ${g.url ? (u => `<a class="chip" href="${esc(u)}" target="_blank" rel="noopener noreferrer${partnerOf(u) ? ' sponsored nofollow' : ''}">Produkt ansehen${partnerOf(u) ? ' (Anzeige)' : ''}</a>`)(partnerLink(g.url, String(g.ref || '').split(':').pop())) : ''}
    <button class="chip" data-act="givendel" data-id="${esc(g.id)}" aria-label="${esc(g.what)} entfernen">Entfernen</button></div></div></article>`;
}

/** Abschnitt im Verlauf (eigene Ansicht). */
export function GivenSection() {
  const list = S.given || [];
  return `<section class="sect" style="margin-top:28px"><div class="row" style="justify-content:space-between;margin-bottom:6px"><h3 aria-level="2">Was ich verschenkt habe</h3><button class="btn sec sm" data-act="modal" data-v="giftgiven">${ic('plus', 'sm')}Geschenk eintragen</button></div>
   <p class="muted" style="font-size:14px;margin-bottom:12px">Hier merkst du dir, was du anderen geschenkt hast, damit du nächstes Jahr nichts doppelt schenkst. Was du bei Wishtale reservierst oder als gekauft markierst, steht automatisch hier. Das sieht nur du, die beschenkte Person erfährt davon nichts.</p>
   ${list.length ? `<div class="glist">${list.map(Item).join('')}</div>` : `<div class="banner">${ic('gift')}<span>Noch nichts eingetragen. Sobald du bei einem Wishtale etwas reservierst, erscheint es hier, oder du trägst ein Geschenk selbst ein.</span></div>`}</section>`;
}

/** Hinweis auf der Seite einer Person, der man schon etwas geschenkt hat. */
export function PastGifts(p) {
  const done = giftsFor(p.handle || p.id).filter(g => g.status !== 'reserved');
  if (!done.length) return '';
  const bits = done.slice(0, 3).map(g => `<b>${esc(g.what)}</b> (${esc(when(g.when))})`).join(', ');
  return `<div class="banner green" role="note">${ic('gift')}<span>Du hast ${esc(p.name)} schon etwas geschenkt: ${bits}. Vielleicht suchst du diesmal etwas anderes aus.</span></div>`;
}

/** Nach dem Reservieren: Hinweis, was mit dem Geschenk passiert, und bei Gästen der Weg zum eigenen Wishtale. */
export function RememberNote() {
  if (S.auth.user) return `<span class="muted" style="display:block;margin-top:4px">Wir merken uns das Geschenk für dich. Du findest es im Verlauf unter „Was ich verschenkt habe“.</span>`;
  return `<span class="muted" style="display:block;margin-top:4px">Wir merken uns das Geschenk auf diesem Gerät. Mit einem eigenen Wishtale bleibt es dauerhaft gespeichert, und du bekommst deinen eigenen Wunschzettel dazu.</span><span class="row" style="gap:8px;margin-top:8px"><button class="btn pri sm" data-act="tologin">Mein Wishtale anlegen</button><button class="btn ghost sm" data-act="modal" data-v="mailme">Link per Mail sichern</button></span>`;
}

export function GivenModal() {
  const list = S.given || [];
  return `<div class="scrim" data-act="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt">
   <h2 id="mt">Meine Geschenke</h2>
   <p class="muted" style="font-size:14.5px;margin-bottom:12px">Das sind die Geschenke, die du hier reserviert oder gekauft hast. Sie liegen nur auf diesem Gerät, und niemand sonst sieht sie.</p>
   ${list.length ? `<div class="glist">${list.map(Item).join('')}</div>` : '<p class="muted">Noch nichts gemerkt.</p>'}
   <div class="panel" style="margin-top:16px;display:grid;gap:8px"><b>Behalte deine Geschenke für immer</b><span class="muted" style="font-size:14.5px">Mit einem eigenen Wishtale (kostenlos) bleiben sie gespeichert, auch auf anderen Geräten. Du erinnerst dich im nächsten Jahr, was du wem geschenkt hast, und deine Freunde finden deine eigenen Wünsche.</span><div><button class="btn pri" data-act="tologin">Mein Wishtale anlegen</button></div></div>
   <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn ghost" data-act="close">Schließen</button></div></div></div>`;
}

export function GiftGivenModal() {
  const names = [...new Set((S.given || []).map(g => g.recipient))];
  return `<div class="scrim" data-act="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt">
   <h2 id="mt">Geschenk eintragen</h2>
   <form data-form="givengift">
    <div class="fld"><label for="gg-r">Für wen?</label><input id="gg-r" name="recipient" class="inp" required maxlength="60" list="gg-names" autocomplete="off" placeholder="z. B. Mama"><datalist id="gg-names">${names.map(n => `<option value="${esc(n)}">`).join('')}</datalist></div>
    <div class="fld"><label for="gg-w">Was hast du geschenkt?</label><input id="gg-w" name="what" class="inp" required maxlength="160" autocomplete="off" placeholder="z. B. Handkaffeemühle"></div>
    <div class="fld"><label for="gg-o">Anlass</label><select id="gg-o" name="occasion" class="sel"><option value="">Ohne Anlass</option>${OCC.map(o => `<option value="${o.id}">${o.l}</option>`).join('')}</select></div>
    <div class="fld"><label for="gg-d">Wann?</label><input id="gg-d" name="when" type="date" class="inp" value="${new Date().toISOString().slice(0, 10)}"></div>
    <div class="fld"><label for="gg-p">Preis in Euro (optional)</label><input id="gg-p" name="price" class="inp" inputmode="decimal" placeholder="z. B. 49,90"></div>
    <div class="fld"><span class="lb">Wie kam es an? (optional, das siehst nur du)</span><div class="radios">${[['', 'Weiß ich noch nicht'], ['ja', 'Kam gut an'], ['teils', 'Teils, teils'], ['nein', 'Nicht so gut']].map(([v, l], i) => `<label><input type="radio" name="reaction" value="${v}" ${i ? '' : 'checked'}><span>${l}</span></label>`).join('')}</div></div>
    <div class="fld"><label for="gg-n">Notiz (optional)</label><textarea id="gg-n" name="note" class="ta" maxlength="400" placeholder="z. B. Hat sich besonders über die Verpackung gefreut"></textarea></div>
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn ghost" data-act="close">Abbrechen</button><button class="btn pri" type="submit">Speichern</button></div>
   </form></div></div>`;
}

/** Gast ohne Konto: Link zu den eigenen Reservierungen per Mail (106). Die Adresse wird nur für diese Mail genutzt. */
export function MailMeModal() {
  const z = S.ui.mm || {};
  return `<div class="scrim" data-act="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt">
   <div class="sheet-head"><h2 id="mt">Reservierung per Mail sichern</h2><button type="button" class="sheet-x" data-act="close" aria-label="Schließen">×</button></div>
   ${z.sent ? `<div class="banner green" role="status"><span>Die Mail ist unterwegs. Mit dem Link darin siehst du deine Reservierung auf jedem Gerät wieder.</span></div>
    <div class="row" style="justify-content:flex-end;margin-top:14px"><button type="button" class="btn pri" data-act="close">Fertig</button></div>`
   : `<p class="muted" style="margin:6px 0 12px">Wir schicken dir einen Link, mit dem du deine Reservierung auch auf einem anderen Gerät wiederfindest. Deine Adresse nutzen wir nur für diese eine Mail und speichern sie nicht.</p>
   <form data-form="mailme"><div class="fld"><label for="mme">Deine E-Mail-Adresse</label><input id="mme" name="email" type="email" class="inp" required autocomplete="email" maxlength="254" value="${esc(z.email || '')}"></div>
    ${z.error ? `<p role="alert" class="comerr">${esc(z.error)}</p>` : ''}
    <div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><button type="button" class="btn ghost" data-act="close">Abbrechen</button><button class="btn pri" ${z.busy ? 'disabled' : ''}>${z.busy ? 'Wird verschickt …' : 'Link schicken'}</button></div></form>`}
  </div></div>`;
}
