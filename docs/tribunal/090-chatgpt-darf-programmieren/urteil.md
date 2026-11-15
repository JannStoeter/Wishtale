---
topic: 090-chatgpt-darf-programmieren
status: entschieden
option: Anweisung
datum: 2026-11-15
umgesetzt: 2bef5b3
---
Die Konventionen stehen in `AGENTS.md` (Abschnitt „Programmieren: Konventionen“), die Rollen in `docs/tribunal/README.md` und `CLAUDE.md`:
1. Nur Freigegebenes bauen (Urteil mit Bau-Freigabe oder ausdrückliche Anweisung von Jann).
2. Ankündigen in `docs/tribunal/<nr>-<name>/bau.md` (`von`, `status: in-arbeit`, `branch`), damit Claude und ChatGPT nichts doppelt bauen. Beide halten sich daran.
3. Nie direkt in `main`: Branch `chatgpt/<nr>-<kurzname>`, Pull Request, Jann führt zusammen.
4. Vor dem Pull Request Lint und Build, Ansicht am Handy und am Rechner, Barrierefreiheit, im Pull Request steht, was geprüft ist.
5. Alle Regeln aus `CLAUDE.md` gelten (Ton, Marke, `data-edit`, 12 Funktionen, Anzeige-Kennzeichnung, Überraschung).
6. Grenzen: keine Geheimnisse, keine Änderungen an Diensten, Datenbank nur als Migrationsdatei (einspielen nur Jann oder Claude), Datenschutzerklärung bei neuer Datenverarbeitung mit ändern, neue Pakete begründen.
7. Festhalten im Dev (`urteil.md`, `ENTSCHEIDUNGEN.md`, `CLAUDE.md`, `bau.md` auf fertig), den Datenbankeintrag setzt Claude beim Abgleich.
8. Commits auf Deutsch mit `Co-Authored-By: ChatGPT`.
Claude prüft beim Abgleich offene Pull Requests von `chatgpt/*` (Lint, Build, Konventionen, Datenschutz) und meldet Jann das Ergebnis.
