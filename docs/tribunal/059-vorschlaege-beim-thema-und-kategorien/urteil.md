---
topic: 059-vorschlaege-beim-thema-und-kategorien
status: entschieden
option: Anweisung
datum: 2026-11-12
umgesetzt: d349cdc
---
**Umgesetzt** (`api/_lib/ideas.js`, `api/_lib/match.js`, `src/lib/category.js`, `src/data/content.js`, `src/actions.js`):
- Ursache: Bei Vorschlägen zu einem Wunsch bekam die KI die ganze Wunschliste mit und durfte Doppelungen mit anderen Wünschen machen. Jetzt geht die übrige Wunschliste in diesem Fall nicht mehr an die KI, die Anweisung verlangt dieselbe Produktart oder Produktwelt, und ein Filter (`offTopic()`) wirft Vorschläge raus, die zu einem anderen Wunsch gehören und mit diesem nichts gemeinsam haben. Gilt auch für gespeicherte Antworten. Begründungen ohne „sein/seine/ihr/ihre“.
- Kategorien: „Spielen & Basteln“ heißt „Spielzeug & Basteln“; Regeln für Tonies, Toni, Hörfiguren, Spielzeugmarken, Baby und Kleinkind sowie „gebundenes Buch“. Die Produkterkennung im Wunsch-Dialog liefert zusätzlich die Kategorie und setzt sie, solange die Person die Kategorie nicht selbst geändert hat.
- Bestehende Wünsche behalten ihre Kategorie.

Offen: neue Kategorien (zum Beispiel „Baby & Kinder“, „Beauty & Pflege“) als eigene Frage, weil sie auch die Welten im Profil, Bilder und Texte betreffen.
