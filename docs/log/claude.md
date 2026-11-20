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

## 2026-11-18 · 095 · Wishtale als installierbare Web-App
- Commits: dee25e9 und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („Baue Stufe 1“), Dev 095
- Geändert: neu public/app/manifest.webmanifest, public/app/sw.js, public/app/offline.html, public/app/icons/*, scripts/app-icons.mjs, src/lib/pwa.js, src/views/appinstall.js; app/index.html (Manifest, Symbole), src/main.js (Service Worker, Teilen), src/views/menu.js, modals.js, wishes.js, tour.js, src/actions.js, src/styles/main.css, vercel.json (Kopfzeilen für sw.js und Manifest), datenschutz.html Abschnitt 7, CLAUDE.md
- Warum: Wishtale soll sich wie eine App auf den Home-Bildschirm legen lassen, ohne Store und ohne Gebühren
- Geprüft: ESLint, Build, Playwright (Installierbarkeit laut Chrome ohne Fehler, Service Worker, Offline-Seite, Teilen, Hinweis, Anleitung iPhone und Android), axe ohne Befund
- Datenbank und Dienste: Eintrag 095 in tribunal_verdicts
- Zurücknehmen: git revert dee25e9; installierte Service Worker übernehmen danach die neue Fassung, zum vollständigen Entfernen eine sw.js ausliefern, die sich selbst abmeldet
- Offen: Test auf echten Geräten; Stufe 2 (Stores)

## 2026-11-19 · 096 · iPhone-Anleitung als nachgebaute Ansicht
- Commits: d469667 und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („bau es einfach als Ansicht nach, am aktuellen iOS“), Dev 096
- Geändert: neu src/views/iosdemo.js; src/views/appinstall.js (Ansicht, Steuerung), src/actions.js (demoprev, demonext, demotoggle, Start beim Öffnen), src/styles/main.css, CLAUDE.md
- Warum: Eine reine Textanleitung ist für wenig geübte Menschen schwer, seit Safari 26 liegt „Teilen“ eine Ebene tiefer
- Geprüft: ESLint, Build, Playwright mit Safari 26, Safari 18 und Chrome auf dem iPhone, alle Schritte als Bild geprüft, axe ohne Befund
- Datenbank und Dienste: Eintrag 096 in tribunal_verdicts
- Zurücknehmen: git revert d469667
- Offen: Abgleich mit einem echten iPhone, vor allem bei Adressleiste oben

## 2026-11-19 · 097 · Geräte je Bereich, Admins nicht mitzählen
- Commits: 632c4e7 und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat (Handy-Anteil auswerten, eigene Tests verfälschen die Zahlen), Dev 097
- Geändert: supabase/migrations/0029_usage_devices.sql (neu, eingespielt), api/_lib/event.js (app_open), src/main.js (countOpen), src/admin/api.js, src/admin/usage.js, datenschutz.html Abschnitt 8, CLAUDE.md
- Warum: Entscheidungen zur Gestaltung sollen auf echter Nutzung beruhen, nicht auf eigenen Tests am Rechner
- Geprüft: ESLint, Build, Playwright für normales Konto und Admin, buildEvent mit app_open
- Datenbank und Dienste: Migration 0029 eingespielt, Eintrag 097 in tribunal_verdicts
- Zurücknehmen: git revert 632c4e7; drop function public.admin_usage_devices(int)
- Offen: Zahlen brauchen einige Wochen, bis sie aussagekräftig sind

## 2026-11-19 · 098 · Handy-Prüfung, Schritt 1: Farbwelt und erster Bildschirm
- Commits: ebe1e9c (zwei Fehler am Handy), 3c73134 und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat (Handy prüfen, weniger Beige, Überschrift in einer Zeile, „Du kannst bauen“), Dev 098
- Geändert: src/styles/main.css (Farben nur in der App, Kategoriefarben, Kopf, Band), src/views/card.js (Platzhalterfarbe aus der Kategorie), src/views/wishes.js (Überschrift, Legende, ein Hinweis), src/views/tour.js (FAQ), src/views/auth.js nicht geändert, CLAUDE.md
- Warum: Am Handy begann die Liste erst in der Bildschirmmitte, alles wirkte einfarbig beige
- Geprüft: ESLint, Build, Playwright 390 und 1280 px, axe ohne Befund
- Datenbank und Dienste: Eintrag 098 in tribunal_verdicts
- Zurücknehmen: git revert 3c73134
- Offen: Schritt 2 (Wunsch-Ansicht, Dialogtexte, Gast-Ideen)

## 2026-11-19 · 098 · Schritt 2: Wunsch-Ansicht, Dialogtexte, Gast-Ideen
- Commits: 715d550 und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („Ja Bau alles“), Dev 098
- Geändert: src/views/wishmodal.js (sameItem, kompaktes Hauptangebot, leise Alternativen und Varianten, kleinere Aktionen), src/views/wishprev.js und src/views/modals.js (kürzere Hinweise), src/views/giver.js (Gast-Ideen ruhig, Eigene Idee prüfen), src/styles/main.css
- Warum: Doppelte Karten und große Knöpfe lenkten am Handy vom Wunsch ab
- Geprüft: ESLint, Build, Playwright 390 px
- Datenbank und Dienste: Eintrag 098 in tribunal_verdicts aktualisiert
- Zurücknehmen: git revert 715d550
- Offen: Prüfung auf echtem Gerät

## 2026-11-20 · 099 · Vorschläge als eigene Fläche
- Commits: 6db7114 und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („Ideen grafisch abgrenzen, geht sehr unter“), Dev 099
- Geändert: src/views/giver.js, src/views/inspiration.js (Klasse ideas-zone, Kennzeichnung), src/styles/main.css (Fläche, Karten, Wischen am Handy), CLAUDE.md
- Warum: Die Ideen gingen nach Schritt 2 von 098 als langer Text unter
- Geprüft: ESLint, Build, Playwright 390 und 1280 px, axe ohne Befund, kein Überlauf
- Datenbank und Dienste: Eintrag 099 in tribunal_verdicts
- Zurücknehmen: git revert 6db7114
- Offen: Wischen auf echtem Gerät prüfen
