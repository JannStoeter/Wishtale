---
topic: 045-keine-vorschlaege-pro-wunsch
status: entschieden
option: A
datum: 2026-11-12
umgesetzt: c85b1d6
---
**Janns Anweisung, umgesetzt (Option A).** Datenbank: neue Spalte `wishes.no_suggest` und `public_profile` liefert sie (Migration `0023`, in Supabase angewendet). Im Wunschformular gibt es das Häkchen „Hierfür keine Vorschläge generieren“, im Wunschdetail der eigenen Ansicht einen Knopf zum Aus- und Wiedereinschalten. Ist es gesetzt, gibt es zu diesem Wunsch keine KI-Vorschläge, keine Katalog-Vorschläge und keine Alternativen, nur ein eigener Link der Person bleibt. Gäste und die Person selbst lesen „Hierfür werden auf Wunsch von <Nutzer> keine Vorschläge generiert.“ Der Nutzer ist bei normalen Konten der Name der Person, bei Kind-Konten das Elternteil (Name aus dem Hauptkonto). Der Server (`api/ideas`) liefert für solche Wünsche ebenfalls nichts. Mit simuliertem Kind-Konto geprüft: Abschalten, Speichern (`no_suggest: true`) und die Gast-Ansicht mit „Mira“ als Nutzer.
