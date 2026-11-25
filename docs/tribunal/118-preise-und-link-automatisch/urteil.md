---
topic: 118-preise-und-link-automatisch
status: entschieden
option: auftrag
datum: 2026-11-25
umgesetzt: ee737d67c7c7fbe7690b554ac390f27c418aea88
---
**Jann im Projekt:** „Man muss erst link einlesen dann speichern. Das muss automatisch gehen“ und Preise sollen direkt online kommen.

Umsetzung:

1. **Link ohne Extra-Schritt.** Der Knopf „Einlesen“ ist weg. Der Link wird beim Einfügen, nach kurzer Tipp-Pause und beim Verlassen des Feldes gelesen. Was aus dem eigenen Link kommt (Shopseite, Amazon-Name aus der Adresse, kopierter Titel), übernimmt Wishtale von selbst (`autoTake()` in `src/actions.js`): Ist das Namensfeld leer, kommen Name, Preis und Bild hinein, sonst bleibt der eigene Name und nur ein leerer Preis und ein fehlendes Bild werden ergänzt. Das ändert die Regel aus 053 („nur nach Klick“) für den eigenen Link; Vorschläge von Wishtale (Erkennung, Alternativen) bleiben bei „nur nach Klick“. Speichern wartet bis zu 9 Sekunden auf ein laufendes Einlesen (`prepWish()`), der Knopf zeigt „Link wird gelesen …“. Ein Wunsch ohne Namen, aber mit Link bekommt den gelesenen Namen oder einen aus der Adresse (`nameFromLink()` in `src/lib/linkname.js`, sonst „Wunsch von <Shop>“). Ohne Namen und Link erscheint ein Hinweis.
2. **Preise von selbst.** Wünsche ohne Preis bekommen nach dem Speichern, nach dem Wunschzettel und nach und nach (8 je Profil und Tag) einen echten Preis (`src/lib/pricefill.js`, `priceFor` in `api/inspect.js`, `priceForWish()` in `api/_lib/imgsearch.js`). Reihenfolge: eigener Shop-Link (nicht Amazon), sonst ein Preis, den die Produkterkennung auf einer gefundenen Seite gelesen hat, sonst Hersteller- oder Shopseite aus der Brave-Websuche (ohne Marktplätze und Preisvergleiche). Nur Euro, nur wenn der Seitentitel eng passt (`fits`, mindestens 70 Prozent der Wörter, jede Angabe mit Ziffern muss im Titel stehen), nie eine Schätzung des Modells. Ein eingetragener Preis wird nie ersetzt. Datenschutz Abschnitt 11 ergänzt.

Offen: Preise altern. Es gibt noch keinen Stand je Preis (Spalte `price_at` mit Migration und `public_profile`), damit ließe sich ein alter Preis später auffrischen oder als „Stand …“ zeigen. Otto-Preise über einen Awin-Produktfeed wären eine zweite Quelle, brauchen aber einen Feed-Schlüssel.
