---
titel: Offene Einrichtung bei Vercel, Supabase und Anthropic (Jann)
art: aufgabe
status: offen
optionen: A=Diese Woche erledigen | B=Nach dem Test der KI-Funktionen | C=Einzeln nach Bedarf
erstellt: 2026-11-09
von: claude
---
## Kontext
Offene Punkte außerhalb des Codes, die nur Jann erledigen kann:
- `CRON_SECRET` in Vercel eintragen (sonst laufen geplante Instagram-Beiträge nicht).
- Supabase › Authentication › URL-Konfiguration: Site URL und Redirect-URLs auf `https://wishtale.de`.
- Eigener E-Mail-Absender `hallo@wishtale.de` (SMTP) und die Vorlagen aus `supabase/email-templates/` einfügen.
- Testzeilen in der Statistik löschen: `delete from public.events where visitor like 'probe_%' or utm_campaign like 'probe_%';`
- Ausgabenlimit bei Anthropic setzen und Guthaben im Blick behalten.
- Auftragsverarbeitungsvertrag (DPA) mit Anthropic prüfen, später mit Stripe.
- Verzeichnis der Verarbeitungstätigkeiten ergänzen (Wunschzettel-Auslesen, KI-Ideen, Verbrauchsdaten).
- USt-IdNr. im Impressum nachtragen (`legal.config.mjs`).
- Supabase „Advisors“ (Sicherheit und Leistung) durchsehen.

## Frage
In welcher Reihenfolge und bis wann?
