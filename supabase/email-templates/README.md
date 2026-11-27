# E-Mail-Vorlagen für Wishtale

Erzeugt mit `node scripts/build-mails.mjs`. Nicht von Hand ändern, sondern in `scripts/build-mails.mjs` anpassen und neu bauen.

## Einfügen
Supabase › Authentication › Emails (oder „Email Templates“). Pro Vorlage Betreff und Inhalt (HTML) ersetzen:

| Vorlage in Supabase | Betreff | Datei |
|---|---|---|
| Confirm signup | Bestätige dein Wishtale | `confirm-signup.html` |
| Magic Link | Dein Link zu Wishtale | `magic-link.html` |
| Reset password | Neues Passwort für dein Wishtale | `recovery.html` |
| Change email address | Bestätige deine E-Mail-Adresse für Wishtale | `email-change.html` |
| Invite user | Du wurdest zu Wishtale eingeladen | `invite.html` |
| Reauthentication | Dein Bestätigungscode für Wishtale | `reauthentication.html` |

## Absender
Supabase › Authentication › SMTP Settings: Absender `hallo@wishtale.de`, Name `Wishtale`, dazu Host, Port, Benutzer und Passwort deines Mailanbieters.

## Logo
`public/mail/logo.png` wird von `https://wishtale.de/mail/logo.png` geladen. Neu erzeugen mit `node scripts/mail-logo.mjs`.
