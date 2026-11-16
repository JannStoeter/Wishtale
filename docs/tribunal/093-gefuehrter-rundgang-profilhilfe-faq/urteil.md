---
topic: 093-gefuehrter-rundgang-profilhilfe-faq
status: entschieden
option: Umsetzung gemäß Janns Auftrag im Chat
datum: 2026-11-16
umgesetzt: 94b11c11114d20d643ad6315b2ab3f7064b36265
---
Fünf freiwillige Themenführungen auf echten Bedienelementen: Wunschliste erstellen, Foto/Text einlesen, Profil ergänzen, Geschmack schärfen und Wunschliste teilen. Hervorhebung, Schrittanzeige, Ziel zeigen, jederzeit beenden oder Escape. Die Tour führt bis zum Formular bzw. Ziel und füllt nichts aus, speichert nichts und versendet nichts selbst. Leere Listen führen über das erste Wunschfeld; Kind-Profile bekommen keine Geschmackskarten-Tour.

Der nächste Profilschritt ist ein Button. Stabile Zielschlüssel in completeness() führen zu Über-Text, Interessen, Welten (wenn aktiv), Marken, No-Gos, Ausprobieren, Alternativen, Wunschdialog, Vorhandenem oder Geschenkdialog. Bei 100 % entfällt der nächste Schritt.

Zehn FAQ in „Hilfe und Rundgang“, direkt über „Hilfe und FAQ“ im Avatar-Menü erreichbar. Antworten zu Wunschliste, Gastzugang und Reservierungen, Überraschung, Privatsphäre, Karten, Vorschlägen, Navigation, Trefferqualität und Anzeige-Links.

Geprüft: ESLint, Produktionsbuild und gezielte Node-Modulprüfungen. Cloud-Browser im angemeldeten Demokonto bei 1363 px: alle fünf Führungen bis zum jeweiligen Ziel, Wunsch-Tour zusätzlich bei leerer Liste im Kind-Demoprofil; ungespeicherter Formularwert bleibt nach Ende der Führung erhalten; FAQ-Antwort aufklappbar, Shift+Tab bleibt in der Hilfe, Escape beendet; nächster Schritt im unvollständigen Kind-Profil fokussiert #about; Jonas 100 % ohne Folgehinweis. Kein horizontaler Überlauf. Produktiver Deploy des Implementierungscommits READY.

Abschlussnachbesserung: Beim Beenden bleibt der Fokus am gezeigten Ziel, auch bei Formularfeldern direkt im Profil.

Nicht geprüft: 390 px, echter iPhone-/Safari-Browser und Screenreader. Keine Datenbank-/Dienständerungen, keine Pakete oder neuen gespeicherten Daten. Die Datenbankspiegelung der Dev-Seite ergänzt Claude beim Abgleich.
