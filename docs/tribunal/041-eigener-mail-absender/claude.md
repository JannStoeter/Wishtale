---
autor: claude
datum: 2026-11-10
empfehlung: A
sicherheit: hoch
aufwand: gering
kosten: Gratis-Kontingent reicht zum Start, später wenige Euro im Monat (Preise vorher prüfen)
---
## Begründung
Ja, das geht, und es ist wichtig für den Marktstart: Eine englische Mail von „Supabase Auth“ wirkt unseriös, landet häufiger im Spam und der Standardversand von Supabase ist stark begrenzt (nur wenige Mails pro Stunde), das stößt bei mehreren Anmeldungen gleichzeitig schnell an die Grenze.

**So geht es:** Supabase kann Mails über einen eigenen SMTP-Dienst verschicken (Authentication › Emails › SMTP Settings). Dafür braucht es drei Dinge: einen Dienst mit SMTP-Zugang, die Domain `wishtale.de` beim Dienst bestätigen (DNS-Einträge für SPF, DKIM und DMARC) und die deutschen Vorlagen aus `supabase/email-templates/` in Supabase einfügen. Der Absender ist dann „Wishtale <hallo@wishtale.de>“.

**Ich empfehle A, Brevo.** Der Dienst sitzt in Frankreich (EU), das vereinfacht die Datenschutzerklärung, denn es braucht keine Übermittlung in die USA. Es gibt einen Auftragsverarbeitungsvertrag, und das Gratis-Kontingent reicht für den Anfang. B (Resend) ist technisch sehr angenehm und bietet eine EU-Region, der Anbieter bleibt aber ein US-Unternehmen, dafür bräuchten wir Standardvertragsklauseln in der Erklärung. Welche Gratis-Mengen und Preise heute gelten, habe ich nicht geprüft, bitte vor der Anmeldung auf der Preisseite ansehen.

**Was du tun musst, was ich tun kann:** Du legst das Konto beim Dienst an, bestätigst die Domain bei deinem Domain-Anbieter und trägst die SMTP-Daten in Supabase ein, das kann ich nicht für dich tun. Die DNS-Einträge muss du dort setzen, wo `wishtale.de` verwaltet wird (bei Vercel liegen für die Domain keine Einträge, sie wird also wohl beim Domain-Anbieter verwaltet). Ich liefere dir die genaue Liste der Einträge, sobald du den Dienst gewählt hast, passe danach die Datenschutzerklärung an (neuer Auftragsverarbeiter, Abschnitt 3 und 4) und prüfe die Mails mit einer Testanmeldung. Die Supabase-Einstellung für die Weiterleitung (034) gehört in denselben Termin.

## Risiken
Falsch gesetzte DNS-Einträge lassen Mails im Spam landen oder gar nicht ankommen, deshalb nach der Einrichtung eine Testanmeldung mit Gmail und einer zweiten Adresse (zum Beispiel Yahoo). Ein neuer Absender hat zunächst keinen Ruf, am Anfang sollten nur wenige Mails pro Tag gehen. Wechselt man den Dienst später, müssen die Einträge angepasst werden.

## Gegenargument
D ist die schnellste Lösung: Nur die deutschen Vorlagen in Supabase eintragen, der Absender bleibt aber „Supabase Auth“, und das Limit des Standardversands bleibt. Für eine Beta mit wenigen Nutzern reicht das, für den Marktstart nicht.
