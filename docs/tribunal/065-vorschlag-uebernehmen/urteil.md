---
topic: 065-vorschlag-uebernehmen
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: 19adc42
---
**Umgesetzt** (`src/views/wishmodal.js`, `src/actions.js` `aiuse`): Im Wunsch-Detail der eigenen Liste hat jeder Vorschlag von Wishtale den Knopf „Dieses Produkt übernehmen“. Der ungenaue Wunsch wird damit zu diesem Produkt: Name, geschätzter Preis (Mitte der Spanne), Kategorie, danach im Hintergrund der direkte Amazon-Link (063) und das Produktbild. Ein Hinweis „Übernommen: Dein Wunsch ist jetzt …“ bietet „Rückgängig“ (stellt Name, Preis, Link, Bild und Kategorie wieder her). Gäste sehen danach das gewählte Produkt statt der Vorschläge; das Wählen durch Gäste („Diesen wählen“) bleibt davon getrennt. Geprüft mit Playwright inklusive Rückgängig.
