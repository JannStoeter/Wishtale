# Hinweise für KI-Assistenten (Claude, ChatGPT und Zulieferer)

Dieses Repository gehört zu **Wishtale**, einer deutschen Wunschlisten-App. Die Projektregeln stehen in `CLAUDE.md` (Marke, Ton, Technik). Lies sie zuerst, sie gelten auch für dich.

## Rollen der KI-Assistenten
| Wer | Darf | Branch, Log |
|---|---|---|
| **Claude** | bauen und direkt nach `main` pushen, Positionen, Abgleich, Datenbank | `main`, Log `docs/log/claude.md` |
| **ChatGPT** | bauen und direkt nach `main` pushen (seit 2026-11-16, Dev 091), Positionen, Fragen | `main` oder `chatgpt/<nr>-<kurzname>`, Log `docs/log/chatgpt.md` |
| **Zulieferer** (weitere Sprachmodelle, zum Beispiel Gemini, Codex, Mistral) | nur Codestrecken auf Bestellung von Claude oder ChatGPT, nie direkt in `main` | `zulieferung/<modell>-<thema>`, Log `docs/log/<modell>.md` |

Jann entscheidet, wer was baut. Wer welchen Namen hat, steht in der Tabelle, neue Zulieferer trägt Claude oder ChatGPT auf Janns Wunsch hier ein.

## Bauen und hochladen: Konventionen für Claude und ChatGPT (verbindlich)
1. **Nur Freigegebenes bauen.** Ein Urteil mit „Zum Bauen freigeben“ im Dev oder eine ausdrückliche Anweisung von Jann. Bei Widerspruch zu einem Urteil oder offenen Risiken nicht bauen, sondern Jann fragen.
2. **Ankündigen, damit nichts doppelt gebaut wird.** Vor dem Start `docs/tribunal/<nr>-<name>/bau.md` anlegen (Front matter `von: chatgpt` oder `von: claude`, `status: in-arbeit`, `datum`) und mit dem ersten Commit pushen. Steht dort schon die andere KI mit `in-arbeit`, nicht bauen. Am Ende `status: fertig`.
3. **Direkt hochladen ist erlaubt**, mit diesen Regeln: vorher `git pull --rebase`, kleine Commits zu genau einem Punkt, nie `--force`, nie Geschichte umschreiben, nie fremde Commits zurücksetzen oder löschen. Größere oder riskante Umbauten (Datenbank, Anmeldung, Zahlung, Datenschutz) besser als Branch mit Pull Request, damit Jann zusammenführt.
4. **Prüfen vor jedem Push:** `npx eslint src` und `npm run build` ohne Fehler. Neue Oberfläche am Handy (390 px) und am Rechner ansehen, Barrierefreiheit (Beschriftungen, Fokus, Kontrast, keine waagerechte Verschiebung). Was nicht geprüft werden konnte, steht im Log.
5. **Regeln aus `CLAUDE.md` gelten vollständig:** Ton und Marke, `data-edit`-Schlüssel nie umbenennen, Schriften und Fotos selbst ausliefern, höchstens 12 Server-Funktionen, Amazon-Kennzeichnung „Anzeige“, Vorschläge immer als Vorschlag erkennbar, die Überraschung bleibt (die beschenkte Person sieht nie Reservierungen).
6. **Grenzen:** keine Schlüssel oder Geheimnisse in Dateien; keine Änderungen an Vercel, Supabase, Stripe oder anderen Diensten über deren Oberfläche oder Schnittstellen (außer Claude auf Janns Anweisung); Datenbank nur über eine neue Migrationsdatei in `supabase/migrations/` mit Zugriffsregeln (RLS) und, wo nötig, einem Test in `supabase/tests/`, eingespielt nur von Jann oder Claude. Neue Datenverarbeitung, Dienste, Ereignisse oder Cookies nur zusammen mit der Änderung in `datenschutz.html`. Neue Pakete nur mit Begründung im Log.
7. **Log führen (Pflicht, bei jedem Push):** Für jeden Push ein Eintrag am Ende von `docs/log/<name>.md`, im selben Commit oder direkt danach. Format und Beispiel stehen in `docs/log/README.md`. Damit lässt sich jederzeit nachvollziehen, wer was geändert hat, und es lässt sich gezielt aufräumen (`git revert <commit>`).
8. **Commits:** Deutsch, kurze Beschreibung, am Ende die Zeile `Agent: <name>` (also `Agent: chatgpt`, `Agent: claude` oder der Name des Zulieferers) und bei ChatGPT zusätzlich `Co-Authored-By: ChatGPT <noreply@openai.com>`. So findet `git log --grep "Agent: chatgpt"` alle Änderungen einer KI.
9. **Festhalten im Dev:** `urteil.md` im Ordner mit `umgesetzt:` (Commit), was gebaut und getestet wurde; Zeile in `docs/tribunal/ENTSCHEIDUNGEN.md`; bei neuen Funktionen eine kurze Zeile in `CLAUDE.md` (Abschnitt Technik). Den Datenbankeintrag (`tribunal_verdicts`) setzt Claude beim Abgleich.
10. **Nach dem Push** prüfen, ob der Deploy bei Vercel durchläuft, wenn möglich. Wenn nicht möglich, im Log vermerken, damit Claude es beim Abgleich prüft.

