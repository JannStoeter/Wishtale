---
autor: claude
datum: 2026-11-25
empfehlung: D
sicherheit: mittel
aufwand: klein (A), mittel (B), groß (C)
kosten: A und B einmalig 0 €, Chrome-Store einmalig 5 $; C Apple 99 $ im Jahr plus Google 25 $ einmalig
---
## Begründung
Die meisten Wünsche entstehen am Handy, und dort zuerst am iPhone. Ohne Store-App kommt Wishtale nur über einen Kurzbefehl in das Teilen-Menü von iOS. Ein Kurzbefehl nimmt die geteilte Adresse und öffnet `wishtale.de/app/?share_url=…`; das versteht die App schon heute (`takeShare()`), es braucht also fast keinen neuen Code, nur einen iCloud-Link, eine Anleitung im Menü „Wishtale als App“ und Tests. Am Rechner leistet ein Lesezeichen-Knopf dasselbe ohne Store. Ergänzend kann der Wunschdialog beim Öffnen anbieten, einen kopierten Link einzufügen.

Die Browser-Erweiterung (B) ist das, was Wishbob am Rechner hat. Sie ist überschaubar (Manifest V3, ein Knopf, der die Adresse an die App gibt), braucht aber Store-Prüfung und Pflege; Wishbob erreicht damit nur rund 2.000 Nutzer.

Die Store-App (C) ist der einzige Weg in das echte Teilen-Menü auf dem iPhone und in die App Stores (Auffindbarkeit). Das ist Stufe 2 aus Dev 095 und lohnt sich erst, wenn Zahlen zeigen, dass Leute Wishtale am iPhone dauerhaft nutzen.

## Risiken
Kurzbefehle muss die Person einmal aktiv hinzufügen, viele brechen dabei ab. Apple kann Web-Hüllen ablehnen, wenn sie kaum mehr als die Website sind (Richtlinie 4.2). Das Lesen von Shopseiten (`api/inspect.js`) klappt nicht bei jedem Shop, und Amazon wird bewusst nicht gelesen; daran ändert keine der Optionen etwas.

## Gegenargument
Wer am iPhone Wishbob oder Giftful kennt, erwartet einen echten Eintrag im Teilen-Menü ohne Einrichtung. Der Kurzbefehl wirkt dagegen bastelig, und wenn die Store-App ohnehin kommt, ist die Zeit für A teilweise verschenkt.
