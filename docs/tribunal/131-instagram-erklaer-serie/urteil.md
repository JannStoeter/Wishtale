---
topic: 131-instagram-erklaer-serie
status: entschieden
option: umsetzen
datum: 2026-11-25
umgesetzt: 55a7c24
---
**Jann im Projekt:** Fertige Reels, Karussells und Storys im Instagram-Studio des CMS, die erklären, wie Wishtale funktioniert.

Umsetzung: Neue Folienart „App-Ansicht (Handy)“ (`src/admin/scenes.js`, auf dem Canvas gezeichnet, keine Bildschirmfotos, nur Beispielnamen, nur echte Funktionen) mit zwölf Szenen (Wunschliste, Link im Chat, Gastansicht, reserviert, Sicht der beschenkten Person, Suche, Link eintragen, Ideen von Wishtale, Kind-Konto, Wunschzettel, Kinderliste im Familienchat, Geschmack). Elf neue Ideen in `src/admin/ideas.js`: vier Reels, vier Karussells (davon einer „Hinter Wishtale“ mit Platzhaltern), drei Story-Folgen. Veröffentlicht wird nichts automatisch.

Nachtrag (Jann, 25.11.2026): „Bei Vorschau Gäste müssen wir eine slide haben dass es direkt im Shop gekauft werden kann“. Neue Szene `kaufen` in `k-gaeste` und `r-reservieren`.

Nachtrag (Jann, 25.11.2026): Plan „Wishtale für Kinder“ eingearbeitet, zehn weitere Ideen mit Kinder-Schwerpunkt, Gründer-Beitrag „Ihr habt gefragt, ich habe es gebaut“, Highlight-Storys.

Nachtrag (Jann, 26.11.2026): „Wir sollten am Ende des Karussels oder der Reels immer irgendwie einen Link haben, auch wenn nur in der Beschreibung“. Jede Bildunterschrift nennt wishtale.de (`withSiteLink()`, auch serverseitig beim Veröffentlichen), Beiträge und Reels enden mit der Abschlussfolie samt Adresse.

Nachtrag (Jann, 27.11.2026): „In der Story "Story: Wunschzettel fürs Kind" brauchen wir eine Folie mit einem Handy was einen Zettel abfotografiert, damit man deutlicher erkennt, dass es ums fotografieren geht“. Neue Szene `kamera` (Kamerabild mit Zettel, Fokusrahmen und Auslöser, `drawCamera()` in `src/admin/scenes.js`) als erste Folie in `s-kind`, danach die bisherige Szene `zettel`.
