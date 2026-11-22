---
topic: 105-geteilte-links-zaehlen
status: entschieden
option: Zählung über die Gastansicht, Karte im CMS
datum: 2026-11-22
umgesetzt: 49fd530505ae1a19a4b22eef15c35f8f9b1f6232
---
Der geteilte Link `wishtale.de/w/<kürzel>` leitet jetzt mit einer kleinen Markierung (`?via=link`) zur Gastansicht. Die Gastansicht meldet den Aufruf wie bisher als „Wunschliste als Gast angesehen“, nur mit dem Zusatz „über geteilten Link“, und entfernt die Markierung danach aus der Adresse, damit sie nicht weitergegeben wird. Gezählt wird im Browser und nicht auf dem Server, weil die Vorschauseite beim CDN zwischengespeichert ist und Messenger sie für die Vorschau selbst abrufen; beides würde die Zahl verfälschen.

Im CMS unter „Auswertung“ zeigt die Karte „Geteilte Links“: wie oft geöffnet, von wie vielen verschiedenen Menschen (je Tag gezählt), wie viele davon am Handy, alle Gastaufrufe zum Vergleich und einen Verlauf je Tag. Grundlage ist `admin_usage_devices()` in der neuen Fassung aus Migration `0030` (eingespielt). Links, die vor dem 22.11.2026 geteilt wurden, laufen ohne Markierung und zählen nur bei allen Gastaufrufen.

Geprüft: ESLint, Build, Playwright (Aufruf mit Markierung meldet `label: link` und räumt die Adresse auf, direkter Aufruf ohne Zusatz, CMS-Karte mit Beispieldaten). Datenschutz Abschnitt 8 ergänzt.
