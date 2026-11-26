---
titel: Falsche Namen, fehlende Bilder und Preise bei Links
art: befund
status: entschieden
erstellt: 2026-11-26
von: jann
---
Wortlaut von Jann im Projekt-Chat (26.11.2026): „„Wunsch von Amazon“ war eigentlich ein Buch. Da hat Alex vorher auch einen Link über Thalia eingegeben da kam dann „Wunsch von Thalia“, was läuft da schief? Warum werden nicht alle Bilder richtig zugewiesen? Der Wunsch LEGO 10460 Kleinkinder Ausstellen ist eigentlich LEGO DUPLO Classic Bauplatte in Grün 10460. Warum heißt der falsch und hat kein Foto? Warum hat der keinen Preis?“

Befund: Amazon-Seiten liest Wishtale nicht (Partnerbedingungen, Dev 024), der Name kam darum nur aus der Adresse. Amazon schreibt dort Suchwörter hinein („LEGO-10460-Kleinkinder-Ausstellen-Geburtstag“), bei Links der Form `/dp/<ASIN>` steht gar kein Name drin. Thalia sperrt das automatische Lesen. In beiden Fällen nahm das Speichern als letzten Ausweg „Wunsch von <Shop>“. Bild und Preis werden mit dem Namen gesucht: Mit Suchwörtern oder „Wunsch von …“ erkennt die Produkterkennung nichts, also gab es weder Bild noch Preis.
