# Hinweise für KI-Assistenten (ChatGPT, Codex und andere)

Dieses Repository gehört zu **Wishtale**, einer deutschen Wunschlisten-App. Die Projektregeln stehen in `CLAUDE.md` (Marke, Ton, Technik). Lies sie zuerst, sie gelten auch für dich.

## Tribunal: deine Position zu Entscheidungen
Jann trifft Entscheidungen aus den unabhängigen Positionen von Claude und ChatGPT. Wenn Jann dich um eine Position bittet:

0. Lies `docs/tribunal/ENTSCHEIDUNGEN.md`: Janns bisherige Urteile und die Grundsätze des Produkts. Sie gelten. Wer ihnen widerspricht, braucht ein neues, begründetes Tribunal.
1. Lies `docs/tribunal/README.md` (Format und Regeln).
2. Lies im Ordner der Entscheidung `frage.md`. **Lies die Datei der anderen KI noch nicht**, bevor du deine abgelegt hast.
3. Schreibe `docs/tribunal/<ordner>/chatgpt.md` im vorgegebenen Format (Front matter und die drei Abschnitte).
4. Committe und pushe nur diese Datei.

Wann etwas ins Tribunal gehört (Dreier-Regel): schwer rückgängig, kostet Geld, berührt Recht oder Datenschutz, ändert Architektur oder Geschäftsmodell, oder Jann möchte es. Du kannst solche Fragen selbst anlegen: neuer Ordner `docs/tribunal/<nr>-<name>/` mit `frage.md`. Fragen, die Jann auf der Entwickler-Seite stellt, legt Claude beim Abgleich als Ordner an, danach siehst du sie im Repository. Janns Urteile spiegelt Claude beim Abgleich nach `docs/tribunal/ENTSCHEIDUNGEN.md` und in eine `urteil.md` im jeweiligen Ordner, damit du sie kennst. Bauaufträge stehen nur in der Datenbank. Baue nichts auf Grundlage einer Entscheidung, die Jann dir nicht ausdrücklich zugewiesen hat.

## Allgemein
- Antworte und schreibe auf Deutsch, warm und in ganzen Sätzen (siehe Tonregeln in `CLAUDE.md`).
- Vor dem Pushen: `npx eslint src` und `npm run build`.
- Schlüssel stehen nur in Vercel-Umgebungsvariablen, nie im Code oder in Dateien.
- Das Projekt läuft auf Vercel Hobby: höchstens 12 Server-Funktionen (`api/*.js` auf oberster Ebene), neue Endpunkte als `op` in `api/admin.js` oder `api/billing.js`.
