---
topic: 053-wunsch-dialog-erkennung
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: 2a439a9
---
**Umgesetzt** (Commit 2a439a9):
- Neuer Op `mode=match` in `api/ideas.js` (keine neue Server-Funktion), Logik in `api/_lib/match.js`: Haiku ohne Nachdenken, nur der eingetippte Text geht raus, Antwort mit Titel, üblichem Preis, Suchbegriff und Sicherheit. Schwelle `MATCH_MIN = 0.75`. Nur für die angemeldete Person selbst, zählt als `ideas.wish`, Limits und Zwischenspeicher wie bei den Ideen.
- `src/views/wishprev.js` (`WishRec`): Zustände vague, loading, found, alts, none. Konkret heißt ab drei Wörtern oder mit Zahl (`concrete()`), sonst gibt es gar keinen Aufruf.
- `src/actions.js`: `previewWish` erkennt statt Vorschläge zu laden; „Einlesen“ (Shop-Link, Amazon-Link, kopierter Titel) erzeugt nur noch eine Karte und füllt das Namensfeld nicht mehr selbst; `wraccept`, `wrreject`, `wrpick` übernehmen Name, Preis und Bild erst nach Klick. Ein selbst gewähltes Foto wird nicht ersetzt.
- Datenmodell unverändert.

Live gemessen (Jonas-Testkonto, echtes Modell, je etwa 2 Sekunden): „Toni Figur“ 0,3 → Hinweis; „Toni Figur Igel Herbstlieder“ 0,5 → Hinweis (das Modell ist nicht sicher, dass es die Figur gibt); „Apple AirPods Pro 3“ 0,85 → Karte; „LEGO Technic Bagger 42121“ 0,9 → Karte; „Blauer Becher mit Punkten“ 0,2 → Hinweis; „Hoffmann Hochrandpfanne STONIQ 24 cm“ 0,2 → Hinweis (kleine Marke, dem Modell unbekannt, hier hilft der Shop-Link).
Playwright mit simulierten Antworten (390 und 1280 px): alle Zustände, Speichern während des Ladens, Escape und X, keine horizontale Scrollleiste, axe ohne Befund.

Offen: Ohne `BRAVE_SEARCH_API_KEY` haben erkannte Produkte aus Text kein Bild (Monogramm), Bilder kommen nur aus Shop-Links. Der Preis aus der Erkennung ist ein üblicher Preis („ca.“), kein Live-Preis.
