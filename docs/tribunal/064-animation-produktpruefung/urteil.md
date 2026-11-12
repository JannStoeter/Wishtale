---
topic: 064-animation-produktpruefung
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: b4fd258
---
**Umgesetzt** (`src/views/wishprev.js`, `src/styles/main.css`): Während Wishtale das Produkt prüft (und Alternativen sucht), wandert eine Lupe über das Bildfeld, ein Glanz läuft über die Karte, und die Schritte „Name prüfen“, „Im Netz suchen“, „Titel, Preis und Bild vergleichen“ erscheinen nacheinander mit Haken. Bei reduzierter Bewegung (Systemeinstellung) steht alles ohne Animation da. Geprüft mit Playwright und axe, ohne Befund.
