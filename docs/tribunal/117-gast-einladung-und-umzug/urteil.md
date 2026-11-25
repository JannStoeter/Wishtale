---
topic: 117-gast-einladung-und-umzug
status: entschieden
option: Vorschläge 1 bis 4 umsetzen
datum: 2026-11-25
umgesetzt: 8edab0ca218dd01533e2a715f5c315bdeb590b5b
---
**Jann im Thread:** „1-5 kannst du direkt bauen und mergen! … 1-4 schnell umsetzen“.

Gebaut:
- **Gastansicht (1):** Am Ende der Gastansicht steht für Gäste ohne Konto „Und du? Was wünschst du dir eigentlich“ mit dem Knopf „Meine Wunschliste anlegen“ (`GuestOwn()` in `src/views/giver.js`, Stil `.gown`). Dieser Knopf und die bisherigen Wege zum eigenen Wishtale nach dem Reservieren (`given.js`) und im Hinweis `guestown` laufen über die Aktion `guestcta`: Sie setzt `?utm_source=wishtale&utm_medium=gast&utm_campaign=<ende|reserviert|verlauf|tipp>` in die Adresse, meldet `cta` mit Label `gast-<stelle>` und öffnet die Anmeldung. `signUp` speichert die Kürzel wie bisher in `user_metadata.utm`. So zeigt die Auswertung, wie viele Konten aus geteilten Listen entstehen. Keine neuen Ereignisse, nichts auf dem Gerät, Datenschutz Abschnitt 8 deckt es ab.
- **Umzug von Amazon (2):** Der Wunschzettel konnte Screenshots und kopierten Text einer Amazon-Liste schon lesen (Regel im Prompt von `api/_lib/zettel.js`). Jetzt sagt es die App auch: Hinweise im Wunschdialog und in der leeren Liste („Schon eine Liste auf Papier oder bei Amazon?“), Einleitung und Aufklapper im Wunschzettel-Fenster, Absatz auf der Startseite unter „So funktioniert es“ (neuer Schlüssel `schritte.umzug`).
- **Suchseiten (4):** Ratgeberseite „Amazon-Wunschliste mitnehmen“ (`ratgeber/amazon-wunschliste-umziehen.html`) mit Anleitung für Handy und Computer, in Übersicht, Fußzeilen (`footer.rg5`), Sitemap und `vite.config.js`. Die übrigen vier Seiten kamen mit Dev 115.
- **Presse (3):** Pressemappe und Anschreiben als Dokument im Projekt, Versand nur nach Janns Freigabe.
