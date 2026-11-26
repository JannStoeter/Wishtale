# Entscheidungen von Jann

Diese Datei spiegelt Janns Urteile aus der Entwickler-Seite ins Repository, damit auch ChatGPT sie kennt. Sie gelten als Produktentscheidungen: Wer ihnen widerspricht, braucht ein neues, begründetes Tribunal. Claude aktualisiert sie beim Abgleich (Quelle ist die Tabelle `tribunal_verdicts`).

Stand: 2026-11-26

## Grundsätze des Produkts
- **Kern bleibt frei:** Profil, Wunschliste, Gast-Link, anonymes Reservieren und Kind-Konten ohne Zahlenlimit. Darüber ziehen wir die Grenze nach Kosten: Der Katalog ist das kostenlose Niveau, KI-Funktionen gehören zu Plus.
- **Gäste zahlen nie.** Wer beschenkt wird, trägt die Kosten, nicht die Schenkenden.
- **Die Überraschung bleibt.** Beschenkte sehen nie, wer reserviert hat, und nie, was jemand geschenkt hat.
- **Vorschläge sind immer erkennbar** als Vorschlag von Wishtale und nie wie die Wahl der Person gestaltet.
- **Keine Anlass-Auswahl an Wünschen** (Geschenke passen zu jedem Anlass, Wünsche werden nicht getaggt). Für besondere Anlässe wie Hochzeit oder Taufe gibt es eigene Listen im Menü (009).
- **Planung (Janns Aktionen, Stand 2026-11-09):** Jetzt: 015, 019 (016 und 017 erledigt). Als Nächstes: 005, 006, 011, 012 („Wichtig!“), 013, 018, 022. Später: 001, 004 (Beta soll voll laufen), 008 (Mailanbindung nötig), 010. Backlog: 002, 007, 009, 014, 021. Ziel: Das Produkt mit den heutigen Funktionen auf den Markt bringen.
- **Chat mit Claude ist die zentrale Stelle.** Auf der Entwickler-Seite wird gesammelt, gebaut wird erst nach Freigabe und „Abgleich“.

## Urteile

