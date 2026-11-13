/* Geschmack schärfen (Dev 082): kurze Runden mit Karten. „Gefällt mir“ legt nie einen Wunsch an, die Antworten bleiben bei der Person. */
import { S } from '../state.js';
import { esc, ic } from '../lib/util.js';
import { CARDS, cardById } from '../data/cards.js';
import { CATS, cat } from '../data/content.js';
import { art } from '../lib/art.js';
import { answers, answeredCount, remaining, ROUND } from '../lib/cards.js';
import { BackBar } from './menu.js';

const RATE = { like: 'Gefällt mir', dislike: 'Nicht mein Geschmack' };

function Start(c) {
  const n = answeredCount(), total = CARDS.length, left = remaining(c.cat);
  const chips = [['alle', 'Alle Themen'], ...CATS.filter(x => CARDS.some(k => k.c === x.id)).map(x => [x.id, x.n])];
  const mine = Object.entries(answers()).map(([id, a]) => ({ id, a, card: cardById(id) })).filter(x => x.card && (x.a.rating || x.a.owned));
  return `<section class="tasteintro"><p class="eyebrow">Für dich</p><h1>Geschmack schärfen</h1>
   <p class="muted">Zeig uns in ein paar Karten, was dir gefällt. Nichts davon kommt auf deine Wunschliste, und deine Freunde sehen deine Antworten nie. Wishtale nutzt sie, damit die Ideen für deine Freunde besser zu dir passen.</p>
   <div class="chips tastecats" role="group" aria-label="Thema">${chips.map(([id, l]) => `<button class="chip ${c.cat === id ? 'on' : ''}" aria-pressed="${c.cat === id}" data-act="cardcat" data-v="${id}">${esc(l)}</button>`).join('')}</div>
   <p class="tastecount" role="status">${n} von ${total} Karten beantwortet${left ? '' : ', du hast alle gesehen'}</p>
   ${left ? `<button class="btn pri" data-act="cardstart">${ic('spark', 'sm')}${left >= ROUND ? `Los, ${ROUND} Karten` : `Los, ${left} ${left === 1 ? 'Karte' : 'Karten'}`}</button>` : `<p class="muted">Neue Karten kommen laufend dazu. Schau gern wieder vorbei.</p>`}
   ${mine.length ? `<details class="tasteall"><summary>Meine Antworten (${mine.length})</summary><ul class="tastelist">${mine.map(({ id, a, card }) => `<li><span class="tl-t">${esc(card.t)}<small>${[a.rating ? RATE[a.rating] : '', a.owned ? 'habe ich schon' : ''].filter(Boolean).join(', ')}</small></span><span class="tl-b">${a.rating ? `<button class="btn ghost sm" data-act="cardchange" data-id="${id}" data-r="${a.rating === 'like' ? 'dislike' : 'like'}">${a.rating === 'like' ? 'Doch nicht' : 'Doch'}</button>` : ''}<button class="btn ghost sm" data-act="cardremove" data-id="${id}">Entfernen</button></span></li>`).join('')}</ul>
    <button class="linkbtn" data-act="cardreset">Alle Antworten zurücksetzen</button></details>` : ''}
  </section>`;
}

function Card(c) {
  const id = c.round[c.i], k = cardById(id), pos = c.i + 1, total = c.round.length, concrete = k.kind === 'konkret';
  return `<section class="tastecard" aria-labelledby="card-h">
   <div class="tp"><span id="card-pos" role="status">Karte ${pos} von ${total}</span><div class="tbar" aria-hidden="true"><i style="width:${Math.round(c.i / total * 100)}%"></i></div></div>
   <div class="tcard"><div class="tart">${art(k.a, cat(k.c).t)}</div>
    <p class="eyebrow">${esc(cat(k.c).n)}${concrete ? '' : ' · Richtung'}</p>
    <h2 id="card-h" tabindex="-1">${esc(k.t)}</h2><p class="muted">${esc(k.d)}</p></div>
   ${concrete ? `<button class="tchk ${c.owned ? 'on' : ''}" data-act="cardown" aria-pressed="${c.owned}">${ic('check', 'sm')}Genau das habe ich schon</button>` : ''}
   <div class="tbtns"><button class="btn sec" data-act="cardans" data-r="dislike">Nicht mein Geschmack</button><button class="btn pri" data-act="cardans" data-r="like">Gefällt mir</button></div>
   <div class="tmore"><button class="linkbtn" data-act="cardans" data-r="skip">Überspringen</button>${c.hist.length ? `<button class="linkbtn" data-act="cardundo">Rückgängig</button>` : ''}<button class="linkbtn" data-act="cardend">Fertig für heute</button></div>
   <p class="muted tnote">${concrete ? 'Es geht um genau dieses Produkt. Andere Ausführungen können trotzdem passen.' : 'Es geht um die Richtung, nicht um ein bestimmtes Produkt.'}</p>
  </section>`;
}

function End(c) {
  const left = remaining(c.cat);
  return `<section class="tasteend" role="status"><p class="eyebrow">Geschafft</p><h2>Danke, das hilft Wishtale sehr</h2>
   <p class="muted">${c.done} ${c.done === 1 ? 'Karte' : 'Karten'} beantwortet. Deine Freunde bekommen jetzt Ideen, die besser zu dir passen, und es bleibt eine Überraschung, welche.</p>
   <div class="row" style="gap:8px;flex-wrap:wrap">${left ? `<button class="btn pri" data-act="cardmore">Noch eine Runde</button>` : ''}<a class="btn ${left ? 'ghost' : 'pri'}" href="#wuensche" data-act="go" data-v="wuensche">Zurück zur Wunschliste</a></div></section>`;
}

export function Geschmack() {
  const c = S.ui.cards;
  if (S.me.managed) return `<div class="wrap taste">${BackBar()}<section class="tasteintro"><h1>Geschmack schärfen</h1><p class="muted">Für Kind-Konten gibt es später eigene Karten, die zum Alter passen. Bis dahin hilft ein ausgefülltes Profil.</p></section></div>`;
  if (!c || !c.loaded) return `<div class="wrap taste">${BackBar()}<p class="muted" role="status">Wird geladen …</p></div>`;
  const body = c.round && c.i < c.round.length ? Card(c) : c.round ? End(c) : Start(c);
  return `<div class="wrap taste">${BackBar()}${body}</div>`;
}

/** Ruhiger Hinweis unter der Wunschliste, solange noch wenige Karten beantwortet sind. */
export function TasteHint() {
  const c = S.ui.cards;
  if (S.me.managed || !S.auth.user || !c || !c.loaded || answeredCount() >= 10) return '';
  return `<p class="tastehint">${ic('spark', 'sm')}<span>Dein Geschmack hilft Wishtale, bessere Ideen für deine Freunde zu finden. <button class="linkbtn" data-act="go" data-v="geschmack">Geschmack schärfen</button></span></p>`;
}
