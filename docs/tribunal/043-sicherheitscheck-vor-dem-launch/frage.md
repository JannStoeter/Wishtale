---
titel: Sicherheitscheck vor dem Launch: Befunde und Reihenfolge
art: befund
status: offen
optionen: A=Alle Punkte der Stufen Hoch und Mittel vor dem Launch beheben | B=Nur Stufe Hoch vor dem Launch, Mittel danach | C=Nichts ändern
erstellt: 2026-11-11
von: jann
---
## Kontext
Auftrag von Jann (2026-11-11, Wortlaut): „Bitte machen einen vollständigen Sicherheitscheck meines Projektes und nenne mir Sicherheitslücken und Datenprobleme damit ich zum Launch sicher bin.“

Geprüft von Claude: Datenbank (Zeilenregeln aller 27 Tabellen, 12 Funktionen mit erhöhten Rechten, Speicher-Buckets, Supabase-Sicherheitsberater), alle Server-Funktionen in `api/`, die Oberfläche auf eingeschleusten Code, Schlüssel im Repository und in der Git-Historie, Umgebungsvariablen bei Vercel (nur Namen), Abhängigkeiten (`npm audit`), Sicherheits-Kopfzeilen der Live-Seite. Nicht geprüft: Einstellungen im Supabase-Dashboard (Passwortregeln, Mail), Stripe (noch nicht verbunden), ein Angriffstest von außen durch Dritte.

## Frage
Welche Befunde werden vor dem Launch behoben?

## Befunde

### Hoch
1. **Keine Sicherungen der Datenbank.** Im Gratis-Tarif von Supabase gibt es keine täglichen Sicherungen, und ein Projekt wird nach einer Woche ohne Aktivität pausiert. Ein Fehler oder ein versehentliches Löschen wäre endgültig. Abhilfe: Supabase Pro oder ein regelmäßiger eigener Dump (siehe 042).
2. **Aufräumen läuft nicht, weil `CRON_SECRET` bei Vercel fehlt.** Der tägliche Lauf (`api/cron-publish.js`) antwortet ohne Schlüssel mit „nicht erlaubt“. Dadurch werden die Zähler des Missbrauchsschutzes (3 Tage), der KI-Zwischenspeicher (60 Tage) und die Statistik (13 Monate) nie gelöscht, obwohl die Datenschutzerklärung das zusagt. Abhilfe: Jann setzt `CRON_SECRET` (Aufgabe 019).
3. **Kontolöschung lässt Bilder zurück.** `delete_my_account()` löscht Konto, Profil und Wünsche, aber die Dateien im öffentlichen Bucket `wish-images` bleiben liegen und sind über ihre Adresse weiter abrufbar. Dasselbe gilt für Bilder gelöschter oder geänderter Wünsche. Das widerspricht dem Recht auf Löschung. Abhilfe: Dateien beim Löschen von Wunsch und Konto mit entfernen.
4. **Anmeldung nach der Bestätigungsmail führt zu Vercel statt zu Wishtale** (033 und 034, Supabase-Dashboard). Kein Datenleck, aber neue Nutzer landen auf einer fremden Anmeldeseite.
5. **Passwort des Beispielkontos Jonas steht im Chatverlauf.** Bitte in der App ändern.

