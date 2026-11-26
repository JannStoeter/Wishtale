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

## 2026-11-20 · 100 · Smarte Kategorien, Stufe 1
- Commits: b903d71 und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („Baue Stufe 1“, feiner trennen), Dev 100
- Geändert: src/data/content.js (CATS, KID_CATS, cat-Rückfall), src/lib/category.js (Wortliste), neu src/lib/smartcats.js, src/actions.js, src/render.js, src/views/modals.js, src/views/wishprev.js, src/lib/invite.js, api/_lib/match.js (CAT_GUIDE, categorize), api/ideas.js (mode=cat), datenschutz.html Abschnitt 11, CLAUDE.md
- Warum: Fast alles Unbekannte landete in „Wohnen“, große Märkte wie Fitness oder Wintersport fehlten
- Geprüft: ESLint, Build, Playwright mit Testkonto, parseCats
- Datenbank und Dienste: keine Migration nötig (Kategorie ist Text), Eintrag 100 in tribunal_verdicts
- Zurücknehmen: git revert b903d71 (bereits neu sortierte Wünsche behalten ihre neue Kategorie)
- Offen: Stufe 2, Wirkung in der Auswertung nach einigen Tagen prüfen

## 2026-11-20 · 101 · „Was hast du schon?“ in der Profil-Einrichtung
- Commits: ff88dfd und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („Besitz über den Profilweg angeben, nicht bei meinen Wünschen“), Dev 101
- Geändert: src/data/content.js (OWNED, KID_OPTS.owned), src/views/profile.js (Schritt owned, Picker, Abschnitt offen), src/actions.js (addOwned, toggleOwned), CLAUDE.md
- Warum: Der Weg zum Eintragen war schwer zu finden, in der Einrichtung fehlte er ganz
- Geprüft: ESLint, Build, Playwright 390 px, axe ohne Befund; Datenbank-Zählung zeigt keine verlorenen Einträge
- Datenbank und Dienste: Eintrag 101 in tribunal_verdicts
- Zurücknehmen: git revert ff88dfd
- Offen: keine

## 2026-11-21 · 102 · Teilen-Link mit Vorschau, Reservieren in der Gastliste
- Commits: a94caaa und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („Punkt 1 und 2 als Erstes bauen“), Dev 102
- Geändert: neu api/_lib/share.js, scripts/og-image.mjs, public/og/wunschliste.jpg; api/resolve.js (op=share), vercel.json (Rewrite /w/:h), src/actions.js (share-Link), src/views/welcome.js, src/views/card.js (o.reserve), src/views/giver.js (Hinweis, reserve), src/styles/main.css, CLAUDE.md
- Warum: Geteilte Links zeigten in Messengern keine Vorschau, Gäste fanden das Reservieren kaum (1 Reservierung bei 38 Aufrufen)
- Geprüft: ESLint, Build, Vorschauseite mit nachgestelltem Profil, Playwright Gastansicht 390 und 1280 px, axe ohne Befund; live: /og/wunschliste.jpg 200, /w/jonas (Demo) zeigt „Jonas’ Wunschliste“ mit 4 Wünschen, ungültiges Kürzel 404
- Datenbank und Dienste: keine Migration, weiterhin 11 Server-Funktionen; Eintrag 102 in tribunal_verdicts
- Zurücknehmen: git revert a94caaa
- Offen: Vorschau in einer echten WhatsApp-Nachricht prüfen (Messenger cachen Vorschauen teils lange)

