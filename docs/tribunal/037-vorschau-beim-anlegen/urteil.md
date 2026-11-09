---
topic: 037-vorschau-beim-anlegen
status: entschieden
option: A
datum: 2026-11-09
umgesetzt: 84e9aa1
---
**Janns Anweisung, umgesetzt (Option A).** Sobald im Wunschformular ein Titel gelesen oder getippt ist (Titel einlesen, Amazon-Link mit Namen, Eingabe im Namensfeld), erscheint direkt darunter die Vorschau „So sehen Freunde diesen Wunsch“: Karte mit dem Namen und der Suche bei Amazon, danach der KI-Wartezustand „Wishtale sucht passende Produkte …“ und die Vorschläge von Wishtale. Die Bestätigung lautet „Titel gelesen, so sehen Freunde diesen Wunsch“. Die Kategorie wird aus dem Titel geraten (Kopfhörer werden Technik statt Wohnen). Technisch: `api/ideas` kennt jetzt einen Entwurfs-Modus (`mode=wish&t=<Titel>` ohne gespeicherten Wunsch), gleiche Zwischenspeicherung und Limits. Nicht bei Erlebnis und freiem Wunsch. Mit simuliertem Konto geprüft, der Entwurfs-Modus gegen die Live-Schnittstelle nach dem Deploy.
