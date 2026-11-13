---
topic: 082-geschmack-schaerfen-mit-karten
status: entschieden
option: A
datum: 2026-11-13
umgesetzt: 422106e
---
**Janns Urteil im Chat (Wortlaut): „Ja, 82 ist frei. Achte darauf, dass Wortstämme/Kategorien nicht ausschließen, sondern nur die Idee. Die Vorschläge bei mir kommen raus. Wie willst du die Karten bauen? Sie können ja nicht immer gleich sein?!“** Dazu eine Ergänzung aus dem Gespräch mit ChatGPT: Karten müssen konkret sein (eine bestimmte gerippte Wollmütze in Dunkelgrün, nicht „Mützen“). „Gefällt mir“ und „Nicht mein Geschmack“ bewerten, „Besitze ich bereits“ ist eine zusätzliche, unabhängige Angabe und gibt es nur bei konkreten Karten (bei Stilkarten nicht). Regel für Empfehlungen: dasselbe Produkt vermeiden, ähnliche passende weiter vorschlagen. „Davon möchte ich grundsätzlich nichts mehr“ ist eine eigene, bewusst gewählte Einschränkung im Profil (No-Gos).

**Umgesetzt von Claude:**
- **Ideen unter den eigenen Wünschen entfernt** (Überraschung). Stattdessen eine ruhige Zeile „Geschmack schärfen“, solange weniger als zehn Karten beantwortet sind. Gast-Ideen werden für die eigene Ansicht nicht mehr vorgeladen, nur noch in der Vorschau.
- **Neue Seite `#geschmack`** (Menü, Gruppe „Für dich“): Themenauswahl, Runden zu zehn Karten, je Karte Bild (eigene Fotos und Illustrationen), Titel mit Merkmalen, eine Zeile Beschreibung, „Gefällt mir“, „Nicht mein Geschmack“, bei konkreten Karten „Genau das habe ich schon“, „Überspringen“, „Rückgängig“, „Fertig für heute“. Kein Autostart der nächsten Runde. „Meine Antworten“ zum Ändern, Entfernen und Zurücksetzen. Kind-Konten sehen vorerst nur einen Hinweis.
- **Karten (`src/data/cards.js`, 51 Stück, 11 Themen):** fest und geprüft, 40 konkret, 11 als Richtung oder Erlebnis. Jede Runde zeigt nur noch unbeantwortete Karten, reihum über die Themen und je Runde anders gemischt. Sind alle beantwortet, kommt ein Hinweis, dass neue Karten dazukommen.
- **Speicherung:** Tabelle `taste_cards` (Migration `0028`, angewendet): je Profil und Karte eine Zeile, Bewertung und Besitz getrennt, nur die verwaltende Person (can_manage). Ohne Konto in localStorage.
- **Ideen-Logik (`api/_lib/ideas.js`):** Rückmeldungen („Passt nicht“, „Habe ich schon“), Karten, vorhandene Dinge und eigene Wünsche schließen nur noch dieselbe Idee oder dasselbe Produkt aus (alle Wörter müssen vorkommen, `covers()`), keine Wortstämme und keine Kategorien mehr. Ausdrückliche No-Gos der Person bleiben streng. Die KI bekommt die Karten als Geschmack (`karten_gefaellt`, `karten_gefaellt_nicht`, `karten_hat_schon`), die Anweisung sagt ausdrücklich, dass Besitz und Gefallen unabhängig sind. Mit einem Node-Test geprüft (Kaffeemühle wird ausgeschlossen, Kaffeebohnen bleiben; Sauerteig-Set raus, Brotbackbuch bleibt; andere Mütze bleibt; Pfannenwender bleibt).
- Datenschutz Abschnitt 11 und Rundgang ergänzt.
Getestet mit Playwright (390 px, Konto simuliert): Hinweis, Seite, Runde, Antworten gespeichert (Aufruf an taste_cards), Rückgängig, Ende, Menü, axe ohne Befund. Nicht getestet: echtes Gerät, KI mit echten Antworten.

**Noch offen (zweiter Schritt):** Kinderkarten nach Alter, mehr Karten per CMS-Entwurf mit Prüfung, Auswertung des Lerneffekts, die neue Logik bei der Kartenauswahl nach Interessen gewichten.
