---
topic: 054-leere-profile-und-start
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: e64e636
---
**Umgesetzt** (Commit e64e636):
- Hinweis bei dünnem Profil (`thinProfile()` in `src/lib/tale.js`: Interessen, Marken, Welten und Über-Text zusammen unter vier Angaben): in der Gastansicht über den Ideen („Mias Profil ist noch ganz frisch, darum sind unsere Ideen im Moment eher allgemein …“), in der Vorschau mit Link „Profil ergänzen“, in der Inspiration („Dein Profil ist noch recht leer …“).
- Leere Wunschliste: Karte „Was wünschst du dir gerade?“ mit drei Wegen (Wunsch aufschreiben, Liste einlesen, Inspiration ansehen), eigener Text für Kind-Konten. Der Profil-Hinweis oben erscheint erst ab dem ersten Wunsch.
- Nach Anmeldung, Bestätigung, Einladung und Einrichtung startet die App immer auf der Wunschliste (vorher landete ein leeres Konto in der Einrichtung `#start`).
- Wunsch-Detail: Bei Wünschen ohne Link steht wieder zuerst „Suche nach genau diesem Wunsch“ (Amazon-Suche mit dem Wortlaut), darunter „Weitere passende Produkte von Wishtale“.
- Nach dem Speichern eines Wunsches ohne Link: Hinweis „deine Freunde sehen dazu passende Ideen von Wishtale“ mit „So sehen es Freunde“.
Getestet mit Playwright (390 und 1280 px, angemeldet mit simulierten Antworten), axe ohne Befund.
