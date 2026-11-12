---
topic: 049-info-welt-profil
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: 4e37d6a
---
**Janns Anweisung im Chat**, umgesetzt:
- Der Profilkopf ist eine Schaltfläche mit „Mehr über <Name> ›“ und öffnet die Info-Welt (`src/views/about.js`).
- Aufbau: dunkler Kopf mit Avatar, „Eine kleine Geschichte über <Name>“ und dem Über-mich-Text als Zitat, danach nummerierte Kapitel: Was <Name> begeistert (große Schrift), Welten (Bildkacheln, öffnen das Welt-Fenster), Lieblingsmarken (Wortmarken), Einmal ausprobieren, Gut zu wissen (Lieber nicht / Hat schon), Das inspiriert <Name>, Wenn nichts passt.
- Die Seitenleiste „Mehr über …“ und der Aufklapper auf dem Handy entfallen, die Wunschliste nutzt am Desktop die ganze Breite.
- Gilt auch für „So sehen Schenkende es“ (private Felder bleiben verborgen).

Geprüft mit Playwright bei 390 und 1280 Pixeln, axe ohne Befund.
