---
topic: 056-wunsch-als-produktkarte
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: 3f84e7a
---
**Umgesetzt:** Im Wunsch-Detail (`Offer()` in `src/views/wishmodal.js`) erscheint die genaue Amazon-Suche zum Wunsch als Produktkarte wie die Vorschläge: Überschrift „Gewünschtes Produkt“, Titel, Bild des Wunsches (falls vorhanden) und nur der Button „Bei Amazon suchen“, ohne den Block „Preis bei Amazon / Dort siehst du den aktuellen Preis“.
- Wunschkarte (`src/views/card.js`): Hinweis kürzer und nicht mehr abgeschnitten („Wishtale hat passende Ideen“, „Ideen von Wishtale ansehen“, „Vorschlag von Wishtale ansehen“); Wünsche ohne Link und ohne Foto bekommen auf dem Monogramm die Marke „Ideen“ mit Funkensymbol (`.wideas`).
