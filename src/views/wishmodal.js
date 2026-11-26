/* Detail-Fenster zu einem Wunsch: Vorschlag ansehen, Alternativen vergleichen, wählen oder weitersuchen. */
import { WishArt, wPrice } from './card.js';
import { S, guestPerson } from '../state.js';
import { esc, ic, gen } from '../lib/util.js';
import { criteriaText } from '../lib/fit.js';
import { artIllu } from '../lib/art.js';
import { offersFor } from '../lib/products.js';
import { cat, occL, PRIO } from '../data/content.js';
import { priceLine } from './product.js';
import { ideasOf, aiStatus } from '../lib/ideas.js';
import { viaName } from '../lib/invite.js';
import { AiLoading } from './ailoading.js';
import { isSpecific } from '../lib/products.js';
import { searchUrl, partnerOf, shopHost, partnerLink, ideaShops } from '../lib/shops.js';
import { IdeaIcon, ideaPrice } from './inspiration.js';
import { RememberNote } from './given.js';

const REL = 'noopener noreferrer sponsored nofollow';
const words = t => String(t || '').toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, ' ').split(/\s+/).filter(x => x.length > 1);
/** Gleiches Produkt, wenn fast alle Wörter des kürzeren Namens im längeren vorkommen (verhindert doppelte Karten). */
export function sameItem(a, b) {
  const A = words(a), B = words(b); if (!A.length || !B.length) return false;
  const [s, l] = A.length <= B.length ? [A, new Set(B)] : [B, new Set(A)];
  return s.filter(x => l.has(x)).length / s.length >= 0.8;
}

/** Ist das Angebot der Wunsch selbst (eigener Link oder die genaue Suche nach dem Namen)? */
const isSelf = (pr, w) => pr.source === 'link' || (pr.source === 'erzeugt' && sameItem(pr.t, w.t));

function Offer(pr, w, ctx, role) {
  const guestFree = ctx === 'guest' && !w.res && !w.bought;
  const amazon = pr.host === 'amazon.de' || pr.host.endsWith('.amazon.de');
  const ad = amazon || !!partnerOf(pr.url); // Partnerlinks (Amazon, Awin-Händler wie Otto) gleich kennzeichnen
  const label = amazon ? (pr.direct ? 'Bei Amazon ansehen' : 'Bei Amazon suchen') : `Zu ${esc(pr.host)}`;
  const chosen = S.ui.chosen && S.ui.chosen[w.id] && S.ui.chosen[w.id].t === pr.t;
  // Der Wunsch selbst steht schon oben mit Bild und Namen: hier nur noch Preis und Weg zum Shop (098)
  const self = role === 'main' && (pr.source === 'link' || (pr.source === 'erzeugt' && sameItem(pr.t, w.t)));
  const quiet = role !== 'main';
  return `<div class="offer ${role === 'main' ? 'main' : ''} ${self ? 'self' : ''} ${quiet ? 'quiet' : ''} ${pr.source === 'link' || (pr.source === 'erzeugt' && isSpecific(w) && w.kind === 'produkt') ? '' : 'suggest'} ${chosen ? 'chosen' : ''}">
   ${self ? '' : role === 'main' && (pr.source === 'link' || pr.source === 'erzeugt') && w.img ? `<span class="otn"><img src="${w.img}" alt="" onerror="this.remove()" style="width:100%;height:100%;object-fit:cover;border-radius:inherit"></span>` : pr.brand ? `<span class="otn brand" aria-hidden="true"><b>${esc(pr.brand.slice(0, 1))}</b><small>${esc(pr.brand)}</small></span>` : `<span class="otn">${artIllu(pr.a || 'gift', pr.tone || 0)}</span>`}
   <div class="obody">
    <span class="eyebrow">${pr.source === 'link' ? 'Gewünschtes Produkt' : pr.source === 'amz' ? 'Preise bei Amazon vergleichen' : pr.source === 'erzeugt' ? (isSpecific(w) && w.kind === 'produkt' ? 'Gewünschtes Produkt, bei Amazon' : 'Suche nach genau diesem Wunsch') : role === 'main' ? 'Vorschlag von Wishtale' : 'Vorschlag'}</span>
    ${self ? '' : `<strong class="ot">${esc(pr.t)}</strong>`}
    ${priceLine(pr)}
    ${(pr.why || []).slice(0, 2).map(t => `<span class="why">${esc(t)}</span>`).join('')}
    ${chosen ? `<span class="chip ok">${ic('check', 'sm')}Deine Wahl</span>` : ''}
   </div>
   <div class="oa">
    <a class="${quiet ? 'qa' : 'btn amz sm'}" href="${pr.url}" target="_blank" rel="${REL}">${label}${quiet ? (ad ? ' (Anzeige)' : '') : ` ${ic('arrow', 'sm')}`}</a>
    ${role === 'main' && pr.source === 'erzeugt' && ctx === 'own' && w.kind === 'produkt' ? `<button class="btn ghost sm" data-act="wamz" data-id="${w.id}" ${S.ui.amzBusy === w.id ? 'disabled' : ''}>${S.ui.amzBusy === w.id ? 'Suche läuft …' : 'Direkten Amazon-Link suchen'}</button>` : ''}
    ${guestFree ? `<button class="${quiet ? 'qa qa-add' : 'btn pri sm'}" data-act="choose" data-wid="${w.id}" data-pid="${esc(pr.id)}">Diesen wählen</button>` : ''}
   </div>
  </div>`;
}

