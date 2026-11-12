---
topic: 063-amazon-direktlink-ueber-websuche
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: 0cd1891
---
**Umgesetzt** (`api/_lib/imgsearch.js` `amazonDirect()`, Op `amazonQuery` in `api/inspect.js`, `src/lib/wishimg.js`, `src/actions.js`): Nach „Passt“ oder der Wahl einer Alternative im Wunsch-Dialog sucht Wishtale per Brave nach „<Produkt> amazon.de“, nimmt den ersten amazon.de-Treffer mit Produktnummer (ASIN), dessen Titel zu mindestens 85 Prozent zum Wunsch passt, und trägt `https://www.amazon.de/dp/<ASIN>?tag=jannst-21` in das Link-Feld ein (sichtbar, änderbar, nur wenn das Feld leer ist). Beim Liste einlesen geschieht das nach dem Speichern für die genauer gemachten Wünsche. Wir lesen Amazon selbst nicht, nur die Titelzeile der Suchmaschine; eine Prüfung, ob das gelieferte Produkt wirklich das gemeinte ist, bleibt der Person (Link im Feld).
Hinweis zur Kennung: Auch die bisherigen Suchlinks (`/s?k=…&tag=jannst-21`) tragen die Partner-Kennung; der Direktlink bringt keine andere Zuordnung, aber weniger Abbruch beim Käufer.
Live geprüft: SIKU Lexion 600 und AirPods Pro 3 liefern Direktlinks (AirPods stimmt mit der ASIN aus Janns früherem Link überein), der Schlummerwal wird bewusst nicht verlinkt (der Treffer war eine andere Tonie-Sammlung). Eine Brave-Abfrage je bestätigtem Wunsch.
Offen: Verlinkte Wünsche behandeln Wishtale-Ideen wie bei jedem Wunsch mit Link (keine KI-Alternativen).
