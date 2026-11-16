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

Nachprüfung 390 px siehe unten. Nicht geprüft bleiben echter iPhone-/Safari-Browser und Screenreader. Keine Datenbank-/Dienständerungen, keine Pakete oder neuen gespeicherten Daten. Die Datenbankspiegelung der Dev-Seite ergänzt Claude beim Abgleich.

## Sichtprüfung bei 390 px am 16.11.2026
Produktionsstand `46483ef83b82e5ca1b248af6e96292fa52c5786e` im angemeldeten Demokonto geprüft. Die Cloud-Browser-DevTools sind durch Organisationsrichtlinie gesperrt. Über normale Chromium-Seitenleiste und 125 % Browserzoom ließ sich der tatsächliche Seitenviewport auf gemessene `window.innerWidth = 390`, `innerHeight = 742` einstellen (DPR 1,25). Der Desktop-Scrollbalken lässt ca. 378 px Inhaltsbreite. Dies ist eine responsive Sichtprüfung im echten Chromium, keine iPhone-/Safari- oder Touch-/Bildschirmtastatur-Emulation. Die 390-px-Prüflücke ist damit geschlossen.

Ergebnis: Alle fünf Themenführungen bis zum jeweiligen Ziel geklickt; keine horizontalen Überläufe und in den stabilen Touransichten keine Überdeckung der markierten Ziele durch den Hinweis. Wunschformular, Fotoauswahl, Avatar-Menü, Profilfeld, Karten-Themen und Teilen-Button erreichbar. FAQ-Text klappt auf, bleibt lesbar und scrollt im Dialog ohne seitlichen Überlauf. Der nächste Schritt im unvollständigen Kind-Demoprofil fokussiert #about und bringt das Feld in den sichtbaren Bereich; danach Hauptprofil wieder ausgewählt. Keine Eingaben gespeichert, keine Fotos hochgeladen, nichts geteilt und keine Karten bewertet.

Zusätzlich 092: „Deine Vorschau“ und Auge bleiben in derselben Zeile; Button ca. 45,6 × 44 px. Aus- und Wiedereinblenden bei 390 px erfolgreich, Zustand am Ende wieder eingeblendet.

Kleiner Befund, P3: Die FAQ-Kopfzeile mit Schließen-Button scrollt beim Lesen langer Antworten aus dem Sichtbereich. Der Dialog bleibt durch Zurückscrollen bzw. Escape schließbar, kein Funktionsblocker. Vorschlag: Kopfzeile des Hilfedialogs künftig sticky halten. In diesem Prüflauf wurde kein Website-Code geändert.
