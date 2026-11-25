/* Aus jedem Shop speichern (Dev 116): Kurzbefehl am iPhone, Teilen auf Android, Lesezeichen-Knopf am Rechner. */
import { isIOS, standalone, offerInstall } from '../lib/pwa.js';
import { SHORTCUT_URL, shortcutBase, bookmarklet } from '../lib/shopsave.js';
import { esc, ic } from '../lib/util.js';

const android = () => { try { return /android/i.test(navigator.userAgent || ''); } catch { return false; } };
const here = () => (isIOS() ? 'ios' : android() ? 'android' : 'desktop');
const origin = () => { try { return /^https?:/.test(location.origin) ? location.origin : 'https://wishtale.de'; } catch { return 'https://wishtale.de'; } };

function Ios() {
  const base = shortcutBase('https://wishtale.de');
  const own = `<ol class="appsteps"><li>Öffne die App „Kurzbefehle“ und tippe oben rechts auf das Plus.</li>
     <li>Füge die Aktion „URLs öffnen“ hinzu und trage als Adresse <code class="ss-code">${esc(base)}</code> ein, direkt dahinter ohne Leerzeichen die Variable „Kurzbefehleingabe“.</li>
     <li>Tippe oben auf den Namen, nenne den Kurzbefehl „Zu Wishtale“ und schalte unter dem Info-Zeichen „Im Share-Sheet anzeigen“ ein.</li></ol>
    <p class="muted ss-small"><button type="button" class="linkbtn" data-act="sscopy" data-v="${esc(base)}">Adresse kopieren</button></p>`;
  return `<section class="ss-sec" aria-labelledby="ss-ios"><h3 id="ss-ios">Am iPhone</h3>
   <p>Wenn du in Safari oder in der App eines Shops etwas Schönes findest, tippst du auf „Teilen“ und dann auf „Zu Wishtale“. Wishtale öffnet sich mit dem Wunsch, der Link ist schon eingetragen, und du musst nur noch speichern.</p>
   ${SHORTCUT_URL
    ? `<p><a class="btn pri" href="${esc(SHORTCUT_URL)}" target="_blank" rel="noopener">Kurzbefehl hinzufügen</a></p>
       <p class="muted ss-small">Der Knopf öffnet die App „Kurzbefehle“ von Apple. Tippe dort auf „Kurzbefehl hinzufügen“, danach steht Wishtale in deinem Teilen-Menü. Falls es nicht gleich ganz oben steht, wische in der App-Reihe nach rechts, tippe auf „Mehr“ und hol „Zu Wishtale“ nach vorn.</p>
       <details class="ss-more"><summary>Lieber selbst anlegen</summary>${own}</details>`
    : `<p class="muted ss-small">Das richtest du einmal in etwa einer Minute ein:</p>${own}`}
   <p class="appnote">Der Kurzbefehl öffnet Wishtale in Safari. Wenn du Wishtale sonst vom Home-Bildschirm aus nutzt, meldest du dich beim ersten Mal in Safari noch einmal an, danach bleibst du dort angemeldet.</p>
  </section>`;
}

function Android() {
  const ready = standalone();
  return `<section class="ss-sec" aria-labelledby="ss-and"><h3 id="ss-and">Am Android-Handy</h3>
   <p>${ready ? 'Wishtale ist hier schon als App installiert. Tippe in Chrome oder in der App eines Shops auf „Teilen“ und wähle Wishtale, dann öffnet sich der Wunsch mit dem Link darin.' : 'Leg Wishtale zuerst als App auf deinen Home-Bildschirm. Danach steht Wishtale im Teilen-Menü von Chrome und von Shop-Apps, und ein Tipp öffnet den Wunsch mit dem Link darin.'}</p>
   ${!ready && offerInstall() ? '<p><button type="button" class="btn pri" data-act="appinstall">Wishtale als App</button></p>' : ''}
  </section>`;
}

function Desktop() {
  return `<section class="ss-sec" aria-labelledby="ss-pc"><h3 id="ss-pc">Am Computer</h3>
   <p>Zieh diesen Knopf in die Lesezeichenleiste deines Browsers. Wenn du später auf einer Shopseite bist, klickst du darauf, und Wishtale öffnet sich in einem neuen Tab mit dem fertigen Wunsch.</p>
   <p><a class="ss-bm" href="${esc(bookmarklet(origin()))}" data-act="ssbm" title="In die Lesezeichenleiste ziehen">${ic('plus', 'sm')}Zu Wishtale</a></p>
   <p class="muted ss-small">Siehst du keine Lesezeichenleiste, blendest du sie in Chrome und Edge mit Strg+Umschalt+B ein, am Mac mit Cmd+Umschalt+B.</p>
  </section>`;
}

export function ShopSaveModal() {
  const cur = here();
  const parts = { ios: Ios, android: Android, desktop: Desktop };
  const others = Object.keys(parts).filter(k => k !== cur);
  return `<div class="scrim" data-act="closebg"><div class="sheet shopsave" role="dialog" aria-modal="true" aria-labelledby="mt">
   <div class="sheet-head"><h2 id="mt">Aus jedem Shop speichern</h2><button type="button" class="sheet-x" data-act="close" aria-label="Schließen">×</button></div>
   <p class="muted" style="margin:6px 0 4px">Du musst keinen Link mehr kopieren. Speichere Wünsche direkt aus dem Shop, in dem du gerade stöberst, und Wishtale liest Name, Bild und Preis, soweit der Shop sie verrät.</p>
   ${parts[cur]()}
   <details class="ss-more"><summary>Auf anderen Geräten</summary>${others.map(k => parts[k]()).join('')}</details>
   <div class="row" style="justify-content:flex-end;margin-top:14px"><button type="button" class="btn ghost" data-act="close">Schließen</button></div>
  </div></div>`;
}
