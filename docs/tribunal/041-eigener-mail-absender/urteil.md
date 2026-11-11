---
topic: 041-eigener-mail-absender
status: entschieden
option: A
datum: 2026-11-13
umgesetzt: Einrichtung durch Jann, Datenschutz in Commit siehe ENTSCHEIDUNGEN
---
**Janns Entscheidung im Chat: Option A, united domains als SMTP-Server.** Jann hat Postfach, SPF, DKIM und DMARC bei united domains eingerichtet, SMTP (`smtps.udag.de`) und die deutschen Vorlagen in Supabase eingetragen und den Mailversand getestet. Jann (2026-11-13, Wortlaut): „Der Mail Lauf (im Standard über united Domain) ist getestet und funktioniert.“ Datenschutzerklärung Abschnitt 3 nennt jetzt united domains als Versandweg. Offen und bewusst später: eigenes Postfach nur für den App-Versand (Rat von ChatGPT), Versandlimit von united domains erfragen, eine Willkommensmail (hängt an 008), eine Bremse gegen Massenregistrierungen (043, Punkt 11), und falls Mails im Spam landen oder das Volumen wächst der Wechsel auf einen Versanddienst wie Brevo (nur Tausch der SMTP-Daten).
