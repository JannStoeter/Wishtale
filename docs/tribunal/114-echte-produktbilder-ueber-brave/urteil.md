---
topic: 114-echte-produktbilder-ueber-brave
status: entschieden
option: Bilder je Wunsch, Ideenkarten behalten das Symbol
datum: 2026-11-24
umgesetzt: 8a027c5f05a3b2fd396224fbb35d99c59af4b316
---
**Jann im Projekt-Thread:** möglichst viele echte Produktbilder über Brave. Auf der Entscheidungskarte: Ideenkarten behalten ihr Symbol, das Bild kommt erst mit dem Wunsch.

Umsetzung: Genau benannte Wünsche ohne Bild bekommen nach dem Speichern (neu, bearbeitet, Wunschzettel) und ältere Wünsche nach und nach (höchstens 8 je Profil und Tag) im Hintergrund ein Bild (`src/lib/imgfill.js`, `imageFor` in `api/inspect.js`, `imageForWish()` in `api/_lib/imgsearch.js`). Reihenfolge: eigener Shop-Link der Person (nie Amazon), Herstellerseite, Bildersuche. Trefferprüfung `fits()`: Kernwörter ohne Füllwörter, Marke plus unterscheidendes Wort reicht („Hue Bewegungsmelder“), Zahlen müssen stimmen; Bildagenturen und Marktplätze raus, mindestens 300 px laut Suche und 200 px nach dem Laden, kein extremes Format. Ein eigenes oder entferntes Bild wird nie ersetzt (`skipImage`). Übernommene Ideen holen ihr Bild beim „Auf meine Wunschliste“. Die Wunschansicht nennt die Bildquelle („Bild von …“).

Kosten: Tagesgrenzen für Brave-Anfragen in `guardSearch()` (`api/_lib/limits.js`): je Konto 60, gesamt 500 (`LIMIT_SEARCH_USER_PER_DAY`, `LIMIT_SEARCH_GLOBAL_PER_DAY`); bei etwa 5 Dollar je 1.000 Suchen und 5 Dollar freiem Monatsguthaben.

Risiko in einfachen Worten (keine Rechtsberatung): Produktfotos gehören Herstellern oder Fotografen, das Kopieren in den eigenen Speicher bleibt eine Grauzone, in Deutschland sind Abmahnungen wegen Produktfotos möglich. Braves Bedingungen verbieten außerdem, eine eigene Datenbank aus Suchergebnissen aufzubauen; ein Bild je Wunsch, ausgelöst durch die Person, ist vertretbar, ein gemeinsamer Bildspeicher für Ideen wäre es nicht. Darum: Herstellerbild bevorzugt, Quelle sichtbar, jedes Bild entfernbar.

Nachtrag (Jann im Thread, mit Screenshot): Allgemeine Wünsche behalten ihr Symbol, „Großer Reisekoffer 4 Rollen“ zeigte eine leere Fläche. Ursache: Die Ziffer machte den Wunsch „genau“, und die Bildersuche fand ein fast weißes Bild von koffer24.de; der Hue-Wunsch bekam ein Bild von monsterdealz.de. Behoben: Ohne eigenen Shop-Link sucht Wishtale nur noch, wenn die Produkterkennung (`mode=match`) sicher genau ein Produkt erkennt oder eine feste Marke nennt (Feld `marke`, Janns Vorschlag: „Hue Bewegungsmelder“ ja, „Großer Reisekoffer“ nein), und nimmt dann zuerst deren Bild. Eine Mengenangabe ist keine Modellangabe mehr (`modelCode()` in `api/_lib/match.js`, Zwischenspeicher `match4`). Fast leere Bilder werden verworfen (`isBlank()` in `src/lib/wishimg.js`), Deal-Seiten sind ausgeschlossen, und lädt ein Bild nicht, steht das Symbol da (`WishArt()`). Neuer Versuch für alle Wünsche (`wishtale:img-tried2`).
