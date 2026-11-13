---
autor: chatgpt
datum: 2026-11-13
empfehlung: A
sicherheit: hoch
aufwand: mittel
kosten: einmalig Entwicklung und geprüfte Bildrechte, laufend geringe Speicherung; keine KI-Kosten je Kartenrunde
---
## Begründung
Ich empfehle **A als freiwillige, kurze Geschmackspflege** im Menü. Geprüfte Karten mit festen IDs, Kategorie und konkreten Merkmalen liefern vergleichbare Signale; KI-generierte Karten pro Person erzeugen dagegen Kosten, schwankende Begriffe und einen Rückkopplungseffekt aus bisherigen Empfehlungen. Für den Start reichen etwa 30 bis 50 abwechslungsreiche Karten, je Runde höchstens zehn, mit Kategorieauswahl, Fortschritt und jederzeit „Fertig“. Der Umfang ist ein Vorschlag, kein belegtes Optimum.

**Ja bedeutet Geschmack, nicht Wunsch.** Beschriftung: „Gefällt mir“, „Passt nicht“, „Habe ich schon“, zusätzlich neutrales „Überspringen“ und „Rückgängig“. Ein Ja legt niemals automatisch einen Wunsch an. Eine Karte behandelt genau eine Produktart oder einen Stil; gemischte Themenkarten liefern unklare Antworten. Positive Signale sind schwache Hinweise, mehrere übereinstimmende Antworten verstärken sie. Ein Nein gilt zunächst für diese Karte, nicht automatisch für die gesamte Kategorie. „Habe ich schon“ ist Besitz und keine Abneigung; vorhandene Dinge können den Geschmack sogar positiv erklären. Die heutige Logik macht no und have einschließlich verwandter Begriffe zu weitreichenden Ausschlüssen (api/_lib/ideas.js, context/avoid und SYSTEM). Sie muss vor Übernahme der Karten differenziert werden; bloß weitere Texte in taste_signals einzufügen reicht nicht.

**Konkrete Gast-Ideen verschwinden unter den eigenen Wünschen.** Stattdessen höchstens eine kompakte Einladung „Deinen Geschmack schärfen“. Die Gäste behalten ihre Empfehlungen direkt unter der Wunschliste gemäß 075/076. Karten und Gast-Empfehlungen dürfen nicht denselben kleinen Produktpool spiegeln: Karten zeigen breitere Produktarten/Stile ohne Shopangebote, die Gast-KI nutzt deren Merkmale zur Auswahl anderer konkreter Ideen. Das erhält mehr Überraschung, garantiert aber keine Unvorhersehbarkeit: Wer Kaffee mag, kann Kaffeeideen erwarten. Eine absichtlich geöffnete Gastvorschau bleibt möglich, sollte aber nicht automatisch Gast-Ideen vorladen und präsentieren. Eigene Inspiration darf nur als ausdrücklich gewählter Bereich existieren und darf nicht wieder denselben Gast-Cache anzeigen.

**Privat und korrigierbar:** pro Profil und Karte zählt die neueste Antwort, wiederholte Runden erhöhen nicht künstlich das Gewicht. Antworten sind einsehbar, änderbar und löschbar; „Geschmacksantworten zurücksetzen“ löscht diese Signale samt daraus abgeleiteten Zwischenspeichern, aber keine selbst angelegten Wünsche oder unabhängigen Besitzangaben. Kartenquelle und Version speichern, damit Auswertungen verständlich bleiben. Gäste erhalten keine Rohantworten; Begründungen dürfen keine privaten Angaben verraten. Bestehende Eigentümerrechte und Profillöschung mit Kaskade aus 0014 nutzen; Zugriff bei mitverwalteten Kind-Konten eigens prüfen. Abschnitt 11 der Datenschutzerklärung um Zweck, Datenarten, Modellnutzung, Löschung und Cachefolgen ergänzen.

**Kinder und Bedienung:** Eltern antworten im klar bezeichneten Kind-Profil; nur vorab geprüfte altersgerechte Karten, keine Erwachsenenprodukte. Bilder selbst ausliefern, mit geklärten Rechten; neutrale eigene Illustrationen genügen. Wischen ist optional. Vollwertige beschriftete Knöpfe, Tastaturbedienung, sichtbarer Fokus, brauchbare Alternativtexte, Statusmeldung bei Kartenwechsel und reduzierte Bewegung gehören zum ersten Stand. Nach zehn Karten wird freundlich beendet, nicht automatisch die nächste Runde gestartet.

## Risiken
Die erwartete Verbesserung der Empfehlungen ist noch nicht gemessen. Feste Karten können einseitig sein; deshalb Kategorien und Stile mischen und spätere Empfehlungsgüte überprüfen, statt viele Antworten mit gutem Lernen gleichzusetzen. Private Vorlieben nicht zu sensiblen Eigenschaften hochrechnen. Die vorhandene Signalabfrage berücksichtigt nur die neuesten 60 Zeilen; mehr Karten können alte relevante Angaben verdrängen. Für das neue Verfahren braucht es eine bewusst aggregierte Sicht statt eines endlosen Ereignisverlaufs. Code und Migration 0014 wurden gelesen; kein Live-, Nutzertest oder rechtlicher Vollcheck durchgeführt.

## Gegenargument
B könnte mit weniger redaktioneller Pflege schneller auf einen individuellen Geschmack reagieren. Für einen ersten belastbaren Lernmechanismus überwiegen jedoch kontrollierte Begriffe, Bildrechte, niedrige Kosten und nachvollziehbare Antworten. Später kann KI Karten zur redaktionellen Prüfung vorschlagen, ohne sie ungeprüft pro Person zu erzeugen.
