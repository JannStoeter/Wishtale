---
titel: Bestätigungsmails von unserem eigenen Absender statt von Supabase
art: entscheidung
status: offen
optionen: A=Brevo (Frankreich) als SMTP-Dienst | B=Resend (USA, Region EU) | C=Postmark oder ein anderer Dienst | D=Beim Supabase-Standardversand bleiben und nur die Vorlagen deutsch machen
erstellt: 2026-11-10
von: jann
---
## Kontext
Frage von Jann (2026-11-10, Wortlaut): „Kriegen wir es hin, dass die confirm Mail direkt von unserem Absender kommt? Nicht von Supabase mit Template?“ Heute kommen Bestätigungs- und Passwort-Mails vom Supabase-Standardabsender („Supabase Auth“, englische Vorlage, begrenzte Anzahl pro Stunde). Unsere deutschen Vorlagen liegen fertig in `supabase/email-templates/`, der gewünschte Absender ist `hallo@wishtale.de`.

## Frage
Über welchen Dienst verschicken wir die Mails, und wann?
