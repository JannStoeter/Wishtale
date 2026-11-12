---
topic: 073-inspiration-ausblenden-und-entwicklermodus
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: PENDING
---
Die Seite „Inspiration“ ist ausgeblendet (Navigation oben und unten, Adresse `#entdecken` führt zu den Wünschen, kein Vorladen der KI-Ideen für die eigene Inspiration). Kern bleiben die Vorschläge für Schenkende. Entwicklermodus: `src/lib/flags.js` (`devMode()`, `worldsOn()`, `inspirationOn()`), Schalter unter `/dev/#entwickler` („Entwicklermodus“ in der Seitenleiste, Gruppe Hilfe), gespeichert nur im Browser unter `wishtale:devmode` und damit für `/dev/` und `/app/` gültig. Solange er an ist, zeigt die App oben das Zeichen „Entwicklermodus“ und blendet Inspiration und Welten (072) wieder ein. Der Schalter gibt keine Rechte. Neue ruhende Bereiche gehören in `flags.js` und in die Liste auf der Dev-Seite. Getestet mit Playwright (aus: Weiterleitung und drei Navigationspunkte, an: Inspiration und Zeichen sichtbar).
