---
topic: 128-bilder-preise-suche
status: entschieden
option: umsetzen
datum: 2026-11-25
umgesetzt: offen
---
**Jann im Projekt:** vier Korrekturen (Bilder zeitversetzt, Preis weicht von Amazon ab, keine Bilder in der Suche, Namen zu kurz).

Umsetzung: `prefetchImage()` in `src/lib/imgfill.js` sucht das Bild, sobald der Wunsch-Dialog ein Produkt sicher erkennt, beim Speichern kommt es sofort an den Wunsch. Amazon-Treffer der Suche bekommen Bilder aus einer Bildersuche ohne Amazon (`pictures()` in `api/_lib/imgsearch.js`, eine Suche mit dem Begriff, für bis zu drei Treffer ohne Bild eine eigene), gekürzte Titel kommen aus der Amazon-Adresse (`fullTitle()`), Titel bis vier Zeilen. Preise ohne eigenen Shop-Link oder mit Amazon-Link stehen als „ca.“, die Wunschansicht verweist auf den aktuellen Preis bei Amazon. Echte Amazon-Bilder und -Preise erst mit der Creators API.

Nachtrag: Die Suche läuft immer über Otto (sonst andere Shops), ohne Shop-Auswahl. Jeder Treffer zeigt „Bei Amazon“ und „Bei Otto“ mit einem „Anzeige“.
