# Log der KI-Assistenten

Jede KI, die etwas in dieses Repository hochlädt, führt hier ihr eigenes Log: `docs/log/claude.md`, `docs/log/chatgpt.md` und je Zulieferer `docs/log/<modell>.md`. Neue Einträge kommen **ans Ende** der Datei (so gibt es kaum Konflikte). Regeln: `AGENTS.md`.

Ein Eintrag je Push, in diesem Format:

```
## 2026-11-16 14:05 · 091 · Kurzer Titel
- Commits: 1a2b3c4, 5d6e7f8 (Branch: main)
- Auftrag: Wortlaut oder Dev-Nummer, wer freigegeben hat
- Geändert: src/views/wishes.js (Leiste), src/styles/main.css (neue Klassen)
- Warum: ein Satz
- Geprüft: Lint, Build, Ansicht 390 und 1280 px, axe; nicht geprüft: echtes Gerät
- Datenbank und Dienste: keine (oder: Migration 0029 liegt bei, noch nicht eingespielt)
- Zurücknehmen: git revert 1a2b3c4 5d6e7f8
- Offen: was noch fehlt oder beobachtet werden sollte
```

Aufräumen: `git log --grep "Agent: chatgpt"` zeigt alle Commits einer KI, das Log erklärt sie, „Zurücknehmen“ nennt die Befehle.
