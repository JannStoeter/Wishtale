---
topic: 134-link-namen-bilder-preise
status: entschieden
option: umsetzen
datum: 2026-11-26
umgesetzt: a7435b8
---
**Jann im Projekt:** Namen, Bilder und Preise bei Links sollen stimmen.

Umsetzung: Für Links, die Wishtale nicht lesen kann (Amazon, Seiten mit Lesesperre wie Thalia), sucht der Server den echten Namen über die Suchmaschine zur Produktnummer der Adresse (ASIN oder Artikelnummer, `titleForLink()` in `api/_lib/imgsearch.js`, `op titleFor` in `api/inspect.js`, bei gesperrten Seiten automatisch im normalen Lesen). Nur ein Treffer mit genau dieser Nummer zählt, lange Shop-Titel werden auf den Produktnamen gekürzt (`shortTitle()`), von Amazon kommt nie ein Bild. „Wunsch von <Shop>“ gibt es nicht mehr: ohne Namen bittet der Dialog, kurz einzutragen, was es ist. Ältere Wünsche mit Ersatznamen werden einmal je Profil repariert (`src/lib/namefix.js`), danach kommen Bild und Preis wie bei neuen Wünschen. Der Preis von Amazon selbst bleibt bis zur Creators API außen vor, Wishtale nimmt den Preis anderer Shops als „ca.“.

Nachtrag (Jann, 26.11.2026): „Kannst du nicht den Produkttitel rauskopieren als unseren Titel? Das dann nochmal bei Otto suchen und das Bild nehmen?“ Amazon-Wünsche suchen Bild und Preis zuerst bei Otto (`ottoHit()`, Titel muss eng passen, alle Ziffern gleich), danach wie bisher beim Hersteller. Amazon-Bilder selbst bleiben tabu (Partnerbedingungen). Buchtitel werden nicht mehr an „ - “ gekürzt, zu kurz geratene Namen ergänzt die Reparatur (`wishtale:namefix-v2`).

Nachtrag 2 (Jann, 26.11.2026): „das ist zu ton in ton … Die Bilder sind immer noch so lala“. Vorschläge zum Wunsch stehen jetzt auf der salbeigrünen Fläche mit weißen Karten, Symbol, Preis als Plakette, Hauptknopf „Dieses Produkt übernehmen“ und Shop-Pillen (`AiVariants()`). Bilder: Otto sucht zusätzlich mit Marke und Modellnummer (`modelQuery()`), große Otto-Bilder gehen nicht mehr verloren (Grenze 2,4 MB statt 600 KB), danach eine Bildersuche mit Marke und Modellnummer; neue Versuche (`wishtale:img-tried7`), Schritte im Vercel-Log (`otto-treffer`, `bild-schritte`). Amazon-Bilder: Entscheidung bei Jann (Karte im Chat), bisher nicht umgesetzt.

Nachtrag 3 (Prüfung 26.11.2026, 12:35 Uhr): 6 von 9 offenen Amazon-Wünschen haben ein Bild, darunter die LEGO-Bauplatte. Ohne Bild blieben Wünsche mit eigenem, ungenauem Namen („Messerset“, „OOOONO“). Für sie sucht der Server jetzt zuerst den echten Produktnamen über die ASIN (`realName()`) und damit Bild und Preis. Amazon-Bilder bleiben aus (Jann: erst Umbau abwarten).
