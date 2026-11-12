---
topic: 062-listen-import-mit-abgleich
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: bba184c
---
**Umgesetzt** (`src/actions.js`, `src/views/zettel.js`): Nach dem Einlesen einer Liste gleicht Wishtale die Wünsche im Hintergrund mit dem Netz ab (dieselbe Erkennung wie im Wunsch-Dialog, `mode=match` mit Websuche), höchstens 12 Wünsche, drei gleichzeitig, Erlebnisse und sehr kurze Einträge nicht. Unter jeder Zeile erscheint „Wishtale gleicht den Wunsch mit dem Netz ab …“, dann bei sicherem Treffer ein Haken „Genauer machen: <Titel> · <Preis> gefunden bei <Shop>“, sonst „Kein sicherer Treffer. Der Wunsch bleibt, wie du ihn geschrieben hast.“ Gespeichert werden darf jederzeit. Beim Speichern übernimmt der Haken Titel und Preis, die Kategorie kommt aus der Erkennung, und das Produktbild wird danach im Hintergrund geholt. Ohne Haken bleibt der Wortlaut des Zettels unverändert.
Kosten: bis zu 12 Brave-Abfragen je eingelesener Liste (5-Dollar-Guthaben, etwa 1.000 Abfragen). Bei längeren Listen werden nur die ersten 12 abgeglichen, der Rest bleibt wie geschrieben.
