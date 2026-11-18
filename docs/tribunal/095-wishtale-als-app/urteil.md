---
topic: 095-wishtale-als-app
status: entschieden
option: A, Stufe 1 (installierbare Web-App); Stufe 2 (Stores) offen
datum: 2026-11-18
umgesetzt: dee25e98eb65aec806c98bd75ffbecd31cf968f9
---
Jann im Chat: „Baue Stufe 1“.

Umgesetzt: Manifest (Name, Farben, Symbole, Bereich `/app/`, Start `/app/`, Vollbild), Service Worker (`/assets/` und Symbole aus dem Zwischenspeicher, Seitenaufrufe zuerst übers Netz, ohne Verbindung eine freundliche Seite; Daten, Anmeldung und `/api/` werden nie zwischengespeichert), Menüpunkt „Wishtale als App“ mit Anleitung für iPhone und Android (auf Android mit Installationsdialog des Browsers, sobald Chrome ihn anbietet), einmaliger Hinweis am Handy ab zwei Wünschen, „Teilen an Wishtale“ auf Android (geteilter Link öffnet nach der Anmeldung den Wunschdialog und wird gelesen). Datenschutz Abschnitt 7 und FAQ ergänzt.

Geprüft: ESLint, Build, Playwright mit simuliertem Konto. Chrome meldet keine Installationshindernisse, der Service Worker kontrolliert die App, ohne Netz erscheint die eigene Seite, Teilen öffnet den Dialog mit Link und Karte und nach dem Neuladen nicht noch einmal, der Hinweis lässt sich wegklicken und bleibt weg, Anleitung für iPhone und Android, am Desktop ohne Angebot kein Menüpunkt. axe ohne Befund. Nicht geprüft: echtes iPhone und Android-Gerät, der echte Installationsdialog von Chrome und das Teilen aus einer echten Shop-App.

Offen: Stufe 2 (Play Store, App Store) erst nach Klärung des Plus-Plans und der Kaufwege.
