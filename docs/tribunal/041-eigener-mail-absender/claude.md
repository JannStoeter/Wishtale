---
autor: claude
datum: 2026-11-10
empfehlung: A
sicherheit: hoch
aufwand: gering
kosten: bei united domains nur das Postfach, falls es noch keins gibt (Preis im Kundenkonto prüfen)
---
## Begründung
Ja, das geht, und es ist wichtig für den Marktstart: Eine englische Mail von „Supabase Auth“ wirkt unseriös, landet häufiger im Spam und der Standardversand von Supabase ist stark begrenzt (nur wenige Mails pro Stunde), das stößt bei mehreren Anmeldungen gleichzeitig schnell an die Grenze.

**So geht es:** Supabase kann Mails über einen eigenen SMTP-Dienst verschicken (Authentication › Emails › SMTP Settings). Dafür braucht es drei Dinge: einen Dienst mit SMTP-Zugang, die Domain `wishtale.de` beim Dienst bestätigen (DNS-Einträge für SPF, DKIM und DMARC) und die deutschen Vorlagen aus `supabase/email-templates/` in Supabase einfügen. Der Absender ist dann „Wishtale <hallo@wishtale.de>“.

**Aktualisierte Empfehlung (nach Janns Nachfrage): A, das Postfach bei united domains als SMTP-Server.** Das spart einen weiteren Vertrag und einen weiteren Auftragsverarbeiter. Nach der Hilfe von united domains lauten die Daten: Server `smtps.udag.de`, Port 465 (SSL) oder 587 (STARTTLS), Benutzername ist die E-Mail-Adresse des Postfachs, Passwort ist das Postfach-Passwort. In Supabase trägst du das unter Authentication › Emails › SMTP Settings ein, als Absender `hallo@wishtale.de` und Name „Wishtale“.

Was dabei offen ist, und was ich nicht weiß: Ein Versandlimit nennt united domains in den Hilfeseiten nicht, die Angabe müsste im Kundenkonto oder beim Support erfragt werden. Postfächer sind für normale Post gedacht, nicht für viele automatische Mails, bei einem Schwung neuer Anmeldungen könnte der Versand gedrosselt oder gesperrt werden, und es gibt keine Statistik zu Zustellung und Absprüngen. Ob für `wishtale.de` SPF und DKIM schon passen, hängt davon ab, wo die DNS-Einträge liegen. Bei Vercel liegen keine, sie werden also beim Domain-Anbieter verwaltet, vermutlich bei united domains selbst, dort kannst du das einsehen. Für den Start mit wenigen Mails am Tag ist das in Ordnung. Wenn später viele Nutzer kommen oder Mails im Spam landen, ziehen wir auf einen Versanddienst wie Brevo um, die Supabase-Einstellung ist dann nur ein Austausch der SMTP-Daten.

Warum ich vorher Brevo empfohlen habe: Es ist für automatische Mails gebaut und liefert Zustellstatistik, aber es ist ein weiterer Vertrag. Bei deiner Priorität, nicht noch mehr Verträge anzuhäufen, ist united domains für den Start die bessere Wahl.

**Was du tun musst, was ich tun kann:** Du legst das Postfach `hallo@wishtale.de` bei united domains an (falls es noch keins gibt) und trägst die SMTP-Daten in Supabase ein, das kann ich nicht für dich tun, ich habe keinen Zugriff auf deine Konten. Ich passe danach die Datenschutzerklärung an (Mailversand über united domains, Abschnitt 3 und 4), schicke dir den Text für die Vorlagen und prüfe die Mails mit einer Testanmeldung. Die Supabase-Einstellung für die Weiterleitung (034) gehört in denselben Termin.

## Risiken
Falsch gesetzte DNS-Einträge lassen Mails im Spam landen oder gar nicht ankommen, deshalb nach der Einrichtung eine Testanmeldung mit Gmail und einer zweiten Adresse (zum Beispiel Yahoo). Ein neuer Absender hat zunächst keinen Ruf, am Anfang sollten nur wenige Mails pro Tag gehen. Wechselt man den Dienst später, müssen die Einträge angepasst werden.

## Gegenargument
D ist die schnellste Lösung: Nur die deutschen Vorlagen in Supabase eintragen, der Absender bleibt aber „Supabase Auth“, und das Limit des Standardversands bleibt. Für eine Beta mit wenigen Nutzern reicht das, für den Marktstart nicht.
