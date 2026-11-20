---
topic: 100-kategorien-smart
status: entschieden
option: A (Stufe 1) umgesetzt, B (eigene Gruppen) offen
datum: 2026-11-20
umgesetzt: b903d719105a3bf7aad7dbf4d7f89a5eee1f3d08
---
Jann im Chat: „Baue Stufe 1. Denke selbst über sinnvolle Gruppen nach … graduieren zwischen Sport und Fitness … sowie Outdoor und Wintersport“.

Umgesetzt: 22 feste Kategorien mit kurzer Beschreibung für die KI: Wohnen & Interior, Kochen & Backen, Kaffee, Tee & Genuss, Technik, Gaming, Fitness & Training, Sport, Fahrrad & Radsport, Outdoor & Wandern, Wintersport, Reisen, Mode & Accessoires, Beauty & Pflege, Bücher, Musik, Garten & Balkon, Werkzeug & Heimwerken, Spielzeug & Basteln, Baby & Kleinkind, Haustier, Erlebnisse und Sonstiges. Die bisherigen Kennungen bleiben gleich, nur einige Namen sind genauer. „Sonstiges“ ersetzt „Wohnen“ als Auffang.

Die Wortliste ist erweitert und prüft Spezielles vor Allgemeinem (Skihelm zu Wintersport, Hanteln zu Fitness, Nagellack zu Beauty). Kennt sie einen Wunsch nicht, ordnet das leichte Modell ihn nach dem Speichern ein; es geht nur der Name des Wunsches raus, höchstens 24 auf einmal, mit Zwischenspeicher und den bestehenden Missbrauchsgrenzen. Hat jemand die Kategorie selbst gewählt, bleibt sie. Beim nächsten Öffnen der Wunschliste werden ältere Wünsche je Profil einmal neu einsortiert: Was nur als Sammelbecken in „Wohnen“ stand, kommt in die passende Kategorie, und Wünsche aus breiten Kategorien wandern in neue speziellere, wenn die Wortliste sie eindeutig erkennt.

Geprüft: ESLint, Build, Playwright mit Testkonto (Neusortierung, ein KI-Aufruf nur für den unbekannten Wunsch, Speichern, kein zweiter Durchlauf nach dem Neuladen, neuer Wunsch ohne Treffer geht an die KI), Prüfung der Antwortauswertung. Nicht geprüft: echte Antworten des Modells.

Offen: Stufe 2, eigene Gruppen je Person (zum Beispiel „Kaffee“), wenn sich mehrere Wünsche zu einem Thema sammeln.
