---
topic: 091-chatgpt-darf-hochladen-mit-log
status: entschieden
option: Anweisung
datum: 2026-11-16
umgesetzt: PENDING
---
Ersetzt die Pull-Request-Pflicht aus 090. Umgesetzt in `AGENTS.md`, `CLAUDE.md`, `docs/tribunal/README.md`, neu `docs/log/` und `docs/zulieferung/`:
- **Rollentabelle:** Claude und ChatGPT bauen und pushen direkt nach `main`, weitere Sprachmodelle sind Zulieferer für Codestrecken und pushen nie nach `main`.
- **Regeln fürs direkte Hochladen:** nur Freigegebenes, Ankündigung in `bau.md`, vorher `git pull --rebase`, kleine Commits, nie `--force` oder fremde Commits zurücksetzen, Lint und Build vor jedem Push, riskante Umbauten (Datenbank, Anmeldung, Zahlung, Datenschutz) lieber als Pull Request.
- **Log (Pflicht bei jedem Push):** `docs/log/<name>.md`, neue Einträge ans Ende, Format in `docs/log/README.md`: Zeit, Dev-Nummer, Commits, Auftrag, geänderte Dateien, Grund, was geprüft ist und was nicht, Datenbank und Dienste, Befehl zum Zurücknehmen, offene Punkte. Claude führt das Log genauso.
- **Commit-Zeile `Agent: <name>`**, damit `git log --grep "Agent: chatgpt"` alle Änderungen einer KI zeigt.
- **Zulieferer:** Bestellung als `docs/zulieferung/<nr>-<thema>.md` (was, wo, Schnittstelle, Grenzen, Prüfung), Lieferung auf `zulieferung/<modell>-<thema>`, Claude oder ChatGPT übernehmen und loggen die Herkunft. Neue Zulieferer werden auf Janns Wunsch in die Tabelle in `AGENTS.md` eingetragen.
