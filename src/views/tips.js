import { currentTip } from '../lib/tips.js';
import { S, guestPerson } from '../state.js';
import { esc } from '../lib/util.js';
import { ic } from '../lib/util.js';

/* Texte zu src/lib/tips.js: ein Satz, worum es geht, ein Knopf zum Ausprobieren, einer zum Wegklicken. */
const TEXT = {
  kids: {
    t: 'Wünscht sich das ein Kind?',
    b: 'Für Kinder gibt es eigene Kind-Konten mit eigener Wunschliste und eigenem Link. Du pflegst sie, siehst, was reserviert ist, und deine eigene Liste bleibt deine.',
    go: 'Kind-Konto anlegen', no: 'Ist für mich',
  },
  coparent: {
    t: () => `Pflegt ihr das Wishtale von ${esc(S.me.name)} zu zweit?`,
    b: 'Lade das zweite Elternteil ein, dann könnt ihr beide Wünsche eintragen und seht, was reserviert ist. Die Einladung ist ein Link, den du selbst verschickst.',
    go: 'Zweites Elternteil einladen', no: 'Mache ich allein',
  },
  share: {
    t: 'Deine Liste ist bereit für deine Familie',
    b: 'Schick den Link an die Menschen, die dir etwas schenken möchten, zum Beispiel in die Familiengruppe. Sie sehen deine Wünsche und reservieren still, und für dich bleibt es eine Überraschung.',
    go: 'Link teilen', no: 'Später',
  },
  guestown: {
    t: () => `Schön, dass du etwas für ${esc(guestPerson()?.name || 'jemanden')} gefunden hast`,
    b: 'Leg dir auch ein Wishtale an, dann weiß deine Familie, was dich freut. Deine Reservierung merken wir uns dabei, damit du sie wiederfindest.',
    go: 'Mein Wishtale anlegen', no: 'Vielleicht später',
  },
};
export function Tip(where = 'own') {
  const id = currentTip(where); if (!id) return '';
  const x0 = TEXT[id], x = { ...x0, t: typeof x0.t === 'function' ? x0.t() : x0.t };
  return `<aside class="ctip" aria-labelledby="ctip-h"><span class="ctip-i">${ic('spark', 'sm')}</span><div><h2 id="ctip-h">${x.t}</h2><p>${x.b}</p>
   <div class="ctip-a"><button class="btn sec sm" data-act="tipgo" data-id="${id}">${x.go}</button><button class="qa qa-mute" data-act="tipno" data-id="${id}">${x.no}</button></div></div></aside>`;
}
