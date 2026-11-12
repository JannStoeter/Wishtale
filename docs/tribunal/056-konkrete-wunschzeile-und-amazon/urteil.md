---
topic: 056-konkrete-wunschzeile-und-amazon
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: 1b75176
---
**Umgesetzt** (`src/views/card.js`, `src/views/wishmodal.js`, `src/render.js`):
- Unterzeile: ungenauer Wunsch ohne Link „Tipp von Wishtale: <erster KI-Tipp>“ (die Tipps werden für bis zu 12 Wünsche im Hintergrund vorgeladen, in der eigenen Liste und in der Gastansicht, meist aus dem Zwischenspeicher), genauer Wunsch ohne Link „Bei Amazon zu finden“, Amazon-Link „Bei Amazon“, Shop-Link „<shop>, auch bei Amazon“.
- Wunsch-Detail mit Shop-Link: nach dem gewünschten Produkt eine Karte „Auch bei Amazon“ mit Partnerlink (Amazon-Suche nach dem Produktnamen). Ein echter Abgleich, ob Amazon genau dieses Produkt führt, ist ohne Amazon-Schnittstelle (PA-API) nicht möglich; die Suche ist ehrlich als „Preise bei Amazon vergleichen“ beschriftet.
- Das eigene Produktbild erscheint jetzt auch in der Shop-Karte.
Getestet mit Playwright (390 und 1280 px, angemeldet, simulierte Antworten).
