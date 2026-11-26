---
titel: Registrierung ohne Pflicht-Abfrage, direkt in die Wunschliste
art: aufgabe
status: in-arbeit
erstellt: 2026-11-26
von: jann
---
Wortlaut von Jann im Chat (26.11.2026): „wir müssen die registrierung leichter machen. Auf Wishbob geht es mit 1 CLick über Google rein.. bei uns kommt man in eine 8 stufige Abfrage (weil wir natürlich Infos wollen) Aber da brechen sicher viele ab.... Ich sehe das wir durch die Werbung zwar Clicks bekommen aber keine neuen Konten.. Also Einstieg von Landing in die Wunschliste muss zack zack gehen... wir muntern dann auf für ein besseres Erlebnis das Profuil zu erstellen“

Umsetzung (Pull Request, Vorschau vor dem Merge):
- `#start` ohne Konto führt sofort zur Registrierung (Google oder E-Mail), Name, Startwahl und Profilfragen entfallen davor. Der Entwurf trägt `quick`, nach der Anmeldung steht die leere Wunschliste mit ihrem einen Feld da, ohne Fenster darüber.
- Das Profil ist freiwillig: „Erste Schritte“ nennen als zweiten Schritt „Ein wenig über dich erzählen, damit die Ideen passen“ (auch zugeklappt als „Als Nächstes“), der Hinweis bei dünnem Profil in den Ideen führt in die geführte Einrichtung. Die Einrichtung mit Konto beginnt direkt bei den Interessen und hat „Später“.
- Keine Datenbankänderung.
