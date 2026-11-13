---
topic: 084-hochladen-hervorheben-und-reel
status: entschieden
option: Anweisung
datum: 2026-11-13
umgesetzt: 33e0924
---
**App (`src/views/wishes.js`, `src/styles/main.css`):** Die gestrichelte Zeile „Schon eine Liste? Liste einlesen“ auf der Wünsche-Seite ist jetzt eine grüne Leiste mit Gold: goldene Marke „Jetzt neu“, „Einfach Wunschliste hochladen“ und die Zeile „Foto vom Wunschzettel oder Text, Wishtale macht daraus Wünsche“, mit goldenem Pfeil. Sie öffnet wie vorher den Dialog zum Einlesen. Auf sehr schmalen Handys (unter 380 px) entfällt die Marke.

**Reel (`promo/reel-zettel.mjs`, `npm run promo:zettel`, Ausgabe `promo/out/reel-wunschzettel.mp4`, 1080×1920, 30 fps, 25,6 Sekunden, ohne Ton):** Haken „Der Wunschzettel, einfach hochgeladen“, handschriftlicher Zettel (Schrift Caveat, Zeile für Zeile geschrieben), Foto im Sucher mit Blitz und der echte Einlese-Dialog der App, die Ergebnisliste „Das haben wir auf dem Wunschzettel gefunden“ mit goldener Abtastlinie und „5 Wünsche erkannt“, die echte Wunschliste mit der neuen Leiste, Abschluss „Jetzt neu: Einfach Wunschliste hochladen“, wishtale.de. Die App-Bildschirme sind echte Aufnahmen des gebauten Stands mit simuliertem Konto und der Beispielperson Mia, keine echten Daten. Schrift `@fontsource/caveat` als Entwicklungsabhängigkeit, nichts wird aus dem Netz geladen.

Ablauf bei Veröffentlichung: Videobeschreibung und Hashtags im Instagram-Studio oder von Hand, Musik in der Instagram-App ergänzen. Das Reel zeigt eine Funktion mit Fotos von Wunschzetteln: Der Hinweis in der App, dass das Foto nicht gespeichert wird, steht im Dialog (Datenschutz Abschnitt 11).
