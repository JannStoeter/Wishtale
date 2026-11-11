---
autor: chatgpt
datum: 2026-11-11
empfehlung: A
sicherheit: mittel
aufwand: klein
kosten: keine zusätzlichen laufenden Kosten, sofern das vorhandene united-domains-Postfach genutzt werden kann
---
## Begründung

Ich empfehle **A: united-domains zuerst nutzen – jetzt, vor dem öffentlichen Start**. Supabase Auth kann jeden SMTP-Dienst verwenden. united-domains stellt dafür einen regulären SMTP-Zugang bereit: `smtps.udag.de`, Port 587 mit STARTTLS oder 465 mit SSL/TLS. Benutzername und Passwort entsprechen dem vorhandenen Postfach ([united-domains: SMTP-Daten](https://www.united-domains.de/help/faq-article/wie-lauten-die-smtp-daten/)). Damit lässt sich voraussichtlich der vorhandene Vertrag nutzen, statt sofort einen weiteren Dienst einzuführen.

Wichtig ist die Unterscheidung: **Supabase bleibt für Anmeldung und Versandlogik zuständig; nur der Transport der E-Mail läuft über united-domains.** Die bereits vorhandenen deutschen Vorlagen können weiter in Supabase liegen. Als Absender würde ich „Wishtale“ mit `hallo@wishtale.de` verwenden, sofern das Postfach bzw. die Absenderadresse dafür authentifiziert werden kann.

Ich würde das zunächst mit einem eigenen Postfach bzw. separaten Zugang für den Versand einrichten und vor dem Start testen: Bestätigung und Passwort-Reset an Gmail, Outlook, GMX und iCloud; SPF, DKIM und DMARC prüfen; Absender und Antworten kontrollieren. Das SMTP-Passwort gehört ausschließlich in die Supabase-SMTP-Einstellungen, nicht ins Repository.

**B** wäre mein Plan B, falls united-domains den automatisierten Transaktionsversand nicht zuverlässig unterstützt oder Limits/DNS-Ausrichtung Probleme machen. Brevo ist dafür ein dedizierter SMTP-Relay-Dienst und sitzt in Frankreich ([Brevo SMTP](https://help.brevo.com/hc/en-us/articles/7924908994450-Send-transactional-emails-using-Brevo-SMTP)). Ich würde keinen weiteren Vertrag eingehen, bevor der vorhandene Weg getestet wurde. **C** bietet ebenfalls spezialisierte Dienste, bringt aber für den jetzigen Umfang keinen klaren Vorteil gegenüber Brevo. **D** reicht nicht: Supabase begrenzt den eingebauten Versand derzeit auf zwei E-Mails pro Stunde und auf vorab autorisierte Adressen; er ist ausdrücklich nicht für Produktion gedacht ([Supabase: Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)).

## Risiken

- united-domains dokumentiert SMTP für Postfächer, aber nicht ausdrücklich einen für Auth-Transaktionsmails dimensionierten Versanddienst. Der Anbieter warnt, dass eine Überlastung durch Mailings zur Sperrung der Domain führen kann ([Hinweis von united-domains](https://www.united-domains.de/help/faq-article/kann-ich-mehrere-e-mails-auf-einmal-versenden/)). Konkrete Versandlimits und die Zulässigkeit des automatisierten App-Versands sind deshalb vorab zu klären.
- Ein gemeinsames Postfach-Passwort für App-Versand und persönliche Kommunikation vergrößert den Schaden bei einem kompromittierten Zugang. Wenn möglich, ein separates Postfach oder einen eigenen Zugang verwenden.
- Ohne korrekt eingerichtete SPF-, DKIM- und DMARC-Einträge können Bestätigungsmails im Spam landen oder abgewiesen werden. Der Versand muss mit echten Empfängerpostfächern getestet werden.
- Die Empfehlung A ist daher ein kostenschonender erster Versuch, keine bereits bestätigte Aussage zur Zustellqualität oder zu den united-domains-Versandlimits.

## Gegenargument

Ein spezialisierter Dienst wie Brevo ist für Transaktionsmails die sauberere und wahrscheinlich robustere Lösung. Er bietet passende SMTP-Infrastruktur und trennt den Versand vom normalen Postfach. Wenn Wishtale schnell wächst oder united-domains den automatisierten Versand einschränkt, wäre es falsch, aus Kostengründen am Postfach festzuhalten. Für die frühe Phase überwiegt für mich aber der Nutzen, zuerst den vorhandenen Vertrag zu testen.
