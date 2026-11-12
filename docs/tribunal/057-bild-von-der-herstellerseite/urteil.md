---
topic: 057-bild-von-der-herstellerseite
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: f97b13c
---
**Umgesetzt** (`api/_lib/imgsearch.js`, `api/inspect.js`): Für Wünsche ohne Bild sucht Wishtale zuerst per Websuche nach dem Produktnamen, nimmt den ersten Treffer, der kein Marktplatz und kein Preisvergleich ist (Seiten mit der Marke in der Adresse zuerst, zum Beispiel tonies.com), liest dort wie bei „Link lesen“ das Produktbild (og:image) und lädt es über den bestehenden SSRF-Schutz. Erst wenn das nichts bringt, greift die Bildersuche.

Wie bisher läuft das nur mit `BRAVE_SEARCH_API_KEY` in Vercel (Entscheidung offen in 027). Brave hat das Gratis-Kontingent laut Preisvergleichsseiten 2026 durch ein monatliches Guthaben von 5 Dollar ersetzt (etwa 1.000 Abfragen), danach etwa 5 Dollar je 1.000; vor dem Eintragen auf der offiziellen Preisseite prüfen. Eine Suche fällt nur einmal beim Anlegen eines Wunsches an, das Bild liegt danach bei uns.

Getestet mit simulierten Suchantworten (Marktplätze fallen raus, Markenseite zuerst). Echte Shopseiten konnten aus der Entwicklungsumgebung nicht abgerufen werden, das muss nach dem Eintragen des Schlüssels einmal live geprüft werden.
