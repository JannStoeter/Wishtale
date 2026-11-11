---
titel: Gast-Ansicht: Wünsche zuerst und das Profil als Würze, Fokus auf das Schenken?
art: entscheidung
status: offen
optionen: A=Wünsche zuerst: kompakter Kopf (Name, eine Zeile Geschmack, „Bitte nicht“, Preisrahmen), direkt danach die Wunschliste, das ausführliche Profil weiter unten | B=Schenk-Assistent: die Seite führt Schenkende durch Preisrahmen, Wünsche und Ideen, Profilangaben erscheinen nur als Begründung an den Wünschen und Ideen | C=Reiter (Wünsche, Über die Person, Ideen) | D=So lassen wie heute
erstellt: 2026-11-13
von: jann
---
## Kontext
Auftrag von Jann (2026-11-13, Wortlaut): „Stelle noch eine Design Entscheidung ins Tribunal: Design in der App. Ist es richtig, dass in der Gastansicht das Profil und die Interessen oben als erstes stehen und dann erst die Wünsche? Auf dem Handy sieht man die Wünsche erst nach dem Scrollen – eigentlich sollen doch die Wünsche im Vordergrund stehen und die Infos aus dem Profil es ergänzen, würzen – oder hin, denke darüber nach, den Fokus auf das Schenken zu verlagern. Gehe das einmal durch und lass Chatty das auch tun.“

Heutiger Aufbau der Gast-Ansicht (`src/views/giver.js`, `GuestPage()`): Profilkopf mit Name, „Über …“-Text, Interessen, Lieblingsmarken, „Bitte nicht“ und Preisrahmen (`ProfileHead()`), danach die aufklappbare Leiste „Mehr über …“ (`Facts()`: Hat schon, Inspiration, Welten, Gutscheine), danach die Wunschliste, dann die KI-Ideen („Vorschläge von Wishtale“), „Eigene Idee prüfen“ und der Hinweis zu Partnerlinks.

Gemessen am 2026-11-13 auf wishtale.de mit dem Beispielprofil Jonas (Handy 390 × 844 Pixel): Der Profilkopf beginnt bei 101 Pixel, die Überschrift der Wunschliste bei 918, die erste Wunschkarte bei 1.087. Auf dem ersten Bildschirm (844 Pixel) ist also kein einziger Wunsch zu sehen, man muss etwa eineinhalb Bildschirme scrollen. Die KI-Ideen beginnen bei 2.790 von 3.630 Pixeln. Am Desktop (1280 × 820) ist die erste Wunschkarte bei 659 Pixeln gerade noch angeschnitten sichtbar, weil die Leiste rechts daneben steht.

## Frage
Was soll ein Gast als Erstes sehen, und wie viel Profil braucht es dafür?
