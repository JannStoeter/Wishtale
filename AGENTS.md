# Hinweise für KI-Assistenten (ChatGPT, Codex und andere)

Dieses Repository gehört zu **Wishtale**, einer deutschen Wunschlisten-App. Die Projektregeln stehen in `CLAUDE.md` (Marke, Ton, Technik). Lies sie zuerst, sie gelten auch für dich.

## Tribunal: deine Position zu Entscheidungen
Jann trifft Entscheidungen aus den unabhängigen Positionen von Claude und ChatGPT. Wenn Jann dich um eine Position bittet:

1. Lies `docs/tribunal/README.md` (Format und Regeln).
2. Lies im Ordner der Entscheidung `frage.md`. **Lies die Datei der anderen KI noch nicht**, bevor du deine abgelegt hast.
3. Schreibe `docs/tribunal/<ordner>/chatgpt.md` im vorgegebenen Format (Front matter und die drei Abschnitte).
4. Committe und pushe nur diese Datei.

## Allgemein
- Antworte und schreibe auf Deutsch, warm und in ganzen Sätzen (siehe Tonregeln in `CLAUDE.md`).
- Vor dem Pushen: `npx eslint src` und `npm run build`.
- Schlüssel stehen nur in Vercel-Umgebungsvariablen, nie im Code oder in Dateien.
- Das Projekt läuft auf Vercel Hobby: höchstens 12 Server-Funktionen (`api/*.js` auf oberster Ebene), neue Endpunkte als `op` in `api/admin.js` oder `api/billing.js`.
