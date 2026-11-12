---
topic: 061-erkennung-beim-tippen
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: 8be6c14
---
**Umgesetzt** (`src/actions.js`, `src/views/wishprev.js`, `src/views/modals.js`, `api/_lib/match.js`, `api/_lib/imgsearch.js`):
- Die Erkennung startet im Namensfeld beim Tippen (nach 0,8 Sekunden Pause) und beim Einfügen (nach 0,15 Sekunden), nicht mehr erst beim Verlassen des Feldes. Der Platzhalter „Wishtale schaut, welches Produkt du meinst …“ erscheint damit sofort. Ein zweites Feld ist nicht mehr nötig: Ein Link im Namensfeld wandert von selbst ins Link-Feld und wird gelesen, ein kopierter Titel wird direkt dort erkannt. Das Link-Feld heißt jetzt „Link zum Produkt“.
- Websuche: Neben dem Modell sucht Wishtale per Brave nach dem Wunsch, liest die ersten Treffer ohne Marktplätze (Titel, Preis, Bild) und nimmt die Seite, deren Titel zum Wunsch passt (mindestens 70 Prozent der Wörter, alle Zahlen). Die Karte nennt die Quelle („gefunden bei …“). Live geprüft: „SIKU Claas Lexion 600 Mähdrescher“ liefert Titel, 34,95 Euro und Bild von einem Händler.
- Ehrliche Rückmeldung: Findet die Suche nichts Sicheres, steht dort „Wir haben dazu kein sicheres Produkt gefunden. Das ist in Ordnung: Dein Wunsch bleibt, wie du ihn geschrieben hast, und deine Freunde sehen dazu passende Ideen von Wishtale. Mit dem Link zu einem Shop wird er genauer.“ Bei einem Fehler der Suche steht dort „Die Produktsuche hat gerade nicht geklappt“. Misserfolge werden nicht zwischengespeichert.
- „Der Wunsch steht schon auf deiner Liste“ erscheint, wenn ein gleicher Wunsch (gleicher Link oder fast gleicher Titel) schon offen ist; der zweite Klick auf Speichern legt ihn trotzdem an. Wahrscheinlich war der SIKU-Wunsch bei einem früheren Versuch schon gespeichert worden. Bei weiterem Verdacht bitte die Wunschliste prüfen.
Kosten: pro erkanntem Wunsch eine Brave-Abfrage (5-Dollar-Guthaben, etwa 1.000 Abfragen).
