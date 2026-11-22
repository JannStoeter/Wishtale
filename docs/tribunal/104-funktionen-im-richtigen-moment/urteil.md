---
topic: 104-funktionen-im-richtigen-moment
status: entschieden
option: Kind-Konten-Hinweis umgesetzt, weitere Hinweise offen
datum: 2026-11-22
umgesetzt: 118fc42bbfccb2f84a5d84be6eb063e83f38fb10
---
Umgesetzt: Baustein für Hinweise im passenden Moment (`src/lib/tips.js` für die Regeln, `src/views/tips.js` für die Texte) und als erster Fall der Kind-Konten-Hinweis über der Wunschliste. Er erscheint nur bei Erwachsenen ohne Kind-Konto, die etwas eindeutig Kindliches eingetragen haben, ersetzt solange die übrigen Hinweise unter der Liste, öffnet mit „Kind-Konto anlegen“ direkt das Formular und verschwindet nach einem der beiden Knöpfe dauerhaft.

Geprüft: ESLint, Build, Playwright bei 390 px (LEGO-Set löst nichts aus, Tonie schon, Knopf öffnet das Formular, nach Neuladen weg), axe ohne Befund.

Offen: weitere Hinweise nach Claudes Vorschlägen 1 bis 5.
