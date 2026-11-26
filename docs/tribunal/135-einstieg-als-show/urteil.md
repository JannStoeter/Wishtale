---
topic: 135-einstieg-als-show
status: entschieden
option: umsetzen
datum: 2026-11-26
umgesetzt: f69d1bc
---
**Jann im Chat:** Der Einstieg zeigt statt einer festen Wunschliste eine kleine Show mit Wunschliste, passenden Ideen und Kinder-Konten. Das ersetzt aus 132 den Punkt „keine Vorführung mit Reitern“, Versprechen und Hauptknopf bleiben unverändert.

Umsetzung: `.lp-show` in `index.html` mit drei Reitern (`role=tablist`) und drei Folien: die bisherige Beispiel-Wunschliste, „Ideen für Mia“ (vager Wunsch mit „Wishtale hat Ideen dazu“, zwei Vorschläge mit „Passt, weil …“, klar als Vorschlag gekennzeichnet) und „Paulas Wunschzettel“ (Kind-Konto, Wünsche in Handschrift Caveat, kostenlos, zweites Elternteil). Folien wechseln alle 6,5 s mit Fortschrittsstrich, halten bei Maus darüber, Fokus oder verstecktem Tab, laufen nach Klick, Pfeiltaste oder Wischen nicht mehr von selbst und bei reduzierter Bewegung gar nicht. Ohne JavaScript bleibt die Wunschliste stehen. Neue Textschlüssel `show.*`, bestehende Schlüssel unverändert.
