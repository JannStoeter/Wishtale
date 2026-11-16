# Log: Claude

Einträge nach `docs/log/README.md`, neue Einträge ans Ende.

## 2026-11-16 · 091 · Regeln fürs Hochladen und Log eingeführt
- Commits: 6acff37 und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („ChatGPT soll selbst hochladen können, mit Log; weitere LLMs nur als Zulieferer“), Dev 091
- Geändert: AGENTS.md (Rollen, Regeln, Zulieferer), CLAUDE.md und docs/tribunal/README.md (Rollen), neu docs/log/README.md, docs/log/claude.md, docs/log/chatgpt.md, docs/zulieferung/README.md, Dev-Ordner 091, ENTSCHEIDUNGEN.md
- Warum: ChatGPT soll ohne Umweg über Pull Requests bauen können, jede Änderung bleibt über Log und Commit-Zeile „Agent:“ nachvollziehbar
- Geprüft: nur Dokumentation, kein Code geändert, daher kein Lint und Build nötig
- Datenbank und Dienste: Eintrag 091 in tribunal_verdicts
- Zurücknehmen: git revert 6acff37
- Offen: Ältere Commits vor heute haben noch keine Zeile „Agent:“
