---
autor: claude
datum: 2026-11-25
empfehlung: D
sicherheit: mittel
aufwand: mittel
kosten: laufend Brave-Abfragen je Suche (Grenzen über guardSearch), später keine für B, Speicher für C
---
## Begründung
Die Suche im Fenster ist laut Jann das Stärkste an Wishbob. Mit A geht das sofort mit dem, was schon läuft (`api/_lib/imgsearch.js`, Brave, Grenzen je Konto und gesamt). Gesucht wird erst nach einer Tipp-Pause und nur mit dem eingegebenen Namen. B bringt Amazon mit echtem Preis und Partner-Link, sobald die Schnittstelle freigeschaltet ist, und ist der Weg, den Wishbob geht. C macht Otto über Awin durchsuchbar und verdient Provision.

## Risiken
Brave liefert Shopseiten, deren Bilder und Preise nicht immer passen (siehe Dev 114). Darum gelten dieselben Prüfungen wie bei den Bildern (`fits()`), und Treffer werden nie ohne Klick übernommen. Braves Bedingungen verbieten eine Datenbank aus Suchergebnissen, Treffer werden also nur angezeigt. Mehr Abfragen kosten mehr, die Tagesgrenzen bleiben. Die Datenschutzerklärung nennt Brave schon (Abschnitt 11), der Zweck „Produktsuche im Wunschdialog“ muss ergänzt werden.

## Gegenargument
Ohne Amazon-Preise wirkt die Suche schwächer als bei Wishbob, und jede Suche kostet Geld, während die Amazon-Schnittstelle kostenlos wäre. Man könnte warten, bis B freigeschaltet ist, und bis dahin nur den schlanken Dialog ausliefern.
