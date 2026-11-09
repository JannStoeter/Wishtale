/* Detail-Fenster zu einem Wunsch: Vorschlag ansehen, Alternativen vergleichen, wählen oder weitersuchen. */
import { S, guestPerson } from '../state.js';
import { esc, ic, gen } from '../lib/util.js';
import { criteriaText } from '../lib/fit.js';
import { art, artIllu } from '../lib/art.js';
import { offersFor } from '../lib/products.js';
import { cat, crea, occL, PRIO } from '../data/content.js';
import { priceLine } from './product.js';
import { ideasOf, aiStatus } from '../lib/ideas.js';
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
  return `<div class="offer ${role === 'main' ? 'main' : ''} ${pr.source === 'link' ? '' : 'suggest'} ${chosen ? 'chosen' : ''}">
   ${pr.brand ? `<span class="otn brand" aria-hidden="true"><b>${esc(pr.brand.slice(0, 1))}</b><small>${esc(pr.brand)}</small></span>` : `<span class="otn">${artIllu(pr.a || 'gift', pr.tone || 0)}</span>`}
   <div class="obody">
    <span class="eyebrow">${pr.source === 'link' ? 'Gewünschtes Produkt' : pr.source === 'erzeugt' ? 'Suche nach genau diesem Wunsch' : role === 'main' ? 'Vorschlag von Wishtale' : 'Vorschlag'}</span>
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
  const st = aiStatus('wish:' + w.id);
  if (st === 'loading') return `<section class="wm-sec">${AiLoading('Deine individuellen Empfehlungen werden erstellt …')}</section>`;
  const list = ideasOf('wish:' + w.id);
  if (!list.length) return '';
  const guestFree = ctx === 'guest' && !w.res && !w.bought;
  const sim = isSpecific(w);
  return `<section class="wm-sec"><p class="eyebrow" style="margin-bottom:8px">${sim ? 'Ähnliche Produkte, falls es das Gewünschte nicht gibt' : 'Passende Produkte von Wishtale'}</p>${list.map(i => {
    const chosen = S.ui.chosen && S.ui.chosen[w.id] && S.ui.chosen[w.id].t === i.t;
    return `<div class="aivar ${chosen ? 'chosen' : ''}"><div><span class="eyebrow">Vorschlag von Wishtale</span><strong class="ot">${esc(i.t)}</strong>${i.to ? `<span class="muted" style="font-size:13px;display:block">${i.from ? `ca. ${i.from} bis ${i.to} €` : `bis ca. ${i.to} €`}, grobe Schätzung</span>` : ''}<span class="why" style="display:block;margin-top:4px">${esc(i.why)}</span>${chosen ? `<span class="chip ok" style="margin-top:6px">${ic('check', 'sm')}Deine Wahl</span>` : ''}</div><div class="oa"><a class="btn amz sm" href="${searchUrl.amazon(i.q)}" target="_blank" rel="${REL}">Bei Amazon suchen ${ic('arrow', 'sm')}</a>${guestFree ? `<button class="btn pri sm" data-act="aichoose" data-wid="${w.id}" data-t="${esc(i.t)}">Diesen wählen</button>` : ''}</div></div>`;
  }).join('')}</section>`;
}

/** Macht klar, was ein Vorschlag von Wishtale ist und was ein Wunsch der Person selbst. */
function Suggest(p, w, o, ctx) {
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
  const aiSt = aiStatus('wish:' + w.id), byAi = !w.link && w.kind !== 'erlebnis' && !isSpecific(w) && (!o.main || o.main.source !== 'link') && (aiSt === 'loading' || aiSt === 'ready'); // KI ersetzt den Katalog-Vorschlag
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
    footer = `<button class="btn pri" data-act="wedit" data-id="${w.id}">Bearbeiten</button><button class="btn sec" data-act="selbst" data-id="${w.id}">${w.status === 'selbst' ? 'Wieder offen' : 'Selbst gekauft'}</button>
      <button class="btn sec" data-act="prio" data-id="${w.id}">Priorität: ${PRIO[w.prio]}</button>
      <button class="btn ghost" data-act="delw" data-id="${w.id}">${ic('trash', 'sm')}Löschen</button>`;
  }

  return `<div class="scrim" data-act="closebg"><div class="sheet wide" role="dialog" aria-modal="true" aria-labelledby="mt">
   <div class="wm-top">
    <span class="wm-img">${w.img ? `<img src="${w.img}" alt="" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">` : art((o.main && o.main.a) || w.a || cat(w.c).a, (o.main && o.main.tone) != null ? o.main.tone : (w.tone || 0))}</span>
    <div>
     <p class="eyebrow">${esc(meta.join(' · '))}</p>
     <h2 id="mt">${esc(w.t)}</h2>
     ${w.note ? `<p class="muted" style="margin-top:6px">${esc(w.note)}</p>` : ''}
     ${w.via ? `<span class="chip gold" style="margin-top:8px">Tipp von ${esc(crea(w.via).handle)}</span>` : ''}
    </div>
   </div>
   ${ctx === 'preview' ? `<div class="banner green">${ic('eye')}<span>So sehen Schenkende diesen Wunsch.</span></div>` : ''}
   ${state}
   ${byAi ? '' : Suggest(p, w, o, ctx)}
   ${o.main && !byAi ? `<section class="wm-sec">${Offer(o.main, w, ctx, 'main')}</section>` : (w.kind === 'erlebnis' ? `<p class="muted" style="margin:14px 0">Für ein Erlebnis brauchst du kein Produkt. Überlege am besten mit anderen Freunden, was sich organisieren lässt, und reserviere den Wunsch hier, damit niemand doppelt plant.</p>` : '')}
   ${o.alts.length && !byAi && !ideasOf('wish:' + w.id).length && aiStatus('wish:' + w.id) !== 'loading' ? `<section class="wm-sec"><p class="eyebrow" style="margin-bottom:8px">${w.kind === 'frei' ? 'Ideen von Wishtale zu diesem Wunsch' : o.main && o.main.source === 'link' ? 'Alternativen von Wishtale' : 'Weitere Vorschläge von Wishtale'}</p>${o.alts.map(a => Offer(a, w, ctx, 'alt')).join('')}</section>` : ''}
   ${AiVariants(w, ctx)}
   ${o.over ? `<p class="muted" style="font-size:13px">${o.over} Produkt${o.over > 1 ? 'e' : ''} über dem Budget ausgeblendet.</p>` : ''}
   <p class="disc">Die Links zu Amazon sind Partnerlinks (Anzeige). Dir entstehen dadurch keine Mehrkosten. Maßgeblich ist immer der Preis bei Amazon. Vorschläge von Wishtale wählen wir nach den Kriterien des Wunsches aus. Wir testen und bewerten die Produkte nicht.</p>
   <div class="row wm-foot">${footer}<span style="flex:1"></span><button class="btn ghost" data-act="close">Schließen</button></div>
  </div></div>`;
}
