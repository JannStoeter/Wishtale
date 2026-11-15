# Hinweise für KI-Assistenten (ChatGPT, Codex und andere)

Dieses Repository gehört zu **Wishtale**, einer deutschen Wunschlisten-App. Die Projektregeln stehen in `CLAUDE.md` (Marke, Ton, Technik). Lies sie zuerst, sie gelten auch für dich.

## Deine Rolle (wichtig)
Seit 2026-11-15 (Jann, Dev 090) darfst du **auch programmieren**, nach den Konventionen unten. Daneben gibst du wie bisher Positionen ab und stellst Fragen im Tribunal.

## Programmieren: Konventionen (verbindlich)
1. **Nur Freigegebenes bauen.** Du baust nur, was Jann freigegeben hat: ein Urteil mit „Zum Bauen freigeben“ im Dev oder eine ausdrückliche Anweisung von Jann an dich. Bei Widerspruch zu einem Urteil oder offenen Risiken baust du nicht, sondern fragst Jann.
2. **Ankündigen, damit nichts doppelt gebaut wird.** Bevor du anfängst, legst du im Ordner des Punkts `docs/tribunal/<nr>-<name>/bau.md` an (Front matter `von: chatgpt`, `status: in-arbeit`, `branch: …`, `datum: …`) und pushst sie mit dem ersten Commit. Steht dort schon `von: claude` mit `in-arbeit`, baust du nicht. Claude hält sich umgekehrt genauso daran.
3. **Nie direkt in `main`.** Du arbeitest auf einem Branch `chatgpt/<nr>-<kurzname>` vom aktuellen `main` und öffnest einen Pull Request. Zusammengeführt wird von Jann. Kleine, abgeschlossene Pull Requests, ein Punkt je Pull Request.
4. **Prüfen vor dem Pull Request:** `npx eslint src` und `npm run build` ohne Fehler. Neue Oberfläche am Handy (390 px) und am Rechner ansehen, Barrierefreiheit (Beschriftungen, Fokus, Kontrast, keine waagerechte Verschiebung). Im Pull Request steht, was du geprüft hast und was nicht.
5. **Regeln aus `CLAUDE.md` gelten vollständig:** Ton und Marke, `data-edit`-Schlüssel nie umbenennen, Schriften und Fotos selbst ausliefern, höchstens 12 Server-Funktionen, Amazon-Kennzeichnung „Anzeige“, Vorschläge immer als Vorschlag erkennbar, Überraschung bleibt (die beschenkte Person sieht nie Reservierungen).
6. **Grenzen:** keine Schlüssel oder Geheimnisse in Dateien; keine Änderungen an Vercel, Supabase, Stripe oder anderen Diensten; Datenbank nur über eine neue Migrationsdatei in `supabase/migrations/` (eingespielt wird sie von Jann oder Claude, nie von dir), mit Zugriffsregeln (RLS) und, wo nötig, einem Test in `supabase/tests/`. Neue Datenverarbeitung, Dienste, Ereignisse oder Cookies nur zusammen mit der Änderung in `datenschutz.html`. Neue Pakete nur mit Begründung im Pull Request.
7. **Festhalten im Dev:** `urteil.md` im Ordner mit `umgesetzt:` (Branch oder Commit), was gebaut wurde und was getestet ist; Zeile in `docs/tribunal/ENTSCHEIDUNGEN.md`; bei neuen Funktionen eine kurze Zeile in `CLAUDE.md` (Abschnitt Technik). `bau.md` auf `status: fertig` setzen. Den Datenbankeintrag (`tribunal_verdicts`) setzt Claude beim Abgleich.
8. **Commits:** Deutsch, kurze Beschreibung, am Ende `Co-Authored-By: ChatGPT <noreply@openai.com>`.

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
