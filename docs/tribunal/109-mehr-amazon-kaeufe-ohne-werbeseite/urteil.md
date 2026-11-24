---
topic: 109-mehr-amazon-kaeufe-ohne-werbeseite
status: entschieden
option: Alle vier Maßnahmen, Direktlink über Brave ausbauen
datum: 2026-11-24
umgesetzt: offen
---
1. Nach dem Reservieren bietet der Hinweis „Wo es das gibt“ an und öffnet den Wunsch mit seinen Shop-Links. In der eigenen Wunschansicht steht eine ruhige Zeile „Wenn du es gleich besorgen möchtest, findest du es bei Amazon (Anzeige) oder in einem Laden deiner Wahl“.
2. Genaue Produkt-Wünsche ohne Link bekommen im Hintergrund den direkten Amazon-Produktlink (`src/lib/amzfill.js`): nach dem Speichern, nach dem Wunschzettel und einmal je Profil für ältere Wünsche. `amazonDirect` sucht zuerst mit `site:amazon.de`, danach mit „<Produkt> amazon.de“. Nie über einen selbst gesetzten Link, jeder Titel nur einmal je Browser, beim neuen Wunsch mit „Rückgängig“.
3. Der Link-Hinweis im Wunschdialog sagt neutral, dass Freunde mit Link genau das Richtige finden.
4. Klicks auf Partner-Links zählen als `shop_click` mit Shop, Ansicht und Stelle, nie mit Produkt. Datenschutz Abschnitt 8 ergänzt.