/*
 * Kaufweg für den Wunsch selbst (Jann, 2026-11-26: „Preis bei Amazon … Zu otto.de … das verwirrt alles“): ein Kasten mit höchstens
 * einem Preis und klar beschrifteten Knöpfen. Der eigene Shop-Link steht zuerst, Amazon und Otto immer daneben, einmal „Anzeige“.
 * Ersetzt für den Wunsch selbst die frühere Angebotskarte, die Otto-Zeile und „Auch bei Amazon“.
 */
function BuyBox(w, main, ctx) {
  const own = main && main.source === 'link' ? main : null;
  const host = own ? String(own.host || '').replace(/^www\./, '') : '';
  const isAmz = /(^|\.)amazon\./.test(host), isOtto = /(^|\.)otto\.de$/.test(host);
  const ref = ctx === 'guest' ? 'gast' : 'eigen';
  const shops = [];
  if (own && !isAmz && !isOtto) shops.push({ url: own.url, label: `Bei ${esc(host)} ansehen`, ad: !!partnerOf(own.url) });
  const amz = { url: own && isAmz ? own.url : searchUrl.amazon(w.t), label: 'Bei Amazon ansehen', ad: true };
  const otto = { url: own && isOtto ? own.url : searchUrl.otto(w.t, ref), label: 'Bei Otto ansehen', ad: true };
  if (isOtto) shops.push(otto, amz); else shops.push(amz, otto);
  const price = wPrice(w);
  const guestFree = ctx === 'guest' && !w.res && !w.bought && main;
  return `<section class="wm-sec buybox">
   ${price ? `<div class="bb-price"><b>${price}</b><span>${price.startsWith('ca.') ? 'Ungefährer Preis, den aktuellen siehst du im Shop.' : 'Preis laut Shop, er kann sich ändern.'}</span></div>` : ''}
   <div class="bb-shops">${shops.map((s, i) => `<a class="btn ${i === 0 ? 'amz' : 'sec'} sm" href="${esc(s.url)}" target="_blank" rel="${REL}" data-place="wunsch">${s.label} ${ic('arrow', 'sm')}</a>`).join('')}</div>
   <p class="bb-ad">${shops.some(s => s.ad) ? 'Anzeige' : ''}</p>
   ${!own && ctx === 'own' && w.kind === 'produkt' ? `<button class="qa" data-act="wamz" data-id="${w.id}" ${S.ui.amzBusy === w.id ? 'disabled' : ''}>${S.ui.amzBusy === w.id ? 'Suche läuft …' : 'Genaues Produkt bei Amazon finden'}</button>` : ''}
   ${guestFree ? `<button class="btn pri sm bb-choose" data-act="choose" data-wid="${w.id}" data-pid="${esc(main.id)}">Diesen wählen</button>` : ''}
  </section>`;
}

/** Herkunft des Bildes in Worten: Bildserver von Amazon heißt „Amazon“, die Bildersuche selbst ist keine Herkunft. */
function imgFrom(src) {
  const h = String(src || '').toLowerCase();
  if (!h || /search\.brave\.com$/.test(h)) return '';
  if (/(media-amazon|images-amazon|amazon)\./.test(h)) return 'Amazon';
  return h.replace(/^www\./, '').slice(0, 60);
}

