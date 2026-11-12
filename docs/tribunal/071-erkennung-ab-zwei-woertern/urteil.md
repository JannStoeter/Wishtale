---
topic: 071-erkennung-ab-zwei-woertern
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: PENDING
---
`concrete()` in `src/views/wishprev.js` verlangt nur noch zwei Wörter (vorher drei oder zwei mit Zahl). Der Hinweis bei „kein sicheres Produkt“ ermuntert jetzt, Farbe, Sorte oder Größe zu ergänzen („Essie Nagellack rot“) oder einen Shop-Link einzufügen. Auf dem Server bleibt die Vorsicht: Ein Treffer aus der Websuche gilt bei Wünschen ohne Zahl nur, wenn das Modell selbst ein bestimmtes Produkt vermutet. Die Wunschzettel-Erkennung nutzt dieselbe Schwelle.
