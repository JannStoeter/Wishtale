---
topic: 038-pinterest-kurzlink
status: entschieden
option: A
datum: 2026-11-10
umgesetzt: 4854398
---
**Fehler behoben (Option A).** Im Profil (Pinterest, Profil oder Board) erkennt Wishtale Kurzlinks `pin.it/…`. Der Server (`api/resolve`, Parameter `k=pin`) verfolgt die Weiterleitung über `api.pinterest.com/url_shortener/` bis zur langen Adresse und ruft nur diese Kette auf, nie die Zielseite, nur Pinterest-Hosts sind erlaubt. Aus `pin.it/5mJLfZEsa` wird `pinterest.com/jannstoeter/` (Profil), Parameter wie `invite_code` werden verworfen. Einzelne Pins bleiben nicht erlaubt, dafür kommt weiter der Hinweis auf Profil oder Board. Mit simulierter Auflösung im Browser und mit Unit-Tests der Sicherheitsregeln geprüft, die echte Kette habe ich per Abruf nachvollzogen.
