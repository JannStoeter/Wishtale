---
autor: claude
datum: 2026-11-24
empfehlung: Liste abarbeiten, Start Anfang Dezember
---
# Launch-Checkliste (Stand 24.11.2026)

Geprüft: Mailversand über united domains steht schon in der Datenschutzerklärung (Abschnitt 3), Rechtsseiten ohne fehlende Pflichtfelder, Supabase im Plan „Free“, Vercel-Plan über die Schnittstelle nicht lesbar, Sicherheitshinweise von Supabase gelesen.

## A. Für Jann (Konten und Einstellungen)
1. Supabase auf Pro: pausiert nicht, tägliche Backups, Schutz vor geleakten Passwörtern lässt sich einschalten.
2. Vercel auf Pro: kommerzielle Nutzung (Partnerlinks zählen dazu), keine Grenze von 12 Server-Funktionen.
3. Mail über united domains: SPF, DKIM und DMARC für wishtale.de prüfen (sonst Spam-Ordner), Tageslimit des Postfachs prüfen, in Supabase unter Auth › Rate Limits die Mails pro Stunde passend hochsetzen, einmal Registrierung und „Passwort vergessen“ mit Gmail, GMX und Outlook testen.
4. Verträge zur Auftragsverarbeitung abschließen und ablegen: Vercel, Supabase, Anthropic, Brave, united domains.
5. Anthropic: monatliches Ausgabenlimit in der Console setzen.
6. Amazon PartnerNet: wishtale.de als Website eingetragen, Hinweis „Anzeige“ ist überall da; Amazon schließt Konten ohne drei qualifizierte Verkäufe in 180 Tagen.
7. In Supabase nach dem Wechsel auf Pro: Schutz vor geleakten Passwörtern einschalten.

## B. Für Claude (Code)
1. Sicherheitshinweis: `guard_profile_update()` ist eine Trigger-Funktion und für Browser aufrufbar, Ausführungsrecht entziehen. Die übrigen Hinweise sind gewollt (öffentliche Gastansicht und Einladungen, Admin-Funktionen prüfen intern `is_admin()`).
2. Hinweise 1 bis 3 aus Dev 104: zweites Elternteil, Teilen ab drei Wünschen, nach dem Reservieren eigenes Wishtale.
3. Reservierungen für Gäste per Mail bestätigen (jetzt mit eigenem Mailversand möglich), damit sie über Geräte hinweg erhalten bleiben. Optional, nach dem Start.
4. Täglich in den ersten zwei Wochen: Vercel-Fehler und CMS-Auswertung durchsehen.

## C. Vor dem Start gemeinsam
1. Durchspielen auf zwei echten Handys: registrieren, Bestätigungs-Mail, Wünsche, Link per WhatsApp, als Gast reservieren, App installieren, Passwort vergessen.
2. Weihnachts-Aktion im CMS anlegen (Aktionen, Orte Landingpage und App).

## D. Start
Eigenes Umfeld und organische Reels zuerst, zwei Wochen beobachten (geteilte Links, Reservierungen, neue Konten über Gäste), bezahlte Werbung erst danach.
