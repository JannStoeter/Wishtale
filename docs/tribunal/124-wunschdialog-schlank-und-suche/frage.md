---
titel: Wunsch hinzufügen schlanker, Treffer direkt im Fenster
art: entscheidung
status: offen
optionen: A=Mehrere Treffer über die Websuche (Brave) | B=Amazon-Produktschnittstelle, sobald freigeschaltet | C=Produktfeeds über Awin (Otto) | D=A jetzt, B und C dazu, sobald möglich
erstellt: 2026-11-25
von: jann
---
## Kontext
Wortlaut von Jann im Projekt-Chat (25.11.2026), zu zwei Bildschirmfotos der Wishbob-Eingabe (Reiter „Geschenk suchen“ mit Amazon-Treffern, Bild, Preis und „Zum Wunschzettel hinzufügen“):

> Die Wunscheingabe ist weniger überladen obgleich ich sie altbacken designed finde. Wunschsuche ist super, dann muss man die Seite nicht verlassen. Das wäre Top. Wishbob ist etwas klarer strukturiert in seiner Aufteilung das finde ich gut. […] Wir müssen aber in allem minimalistischer werden und weniger Text und das Wünsche hinzufügen verbessern

Umgesetzt im ersten Schritt (Claude, gleicher Pull Request wie Dev 123): Ein Feld für Name oder Link mit Lupe, die Link-Zeile erscheint erst, wenn es einen Link gibt, Wunschzettel, Amazon-Suche und „Aus dem Shop“ als kleine Knöpfe, Art unter „Mehr Angaben“, Preis mit Euro-Zeichen, erklärende Absätze entfernt.

Heute zeigt der Dialog zu genauen Wünschen eine erkannte Karte und nach „Nicht das Richtige“ bis zu vier Alternativen ohne Bild. Wishbob zeigt eine Trefferliste mit Bild und Preis aus Amazon.

## Frage
Woher sollen mehrere Treffer mit Bild und Preis im Wunschdialog kommen?

- A: Websuche über Brave (gibt es schon für Bilder und Preise), mehrere Shopseiten je Suche, Bild und Preis von der Shopseite. Keine Amazon-Treffer mit Preis, weil Amazon nicht gelesen wird.
- B: Amazon-Produktschnittstelle (Creators API beziehungsweise PA-API). Liefert Bild, Preis und Partner-Link legal, wird aber erst nach drei qualifizierten Verkäufen in 180 Tagen freigeschaltet.
- C: Produktfeeds von Awin-Händlern (zuerst Otto) in einer eigenen Suche. Daten dürfen angezeigt werden, Feed muss regelmäßig geladen werden.
- D: A jetzt, B und C ergänzen, sobald möglich.
