/* Detail-Fenster zu einem Wunsch: Vorschlag ansehen, Alternativen vergleichen, wählen oder weitersuchen. */
import { WishArt } from './card.js';
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
import { searchUrl } from '../lib/shops.js';
import { RememberNote } from './given.js';

const REL = 'noopener noreferrer sponsored nofollow';

function Offer(pr, w, ctx, role) {
  const guestFree = ctx === 'guest' && !w.res && !w.bought;
  const amazon = pr.host === 'amazon.de' || pr.host.endsWith('.amazon.de');
  const label = amazon ? (pr.direct ? 'Bei Amazon ansehen' : 'Bei Amazon suchen') : `Zu ${esc(pr.host)}`;
  const chosen = S.ui.chosen && S.ui.chosen[w.id] && S.ui.chosen[w.id].t === pr.t;
  return `<div class="offer ${role === 'main' ? 'main' : ''} ${pr.source === 'link' || (pr.source === 'erzeugt' && isSpecific(w) && w.kind === 'produkt') ? '' : 'suggest'} ${chosen ? 'chosen' : ''}">
   ${role === 'main' && (pr.source === 'link' || pr.source === 'erzeugt') && w.img ? `<span class="otn"><img src="${w.img}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit"></span>` : pr.brand ? `<span class="otn brand" aria-hidden="true"><b>${esc(pr.brand.slice(0, 1))}</b><small>${esc(pr.brand)}</small></span>` : `<span class="otn">${artIllu(pr.a || 'gift', pr.tone || 0)}</span>`}
   <div class="obody">
    <span class="eyebrow">${pr.source === 'link' ? 'Gewünschtes Produkt' : pr.source === 'amz' ? 'Preise bei Amazon vergleichen' : pr.source === 'erzeugt' ? (isSpecific(w) && w.kind === 'produkt' ? 'Gewünschtes Produkt, bei Amazon' : 'Suche nach genau diesem Wunsch') : role === 'main' ? 'Vorschlag von Wishtale' : 'Vorschlag'}</span>
    <strong class="ot">${esc(pr.t)}</strong>
    ${priceLine(pr)}
    ${(pr.why || []).slice(0, 2).map(t => `<span class="why">${esc(t)}</span>`).join('')}
    ${chosen ? `<span class="chip ok">${ic('check', 'sm')}Deine Wahl</span>` : ''}
   </div>
   <div class="oa">
    <a class="btn amz sm" href="${pr.url}" target="_blank" rel="${REL}">${label} ${ic('arrow', 'sm')}</a>
    ${guestFree ? `<button class="btn pri sm" data-act="choose" data-wid="${w.id}" data-pid="${esc(pr.id)}">Diesen wählen</button>` : ''}
   </div>
  </div>`;
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
  return `<section class="wm-sec"><p class="eyebrow" style="margin-bottom:8px">${sim ? 'Ähnliche Produkte, falls es das Gewünschte nicht gibt' : w.kind === 'produkt' ? 'Weitere passende Produkte von Wishtale' : 'Passende Produkte von Wishtale'}</p>${list.map(i => {
    const chosen = S.ui.chosen && S.ui.chosen[w.id] && S.ui.chosen[w.id].t === i.t;
    return `<div class="aivar ${chosen ? 'chosen' : ''}"><div><span class="eyebrow">Vorschlag von Wishtale</span><strong class="ot">${esc(i.t)}</strong>${i.to ? `<span class="muted" style="font-size:13px;display:block">${i.from ? `ca. ${i.from} bis ${i.to} €` : `bis ca. ${i.to} €`}, grobe Schätzung</span>` : ''}<span class="why" style="display:block;margin-top:4px">${esc(i.why)}</span>${chosen ? `<span class="chip ok" style="margin-top:6px">${ic('check', 'sm')}Deine Wahl</span>` : ''}</div><div class="oa"><a class="btn amz sm" href="${searchUrl.amazon(i.q)}" target="_blank" rel="${REL}">Bei Amazon suchen ${ic('arrow', 'sm')}</a>${guestFree ? `<button class="btn pri sm" data-act="aichoose" data-wid="${w.id}" data-t="${esc(i.t)}">Diesen wählen</button>` : ''} ${ctx === 'own' ? `<button class="btn pri sm" data-act="aiuse" data-wid="${w.id}" data-t="${esc(i.t)}" title="Dieser Vorschlag ersetzt den Wunsch, du kannst es gleich rückgängig machen">Dieses Produkt übernehmen</button>` : ''}${ctx === 'own' ? `<button class="btn ghost sm" data-act="aivhave" data-wid="${w.id}" data-t="${esc(i.t)}">Habe ich schon</button>` : ''}</div></div>`;
  }).join('')}</section>`;
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
    else if (taken) state = `<div class="banner">${ic('lock')}<span>Um diesen Wunsch kümmert sich schon jemand anderes.</span></div>`;
  }

  let footer = '';
  if (ctx === 'guest') {
    if (mine && !w.bought) footer = `<button class="btn pri" data-act="bought" data-id="${w.id}">Gekauft</button><button class="btn sec" data-act="release" data-id="${w.id}">Freigeben</button>`;
    else if (!taken && !w.bought && !o.main) footer = `<button class="btn pri" data-act="reserve" data-id="${w.id}">Reservieren</button>`;
  } else if (ctx === 'own') {
    footer = `<button class="btn pri" data-act="wedit" data-id="${w.id}">Bearbeiten</button><button class="btn sec" data-act="selbst" data-id="${w.id}">${w.status === 'selbst' ? 'Wieder offen' : 'Erledigt, habe ich schon'}</button>
      <button class="btn sec" data-act="prio" data-id="${w.id}">Priorität: ${PRIO[w.prio]}</button>
      <button class="btn ghost" data-act="delw" data-id="${w.id}">${ic('trash', 'sm')}Löschen</button>`;
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
    </div>
   </div>
   ${ctx === 'preview' ? `<div class="banner green">${ic('eye')}<span>So sehen Schenkende diesen Wunsch.</span></div>` : ''}
   ${state}
   ${footer ? `<div class="row wm-actions">${footer}</div>` : ''}
   ${w.noSuggest ? `<div class="sugg"><b>Keine Vorschläge</b><span>Hierfür werden auf Wunsch von ${esc(p.managed ? (p.parent || (ctx === 'own' && S.accounts && S.accounts.me && S.accounts.me.name) || 'der Familie') : p.name)} keine Vorschläge generiert.</span>${ctx === 'own' ? `<button class="btn ghost sm" style="margin-top:8px" data-act="wnosug" data-id="${w.id}">Vorschläge wieder erlauben</button>` : ''}</div>` : ''}
   ${byAi || w.noSuggest ? '' : Suggest(p, w, o, ctx)}
   ${byAi && w.kind === 'produkt' ? `<section class="wm-sec">${Offer({ id: 'exact', t: w.t, url: searchUrl.amazon(w.t), host: 'amazon.de', source: 'erzeugt', a: 'gift' }, w, 'view', 'main')}</section>` : ''}
   ${o.main && !byAi ? `<section class="wm-sec">${Offer(o.main, w, ctx, 'main')}</section>` : (w.kind === 'erlebnis' ? `<p class="muted" style="margin:14px 0">Für ein Erlebnis brauchst du kein Produkt. Überlege am besten mit anderen Freunden, was sich organisieren lässt, und reserviere den Wunsch hier, damit niemand doppelt plant.</p>` : '')}
   ${w.link && o.main && o.main.source === 'link' && !/(^|\.)amazon\./.test(o.main.host) ? `<section class="wm-sec"><p class="eyebrow" style="margin-bottom:8px">Auch bei Amazon</p>${Offer({ id: 'amz', t: w.t, url: searchUrl.amazon(w.t), host: 'amazon.de', source: 'amz', a: 'gift' }, w, 'view', 'alt')}</section>` : ''}
   ${o.alts.length && !byAi && !ideasOf('wish:' + w.id).length && aiStatus('wish:' + w.id) !== 'loading' ? `<section class="wm-sec"><p class="eyebrow" style="margin-bottom:8px">${w.kind === 'frei' ? 'Ideen von Wishtale zu diesem Wunsch' : o.main && o.main.source === 'link' ? 'Alternativen von Wishtale' : 'Weitere Vorschläge von Wishtale'}</p>${o.alts.map(a => Offer(a, w, ctx, 'alt')).join('')}</section>` : ''}
   ${AiVariants(w, ctx)}
   ${o.over ? `<p class="muted" style="font-size:13px">${o.over} Produkt${o.over > 1 ? 'e' : ''} über dem Budget ausgeblendet.</p>` : ''}
   ${ctx === 'own' && !w.noSuggest && w.kind !== 'erlebnis' ? `<p style="margin:6px 0"><button class="linkbtn" data-act="wnosug" data-id="${w.id}">Hierfür keine Vorschläge generieren</button></p>` : ''}
   <p class="disc">Die Links zu Amazon sind Partnerlinks (Anzeige). Dir entstehen dadurch keine Mehrkosten. Maßgeblich ist immer der Preis bei Amazon. Vorschläge von Wishtale wählen wir nach den Kriterien des Wunsches aus. Wir testen und bewerten die Produkte nicht.</p>
   <div class="row wm-foot"><span style="flex:1"></span><button class="btn ghost" data-act="close">Schließen</button></div>
  </div></div>`;
}
