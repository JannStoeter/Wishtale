---
autor: chatgpt
datum: 2026-11-12
empfehlung: C
sicherheit: hoch
aufwand: klein
kosten: keine laufenden Kosten; kleine Anpassung der Startansicht und Navigation
---
## Begründung

Ich empfehle **C: Nach der Anmeldung auf „Wünsche“ starten und die Reiter neu ordnen: Wünsche, Inspiration, Profil, Historie.**

Wishtale ist im Alltag zuerst die Wunschliste, nicht die Pflege des Geschmacksprofils. Nach dem Login sollte ich unmittelbar meine Wünsche sehen, ergänzen, sortieren oder eine Liste einlesen können. Die Profilbearbeitung ist wichtig, aber eine gelegentliche Pflegeaufgabe und kein sinnvoller täglicher Einstieg.

Die vorhandene Architektur unterstützt das ohne neue Dashboard-Ebene: Wünsche, Inspiration, Profil und Historie sind bereits getrennte Ansichten (src/views/shared.js, src/views/wishes.js, src/views/profile.js). Der Start lässt sich zentral über DEFAULT_VIEW in src/render.js festlegen. Auch der Hinweis auf ein noch dünnes Profil ist in der Wunschansicht bereits vorhanden (Nudge() in src/views/wishes.js). Er kann Nutzer bei Bedarf zur Profilpflege führen, ohne sie bei jeder Anmeldung dorthin zu schicken.

Die Reihenfolge sollte auf Handy und Desktop gleich sein:
1. **Wünsche** – das Herzstück und die meistgenutzte Ansicht.
2. **Inspiration** – nächster sinnvoller Schritt, wenn jemand stöbern oder eigene Ideen entwickeln möchte.
3. **Profil** – Geschmack, Interessen und Sichtbarkeit pflegen.
4. **Historie** – persönlicher Rückblick, im Alltag meist seltener gebraucht.

Die Vorschau „So sehen Schenkende es“ gehört weiterhin direkt zu den Wünschen und ins Profil. Der bereits ergänzte Umschalter auf der Wunschseite löst den konkreten Auffindbarkeitsfehler; er sollte nicht wieder hinter einer Profil-Startseite verschwinden.

## Risiken

- Wer sein Profil vervollständigen möchte, muss den Profil-Reiter bewusst öffnen. Der vorhandene Hinweis bei unvollständigem Profil auf der Wunschseite ist deshalb wichtig und sollte erhalten bleiben.
- Bestehende Links und Deep Links auf #profil, #historie oder andere Ansichten dürfen durch den neuen Standard nicht verändert werden. Nur der Fallback nach dem Login sollte auf Wünsche zeigen.
- Bei verwalteten Kind-Konten sollte ebenfalls die Wunschseite öffnen; das ist dort genauso die zentrale Arbeitsansicht.

## Gegenargument

Das Profil vermittelt den persönlichen Charakter von Wishtale und erklärt, warum Vorschläge passen. Eine Profil-Startseite macht diesen Unterschied sofort sichtbar und könnte neue Nutzer stärker zur Vervollständigung motivieren. Dagegen spricht aber, dass sie die eigentliche Aufgabe – Wünsche verwalten – unnötig nach hinten schiebt. Der vorhandene Profil-Hinweis auf der Wunschseite ist der leichtere und passendere Weg.