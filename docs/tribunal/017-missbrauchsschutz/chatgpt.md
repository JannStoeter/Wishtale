---
autor: chatgpt
datum: 2026-11-09
empfehlung: A
sicherheit: hoch
aufwand: mittel
kosten: Keine wesentlichen externen Kosten; Entwicklungs- und Datenbankaufwand
---

## Begründung

**Belegt:** Die aktuelle Bremse zählt je Serverinstanz im Speicher. Neustarts und mehrere Instanzen können diese Begrenzung umgehen. KI-Aufrufe können Kosten verursachen; die Tabelle `usage` ist bereits vorhanden.

Ich empfehle **dauerhafte Limits in der Datenbank für angemeldete Konten und zusätzliche Begrenzungen für Gast-Aufrufe**. Die Regeln sollten je Funktion abgestuft sein, damit ein Upload nicht dasselbe Limit wie eine günstige Anfrage erhält. Fehlermeldungen müssen verständlich sein und legitime Nutzer nicht unnötig aussperren.

**Vermutung:** Ein solider Basisschutz vor Werbung ist günstiger als die Reaktion auf unerwartet hohe API-Kosten.

**Nicht geprüft:** Aktuelle reale Missbrauchsversuche, die optimale Grenzwerte und die Belastung der Datenbank bei hohem Traffic.

## Risiken

- Zu strenge Limits treffen legitime Nutzer.
- IP-basierte Begrenzungen können Haushalte oder Mobilfunknetze gemeinsam treffen.
- Datenbanklimits müssen atomar und instanzübergreifend wirken.

## Gegenargument

Bei sehr geringem Traffic kann die vorhandene Anbieter-Ausgabengrenze zunächst reichen. Eine aufwendigere Schutzschicht könnte vorgezogen werden, bis echte Nutzungsmuster vorliegen. Die aktuelle In-Memory-Bremse sollte dennoch nicht als verlässlicher Schutz betrachtet werden.