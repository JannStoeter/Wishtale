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
- **ChatGPT führt ausschließlich Dinge rund um das Dev-Tool aus:** eigene Positionen (`chatgpt.md`, `chatgpt-2.md`) und, wenn Jann es möchte, neue Fragen (`frage.md`). ChatGPT nimmt **keine Änderungen am Code, an Konfiguration, Texten oder Datenbank** vor, auch nicht, wenn sie aus einer Entscheidung folgen. Gebaut wird allein von Claude, nach Janns Freigabe.
- **Claude** schreibt `claude*.md`, legt Ordner aus Janns Anfragen an, baut Freigegebenes und spiegelt Urteile ins Repository.
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
