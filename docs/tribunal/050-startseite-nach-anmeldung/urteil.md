---
topic: 050-startseite-nach-anmeldung
status: entschieden
option: C
datum: 2026-11-12
umgesetzt: 7de0085
---
**Janns Entscheidung im Chat: „Ja baue es.“** Claude und ChatGPT empfahlen beide C. Umgesetzt:
- Ohne Ziel startet die App auf „Wünsche“ (`DEFAULT_VIEW` in `src/render.js`), auch nach Bestätigung, Einrichtung, neuem Passwort, Demo und für Kind-Konten. Links wie `#profil` oder `#historie` führen weiter dorthin.
- Reiter auf Handy und Desktop: Wünsche, Inspiration, Profil, Historie (`src/views/shared.js`).
- Auf der Wunschseite oben der Umschalter „So sehen Schenkende es“ und „Link teilen“. Der Hinweis auf ein dünnes Profil (`Nudge()`) bleibt.
