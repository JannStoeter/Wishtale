---
autor: claude
datum: 2026-11-12
empfehlung: A
sicherheit: mittel
aufwand: mittel
kosten: keine laufenden Kosten, ein bis zwei Arbeitstage mit gründlichen Tests
---
## Begründung
Der Wunsch ist berechtigt: Zwei Eltern pflegen dieselbe Liste, und die Überraschung muss für beide gleich gewahrt bleiben. Gemeinsame Zugangsdaten sind keine Lösung, weil sie die Konten vermischen und keine saubere Löschung erlauben.

**Ich empfehle A.** Das Kind-Profil bekommt einen Hauptnutzer (das Konto, das es angelegt hat, heute `owner_id`) und beliebig viele Mitverwalter.
- **Einladen:** Der Hauptnutzer erzeugt im Kind-Profil einen Einladungslink („Mitverwalter einladen“), den er selbst per Messenger schickt. Der Link gilt einmal und 14 Tage. Die zweite Person öffnet ihn, meldet sich an oder registriert sich und bestätigt „Levin mitverwalten“. Wishtale verschickt dabei keine Mails an Dritte und speichert keine fremde Adresse (wie bei der Einladung aus 039).
- **Rechte:** Mitverwalter dürfen das Profil und die Wünsche bearbeiten, Geschenke eintragen und die Reservierungsübersicht sehen. Nur der Hauptnutzer darf Mitverwalter einladen oder entfernen und das Kind-Profil löschen. Mitverwalter können sich selbst entfernen.
- **Anzeige:** „Verwaltet von Jann und Anna“. Der Hinweistext „Hierfür werden auf Wunsch von … keine Vorschläge generiert“ (045) nennt weiter den Hauptnutzer.
- **Technik:** Neue Tabelle `profile_members` (Profil, Konto, Rolle, Datum) und eine Funktion `can_manage(profil)`, die alle Zeilenregeln gemeinsam nutzen, statt überall `owner_id = ich` zu prüfen. Zwei Funktionen für Einladung und Annahme (Token nur als Hash gespeichert). Der Bildspeicher für Wunschbilder liegt heute im Ordner des Kontos, das hochlädt, auch das muss für Mitverwalter geprüft werden. Aufwand mittel, weil die Zugriffsregeln einer ganzen Reihe von Tabellen angepasst und mit zwei echten Testkonten geprüft werden müssen.

Warum nicht B (jeder darf alles): Ein Mitverwalter könnte den Hauptnutzer entfernen oder das Kind-Profil löschen. Bei Kindern ist das ein Risiko, wenn sich Eltern trennen, und sollte eine bewusste Entscheidung sein. Warum nicht C: Wer mitverwaltet, will meistens auch Wünsche eintragen. D ist am einfachsten, vermischt aber zwei Personen in einem Konto.

## Risiken
Eine Änderung der Zugriffsregeln ist die empfindlichste Stelle im ganzen System: Ein Fehler könnte fremden Konten Zugriff auf ein Kinderprofil geben. Deshalb zuerst Tests mit drei Konten (Hauptnutzer, Mitverwalter, Fremder), die genau das prüfen, bevor etwas live geht. Die Datenschutzerklärung braucht einen Absatz (Kinderdaten sind für mehrere Konten sichtbar, Einladung nur durch den Hauptnutzer). Bei Trennungen oder Streit gibt es keine automatische Lösung, der Hauptnutzer entscheidet.

## Gegenargument
Wenn es nur um zwei Eltern geht, wäre ein einfacherer Weg, das Kind-Profil auf das Konto des anderen Elternteils zu übertragen, aber dann hat nur einer Zugriff. Die Einladung ist die flexiblere Lösung und deckt auch Großeltern oder Patenonkel ab, falls Jann das möchte.
