---
topic: 075-nutzerzentrale-und-reduzierte-schenkendenansicht
status: entschieden
option: Anweisung
datum: 2026-11-13
umgesetzt: 859c20f
---
**Janns Vorgabe (festgehalten in `chatgpt-2.md`, Pull Request 13):** Die Wunschliste ist der feste Startpunkt, die untere Navigation entfällt vollständig (Handy und PC). Profil, Historie und Inspiration sind Ebenen über der Liste mit „Zurück zur Wunschliste“. Alles Weitere liegt im Menü hinter dem Avatar. Empfehlungen stehen in der Gastansicht direkt unter den Wünschen, ohne eigenen Ideen-Tab. Oben gibt es einen freiwilligen „Kurzen Rundgang“. Janns ausdrückliche Aufnahme von Inspiration in das Menü hebt das Ausblenden aus 073 auf (Welten aus 072 bleiben aus). Auch 074 ist damit erledigt (Wünsche nach vorn).

**Umgesetzt von Claude (`src/views/menu.js`, `src/views/tour.js`, `src/views/shared.js`, `src/views/wishes.js`, `src/views/giver.js`, `src/render.js`, `src/actions.js`, `src/styles/main.css`):**
- Kopfzeile: Logo, Speicherstatus, Knopf „Kurzer Rundgang“ (am Handy nur Symbol), Avatar öffnet das Menü. Hauptnavigation oben und untere Leiste sind weg.
- Menü (Seitenleiste, Esc und Tipp daneben schließen, Fokus geht zurück): Mein Wishtale (Meine Wünsche, Profil und Persönlichkeit, Social Media, Historie und Meine Geschenke), Für dich (Inspiration), Meine Profile (Profilwechsel, Kind-Konto hinzufügen, Jemanden einladen), Organisation (Link teilen, Wer sieht was, Mein Plan, Einstellungen und Konto, Abmelden). Ohne Konto (Demo) gibt es „Eigenes Wishtale anlegen“. Eingeloggte Schenkende öffnen es in der Gastansicht über ihren Avatar, anonyme Gäste sehen es nie.
- Profil, Historie, Inspiration und Mein Plan haben oben „Zurück zur Wunschliste“. Browser-Zurück funktioniert (Hash-Ansichten), die Scroll-Position der Liste und die Filter bleiben beim Zurückkehren erhalten. „Social Media“ springt im Profil zum Abschnitt und klappt ihn auf.
- Wünsche-Seite: Überschrift, eine Zeile mit Ansicht und Teilen, schmale Zeile „Schon eine Liste? Liste einlesen“, Status, dann gleich die Wünsche. Kategorie, Sortierung und Darstellung liegen ab sechs Wünschen hinter „Filtern und sortieren“. Überraschungshinweis, „Tipps zu deiner Wunschliste“, „Erste Schritte“ und die Aktion stehen unter der Liste. Am Handy gibt es nur die Listenansicht.
- Gastansicht: Ein Sprunglink „Zu den Ideen von Wishtale“, Überschrift „Ideen von Wishtale“, Ideen weiter direkt unter den Wünschen.
- Kurzer Rundgang: freiwillig, vier Punkte, startet nie von selbst.
- Nicht verändert: Reservierungsrechte (eigener Folgepunkt für Kontobindung, geheimen Verwaltungslink und Wiederherstellung).
Getestet mit Playwright (390 und 1280 px, Konto simuliert): keine Navigationsleiste, Menü, Zurück mit Scroll-Position, Browser-Zurück, Rundgang, axe ohne Befund. Nicht getestet: echtes Gerät, Gastansicht mit Konto.
