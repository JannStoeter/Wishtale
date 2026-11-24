---
topic: 112-icons-statt-buchstaben
status: entschieden
option: Passendes Symbol statt Anfangsbuchstabe
datum: 2026-11-24
umgesetzt: f3ccb21e54f512b684c8a5d8e451f4d3c531f203
---
Wünsche ohne Bild zeigen statt des Anfangsbuchstabens ein Symbol, das zum Wunsch passt. `src/lib/wishicon.js` hat ein eigenes, einheitliches Linien-Set (Inline-SVG, rund 50 Symbole) und sucht zuerst Stichwörter im Wunschnamen (speziell vor allgemein, „Laufschuhe“ ist ein Schuh, „Kochbuch“ ein Buch), dann die Kategorie, sonst ein Geschenk. Gilt für Liste, Kacheln, Gastansicht, Wunschansicht und die Erkennung im Wunsch-Dialog. Farben je Kategorie bleiben, eigene Fotos und Produktbilder unverändert.
