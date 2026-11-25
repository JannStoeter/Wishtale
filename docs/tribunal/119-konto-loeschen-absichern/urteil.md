---
topic: 119-konto-loeschen-absichern
status: entschieden
option: auftrag
datum: 2026-11-25
umgesetzt: OFFEN
---
**Jann im Projekt:** „Daran müssen wir arbeiten“ (nach einem versehentlich gelöschten Konto).

Umsetzung: Im Fenster „Konten“ steht „Konto löschen“ nicht mehr neben „Passwort ändern“, sondern in einem eigenen, abgesetzten Bereich mit Erklärung. Der Knopf öffnet das Fenster `delacct` (`DelAcctModal()` in `src/views/modals.js`): Es nennt, was verschwindet, verweist auf „Passwort ändern“ und löscht erst, wenn die eigene E-Mail-Adresse eingetippt ist (Prüfung im Formular `delacct` in `src/actions.js`). Der Hauptknopf ist „Konto behalten“.

Offen: Löschen mit Wartezeit (zum Beispiel 7 Tage, in denen eine Anmeldung das Konto zurückholt). Berührt Datenschutz (Art. 17), darum eigener Punkt, falls gewünscht.
