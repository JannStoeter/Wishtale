---
topic: 101-besitz-im-profilweg
status: entschieden
option: Eigener Schritt in der Profil-Einrichtung
datum: 2026-11-20
umgesetzt: ff88dfd431fc018a68ce1009cfc4ec4ce361e010
---
Befund: Es waren keine Daten verloren, in der Datenbank standen 22 Einträge „habe ich schon“. Das Eintragen gab es aber nur als eingeklappten Abschnitt weit unten im Profil und über Knöpfe bei Wünschen und Vorschlägen; einen Schritt in der Profil-Einrichtung gab es nie, obwohl die Einrichtung ihn ankündigte.

Umgesetzt: In der Profil-Einrichtung gibt es jetzt den Schritt „Was hast du schon?“ (vor „Und wenn deinen Freunden gar nichts einfällt?“) mit Vorschlägen zum Antippen und einem Feld für eigene Angaben, für Kind-Konten mit eigenen Vorschlägen. Was dort gewählt wird, speichert Wishtale wie den Profil-Abschnitt „Das habe ich schon“: als erledigten Eintrag, der nie auf der Wunschliste erscheint und nur dafür sorgt, dass Wishtale ihn nicht mehr vorschlägt. Abwählen entfernt den Eintrag wieder. Der Profil-Abschnitt ist jetzt immer aufgeklappt.

Geprüft: ESLint, Build, Playwright bei 390 px (Schritt erscheint, Auswahl, eigener Eintrag, Abwählen, nicht auf der Wunschliste, im Profil sichtbar), axe ohne Befund. Nicht geprüft: echtes Gerät.
