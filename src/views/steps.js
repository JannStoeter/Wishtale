/* Karte „Erste Schritte“ oben auf der Wunschliste. Wer sie ausblendet, findet sie im Konto-Menü wieder. */
import { esc, ic } from '../lib/util.js';
import { S } from '../state.js';
import { stepList, stepsProgress, stepsHidden } from '../lib/steps.js';

export function Steps(m) {
  if (stepsHidden()) return '';
  const p = stepsProgress(m);
  if (p.all) return '';
  const list = stepList(m), nextIdx = list.findIndex(x => !x.done);
  return `<details class="fsteps" ${S.ui.stepsOpen?'open':''}>
   <summary><span class="fs-sum"><b>Erste Schritte</b><span class="fs-count" aria-label="${p.done} von ${p.total} erledigt">${p.done} von ${p.total}</span></span><span class="fs-bar" aria-hidden="true"><i style="width:${Math.round(p.done / p.total * 100)}%"></i></span></summary>
   <ol class="fs-list">${list.map((x, i) => `<li class="${x.done ? 'done' : ''} ${i === nextIdx ? 'next' : ''}">
     <span class="fs-mark" aria-hidden="true">${x.done ? ic('check', 'sm') : i + 1}</span>
     <div class="fs-txt"><b>${esc(x.t)}${x.done ? '<span class="vh"> (erledigt)</span>' : ''}</b></div>
     ${x.done ? '' : `<div class="fs-acts"><button type="button" class="btn ${i === nextIdx ? 'pri' : 'sec'} sm" data-act="${x.act}" data-v="${x.v}" data-step="${x.k}">${esc(x.btn)}</button>${x.btn2 ? `<button type="button" class="btn sec sm" data-act="${x.act2}" data-step="${x.k}">${esc(x.btn2)}</button>` : ''}</div>`}
    </li>`).join('')}</ol>
   <div class="fs-foot"><button type="button" class="linkbtn" data-act="stepshide">Ausblenden</button></div>
  </details>`;
}
