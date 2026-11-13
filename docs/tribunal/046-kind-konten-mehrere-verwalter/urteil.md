---
topic: 046-kind-konten-mehrere-verwalter
status: entschieden
option: A
datum: 2026-11-13
umgesetzt: 9e716f1
---
**Janns Urteil (Chat, Wortlaut): „Können wir noch einbauen, dass ein Kind-Konto von zwei Eltern geführt werden kann? Es reichen nur die Eltern“** und später „Baue die Oberfläche“. Option A, begrenzt auf höchstens ein weiteres Elternteil (Hauptnutzer plus eine Person).

**Datenbank (`0026`, von Jann eingespielt, Zugriffstest `supabase/tests/0026_co_parents_test.sql`: am 2026-11-13 von Jann ausgeführt, alle 31 Prüfwerte wie erwartet, siehe unten):** `profile_members`, `member_invites`, `can_manage()`, Einladung per Zufallscode (nur Hash, 14 Tage, einmal einlösbar).

**Oberfläche, umgesetzt von Claude:**
- Im Profil eines Kind-Kontos der Bereich „Verwaltet von“: Das Hauptkonto sieht, wer verwaltet, kann „Zweites Elternteil einladen“ (Link teilen oder kopieren), offene Einladungen zurückziehen und das zweite Elternteil entfernen. Das zweite Elternteil kann „Verwaltung abgeben“. Der Hinweis sagt, was beide dürfen und dass nur das Hauptkonto einladen, entfernen und löschen kann.
- Einladungsseite `#mitverwalten/<Code>`: Wer eingeladen hat, welches Kind, was gilt. Mit Konto „Mitverwalten übernehmen“, ohne Konto „Konto erstellen“ oder „Ich habe schon ein Konto“ (der Code wird im Browser gemerkt und nach der Anmeldung eingelöst, auch über die Bestätigungs-E-Mail).
- Das Konto lädt nach der Anmeldung auch mitverwaltete Kind-Profile (`accounts[id].shared`), im Menü und bei den Konten als „Kind-Konto, mitverwaltet“, samt Reservierungsübersicht.
- Server (`api/ideas.js`, `manages()`): Entwurf und Produkterkennung für ein Kind-Profil dürfen Hauptnutzer und zweites Elternteil nutzen.
- Datenschutz Abschnitt 6, Kontrast des Kind-Hinweisstreifens (`.mgbar`) verbessert.
Getestet mit Playwright (390 px, Datenbank simuliert): Hauptnutzer erzeugt Link, Gast sieht die Einladung und merkt den Code, angemeldete Person übernimmt und sieht das Kind im Menü, axe ohne Befund. Echte Datenbank-Rechte: Zugriffstest bestanden (Fremde sehen weder Profil, Wünsche, Einladungen noch Mitverwalter-Zeilen und können nichts ändern oder einladen; das zweite Elternteil kann Profil und Wünsche bearbeiten, aber weder Kürzel noch Besitz ändern, das Kind-Profil nicht löschen und nicht einladen; die zweite Einladung scheitert mit „full“, die erste lässt sich nicht zweimal einlösen; nach dem Entfernen sieht das zweite Elternteil nichts mehr). Nicht getestet: echtes Gerät. Bekannt: Eine zweite, noch nicht benutzte Einladung bleibt gültig, auch wenn das zweite Elternteil schon da ist, und würde nach dem Entfernen wieder passen. Das Hauptkonto kann offene Einladungen zurückziehen.
