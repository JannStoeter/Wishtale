---
topic: 136-auswertung-heute-und-funnel
status: entschieden
option: umsetzen
datum: 2026-11-26
umgesetzt: 128fe7f
---
**Jann im Projekt:** Auswertung für „Heute“ im CMS und besser sehen, wo Besucher vor dem Konto abspringen.

Umsetzung ohne Cookies: Zeitraum „Heute“ (Standard) in der CMS-Auswertung. Neues Ereignis `step` mit den Labels `name_ok`, `register_view`, `login_view`, `google_up`, `google_in`, `signup_sent` und `signup_err:<art>` (exists, password, email, ratelimit, network, other; nie die Eingabe). Labels dürfen jetzt `:` enthalten, vorher gingen die Knopf-Labels der Landingpage (`start:start`) verloren. Neue Datenbankfunktion `admin_funnel(p_days, p_source)` (`0033`, nur lesend, nur Admins): Schritte je Herkunft, größter Verlust markiert, Fehler der Registrierung, geklickte Knöpfe. Datenschutz Abschnitt 8 ergänzt.
