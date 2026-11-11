---
autor: chatgpt
datum: 2026-11-11
empfehlung: A
sicherheit: hoch
aufwand: groß
kosten: keine nennenswerten laufenden Kosten; einmaliger Entwicklungs- und Testaufwand
---
## Begründung
**A ist der beste Kompromiss:** Beide Eltern können das Kinderprofil im Alltag gemeinsam pflegen. Ein Hauptkonto bleibt für Einladungen, Entfernen und Löschen verantwortlich. Das ist für Familien verständlich und begrenzt zugleich das Risiko, dass ein versehentlicher oder eskalierter Konflikt das Profil endgültig entfernt.

Technisch sollte der Zugriff nicht durch geteilte Zugangsdaten entstehen. Ergänzt eine eigene Zuordnungstabelle (z. B. `profile_members`) mit Profil, Nutzerkonto und Rolle. Die Einladung sollte an ein bereits angemeldetes Konto gebunden, einmalig verwendbar, zeitlich begrenzt und widerrufbar sein. Der zweite Elternteil erhält nach Annahme Bearbeitungsrechte für das Kinderprofil und dessen Wünsche, aber keine Rechte am Wishtale-Konto des Hauptnutzers.

Wichtig: Das ist mehr als ein zusätzlicher Knopf in der Oberfläche. Heute hängen die RLS-Regeln für `profiles`, `wishes` und `gifts` an `profiles.owner_id`. Auch Funktionen wie `owner_reservations()` prüfen ausdrücklich nur diese Eigentümerschaft. Alle Tabellen, Datenbankfunktionen und Server-Endpunkte, die ein Kinderprofil lesen oder verändern, müssen die Mitgliedschaft konsistent berücksichtigen. Reservierungen und die Überraschung für Beschenkte dürfen dadurch nicht offengelegt werden. `given_gifts` bleibt ein persönlicher Bereich des jeweiligen Kontos und wird nicht geteilt.

## Risiken
- Eine unvollständige Umstellung der RLS-Policies oder Security-Definer-Funktionen kann entweder den zweiten Elternteil aussperren oder unberechtigten Zugriff ermöglichen.
- Einladungslinks dürfen nicht als dauerhaft gültige Bearbeitungs-Tokens funktionieren. Annahme nur nach Login, einmalig, mit Ablauf und Widerruf.
- Es muss klar sein, was bei Kontolöschung, Entfernen eines Mitverwalters und Löschen des Hauptkontos passiert. Das Kinderprofil braucht weiterhin genau einen verantwortlichen Eigentümer.
- Vor Freigabe sind Tests mit zwei getrennten Konten nötig: Lesen, Anlegen, Ändern und Löschen von Wünschen, Reservierungsübersicht, private Wünsche, Widerruf sowie Zugriffsversuche nach Entfernung.

## Gegenargument
B ist für Eltern auf den ersten Blick symmetrischer. Es vermeidet eine Hierarchie zwischen den Eltern und kann in einer gleichberechtigten Familie natürlicher wirken. Ich würde trotzdem A wählen: Das Kinderprofil braucht einen klaren Eigentümer für Einladungen, Kontowechsel und endgültige Löschung. Die tägliche Pflege bleibt für beide gleichberechtigt. Falls sich später ein echter Bedarf zeigt, kann man die Verwaltungsrechte gezielt erweitern.