| Nr. | Frage | Urteil | Umgesetzt |
|---|---|---|---|
| 093 | Geführter Rundgang, klickbarer Profilschritt und FAQ | **Jann im Chat:** Themen als echte Klickführungen, Profilhinweise direkt bedienbar, häufige Fragen in der Hilfe. | ja, `94b11c1` |
| 092 | Vorschläge zurück in die Hauptansicht und Logo als Heimweg | **Jann im Chat:** Eigene Vorschläge unter den Wünschen. Die Zeile „Deine Vorschau“ bleibt mit Augensymbol zum Aus- und Einblenden stehen, zusätzlich im Menü einschaltbar. Karten und Hinweis bleiben. Eigenes App-Logo zur Wunschliste. Ersetzt 082 nur bezüglich entfernter eigener Ideen. Subdomain zurückgestellt. | ja, `8d70841`, Nachbesserung `e7c27fb` |
| 003 | Sichtbarkeit: Stufe „Nur Schenkende“ behalten? | **B: Streichen.** Nur „Für alle mit Link“ und „Privat“. Die KI darf Privates zur Orientierung nutzen, zeigt es Gästen aber nie. | ja, `f700dd4` |
| 016 | Barrierefreiheit erneut prüfen und beheben | **A: Jetzt.** Prüflauf über 15 Ansichten ohne Befund, zwei Befunde behoben. Handtests stehen aus. | ja, `77a5eba` |
| 017 | Missbrauchsschutz für KI-Aufrufe | **A: Tageslimits in der Datenbank** je Adresse, Konto und gesamt. | ja, `77a5eba` |
| 024 | Produktbilder beim Anlegen eines Wunsches (Anweisung von Jann) | **A: Bild der Shopseite übernehmen**, eigener Speicher, Amazon und idealo nicht ausgelesen. | ja, `231c2c5` |
| 026 | Bildsuche im Netz für Wünsche ohne Bild (Anweisung von Jann) | **B: Bildersuche direkt übernehmen** (Brave Search API), Risiko von Jann bewusst übernommen. | ja, `160536a` |
| 023 | Landingpage klarer und auf Anmeldungen ausrichten | **B: Schlanker neu aufbauen**, Claude und ChatGPT einig. Zweiter Schritt auf Janns Wunsch: Vorführung mit vier Ansichten und eigenen Fotos (`ccc3793`). | ja, `442abf4` |
| 028 | Überall KI statt reiner Produktliste (Anweisung von Jann) | **A: KI überall, Katalog nur als Rückfall.** Offen: „Eigene Idee prüfen“. | ja, `861d8d0` |
| 029 | Jonas als echtes Beispielprofil mit Konto (Anweisung von Jann) | **A: Echtes Profil `jonas` (is_demo) mit Konto, KI läuft.** | ja, Datenbank |
| 030 | Fehlerbehebung: Amazon-Suche leer, Marke „Toni“ falsch gedeutet (Meldung von Jann) | **A: Name übernehmen und Amazon direkt öffnen, KI-Prompt auf Markenwelt schärfen.** | ja, `9f98f20` |
| 031 | Amazon-Wunschliste komplett einlesen (Frage und Anweisung von Jann) | **A: Eingefügter Text oder Screenshots, KI liest Produkte und Preise.** Kein Scraping. | ja, `e1dfb21` |
| 032 | „Liste einlesen“ stärker hervorheben (Anweisung von Jann) | **A: Erste Szene der Vorführung, Hero-Text, große Karte in der App.** | ja, `9d53ba5` |
| 033 | Anmeldung nach der Bestätigungsmail (Meldung von Jann) | **A (teilweise):** Hinweis „angemeldet“ in der App gebaut, Weiterleitung muss Jann in Supabase setzen (034). | App ja, `6645363` |
| 035 | Amazon-Link lesen: unklar, ob übernommen (Meldung von Jann und Joana) | **A: Deutliche Rückmeldung, Namensfeld markiert und fokussiert.** | ja, `fc117f4` |
| 036 | Link oder Amazon-Titel einlesen (Anweisung von Jann) | **A: Feld erkennt Link oder Text, KI liest den Titel.** | ja, `25a31f9` |
| 037 | Vorschau schon beim Anlegen eines Wunsches (Rückmeldung von Jann) | **A: Titel gelesen, Produkt wird gesucht, Vorschläge schon im Formular.** | ja, `84e9aa1` |
| 038 | Pinterest-Kurzlink aus der App wird nicht erkannt (Meldung von Jann) | **A: pin.it serverseitig auflösen.** | ja, `4854398` |
| 040 | Leerzustand positiv und Willkommens-Rundgang (Anweisung von Jann) | **A: Positive Texte, Rundgang beim ersten Login.** | ja, `a496aaf` |
| 044 | „Habe ich schon“ bei KI-Vorschlägen (Anweisung von Jann) | **A: Knopf am Vorschlag, Produkt wird als vorhanden gemerkt.** | ja, `3cade8a` |
| 045 | „Hierfür keine Vorschläge generieren“ pro Wunsch (Anweisung von Jann) | **A: Schalter pro Wunsch, Hinweis mit Namen des Nutzers (bei Kindern das Elternteil).** | ja, `c85b1d6` |
| 041 | Bestätigungsmails vom eigenen Absender | **A: united domains als SMTP-Server.** Eingerichtet und von Jann getestet. | ja, Einrichtung durch Jann |
| 043 | Sicherheitscheck vor dem Launch (Auftrag von Jann) | **A: Hoch und Mittel vor dem Launch.** Teil 1 von Claude umgesetzt, Rest bei Jann und offen. | teilweise, `903df74` |
| 039 | Vorbereitete Profile verschenken (Einladungslink) | **A: Einladungslink ohne vorab angelegtes Konto**, Claude und ChatGPT einig. | ja, `3d8bc76` |
| 046 | Kind-Konten von mehreren Personen verwalten | **A, begrenzt auf ein zweites Elternteil: Verwaltet von, Einladungslink, Abgeben und Entfernen** | ja, `9e716f1` |
| 047 | Gast-Ansicht: Wünsche zuerst | **A: Wünsche zuerst, dann „Nicht das Passende dabei?“ mit Preisrahmen nur für Vorschläge**, Claude und ChatGPT einig. | ja, `9db59dc` |
| 048 | Gast-Ansicht: Feinschliff | **Anweisung: Bitte nicht/Hat schon in die Seitenleiste, Liste statt Groß, Sortierung** | ja, `3ffe30a` |
| 049 | Info-Welt zum Profil | **Anweisung: Profilkopf öffnet ein gestaltetes Fenster über die Person, Seitenleiste entfällt** | ja, `4e37d6a` |
| 050 | Startseite nach der Anmeldung | **C: Start auf Wünsche, Reiter Wünsche, Inspiration, Profil, Historie**, Claude und ChatGPT einig. | ja, `7de0085` |
| 051 | Vorschau auf der Wunschseite | **Anweisung: Umschalter „So sehen Schenkende es“ auch auf der Wunschseite** | ja, `6d07a2f` |
| 052 | Testlauf: Ladezeit und Handhabung | **Anweisung: KI ohne langes Nachdenken, Server in London, Vorladen; 15 Handhabungsbefunde behoben** | ja, `f3e994c` |
| 053 | Wunsch-Dialog: Erkennung | **Anweisung: vage Hinweis, konkret eine Karte mit Passt/Nicht das Richtige, danach klickbare Alternativen; Schwelle 0,75** | ja, `2a439a9` |
| 054 | Leere Profile, Leerzustand, Start, Igel im Detail | **Anweisung: freundlicher Hinweis bei dünnem Profil, einladender Leerzustand, Start auf der Wunschliste, exakte Suche zuerst** | ja, `e64e636` |
| 056 | Wunschliste wieder konkret, Amazon bei Shop-Links | **Anweisung: Tipp von Wishtale in der Zeile, Bei Amazon zu finden, Shop-Links zusätzlich mit Amazon** | ja, `1b75176` |
| 057 | Produktbild von der Herstellerseite | **Anweisung: zuerst Hersteller- oder Shopseite per Websuche, dann Bildersuche; braucht den Brave-Schlüssel (027)** | ja, `f97b13c` |
| 027 | Brave-Schlüssel setzen | **A: Schlüssel von Jann eingetragen, live geprüft (Tonies, Schlummerwal, AirPods)** | ja, `4b13088` |
| 055 | Geführtes Onboarding | **A: Checkliste Erste Schritte, ausblendbar und wieder aufrufbar**, Claude (ChatGPT noch nicht gefragt) | ja, `de6e4ab` |
| 058 | Bestimmtes Produkt ohne Link | **Anweisung: genauer Wunsch ohne Link ist das gewünschte Produkt, kein Vorschlag** | ja, `3516819` |
| 059 | Vorschläge beim Thema, Kategorien | **Anweisung: keine fremden Wünsche als Vorschlag, Spielzeug & Basteln, Kategorie aus der Erkennung** | ja, `d349cdc` |
| 060 | Landingpage: Höhen der Vorführung | **Anweisung: gleiche Höhe, alles auf dem ersten Bildschirm** | ja, `1e7da77` |
| 061 | Erkennung beim Tippen | **Anweisung: Suche beim Tippen und Einfügen, Websuche, ehrliche Rückmeldung, Link im Namensfeld** | ja, `8be6c14` |
| 062 | Liste einlesen mit Abgleich | **Anweisung: Abgleich im Hintergrund, Übernahme per Haken** | ja, `bba184c` |
| 063 | Amazon-Direktlink über Websuche | **Anweisung: nach Passt direkter Produktlink mit Partner-Kennung, Schwelle 85 Prozent** | ja, `0cd1891` |
| 064 | Animation beim Prüfen | **Anweisung: Lupe, Glanz und Schritte beim Produktabgleich** | ja, `b4fd258` |
| 065 | Vorschlag übernehmen | **Anweisung: Knopf Dieses Produkt übernehmen im Wunsch-Detail, mit Rückgängig** | ja, `19adc42` |
| 066 | Abgleich mit Trefferzeilen | **Anweisung: Händler-Trefferzeilen als Beleg, Sets und Supportseiten ausgeschlossen** | ja, `3e975bc` |
| 067 | Fehlerbehebung Keine Vorschläge, Kachelpreis, Priorität | **Anweisung: Amazon-Produkt bleibt, Preis in Kacheln, Wichtigkeit per Auswahl, Sehr wichtig** | ja, `09c6740` |
| 068 | Amazon-Direktlink bei englischen Titeln | **Anweisung: Modellauswahl unter den Amazon-Treffern, Knopf für bestehende Wünsche** | ja, `e4b1709` |
| 069 | Kind-Konten: Alter und Größe | **Anweisung: Geburtsdatum (Gäste sehen nur das Alter), Kleidergröße, altersgerechte Vorschläge und Marken** | ja, `21a3aea` |
| 070 | Einstieg und Profil cleaner | **Anweisung: erster Bildschirm nur ein Feld, Schritte als Zeile, Profil kompakt** | ja, `7df08c4` |
| 071 | Erkennung ab zwei Wörtern | **Anweisung: Erkennung schon ab zwei Wörtern, Hinweis zum Genauer-Schreiben** | ja, `3fcfb16` |
| 072 | Welten vorerst ausblenden | **Anweisung: Welten ruhen, Daten bleiben, Schalter in `flags.js`** | ja, `b995ad8` |
| 073 | Inspiration ausblenden, Entwicklermodus | **Anweisung: Seite Inspiration ruht, Entwicklermodus unter /dev/#entwickler** | ja, `4045a40` |
| 074 | Wünsche-Seite am Handy | **Durch 075 erledigt: Wünsche nach vorn, Einlesen als Zeile, Filter hinter Knopf** | ja, siehe 075 |
| 075 | Nutzerzentrale und reduzierte Schenkendenansicht | **Anweisung: keine untere Navigation, Menü hinter dem Avatar, Zurück zur Wunschliste, Kurzer Rundgang** | ja, `859c20f` |
| 076 | Gastansicht: weniger Text unten | **Anweisung: ein Abschnitt Ideen von Wishtale, Erklärtexte auf eine Zeile** | ja, `33a7753` |
| 079 | Habe ich schon bei Vorschlägen, eine gemeinsame Ansicht | **Anweisung: Ideen unter den eigenen Wünschen mit Habe ich schon, Vorschau als kleiner Link** | ja, `274bea5` |
| 080 | Start nach der Anmeldung auf den Wünschen | **Anweisung: Zu meinem Wishtale führt auf app/#wuensche** | ja, `3be20ff` |
| 081 | Preisrahmen zurück, Filter-Symbol | **Anweisung: schmale Preiszeile bei allen Ideen, Regler-Symbol statt Lupe** | ja, `8bbdd6d` |
| 082 | Geschmack schärfen mit Karten | **A: feste, konkrete Karten, Ja ist kein Wunsch, nur die Idee wird ausgeschlossen, Ideen unter den eigenen Wünschen entfernt** | ja, `422106e` |
| 083 | Erledigte Wünsche aus der Liste | **Anweisung: Statusschalter weg, Erledigtes im Profil unter Das habe ich schon mit Pfeil zurück** | ja, `584eb9e` |
| 084 | Wunschliste hochladen als Highlight, Reel dazu | **Anweisung: grüne Leiste mit Gold in der App, Reel Wunschzettel (promo:zettel)** | ja, `33e0924` |
| 085 | Grafikfehler bei Vorschlägen im Wunsch | **Befund behoben: Knöpfe der Vorschläge umbrechen am Handy** | ja, `0cb44e7` |
| 086 | Landingpage fokussiert aufs Produkt | **Anweisung: echte App-Ansichten im Einstieg, Jetzt neu Hochladen, ein klarer Knopf, klebender Knopf am Handy** | ja, `41e62c0` |
| 087 | Kurze Reels mit Aufhänger | **Anweisung: drei Reels zu 10 bis 11 Sekunden, Aufhänger im ersten Bild (Geschenk, Zettel, POV)** | ja, `5e42770` |
| 088 | Ideen erfinden Fakten, Gäste sehen Passt nicht | **Befund behoben: nur belegte Fakten in Begründungen, Passt nicht nicht mehr bei Gästen** | ja, `8153ca9` |
| 090 | ChatGPT darf programmieren | **Anweisung: nach Konventionen in AGENTS.md, Ankündigung in bau.md, Branch chatgpt/…, Pull Request** | ja, `2bef5b3` |
| 091 | ChatGPT lädt selbst hoch, mit Log; Zulieferer | **Anweisung: direktes Hochladen nach Regeln in AGENTS.md, Log in docs/log/, weitere Sprachmodelle nur als Zulieferer** | ja, `6acff37` |
| 094 | Vorschläge ruhiger, am Handy eingeklappt, Link mit einem „Passt“ | **Jann im Chat:** Eigene Vorschläge am Handy standardmäßig eingeklappt mit leisem Hinweis zum Öffnen, Karten mit kurzer Begründung und leisen Textknöpfen statt großer Buttons, doppeltes Einlesen des Links behoben. Ändert die Kopfzeile aus 092. | ja, `3839b2d` |
| 095 | Wishtale als App | **Jann im Chat: Stufe 1 bauen.** Installierbare Web-App mit Manifest, Service Worker, Offline-Seite, Menüpunkt und Hinweis, Teilen an Wishtale auf Android. Stores (Stufe 2) offen bis Plus-Plan und Kaufwege geklärt. | ja, `dee25e9` |
| 096 | iPhone-Anleitung als nachgebaute Ansicht | **Jann im Chat: als Ansicht nachbauen, aktuelles iOS.** Nachgebauter Bildschirm mit tippendem Finger für Safari ab 26, ältere Versionen und andere Browser, mit Steuerung und barrierefreiem Text. | ja, `d469667` |
| 097 | Geräte je Bereich, Admins nicht mitzählen | **Jann im Chat.** Auswertung nach Landingpage, eigener App und Gast-Link getrennt, Ereignis `app_open`, Migration 0029, Admins zählen nicht mit. | ja, `632c4e7` |
| 098 | Handy-Prüfung und hellere Farbwelt | **Jann im Chat: Vorschlag gefällt, Überschrift in eine Zeile, bauen.** Schritt 1: hellerer Grund, weiße Karten, Platzhalter in Kategoriefarben, ruhiger erster Bildschirm, ein Hinweis zur Zeit. Schritt 2: Wunsch-Ansicht ohne Doppelungen, kürzere Dialogtexte, ruhige Gast-Ideen. | ja, `3c73134`, `715d550` |
| 099 | Vorschläge als eigene Fläche | **Jann im Chat: Ideen grafisch abgrenzen.** Hell salbeigrüne Fläche mit weißen Karten, am Handy wischbar, eigene und Gastansicht. | ja, `6db7114` |
| 100 | Kategorien smart machen | **Jann im Chat: Stufe 1 bauen, Sport/Fitness und Outdoor/Wintersport trennen.** 22 Kategorien, Sonstiges als Auffang, KI ordnet Unbekanntes ein, ältere Wünsche einmal neu sortiert. Stufe 2 (eigene Gruppen) offen. | ja, `b903d71` |
| 101 | Besitz im Profilweg | **Jann im Chat: Besitz über den Profilweg angeben, nicht bei den Wünschen.** Neuer Schritt „Was hast du schon?“ in der Profil-Einrichtung, Profil-Abschnitt immer offen. | ja, `ff88dfd` |
| 102 | Teilen-Link mit Vorschau, Reservieren in der Gastliste | **Jann im Chat: Punkt 1 und 2 als Erstes bauen.** Link wishtale.de/w/<kürzel> mit Vorschau für Messenger, Knopf „Reservieren“ an jedem freien Wunsch. | ja, `a94caaa` |
| 103 | Restliche optische Befunde | **Jann im Chat: die anderen optischen Bugs auch ändern.** Klare Unterzeilen, Band wegklickbar, Profil-Sichtbarkeit lesbar, Sprung zu Ideen, Landingpage hell mit neuen App-Bildern. | ja, `af0d97e` |
| 104 | Funktionen im richtigen Moment zeigen | **Jann im Chat: smart statt Werbung, Kind-Konten-Hinweis bei Kinderspielzeug.** Baustein für Hinweise, erster Fall Kind-Konten. Weitere Hinweise offen (Vorschläge in claude.md). | teilweise, `118fc42` |
| 105 | Geteilte Links im CMS zählen | **Jann im Chat.** Gastansicht meldet Aufrufe über /w/ getrennt, CMS-Karte „Geteilte Links“, Migration 0030. | ja, `49fd530` |
| 106 | Launch-Checkliste | **Jann im Chat: Vercel und Supabase auf Pro, „Bitte baue alles“.** Sicherheitsfix (0031), drei Hinweise, Reservierung per Mail für Gäste. Teil A (Mail-Einstellungen, Verträge, Limits) bei Jann. | ja, `bcb9a99`, `ebaca53` |
| 108 | Wunsch selbst erfüllt | **Jann im Chat: dezent in der Ansicht, danach Glückwunsch mit Fundort.** Textknopf „Selbst erfüllt“, kleines Fenster mit Rückgängig, Ansehen, Fertig. | ja, `7e50069` |
| 109 | Landingpage zur Weihnachtskampagne | **Jann im Chat: „Bau ruhig so zu Ende“.** Weihnachtsabschnitt mit Familie, Kinder, Ideen und Sprungmarken für Sitelinks, verschwindet ab 27.12. | ja, `1d6f7a0` |
| 110 | Otto-Links über Awin | **Jann im Chat: bei Awin für Otto angenommen, Links umstellen.** Otto-Adressen werden beim Anzeigen zum Awin-Deeplink mit Click Reference je Wunsch, Kennzeichnung „Anzeige“, Datenschutz Abschnitt 9. | ja, `9b1458a`, `a500bcc` |
| 111 | Mehr Amazon-Käufe ohne Werbeseite | **Jann im Chat: alle vier, Direktlink über Brave ausbauen.** Kaufweg nach dem Reservieren, direkter Amazon-Link für genaue Wünsche, neutraler Link-Hinweis, Klickmessung `shop_click`. | ja, `5a4d6df` |
| 112 | Symbole statt Buchstaben bei Wünschen ohne Bild | **Jann im Projekt-Thread: passendes Icon statt Buchstabe (Pullover bei Kleidung).** Stichwort im Namen, dann Kategorie, sonst Geschenk (`src/lib/wishicon.js`). | ja, `f3ccb21` |
| 113 | Inspirationskarte neu gestalten | **Jann im Projekt-Thread: Karte der Inspiration gefällt nicht, überarbeiten.** Symbol, ein Hauptknopf, Shops als Pillen, Nebenaktionen leise; Amazon und Otto direkt, sonst öffnet die Karte ein Fenster (`IdeaCard()`, `IdeaModal()`). | ja, `1aa2803` |
| 114 | Echte Produktbilder über Brave | **Jann im Projekt-Thread: möglichst viele echte Bilder über Brave; Karte: Ideenkarten behalten das Symbol, Bild erst auf der Wunschliste.** Bilder je Wunsch nach dem Speichern und nach und nach für ältere Wünsche, bessere Trefferprüfung, Tagesgrenzen für Brave. | ja, `8a027c5` |
| 115 | Wird Wishtale gefunden? (SEO-Grundlagen) | **Jann im Projekt-Chat: prüfen, ob Wishtale gefunden wird.** Fixes (noindex für giftlyapp.vercel.app, App und Gast-Links, Teilen-Bild im Querformat, strukturierte Daten, canonical der Rechtsseiten) und, auf Janns Wunsch im Thread, Ratgeber mit vier Seiten unter `/ratgeber`; Search Console richtet Jann ein. | ja, `1597bc6` |
| 117 | Vorschläge 1 bis 4 aus dem Wettbewerbsvergleich | **Jann im Thread: „1-4 schnell umsetzen“, bauen und mergen.** Einladung am Ende der Gastansicht mit UTM-Messung (`guestcta`), Umzug von Amazon per Screenshot oder Text sichtbar gemacht, Ratgeberseite „Amazon-Wunschliste mitnehmen“, Pressemappe als Dokument. Punkt 5 in Dev 116. | ja, `8edab0c` |
| 118 | Preise von selbst und Link ohne Extra-Schritt | **Jann im Projekt: „Das muss automatisch gehen“.** Link wird beim Einfügen gelesen und von selbst übernommen, Speichern wartet kurz darauf, Knopf „Einlesen“ entfällt. Wünsche ohne Preis bekommen den echten Preis der eigenen Shopseite oder der Hersteller- oder Shopseite (nur Euro, nur bei eng passendem Titel, nie geschätzt). | ja, `ee737d6` |
| 124 | Wunschdialog schlank, mit Ideen, Suchen und Eingeben | **Jann im Projekt:** Reiter „Ideen / Wunsch suchen / Wunsch eingeben“ für die eigene Liste, Ideen behalten „Habe ich schon“, „Erfülle ich mir selbst“, „Passt nicht“. Quelle der Suche: Websuche jetzt, Amazon und Otto später (Option D). | ja, `76765ff` |
| 125 | Ratgeber Geburtstag und Kindergeburtstag | **Jann im Projekt:** „Die Landingpage bekommt aus Vorschlag A Seiten mit Tipps.“ | ja, `f40c682` |
| 126 | Anmelden mit Google | **Jann im Projekt:** Google aktivieren, Apple später. Knopf erscheint, sobald Google in Supabase eingeschaltet ist. | ja, `fa2b519` (Einrichtung bei Google und Supabase offen) |
| 127 | Suche bei Amazon oder Otto, Start bei „Eingeben“ | **Jann im Projekt:** „Bei „Wunsch hinzufügen“ bitte default auf „Eingeben“ starten […] Amazon oder Otto als Auswahl oder so“. Amazon ohne Bild und Preis (Partnerregeln), Otto mit beidem. | ja, `f7a9299` |
| 128 | Bilder sofort, ehrliche Preise, Bilder und ganze Namen in der Suche | **Jann im Projekt:** „Bilder … erst zeitversetzt“, „der Preis … ist nicht gleich zu Amazon“, „in der Suche sind keine Bilder“, „Text … zu kurz“. Amazon-Bilder und -Preise erst mit der Creators API (10 Verkäufe in 30 Tagen). | ja, `35d99a5` |
| 129 | Wunschfenster am Handy | **Jann im Projekt:** „der popup … hängt unten und man [kann] die Wünsche dahinter scrollen“. Hintergrund gesperrt, Wunschdialog fast in voller Höhe. | ja, `096a259` |
| 130 | Menü aufräumen | **Jann im Projekt:** „Die Profile müssen hoch. Und der Rest geclustert werden“. Profile oben, vier ruhige Gruppen. Nachtrag: Gruppe Social Media. | ja, `871f5a3` |
| 131 | Instagram-Erklärserie | **Jann im Projekt:** „baue gute reels und Posts und Storys die wir direkt über unser cms raushauen können“. Folienart „App-Ansicht“ mit gezeichnetem Handy, elf fertige Ideen im Instagram-Studio. | ja, `55a7c24` |
| 132 | Landingpage, nur Wünsche im Fokus | **Jann im Projekt:** „Beim Ankommen soll es nur um Wünsche gehen… alles andere beim Scrollen oder auf Click zu Rubriken“. Einstieg mit einem Knopf und Beispielliste, Rest als Rubriken, Hauptnavigation am Computer. | ja, `d77d966` |
| 133 | Instagram meldet „API access blocked“ | **Jann im Projekt:** „Instagram api Access Blocked“. Sperre liegt bei Meta (Code 200, am 6.11. ging es noch). Fehlermeldung mit Code und Hinweis, Log mit fbtrace_id; Schritte in Meta bei Jann. | ja, `c5a4dc8` |
| 134 | Namen, Bilder, Preise bei Links | **Jann im Projekt:** „„Wunsch von Amazon“ war eigentlich ein Buch … Warum heißt der falsch und hat kein Foto? Warum hat der keinen Preis?“ Name über die Produktnummer aus der Suche, nie mehr „Wunsch von …“, ältere Wünsche einmal repariert. | ja, `a7435b8` |
| 135 | Einstieg als Show | **Jann im Chat:** „den Hero … als interaktives Modul was eine Liste zeigt, dann diese ‚Geschenkideen, die wirklich passen‘ und Kinderkonten“. Drei Reiter mit Wunschliste, passenden Ideen und Kind-Konto, ersetzt aus 132 „keine Vorführung mit Reitern“. | ja, `f69d1bc` |
| 136 | Auswertung „Heute“ und Funnel | **Jann im Projekt:** „Baue im CMS eine Auswertung für ‚heute‘ ein … sehen, wo der Nutzer abspringt und warum er kein Konto anlegt.“ Zeitraum Heute, Ereignis `step` für die Schritte bis zum Konto, `admin_funnel()` je Herkunft, ohne Cookies. | ja |
| 137 | Registrierung ohne Pflicht-Abfrage | **Jann im Projekt:** „Einstieg von Landing in die Wunschliste muss zack zack gehen“, danach „Wünsche erst im Browser“ und „lieber registrieren über Google“. Registrierung mit Google zuerst, Weg ohne Konto leise darunter, Profil freiwillig. | ja |
| 009 | Listen für besondere Anlässe | **Jann im Projekt:** Option A als eigene Funktion, aber im Menü statt im Fokus; Wünsche werden nicht getaggt, die eigene Liste bleibt der Kern. | ja, `5348918` (Migration 0032 eingespielt) |
| 116 | Wünsche aus anderen Shops | **Jann im Projekt-Thread: Option A bauen und das Menü aufräumen.** Kurzbefehl am iPhone, Lesezeichen-Knopf am Rechner, neues Fenster „Aus jedem Shop speichern“, Menü neu gruppiert. Nachtrag: Hinweis am Computer und Chrome-Erweiterung (`extension/`), Store-Konto offen. Store-App offen. | ja, `cbaabc4` |

