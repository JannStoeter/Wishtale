---
autor: claude
datum: 2026-11-10
empfehlung: A
sicherheit: mittel
aufwand: gering
kosten: Ein Umzug später kostet vor allem Zeit, ein Regionswechsel der Datenbank jetzt fast nichts
---
## Rückfrage von Jann
„Und die Anbieter wechseln, wenn alles einmal läuft? Es ist ja jetzt auch bequem wegen der Connection.“

## Begründung
Ein Wechsel ist möglich, und die Bequemlichkeit ist kein Grund, ihn auszuschließen. Wie schwer er wäre, hängt vom Dienst ab:

| Dienst | Wie fest sind wir gebunden? | Umzug später |
|---|---|---|
| Domain (united domains) | gar nicht | Einträge umstellen, Domain bleibt |
| Mail | gar nicht | Zugangsdaten in Supabase tauschen |
| KI (Anthropic) | gering | Eine Schicht (`api/_lib/llm.js`) kapselt die Aufrufe, die leichte Stufe lässt sich schon auf einen anderen Anbieter lenken |
| Vercel | mittel | Die Seite ist statisch, die Server-Funktionen sind gewöhnliche Node-Funktionen. Umzug auf Netlify, Cloudflare oder einen eigenen Server heißt vor allem Weiterleitungen, Zeitpläne und die Dateiauslieferung neu zu verdrahten, ein bis zwei Tage |
| Supabase | am stärksten | Daten sind normales Postgres und portabel, alle Änderungen liegen als Migrationen im Repository. Fest sind wir bei Anmeldung (Supabase Auth), Bildspeicher und dem Zugriff über die REST-Schnittstelle samt Zeilenregeln. Das alles gibt es auch als selbst betriebenes Supabase, ein Umzug wäre also machbar, aber ein Projekt von mehreren Tagen |

**Wichtigster Punkt: Der günstigste Moment für einen Regionswechsel der Datenbank ist jetzt.** Das Supabase-Projekt liegt in London. Die Region eines Projekts lässt sich nicht ändern, man legt ein neues in Frankfurt oder Irland an und zieht um. Heute heißt das 5 Konten und 13 MB, in einem halben Jahr echte Nutzerdaten, Bilder und Anmeldungen, die man nicht ohne Unterbrechung verschieben möchte. Ob London für uns ein Problem ist, habe ich rechtlich nicht geprüft: Für Großbritannien gilt ein EU-Angemessenheitsbeschluss, dessen Fortbestand man im Blick behalten sollte (Stand meines Wissens, bitte vor einer Entscheidung prüfen). Wenn Wishtale mit „Daten in der EU“ werben soll, wäre ein Projekt in Frankfurt die saubere Lösung.

**Meine Empfehlung bleibt A, mit drei Vorbereitungen für einen späteren Umzug**, damit die Bequemlichkeit uns nicht festhält:
1. **Regelmäßige Sicherung** der Datenbank außerhalb von Supabase (ein Dump), solange wir nicht im Pro-Tarif mit täglichen Sicherungen sind.
2. **Nichts bauen, was nur bei einem Anbieter geht**, wenn es eine gleichwertige Alternative gibt. Neue Funktionen bleiben normale Node-Funktionen und normales SQL.
3. **Eine kurze Umzugsanleitung** in `docs/`, damit auch jemand anderes oder ein späteres Ich es nachvollziehen kann.

Gewechselt wird erst, wenn ein Grund da ist: spürbare Kosten (zum Beispiel weit über die Pro-Grenzen hinaus), eine rechtliche Anforderung (EU-Standort) oder wiederholte Ausfälle. Ein Wechsel nur aus Prinzip kostet Wochen und bringt in der frühen Phase nichts.

## Risiken
Wer zu lange wartet, zahlt den Umzug später mit echten Daten. Wer jetzt umzieht, verbringt Zeit mit Technik statt mit dem Produkt. Beides ist vertretbar, deshalb hängt die Wahl daran, wie wichtig „Daten in der EU“ als Versprechen ist.

## Gegenargument
Ein Wechsel „wenn alles läuft“ ist das Gegenteil der klugen Reihenfolge, denn dann ist er am teuersten. Wenn überhaupt, sollte er vor dem Marktstart stattfinden oder gar nicht.
