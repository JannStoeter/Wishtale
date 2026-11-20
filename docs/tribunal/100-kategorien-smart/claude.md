---
autor: claude
datum: 2026-11-20
empfehlung: A, danach B prüfen
---
# Position von Claude

## Stand heute
Es gibt elf feste Kategorien (`CATS` in `src/data/content.js`). Zugeordnet wird über eine Wortliste (`guessCategory()` in `src/lib/category.js`), die der Reihe nach Begriffe wie „Pfanne“ oder „Kopfhörer“ sucht. Passt nichts, landet der Wunsch in „Wohnen & Interior“. Nur wenn die Produkterkennung im Wunschdialog greift, schlägt die KI eine Kategorie vor. Die Kategorien steuern Filter, Farbe und Bild des Platzhalters, den Katalog und die Gewichtung im CMS.

Stichprobe in der Datenbank (echte Konten, ohne Inhalte anzusehen): Von 34 Wünschen stehen 14 in „Wohnen“, aber nur 2 davon enthalten typische Wohnbegriffe. „Wohnen“ ist also vor allem ein Sammelbecken für alles, was die Wortliste nicht kennt.

## Optionen
**A: Feste Liste, aber klug zugeordnet.** Beim Speichern ordnet das leichte Modell (Haiku) den Wunsch einer Kategorie zu, die Wortliste bleibt als schneller Ersatz ohne KI. Statt „Wohnen“ fängt eine ehrliche Kategorie „Sonstiges“ auf. Die Liste wird um häufige Lücken ergänzt, etwa Beauty und Pflege, Garten, Musik, Haustier und Baby. Bestehende Wünsche werden einmal neu zugeordnet, manuelle Wahl bleibt immer erhalten. Kosten: ein sehr kurzer Aufruf je neuem Wunsch, nur wenn die Wortliste unsicher ist; über `idea_cache` und die Missbrauchsgrenzen abgesichert.

**B: Eigene, wachsende Gruppen je Person.** Sammeln sich bei einer Person mehrere Wünsche zu einem Thema (zum Beispiel fünf Dinge rund um Kaffee), schlägt Wishtale eine eigene Gruppe vor („Kaffee“), die nur in dieser Wunschliste erscheint. Die feste Kategorie bleibt darunter für Katalog, Farben und Gewichtung bestehen. Das ist näher an deiner Idee, braucht aber ein neues Feld in der Datenbank, eine Bestätigung durch die Person und Regeln, wann Gruppen entstehen und verschwinden.

**C: Völlig freie Kategorien.** Die KI erfindet Kategorien frei. Nicht empfohlen: Katalog, Filter, Farben und Gewichtung hängen an festen Kategorien, und für Gäste würde es uneinheitlich.

## Empfehlung
A jetzt, weil es das eigentliche Problem löst (fast alles landet in „Wohnen“) und klein und günstig ist. B danach als Erweiterung, wenn genug Wünsche je Person da sind, dass Gruppen sinnvoll werden.
