---
autor: claude
datum: 2026-11-18
empfehlung: A
---
# Position von Claude

## Ausgangslage
Wishtale ist heute eine reine Web-App (Vite, Vanilla-JS). Es gibt noch kein Web-App-Manifest und keinen Service Worker, deshalb lässt sie sich zwar über „Zum Home-Bildschirm“ ablegen, öffnet sich dann aber wie eine Webseite mit Browserleiste.

## Optionen
**A: Installierbare Web-App zuerst (PWA), Store später.** Manifest mit Name, Farben und Symbolen, ein kleiner Service Worker für schnelleren Start und eine freundliche Seite ohne Netz, dazu ein dezenter Hinweis „Wishtale auf den Home-Bildschirm legen“. Auf Android zusätzlich „Teilen an Wishtale“ (Web Share Target): Aus der Amazon- oder Shop-App teilen, und der Wunschdialog öffnet sich mit dem Link. Aufwand ein bis zwei Tage, keine Gebühren, kein Prüfprozess, gleicher Code. Push-Hinweise wären möglich (auf dem iPhone nur nach Ablegen auf dem Home-Bildschirm), sind aber nicht Teil des ersten Schritts.

**B: Hülle für die Stores (Capacitor) auf demselben Code.** Android im Play Store (einmalig 25 US-Dollar Registrierung), iPhone im App Store (99 US-Dollar im Jahr). Apple lehnt Apps ab, die nur eine Webseite einpacken (Richtlinie 4.2), deshalb braucht die iPhone-App echten Mehrwert, etwa das Teilen aus anderen Apps als eigene Erweiterung, Push-Hinweise bei Reservierungen für Kind-Konten oder Kamera für den Wunschzettel. Aufwand eher zwei bis vier Wochen plus Prüfungen und Pflege bei jedem Update.

**C: Echte native Apps.** Für Wishtale heute nicht sinnvoll, doppelter Code ohne erkennbaren Vorteil.

## Risiken und offene Punkte bei B
- **Plus-Plan:** Apple verlangt für digitale Abos in der App grundsätzlich den eigenen Kaufweg mit Provision. In der EU gibt es inzwischen Ausnahmen mit eigenen Bedingungen und Gebühren. Das muss vor einem iPhone-Start geprüft werden, sonst kollidiert es mit dem Stripe-Weg.
- **Amazon-Partnerlinks:** Links müssen im externen Browser oder in der Amazon-App öffnen, nicht in einer eingebetteten Ansicht, und die Kennzeichnung „Anzeige“ bleibt.
- **Datenschutz:** Store-Angaben zur Datennutzung (Apple „Privacy Nutrition Label“, Google „Data Safety“), Ergänzung in `datenschutz.html`, falls Push-Dienste dazukommen. Konto löschen in der App gibt es schon (`api/account.js`), das verlangen beide Stores.
- **Anmeldung:** Bestätigungs- und Passwort-Links müssen in die App zurückführen (Universal Links und App Links).

## Empfehlung
A jetzt, weil sie schnell, kostenlos und ohne Risiko echten App-Charakter bringt und das Teilen aus Shop-Apps auf Android ein spürbarer Gewinn beim Wünsche-Anlegen ist. B danach zuerst für Android, das iPhone erst, wenn der Plus-Plan und die Kaufwege geklärt sind und ein eigener Mehrwert (Teilen-Erweiterung, Push) feststeht.
