// Aus jedem Shop speichern (Dev 116): iPhone-Kurzbefehl und Lesezeichen-Knopf.
// Beide öffnen /app/ mit dem Shop-Link, takeShare() in pwa.js nimmt ihn an wie „Teilen an Wishtale“ auf Android.

/** iCloud-Link zum fertigen Kurzbefehl „Zu Wishtale“. Leer: Die Seite zeigt nur die Anleitung zum Selbstanlegen. */
export const SHORTCUT_URL = '';

/** Adresse, die der selbst angelegte Kurzbefehl öffnet; der Shop-Link wird roh angehängt (Hash, damit & und ? heil bleiben). */
export const shortcutBase = (origin = 'https://wishtale.de') => `${origin}/app/#zu-wishtale=`;

/** Lesezeichen-Knopf: öffnet Wishtale in einem neuen Tab mit Adresse und Titel der aktuellen Seite. */
export function bookmarklet(origin = 'https://wishtale.de') {
  const js = `(function(){var u=encodeURIComponent(location.href),t=encodeURIComponent((document.title||'').split(/ [|\u2013\u2014-] /)[0]);window.open('${origin}/app/?share_url='+u+'&share_title='+t,'_blank')})()`;
  return 'javascript:' + js;
}
