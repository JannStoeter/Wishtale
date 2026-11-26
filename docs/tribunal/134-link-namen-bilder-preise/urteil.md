---
topic: 134-link-namen-bilder-preise
status: entschieden
option: umsetzen
datum: 2026-11-26
umgesetzt: a7435b8
---
**Jann im Projekt:** Namen, Bilder und Preise bei Links sollen stimmen.

Umsetzung: Für Links, die Wishtale nicht lesen kann (Amazon, Seiten mit Lesesperre wie Thalia), sucht der Server den echten Namen über die Suchmaschine zur Produktnummer der Adresse (ASIN oder Artikelnummer, `titleForLink()` in `api/_lib/imgsearch.js`, `op titleFor` in `api/inspect.js`, bei gesperrten Seiten automatisch im normalen Lesen). Nur ein Treffer mit genau dieser Nummer zählt, lange Shop-Titel werden auf den Produktnamen gekürzt (`shortTitle()`), von Amazon kommt nie ein Bild. „Wunsch von <Shop>“ gibt es nicht mehr: ohne Namen bittet der Dialog, kurz einzutragen, was es ist. Ältere Wünsche mit Ersatznamen werden einmal je Profil repariert (`src/lib/namefix.js`), danach kommen Bild und Preis wie bei neuen Wünschen. Der Preis von Amazon selbst bleibt bis zur Creators API außen vor, Wishtale nimmt den Preis anderer Shops als „ca.“.
