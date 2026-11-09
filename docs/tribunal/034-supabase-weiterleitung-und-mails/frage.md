---
titel: Supabase-Dashboard: Site URL, Redirect-URLs und deutsche Mail-Vorlagen (Jann)
art: aufgabe
status: offen
optionen: A=Jann trägt die Werte im Supabase-Dashboard ein
erstellt: 2026-11-09
von: claude
---
## Kontext
Ursache für den Bruch nach der Bestätigungsmail (siehe 033). Das lässt sich nicht per Code oder über unsere Werkzeuge ändern.

## Frage
Bitte in Supabase unter Authentication › URL Configuration eintragen: Site URL `https://wishtale.de`, Redirect-URLs `https://wishtale.de/**` und `https://www.wishtale.de/**` (optional `http://localhost:5173/**` für Entwicklung). Danach unter Authentication › Emails die Vorlagen aus `supabase/email-templates/` einfügen (die Mail auf den Screenshots war noch die englische Standardvorlage, Absender und Betreff stehen in der README dort). Danach neu registrieren und testen, ob der Link auf wishtale.de landet.
