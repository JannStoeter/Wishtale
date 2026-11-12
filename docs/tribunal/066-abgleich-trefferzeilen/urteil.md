---
topic: 066-abgleich-trefferzeilen
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: 3e975bc
---
**Ursache** (aus dem Vercel-Log `match-web`): Die Websuche fand die richtigen Treffer (idealo, Amazon, Otto, Hoffmann). Wishtale hat aber nur Herstellerseiten gelesen, und die ersten drei waren eine Kategorieseite, ein 24+28-cm-Set und die Pfanne in 24 cm. Händler und Preisvergleiche waren als Beleg ausgeschlossen, und die Größe 28 stand in keinem gelesenen Titel.
**Umgesetzt** (`api/_lib/match.js`, `api/_lib/imgsearch.js`): Zusätzlich zur Herstellerseite zählt jetzt die Trefferzeile der Suchmaschine (Titel und Beschreibung, keine Seite wird geladen) auch von Händlern und Preisvergleichen als Beleg. Der Titel muss zum Wunsch passen (Zahlen vollständig), Sets zählen nur, wenn der Wunsch ein Set ist, knappe Titel gewinnen, und Shopnamen, Preise und „Amazon.de:“ werden abgeschnitten. Ein Treffer aus der Websuche gilt nur, wenn der Wunsch eine Zahl enthält oder das Modell selbst ein bestimmtes Produkt vermutet (damit „Blauer Becher mit Punkten“ keine Karte bekommt). Support-, Hilfe- und Blogseiten sind ausgeschlossen, die Bildsuche nimmt nur Seiten, deren Titel zum Produkt passt. Der Zwischenspeicher wurde zurückgesetzt, die Diagnose im Log (`match-web`) bleibt.
Live geprüft: Hoffmann 28 cm Induktion liefert „Hoffmann Germany Bratpfanne STONIQ PFAS-frei Ø 28 cm hoher Rand“ (otto.de), „Blauer Becher mit Punkten“ bleibt ohne Karte, AirPods Pro 3 liefert „Apple AirPods Pro 3 Weiß“ mit Bild. Offen: Bilder aus Trefferzeilen gibt es nur über die Bildsuche, Preise nur von Herstellerseiten.
