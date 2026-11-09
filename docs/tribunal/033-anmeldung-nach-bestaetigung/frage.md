---
titel: Anmeldung nach der Bestätigungsmail: Redirect und Rückmeldung
art: befund
status: entschieden
optionen: A=Hinweis „angemeldet“ in der App einbauen, Supabase-Weiterleitung von Jann korrigieren lassen
erstellt: 2026-11-09
von: jann
---
## Kontext
Meldung von Jann (2026-11-09, Wortlaut, mit drei Handy-Screenshots): „Alles gut - wir müssen den anmelde Prozess bearbeiten. Das läuft noch quer, da merken die Menschen nicht dass sie angemeldet sind. Die supabase confirm Mail ist ok aber danach müssen wir den Redirect machen.“ Auf den Screenshots: „Fast geschafft“-Seite, englische Bestätigungsmail von Supabase und danach die Anmeldeseite von Vercel.

Befund von Claude: Der Bestätigungslink von Supabase leitet nicht auf wishtale.de, sondern auf `https://wishtale-jann-stoeter.vercel.app` (geprüft über den Verify-Endpunkt, auch mit `redirect_to=https://wishtale.de/app/`). Diese Adresse ist durch Vercel geschützt und zeigt deshalb dessen Anmeldung. Ursache: In Supabase (Authentication › URL Configuration) steht als Site URL die Vercel-Adresse, und `https://wishtale.de/**` fehlt in den erlaubten Redirect-URLs, deshalb greift der Rückfall auf die Site URL. Das lässt sich nur im Supabase-Dashboard ändern.

## Frage
Wie beheben wir das ganz?
