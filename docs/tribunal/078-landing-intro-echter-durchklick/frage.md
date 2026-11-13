---
titel: Landingpage-Intro: echter Durchklick durch die neue App als kleiner Guide
art: entscheidung
status: offen
optionen: A=Echte App-Ausschnitte in einem Handy, die sich in drei Schritten durchklicken (Wunsch anlegen, Profil verbessern, Freunde beschenken), Beschriftung und Tipp-Marke als kleiner Guide | B=Kurzes Video (Bildschirmaufnahme, wenige Sekunden pro Schritt) im selben Rahmen | C=Heutige gezeichnete Vorführung behalten und nur Texte und Reihenfolge anpassen
erstellt: 2026-11-13
von: jann
---
## Kontext
Janns Wortlaut (13.11.2026): „Auf der Landing Page müssen wir unser Intro ändern. Wir müssen jetzt das neue Design nehmen und damit einmal durchklicken, wie es in echt aussieht, und dann sowas zeigen wie ‚Profil verbessern‘ und sowas, also so kleine Guides als Hero. Bitte vor dem Bau Screenshot zeigen und Anfrage an Chatty.“

Stand: Die Hero-Vorführung (`index.html`, `.stage`, `src/landing.js`) ist eine gezeichnete Annäherung mit fünf Szenen (Einlesen, Wunsch, Ideen, Liste, Profil) und noch dem alten Aufbau der App (mit Navigationsleiste, Welten, Inspiration). Seit 075 sieht die App anders aus: Wunschliste als Startpunkt, Menü hinter dem Avatar, schmale Einlese-Zeile, nur Listenansicht am Handy. Die Landingpage soll die echte App zeigen und dabei kleine Guides einblenden, die erklären, was man tun kann. Konversion bleibt das Ziel (siehe 023).

Anhänge in diesem Ordner: `heute-desktop.png` (aktuelle Landingpage) und `entwurf-desktop.png` / `entwurf-handy.png` (ein Entwurf von Claude für Option A, echte Screenshots der App in einem Handy-Rahmen, drei Schritte als Reiter, eine dunkle Sprechblase als Guide, eine Tipp-Marke auf dem Bildschirm). Der Entwurf ist ein Vorschlag, kein Beschluss. Die Bilder sind echte Ausschnitte der App mit der Beispielperson Lena, keine Kundendaten.

## Frage
Wie soll das neue Intro aussehen, damit Besucherinnen und Besucher in wenigen Sekunden verstehen, was Wishtale ist und wie es sich anfühlt, und zur Anmeldung gehen? Bitte bewerten oder ergänzen: Anzahl und Reihenfolge der Schritte (ist „Profil verbessern“ als Schritt zwei richtig, oder zuerst „Wunsch anlegen“ als Einstieg?), Bedienung (Selbstablauf mit Anhalten, Reiter, Wischen), Beschriftung der Guides, Handy zuerst, Ladezeit und Gewicht der Bilder (Photos ohne Hotlinks, Selbsthosting), Barrierefreiheit (Pause-Knopf, `prefers-reduced-motion`, Textalternativen), Rechtliches (Beispielperson kenntlich machen, keine echten Daten, Datenschutz) und die Texte der Landingpage über `data-edit`-Schlüssel (bestehende Schlüssel nicht ändern, neue Schlüssel für neue Texte).
