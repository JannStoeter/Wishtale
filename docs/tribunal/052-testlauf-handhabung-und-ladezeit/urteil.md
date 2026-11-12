---
topic: 052-testlauf-handhabung-und-ladezeit
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: f3e994c
---
**Umgesetzt** (Commits faadc90, ede41b9, cca5936, f3e994c):

Ladezeit: Ursache war das automatische Nachdenken der neuen Modelle (rund 3.000 Ausgabe-Tokens für 8 Ideen). Die Ideen laufen jetzt mit `effort: low` und ohne Nachdenken (`api/_lib/llm.js`, `api/_lib/ideas.js`, zurückdrehbar mit `IDEAS_EFFORT` und `IDEAS_THINK=1`), die Funktionen laufen in London neben der Datenbank (`vercel.json` regions `lhr1`), Abfragen parallel, Gast-Ideen und Inspiration werden nach der Anmeldung vorgeladen, im Browser bricht ein Abruf nach 50 Sekunden ab und fällt auf den Katalog zurück. Gemessen: Gast-Ideen ohne Zwischenspeicher 10 bis 13 statt etwa 40 Sekunden (Modell 9 bis 10 Sekunden, 1.150 bis 1.450 Tokens), aus dem Zwischenspeicher unter 1 Sekunde. Kein Anbieterwechsel; Gemini wäre ein neuer Auftragsverarbeiter (siehe 014).

Handhabung: 2 nur noch ein schwebender Knopf, Amazon-Suche in der Einlesen-Karte, Platz unter der Liste. 3 Dubletten-Hinweis beim Anlegen (zweiter Klick speichert trotzdem) und beim Einlesen (Dubletten nicht vorausgewählt, `src/lib/dupes.js`), Monogramm statt Katalogbild, Unterzeile „Link zu <Shop>“ statt Titel-Wiederholung, ohne Link „Ohne Link, Wishtale hat Ideen dazu“. 4 „Bearbeiten“-Knopf im Profilkopf entfernt. 5 Profilkopf zeigt den eigenen Text, sonst einen Link zum Feld. 6 Wunsch-Dialog: Hauptfeld oben, Link optional darunter, Rest unter „Mehr Angaben“, Budget nur bei „Nur Kategorie“, Preis nicht bei Erlebnis und freiem Wunsch, Schließen-Knopf, Knöpfe unten fest, eigene Checkboxen, Auswahllisten und Dateiknopf. 7 Aktionen oben im Wunsch-Detail, Schließen-Knopf. 8 Historie: „Deine Geschenke, bekommen und verschenkt“, Blöcke „Was ich bekommen habe“ und „Was ich verschenkt habe“, Leerzustand statt grünem Banner. 9 Filter „Offen | Erledigt | Alle Wünsche“, Kategorie als Auswahl „Alle Kategorien“, Knopf „Erledigt, habe ich schon“. 10 Legende für die Prioritätspunkte. 11 Sichtbarkeit als Knopf mit Pfeil, Legende ohne Doppelung. 12 Pinterest und Instagram speichern beim Verlassen des Feldes. 13 Speicher-Anzeige nicht mehr abgeschnitten, am Handy klein sichtbar. 14 keine Scrollbalken in Leisten, Preisrahmen bricht um. 15 einheitlich „Bei Amazon suchen“ und „Bei Amazon ansehen“.

Offen: Jann entscheidet, ob Gast-Ideen mit Haiku 5.5 getestet werden (schneller, Qualität vorher vergleichen). Die Dubletten in Janns eigener Liste (Shark, AirPods) bleiben stehen, bis Jann sie löscht.