## Offen (noch kein Urteil)
Alle offenen Punkte des Projekts liegen als Ordner in `docs/tribunal/`. Jann entscheidet auf der Entwickler-Seite, ob er dazu Meinungen möchte.
- 001 Wie viel KI gehört in den kostenlosen Plan? (Entscheidung)
- 002 Zweiter Affiliate-Partner: Awin jetzt oder später? (Entscheidung)
- 004 Was soll Wishtale Plus kosten, und in welcher Form? (Entscheidung)
- 005 Marken und „Das möchte ich ausprobieren“ leichter machen (Entscheidung)
- 006 Profileinstellungen: Umfang der neuen Seite (Entscheidung)
- 007 Guthaben (Credits) abbuchen: überhaupt anbieten? (Aufgabe)
- 008 Erinnerungen („Letztes Jahr hast du … geschenkt“, Geburtstage) (Entscheidung)
- 010 Eltern-Grenze bei Kind-Konten (zum Beispiel 150 €) mit diskretem Hinweis (Entscheidung)
- 011 Wunschzettel-Aktion für Eltern bewerben (Kind-Konten) (Entscheidung)
- 012 Rechtstexte und Pflichten vor dem ersten Verkauf (Aufgabe)
- 013 Vercel-Plan: Hobby oder Pro, wenn Geld fließt (Entscheidung)
- 014 Anderer KI-Anbieter für einfache Aufgaben (zum Beispiel Kimi) (Entscheidung)
- 015 Katalog ausbauen und prüfen (Aufgabe)
- 018 Instagram und Google Ads einmal echt testen (Aufgabe)
- 019 Offene Einrichtung bei Vercel, Supabase und Anthropic (Jann) (Aufgabe)
- 020 Stripe im Testmodus verbinden und Kauf testen (Aufgabe)
- 021 Soll Wishtale aus Rückmeldungen von Gästen lernen? (Entscheidung)
- 022 Vielfalt der KI-Ideen schärfen (Aufgabe)
- 025 Woher kommen Bilder, wenn die Shopseite keins liefert (Amazon, idealo)? (Entscheidung)
- 034 Supabase-Dashboard: Site URL, Redirect-URLs und deutsche Mail-Vorlagen (Aufgabe, Jann)
- 042 Server, Hosting und Mail: ist das Setup die beste Wahl, auch bei den Kosten? (Entscheidung, von Jann)
- 077 Profilpflege dezent anstoßen und Klicktour zu den Einstellungen (Entscheidung, von Jann, wartet auf ChatGPT)
- 078 Landingpage-Intro: echter Durchklick durch die neue App (Entscheidung, von Jann, wartet auf ChatGPT, Entwurf liegt bei)
- 089 Empfehlungen besser: Hinweis auf Geschmackskarten und zweite Prüfung der Begründungen (Entscheidung, von Jann)
