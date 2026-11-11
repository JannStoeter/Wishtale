---
autor: claude
datum: 2026-11-11
empfehlung: A
sicherheit: mittel
aufwand: mittel
kosten: Supabase Pro 25 Dollar im Monat für Sicherungen, sonst nur Arbeitszeit (etwa ein bis zwei Tage)
---
## Begründung
Das Fundament ist solide: Die Datenbankregeln sind durchgängig, es liegen keine Schlüssel offen, und die Server-Funktionen prüfen ihre Aufrufer. Ich habe keine Lücke gefunden, über die jemand fremde Daten lesen oder ändern könnte. Die offenen Punkte betreffen vor allem Datenverlust, Löschpflichten und Missbrauch durch Fremde.

Ich empfehle **A, Hoch und Mittel vor dem Launch**, in dieser Reihenfolge:
1. **Jann, je ein paar Minuten:** `CRON_SECRET` setzen (2), Supabase-Weiterleitung korrigieren (4), Passwort von Jonas ändern (5), Sicherungen klären (1).
2. **Claude, nach Freigabe:** Bilder bei Wunsch- und Kontolöschung entfernen (3), Reservierungen begrenzen und zurücksetzbar machen (6), längere Kürzel und Begrenzung der Profilabfrage (7), Sichtbarkeit für Alter und „Über mich“ (8), private Stichwörter serverseitig filtern (9), Kopfzeilen gegen Einbetten und eine Inhalts-Richtlinie (10), die kleinen Punkte 15 und 16.
3. **Mit dem Mailversand (041):** Bremse bei Registrierungen (11).

Die Punkte 3, 7, 8 und 9 berühren den Datenschutz direkt und sollten nicht bis nach dem Launch warten, weil mit echten Nutzern auch echte Kinderprofile entstehen.

## Risiken
Ich habe den Code und die Datenbank gelesen, aber keinen Angriff von außen simuliert, und die Einstellungen im Supabase-Dashboard (Passwortlänge, Mail, erlaubte Adressen) kann ich nicht einsehen. Eine Prüfung durch eine zweite Stelle vor dem Verkauf wäre sinnvoll. Die Inhalts-Richtlinie kann Dinge blockieren, die heute funktionieren (Pinterest, eingebettete Skripte), sie braucht einen Testlauf.

## Gegenargument
B wäre schneller: Die mittleren Punkte setzen voraus, dass jemand gezielt nach Wishtale-Profilen sucht, das ist bei einem neuen Dienst unwahrscheinlich. Aber Kinderprofile und das Löschrecht sind genau die Themen, bei denen ein einzelner Vorfall das Vertrauen kostet.
