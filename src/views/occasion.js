/*
 * Listen für besondere Anlässe (Dev 009, Jann 2026-11-25): Hochzeit, Taufe und Ähnliches bekommen eine eigene Liste mit eigenem Link.
 * Die eigene Wunschliste bleibt der Kern, Wünsche werden nicht getaggt. Eine Anlass-Liste ist ein zusätzliches Profil des Kontos
 * (`occasion`, `odate`), erreichbar nur über das Menü, ohne Profilfragen und ohne Vorschläge von Wishtale.
 */
import { S } from '../state.js';
import { esc } from '../lib/util.js';

export const OCCASIONS = [['hochzeit', 'Hochzeit'], ['taufe', 'Taufe'], ['geburt', 'Geburt'], ['kommunion', 'Kommunion oder Konfirmation'], ['jubilaeum', 'Jubiläum'], ['einzug', 'Einzug'], ['abschied', 'Abschied'], ['sonstiges', 'Anderer Anlass']];
export const occLabel = k => (OCCASIONS.find(([id]) => id === k) || OCCASIONS[OCCASIONS.length - 1])[1];
export const isOcc = a => !!(a && a.occasion);
export const occDate = d => {
  if (!d) return '';
  const t = new Date(d + 'T12:00:00');
  return isNaN(t) ? '' : t.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
};
/** Kleine Zeile über dem Titel: Anlass und, wenn bekannt, das Datum. */
export const occLine = a => `${esc(occLabel(a.occasion))}${a.odate ? ` am ${occDate(a.odate)}` : ''}`;

/** Anlegen und Bearbeiten in einem Fenster. */
export function OccModal() {
  const id = S.ui.occEdit, a = id ? S.accounts[id] : null;
  const cur = a ? a.occasion : 'taufe';
  return `<div class="scrim" data-act="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt">
   <div class="sheet-head"><h2 id="mt">${a ? 'Liste bearbeiten' : 'Liste für einen Anlass'}</h2><button type="button" class="sheet-x" data-act="close" aria-label="Schließen">×</button></div>
   ${a ? '' : '<p class="muted occ-intro">Für eine Hochzeit, eine Taufe oder einen Einzug legst du hier eine eigene Liste mit eigenem Link an. Deine Wunschliste bleibt, wie sie ist.</p>'}
   <form data-form="occlist">
    <fieldset class="fld"><legend>Anlass</legend><div class="occ-pick">${OCCASIONS.map(([k, l]) => `<label class="occ-opt"><input type="radio" name="occ" value="${k}" ${k === cur ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div></fieldset>
    <div class="fld"><label for="on">Name der Liste</label><input id="on" name="name" class="inp" required maxlength="60" autocomplete="off" placeholder="Taufe von Levon" value="${a ? esc(a.name) : ''}"></div>
    <div class="fld"><label for="od">Datum <span class="muted">(optional)</span></label><input id="od" name="date" type="date" class="inp" min="2000-01-01" max="2100-12-31" value="${a ? esc(a.odate || '') : ''}"></div>
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn ghost" data-act="close">Abbrechen</button><button class="btn pri" type="submit">${a ? 'Speichern' : 'Liste anlegen'}</button></div>
   </form>
   ${a ? `<p class="occ-del"><button type="button" class="linkbtn" data-act="occdel" data-id="${esc(id)}">Diese Liste löschen</button></p>` : ''}
  </div></div>`;
}
