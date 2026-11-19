---
topic: 097-geraete-je-bereich-admins-nicht-zaehlen
status: entschieden
option: Geräte je Bereich und Admins nicht mitzählen
datum: 2026-11-19
umgesetzt: 632c4e7cddc2fbfe01346bbe6fb43cc84efd00c5
---
Im CMS unter „Auswertung“ steht jetzt „Geräte je Bereich“: Handy, Computer und Tablet getrennt für Landingpage, eigene App und Gast-Link, mit Anteil Handy, dazu wie viele die App vom Home-Bildschirm starten. Grundlage ist das neue Ereignis `app_open` (einmal je Start der eigenen App, nur mit der Angabe `pwa` oder `browser`) und die Funktion `admin_usage_devices()` aus Migration `0029` (eingespielt). Die bestehende `admin_usage()` blieb unverändert.

Admins werden nicht mehr mitgezählt: Sobald `is_admin()` in der App oder im CMS zutrifft, setzt der Browser `wishtale:no-stats`. Nach dem Löschen des Browser-Speichers gilt das erst wieder ab der nächsten Anmeldung, deshalb zusätzlich „Do Not Track“ im eigenen Browser empfohlen.

Geprüft: ESLint, Build, Playwright (normales Konto meldet `app_open` mit `browser`, Admin meldet nichts und setzt den Schalter), Server-Seite nimmt `app_open` an. Datenschutz Abschnitt 8 ergänzt. Bisherige Zahlen enthalten Janns eigene Besuche, verlässlich werden die neuen Zahlen ab jetzt.
