# Tribunal: Entscheidungen mit Claude, ChatGPT und Jann

Dieses Verzeichnis ist der Eingang für die Entwickler-Seite (`/dev/`, nur für Admins). Jede Entscheidung hat einen Ordner. Beide KIs legen dort unabhängig voneinander ihre Position ab, Jann liest sie nebeneinander und entscheidet auf der Seite. Die Entscheidung steht danach in der Datenbank (`tribunal_verdicts`), nicht in den Dateien.

## Ordner und Dateien

```
docs/tribunal/<nummer>-<kurzname>/
  frage.md        die Frage mit Optionen (legt an, wer die Frage stellt)
  claude.md       Position von Claude
  chatgpt.md      Position von ChatGPT
  claude-2.md     optional, zweite Runde nach einer Rückfrage (ebenso chatgpt-2.md)
  urteil.md       Janns Urteil, von Claude beim Abgleich aus der Datenbank gespiegelt
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

## Rollen (wichtig)
- **ChatGPT** schreibt eigene Positionen (`chatgpt.md`, `chatgpt-2.md`), legt auf Wunsch neue Fragen an und darf seit 2026-11-16 (Dev 091) **Freigegebenes bauen und direkt hochladen**, nach den Konventionen in `AGENTS.md`: Ankündigung in `bau.md`, Lint und Build, Eintrag im Log `docs/log/chatgpt.md`. Weitere Sprachmodelle liefern nur Codestrecken auf Bestellung zu (`docs/zulieferung/`).
- **Claude** schreibt `claude*.md`, legt Ordner aus Janns Anfragen an, baut Freigegebenes, prüft beim Abgleich offene Pull Requests von ChatGPT (Lint, Build, Konventionen) und spiegelt Urteile ins Repository. Wer baut, kündigt es in `bau.md` im Ordner an (`von`, `status: in-arbeit`), damit nichts doppelt gebaut wird.
- **Jann** entscheidet. Er kann zu jedem Punkt eine, beide oder keine Meinung einholen.

## So reichst du als ChatGPT eine Position ein
1. Lege einen Branch `tribunal/chatgpt-<nummer>` an (zum Beispiel `tribunal/chatgpt-004`).
2. Schreibe darauf genau eine Datei: `docs/tribunal/<ordner>/chatgpt.md` (zweite Runde: `chatgpt-2.md`).
3. Öffne einen Pull Request nach `main`. Jann übernimmt ihn. Ein Prüf-Workflow (`.github/workflows/tribunal-check.yml`) lehnt Änderungen außerhalb von `chatgpt*.md` und neuen `frage.md` ab.
4. Schreibe nicht direkt in `main`.

## Regeln

0. **Kontext zuerst:** Lies `ENTSCHEIDUNGEN.md`. Janns bisherige Urteile gelten, ein Widerspruch braucht ein neues Tribunal.
1. **Unabhängig:** Lies die Position der anderen KI erst, nachdem du deine abgelegt hast. Ein Widerspruch ist erwünscht, kein Fehler.
2. **Ehrlich:** Trenne Belegtes, Vermutetes und nicht Geprüftes. Wenn du etwas nicht getestet hast, schreibe es.
3. **Kurz:** Eine Position passt auf eine Bildschirmseite. Keine Wiederholung der Frage.
4. **Markdown:** Erlaubt sind Überschriften (`##`, `###`), Listen, `**fett**`, `` `code` ``, Zitate (`>`) und Links mit http(s).
5. **Keine Geheimnisse:** Keine Schlüssel, Tokens oder personenbezogenen Daten in diese Dateien.
6. **Nur eigene Dateien ändern:** Claude schreibt `claude*.md`, ChatGPT schreibt `chatgpt*.md`. Fragen legt jeder in einem neuen Ordner an.
7. **Rückfragen:** Jann kann auf der Seite einen Prompt für die zweite Runde kopieren. Die Antwort kommt als `…-2.md`.

Nach dem Schreiben committen und pushen. Die Seite zeigt den neuen Stand nach dem nächsten Deploy.

## Ablauf rund um die Seite
- **Neue Fragen** von Jann kommen über die Seite („Neue Frage“) in einen Posteingang. Claude legt sie beim Abgleich als Ordner mit `frage.md` an, erst dann sehen alle sie hier im Repository.
- **Urteil und Bauauftrag** stehen in der Datenbank. Die Urteile spiegelt Claude beim Abgleich ins Repository (`urteil.md` im Ordner und die Übersicht `docs/tribunal/ENTSCHEIDUNGEN.md`), damit ChatGPT sie kennt und das Produkt besser versteht. Bauaufträge bleiben nur in der Datenbank. Hat Jann „Zum Bauen freigeben“ gewählt, setzt Claude es beim nächsten Abgleich um und vermerkt Umsetzung und Commit auf der Seite.
- **Wann Tribunal?** Schwer rückgängig, kostet Geld, Recht oder Datenschutz, Architektur oder Geschäftsmodell, oder Jann möchte es. Einfaches klärt Claude direkt mit Jann im Chat.

## Prioritätenlisten
Neben den einzelnen Fragen führen Claude und ChatGPT je eine Prioritätenliste: `docs/tribunal/prioritaeten/claude.md` und `docs/tribunal/prioritaeten/chatgpt.md`. Format: Front matter (`autor`, `datum`), eine Zeile zur Skala und je Punkt eine Zeile `- <nr>: <1-4> | <Grund in einem Satz>` mit 1 = jetzt, 2 = als Nächstes, 3 = später, 4 = Backlog. Unabhängig schreiben, die Liste der anderen KI erst danach lesen. ChatGPT reicht seine Liste wie eine Position über einen Branch `tribunal/chatgpt-prioritaeten` per Pull Request ein. Die Seite „Prioritäten“ auf `/dev/` zeigt beide Listen nebeneinander, Jann legt dort je Punkt die Aktion fest (Jetzt, Als Nächstes, Später, Backlog, Verworfen). Die Aktion steht in der Datenbank (`tribunal_plan`) und ordnet nur, gebaut wird erst nach „Zum Bauen freigeben“ bei der Entscheidung.
