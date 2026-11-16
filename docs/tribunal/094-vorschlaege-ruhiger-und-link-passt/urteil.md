---
topic: 094-vorschlaege-ruhiger-und-link-passt
status: entschieden
option: Umsetzung wie von Jann im Chat angewiesen
datum: 2026-11-16
umgesetzt: 3839b2dd8abb811d5a6f93a82602de37ce208ad6
---
Eigene Vorschläge unter den Wünschen sind am Handy (bis 560 px) ohne eigene Wahl eingeklappt. Dann steht dort nur eine leise, gestrichelte Zeile „Ideen von Wishtale für dich · Anzeigen“, ein Tipp öffnet sie. Am großen Bildschirm sind sie offen. Das Auge klappt wieder ein, die Wahl bleibt je Profil im Browser.

Die Karten tragen jetzt über den Namen: darunter Art und Preis, die Begründung auf zwei Zeilen gekürzt, die Aktionen als leise Textknöpfe („Auf meine Wunschliste“ in der Akzentfarbe, „Ansehen (Anzeige)“, dann gedämpft „Habe ich schon“ und „Passt nicht“). Die Kennzeichnung als Vorschlag von Wishtale und der Anzeigen-Hinweis bleiben.

Doppeltes „Passt“: Beim Einfügen eines Links las Wishtale ihn sofort, der Klick auf „Passt“ verließ dann das Link-Feld und löste ein zweites Einlesen aus, das die übernommene Karte durch eine neue ersetzte. Jetzt wird derselbe Link je Formular nur einmal automatisch gelesen, der Knopf „Einlesen“ liest weiterhin bewusst neu.

Geprüft: ESLint, Build, Playwright mit angemeldetem Testprofil (Antworten simuliert) bei 390 und 1280 px. Am Handy eingeklappt, nach Tipp drei Karten, Auge klappt ein, nach Neuladen bleibt es eingeklappt, Fokus bleibt auf dem Umschalter. axe (WCAG 2.2 AA) ohne Befund. Alter Stand mit echter Tastatureingabe nachgestellt: zwei Leseaufrufe und „Passt“ ohne Wirkung; neuer Stand: ein Aufruf, ein Klick übernimmt Name und Preis. Nicht geprüft: echtes Gerät und echte KI-Antworten.
