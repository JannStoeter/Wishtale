---
topic: 140-instagram-1000-follower
status: entschieden
option: teil-1-umsetzen
datum: 2026-11-27
umgesetzt: fde2ef3
---
**Jann im Projekt:** „Wir brauche mind 1000 follower. Arbeite daran bitte“

Teil 1 umgesetzt: „Folge Wishtale auf Instagram“ in der Fußzeile der Landingpage (Schlüssel `footer.ig`), der Ratgeber und der Rechtsseiten, am Ende der Gastansicht für Gäste ohne Konto (`GuestOwn()`), im Avatar-Menü unter „Social Media“, `sameAs` im JSON-LD der Startseite. Adresse und Kürzel in `src/lib/iglink.js` (`IG_URL`, `IG_HANDLE`). Klicks zählen als vorhandenes Ereignis `cta` mit Label `instagram:<stelle>` (`watchIgClicks()` in `src/lib/track.js`), kein neues Ereignis.

Teil 2 entschieden (siehe Nachtrag).

Nachtrag (Jann, 27.11.2026, Entscheidungskarte): „Story-Bild und Gewinnspiel“.
- Story-Bild: Menüpunkt „Als Instagram-Story teilen“ (`storyshare` in `src/actions.js`, Bild aus `src/lib/storyimg.js`, nur offene, nicht private Wünsche, nie Reservierungen, nichts wird hochgeladen), PR #64 (d19958f).
- Gewinnspiel: Ideen `k-gewinnspiel`, `s-gewinnspiel`, `k-gewinner` im Instagram-Studio (Preis, Ende und Gewinnername trägt Jann ein), Teilnahmebedingungen unter `/gewinnspiel` (`gewinnspiel.html`, Veranstalter aus `legal.config.mjs`, ab 18, Wohnsitz Deutschland, Folgen und Kommentieren als Bedingung, Teilen und Markieren freiwillig, Hinweis, dass Meta nicht beteiligt ist), Datenschutz Abschnitt 12 ergänzt. Den Preis wählt Jann, veröffentlicht wird nur mit seiner Freigabe.
