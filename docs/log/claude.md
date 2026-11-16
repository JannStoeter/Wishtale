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

## 2026-11-16 · 094 · Vorschläge ruhiger, Link mit einem „Passt“
- Commits: 3839b2d und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („Vorschläge am Handy default ausgeblendet, weniger Blick auf die Buttons, beim Link zweimal Passt“), Dev 094
- Geändert: src/views/inspiration.js (IdeaRow, HomeIdeas), src/lib/homeideas.js (Standard je Bildschirm, zweite Liste für gewählte Anzeige), src/styles/main.css (.qa, .homeideas-peek), src/actions.js (readlink liest denselben Link nur einmal), src/views/tour.js (FAQ-Text), CLAUDE.md
- Warum: Am Handy dominierten große Buttons, und ein zweites Einlesen des Links ersetzte die gerade bestätigte Karte
- Geprüft: ESLint, Build, Playwright 390 und 1280 px mit simuliertem Konto, axe ohne Befund, Fehler im alten Stand nachgestellt und im neuen behoben
- Datenbank und Dienste: Eintrag 094 in tribunal_verdicts
- Zurücknehmen: git revert 3839b2d
- Offen: Prüfung auf echtem Gerät; Gast-Ideen (AiIdeas) und Varianten im Wunschdialog haben noch die alte Kartenform
