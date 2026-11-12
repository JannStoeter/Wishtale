# Entscheidungen von Jann

Diese Datei spiegelt Janns Urteile aus der Entwickler-Seite ins Repository, damit auch ChatGPT sie kennt. Sie gelten als Produktentscheidungen: Wer ihnen widerspricht, braucht ein neues, begründetes Tribunal. Claude aktualisiert sie beim Abgleich (Quelle ist die Tabelle `tribunal_verdicts`).

Stand: 2026-11-09

## Grundsätze des Produkts
- **Kern bleibt frei:** Profil, Wunschliste, Gast-Link, anonymes Reservieren und Kind-Konten ohne Zahlenlimit. Darüber ziehen wir die Grenze nach Kosten: Der Katalog ist das kostenlose Niveau, KI-Funktionen gehören zu Plus.
- **Gäste zahlen nie.** Wer beschenkt wird, trägt die Kosten, nicht die Schenkenden.
- **Die Überraschung bleibt.** Beschenkte sehen nie, wer reserviert hat, und nie, was jemand geschenkt hat.
- **Vorschläge sind immer erkennbar** als Vorschlag von Wishtale und nie wie die Wahl der Person gestaltet.
- **Keine Anlass-Auswahl** vorerst (Geschenke passen zu jedem Anlass). Anlass-Listen stehen im Backlog.
- **Planung (Janns Aktionen, Stand 2026-11-09):** Jetzt: 015, 019 (016 und 017 erledigt). Als Nächstes: 005, 006, 011, 012 („Wichtig!“), 013, 018, 022. Später: 001, 004 (Beta soll voll laufen), 008 (Mailanbindung nötig), 010. Backlog: 002, 007, 009, 014, 021. Ziel: Das Produkt mit den heutigen Funktionen auf den Markt bringen.
- **Chat mit Claude ist die zentrale Stelle.** Auf der Entwickler-Seite wird gesammelt, gebaut wird erst nach Freigabe und „Abgleich“.

## Urteile

| Nr. | Frage | Urteil | Umgesetzt |
|---|---|---|---|
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
| 047 | Gast-Ansicht: Wünsche zuerst | **A: Wünsche zuerst, dann „Nicht das Passende dabei?“ mit Preisrahmen nur für Vorschläge**, Claude und ChatGPT einig. | ja, `9db59dc` |
| 048 | Gast-Ansicht: Feinschliff | **Anweisung: Bitte nicht/Hat schon in die Seitenleiste, Liste statt Groß, Sortierung** | ja, `3ffe30a` |
| 049 | Info-Welt zum Profil | **Anweisung: Profilkopf öffnet ein gestaltetes Fenster über die Person, Seitenleiste entfällt** | ja, `4e37d6a` |

## Offen (noch kein Urteil)
Alle offenen Punkte des Projekts liegen als Ordner in `docs/tribunal/`. Jann entscheidet auf der Entwickler-Seite, ob er dazu Meinungen möchte.
- 001 Wie viel KI gehört in den kostenlosen Plan? (Entscheidung)
- 002 Zweiter Affiliate-Partner: Awin jetzt oder später? (Entscheidung)
- 004 Was soll Wishtale Plus kosten, und in welcher Form? (Entscheidung)
- 005 Marken und „Das möchte ich ausprobieren“ leichter machen (Entscheidung)
- 006 Profileinstellungen: Umfang der neuen Seite (Entscheidung)
- 007 Guthaben (Credits) abbuchen: überhaupt anbieten? (Aufgabe)
- 008 Erinnerungen („Letztes Jahr hast du … geschenkt“, Geburtstage) (Entscheidung)
- 009 Anlass-Listen (zum Beispiel Hochzeit) als eigene Funktion (Entscheidung)
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
- 027 Brave-Suchschlüssel setzen, sobald die Kosten es erlauben (Aufgabe, von Jann)
- 034 Supabase-Dashboard: Site URL, Redirect-URLs und deutsche Mail-Vorlagen (Aufgabe, Jann)
- 042 Server, Hosting und Mail: ist das Setup die beste Wahl, auch bei den Kosten? (Entscheidung, von Jann)
- 046 Kind-Konten von mehreren Personen verwalten (Entscheidung, von Jann)
