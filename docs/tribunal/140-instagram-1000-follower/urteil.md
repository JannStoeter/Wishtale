---
topic: 140-instagram-1000-follower
status: entschieden
option: teil-1-umsetzen
datum: 2026-11-27
umgesetzt: PENDING
---
**Jann im Projekt:** „Wir brauche mind 1000 follower. Arbeite daran bitte“

Teil 1 umgesetzt: „Folge Wishtale auf Instagram“ in der Fußzeile der Landingpage (Schlüssel `footer.ig`), der Ratgeber und der Rechtsseiten, am Ende der Gastansicht für Gäste ohne Konto (`GuestOwn()`), im Avatar-Menü unter „Social Media“, `sameAs` im JSON-LD der Startseite. Adresse und Kürzel in `src/lib/iglink.js` (`IG_URL`, `IG_HANDLE`). Klicks zählen als vorhandenes Ereignis `cta` mit Label `instagram:<stelle>` (`watchIgClicks()` in `src/lib/track.js`), kein neues Ereignis.

Teil 2 wartet auf Janns Entscheidung.