/** Varianten von der KI zu einem ungenauen Wunsch (api/ideas.js, mode=wish). */
function AiVariants(w, ctx) {
  if (w.noSuggest) return '';
  const st = aiStatus('wish:' + w.id);
  if (st === 'loading') return `<section class="wm-sec">${AiLoading('Deine individuellen Empfehlungen werden erstellt …')}</section>`;
  const list = ideasOf('wish:' + w.id);
  if (!list.length) return '';
  const guestFree = ctx === 'guest' && !w.res && !w.bought;
  const sim = isSpecific(w);
  // Eigene, salbeigrüne Fläche mit weißen Karten wie bei den übrigen Vorschlägen von Wishtale (Jann, 2026-11-26: „zu ton in ton“)
  return `<section class="wm-sec ideas-zone aivars"><p class="eyebrow zone-eb">${ic('spark', 'sm')}${sim ? 'Ähnliche Produkte, falls es das Gewünschte nicht gibt' : w.kind === 'produkt' ? 'Weitere passende Produkte von Wishtale' : 'Passende Produkte von Wishtale'}</p><div class="aivar-list">${list.map(i => {
    const chosen = S.ui.chosen && S.ui.chosen[w.id] && S.ui.chosen[w.id].t === i.t, t = esc(i.t), price = ideaPrice(i);
    return `<article class="aivar ${chosen ? 'chosen' : ''}"><div class="idea-top">${IdeaIcon(i)}<div class="idea-ht"><strong class="ot">${t}</strong>${price ? `<span class="aiv-price" title="Grobe Schätzung, den aktuellen Preis siehst du im Shop">${price}</span>` : ''}</div></div>
      <p class="why">${esc(i.why)}</p>${chosen ? `<span class="chip ok" style="margin-top:6px">${ic('check', 'sm')}Deine Wahl</span>` : ''}
      <div class="aiv-acts">${guestFree ? `<button class="idea-add" data-act="aichoose" data-wid="${w.id}" data-t="${t}">Diesen wählen</button>` : ''}${ctx === 'own' ? `<button class="idea-add" data-act="aiuse" data-wid="${w.id}" data-t="${t}" title="Dieser Vorschlag ersetzt den Wunsch, du kannst es gleich rückgängig machen">${ic('check', 'sm')}Dieses Produkt übernehmen</button>` : ''}${ideaShops(i, ctx === 'own' ? 'wunsch' : 'gast', 'shop-pill')}${ctx === 'own' ? `<button class="qa-soft" data-act="aivhave" data-wid="${w.id}" data-t="${t}">Habe ich schon</button>` : ''}</div></article>`;
  }).join('')}</div></section>`;
}

/** Macht klar, was ein Vorschlag von Wishtale ist und was ein Wunsch der Person selbst. */
function Suggest(p, w, o, ctx) {
  if (isSpecific(w) && !w.link && w.kind === 'produkt') return ''; // bestimmtes Produkt ohne Link (zum Beispiel eingelesener Amazon-Titel): kein Vorschlag, die Karte darunter ist der Wunsch selbst
  const suggested = o.main ? o.main.source !== 'link' : o.alts.length > 0;
  if (!suggested) return '';
  const crit = criteriaText(w);
  if (ctx === 'own') {
    return `<div class="sugg"><b>Du hast kein bestimmtes Produkt gewählt</b><span>Deine Freunde sehen deshalb Vorschläge von Wishtale${crit ? `, die zu den Kriterien deines Wunsches passen (${esc(crit)})` : ''}. Möchtest du ein bestimmtes Produkt, ergänze den Link dazu.</span> <button class="btn sec sm" data-act="wedit" data-id="${w.id}" style="margin-top:8px">Link ergänzen</button></div>`;
  }
  return `<div class="sugg"><b>Vorschlag von Wishtale</b><span>${esc(p.name)} hat kein bestimmtes Produkt ausgewählt. ${crit ? `Diese Auswahl passt zu den Kriterien des Wunsches (${esc(crit)}).` : 'Diese Auswahl passt zum Wunsch.'} Es ist nicht ${esc(gen(p.name))} Wahl. Wir testen und bewerten die Produkte nicht, schau dir deshalb vor dem Kauf Preis und Bewertungen an.</span></div>`;
}

