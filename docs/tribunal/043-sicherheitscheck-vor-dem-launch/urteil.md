---
topic: 043-sicherheitscheck-vor-dem-launch
status: entschieden
option: A
datum: 2026-11-12
umgesetzt: 903df74
---
**Janns Freigabe im Chat (Wortlaut): „Lass uns die Website erstmal scharf schalten und dann gehen wir direkt mit einer echten Kampagne rein! Also sicherheitslücken schließen!“** Option A, Hoch und Mittel vor dem Launch.

**Umgesetzt von Claude (Commit `903df74`, Migration `0024`, live geprüft):**
- Punkt 3: Wunschbilder werden beim Löschen eines Wunsches, beim Ersetzen und beim Löschen des Kontos aus dem Speicher entfernt (Konto löschen läuft über `api/account?op=delete`).
- Punkt 6: Reservieren, Freigeben und „gekauft“ laufen nur noch über `api/account` mit Begrenzung (20 Reservierungen pro Stunde und Adresse, höchstens 12 aktive Reservierungen pro Gast). Direkter Aufruf der Datenbankfunktionen ist gesperrt (live: „permission denied“, über den Server funktioniert es).
- Punkt 7 (teilweise): Neue Profil-Kürzel haben 6 Zufallszeichen statt 4. Bestehende Kürzel bleiben, um geteilte Links nicht zu brechen.
- Punkt 9: `public_profile` liefert die Stichwörter privater Wünsche nicht mehr, die KI liest sie serverseitig.
- Punkt 10 (teilweise): `X-Frame-Options: DENY` und Content-Security-Policy mit `frame-ancestors`, `base-uri`, `object-src`, `form-action`. Eine volle Script-Richtlinie fehlt noch (Inline-Skripte der Seiten).
- Punkte 15, 16, 17: Name im Profil wird maskiert, `.gitignore` kennt `.env`, Cron-Schlüssel wird zeitsicher verglichen.

**Noch offen:** Punkt 8 (Sichtbarkeit von Alter und „Über mich“, braucht Janns Entscheidung), 11 (Bremse bei Registrierungen, gehört zum Mailversand 041), 12 und 13 (Supabase Pro, Region), und bei Jann: 1 (Sicherungen), 2 (`CRON_SECRET`), 4 (Supabase-Weiterleitung), 5 (Passwort Jonas).
