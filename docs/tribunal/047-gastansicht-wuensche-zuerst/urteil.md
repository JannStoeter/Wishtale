---
topic: 047-gastansicht-wuensche-zuerst
status: entschieden
option: A
datum: 2026-11-13
umgesetzt: 9db59dc
---
**Janns Entscheidung im Chat: „A Bau es“.** Claude und ChatGPT empfahlen beide A mit Janns Nachträgen. Umgesetzt in `src/views/giver.js`:
- Kompakter Kopf mit Name und einer Geschmackszeile („Jonas liebt Kaffee brühen, Kochen und Einrichten.“), ohne Preisrahmen, ohne „Bitte nicht“, ohne langen Text.
- Direkt danach „Was Jonas sich wünscht“, ohne Preisrahmen.
- Danach „Nicht das Passende dabei? Wir empfehlen außerdem“ mit Preisrahmen (gilt nur für die Vorschläge), „Bitte nicht“ und „Hat schon“, den Ideen von Wishtale und erst dann „Eigene Idee prüfen“.
- Ohne offene Wünsche beginnt die Seite mit „Jonas lässt sich noch inspirieren, hier findest du unsere Tipps“.
- „Mehr über Jonas“ (Über, Interessen, Lieblingsmarken, Inspiration, Möchte ausprobieren, Welten, Gutscheine) steht am Desktop rechts, auf dem Handy aufklappbar am Ende.

Gemessen mit simulierten Daten: Auf dem Handy (390 × 844) beginnt die erste Wunschkarte bei 441 statt 1.087 Pixeln und ist auf dem ersten Bildschirm zu sehen, am Desktop bei 361 statt 659. Automatische Barrierefreiheitsprüfung (axe) bei 390 und 1280 Pixeln ohne Befund. Die Vorschau „So sehen Schenkende es“ nutzt dieselbe Ansicht.

Nicht umgesetzt, als Folge möglich: die Zeile „passt zu …“ an einzelnen Wünschen und ein Ereignis „Wunsch geöffnet“ zum Messen (braucht einen Satz in der Datenschutzerklärung).
