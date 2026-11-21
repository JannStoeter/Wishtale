---
topic: 102-teilen-vorschau-und-reservieren
status: entschieden
option: Teilen-Link mit Vorschau und Reservieren in der Gastliste
datum: 2026-11-21
umgesetzt: a94caaac0e8fc94f572bfbce0cbdd5f1dbf09ce1
---
Teilen: Echte Konten teilen jetzt `wishtale.de/w/<kürzel>` statt `/app/#p/<kürzel>`. Messenger lesen den Teil hinter `#` nicht, und die App-Seite hatte keine Vorschau-Angaben, darum erschien bisher keine Karte. Die neue Adresse liefert eine kleine Seite mit Titel („Mias Wunschliste“), einer Beschreibung mit der Zahl der offenen Wünsche und einem eigenen Vorschaubild und leitet Menschen sofort zur Gastansicht weiter. Gezeigt wird nur, was Gäste ohnehin sehen. Technisch läuft das als `op=share` in `api/resolve.js`, es kommt keine Server-Funktion dazu. Alte Links funktionieren weiter.

Reservieren: In der Gastliste hat jeder freie Wunsch einen Umriss-Knopf „Reservieren“ (Liste und Kacheln), der Hinweis oben erklärt es in einem Satz. Der Knopf sitzt neben der Zeile und nicht darin, damit Tastatur und Screenreader beide Ziele getrennt bedienen können. Reservieren ohne Produktwahl geht damit in einem Tipp, die Auswahl eines bestimmten Produkts bleibt in der Wunsch-Ansicht.

Geprüft: ESLint, Build, Prüfung der Vorschauseite mit nachgestelltem Profil (Titel, Beschreibung, Bild, Weiterleitung, ungültiges Kürzel ohne Einschleusen von Code), Playwright Gastansicht bei 390 und 1280 px (Knöpfe, Reservieren ohne Dialog, Bestätigung), axe ohne Befund. Live geprüft nach dem Deploy: siehe Log. Nicht geprüft: Vorschau in einer echten WhatsApp-Nachricht.
