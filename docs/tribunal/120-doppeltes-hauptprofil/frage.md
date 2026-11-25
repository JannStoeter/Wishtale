---
topic: 120-doppeltes-hauptprofil
art: befund
von: jann
datum: 2026-11-25
---
# Doppeltes Hauptprofil nach der Registrierung

Wortlaut von Jann im Projekt:

> Der Grund warum Alex gelöscht hat war, dass die App zwei Konten angezeigt hat. Ein leeres und ihrs mit den Wünschen. Sie dachte sie löscht das leere aber das war eine tote Kopie eines Profils auf ihrem Konto

Befund: Zwei Konten hatten je zwei eigene Hauptprofile, angelegt rund 100 Millisekunden nacheinander direkt nach der Bestätigung (Alex über eine Einladung, und ein Testkonto). Das zweite war leer und erschien unter „Konten“ als zweites „Hauptkonto“. Ursache: `loadMine()` und die Synchronisierung konnten das erste Profil gleichzeitig anlegen, die Datenbank verhinderte das nicht.
