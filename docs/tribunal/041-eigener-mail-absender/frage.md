---
titel: Bestätigungsmails von unserem eigenen Absender statt von Supabase
art: entscheidung
status: offen
optionen: A=Postfach bei united domains als SMTP-Server nutzen (kein neuer Vertrag) | B=Brevo (Frankreich) als SMTP-Dienst | C=Resend (USA, Region EU) oder ein anderer Dienst | D=Beim Supabase-Standardversand bleiben und nur die Vorlagen deutsch machen
erstellt: 2026-11-10
von: jann
---
## Kontext
Frage von Jann (2026-11-10, Wortlaut): „Kriegen wir es hin, dass die confirm Mail direkt von unserem Absender kommt? Nicht von Supabase mit Template?“ Heute kommen Bestätigungs- und Passwort-Mails vom Supabase-Standardabsender („Supabase Auth“, englische Vorlage, begrenzte Anzahl pro Stunde). Unsere deutschen Vorlagen liegen fertig in `supabase/email-templates/`, der gewünschte Absender ist `hallo@wishtale.de`.

Nachfrage von Jann (2026-11-10, Wortlaut): „Kriegen wir das nicht direkt über united domains raus? So langsam sammeln sich sonst ja die Verträge.“

## Frage
Über welchen Dienst verschicken wir die Mails, und wann?
