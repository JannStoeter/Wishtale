---
titel: Geschmack schärfen mit Karten (Ja, Nein, Habe ich schon), ohne dass etwas auf die Wunschliste kommt
art: entscheidung
status: offen
optionen: A=Feste, geprüfte Karten je Kategorie, ohne KI-Aufruf pro Person | B=Karten werden von der KI aus dem Profil erzeugt und je Kategorie zwischengespeichert | C=Nicht bauen, Rückmeldungen bleiben bei den Ideen in der Inspiration
erstellt: 2026-11-13
von: jann
---
## Kontext
Janns Wortlaut (13.11.2026), zwei Nachrichten. Erst: „Sind die Vorschläge bei mir und den Gästen dasselbe? Dann wäre es ja Quatsch, sie bei mir auch zu haben, weil dann sehe ich das ja und es ist keine Überraschung.“ Dann: „Ich hatte noch eine Idee, die Anpassung der Wünsche zu ‚tindern‘. Wir wollen über die Vorschläge ja erfahren, ob es passt oder nicht und ob es schon vorhanden ist. Dadurch wurde es aber keine Überraschung mehr. Was, wenn wir nach Kategorien unterteilt eine Reihe von Vorschlägen machen und man ‚Ja‘, ‚Nein‘ oder ‚Habe ich schon‘ wählt? Bei ‚Ja‘ kommt es nicht auf die Wunschliste, aber unsere KI kennt das Interessenprofil besser.“

Stand im Code: Unter den eigenen Wünschen stehen seit 079 die „Ideen von Wishtale“, und zwar dieselben, die Freunde in der Gastansicht sehen (`gkey`, derselbe Server-Aufruf und Zwischenspeicher), mit „Auf meine Wunschliste“, „Habe ich schon“ und „Passt nicht“. Das verrät den Vorrat, aus dem sich Freunde bedienen. Rückmeldungen laufen in `taste_signals` (gefällt, passt nicht, habe ich schon, `src/lib/signals.js`) und fließen als Geschmack in die KI-Ideen für Gäste und die Inspiration ein (`api/_lib/ideas.js`). Die Welten (Katalogprodukte nach Kategorie) sind seit 072 ausgeblendet, die Seite Inspiration ist über das Menü erreichbar. Offen sind 077 (Profilpflege dezent anstoßen) und die vorherige Frage, ob unter den eigenen Wünschen überhaupt Ideen stehen sollen.

Die Karten-Idee: Eine eigene Seite „Geschmack schärfen“ (im Menü unter „Für dich“, auch aus Hinweisen und der Klicktour erreichbar). Karten nach Kategorien (zum Beispiel Küche, Garten, Bücher, Technik, Kind nach Alter), eine Karte pro Produktart oder Stil. Drei Antworten: Ja (gefällt, kommt nie auf die Wunschliste), Nein, Habe ich schon. Jede Antwort wird ein Geschmackssignal. Die Person bestimmt nicht, was Freunde sehen, und sieht es auch nicht.

## Frage
Soll Wishtale die Rückmeldung zu Vorschlägen von der Wunschliste-Ansicht auf eine eigene Karten-Seite verlagern, und wie sollen Karten entstehen (fest oder von der KI)? Bitte bewerten: Überraschung (kann die Person aus den Karten auf die Gast-Ideen schließen?), Qualität des Lernens (zählt ein Ja ohne Wunsch genug?), Aufwand und Kosten, Datenschutz (mehr Geschmacksdaten je Person, Löschung, Abschnitt 11 der Datenschutzerklärung), Kind-Konten (altersgerechte Karten, Eltern antworten), Bildmaterial ohne Hotlinks, Barrierefreiheit (Wischen braucht eine Tastatur- und Knopf-Alternative) und wie viel Müdigkeit ein Kartenstapel erzeugt (Obergrenze, Fortschritt, jederzeit beenden). Bitte auch sagen, ob unter den eigenen Wünschen danach gar keine Ideen mehr stehen sollen.
