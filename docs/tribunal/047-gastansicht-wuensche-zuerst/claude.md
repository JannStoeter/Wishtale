---
autor: claude
datum: 2026-11-13
empfehlung: A
sicherheit: hoch
aufwand: gering bis mittel
kosten: keine laufenden Kosten, etwa ein halber bis ein Arbeitstag
---
## Begründung
Jann hat recht. Wer den Link bekommt, kommt mit einer Aufgabe: ein Geschenk für Jonas finden. Die erste Frage ist „Was wünscht sich Jonas?“, nicht „Wer ist Jonas?“, denn das weiß der Gast meistens schon. Heute sieht er auf dem Handy zuerst einen langen Text über Jonas, Interessen, Marken und den Preisrahmen und muss eineinhalb Bildschirme scrollen, bevor der erste Wunsch erscheint. Das ist die Reihenfolge eines Profils, nicht die eines Wunschzettels.

Gleichzeitig ist das Profil der Kern von Wishtale („Die Wunschliste, die dich kennt“). Es soll nicht verschwinden, sondern dort wirken, wo es beim Schenken hilft. Deshalb empfehle ich **A, Wünsche zuerst**, mit zwei Gedanken aus B:

1. **Kompakter Kopf (etwa ein Drittel des Bildschirms):** Avatar, Name, eine einzige Zeile Geschmack („liebt Kaffee brühen, Kochen und Einrichten“), die „Bitte nicht“-Chips (die sind beim Schenken wirklich wichtig, um Fehlgriffe zu vermeiden) und der Preisrahmen als schmale Leiste. Der Text „Über …“ wird auf zwei Zeilen gekürzt mit „mehr lesen“.
2. **Direkt danach die Wunschliste.** Auf dem Handy ist die erste Wunschkarte schon auf dem ersten Bildschirm zu sehen.
3. **Das Profil würzt die Wünsche (aus B):** An einer Wunschkarte oder im Wunschdetail steht in einer Zeile, warum er passt („passt zu: Kaffee brühen, Lieblingsmarke Hario“). Damit sieht der Gast den Geschmack genau dort, wo er entscheidet.
4. **Danach die Ideen von Wishtale** und darunter „Mehr über Jonas“ mit allem Weiteren (Marken, Hat schon, Inspiration, Gutscheine), für alle, die nichts auf der Liste finden.
5. **Die Sprache dreht sich zum Schenken:** Die Überschrift der Liste wird zur Einladung, etwa „Was Jonas sich wünscht“, und die Ideen heißen „Falls du noch etwas suchst“.

Am Desktop bleibt das zweispaltige Raster, die rechte Leiste wird aber zur „Mehr über …“-Spalte, und der Kopf wird ebenfalls kompakter.

Warum nicht B ganz: Ein geführter Assistent ist für Erstgäste schön, aber wer nur schnell reservieren will, wird ausgebremst, und es ist mehr Arbeit. Warum nicht C (Reiter): Reiter verstecken Inhalte, auf dem Handy werden sie selten gewechselt, und gerade „Bitte nicht“ und „Hat schon“ würden übersehen. D lässt das Problem bestehen.

**Messen:** Wir haben das Ereignis `guest_view` schon. Sinnvoll wäre zusätzlich ein Ereignis „Wunsch geöffnet“ in der Gast-Ansicht, damit wir sehen, ob mehr Gäste einen Wunsch öffnen und reservieren. Das muss in `api/_lib/event.js` freigegeben und in der Datenschutzerklärung (Abschnitt 8) ergänzt werden.

## Risiken
Wenn der Geschmack zu knapp wird, verliert die Seite ihr Unterscheidungsmerkmal gegenüber einer normalen Wunschliste. Deshalb die Zeile „passt zu …“ an den Wünschen und die Ideen direkt darunter. Bei Profilen ohne Wünsche (frisch angelegt) muss die Seite anders aussehen: Dann rücken Geschmack und Ideen nach oben. Die Profil-Vorschau „So sehen Schenkende es“ nutzt dieselbe Ansicht und ändert sich mit.

## Gegenargument
Gerade der Profilkopf zeigt sofort, was Wishtale anders macht, und viele Gäste lesen gern, wer jemand ist, bevor sie wählen. Wer B ernst nimmt, kann die Seite noch stärker als Schenk-Werkzeug bauen (Preisrahmen zuerst, dann passende Wünsche und Ideen gemischt), das wäre mutiger, aber auch ein größerer Umbau.
