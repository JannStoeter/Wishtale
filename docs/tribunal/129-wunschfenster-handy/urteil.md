---
topic: 129-wunschfenster-handy
status: entschieden
option: umsetzen
datum: 2026-11-25
umgesetzt: 096a259
---
**Jann im Projekt:** Popup hängt am Handy unten, die Wünsche dahinter lassen sich scrollen.

Umsetzung: Bei offenem Fenster (`.scrim`) sperrt `html:has(.scrim)` das Scrollen der Seite, `overscroll-behavior: contain` hält das Scrollen im Fenster, und in `src/actions.js` verhindert ein `touchmove`-Wächter das Wischen außerhalb von Fenster, Menü und Rundgang (für iOS). Der Wunschdialog nimmt am Handy fast die ganze Höhe ein, „Wunsch speichern“ steht unten.
