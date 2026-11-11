---
topic: 039-vorbereitete-profile-verschenken
status: entschieden
option: A
datum: 2026-11-13
umgesetzt: 3d8bc76
---
**Janns Entscheidung im Chat: „ja, A, bau es“.** Claude und ChatGPT empfahlen beide A. Umgesetzt: Im eigenen Profil gibt es „Jemanden einladen“ (Vorname, höchstens zwei Tipps, Link wird von Jann selbst verschickt). Der Link `/app/#einladung/<Code>` enthält nur einen Zufallscode, gespeichert ist nur sein Hash (Migration `0025`, Funktionen `create_invite`, `peek_invite`, `redeem_invite`), er gilt 30 Tage und lässt sich einmal einlösen, höchstens zehn offene Einladungen pro Konto, Zurückziehen möglich. Die eingeladene Person sieht „Jann hat ein Wishtale für dich vorbereitet“, kann Namen ändern und Tipps einzeln abwählen und registriert sich erst danach. Die behaltenen Tipps stehen als Wünsche mit „Tipp von Jann“ in ihrer Liste, das Konto entsteht erst bei der Registrierung. Wishtale verschickt keine Mails an Dritte. Datenschutz ergänzt, Cron räumt auf. Datenbank live geprüft (anonym nicht anlegbar, nicht selbst einlösbar, nur einmal einlösbar), Oberfläche mit simulierten Antworten geprüft (Einladen, Ansehen, Abwählen, Registrierung, Übernahme, ungültiger Link, Zurückziehen). Noch nicht getestet: der echte Ablauf mit Registrierung und Bestätigungsmail, das geht erst mit dem eingerichteten Mailversand (041).
