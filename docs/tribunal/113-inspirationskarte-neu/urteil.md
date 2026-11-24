---
topic: 113-inspirationskarte-neu
status: entschieden
option: Ruhige Karte mit Symbol, einem Hauptknopf und Shop-Pillen
datum: 2026-11-24
umgesetzt: 1aa2803a79c8ca5e21863db0c3711c24f1aee866
---
Jann hat den Vorschlag freigegeben („Ok Push das“), gemergt als Pull Request #21. Die Ideenkarte bekommt oben ein Symbol im Stil der Wünsche ohne Bild (112), daneben Name und Preis ohne Link-Optik. Die Begründung zeigt drei Zeilen. In der eigenen Inspiration ist „Auf meine Wunschliste“ ein klarer Hauptknopf, Amazon und Otto stehen als kleine Pillen mit einem gemeinsamen „Anzeige“, „Habe ich schon“ und „Passt nicht“ ganz leise darunter. In der Gastansicht sind die Shops der Hauptweg („Bei Amazon“ gefüllt, „Bei Otto“ umrandet). Gemeinsamer Baustein `IdeaCard()` in `src/views/inspiration.js`.

Nachtrag (Jann im Thread): Nur Amazon, Otto und die Knöpfe wirken direkt. Ein Tipp auf den Namen oder die übrige Karte öffnet die Karte als Fenster mit ganzer Begründung und denselben Aktionen (`IdeaModal()`).
