---
topic: 069-kind-konto-alter-und-groesse
status: entschieden
option: Anweisung
datum: 2026-11-13
umgesetzt: 21a3aea
---
**Umgesetzt** (Migration `0027_child_birthdate.sql`, `src/lib/age.js`, `src/lib/remote.js`, `src/views/modals.js`, `src/views/profile.js`, `src/views/about.js`, `src/data/content.js`, `src/logic.js`, `src/lib/products.js`, `api/_lib/ideas.js`):
- Beim Anlegen eines Kind-Kontos ist das Geburtsdatum Pflicht (unter 18), die aktuelle Kleidergröße optional mit Empfehlung. Beide lassen sich im Profil des Kindes ändern. Das Geburtsdatum bleibt im Konto der Eltern; `public_profile` berechnet daraus nur das Alter in Jahren (nie Tag oder Monat) und liefert die Größe, wenn sie angegeben ist. In der Info-Welt erscheint ein Kapitel „Aktuelle Größe“.
- Kinder-Konten sehen in der Einrichtung nur kindgerechte Auswahllisten (Interessen wie Bauen, Tiere, Dinosaurier; Marken wie LEGO, Playmobil, SIKU, Schleich, Ravensburger, Tonies, Haba, Brio; Welten nur Spielzeug, Bücher, Sport, Outdoor, Erlebnisse, Mode; passende No-Gos, Ausflüge und Gutscheine) und kindgerechte Überschriften. Das Kategorie-Feld im Wunsch-Dialog ist ebenso begrenzt.
- Die statische Produktliste (Erwachsenenprodukte) und Katalog-Ideen außerhalb von Spielzeug und Kinderbüchern bleiben für Kinder ausgeblendet; neu im Katalog: neun Kinder-Ideen (LEGO, Playmobil, SIKU, Schleich, Ravensburger, Tonies, Haba, Brio, Bilderbuch).
- Die KI bekommt Alter, „kind_konto“ und Kleidergröße und hat eine eigene Regel: altersgerecht, nur kindgerechte Marken, nichts für Erwachsene, Altersempfehlung (keine Kleinteile unter 3), Kleidung in der angegebenen Größe.
**Bitte einspielen:** Die Migration muss im Supabase-SQL-Editor laufen, bevor ein Kind-Konto mit Geburtsdatum angelegt wird (neue Spalten `birthdate`, `clothing_size`, neue `public_profile`). Bestehende Kind-Konten mit nur einem Alter funktionieren weiter.
Offen: Bei bestehenden Kind-Konten gibt es kein Geburtsdatum, bis es im Profil eingetragen wird. Das Alter wird dann jedes Jahr automatisch weitergezählt.
