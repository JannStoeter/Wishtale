---
topic: 106-launch-checkliste
status: entschieden
option: Checkliste, Teil B gebaut
datum: 2026-11-24
umgesetzt: ebaca5364a3c1bc70493edc6139d3f836f4a7f4b
---
Jann im Chat: „Bitte baue alles. Ich habe nun Vercel und Supabase auf Pro umgestellt.“

Teil B umgesetzt:
- B1 (`bcb9a99`): Migration `0031`, `guard_profile_update()` nicht mehr über die Schnittstelle aufrufbar, der Trigger läuft weiter (geprüft).
- B2 (`bcb9a99`): Hinweise „Pflegt ihr das zu zweit?“ (Kind-Konto ohne Mitverwaltung), „Deine Liste ist bereit für deine Familie“ (ab drei Wünschen, noch nie geteilt) und für Gäste nach dem Reservieren „eigenes Wishtale anlegen“. Gast-Kopfzeile passt am Handy auch mit „Meine Geschenke“.
- B3 (`ebaca53`): Gäste schicken sich den Link zu ihren Reservierungen per Mail, über den eigenen Mailserver, Adresse wird nicht gespeichert. Datenschutz Abschnitt 5. Braucht in Vercel SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (dieselben Daten wie in Supabase), sonst bleibt der Knopf mit einer freundlichen Meldung ohne Wirkung.
- B4: Fehlerprotokolle in den ersten zwei Wochen täglich prüfen, läuft ab dem Start.

Teil A: Vercel und Supabase sind auf Pro (Jann). Offen bei Jann: SPF, DKIM und DMARC, Mail-Grenzen in Supabase, Verträge zur Auftragsverarbeitung, Ausgabenlimit bei Anthropic, Schutz vor geleakten Passwörtern in Supabase, PartnerNet.

Geprüft: ESLint, Build, Playwright (alle drei Hinweise, Mail-Fenster mit simulierter Antwort, Übernahme des Schlüssels über den Link), Prüfung von `mailMe()` mit simuliertem Versand, axe ohne Befund. Nicht geprüft: echter Mailversand (Zugangsdaten fehlen in Vercel).
