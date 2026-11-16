---
topic: 092-vorschlaege-hauptansicht-und-logo
status: entschieden
option: Umsetzung wie von Jann im Chat bestätigt
datum: 2026-11-16
umgesetzt: 8d70841f10184ad599bc1883de08f4dfcef071ee
---
Eigene Vorschläge wieder direkt unter den eigenen Wünschen, mit Erklärung zu ähnlichen Vorschlägen für Freunde und weiterhin verborgener Auswahl. Ausblenden je Profil und Browser; Wiedereinblenden im Avatar-Menü. Mobil einzelne Listeneinträge, am Desktop vorhandenes Empfehlungsraster. Geschmackskarten und TasteHint erhalten. Logo im eigenen Kontext führt zur Wunschliste; zusätzlicher Zurück-Link bleibt. Keine Subdomain-Umstellung.

Dies ersetzt 082 ausschließlich hinsichtlich der entfernten eigenen Empfehlungen. PR 16 / 089 bleibt unabhängig und wurde nicht übernommen.

Geprüft: ESLint und Produktionsbuild, gezielte Modulprüfungen mit Vite-env-Adapter (Präferenz je Profil, ungültiger Browserspeicher, eigener Cache statt Gastdaten, Ausblenden, Logo-Ziele). Vercel-Produktion zum Implementierungscommit READY. Cloud-Browser: Demo auf 1363 px angesehen, Profil über Avatar geöffnet und per Logo erfolgreich zur Wunschliste zurückgekehrt; kein horizontaler Überlauf (scrollWidth 1348 px). Kein angemeldetes Testkonto verfügbar: echte eigene Empfehlungen, deren Buttons und 390-px-Ansicht noch nicht visuell geprüft. Keine Änderungen an Datenbank oder Diensten. Den Datenbankeintrag der Dev-Seite ergänzt Claude beim Abgleich.

## Nachbesserung: bleibende Vorschauzeile
Umgesetzt mit `e7c27fbc6e364cbb9a1e9e33c027c15aaeedeff6`: „Deine Vorschau“ und Augen-Umschalter bleiben immer stehen, nur der Inhalt verschwindet. Offenes Auge blendet ein, durchgestrichenes Auge blendet aus. Tastaturbedienbarer Button mit Zustand und Bezug zum Inhalt, gleiche bestehende Anzeigepräferenz.

Erfolgreich im angemeldeten Demokonto über den Cloud-Browser geprüft: ausblenden, bleibende Zeile mit Einblend-Button, Neuladen ausgeblendet, wieder einblenden, Neuladen eingeblendet. Desktop 1363 px ohne horizontalen Überlauf; Button 46 × 44 px, Titel und Auge in derselben Zeile. Produktionsdeploy READY. ESLint, Build und Modulprüfungen erfolgreich. 390 px bleibt ungeprüft, da keine Größensteuerung im Cloud-Browser verfügbar. Zugangsdaten nicht dokumentiert.

Nachprüfung 16.11.2026: Vorschauzeile bei gemessenen 390 × 742 CSS-Pixeln im angemeldeten Cloud-Chromium geprüft: Titel und Augenbutton in einer Zeile, 45,6 × 44 px Touchfläche, Aus- und Einblenden erfolgreich, kein horizontaler Überlauf. Methode und Grenzen stehen im Urteil 093.
