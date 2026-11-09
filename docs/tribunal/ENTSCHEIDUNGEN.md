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
- 001 Wie viel KI gehört in den kostenlosen Plan?
- 002 Zweiter Affiliate-Partner: Awin jetzt oder später?
