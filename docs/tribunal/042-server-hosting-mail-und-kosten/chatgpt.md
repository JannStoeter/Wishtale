---
autor: chatgpt
datum: 2026-11-11
empfehlung: A
sicherheit: hoch
aufwand: klein
kosten: ca. 45 USD/Monat für Vercel Pro und Supabase Pro zusammen, vor Steuern und nutzungsabhängigen Kosten; united-domains und Anthropic abhängig von bestehenden Verträgen bzw. Nutzung
---
## Begründung

Ich empfehle **A: die Architektur behalten und die bezahlten Tarife rechtzeitig zum kommerziellen Betrieb aktivieren**. Ein Umzug löst derzeit kein erkennbares Problem und würde Entwicklungs- und Betriebsaufwand erzeugen, ohne bei fünf Konten und 13 MB Datenbank einen wirtschaftlichen Vorteil zu bringen.

Die Kosten für den regulären Produktionsbetrieb sind überschaubar:
- **Vercel Pro: 20 USD/Monat** für das Team, mit 20 USD enthaltenem Nutzungsguthaben. Zusätzliche Teammitglieder kosten extra. Entscheidend: Hobby ist laut Vercel ausschließlich für persönliche, nicht kommerzielle Nutzung gedacht. Sobald Wishtale kommerziell betrieben wird, ist Pro daher keine optionale Komfortstufe, sondern erforderlich ([Vercel Preise](https://vercel.com/pricing), [Hobby-Nutzungsbedingungen](https://vercel.com/docs/limits/fair-use-guidelines)).
- **Supabase Pro: ab 25 USD/Monat.** Darin sind 10 USD Compute-Guthaben enthalten, das einen Micro-Compute-Server abdeckt. Für das aktuelle einzelne Projekt ergibt das normalerweise keine zusätzlichen Compute-Kosten. Enthalten sind unter anderem 8 GB Datenbank, 250 GB Egress und tägliche Backups mit sieben Tagen Aufbewahrung ([Supabase Preise](https://supabase.com/pricing)).
- **united-domains:** vorhandenes Postfach und SMTP weiterverwenden, sofern die Tests aus 041 erfolgreich sind. Keinen zusätzlichen Maildienst bezahlen, solange Zustellung und Versandlimits ausreichen.
- **Anthropic und Stripe:** variable Kosten. Anthropic hängt von Modell und Tokenverbrauch ab; Stripe fällt erst bei Zahlungen an. Diese Kosten sollten getrennt von der Hosting-Grundgebühr überwacht werden.

Damit liegt die bekannte feste Basis für Vercel und Supabase bei rund **45 USD monatlich vor Umsatzsteuer** (grob etwas über 40 Euro, je nach Wechselkurs), zuzüglich bestehender Domain-/Mailkosten und tatsächlicher KI-Nutzung. Das ist für einen verwalteten Produktionsbetrieb ein vernünftiger Preis. Supabase Free ist zwar technisch noch ausreichend, pausiert aber Projekte bei geringer Aktivität nach sieben Tagen und bietet keine herunterladbaren Datenbank-Backups. Pro beseitigt diese Schwächen und liefert tägliche Backups ([Supabase Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod), [Backups](https://supabase.com/docs/guides/platform/backups)).

## Warum nicht B, C oder D?

**B – sofort beide Pro-Tarife:** Vercel Pro ist vor kommerzieller Nutzung nötig. Supabase Pro würde ich spätestens zum öffentlichen Produktivstart aktivieren, nicht Monate vorher, solange noch keine echten Nutzer von der Verfügbarkeit abhängen. Ein sofortiger Wechsel nur aus Vorsicht bringt heute wenig.

**C – eigener EU-Server:** Ein kleiner Hetzner-Cloudserver kostet zwar nur wenige Euro im Monat (beispielsweise CX23 aktuell 5,49 Euro netto monatlich), ist aber kein gleichwertiger Ersatz für Vercel plus Supabase ([Hetzner-Preise ab 15. Juni 2026](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/)). Datenbankbetrieb, Auth, Backups, Storage, Deployments, Monitoring, Sicherheitsupdates und Wiederherstellung müssten selbst betrieben oder zusätzlich eingekauft werden. Die eingesparte Hostinggebühr wäre den laufenden Betriebsaufwand aktuell nicht wert. Außerdem würde ein Umzug nicht automatisch alle Datenverarbeitungsorte europäisieren: Anthropic, Stripe und weitere externe Dienste müssten separat betrachtet werden.

**D – kostenlos bleiben:** Für private Entwicklung und einen geschlossenen Test vertretbar, aber nicht als dauerhafte Produktionsstrategie. Vercels Hobby-Tarif ist nicht für kommerzielle Nutzung erlaubt. Supabase Free pausiert bei Inaktivität und hat keine integrierten herunterladbaren Backups.

## Risiken

- Die 45 USD sind eine belastbare Grundorientierung, keine vollständige Kostenobergrenze. Vercel-Mehrverbrauch, Supabase-Mehrverbrauch, Anthropic-Aufrufe und Stripe-Gebühren kommen abhängig von Nutzung hinzu. Spend Limits und Kostenalarme sollten vor dem Start eingerichtet werden.
- Die tatsächlichen Tarife und Vertragsdetails des bestehenden Vercel-Teams, Supabase-Projekts und united-domains-Postfachs sind nicht aus dem Repository ersichtlich. Vor der Umstellung müssen die Dashboards geprüft werden.
- Supabase Pro bietet tägliche Backups mit sieben Tagen Aufbewahrung, aber das ersetzt keinen unabhängigen Export der Daten und keine getestete Wiederherstellung. Ein regelmäßiger Offsite-Backup-Prozess bleibt sinnvoll.
- Der Supabase-Standort London ist nicht identisch mit einem EU-Mitgliedstaat. Die Datenflüsse und Auftragsverarbeiter müssen in der Datenschutzerklärung und den Verträgen korrekt abgebildet sein; ein eigener Hetzner-Server allein würde das nicht lösen.

## Gegenargument

Ein EU-Hosting-Anbieter könnte langfristig mehr Kontrolle über Datenstandorte und Infrastruktur geben und bei sehr hoher Auslastung günstiger werden. Das ist ein valides späteres Optimierungsthema. Heute wären die Einsparungen gegenüber rund 45 USD monatlich jedoch klein im Verhältnis zu Migration, Betrieb und Ausfallrisiko. Erst wenn Nutzerzahlen, Kosten oder konkrete Datenschutzanforderungen das rechtfertigen, sollte ein Wechsel neu bewertet werden.
