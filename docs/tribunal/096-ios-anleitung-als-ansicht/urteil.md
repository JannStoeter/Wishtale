---
topic: 096-ios-anleitung-als-ansicht
status: entschieden
option: Nachgebaute Ansicht statt Video, aktueller Safari-Weg
datum: 2026-11-19
umgesetzt: d4696674b9e218473b09e6f26dbf2d6736b4f3b6
---
Im Fenster „Wishtale als App“ zeigt das iPhone jetzt einen nachgebauten Bildschirm, auf dem ein Finger nacheinander tippt: bei Safari ab Version 26 auf die drei Punkte neben der Adresse, auf „Teilen“, auf „Zum Home-Bildschirm“ und auf „Hinzufügen“ (mit „Als Web-App öffnen“ eingeschaltet), am Ende liegt das Wishtale-Symbol auf dem Home-Bildschirm. Ältere Safari-Versionen bekommen den Weg über das Teilen-Symbol in der Leiste, andere Browser auf dem iPhone einen Hinweis, Wishtale in Safari zu öffnen. Die Ansicht läuft von selbst in einer Schleife, lässt sich anhalten und mit „Zurück“ und „Weiter“ selbst durchgehen, bei der Einstellung „weniger Bewegung“ startet sie nicht von selbst. Die nummerierte Anleitung daneben hebt den aktuellen Schritt hervor und bleibt die barrierefreie Fassung, die Zeichnung ist für Screenreader ausgeblendet.

Die Formen sind eigene, schlichte Nachbauten, keine Bildschirmfotos von Apple.

Geprüft: ESLint, Build, Playwright mit Kennungen für Safari 26, Safari 18 und Chrome auf dem iPhone, alle Schritte als Bild angesehen, axe ohne Befund. Nicht geprüft: auf einem echten iPhone, ob Safari 26 die Knöpfe bei jeder Einstellung (Adressleiste oben oder unten) genau so anordnet.
