# Entscheidungen von Jann

Diese Datei spiegelt Janns Urteile aus der Entwickler-Seite ins Repository, damit auch ChatGPT sie kennt. Sie gelten als Produktentscheidungen: Wer ihnen widerspricht, braucht ein neues, begründetes Tribunal. Claude aktualisiert sie beim Abgleich (Quelle ist die Tabelle `tribunal_verdicts`).

Stand: 2026-11-09

## Grundsätze des Produkts
- **Kern bleibt frei:** Profil, Wunschliste, Gast-Link, anonymes Reservieren und Kind-Konten ohne Zahlenlimit. Darüber ziehen wir die Grenze nach Kosten: Der Katalog ist das kostenlose Niveau, KI-Funktionen gehören zu Plus.
- **Gäste zahlen nie.** Wer beschenkt wird, trägt die Kosten, nicht die Schenkenden.
- **Die Überraschung bleibt.** Beschenkte sehen nie, wer reserviert hat, und nie, was jemand geschenkt hat.
- **Vorschläge sind immer erkennbar** als Vorschlag von Wishtale und nie wie die Wahl der Person gestaltet.
- **Keine Anlass-Auswahl** vorerst (Geschenke passen zu jedem Anlass). Anlass-Listen stehen im Backlog.
- **Chat mit Claude ist die zentrale Stelle.** Auf der Entwickler-Seite wird gesammelt, gebaut wird erst nach Freigabe und „Abgleich“.

## Urteile

| Nr. | Frage | Urteil | Umgesetzt |
|---|---|---|---|
| 003 | Sichtbarkeit: Stufe „Nur Schenkende“ behalten? | **B: Streichen.** Nur „Für alle mit Link“ und „Privat“. Die KI darf Privates zur Orientierung nutzen, zeigt es Gästen aber nie. | ja, `f700dd4` |

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
- 016 Barrierefreiheit erneut prüfen und beheben (Aufgabe)
- 017 Missbrauchsschutz für KI-Aufrufe (Aufgabe)
- 018 Instagram und Google Ads einmal echt testen (Aufgabe)
- 019 Offene Einrichtung bei Vercel, Supabase und Anthropic (Jann) (Aufgabe)
- 020 Stripe im Testmodus verbinden und Kauf testen (Aufgabe)
- 021 Soll Wishtale aus Rückmeldungen von Gästen lernen? (Entscheidung)
- 022 Vielfalt der KI-Ideen schärfen (Aufgabe)
