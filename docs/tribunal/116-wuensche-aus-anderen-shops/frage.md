---
titel: Wie kommen Wünsche aus anderen Shops so leicht zu Wishtale wie bei Wishbob?
art: entscheidung
status: offen
optionen: A=iOS-Kurzbefehl und Lesezeichen-Knopf | B=Browser-Erweiterung für Chrome, Edge und Firefox | C=Store-App mit Teilen-Erweiterung (Hülle um die Web-App) | D=Erst A, dann B, C nach dem Launch je nach Zahlen
erstellt: 2026-11-25
von: jann
---
## Kontext
Wortlaut von Jann im Projekt-Thread (2026-11-25):

> Beim einfügen von links müssen wir uns an wishbob etc. aufschließen . 1-4 schnell umsetzen 5 müssen wir schauen wie wir das hinkriegen und welche Optionen wir haben.

Punkt 5 aus dem Wettbewerbsvergleich: Wünsche aus anderen Shops so leicht hinzufügen wie bei Wishbob. Heute geht es über „Link einfügen“ im Wunschdialog und auf Android in der installierten App über „Teilen an Wishtale“ (`share_target`, Dev 095/096, `takeShare()` in `src/lib/pwa.js`). Safari auf dem iPhone kennt für Web-Apps kein Teilen-Ziel (WebKit-Bug 194593 ist offen).

Was andere anbieten (App-Store- und Erweiterungsseiten, gelesen 2026-11-25):
- Wishbob: iOS-App (4,7 Sterne, 219 Bewertungen) mit eigenem „Shop-Browser“ und „Wishbob Button“, Erweiterung für Chrome (rund 2.000 Nutzer) und Firefox (rund 140 Nutzer).
- Giftful: App mit Teilen-Knopf im Browser und Safari-Erweiterung, Chrome-Erweiterung.
- Moonsift: App, Sichern aus Websites und Shopping-Apps über Teilen, Chrome-Erweiterung.

## Frage
Welchen Weg geht Wishtale, und in welcher Reihenfolge?
