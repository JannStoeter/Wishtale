---
titel: Einstieg direkt in die Wunschliste, Konto erst beim Teilen oder Verlassen
art: aufgabe
status: in-arbeit
erstellt: 2026-11-27
von: jann
---
Wortlaut von Jann im Projekt (27.11.2026): „Lass uns den Einstieg in die App nochmal überarbeiten. Wir starten jetzt direkt mit dem Wunsch (momentan kommen wir da nur über ‚erstmal ohne Konto starten‘ hin). Wenn jemand auf ‚Wunschliste anlegen‘ klickt kommt er in seine Wunschliste. Mit richtiger Suche und allem. Das volle Erlebnis. Wenn er rausgeht oder es teilen will braucht er ein Konto damit die Daten bleiben. Wenn er über die Website zu ‚Wunschliste abfotografieren‘ geht kommt er ohne registrieren genau da hin. Ansonsten gleiche Procedere.“

Umsetzung (Pull Request):
- **Stilles Gastkonto:** `#start`, `#ohne-konto` und neu `#abfotografieren` öffnen sofort die eigene Wunschliste. Im Hintergrund legt `startGhost()` (`src/lib/auth.js`) ein anonymes Supabase-Konto an (`signInAnonymously`). Damit gelten alle Wege mit Konto: Suche über Otto mit Bild und Preis, Amazon- und Otto-Links, Ideen, Bilder im eigenen Speicher, Fotoimport. Keine Datenbankänderung, die Regeln (RLS) gelten für Gastkonten wie für andere Konten.
- **Ohne Erlaubnis in Supabase** (Anonymous sign-ins aus) bleibt es beim Entwurf im Browser aus 137, der Einstieg führt trotzdem direkt in die Liste.
- **Sichern:** Teilen öffnet das Fenster „Sichere deine Wunschliste, dann bekommst du deinen Link“ (`SaveModal()`, Google in einem Klick oder E-Mail). Google hängt sich an dasselbe Konto (`linkIdentity`), E-Mail über `updateUser({email})` mit Bestätigungsmail (Vorlage „Change email address“ angepasst, ohne Passwort; Passwort später über „Passwort vergessen“). Dieselbe Nutzer-ID, nichts zieht um.
- **Bestehendes Konto:** Gehört das Google-Konto oder die Adresse schon jemandem, meldet sich die Person dort an; die Wünsche des Gastkontos liegen vorher als Entwurf im Browser (`stashGhost()`) und kommen über `adoptDraft()` mit.
- **Verlassen:** Einmal je Sitzung fragt das Fenster „Bevor du gehst, sichere deine Wunschliste“: am Computer, wenn die Maus oben aus der Seite geht, am Handy, wenn man nach mehr als 15 Sekunden in einer anderen App zurückkommt, oder ab dem dritten Wunsch. Kein Browser-Dialog beim Schließen (zeigt nur einen festen, irreführenden Text und greift am Handy kaum).
- **Aufräumen:** Der tägliche Cron löscht Gastkonten 30 Tage nach der letzten Änderung samt Bildern (`api/_lib/ghosts.js`). Datenschutz Abschnitt 3, 7 und 14 ergänzt.
- **Landingpage:** „Wunschzettel abfotografieren“ im Einstieg (`hero.foto`) und bei Weihnachten für Kinder (`weihnachten.foto`), beide auf `/app/#abfotografieren`.
- **Zähler:** `start` mit Label `foto`, `step` mit `ghost_start`, `ghost_wish`, `save_prompt:<share|exit|back|third|hdr|menu>`, `ghost_save:<google|email>…`, `ghost_saved:<google|email>`, `ghost_save:exists`.

Nötig in Supabase (Jann): Authentication › Sign In / Providers › „Allow anonymous sign-ins“ an, „Allow manual linking“ an, Vorlage „Change email address“ aus `supabase/email-templates/email-change.html` einfügen. Empfohlen: CAPTCHA später, falls Missbrauch auftaucht (Supabase begrenzt anonyme Anmeldungen je IP auf 30 pro Stunde).
