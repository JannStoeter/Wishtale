---
autor: claude
datum: 2026-11-10
empfehlung: A
sicherheit: mittel
aufwand: gering
kosten: heute fast nichts, zum Marktstart grob 45 bis 50 Dollar im Monat plus KI-Nutzung (Preise vor Buchung prüfen)
---
## Begründung
Das Setup ist für ein Produkt in dieser Phase gut gewählt: Alles ist schnell aufgesetzt, ein Mensch kann es allein betreiben, und die laufenden Kosten sind heute nahe null. Ein Umzug auf selbst betriebene Server würde Zeit kosten, die jetzt woanders mehr bringt. Aber zwei Dinge sind **nicht** dauerhaft tragbar, und die sollten vor dem ersten Verkauf geklärt sein.

**1. Vercel Hobby ist nur für nichtkommerzielle Nutzung gedacht.** Nach Vercels [Fair-Use-Regeln](https://vercel.com/docs/limits/fair-use-guidelines) braucht jede kommerzielle Nutzung den Tarif Pro (laut mehreren Quellen etwa 20 Dollar pro Monat und Person, den Preis habe ich nicht bei Vercel selbst bestätigt). Wishtale verdient über Amazon-Partnerlinks und wird über Stripe verkaufen, das ist kommerziell. Dazu kommen technische Grenzen, die wir schon gespürt haben: höchstens 12 Server-Funktionen (deshalb die Sammelstellen `api/admin.js` und `api/billing.js`), und Zeitpläne (Cron) laufen im Gratis-Tarif nur selten. Zeitgesteuerte Instagram-Beiträge hängen daran. Empfehlung: **spätestens vor dem ersten Verkauf, am besten mit dem Marktstart, auf Pro wechseln.**

**2. Supabase im Gratis-Tarif ist für echte Nutzer riskant.** Nach den offiziellen Angaben werden Gratis-Projekte nach einer Woche ohne Aktivität pausiert und haben keine Sicherungen (Pro: 25 Dollar im Monat, tägliche Sicherungen mit sieben Tagen Aufbewahrung, mehr Nutzer und Speicher). Eine pausierte Datenbank in der Woche vor Weihnachten oder ein verlorener Datenstand wären fatal. Empfehlung: **mit den ersten echten Nutzern auf Pro wechseln**, wenn Jann nicht schon dort ist (der Tarif ist im Dashboard sichtbar).

**Mail:** Das Postfach bei united domains als SMTP-Server (041) ist für den Start in Ordnung und kostet nichts extra. Bei Wachstum oder Spam-Problemen wechseln wir auf einen Versanddienst. Die Supabase-Einstellung ist dann nur ein Tausch der Zugangsdaten.

**KI-Kosten:** Der Verbrauch in diesem Monat ist klein. Insgesamt wurden etwa 40 Aufrufe protokolliert (Sonnet rund 43.000 Tokens hinein und 54.000 heraus, Haiku rund 44.000 hinein und 45.000 heraus), das sind Cent-Beträge. Die Tageslimits (40 pro Adresse, 120 pro Konto, 3.000 gesamt) begrenzen das Risiko. Das Ergebnis wird zwischengespeichert, Wiederholungen kosten nichts. Die genauen Preise stehen im CMS unter „Kosten“.

**Weitere Hinweise:**
- **Standort der Server-Funktionen:** Die Funktionen laufen bei Vercel in der Region USA Ost (`iad1`), die Datenbank in London. Jede Anfrage geht also über den Atlantik, das kostet Zeit und ist für die Datenschutzerklärung eine zusätzliche Übermittlung in die USA. Die Funktionsregion lässt sich auf Frankfurt (`fra1`) stellen, das sollten wir zum Marktstart mit erledigen. Ob das schon im Gratis-Tarif möglich ist, habe ich nicht geprüft.
- **Verträge:** Heute sind es Vercel, Supabase, united domains, Anthropic, später Stripe (und gegebenenfalls Brevo). Jeder braucht einen Auftragsverarbeitungsvertrag und einen Eintrag in der Datenschutzerklärung. Mehr Dienste bedeuten mehr Pflege, deshalb ist die Entscheidung für united domains als Mailversand richtig.
- **Grobe Monatskosten zum Marktstart:** Vercel Pro etwa 20 Dollar, Supabase Pro 25 Dollar, Domain und Postfach wie bisher, Anthropic nach Nutzung, Stripe pro Verkauf. Das sind rund 45 bis 50 Dollar fix.

## Risiken
Meine Preisangaben stammen aus Suchergebnissen und können sich geändert haben. Die Tarife im Kundenkonto sehe ich nicht, die Empfehlung stützt sich auf Annahmen über den heutigen Tarif. Ein Wechsel auf Pro kostet sofort Geld, ohne dass schon Umsatz da ist. Die Regionswahl kann die Datenbank-Latenz verändern, das sollte man messen.

## Gegenargument
D ist günstig und ehrlich, solange es nur Tests und Freunde gibt. Es wird nur dann gefährlich, wenn Geld fließt oder echte Nutzer die Datenbank brauchen. C (eigener Server in der EU) wäre datenschutzrechtlich schön und auf Dauer günstig, kostet aber Betrieb, Sicherheit, Sicherungen und Updates und lohnt sich erst, wenn Wishtale deutlich gewachsen ist.

Quellen: [Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines), [Supabase Preise](https://supabase.com/pricing)