## Zulieferer: Codestrecken für Claude und ChatGPT
Weitere Sprachmodelle schreiben nur abgegrenzte Codestrecken, die Claude oder ChatGPT bestellt haben (zum Beispiel eine Funktion, ein Modul, einen Test). Die Bestellung steht als Datei `docs/zulieferung/<nr>-<thema>.md` (was, wo es hingehört, Schnittstelle, Grenzen, wer bestellt hat).
1. Der Zulieferer arbeitet nur auf dem Branch `zulieferung/<modell>-<thema>`, ändert nur die in der Bestellung genannten Dateien und pusht nie nach `main`.
2. Er hält sich an `CLAUDE.md`, prüft mit `npx eslint src` und `npm run build` und führt sein Log in `docs/log/<modell>.md`.
3. Claude oder ChatGPT prüfen die Lieferung, übernehmen sie (oder Teile davon) nach `main` und schreiben in ihr eigenes Log, was von welchem Zulieferer stammt.

## Tribunal: deine Position zu Entscheidungen
Jann trifft Entscheidungen aus den unabhängigen Positionen von Claude und ChatGPT. Wenn Jann dich um eine Position bittet:

0. Lies `docs/tribunal/ENTSCHEIDUNGEN.md`: Janns bisherige Urteile und die Grundsätze des Produkts. Sie gelten. Wer ihnen widerspricht, braucht ein neues, begründetes Tribunal.
1. Lies `docs/tribunal/README.md` (Format und Regeln).
2. Lies im Ordner der Entscheidung `frage.md`. **Lies die Datei der anderen KI noch nicht**, bevor du deine abgelegt hast.
3. Schreibe `docs/tribunal/<ordner>/chatgpt.md` im vorgegebenen Format (Front matter und die drei Abschnitte).
4. Committe nur diese Datei auf den Branch `tribunal/chatgpt-<nummer>` und öffne einen Pull Request.

Wann etwas ins Tribunal gehört (Dreier-Regel): schwer rückgängig, kostet Geld, berührt Recht oder Datenschutz, ändert Architektur oder Geschäftsmodell, oder Jann möchte es. Du kannst solche Fragen selbst anlegen: neuer Ordner `docs/tribunal/<nr>-<name>/` mit `frage.md`. Fragen, die Jann auf der Entwickler-Seite stellt, legt Claude beim Abgleich als Ordner an, danach siehst du sie im Repository. Janns Urteile spiegelt Claude beim Abgleich nach `docs/tribunal/ENTSCHEIDUNGEN.md` und in eine `urteil.md` im jeweiligen Ordner, damit du sie kennst. Bauaufträge stehen nur in der Datenbank. Baue nichts auf Grundlage einer Entscheidung, die Jann dir nicht ausdrücklich zugewiesen hat.

## Prioritätenliste
Auf Wunsch von Jann schreibst du außerdem deine Prioritätenliste nach `docs/tribunal/prioritaeten/chatgpt.md` (Format und Skala in `docs/tribunal/README.md`). Lies die Liste von Claude erst, nachdem du deine abgelegt hast. Einreichen wie eine Position: Branch `tribunal/chatgpt-prioritaeten`, nur diese Datei, Pull Request.

## Allgemein
- Antworte und schreibe auf Deutsch, warm und in ganzen Sätzen (siehe Tonregeln in `CLAUDE.md`).
- Vor dem Pushen: `npx eslint src` und `npm run build`.
- Schlüssel stehen nur in Vercel-Umgebungsvariablen, nie im Code oder in Dateien.
- Das Projekt läuft auf Vercel Hobby: höchstens 12 Server-Funktionen (`api/*.js` auf oberster Ebene), neue Endpunkte als `op` in `api/admin.js` oder `api/billing.js`.