## 2026-11-22 · 103 · Restliche optische Befunde
- Commits: af0d97e und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („die anderen optischen Bugs auch ändern“), Dev 103
- Geändert: src/views/card.js, wishes.js, modals.js, menu.js, shared.js, giver.js, src/data/content.js (V.s), src/actions.js (newbar, newbarx, previewres), src/styles/main.css (Farben überall, Band, Profil, Sprungknopf), public/landing/*.jpg, CLAUDE.md
- Warum: Restpunkte aus der Durchsicht vom 21.11.
- Geprüft: ESLint, Build, Playwright 390 px, axe ohne Befund; Vercel-Variable BRAVE_SEARCH_API_KEY vorhanden
- Datenbank und Dienste: Eintrag 103 in tribunal_verdicts
- Zurücknehmen: git revert af0d97e
- Offen: keine

## 2026-11-22 · 104 · Hinweise im richtigen Moment, Kind-Konten
- Commits: 118fc42 und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat (Funktionen smart zeigen statt bewerben, Kind-Konten bei Kinderspielzeug), Dev 104
- Geändert: neu src/lib/tips.js, src/views/tips.js; src/views/wishes.js (Hinweis über der Liste), src/actions.js (tipgo, tipno), src/styles/main.css, CLAUDE.md
- Warum: Funktionen wie Kind-Konten kennt sonst niemand, Werbung im Produkt ist unerwünscht
- Geprüft: ESLint, Build, Playwright 390 px, axe ohne Befund
- Datenbank und Dienste: Eintrag 104 in tribunal_verdicts
- Zurücknehmen: git revert 118fc42
- Offen: weitere Hinweise (Zweites Elternteil, Teilen, nach dem Reservieren, Habe ich schon, Geschmackskarten)

## 2026-11-22 · 105 · Geteilte Links im CMS zählen
- Commits: 49fd530 und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („wie oft auf einen geteilten Profillink geklickt wurde“), Dev 105
- Geändert: api/_lib/share.js (?via=link), src/render.js (guest_view mit label link), supabase/migrations/0030_usage_links.sql (eingespielt), src/admin/usage.js (Karte), datenschutz.html Abschnitt 8, CLAUDE.md
- Warum: Sichtbar machen, ob geteilte Listen tatsächlich geöffnet werden
- Geprüft: ESLint, Build, Playwright Gastansicht und CMS mit Beispieldaten
- Datenbank und Dienste: Migration 0030, Eintrag 105 in tribunal_verdicts
- Zurücknehmen: git revert 49fd530; Funktion mit 0029 wiederherstellen
- Offen: Zahlen sammeln sich erst ab jetzt

## 2026-11-24 · 106 · Launch-Checkliste, Teil B
- Commits: 1c6307a (Checkliste), bcb9a99, ebaca53 und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („Bitte baue alles“), Dev 106; dazu Position zu Dev 107 (Kosten einspielen)
- Geändert: supabase/migrations/0031 (eingespielt), src/lib/tips.js, src/views/tips.js, src/views/wishes.js, src/views/giver.js, src/views/profile.js, src/views/shared.js, src/views/given.js, src/views/modals.js, src/actions.js, src/main.js, api/account.js, neu api/_lib/guestmail.js, package.json (nodemailer), datenschutz.html Abschnitt 5, CLAUDE.md
- Warum: Startbereitschaft, Mundpropaganda, Reservierungen für Gäste geräteübergreifend
- Geprüft: ESLint, Build, Playwright, mailMe mit simuliertem Versand, Trigger nach 0031, axe ohne Befund
- Datenbank und Dienste: Migration 0031; Einträge 106 in tribunal_verdicts; Vercel braucht SMTP-Variablen
- Zurücknehmen: git revert ebaca53 bcb9a99; grant execute on function public.guard_profile_update() to authenticated
- Offen: echter Mailversand nach Eintragen der SMTP-Daten testen

## 2026-11-24 · 108 · Wunsch selbst erfüllt
- Commits: 7e50069 und der folgende Eintrags-Commit (Branch: main)
- Auftrag: Jann im Chat („selbst erfüllen direkt in der Ansicht, aber dezent“, danach Glückwunsch mit Fundort), Dev 108
- Geändert: src/views/wishmodal.js (Knopf), src/views/modals.js (FulfilledModal), src/actions.js (selbst, ffsee), src/styles/main.css, CLAUDE.md
- Warum: Bisher blieb nach „Erledigt“ das Wunschfenster offen, ohne klare Rückmeldung, wo der Wunsch hin ist
- Geprüft: ESLint, Build, Playwright iPhone 13
- Datenbank und Dienste: Eintrag 108 in tribunal_verdicts
- Zurücknehmen: git revert 7e50069
- Offen: keine

## 2026-11-24 · 111 · Mehr Amazon-Käufe ohne Werbeseite
- Commits: 5a4d6df und der folgende Eintrags-Commit (Branch: claude/project-thread-danupz, Pull Request nach main)
- Auftrag: Jann im Chat („Ja alle vier … Brave … ausbauen und nutzen“), Dev 111 (zuerst als 109 angelegt, wegen doppelter Nummer umbenannt)
- Geändert: api/_lib/imgsearch.js (amazonDirect mit zweitem Suchweg), neu src/lib/amzfill.js, src/actions.js, src/render.js, src/views/wishmodal.js (BuyLine), src/views/modals.js, src/lib/track.js, src/main.js, api/_lib/event.js, src/styles/main.css, datenschutz.html (Abschnitte 8 und Bildsuche), CLAUDE.md
- Warum: Die meisten Wünsche haben keinen Link, Amazon-Suche verkauft schlechter als die Produktseite
- Geprüft: ESLint, Build, amazonDirect mit simulierten Brave-Antworten
- Datenbank und Dienste: keine Migration; braucht BRAVE_SEARCH_API_KEY in Vercel (vorhanden); shop_click erscheint noch nicht im CMS
- Zurücknehmen: git revert 5a4d6df
- Offen: CMS-Karte für shop_click, eigene Tracking-ID für Ideen in PartnerNet

## 2026-11-24 · 110 · Otto-Links über Awin
- Commits: siehe Pull Request (Branch: claude/project-thread-d9qygv, aufbauend auf 111)
- Auftrag: Jann im Projekt-Thread (Awin-Deeplink für Otto DE), Dev 110
- Geändert: src/lib/shops.js (Awin-Konstanten, `partnerLink`, `withAwin`, `partnerOf`, `shopHost`, `clickRef`), src/lib/products.js (eigener Wunschlink mit Click Reference), src/lib/promo.js (`safeUrl` für CMS-Produkte und Aktionen), src/lib/track.js (Otto hinter Awin zählen), src/views/wishmodal.js, given.js, giver.js, inspiration.js (Kennzeichnung und Hinweise), datenschutz.html Abschnitt 9, neu tests/shops.test.mjs und `npm test`, CLAUDE.md
- Warum: Otto-Käufe über Wishtale sollen Provision bringen, die Wunsch-ID als Click Reference zeigt, welcher Wunsch verkauft hat
- Geprüft: ESLint, Build, `npm test` (8 Tests)
- Datenbank und Dienste: keine Migration; Eintrag 110 in tribunal_verdicts nach dem Merge
- Zurücknehmen: Commit reverten
- Offen: Echter Klick auf einen Deeplink und Sichtung im Awin-Dashboard nach dem Deploy
## 2026-11-24 · 109 · Weihnachtsabschnitt auf der Landingpage
- Commits: siehe Pull Request vom Branch claude/project-thread-7zgklr
- Auftrag: Jann im Chat („wir müssen die Landing mit umbauen oder?“), Dev 109
- Geändert: index.html (neuer Abschnitt `#weihnachten` mit Schlüsseln `weihnachten.*` und Sprungmarken `#familie`, `#kinder`, `#ideen`), src/landing.js (Abschnitte mit `data-until` blenden sich nach dem Datum aus)
- Warum: Die Google-Ads-Kampagne wirbt mit Weihnachtswunschliste, Kinder-Wunschzettel und Ideen; die Seite soll das aufgreifen und echte Ziele für Sitelinks bieten
- Geprüft: ESLint, Build, Playwright 390 und 1280 px
- Datenbank und Dienste: vorher ohne Code site_content `schritte.p4` und Aktion „Weihnachten 2026 (Landingpage)“ in campaigns
- Zurücknehmen: Revert des Merge-Commits; der Abschnitt verschwindet ohnehin ab 27.12.2026
- Offen: Sitelinks in Google Ads auf die Sprungmarken umstellen

## 2026-11-24 · 110 · Ideen-Karten mit Otto, Preis klickbar
- Commits: siehe Pull Request #18 (Branch: claude/project-thread-d9qygv)
- Auftrag: Jann im Projekt-Thread (Inspirationen ohne Otto, Klick auf den Preis tut nichts), Dev 110
- Geändert: src/lib/shops.js (`searchUrl.otto`, `ideaShops`, `ideaHref`), src/views/inspiration.js (`IdeaHead`, `IdeaRow`), src/views/giver.js (`AiIdeas`), src/styles/main.css, tests/shops.test.mjs, CLAUDE.md
- Warum: Otto soll auch bei Vorschlägen verdienen, und Name und Preis sind die Stellen, auf die man intuitiv tippt
- Geprüft: ESLint, Build, `npm test` (9 Tests), Bildschirmfoto der Karten mit App-Stylesheet
- Datenbank und Dienste: keine
- Zurücknehmen: Commit reverten
- Offen: Prüfung auf echtem Gerät nach dem Merge

## 2026-11-24 · 112 · Symbole statt Buchstaben bei Wünschen ohne Bild
- Commits: f3ccb21 (Pull Request #20)
- Auftrag: Jann im Projekt-Thread, Dev 112
- Geändert: src/lib/wishicon.js (neu), src/views/card.js (`WishArt`), src/views/wishprev.js (`thumb`), src/styles/main.css (`.wglyph`), tests/wishicon.test.mjs, CLAUDE.md
- Warum: Ein Buchstabe sagt nichts über den Wunsch, ein Symbol erkennt man in der Liste sofort
- Geprüft: ESLint, Build, `npm test` (12 Tests), Bildschirmfotos der Platzhalter mit App-Stylesheet bei 390 und 1200 px
- Datenbank und Dienste: keine
- Zurücknehmen: Commit reverten
- Offen: Eintrag in `tribunal_verdicts` nach dem Merge, Blick auf echte Wunschlisten

## 2026-11-24 · 113 · Inspirationskarte neu gestalten
- Commits: 25916ed, 7e44ae2, Merge 1aa2803 (Pull Request #21)
- Auftrag: Jann im Projekt-Thread, Dev 113
- Geändert: src/views/inspiration.js (`IdeaCard`, `IdeaHead` mit Symbol, `ideaPrice`), src/views/giver.js (`AiIdeas` nutzt `IdeaCard`), src/lib/shops.js (`ideaShops` auch bei Erlebnissen in `.idea-shops`), src/lib/wishicon.js (Hue, Bewegungsmelder, Smart Home als Lampe), src/styles/main.css (Block 113, alte Regeln 094/110 der Ideenkarte entfernt), CLAUDE.md
- Warum: Die Karte hatte acht unterstrichene Links ohne klare Hauptaktion und kein Bild
- Geprüft: ESLint, Build, `npm test` (12 Tests), Bildschirmfotos (iPhone 13 eigene und Gastansicht, 1200 px)
- Datenbank und Dienste: keine
- Zurücknehmen: Commit reverten
- Offen: Blick auf echtem Gerät
- Nachtrag: Karte öffnet sich als Fenster (`IdeaModal()` in src/views/inspiration.js, `ideaopen` in src/actions.js, Eintrag in src/views/modals.js), Name und Preis führen nicht mehr direkt zum Shop

## 2026-11-24 · 114 · Echte Produktbilder über Brave
- Auftrag: Jann im Projekt-Thread, Dev 114 (Entscheidungskarte: Ideenkarten behalten das Symbol)
- Geändert: api/_lib/imgsearch.js (`fits`, `core`, strengere `candidates`, `imageForWish`), api/inspect.js (`imageFor`, Tagesgrenze), api/_lib/limits.js (`guardSearch`), src/lib/imgfill.js (neu), src/lib/wishimg.js (`fetchWishImage`, Maße in `downscale`), src/actions.js (nach Speichern, Wunschzettel, „Auf meine Wunschliste“), src/render.js (Nachziehen), src/views/wishmodal.js („Bild von …“), datenschutz.html (Abschnitt Bildsuche), tests/imgsearch.test.mjs, CLAUDE.md
- Warum: Viele genaue Wünsche zeigten nur ein Symbol, obwohl es ein gutes Herstellerbild gibt
- Geprüft: ESLint, Build, `npm test` (16 Tests, davon 4 neu mit simulierten Suchantworten)
- Datenbank und Dienste: keine Migration; nutzt `hit_limit` (0021) und `BRAVE_SEARCH_API_KEY` in Vercel
- Zurücknehmen: Commit reverten
- Merge 8a027c5 (Pull Request #23), `tribunal_verdicts` auf umgesetzt
- Offen: Live-Test mit echtem Schlüssel (Hue Bewegungsmelder)
- Nachtrag Symbol statt leerer Fläche (Jann, Screenshot): api/_lib/match.js (`modelCode`, `lc`, Cache `match4`), api/_lib/imgsearch.js (Deal-Seiten raus, Bild der Erkennung zuerst), src/lib/imgfill.js (nur bei sicherer Erkennung oder fester Marke, Feld `marke` in der Erkennung), src/lib/wishimg.js (`isBlank`), src/views/card.js (Symbol bei Ladefehler), 18 Tests
- Nachtrag 2: src/lib/wishimg.js (`isBlank` vergleicht mit der Eckfarbe, weiße Produkte bleiben), src/lib/imgfill.js (`wishtale:img-tried3`), src/views/wishmodal.js (`OttoLine`, Otto neben Amazon), src/styles/main.css (`.also-shop`); geprüft mit Lint, Build, 19 Tests und einem Browser-Test der Leer-Prüfung
- Nachtrag 3: api/_lib/imgsearch.js (`fits()` verlangt das Produktwort, Marke allein reicht nie, `OTHER` für andere Produkte derselben Marke, Prüfung gegen Wunsch und erkannten Namen), api/inspect.js (`q`, `brand`, Titel im Log), src/lib/imgfill.js (`wishtale:img-tried4`), 21 Tests; falsches Hue-Bild in der Datenbank entfernt

## 2026-11-24 · 115 · Auffindbarkeit bei Google
- Auftrag: Jann im Projekt-Chat („Werden wir trotzdem gefunden?“)
- Geändert: vercel.json (`X-Robots-Tag` für giftlyapp.vercel.app, `/app/…`, `/w/…`), index.html (Open Graph vollständig, Teilen-Bild 1200×630, JSON-LD), impressum.html, datenschutz.html, barrierefreiheit.html (canonical, Fußzeilen ohne `.html`), src/views/shared.js und src/views/auth.js (Links ohne `.html`), CLAUDE.md
- Warum: doppelte Inhalte auf der vercel.app-Adresse, Teilen-Bild im Hochformat, fehlende strukturierte Daten
- Geprüft: ESLint, Build, Live-Abruf von robots.txt, Sitemap, /w/jonas und giftlyapp.vercel.app über Vercel
- Datenbank und Dienste: keine
- Zurücknehmen: Commit reverten
- Offen: Google Search Console (Jann), Inhaltsseiten als Vorschlag
- Nachtrag Ratgeber (Jann im Thread: „Baue die Seite so um das es passt! Also die Unterseiten“): ratgeber/index.html und vier Seiten, src/ratgeber.js, src/styles/main.css (`.guide`), vite.config.js (Eingänge), public/sitemap.xml, index.html (Fußzeile `footer.rg0`–`footer.rg4`, `weihnachten.rg`), Rechtsseiten (Link Ratgeber); geprüft mit ESLint, Build und Bildschirmfotos (iPhone 13, 1280 px, keine waagerechte Rolle)
- Merge 1597bc6 (Pull Request #28) nach Janns Freigabe im Wettbewerbs-Thread („1-5 kannst du direkt bauen und mergen“, Punkt 4 Suchseiten)

## 2026-11-25 · 117 · Gast-Einladung, Umzug von Amazon, fünfte Ratgeberseite
- Auftrag: Jann im Thread („1-5 kannst du direkt bauen und mergen! … 1-4 schnell umsetzen“)
- Geändert: src/views/giver.js (`GuestOwn`), src/actions.js (`guestcta`, Hinweis `guestown`), src/views/given.js (Knöpfe mit Stelle), src/views/modals.js, src/views/wishes.js, src/views/zettel.js (Umzug von Amazon), src/styles/main.css (`.gown`, `.umzug`), index.html (`schritte.umzug`, `footer.rg5`), ratgeber/amazon-wunschliste-umziehen.html plus Links in allen Ratgeberseiten, vite.config.js, public/sitemap.xml, CLAUDE.md
- Warum: Wettbewerbsvergleich vom 24.11.2026 (Wishbob, WishDeck, bitte.kaufen, Amazon), geteilte Listen sind der günstigste Weg zu neuen Konten
- Geprüft: ESLint, Build, 21 Tests, Bildschirmfotos (iPhone 13) von Gastansicht, Startseite und Ratgeberseite, Klick auf den Knopf setzt die UTM-Kürzel
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten


## 2026-11-25 · Dev 116 · Aus jedem Shop speichern
- Was: Fenster „Aus jedem Shop speichern“ mit iPhone-Kurzbefehl (`#zu-wishtale=`), Lesezeichen-Knopf und Android-Hinweis; Menü hinter dem Avatar neu gruppiert; Hinweis im Wunschdialog; FAQ
- Warum: Jann will beim Hinzufügen aus Shops zu Wishbob aufschließen, Option A freigegeben
- Geprüft: ESLint, Build, 21 Tests, Bildschirmfotos (iPhone 13, Desktop), Kurzbefehl-Adresse landet im Wunschdialog-Speicher, Lesezeichen-Knopf öffnet die richtige Adresse
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten

## 2026-11-25 · 118 · Preise von selbst, Link ohne Extra-Schritt
- Auftrag: Jann im Projekt („Man muss erst link einlesen dann speichern. Das muss automatisch gehen“, Preise sollen direkt online kommen)
- Geändert: src/actions.js (`autoTake`, `takeImg`, `prepWish`, `readLinkNow`, Tipp-Pause im Link-Feld, Preis nach dem Speichern), src/views/modals.js (Knopf „Einlesen“ entfernt, Namensfeld nicht mehr Pflicht), src/views/wishprev.js, src/lib/linkname.js (neu), src/lib/pricefill.js (neu), src/lib/wishimg.js (`fetchWishPrice`), src/render.js (`priceBackfill`), api/inspect.js (`priceFor`), api/_lib/imgsearch.js (`priceForWish`), datenschutz.html (Abschnitt 11), Tests `tests/price.test.mjs`, `tests/linkname.test.mjs`, CLAUDE.md
- Warum: Nutzer stolpern über „erst einlesen, dann speichern“, viele Wünsche stehen ohne Preis da
- Geprüft: ESLint, Build, alle Tests, Wunschdialog im Browser (Link ohne Namen speichern, Name aus der Adresse, leerer Dialog zeigt Hinweis)
- Datenbank und Dienste: keine Migration, Brave-Suchen zählen gegen `guardSearch`
- Zurücknehmen: Merge-Commit reverten


## 2026-11-25 · 123 · Fragen und Antworten nach Wishbob-Analyse
- Auftrag: Jann im Projekt („zieh dir mal aus dem chat Wishbob Seitenanalyse alle infos und lass uns an den Verbesserungen arbeiten“)
- Geändert: index.html (Abschnitt `#fragen` mit Schlüsseln `faq.*`, Kopfzeile `nav.nav3`, `nav.nav4`, `FAQPage` im JSON-LD), ratgeber/wunschzettel-kinder.html und ratgeber/wunschzettel-weihnachten.html (Häufige Fragen mit `FAQPage`), src/styles/main.css (`.faq-*`), CLAUDE.md
- Warum: Wishbob hat auf jeder Anlass-Seite Fragen und Antworten, Wishtale hatte keine; hilft Suchmaschinen und Menschen, die vor der Anmeldung zögern
- Geprüft: ESLint, Build, Tests, Bildschirmfotos (Desktop, iPhone)
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten

## 2026-11-25 · 124 · Wunschdialog schlank
- Auftrag: Jann im Projekt-Chat („in allem minimalistischer werden und weniger Text und das Wünsche hinzufügen verbessern“, Wishbob-Suche ohne Seitenwechsel)
- Geändert: src/views/modals.js (ein Feld für Name oder Link mit Lupe, Link-Zeile erst mit Link, Knöpfe Liste einlesen, Amazon-Suche, Aus dem Shop, Art unter Mehr Angaben, Euro-Zeichen), src/actions.js (Link-Zeile einblenden), src/lib/util.js (Symbole camera, store), src/lib/guide.js, src/styles/main.css (`.wq`, `.wl-row`, `.wq-chip`, `.eur`), Dev 124, Dev 009 (claude-2.md)
- Geprüft: ESLint, Build, Tests, Bildschirmfotos Handy und Computer im Demo
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten

## 2026-11-25 · 124 · Wunschdialog mit Ideen, Suchen und Eingeben
- Auftrag: Jann im Projekt-Chat („also erstmal würde ich das interface Ideen / Wunsch suchen / Wunsch eingeben übernehmen“), Quelle „Websuche jetzt, Amazon später“
- Geändert: src/views/wishadd.js (neu: Reiter, Suchfeld und Treffer, eigene Ideen mit „Habe ich schon“, „Erfülle ich mir selbst“, „Passt nicht“), src/views/modals.js, src/actions.js (`wdtab`, `wsown`, `wsadd`, `aiplan`, Suche `runSearch`, Pfeiltasten), src/main.js (geteilte Links und erster Wunsch starten bei „Eingeben“), src/lib/wishimg.js (`searchProducts`), api/inspect.js (op `searchQuery`, Tagesgrenze `guardSearch`), api/_lib/imgsearch.js (`searchProducts`), src/styles/main.css, datenschutz.html (Abschnitt 11, Produktsuche)
- Warum: Wünsche finden, ohne die Seite zu verlassen; Bilder laufen über den eigenen Server, Treffer werden nicht gespeichert
- Geprüft: ESLint, Build, `npm test` (26 Tests), Bildschirmfotos Handy und Computer im Demo mit nachgestellten Treffern (die echte Suche braucht Konto und BRAVE_SEARCH_API_KEY)
- Datenbank und Dienste: keine neue Tabelle, Brave wie bisher
- Zurücknehmen: Merge-Commit reverten

## 2026-11-25 · 125 · Ratgeber Geburtstag und Kindergeburtstag
- Auftrag: Jann im Projekt-Chat („Die Landingpage bekommt Aus Vorschlag A Seiten mit Tipps“)
- Geändert: ratgeber/wunschliste-geburtstag.html, ratgeber/kindergeburtstag-wunschliste.html (neu, Article, Breadcrumb und FAQPage im JSON-LD), ratgeber/index.html (Karten), Fußzeilen aller Ratgeber-Seiten, index.html (Fußzeile mit neuen Schlüsseln `footer.rg6`, `footer.rg7`), public/sitemap.xml, vite.config.js
- Geprüft: Build, Bildschirmfotos am Handy
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten

## 2026-11-25 · 126 · Anmelden mit Google
- Auftrag: Jann im Projekt-Chat („Wir aktivieren Anmelden über Google.. Apple lassen wir noch zurück“)
- Geändert: src/lib/auth.js (`signInGoogle`, `googleOn`, `viaOAuth`, UTM-Kürzel über `wishtale:utm`), src/lib/remote.js (bei Google nur der Vorname fürs Profil), src/views/auth.js (Knopf und Trenner), src/actions.js (`google`), src/main.js (Knopf erst, wenn Google in Supabase an ist; passende Begrüßung), src/styles/main.css (`.gbtn`, `.auth-or`), datenschutz.html (Abschnitt 3 und 7)
- Geprüft: ESLint, Build, Tests, Bildschirmfoto der Registrierung am Handy; der echte Ablauf braucht die Einrichtung bei Google und Supabase
- Datenbank und Dienste: Google als Anmeldeanbieter in Supabase (Einrichtung durch Jann)
- Zurücknehmen: Anbieter in Supabase ausschalten, dann verschwindet der Knopf

## 2026-11-25 · 009 · Listen für besondere Anlässe
- Auftrag: Jann im Projekt-Chat („Wir bauen eine Listenfunktion für besondere Anlässe, legen Sie aber in der Sidebar ab damit sie nicht im Fokus steht“)
- Geändert: supabase/migrations/0032_occasion_lists.sql (neu, `occasion`, `occasion_date`, `public_profile`), src/views/occasion.js (neu), src/lib/remote.js (Abbildung, `deleteProfile`), src/views/menu.js (Gruppe „Besondere Anlässe“), src/views/modals.js, src/views/wishes.js, src/views/giver.js, src/views/wishadd.js (kein Reiter „Ideen“), src/render.js (keine Ideen laden), src/actions.js (`occnew`, `occedit`, `occdel`, Formular `occlist`), api/_lib/share.js (Vorschau mit Listennamen), src/styles/main.css, datenschutz.html (Abschnitt 3)
- Geprüft: ESLint, Build, Tests, Bildschirmfotos im Demo (Anlegen, Liste, Menü, Gastansicht)
- Datenbank und Dienste: Migration 0032 nach Janns Freigabe eingespielt (2026-11-25)
- Zurücknehmen: Merge-Commit reverten; die Spalten können bleiben

## 2026-11-25 · 114 · Nachtrag 4: Modell prüft jedes gefundene Bild
- Auftrag: Jann im Projekt-Thread („noch falsch“, Hue Taster statt Bewegungsmelder)
- Geändert: api/_lib/imgsearch.js (`seesProduct`, `lookFor`, Blick in `searchImage`, `searchOfficialImage`, `imageForWish`), api/inspect.js (`imageQuery` mit Blick), src/lib/imgfill.js (`img-tried5`), datenschutz.html (Abschnitt 11), tests/imgsearch.test.mjs, CLAUDE.md
- Warum: Ein passender Seitentitel garantiert nicht das passende Vorschaubild
- Geprüft: ESLint, Build, 29 Tests
- Datenbank und Dienste: falsches Bild am Hue-Wunsch entfernt, keine Migration
- Zurücknehmen: Merge-Commit reverten

## 2026-11-25 · 127 · Suche bei Amazon oder Otto, Start bei „Eingeben“
- Auftrag: Jann im Projekt-Chat („Bei „Wunsch hinzufügen“ bitte default auf „Eingeben“ starten […] Amazon oder Otto als Auswahl oder so“)
- Geändert: src/views/wishadd.js (Start „Eingeben“, Shop-Auswahl, `wsShop`, `SHOPS`), src/actions.js (`wsshop`, Suche mit Shop), src/lib/wishimg.js, api/inspect.js (`shop` bei `searchQuery`), api/_lib/imgsearch.js (`searchAmazon`, `searchOtto`), src/styles/main.css, datenschutz.html (Abschnitt 11), tests/shopsearch.test.mjs (neu), CLAUDE.md
- Geprüft: ESLint, Build, 31 Tests, Bildschirmfotos am Handy; echte Brave-Treffer für `site:amazon.de`/`site:otto.de` erst nach dem Deploy
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten

## 2026-11-25 · 128 · Bilder sofort, ehrliche Preise, Bilder und ganze Namen in der Suche
- Auftrag: Jann im Projekt-Chat (Bilder zeitversetzt, Preis weicht von Amazon ab, keine Bilder in der Suche, Namen zu kurz)
- Geändert: api/_lib/imgsearch.js (`fullTitle`, `pictures`, `searchAmazon` mit Bildern), src/lib/imgfill.js (`prefetchImage`), src/actions.js (Vorabsuche beim Erkennen, kürzere Wartezeit nach dem Speichern), src/lib/wishimg.js (Bildquelle), src/views/wishadd.js (Hinweistext), src/views/card.js und src/views/product.js („ca.“), src/styles/main.css (Titel bis vier Zeilen), datenschutz.html (Abschnitt 11), tests/shopsearch.test.mjs, CLAUDE.md
- Nachtrag: Suche immer über Otto (sonst andere Shops), „Bei Amazon“ und „Bei Otto“ je Treffer (src/views/wishadd.js, src/actions.js, api/inspect.js)
- Geprüft: ESLint, Build, 33 Tests, Bildschirmfotos am Handy; echte Treffer erst nach dem Deploy
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten

## 2026-11-25 · 129 · Wunschfenster am Handy
- Auftrag: Jann im Projekt-Chat („der popup beim Handy [hängt] unten und man [kann] die Wünsche dahinter scrollen“)
- Geändert: src/styles/main.css (Sperre bei `.scrim`, Wunschdialog fast in voller Höhe), src/actions.js (`touchmove`-Wächter), CLAUDE.md
- Geprüft: ESLint, Build, Playwright mit iPhone-13-Profil (Wischen bei offenem Fenster ändert die Seitenposition nicht), Bildschirmfoto
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten

## 2026-11-25 · 130 · Menü aufräumen
- Auftrag: Jann im Projekt-Chat („Die Profile müssen hoch. Und der Rest geclustert werden“)
- Geändert: src/views/menu.js (Profile oben, vier Gruppen, kaum Unterzeilen), src/styles/main.css (Gruppen als weiße Karten), src/lib/util.js (Symbole `mail`, `phone`), CLAUDE.md
- Geprüft: ESLint, Build, Tests, Bildschirmfotos Handy und Computer
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten

## 2026-11-25 · 131 · Instagram-Erklärserie
- Auftrag: Jann im Projekt-Chat („baue gute reels und Posts und Storys die wir direkt über unser cms raushauen können“)
- Geändert: src/admin/scenes.js (neu, App-Szenen als gezeichnetes Handy), src/admin/canvas.js (Folienart `screen`), src/admin/instagram.js (Auswahl der Szene, Assistent überspringt Handy-Folien), src/admin/ideas.js (elf neue Ideen), CLAUDE.md
- Geprüft: ESLint, Build, alle neuen Ideen in Beitrag, Story und Reel mit Playwright gerendert und angesehen
- Datenbank und Dienste: keine, nichts veröffentlicht

## 2026-11-25 · 132 · Landingpage, nur Wünsche im Fokus
- Auftrag: Jann im Projekt-Chat („Beim Ankommen soll es nur um Wünsche gehen“), Nachtrag zu Sprungmarken bei Google
- Geändert: index.html (Einstieg, Rubriken, Navigation, `alternateName`), src/landing.js (Vorführung raus, Rubriken per Anker), src/styles/main.css (Block `body.lp`), CLAUDE.md
- Geprüft: ESLint, Build, Bildschirmfotos Handy und Computer
- Datenbank und Dienste: keine (bestehende Textänderungen in `site_content` für schritte.p3/p4 bleiben gültig)
- Zurücknehmen: Merge-Commit reverten

## 2026-11-25 · 131 · Nachtrag: Kaufen im Shop für Gäste
- Auftrag: Jann im Projekt-Chat („Bei Vorschau Gäste müssen wir eine slide haben dass es direkt im Shop gekauft werden kann“)
- Geändert: src/admin/scenes.js (Szene `kaufen`: reservierter Wunsch mit „Bei Amazon ansehen“, „Bei Otto“, „Anzeige“), src/admin/ideas.js (`k-gaeste` und `r-reservieren` zeigen sie)
- Geprüft: ESLint, Build, Folien gerendert und angesehen
- Datenbank und Dienste: keine

## 2026-11-25 · 131 · Nachtrag: CMS lädt nach Deploy neu
- Auftrag: Jann (Bildschirmfoto „Importing a module script failed“ im Instagram-Studio nach dem Deploy)
- Geändert: src/admin/main.js (fehlt ein Programmteil nach neuem Deploy, lädt das CMS einmal selbst neu, sonst Hinweis „Bitte lade die Seite neu“)
- Geprüft: ESLint, Build
- Datenbank und Dienste: keine

## 2026-11-25 · 131 · Nachtrag: Plan „Wishtale für Kinder“ eingearbeitet
- Auftrag: Jann im Projekt-Chat („Verbinde dich bitte mit dem Thread Strategie für Kinder - da liegt ein Artefakt zur Instagram Strategie“)
- Geändert: src/admin/scenes.js (Kinder-Szenen kgast, kreserviert, kkaufen, kinfo), src/admin/ideas.js (zehn Ideen nach den vier Säulen des Plans, Highlight-Storys „Für Großeltern“ und „Fragen“)
- Geprüft: ESLint, Build, alle neuen Ideen gerendert und angesehen
- Datenbank und Dienste: keine

## 2026-11-25 · Dev 116 · Hinweis am Computer und Chrome-Erweiterung
- Was: Einmaliger Hinweis zum Lesezeichen-Knopf über der Wunschliste (nur Computer), Chrome-Erweiterung `extension/` (activeTab, kleines Fenster mit dem Wunschdialog), `npm run ext:zip`, Store-Texte, Datenschutz Abschnitt 11
- Warum: Jann möchte Wishtale oben im Browser, ohne dass es nervt; Entscheidungskarte „Erweiterung bauen, Hinweis jetzt“
- Geprüft: ESLint, Build, 33 Tests, Bildschirmfoto Desktop, Erweiterung in Chromium geladen und Klick nachgestellt (öffnet `wishtale.de/app/?share_url=…&share_title=…`)
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten

## 2026-11-26 · Dev 133 · Instagram „API access blocked“
- Auftrag: Jann im Projekt-Chat („Instagram api Access Blocked“)
- Befund: Beitrag vom 26.11. scheitert mit Meta-Code 200 „API access blocked“, am 6.11. gingen drei Beiträge mit denselben Schlüsseln durch. Sperre liegt bei Meta, nicht im Code.
- Geändert: api/_lib/instagram.js (`igMessage()`, Log mit Code und fbtrace_id), tests/instagram.test.mjs
- Geprüft: ESLint, Build, Tests
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten

## 2026-11-26 · 130 · Nachtrag: Gruppe Social Media im Menü
- Auftrag: Jann im Projekt-Chat (Social Media wieder als Gruppe, damit man sieht, dass man Konten verbinden kann)
- Geändert: src/views/menu.js, CLAUDE.md
- Geprüft: ESLint, Build, Tests, Bildschirmfoto Handy
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten

## 2026-11-26 · 131 · Nachtrag: Link zu wishtale.de in jedem Beitrag
- Auftrag: Jann im Projekt-Chat („Wir sollten am Ende des Karussels oder der Reels immer irgendwie einen Link haben, auch wenn nur in der Beschreibung“)
- Geändert: src/lib/iglink.js (neu, `withSiteLink()`), api/_lib/instagram.js (Beitrag und Reel bekommen beim Veröffentlichen die Adresse, falls sie fehlt), src/admin/instagram.js (beim Erstellen Abschlussfolie und Adresse, Hinweis unter der Bildunterschrift), src/admin/ideas.js (Texte nennen wishtale.de), tests/instagram.test.mjs
- Geprüft: ESLint, Build, npm test (38 bestanden)
- Datenbank und Dienste: keine

## 2026-11-26 · 134 · Namen, Bilder und Preise bei Links
- Auftrag: Jann im Projekt-Chat („Wunsch von Amazon“, „Wunsch von Thalia“, LEGO-Bauplatte mit falschem Namen, ohne Bild und Preis)
- Geändert: api/_lib/imgsearch.js (`titleForLink()`, `shortTitle()`, `linkKey()`), api/inspect.js (op `titleFor`, Rückfall bei gesperrten Seiten), src/lib/inspect.js (`linkTitle()`), src/actions.js (Amazon-Link sucht den Namen, Hinweis ohne Namen), src/lib/linkname.js (nie „Wunsch von …“), src/lib/namefix.js (neu, Reparatur älterer Wünsche), src/render.js, tests/linktitle.test.mjs, tests/linkname.test.mjs, CLAUDE.md
- Geprüft: ESLint, Build, npm test
- Datenbank und Dienste: keine neue Tabelle; zusätzliche Brave-Suchen zählen in `guardSearch()`
- Zurücknehmen: Merge-Commit reverten

## 2026-11-26 · 134 · Nachtrag: Bild und Preis für Amazon-Wünsche von Otto
- Auftrag: Jann im Projekt-Chat („Produkttitel rauskopieren … nochmal bei Otto suchen und das Bild nehmen“)
- Geändert: api/_lib/imgsearch.js (`ottoHit()`, in `imageForWish()` und `priceForWish()`, `shortTitle()` ohne Schnitt an „ - “), src/lib/imgfill.js, src/lib/pricefill.js (Amazon-Wünsche immer versuchen, neue Versuchsschlüssel), src/lib/namefix.js (v2), tests/linktitle.test.mjs, CLAUDE.md
- Geprüft: ESLint, Build, npm test (42 bestanden)
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten

## 2026-11-26 · 134 · Nachtrag 2: Vorschlagskarten und Bildquote
- Auftrag: Jann im Projekt-Chat („zu ton in ton“, „Bilder immer noch so lala“)
- Geändert: src/views/wishmodal.js (`AiVariants()` neu), src/views/inspiration.js (`IdeaIcon` exportiert), src/styles/main.css (`.aivars`), api/_lib/imgsearch.js (`ottoHit()` mit Modellnummer, `modelQuery()`, `searchOtto` mit `maxBytes`, Bildersuche mit Modellnummer, Log), src/lib/imgfill.js (`img-tried7`), tests/linktitle.test.mjs
- Geprüft: ESLint, Build, npm test (43 bestanden), Bildschirmfotos der Karten (Handy, Computer)
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten


## 2026-11-26 · 135 · Einstieg der Landingpage als Show
- Commits: f69d1bc (Branch: main)
- Auftrag: Jann im Chat („den Hero … als interaktives Modul … 2-4 Highlights in einer Show“)
- Geändert: index.html (`.lp-show` mit Reitern und drei Folien, Schlüssel `show.*`), src/landing.js (Show-Steuerung, Caveat-Schrift), src/styles/main.css (`.lp-tabs`, `.lp-stage`, `.lp-slide`, `.lp-ideas`, `.lp-kids`), CLAUDE.md, docs/tribunal/135-einstieg-als-show/
- Warum: Die passenden Ideen und die Kinder-Konten sollen beim Ankommen sichtbar sein, passend zur Anzeige in ChatGPT.
- Geprüft: ESLint, Build, Ansicht 390 und 1280 px mit allen drei Folien, keine Fehler in der Konsole; nicht geprüft: echtes Gerät, axe
- Datenbank und Dienste: keine (Eintrag in `tribunal_verdicts` steht noch aus)
- Zurücknehmen: git revert f69d1bc
- Offen: Ob die Show die Klicks auf „Kostenlos Wunschliste anlegen“ erhöht, zeigt die Auswertung (Ereignis `cta`).

## 2026-11-26 · 136 · Registrierung ohne Pflicht-Abfrage
- Commits: siehe Pull Request (Branch: claude/project-thread-16kuo8)
- Auftrag: Jann im Chat („Einstieg von Landing in die Wunschliste muss zack zack gehen“)
- Geändert: src/render.js (`#start` → Registrierung), src/state.js (`draftHasData` mit `quick`), src/lib/auth.js (`quick` nur bei leerem Konto), src/main.js (kein Wunschfenster nach der Anmeldung), src/views/auth.js (kürzerer Text), src/views/profile.js und src/actions.js (Einrichtung mit Konto ohne Startwahl, „Später“), src/lib/steps.js und src/views/steps.js (Profil als zweiter Schritt, „Als Nächstes“), src/views/inspiration.js (Hinweis führt zur Einrichtung), src/styles/main.css
- Geprüft: ESLint, Build, Ansicht 390 und 1280 px mit simuliertem Google-Konto (Registrierung, leere Liste, erster Wunsch, Erste Schritte, Einrichtung)
- Datenbank und Dienste: keine
- Zurücknehmen: Merge-Commit reverten
- Nachtrag: Wünsche ohne Konto im Browser (`guestDraft()`, `SaveHint()`, `adoptDraft()` übernimmt Wünsche, `draftPayload` mit Wünschen), Wunschdialog ohne Konto nur Formular, datenschutz.html Abschnitt 7. Geprüft mit simuliertem Ablauf: Wunsch ohne Konto, Neuladen, Teilen, Rückkehr von Google, Wunsch wird ins Konto geschrieben.
