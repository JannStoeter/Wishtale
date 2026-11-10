---
autor: chatgpt
datum: 2026-11-10
empfehlung: A
sicherheit: hoch
aufwand: mittel
kosten: einmalig gering bis mittel, laufend gering
---
## Begründung

Ich empfehle **A: einen Einladungslink mit vorbereitetem Entwurf, aber ohne vorab angelegtes Konto**. Das trifft den Geschenkgedanken am besten: Jann kann zu Weihnachten etwas Persönliches vorbereiten, ohne dafür E-Mail-Adresse, Zustimmung oder Zugangsdaten der beschenkten Person zu benötigen.

Der Link sollte eine kleine Vorschau auf das vorbereitete Wishtale öffnen. Der Name ist vorausgefüllt und 1–2 Ideen können als **„Tipp von Jann“** erscheinen. Wichtig: Diese Tipps sind noch keine Wünsche der eingeladenen Person. Erst nach dem Öffnen, Prüfen und ausdrücklichen Annehmen übernimmt die Person den Entwurf in die eigene Einrichtung bzw. Registrierung. Name und Tipps müssen bearbeitbar und einzeln entfernbar sein.

Das passt zu vorhandenen Bausteinen: Einrichtungsentwürfe können bereits übernommen werden (adoptDraft, user_metadata.draft), und Wünsche kennen mit via bereits einen Hinweis auf „Tipp von …“ (CLAUDE.md). Der neue Teil wäre vor allem das sichere Bereitstellen und Übernehmen eines Entwurfs über einen Einladungslink.

**B** würde ich nicht wählen: Ein Konto mit der E-Mail-Adresse einer anderen Person anzulegen, bevor diese davon weiß oder zugestimmt hat, ist unnötig invasiv und erzeugt Reibung bei Anmeldung und Datenschutz. **C** ist für den Zweck zu schwergewichtig: Ein verwaltetes Profil mit späterer Übergabe schafft zusätzliche Fragen zu Eigentümerschaft, Bearbeitungsrechten und Übergabe. **D** verschenkt einen schönen, naheliegenden Einstieg, obwohl A mit überschaubarem Umfang möglich erscheint.

## Risiken

- Der Link ist ein Zugang zum vorbereiteten Entwurf und muss deshalb wie ein Geheimnis behandelt werden: zufälliges, nicht erratbares Token, serverseitige Zuordnung, widerrufbar und nach erfolgreicher Übernahme nicht erneut verwendbar. Keine Namen oder Wünsche direkt im URL-Token.
- Wer den Link weiterleitet, könnte den Entwurf übernehmen. Die Vorschau sollte deshalb klar zeigen, für wen er gedacht ist; beim Übernehmen bestätigt die Person, dass sie das Profil für sich anlegt.
- Tipps dürfen nie wie selbst gewählte Wünsche aussehen. Herkunft („Tipp von Jann“) muss auch nach der Übernahme erkennbar bleiben, bis die Person sie selbst übernimmt oder ändert.
- Noch nicht geprüft ist, wie sich ein geteilter Entwurf am saubersten in den bestehenden Registrierungs- und adoptDraft-Ablauf einfügt. Das sollte vor dem Bau technisch abgeglichen werden.

## Gegenargument

Auch A braucht einen neuen, sicheren Einladungs- und Übernahmeablauf. Wenn das nur selten genutzt wird, könnte selbst dieser Aufwand größer sein als der Nutzen. Eine einfache persönliche Einladung zur normalen Registrierung wäre günstiger. Trotzdem halte ich A für den besten Kompromiss, weil gerade das vorbereitete, persönliche Geschenk der eigentliche Mehrwert dieser Funktion ist.
