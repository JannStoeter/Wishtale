---
topic: 068-amazon-direktlink-englische-titel
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: e4b1709
---
**Ursache** (Vercel-Log `amazon-direkt`): Die Websuche fand sechs Amazon-Produktseiten zum Shark-Staubsauger, aber mit englischen Titeln („Shark PowerDetect Clean & Empty Cordless Vacuum Cleaner …“). Der Wunsch war deutsch („Akku-Staubsauger für Tierhaare“), die Wortübereinstimmung lag bei 50 Prozent, darunter verlinken wir nicht. Nicht die Zahl der Angebote war das Problem.
**Umgesetzt** (`api/_lib/imgsearch.js`, `src/actions.js`, `src/views/wishmodal.js`): Passt kein Titel fast wörtlich (85 Prozent), wählt ein kurzer Modellaufruf (Sonnet, ohne Nachdenken) aus den bis zu sechs Amazon-Treffern den, der genau denselben Artikel meint, Sprache egal, Namen, Tiere, Farben, Zahlen und Größen müssen übersetzt übereinstimmen, im Zweifel keiner. Mit dem kleinen Modell kam beim Schlummerwal fälschlich das Schlummerschaf heraus, darum das größere Modell. Neu im Wunsch-Detail der eigenen Liste: Knopf „Direkten Amazon-Link suchen“ für bestehende Wünsche ohne Link, mit „Rückgängig“.
Live geprüft: Shark → „Shark PowerDetect Clean & Empty Cordless Vacuum Cleaner for Pet Hair“ (B0FJG5P545), AirPods Pro 3 → B0FQF32239, Schlummerschaf → richtiges Angebot, Schlummerwal → kein Treffer (kein Wal-Angebot in den Treffern, bewusst kein Link).
**Partner-Kennung:** Der Suchlink (`https://www.amazon.de/s?k=…&tag=jannst-21`) und der Direktlink (`/dp/<ASIN>?tag=jannst-21`) tragen beide die Kennung, die im Wunsch-Detail angezeigten Links wurden geprüft. Wie Amazon Käufe nach einem Klick auf einen Suchlink zuordnet, lässt sich aus dem Code nicht beweisen; der Partnerbericht nach Tracking-ID zeigt es. Der Direktlink spart dem Besucher den Umweg.
