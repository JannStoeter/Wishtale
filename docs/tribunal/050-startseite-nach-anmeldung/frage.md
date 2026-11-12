---
titel: Startseite nach der Anmeldung: Wünsche statt Profil-Bearbeitung?
art: entscheidung
status: offen
optionen: A=Start auf „Wünsche“, Profil bleibt eigener Reiter | B=Neue Startseite „Mein Wishtale“: oben die eigene Seite so, wie Freunde sie sehen, mit Bearbeiten-Stiften direkt an Wünschen und Profil (bearbeiten im Kontext) | C=Start auf „Wünsche“ und Reiter neu ordnen (Wünsche, Inspiration, Profil, Historie) | D=So lassen (Start auf Profil)
erstellt: 2026-11-12
von: jann
---
## Kontext
Auftrag von Jann (2026-11-12, Wortlaut): „wir haben in der Nutzeransicht noch einen Fehler: Ich brauche in der Wunschseite einen Button für "Als schenkender ansehen" oder "Als Gast sehen" oder "so sehen deine Freunde es". Das ist jetzt nur im Profil, das macht keinen Sinn. Auch hier stellt sich die Frage, ob wir das Profi so vordrücken, oder ob wir nicht auch dort mit der Wunschseite starten also in der Desktopansicht. Wenn ich mich einlogge bin ich quasi in der Bearbeitung meines Profils, das finde ich nicht richtig. Das müssen wir drehen. Bitte frage auch Chatty dazu“

Der Button „So sehen Schenkende es“ steht inzwischen auch auf der Wunschseite (im Chat erledigt, kein Teil dieser Frage).

Heute (`src/render.js`, `DEFAULT_VIEW='profil'`): Nach der Anmeldung öffnet die App den Reiter „Profil“. Dort stehen Werbefläche, ein Kopf mit Name und „Link teilen“, der Umschalter „Meine Ansicht | So sehen Schenkende es“, eine Fortschrittsanzeige und die Abschnitte Über mich, Interessen, Welten, Marken, No-Gos und so weiter, jeweils mit „Ändern“. Die Reiter sind Profil, Wünsche, Historie, Inspiration (`src/views/shared.js`). Die Gastansicht wurde gerade auf „Wünsche zuerst“ umgebaut (047 bis 049), die Infos über die Person öffnen sich dort als Fenster.

## Frage
Womit soll die App nach der Anmeldung starten (Handy und Desktop), und wie sollen Wünsche, Profil und die Vorschau für Schenkende zueinander stehen?
