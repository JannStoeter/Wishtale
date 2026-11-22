import { currentTip } from '../lib/tips.js';
import { ic } from '../lib/util.js';

/* Texte zu src/lib/tips.js: ein Satz, worum es geht, ein Knopf zum Ausprobieren, einer zum Wegklicken. */
const TEXT = {
  kids: {
    t: 'Wünscht sich das ein Kind?',
    b: 'Für Kinder gibt es eigene Kind-Konten mit eigener Wunschliste und eigenem Link. Du pflegst sie, siehst, was reserviert ist, und deine eigene Liste bleibt deine.',
    go: 'Kind-Konto anlegen', no: 'Ist für mich',
  },
};
export function Tip() {
  const id = currentTip(); if (!id) return '';
  const x = TEXT[id];
  return `<aside class="ctip" aria-labelledby="ctip-h"><span class="ctip-i">${ic('spark', 'sm')}</span><div><h2 id="ctip-h">${x.t}</h2><p>${x.b}</p>
   <div class="ctip-a"><button class="btn sec sm" data-act="tipgo" data-id="${id}">${x.go}</button><button class="qa qa-mute" data-act="tipno" data-id="${id}">${x.no}</button></div></div></aside>`;
}
