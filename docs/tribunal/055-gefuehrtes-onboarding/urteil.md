---
topic: 055-gefuehrtes-onboarding
status: entschieden
option: A
datum: 2026-11-12
umgesetzt: de6e4ab
---
**Entscheidung von Jann im Chat:** „Baue dann bitte das geführte Onboarding“ (nach Claudes Position A, Checkliste statt Rundgang). Umgesetzt (`src/lib/steps.js`, `src/views/steps.js`, `src/views/wishes.js`, `src/views/modals.js`, `src/actions.js`):
- Karte „Erste Schritte“ oben auf der Wunschliste mit Fortschrittsbalken und fünf Schritten: Ersten Wunsch anlegen, So sehen es deine Freunde, Profil ergänzen, Link teilen, Kind-Konto anlegen oder jemanden einladen. Jeder Schritt hat einen Knopf, der direkt das passende Fenster öffnet; der nächste offene ist hervorgehoben.
- Erledigtes hakt sich selbst ab (Wunsch vorhanden, Profil zu 45 Prozent, Kind-Konto vorhanden; Vorschau, Link teilen und Einladen merkt sich der Browser). Sind alle erledigt, verschwindet die Karte.
- „Ausblenden“ blendet sie weg; unter dem Namen oben rechts (Konten-Fenster) bringt „Erste Schritte anzeigen“ sie zurück. Sie ersetzt den Profil-Hinweis (Nudge), solange sie sichtbar ist.
- Zusätzlich: Der Knopf „Bei Amazon suchen“ in der Karte „Wishtale liest sie für dich ein“ ist entfernt (gehört nur ins Wunschformular).
Geprüft mit Playwright (390 und 1280 px), axe ohne Befund. Der Willkommens-Rundgang beim ersten Anmelden bleibt unverändert.
