/*
 * Neuer Wunsch mit drei Reitern (124, Jann 2026-11-25): „Ideen“ (eigene Vorschläge von Wishtale), „Suchen“ (Treffer mit Bild und Preis
 * aus vielen Shops, ohne die Seite zu verlassen) und „Eingeben“ (das schlanke Formular). Der Reiter steht in S.ui.wtab, gewechselt wird
 * ohne neues Zeichnen, damit Eingaben im Formular stehen bleiben. Die Suche zeichnet nur den Kasten #wsres neu.
 */
import { S } from '../state.js';
import { esc, ic, money } from '../lib/util.js';
import { ideasOf, aiStatus, skey } from '../lib/ideas.js';
import { ideaPrice } from './inspiration.js';
import { wishGlyph } from '../lib/wishicon.js';
import { guessCategory } from '../lib/category.js';
import { cat } from '../data/content.js';
import { searchUrl, partnerLink } from '../lib/shops.js';

export const TABS = [['ideen', 'Ideen'], ['suchen', 'Suchen'], ['eingeben', 'Eingeben']];
/** Anlass-Listen haben kein Profil, darum gibt es dort keine eigenen Ideen. */
const tabs = () => (S.me.occasion ? TABS.filter(([k]) => k !== 'ideen') : TABS);
/** Ohne Konto gibt es weder Suche noch eigene Ideen, dann startet der Dialog beim Formular. */
export const canSearch = () => !!(S.auth.user && S.me.handle && !S.me.managed);
export const wishTab = () => {
  const t = S.ui.wtab;
  if (t && tabs().some(([k]) => k === t)) return t;
  return 'eingeben'; // „Wunsch hinzufügen“ startet bei „Eingeben“ (Jann, 2026-11-25)
};

/* Gesucht wird bei Otto (Jann, 2026-11-25: „zieh doch die Suche immer von Otto und lege beide Links (Amazon und Otto) unter die Anzeige“):
   Otto liefert Bild und Preis, jeder Treffer hat darunter „Bei Amazon“ und „Bei Otto“ mit einem gemeinsamen „Anzeige“.
   Findet Otto nichts, sucht der Server in anderen Shops. */
export function WishTabs() {
  const cur = wishTab();
  return `<div class="wtabs" role="tablist" aria-label="Wie möchtest du deinen Wunsch hinzufügen?">${tabs().map(([k, l]) => `<button type="button" role="tab" id="wtab-${k}" class="wtab${k === cur ? ' on' : ''}" aria-selected="${k === cur}" aria-controls="wpane-${k}" tabindex="${k === cur ? 0 : -1}" data-act="wdtab" data-v="${k}">${l}</button>`).join('')}</div>`;
}

const thumb = (t, preview) => {
  if (preview) return `<img src="${preview}" alt="">`;
  // ohne Bild (Amazon-Treffer, manche Otto-Seiten): das Symbol der Kategorie wie auf der Wunschliste
  const c = guessCategory(t);
  return `<span class="art mono t${(cat(c).t ?? 0) % 6}" aria-hidden="true">${wishGlyph(t, c)}</span>`;
};

export function SearchPane() {
  const z = S.ui.ws || {};
  return `<form data-form="wsearch" class="ws-form" role="search"><label for="wsq" class="vh">Wonach suchst du?</label><span class="wq-ic" aria-hidden="true">${ic('search')}</span>
    <input id="wsq" name="q" class="inp big wq-inp" placeholder="Wonach suchst du?" autocomplete="off" enterkeyhint="search" value="${esc(z.q || '')}"><button class="btn pri ws-go" type="submit">Suchen</button></form>
   <div id="wsres" aria-live="polite">${SearchResults()}</div>`;
}

const REL = 'noopener noreferrer sponsored nofollow';
/** Zwei Wege je Treffer: Amazon (Suche mit dem Namen, Partner-Kennung) und Otto (der Treffer selbst oder die Otto-Suche, über Awin). */
const shopLinks = x => {
  const otto = /(^|\.)otto\.de$/i.test(x.host || '') ? partnerLink(x.url, 'suche') : searchUrl.otto(x.t, 'suche');
  const other = x.host && !/(^|\.)otto\.de$/i.test(x.host) ? `<a class="shop-pill" href="${esc(partnerLink(x.url, 'suche'))}" target="_blank" rel="${REL}">${esc(x.host)}</a>` : '';
  return `<span class="ws-shoplinks">${other}<a class="shop-pill" href="${esc(searchUrl.amazon(x.t))}" target="_blank" rel="${REL}">Bei Amazon</a><a class="shop-pill" href="${esc(otto)}" target="_blank" rel="${REL}">Bei Otto</a><span class="ad-note">Anzeige</span></span>`;
};

