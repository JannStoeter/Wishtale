---
topic: 058-bestimmtes-produkt-ohne-link
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: 3516819
---
**Umgesetzt** (`src/views/wishmodal.js`, `src/lib/category.js`): Ein genauer Wunsch ohne Link (`isSpecific()`, zum Beispiel ein eingelesener Amazon-Titel) zeigt keine Box „Du hast kein bestimmtes Produkt gewählt“ mehr. Direkt unter den Aktionen steht das Produkt selbst als „Gewünschtes Produkt, bei Amazon“ (durchgezogener Rahmen, eigenes Bild falls vorhanden, Amazon-Partnerlink). Ähnliche Produkte von Wishtale bleiben darunter. Neue Wünsche mit Tonies, Hörfiguren, tiptoi, Duplo, Schleich landen in „Spielen und Basteln“ statt „Wohnen und Interior“; bestehende Wünsche behalten ihre Kategorie.
