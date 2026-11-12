---
topic: 072-welten-vorerst-ausblenden
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: PENDING
---
Schalter `WORLDS = false` in `src/lib/flags.js`. Ausgeblendet: Welten-Auswahl in Einrichtung und Profil, Welten-Kapitel in der Info-Welt der Gäste, Katalog-Produkte nach Welten und „beliebte Wunschideen“ in der Inspiration, automatische Produkte in der App-Aktion. Die Inspiration zeigt nur noch die KI-Ideen (Überschrift „Ideen für dich“). Gespeicherte Welten bleiben in der Datenbank und fließen weiter als Geschmack in die KI-Ideen ein. Profilfortschritt (`completeness`) rechnet ohne Welten auf 100 Prozent hoch. `WORLDS = true` schaltet alles wieder ein.
