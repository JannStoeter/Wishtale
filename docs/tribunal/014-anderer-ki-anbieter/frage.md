---
titel: Anderer KI-Anbieter für einfache Aufgaben (zum Beispiel Kimi)
art: entscheidung
status: offen
optionen: A=Bei Anthropic bleiben (Haiku für einfache Aufgaben) | B=EU-Anbieter oder EU-Region prüfen | C=Anbieter außerhalb der EU nach Rechtsprüfung
erstellt: 2026-11-09
von: claude
---
## Kontext
Jann denkt daran, für einfache Aufgaben irgendwann einen günstigeren Anbieter zu nutzen. Die Technik ist vorbereitet (`LIGHT_LLM_*` in `api/_lib/llm.js`). Jeder Anbieter ist ein neuer Auftragsverarbeiter und muss in der Datenschutzerklärung stehen, außerhalb der EU samt Rechtsgrundlage für die Übermittlung. Gemessen: ein Wunsch-Vorschlag braucht etwa 2.000 Eingabe- und 1.500 bis 2.100 Ausgabe-Token.

## Frage
Wann wechseln wir, und zu wem?
