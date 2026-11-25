---
topic: 119-konto-loeschen-absichern
art: aufgabe
von: jann
datum: 2026-11-25
---
# Konto löschen absichern

Wortlaut von Jann im Projekt:

> Kannst du bitte das Passwort von Ernst.alexandra148 zurücksetzen? Die email kam nicht an.
> Daran müssen wir arbeiten

Befund: Die Mail kam nicht an, weil das Konto eine Minute vorher über „Konto und alle Daten löschen“ gelöscht worden war (Supabase-Protokoll 2026-11-25 05:21 UTC, eigene Sitzung vom iPhone, nach `confirm()`). Supabase antwortet bei unbekannten Adressen absichtlich mit Erfolg und verschickt nichts. Der Löschknopf stand in derselben Zeile direkt neben „Passwort ändern“. Der Mailversand selbst ist in Ordnung.
