---
titel: Wünsche-Seite am Handy: Wünsche nach vorn, untere Leiste neu aufteilen
art: entscheidung
status: offen
optionen: A=Nur die untere Leiste und die Einlese-Karte anpassen | B=Wünsche nach vorn, alles Erklärende nach unten oder hinter einen Hinweis, Leiste mit drei Punkten | C=Wie B, dazu eine neue Leiste mit Plus in der Mitte (Wünsche, Plus, Profil) und Historie im Profil
erstellt: 2026-11-13
von: jann
---
## Kontext
Janns Wortlaut mit Handy-Screenshot der Wünsche-Seite: „Nicht direkt bauen, Thema fürs Tribunal. Auf der Wünsche-Seite steht auf dem Handy immer noch sehr viel Kram, ehe die Wünsche kommen. Eigentlich sollen die Wünsche im Vordergrund sein. Der Call to Action für die Liste ist gewünscht, aber nimmt auf dem Handy zu viel Platz. Die Erklärung und die Einstellungen darunter noch einmal. Durch die entfallenen Inspirationen ist unten jetzt keine passende Aufteilung. Wollen wir den Wünsche-Button unten schon leicht highlighten?“

Stand im Code (`Wuensche()` in `src/views/wishes.js`, `BottomNav()` in `src/views/shared.js`, `.btm` in `src/styles/main.css`): Vor der ersten Wunschkarte liegen, von oben nach unten, die Aktion (`AppPromo`), die Zeile „Erste Schritte“, der Umschalter „Meine Ansicht“ samt „Link teilen“, die Überschrift mit Zähler, die dunkle Karte „Wishtale liest sie für dich ein“ (Überschrift, vier Zeilen Text, Knopf), der Hinweiskasten „Die Überraschung bleibt …“, ein Absatz „Du musst nicht jedes Produkt kennen …“, der Statusschalter (Offen, Erledigt, Alle Wünsche), die Kategorieauswahl, Sortierung und Kacheln/Liste, die Prioritätsleiste und erst dann die Wünsche. Auf einem 390-Pixel-Bildschirm liegt die erste Wunschkarte dadurch unter dem Falz, und der schwebende Knopf „Wunsch hinzufügen“ verdeckt in der Mitte den Umschalter Kacheln/Liste.
Seit 073 hat die untere Leiste nur noch drei Punkte (Wünsche, Profil, Historie), das Gitter `.btm` ist aber weiter auf vier Spalten gestellt, daher sitzen die drei Punkte links und rechts bleibt ein leeres Viertel. Der aktive Punkt ist nur mit einem Anteil von 9 Prozent der Akzentfarbe hinterlegt und fällt kaum auf.

## Frage
Wie soll die Wünsche-Seite am Handy aufgebaut sein, und wie soll die untere Leiste mit nur noch drei Punkten aussehen? Gestellt wird zugleich die Frage nach dem Hervorheben des aktiven Punktes.
