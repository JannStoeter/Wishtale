---
titel: Missbrauchsschutz für KI-Aufrufe
art: aufgabe
status: offen
optionen: A=Tageslimit je Konto in der Datenbank und je Adresse für Gast-Aufrufe | B=Erst bei Missbrauch reagieren | C=Vercel-Firewall oder Schutzdienst davor
erstellt: 2026-11-09
von: claude
---
## Kontext
Die Bremse für KI-Aufrufe zählt je Serverinstanz im Speicher (zum Beispiel höchstens 6 Zettel in 10 Minuten je Person, 20 Aufrufe je Adresse). Bei Neustarts und mehreren Instanzen ist das nur ein grober Schutz. Gast-Ideen sind öffentlich abrufbar (pro Profil im Zwischenspeicher). Die Ausgabengrenze bei Anthropic ist der letzte Schutz.

## Frage
Wie hart sichern wir ab, bevor Werbung läuft?
