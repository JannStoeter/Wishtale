---
topic: 116-wuensche-aus-anderen-shops
status: entschieden
option: A
datum: 2026-11-25
umgesetzt: cbaabc4c8634f6ac3f0cd2ae8dc8099d8fe74904
---
**Jann im Projekt-Thread:** „Ja Bau es ein. Dann müssen wir aber die rechte Sidebar wie wir die Einstellung ja finden werden aufräumen damit der Nutzer des auch findet“ (Antwort auf die Beschreibung von Option A).

Umsetzung: Neues Fenster „Aus jedem Shop speichern“ (`ShopSaveModal()` in `src/views/shopsave.js`, `src/lib/shopsave.js`). Am iPhone ein Kurzbefehl „Zu Wishtale“ im Teilen-Menü, der `wishtale.de/app/#zu-wishtale=<Shop-Link>` öffnet (`takeShare()` in `src/lib/pwa.js` nimmt den Link roh oder codiert an). Solange `SHORTCUT_URL` leer ist, zeigt das Fenster die Anleitung zum Selbstanlegen; mit dem iCloud-Link von Jann erscheint der Knopf „Kurzbefehl hinzufügen“. Am Computer ein Lesezeichen-Knopf (`bookmarklet()`), der `?share_url=…&share_title=…` öffnet (Titel ohne „| Shopname“). Auf Android bleibt das Teilen-Ziel der installierten App. Danach öffnet sich wie bisher der Wunschdialog und liest den Link.

Menü hinter dem Avatar neu geordnet: Mein Wishtale, Wünsche hinzufügen (Aus jedem Shop speichern, Wunschzettel, Wishtale als App), Für dich, Teilen (Link teilen, Wer sieht was, Jemanden einladen), Meine Profile, Konto und Hilfe. Zusätzlich ein leiser Hinweis im Wunschdialog unter dem Link-Feld und eine neue FAQ.

Offen: iCloud-Link des fertigen Kurzbefehls (muss auf Janns iPhone angelegt werden). Browser-Erweiterung (B) und Store-App (C) bleiben offen.

Nachtrag (2026-11-25 abends, Jann im Thread): „Im Browser mit dem Lesezeichen – können wir das nicht oben (wo die Lesezeichen auch sind) einblenden? Lesezeichen setzen und aus jedem Shop Wünsche erstellen (immer ohne dass es nervt)“. Eine Website darf kein Lesezeichen selbst anlegen, darum auf der Entscheidungskarte „Erweiterung bauen, Hinweis jetzt“ (Option B dazu).

Umsetzung: Einmaliger Hinweis `bookmark` über der Wunschliste, nur am Computer mit Maus ab zwei Wünschen (`src/lib/tips.js`, `src/views/tips.js`): Knopf „Zu Wishtale“ zum Hochziehen, „So geht es“, „Brauche ich nicht“; nach dem Hochziehen (dragend) verschwindet er. Chrome-Erweiterung in `extension/` (Manifest V3, nur `activeTab`): Klick auf das Symbol öffnet ein kleines Wishtale-Fenster mit `?share_url=…&share_title=…`. Paket mit `npm run ext:zip`, Store-Texte in `extension/STORE.md`. Datenschutz Abschnitt 11 ergänzt. Offen: Entwicklerkonto im Chrome Web Store (Jann, 5 $), Hochladen, Prüfung durch Google; Firefox und Edge danach.
