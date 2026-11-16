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
