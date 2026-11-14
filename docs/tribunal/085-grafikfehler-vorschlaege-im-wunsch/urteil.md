---
topic: 085-grafikfehler-vorschlaege-im-wunsch
status: entschieden
option: Anweisung
datum: 2026-11-14
umgesetzt: PENDING
---
**Ursache:** Bei den „Vorschlägen von Wishtale“ im Wunsch-Fenster standen die Knöpfe auf Handys in einer einzigen Zeile (`.aivar .oa` mit `grid-auto-flow: column`, kein Umbruch). Seit „Habe ich schon“ dazugekommen ist, waren es vier Knöpfe nebeneinander, die Zeile wurde breiter als der Bildschirm und das ganze Fenster mit.
**Behoben (`src/styles/main.css`):** Auf Handys stehen die Knöpfe untereinander und dürfen umbrechen, die Spalte hat `minmax(0, 1fr)`. Mit Playwright bei 390 px nachgestellt (zwei Vorschläge mit vier Knöpfen): Dokument und Fenster sind 390 px breit, kein waagerechter Balken, alle Knöpfe lesbar.
