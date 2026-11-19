---
topic: 098-handy-ux-und-farben
status: entschieden
option: A, in zwei Schritten; Schritt 1 umgesetzt
datum: 2026-11-19
umgesetzt: 3c731343f5f34e984b30573ae2d8aff8fabf23f4
---
Jann im Chat: „Ja gefällt mir - können wir 6 Dinge über die ich mich freuen würde auch in 1 Zeile bekommen? Du kannst bauen“.

Schritt 1 umgesetzt: In der App ein hellerer Grund, weiße Karten und feinere Linien, die Landingpage bleibt wie sie ist. Wünsche ohne Bild haben Platzhalter in sechs gedeckten Kategoriefarben. Die Überschrift der Wunschliste steht ohne Schlusspunkt in einer Zeile, die Schrift passt sich der Breite an und bricht nur um, wenn sie gar nicht passt. Die Legende der Wichtigkeit steht im Filter (bei weniger als sechs Wünschen weiter über der Liste), das Band „Jetzt neu“ ist am Handy einzeilig, „Gespeichert“ ist am Handy ausgeblendet. Unter der Liste steht nur noch ein Hinweis zur Zeit (Erste Schritte, sonst App-Hinweis, sonst Geschmack, sonst Nudge), der Tipp zur Wunschliste steht jetzt in der FAQ.

Vorher behoben (ebe1e9c): abgeschnittener Demo-Link auf der Anmeldeseite und Platzhalter im Link-Feld.

Geprüft: ESLint, Build, Playwright bei 390 und 1280 px, axe (WCAG 2 AA) ohne Befund. Nicht geprüft: echtes Gerät.

Offen, Schritt 2: Wunsch-Ansicht ohne Doppelungen und mit einem Hauptknopf, kürzere Hinweise im Wunschdialog, Gast-Ideen im ruhigen Stil, „Eigene Idee prüfen“ in der Gastansicht.