### Mittel
6. **Reservierungen lassen sich von Fremden blockieren.** `reserve_wish` ist ohne Anmeldung und ohne Begrenzung aufrufbar. Wer den Link eines Wishtale kennt, kann alle Wünsche als „reserviert“ markieren, und die Person selbst sieht das absichtlich nicht und kann es nicht zurücksetzen. Abhilfe: Begrenzung je Adresse, Ablauf unbestätigter Reservierungen oder ein Knopf „Alle Reservierungen zurücksetzen“ für die Person (ohne dass sie Einzelheiten sieht).
7. **Profile lassen sich erraten.** Das Kürzel besteht aus Vorname und vier Zeichen (zum Beispiel `joana-mmbj`), `public_profile` ist ohne Anmeldung und ohne Begrenzung abfragbar. Wer häufige Vornamen durchprobiert, findet Profile samt Name, Alter, Text „Über mich“ und offenen Wünschen, auch von Kind-Konten. Abhilfe: längeres zufälliges Kürzel für neue Profile, Begrenzung der Abfragen, Alter nur zeigen, wenn die Person es will.
8. **Alter, „Über mich“ und Name des Elternteils sind immer öffentlich.** Für diese Felder gibt es keine Sichtbarkeitswahl, anders als bei Interessen oder Marken.
9. **Stichwörter privater Wünsche sind öffentlich.** `public_profile` liefert die Stichwörter der Wünsche „selbst erfüllen“ im Feld `hidden`, damit Vorschläge sie meiden. Wer die Antwort mitliest, sieht also grob, was die Person sich privat vorgenommen hat. Abhilfe: das Filtern auf den Server verlagern.
10. **Keine Sperre gegen eingebettete Seiten und keine Inhalts-Richtlinie.** Es fehlen `X-Frame-Options` beziehungsweise `frame-ancestors` (Schutz davor, dass Wishtale unsichtbar in einer fremden Seite steckt) und eine Content-Security-Policy. Die Anmeldung liegt im Browser-Speicher, eine eingeschleuste Zeile Code könnte sie auslesen. Ich habe keine solche Stelle gefunden, eine Richtlinie wäre die zweite Verteidigungslinie.
11. **Keine Bremse bei Registrierungen.** Es gibt weder Captcha noch eine eigene Begrenzung. Jemand kann massenhaft Bestätigungsmails an fremde Adressen auslösen, das schadet dem Ruf des Absenders (wichtig für 041).
12. **Schutz vor bekannten Passwörtern ist aus** (Hinweis des Supabase-Beraters). Die Prüfung gegen geleakte Passwörter gibt es nach meinem Wissen erst im Pro-Tarif.
13. **Server-Funktionen laufen in den USA**, die Datenbank in London (siehe 042). Jede Anfrage mit Nutzerdaten geht über den Atlantik.

### Niedrig
14. **Die Person kann ihre eigene Überraschung ansehen.** Wer den eigenen Gast-Link abgemeldet öffnet, sieht, welche Wünsche reserviert sind. Das lässt sich technisch nicht ganz verhindern, weil Gäste es sehen müssen.
15. **Name im eigenen Profil an einer Stelle ohne Schutzfilter** (`src/views/profile.js`, Zeile mit „liebt …“). Betrifft nur die eigene Ansicht, sollte trotzdem geschlossen werden.
16. **`.gitignore` kennt keine `.env`-Dateien.** Heute liegt keine im Repository und in der Historie stehen keine Schlüssel, die Zeile verhindert einen späteren Unfall.
17. **Zeitvergleich des Cron-Schlüssels** nutzt einen normalen Vergleich. Das Risiko ist theoretisch.

### In Ordnung
- Alle 27 Tabellen haben Zeilenregeln, jede Person liest und schreibt nur Eigenes, Admin-Bereiche prüfen `is_admin()`.
- Admin wird nur, wer in `admin_emails` steht und die Adresse bestätigt hat. Es gibt genau einen Admin.
- Funktionen mit erhöhten Rechten haben einen festen Suchpfad und prüfen die Berechtigung selbst.
- Reservierungen speichern nur einen Hash des Tokens, niemand sieht, wer reserviert hat.
- Keine Schlüssel im Code oder in der Git-Historie, alle Geheimnisse liegen bei Vercel als geschützte Variablen und nur für die Produktion.
- Stripe-Signatur wird mit Zeitfenster und zeitsicherem Vergleich geprüft, Preise kommen nie aus dem Browser.
- Link lesen und Bilder holen haben Schutz gegen Zugriffe auf interne Adressen, Kurzlinks folgen nur Amazon und Pinterest.
- KI-Aufrufe haben Tageslimits je Adresse, Konto und insgesamt, Antworten werden bereinigt und gekürzt.
- Abhängigkeiten ohne bekannte Lücken (`npm audit`: 0).
- Vorschau-Adressen bei Vercel sind geschützt, HTTPS wird erzwungen.

### Schon behoben (2026-11-11)
- **Der Vorschau-Modus der KI war ohne Anmeldung aufrufbar.** Mit dem Umbau 037 (2026-11-09) konnte jeder mit beliebigem Text KI-Aufrufe auf Kosten eines fremden Kontos auslösen und dessen Tageslimit aufbrauchen. Das war ein Fehler von Claude. Jetzt nur noch für die angemeldete Person des Profils.
