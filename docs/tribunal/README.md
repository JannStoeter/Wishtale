# Tribunal: Entscheidungen mit Claude, ChatGPT und Jann

Dieses Verzeichnis ist der Eingang für die Entwickler-Seite (`/dev/`, nur für Admins). Jede Entscheidung hat einen Ordner. Beide KIs legen dort unabhängig voneinander ihre Position ab, Jann liest sie nebeneinander und entscheidet auf der Seite. Die Entscheidung steht danach in der Datenbank (`tribunal_verdicts`), nicht in den Dateien.

## Ordner und Dateien

```
docs/tribunal/<nummer>-<kurzname>/
  frage.md        die Frage mit Optionen (legt an, wer die Frage stellt)
  claude.md       Position von Claude
  chatgpt.md      Position von ChatGPT
  claude-2.md     optional, zweite Runde nach einer Rückfrage (ebenso chatgpt-2.md)
```

Nummer ist dreistellig und fortlaufend (`004-…`). Kurzname in Kleinbuchstaben mit Bindestrichen.

## frage.md

```
---
titel: Kurze Frage als Titel
art: entscheidung        # entscheidung oder befund
status: offen            # offen, entschieden oder vertagt (die Seite zeigt Janns Entscheidung aus der Datenbank, das Feld hier ist nur der Startwert)
optionen: A=Erste Möglichkeit | B=Zweite Möglichkeit | C=Dritte Möglichkeit
erstellt: 2026-11-09
von: claude              # claude, chatgpt oder jann
---
## Kontext
Was ist die Lage, was ist schon entschieden, welche Zahlen gibt es?

## Frage
Was genau soll entschieden werden?
```

## Position (claude.md, chatgpt.md)

```
---
autor: claude            # claude oder chatgpt
datum: 2026-11-09
empfehlung: B            # Schlüssel einer Option oder „keine“
sicherheit: mittel       # hoch, mittel oder niedrig
aufwand: klein           # klein, mittel oder groß
kosten: einmalig 0 €, laufend gering
---
## Begründung
Warum diese Option? Belege nennen (Dateien, Zahlen, Quellen mit Link).

## Risiken
Was kann schiefgehen, was wissen wir nicht?

## Gegenargument
Das stärkste Argument gegen die eigene Empfehlung, ehrlich formuliert.
```

## Regeln

1. **Unabhängig:** Lies die Position der anderen KI erst, nachdem du deine abgelegt hast. Ein Widerspruch ist erwünscht, kein Fehler.
2. **Ehrlich:** Trenne Belegtes, Vermutetes und nicht Geprüftes. Wenn du etwas nicht getestet hast, schreibe es.
3. **Kurz:** Eine Position passt auf eine Bildschirmseite. Keine Wiederholung der Frage.
4. **Markdown:** Erlaubt sind Überschriften (`##`, `###`), Listen, `**fett**`, `` `code` ``, Zitate (`>`) und Links mit http(s).
5. **Keine Geheimnisse:** Keine Schlüssel, Tokens oder personenbezogenen Daten in diese Dateien.
6. **Nur eigene Dateien ändern:** Claude schreibt `claude*.md`, ChatGPT schreibt `chatgpt*.md`. Fragen legt jeder in einem neuen Ordner an.
7. **Rückfragen:** Jann kann auf der Seite einen Prompt für die zweite Runde kopieren. Die Antwort kommt als `…-2.md`.

Nach dem Schreiben committen und pushen. Die Seite zeigt den neuen Stand nach dem nächsten Deploy.