export function SearchResults() {
  const z = S.ui.ws || {}, q = esc(z.q || '');
  const own = z.q ? `<button type="button" class="ws-own" data-act="wsown">${ic('plus', 'sm')}<span>„${q}“ selbst eintragen</span></button>` : '';
  const more = z.q ? `<p class="ws-amz">Alle Treffer <a href="${searchUrl.amazon(z.q)}" target="_blank" rel="${REL}">bei Amazon</a> oder <a href="${searchUrl.otto(z.q, 'suche')}" target="_blank" rel="${REL}">bei Otto</a> ansehen <span class="ad-note">Anzeige</span></p>` : '';
  if (z.st === 'loading') return `<div class="ws-load" role="status"><span class="aiload-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Wishtale sucht nach „${q}“</span></div><div class="ws-skel" aria-hidden="true"><div></div><div></div><div></div></div>`;
  if (z.st === 'error') return `<p class="ws-note">${esc(z.err || 'Die Suche hat gerade nicht geklappt.')}</p>${own}`;
  if (z.st === 'done') {
    const list = z.items || [];
    if (!list.length) return `<p class="ws-note">Dazu haben wir nichts Passendes gefunden. Trag deinen Wunsch einfach selbst ein, Wishtale zeigt deinen Freunden dann Ideen dazu.</p>${own}${more}`;
    return `<ul class="ws-list">${list.map((x, i) => `<li class="ws-item"><span class="ws-thumb">${thumb(x.t, x.img && x.img.preview)}</span>
      <span class="ws-body"><b class="ws-t">${esc(x.t)}</b>${x.price ? `<small><span class="ws-price">ca. ${money(x.price)}</span></small>` : ''}${shopLinks(x)}</span>
      <button type="button" class="ws-add" data-act="wsadd" data-i="${i}" aria-label="${esc(x.t)} auf meine Wunschliste" ${z.adding === i ? 'disabled' : ''}>${z.adding === i ? '…' : ic('plus', 'sm')}</button></li>`).join('')}</ul>
     <p class="ws-fine">Bild und Preis vom Shop, der Preis kann sich ändern.</p>${own}${more}`;
  }
  return `<p class="ws-note">Gib ein Produkt ein, zum Beispiel „Tonies Schlummerbande“, und such dir aus den Treffern das Richtige aus.</p>`;
}

/* Eigene Ideen: dieselben Rückmeldungen wie auf den Ideenkarten, dazu „Erfülle ich mir selbst“. */
export function IdeasPane() {
  const h = S.me.handle;
  if (!canSearch()) return `<p class="ws-note">Mit einem Konto schlägt dir Wishtale hier Ideen vor, die zu dir passen.</p>`;
  const k = skey(h), st = aiStatus(k), list = ideasOf(k);
  if (!list.length && (st === 'loading' || st === 'none' || !st)) return `<div class="ws-load" role="status"><span class="aiload-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Wishtale sucht Ideen, die zu dir passen</span></div><div class="ws-skel" aria-hidden="true"><div></div><div></div><div></div></div>`;
  if (!list.length) return `<p class="ws-note">Gerade haben wir keine neuen Ideen für dich. Je mehr du im Profil über dich erzählst, desto besser werden sie.</p>`;
  return `<ul class="wi-list">${list.slice(0, 8).map(i => {
    const t = esc(i.t), price = ideaPrice(i);
    return `<li class="wi-item"><span class="ws-thumb">${thumb(i.exp ? 'erlebnis' : i.t)}</span>
     <span class="ws-body"><b>${t}</b><small>${i.exp ? 'Erlebnis' : 'Geschenk'}${price ? ` · ${price}` : ''}</small>${i.why ? `<span class="wi-why">${esc(i.why)}</span>` : ''}
      <span class="wi-acts"><button type="button" class="qa-soft" data-act="aihave" data-t="${t}">Habe ich schon</button><span aria-hidden="true">·</span><button type="button" class="qa-soft" data-act="aiplan" data-t="${t}">Erfülle ich mir selbst</button><span aria-hidden="true">·</span><button type="button" class="qa-soft" data-act="ideano" data-self="1" data-t="${t}">Passt nicht</button></span></span>
     <button type="button" class="ws-add" data-act="aiadd" data-t="${t}" aria-label="${t} auf meine Wunschliste">${ic('plus', 'sm')}</button></li>`;
  }).join('')}</ul><p class="ws-fine">Vorschläge von Wishtale, passend zu deinem Profil.</p>`;
}
