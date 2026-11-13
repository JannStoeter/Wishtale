---
topic: 083-erledigte-wuensche-aus-der-liste
status: entschieden
option: Anweisung
datum: 2026-11-13
umgesetzt: 584eb9e
---
`src/views/wishes.js`: Der Statusschalter ist weg, die Wunschliste zeigt nur offene Wünsche (und „Nur für dich“). Als erledigt markierte Wünsche stehen im Profil unter „Das habe ich schon“ (`OwnedSec`), dort gibt es neben dem Entfernen einen Pfeil „Wieder als Wunsch“, der sie zurück auf die Liste holt. Der Hinweis nach „Erledigt, habe ich schon“ nennt diesen Ort. Die Historie (Geschenke bekommen und verschenkt) bleibt im Menü unter „Historie und Meine Geschenke“. Getestet mit Playwright (Demo, 390 px): kein Schalter, erledigter Wunsch verschwindet aus der Liste, steht im Profil, Pfeil bringt ihn zurück.