/**
 * Nach dem Reservieren ein leiser Kaufweg (Dev 111): der Moment mit der größten Kaufabsicht. Eigener Link des Wunsches zuerst,
 * sonst die genaue Suche bei Amazon. Nie ein Vorschlag von Wishtale, damit es nicht wie die Wahl der Person aussieht.
 * Bewusst ein Textlink in einem ganzen Satz, mit „Laden deiner Wahl“ als ehrlicher Alternative.
 */
function BuyLine(w, o, byAi, chosen) {
  if (w.kind === 'erlebnis' || w.kind === 'frei') return '';
  let host = 'amazon.de';
  if (chosen && chosen.url) host = shopHost(chosen.url) || host; // hinter einem Awin-Deeplink der echte Shop
  const own = chosen && chosen.url ? { url: partnerLink(chosen.url, w.id), host } : !byAi && o.main && ['link', 'erzeugt', 'amz'].includes(o.main.source) ? o.main : null;
  const url = own ? own.url : w.kind === 'produkt' ? searchUrl.amazon(w.t) : '';
  if (!url) return '';
  host = own ? own.host || host : 'amazon.de';
  const amazon = /(^|\.)amazon\./.test(host);
  const ad = amazon || !!partnerOf(url);
  const where = amazon ? 'bei Amazon' : `bei ${esc(host.replace(/^www\./, ''))}`;
  return `<p class="buyline">Wenn du es gleich besorgen möchtest, findest du es <a href="${esc(url)}" target="_blank" rel="${REL}" data-place="reserviert">${where}</a>${ad ? ' (Anzeige)' : ''} oder in einem Laden deiner Wahl.</p>`;
}

