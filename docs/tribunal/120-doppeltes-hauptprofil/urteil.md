---
topic: 120-doppeltes-hauptprofil
status: entschieden
option: auftrag
datum: 2026-11-25
umgesetzt: OFFEN
---
**Jann im Projekt** meldet die tote Kopie als Grund für die versehentliche Löschung (siehe 119).

Umsetzung: `loadMine()` legt das erste Profil nur einmal an, auch bei parallelen Aufrufen (`firstProfile()` in `src/lib/remote.js`). Trifft ein Anlegen auf ein schon vorhandenes Hauptprofil, nimmt die App dieses (auch in `syncAccount()`). Migration `0032_one_main_profile.sql` entfernt leere Doppel (nur ohne Wünsche, Geschenke, Mitverwaltung und Rückmeldungen) und legt den eindeutigen Index `profiles_one_main_per_owner` an. Die Migration spielt Claude nach Janns Okay ein.
