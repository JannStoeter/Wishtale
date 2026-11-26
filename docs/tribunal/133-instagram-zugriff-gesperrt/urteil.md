---
topic: 133-instagram-zugriff-gesperrt
status: entschieden
option: umsetzen
datum: 2026-11-26
umgesetzt: c5a4dc8
---
**Jann im Projekt:** „Instagram api Access Blocked“.

Umsetzung im Code: Fehler von Meta nennen jetzt Code und Untercode und einen Hinweis auf Deutsch (`igMessage()` in `api/_lib/instagram.js`), und jeder Fehler steht mit Code und `fbtrace_id` im Vercel-Log (`instagram <Status> …`). Test `tests/instagram.test.mjs`.

Bei Jann in Meta: Instagram-App öffnen und eine mögliche Sicherheitsprüfung bestätigen, unter developers.facebook.com › Meine Apps nach Einschränkungen oder offenen Prüfungen (Datennutzungsprüfung, App-Modus) sehen, danach einen neuen Schlüssel erzeugen und `META_ACCESS_TOKEN` in Vercel ersetzen.
