---
topic: 081-preisrahmen-zurueck-filter-symbol
status: entschieden
option: Anweisung
datum: 2026-11-13
umgesetzt: PENDING
---
Der Preisrahmen (`PriceFilter()` in `src/views/giver.js`) ist eine schmale Zeile „Preis: Egal, bis 20 €, bis 50 €, bis 100 €“ statt eines Kastens mit Überschrift und steht jetzt auch unter den „Ideen von Wishtale“ auf der eigenen Wünsche-Seite (`OwnIdeas`), in der Gastansicht und in der Inspiration. Ein Wechsel holt neue Ideen (`pb` lädt jetzt auch die Ideen der eigenen Wünsche-Seite). „Filtern und sortieren“ hat ein Filter-Symbol (Regler, `ICON.filter`) statt der Lupe. Getestet mit Playwright (390 px): Wechsel auf „bis 20 €“ zeigt die Auswahl, axe ohne Befund.
