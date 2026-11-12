---
topic: 067-fehlerbehebung-keine-vorschlaege-preis-prioritaet
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: 09c6740
---
**Umgesetzt** (`src/lib/products.js`, `src/views/card.js`, `src/views/wishmodal.js`, `src/data/content.js`, `src/actions.js`):
1. „Hierfür keine Vorschläge generieren“ blendet jetzt nur die Vorschläge und KI-Ideen aus. Bei Produkt-Wünschen bleibt „Suche nach genau diesem Wunsch“ bei Amazon (Partnerlink), für Gäste wie für dich. Erlebnisse, freie Wünsche und Kategorien zeigen ohne Vorschläge weiterhin nichts.
2. Kachelansicht zeigt den Preis (oder „bis X €“ bei Kategorien) unten links in der Karte.
3. Im Wunsch-Detail wählst du die Wichtigkeit per Auswahlliste (Sehr wichtig, Wichtig, Nice to have) statt per Klick im Kreis. „Herzenswunsch“ heißt überall „Sehr wichtig“.
Geprüft mit Playwright (390 und 1280 px).
