import { canPrompt, isIOS, standalone, offerInstall } from '../lib/pwa.js';
import { ic } from '../lib/util.js';
import { IosDemo, iosFlow, iosSteps } from './iosdemo.js';

/** Anleitung zum Ablegen auf dem Home-Bildschirm, wenn der Browser keinen eigenen Dialog anbietet. */
export function AppInstallModal() {
  const ios = isIOS();
  const flow = ios ? iosFlow() : null;
  const steps = standalone()
    ? '<p>Wishtale läuft auf diesem Gerät schon als App, du musst nichts weiter tun.</p>'
    : ios
      ? `${flow.other ? '<p class="appnote">Das klappt nur in Safari. Öffne <b>wishtale.de/app</b> in Safari und folge dann diesen Schritten.</p>' : ''}
        <div class="appdemo">${IosDemo(flow)}
         <div class="appdemo-side"><ol class="appsteps ios">${iosSteps(flow).map((t, i) => `<li${i ? '' : ' class="on" aria-current="step"'}>${t}</li>`).join('')}</ol>
          <div class="appdemo-ctl"><button type="button" class="qa" data-act="demoprev" aria-label="Vorheriger Schritt">‹ Zurück</button><button type="button" class="qa" id="iosdemo-play" data-act="demotoggle" aria-pressed="true">Anhalten</button><button type="button" class="qa" data-act="demonext" aria-label="Nächster Schritt">Weiter ›</button></div>
          <p class="muted appdemo-pos" id="iosdemo-pos" aria-live="polite">Schritt 1 von ${iosSteps(flow).length}</p></div></div>`
      : `<ol class="appsteps"><li>Öffne das Menü deines Browsers, meist die drei Punkte oben rechts.</li><li>Wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.</li><li>Bestätige, dann liegt Wishtale mit eigenem Symbol neben deinen anderen Apps.</li></ol>`;
  return `<div class="scrim" data-act="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt">
   <div class="sheet-head"><h2 id="mt">Wishtale als App</h2><button type="button" class="sheet-x" data-act="close" aria-label="Schließen">×</button></div>
   <p class="muted" style="margin:6px 0 12px">${ios ? 'So geht es auf deinem iPhone, der Finger zeigt dir, wohin du tippst.' : 'Mit eigenem Symbol auf dem Home-Bildschirm öffnet sich Wishtale ohne Browserleiste, und deine Wunschliste ist mit einem Tipp da. Auf Android kannst du danach Produkte aus Shop-Apps direkt an Wishtale teilen.'}</p>
   ${steps}
   <div class="row" style="justify-content:flex-end;margin-top:14px">${canPrompt() && !standalone() ? '<button type="button" class="btn pri" data-act="appinstall">Jetzt installieren</button>' : ''}<button type="button" class="btn ghost" data-act="close">Schließen</button></div>
  </div></div>`;
}

const HINT = 'wishtale:app-hint-done';
const hintDone = () => { try { return localStorage.getItem(HINT) === '1'; } catch { return true; } };
export const dismissAppHint = () => { try { localStorage.setItem(HINT, '1'); } catch { /* egal */ } };
/** Leiser, einmal wegklickbarer Hinweis unter der Wunschliste, nur am Handy und erst ab zwei Wünschen. */
export function AppHint(count) {
  if (count < 2 || hintDone() || !offerInstall()) return '';
  try { if (!matchMedia('(max-width: 719px)').matches) return ''; } catch { return ''; }
  return `<div class="apphint"><button class="apphint-go" data-act="appinstall">${ic('star', 'sm')}<span>Leg Wishtale auf deinen Home-Bildschirm, dann ist deine Wunschliste mit einem Tipp da.</span></button><button class="apphint-x" data-act="apphintx" aria-label="Hinweis ausblenden">×</button></div>`;
}
