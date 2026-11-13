---
autor: chatgpt
datum: 2026-11-13
empfehlung: B
sicherheit: hoch
aufwand: mittel
kosten: einmalig 0 €, laufend 0 €
---
## Begründung
Auf dem Handy muss die Seite innerhalb des ersten Bildschirms als **Wunschliste** erkennbar sein. Momentan konkurrieren Import, Erklärungen und Einstellungen mit dem eigentlichen Inhalt. Ich empfehle deshalb **B**, mit diesem konkreten Aufbau:

1. Oben stehen kompakt „Meine Wünsche“ mit Anzahl sowie eine schmale Zeile für „Meine Ansicht / So sehen Schenkende es“ und Teilen.
2. „Liste einlesen“ bleibt prominent, wird aber zu einer flachen Aktionszeile: **„Liste einlesen“**, darunter klein „Text oder Foto übernehmen“, mit Symbol und Pfeil. Keine große dunkle Erklärungskarte.
3. Direkt danach beginnt die Wunschliste. Sichtbar bleiben nur „Offen / Erledigt“ und ein Knopf **„Filtern & sortieren“**. Kategorie, Sortierung sowie Kacheln/Liste öffnen sich darin als Sheet oder Klappbereich. Aktive Filter stehen anschließend kurz auf dem Knopf.
4. Der Überraschungshinweis, die Produkterklärung, „Erste Schritte“ und Aktionen erscheinen unter den Wünschen oder gesammelt hinter **„Tipps zu deiner Wunschliste“**. Bei einer leeren Liste darf der Import-Hinweis wieder groß werden.
5. „Wunsch hinzufügen“ bleibt als schwebender Knopf knapp über der Navigation, erhält dort aber einen reservierten Abstand und überlagert keine Bedienfelder.

Die untere Leiste bekommt **drei gleich breite Spalten**: Wünsche, Profil, Historie. Einen mittigen Pluspunkt wie in C würde ich nicht ergänzen: Er verdoppelt „Wunsch hinzufügen“ und würde Historie unnötig im Profil verstecken. Den aktiven Punkt würde ich klarer, aber ruhig markieren: eine weiche grün-beige Fläche hinter Symbol und Text, dunkleres grünes Symbol, semibold Text und `aria-current="page"`. Der aktuelle Akzent mit 9 Prozent ist zu unauffällig; etwa 14 bis 16 Prozent Tönung passt besser zur ruhigen Gestaltung.

## Risiken
- Werden fast alle Einstellungen eingeklappt, können Sortierung und Listenansicht schlechter auffindbar sein. Der Knopf muss deshalb „Filtern & sortieren“ heißen und aktive Einstellungen anzeigen.
- Ein großer Aktionsbanner oberhalb der Wünsche würde die Verbesserung wieder zunichtemachen. Mobil sollte dort höchstens ein kompakter, ausblendbarer Hinweis gleichzeitig erscheinen.
- Die genaue Höhe hängt von Browserleiste, Safe Area und Textvergrößerung ab. Abnahme deshalb bei 320, 375 und 390 Pixeln sowie mit 200 Prozent Textzoom.

## Gegenargument
Option C wäre formal besonders aufgeräumt und ein mittiges Plus ist aus vielen Apps vertraut. Sie macht aber aus einer bereits vorhandenen Hauptaktion eine zweite Navigationsebene und schwächt die klare Dreiteilung aus Inhalt, Profil und Historie. B löst das Platzproblem mit weniger Strukturänderung und hält alle drei Bereiche direkt erreichbar.
