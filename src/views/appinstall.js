import { canPrompt, isIOS, standalone, offerInstall } from '../lib/pwa.js';
import { ic } from '../lib/util.js';

/** Anleitung zum Ablegen auf dem Home-Bildschirm, wenn der Browser keinen eigenen Dialog anbietet. */
export function AppInstallModal() {
  const ios = isIOS();
  const steps = standalone()
    ? '<p>Wishtale läuft auf diesem Gerät schon als App, du musst nichts weiter tun.</p>'
    : ios
      ? `<ol class="appsteps"><li>Öffne Wishtale in Safari, falls du gerade einen anderen Browser nutzt.</li><li>Tippe auf das Teilen-Symbol, das Quadrat mit dem Pfeil nach oben.</li><li>Wähle „Zum Home-Bildschirm“ und bestätige mit „Hinzufügen“.</li></ol>`
      : `<ol class="appsteps"><li>Öffne das Menü deines Browsers, meist die drei Punkte oben rechts.</li><li>Wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.</li><li>Bestätige, dann liegt Wishtale mit eigenem Symbol neben deinen anderen Apps.</li></ol>`;
  return `<div class="scrim" data-act="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt">
   <div class="sheet-head"><h2 id="mt">Wishtale als App</h2><button type="button" class="sheet-x" data-act="close" aria-label="Schließen">×</button></div>
   <p class="muted" style="margin:6px 0 12px">Mit eigenem Symbol auf dem Home-Bildschirm öffnet sich Wishtale ohne Browserleiste, und deine Wunschliste ist mit einem Tipp da.${!ios ? ' Auf Android kannst du danach Produkte aus Shop-Apps direkt an Wishtale teilen.' : ''}</p>
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
