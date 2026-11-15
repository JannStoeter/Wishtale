---
topic: 088-ideen-nur-belegte-fakten
status: entschieden
option: Anweisung
datum: 2026-11-15
umgesetzt: PENDING
---
**Behoben:**
- `api/_lib/ideas.js` (Anweisung an die KI, gilt für alle Ideen): Begründungen nennen nur, was wörtlich in den Angaben steht. Aus einer Lieblingsmarke folgt nur „mag die Marke“, nie Besitz oder Nutzung („mag Apple“, nicht „nutzt Apple-Geräte“ oder „arbeitet am Mac“). Zwei Angaben werden nicht zu einer neuen Behauptung verbunden. Hängt eine Idee von Unbekanntem ab (etwa dem Betriebssystem), schlägt die KI eine Variante vor, die unabhängig davon passt. Weil sich die Anweisung ändert, werden die gespeicherten Ideen neu erzeugt.
- `src/views/giver.js`: „Passt nicht“ ist bei den Ideen in der Gastansicht entfernt. Es blendete die Idee nur im Browser des Gastes aus und half beim Lernen nicht. Rückmeldungen gibt die Person selbst über „Geschmack schärfen“ (082), ob Gäste-Rückmeldungen genutzt werden sollen, bleibt Frage 021.
**Offen:** Janns Frage, wie die Empfehlungen grundsätzlich besser werden und ob Vorschläge wieder unter die eigene Liste gehören, beantwortet Claude im Chat. Wenn Jann eine Richtung wählt, bekommt sie einen eigenen Eintrag.
