---
topic: 103-optische-befunde
status: entschieden
option: Punkte 4 bis 9 aus Claudes Liste
datum: 2026-11-22
umgesetzt: af0d97ed63a1481b14a1eca1edba984a3ecefc7a
---
Umgesetzt:
- Unterzeile bei Wünschen ohne Link: „Wishtale hat 3 Ideen dazu“, „Wishtale hat eine Idee dazu“ oder „Ohne Link, Wishtale hat Ideen dazu“ statt abgeschnittener Produktnamen wie „Tipp von Wishtale: Bilderbuch-Sa…“.
- Bilder: Der Schlüssel für die Bildersuche ist in Vercel eingetragen, hier war nichts zu ändern.
- Landingpage und Rechtsseiten haben jetzt dieselbe helle Farbwelt wie die App, die vier App-Bilder der Landingpage sind neu aufgenommen.
- Band „Jetzt neu: Einfach Wunschliste hochladen“ hat ein ×, und es verschwindet dauerhaft, sobald man es benutzt oder wegklickt. Den Wunschzettel gibt es danach im Wunschdialog („Schon eine ganze Liste?“) und im Menü („Wunschzettel hochladen“).
- Profil am Handy: Neben der Weltkugel steht jetzt ein Kurzwort („Für alle“, „Privat“), Stift und Sichtbarkeit bleiben in einer Zeile.
- Gastansicht: Der Sprung zu den Ideen ist ein sichtbarer Knopf („Ideen von Wishtale für Mia ansehen“). In der eigenen Vorschau „So sehen es deine Freunde“ erscheinen die Reservieren-Knöpfe mit, ein Tipp erklärt nur, was Freunde damit tun.

Geprüft: ESLint, Build, Playwright bei 390 px (Band wegklicken und nach Neuladen weg, Wunschzettel im Dialog und Menü, Profil, Gastansicht, Landingpage), axe (WCAG 2 AA) ohne Befund auf Wunschliste, Profil und Landingpage. Nicht geprüft: echtes Gerät.
