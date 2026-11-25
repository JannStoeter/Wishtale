---
topic: 127-suche-bei-amazon-und-otto
status: entschieden
option: umsetzen
datum: 2026-11-25
umgesetzt: offen
---
**Jann im Projekt:** „Bei „Wunsch hinzufügen“ bitte default auf „Eingeben“ starten […] Amazon oder Otto als Auswahl oder so“.

Umsetzung: `wishTab()` startet bei „Eingeben“. Die Suche hat die Auswahl Amazon, Otto und Andere Shops (`wsShop()`, `wishtale:wshop`). Amazon: Brave-Websuche `site:amazon.de`, nur Produktseiten mit ASIN, Name und getaggter Link, ohne Bild und Preis von Amazon (Bild sucht Wishtale nach dem Speichern bei Hersteller oder Shop). Otto: Brave `site:otto.de`, Produktseiten werden gelesen (Name, Preis, Bild), Link über Awin. Empfehlung für später: Amazon-Produktschnittstelle (PA-API) für Bilder und Preise, sobald freigeschaltet.
