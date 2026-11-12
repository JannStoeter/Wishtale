---
topic: 027-brave-schluessel-setzen
status: entschieden
option: A
datum: 2026-11-12
umgesetzt: 4b13088
---
**Entscheidung von Jann im Chat:** Er hat ein kostenloses Brave-Konto mit 5 Dollar Guthaben und den Schlüssel `BRAVE_SEARCH_API_KEY` selbst in Vercel eingetragen (Production). Neu deployt mit 4b13088.

Live geprüft (Jonas-Testkonto, `/api/inspect` mit `imageQuery`): „tonies Hörfigur Lieblings-Kinderlieder Herbst- und Laternenlieder“ liefert das Bild von tonies.com (Igel mit Laterne, genau die Figur), „tonies Hörfigur für Toniebox, Schlummerbande - Schlummerwal“ liefert den Schlummerwal von einem Händler (jetzt-kommt-kurth.de), „Apple AirPods Pro 3 …“ liefert ein Bild von apple.com. Websuche und Herstellerseite zuerst (057) funktionieren mit dem Free-Plan.

Offen: Verbrauch im Brave-Dashboard beobachten (5 Dollar entsprechen laut Preisseiten etwa 1.000 Abfragen, eine Abfrage fällt nur beim Anlegen eines Wunsches ohne Bild an). Die Bildersuche als Rückfall wurde nicht eigens getestet.
