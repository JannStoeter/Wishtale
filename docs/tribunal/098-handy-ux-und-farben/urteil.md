---
topic: 098-handy-ux-und-farben
status: entschieden
option: A, in zwei Schritten, beide umgesetzt
datum: 2026-11-19
umgesetzt: 715d5504255e594103b0230dd3a08909b079c49b
---
Jann im Chat: „Ja gefällt mir - können wir 6 Dinge über die ich mich freuen würde auch in 1 Zeile bekommen? Du kannst bauen“.

Schritt 1 umgesetzt: In der App ein hellerer Grund, weiße Karten und feinere Linien, die Landingpage bleibt wie sie ist. Wünsche ohne Bild haben Platzhalter in sechs gedeckten Kategoriefarben. Die Überschrift der Wunschliste steht ohne Schlusspunkt in einer Zeile, die Schrift passt sich der Breite an und bricht nur um, wenn sie gar nicht passt. Die Legende der Wichtigkeit steht im Filter (bei weniger als sechs Wünschen weiter über der Liste), das Band „Jetzt neu“ ist am Handy einzeilig, „Gespeichert“ ist am Handy ausgeblendet. Unter der Liste steht nur noch ein Hinweis zur Zeit (Erste Schritte, sonst App-Hinweis, sonst Geschmack, sonst Nudge), der Tipp zur Wunschliste steht jetzt in der FAQ.

Vorher behoben (ebe1e9c): abgeschnittener Demo-Link auf der Anmeldeseite und Platzhalter im Link-Feld.

Geprüft: ESLint, Build, Playwright bei 390 und 1280 px, axe (WCAG 2 AA) ohne Befund. Nicht geprüft: echtes Gerät.

Schritt 1: `3c731343f5f34e984b30573ae2d8aff8fabf23f4`.

Schritt 2 (Jann: „Ja Bau alles“), `715d5504255e594103b0230dd3a08909b079c49b`: Die Wunsch-Ansicht zeigt Bild und Namen nur noch oben, das gewünschte Produkt darunter nur mit Preis und dem Weg zum Shop. Alternativen, die dasselbe Produkt sind wie der Wunsch, fallen weg (`sameItem()` in `src/views/wishmodal.js`). Es gibt einen Hauptknopf, Alternativen und Varianten von Wishtale haben leise Textknöpfe, die eigenen Aktionen (Bearbeiten, Erledigt, Löschen) sind kleiner. Im Wunschdialog sind die Hinweise bei ungenauen Wünschen und unter dem Link-Feld auf ein bis zwei Zeilen gekürzt. In der Gastansicht stehen die Ideen von Wishtale im ruhigen Stil der eigenen Vorschläge, „Eigene Idee prüfen“ ist eine leise Zeile zum Aufklappen.

Geprüft: ESLint, Build, Playwright bei 390 px für eigene und Gast-Ansicht, Wunschdialog und Wunsch-Ansicht. Nicht geprüft: echtes Gerät.
