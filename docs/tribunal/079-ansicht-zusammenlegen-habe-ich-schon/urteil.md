---
topic: 079-ansicht-zusammenlegen-habe-ich-schon
status: entschieden
option: Anweisung
datum: 2026-11-13
umgesetzt: PENDING
---
`src/views/wishes.js`: Der Umschalter „Meine Ansicht / Vorschau“ ist weg. Stattdessen stehen unter den eigenen Wünschen die „Ideen von Wishtale“ (bis zu sechs, dieselben, die Freunde sehen) mit „Auf meine Wunschliste“, **„Habe ich schon“** und „Passt nicht“ (Rückmeldungen laufen in `taste_signals`, „Habe ich schon“ legt zusätzlich einen erledigten Eintrag an). Die Vorschau bleibt als kleiner Link „So sehen es deine Freunde“ neben „Teilen“, in der Vorschau steht oben „Zurück zu meinen Wünschen“. Die Aktionen `aiadd` und `aihave` finden Ideen jetzt in beiden Listen. Rundgang-Text angepasst. Getestet mit Playwright (390 px, Konto simuliert, Ideen simuliert), axe ohne Befund.