export function WishModal() {
  const ctx = S.ui.wishCtx || 'guest';
  const p = ctx === 'guest' ? guestPerson() : S.me;
  const w0 = p && p.wishes.find(x => x.id === S.ui.pickId);
  if (!w0) return '';
  const w = ctx === 'preview' ? { ...w0, res: null, bought: false } : w0;
  const o = offersFor(p, w);
  const aiSt = aiStatus('wish:' + w.id), byAi = !w.noSuggest && !w.link && w.kind !== 'erlebnis' && !isSpecific(w) && (!o.main || o.main.source !== 'link') && (aiSt === 'loading' || aiSt === 'ready'); // KI ersetzt den Katalog-Vorschlag
  const mine = w.res === 'me', taken = w.res === 'other';
  const chosen = S.ui.chosen && S.ui.chosen[w.id];
  const meta = [cat(w.c).n, ...(w.occ || []).map(occL), w.kind === 'kategorie' && w.budget ? `bis ${w.budget} €` : ''].filter(Boolean);

  let state = '';
  if (ctx === 'guest') {
    if (w.bought) state = `<div class="banner green">${ic('check')}<span>Das hast du schon besorgt. Die Überraschung bleibt natürlich bestehen.</span></div>`;
    else if (mine) state = `<div class="banner green">${ic('lock')}<span>Du hast diesen Wunsch reserviert.${chosen ? ` Deine Wahl: <b>${esc(chosen.t)}</b>.` : ''} ${esc(p.name)} erfährt davon nichts.${p.managed ? '' : RememberNote()}</span></div>`;
    if (mine && !w.bought) state += BuyLine(w, o, byAi, chosen);
    else if (taken) state = `<div class="banner">${ic('lock')}<span>Um diesen Wunsch kümmert sich schon jemand anderes.</span></div>`;
  }

  let footer = '';
  if (ctx === 'guest') {
    if (mine && !w.bought) footer = `<button class="btn pri" data-act="bought" data-id="${w.id}">Gekauft</button><button class="btn sec" data-act="release" data-id="${w.id}">Freigeben</button>`;
    else if (!taken && !w.bought && !o.main) footer = `<button class="btn pri" data-act="reserve" data-id="${w.id}">Reservieren</button>`;
  } else if (ctx === 'own') {
    footer = `<button class="btn sec sm" data-act="wedit" data-id="${w.id}">Bearbeiten</button><button class="qa qa-done" data-act="selbst" data-from="view" data-id="${w.id}">${w.status === 'selbst' ? 'Wieder auf die Wunschliste' : `${ic('check', 'sm')}Selbst erfüllt`}</button>
      <label class="prio-sel"><span>Wichtigkeit</span><select class="sel sm" data-prio="${w.id}" aria-label="Wichtigkeit">${[3, 2, 1].map(n => `<option value="${n}" ${w.prio === n ? 'selected' : ''}>${PRIO[n]}</option>`).join('')}</select></label>
      <button class="btn ghost sm" data-act="delw" data-id="${w.id}">${ic('trash', 'sm')}Löschen</button>`;
  }

  return `<div class="scrim" data-act="closebg"><div class="sheet wide" role="dialog" aria-modal="true" aria-labelledby="mt">
   <button type="button" class="sheet-x wm-x" data-act="close" aria-label="Schließen">×</button>
   <div class="wm-top">
    <span class="wm-img">${WishArt(w, null)}</span>
    <div>
     <p class="eyebrow">${esc(meta.join(' · '))}</p>
     <h2 id="mt">${esc(w.t)}</h2>
     ${w.note ? `<p class="muted" style="margin-top:6px">${esc(w.note)}</p>` : ''}
     ${w.via ? `<span class="chip gold" style="margin-top:8px">Tipp von ${esc(viaName(w.via))}</span>` : ''}
     ${w.img && imgFrom(w.imgSrc) ? `<p class="muted tiny" style="margin-top:6px">Bild von ${esc(imgFrom(w.imgSrc))}</p>` : ''}
    </div>
   </div>
   ${ctx === 'preview' ? `<div class="banner green">${ic('eye')}<span>So sehen Schenkende diesen Wunsch.</span></div>` : ''}
   ${state}
   ${footer ? `<div class="row wm-actions">${footer}</div>` : ''}
   ${w.noSuggest ? `<div class="sugg"><b>Keine Vorschläge</b><span>Hierfür werden auf Wunsch von ${esc(p.managed ? (p.parent || (ctx === 'own' && S.accounts && S.accounts.me && S.accounts.me.name) || 'der Familie') : p.name)} keine Vorschläge generiert.</span>${ctx === 'own' ? `<button class="btn ghost sm" style="margin-top:8px" data-act="wnosug" data-id="${w.id}">Vorschläge wieder erlauben</button>` : ''}</div>` : ''}
   ${byAi || w.noSuggest ? '' : Suggest(p, w, o, ctx)}
   ${byAi && w.kind === 'produkt' ? BuyBox(w, null, ctx) : ''}
   ${o.main && !byAi ? (isSelf(o.main, w) ? BuyBox(w, o.main, ctx) : `<section class="wm-sec">${Offer(o.main, w, ctx, 'main')}</section>`) : (w.kind === 'erlebnis' ? `<p class="muted" style="margin:14px 0">Für ein Erlebnis brauchst du kein Produkt. Überlege am besten mit anderen Freunden, was sich organisieren lässt, und reserviere den Wunsch hier, damit niemand doppelt plant.</p>` : '')}
   ${(o.alts = o.alts.filter(a => !sameItem(a.t, w.t))).length && !byAi && !ideasOf('wish:' + w.id).length && aiStatus('wish:' + w.id) !== 'loading' ? `<section class="wm-sec"><p class="eyebrow" style="margin-bottom:8px">${w.kind === 'frei' ? 'Ideen von Wishtale zu diesem Wunsch' : o.main && o.main.source === 'link' ? 'Alternativen von Wishtale' : 'Weitere Vorschläge von Wishtale'}</p>${o.alts.map(a => Offer(a, w, ctx, 'alt')).join('')}</section>` : ''}
   ${AiVariants(w, ctx)}
   ${o.over ? `<p class="muted" style="font-size:13px">${o.over} Produkt${o.over > 1 ? 'e' : ''} über dem Budget ausgeblendet.</p>` : ''}
   ${ctx === 'own' && !w.noSuggest && w.kind !== 'erlebnis' ? `<p style="margin:6px 0"><button class="linkbtn" data-act="wnosug" data-id="${w.id}">Hierfür keine Vorschläge generieren</button></p>` : ''}
   <p class="disc">Die Links zu Amazon und Otto sind Partnerlinks (Anzeige). Dir entstehen dadurch keine Mehrkosten. Maßgeblich ist immer der Preis im Shop. Vorschläge von Wishtale wählen wir nach den Kriterien des Wunsches aus. Wir testen und bewerten die Produkte nicht.</p>
   <div class="row wm-foot"><span style="flex:1"></span><button class="btn ghost" data-act="close">Schließen</button></div>
  </div></div>`;
}
