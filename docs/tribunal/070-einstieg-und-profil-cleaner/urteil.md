---
topic: 070-einstieg-und-profil-cleaner
status: entschieden
option: Anweisung
datum: 2026-11-13
umgesetzt: 7df08c4
---
**Befund beim ersten Anmelden am Handy:** Ein Willkommens-Rundgang mit vier Beispielansichten und erfundenen Produkten legte sich über die Seite, danach kam eine große Karte „Erste Schritte“ mit fünf Schritten, darunter erst die Wunschliste, dazu Hinweise, Umschalter und ein schwebender Knopf. Der Wunsch, um den es geht, stand unter dem Falz.
**Umgesetzt** (`src/main.js`, `src/views/wishes.js`, `src/views/steps.js`, `src/views/profile.js`, `src/actions.js`, `src/styles/main.css`):
- Der Willkommens-Rundgang entfällt. Der erste Bildschirm ist die Wunschliste mit einem Feld: Überschrift „Was wünschst du dir?“, ein Satz, ein Eingabefeld, „Weiter“ und die kleine Zeile „Schon eine Liste? Liste einlesen“. Alles andere (Hinweise, Umschalter, schwebender Knopf, Werbekarte) erscheint erst mit dem ersten Wunsch. „Weiter“ öffnet das Wunschformular mit dem Text und startet gleich die Erkennung.
- „Erste Schritte“ ist eine schmale, aufklappbare Zeile mit Fortschrittsbalken, erst ab dem ersten Wunsch sichtbar.
- Profil: kompakter dunkler Kopf (Name, ein Satz, zwei Knöpfe), kürzere Texte, die Erklärzeile und die Legende entfallen, Abschnitte mit kleiner Überschrift, Stift statt „Ändern“, Sichtbarkeit am Handy als Symbol, leere Abschnitte als gestrichelter „+ Hinzufügen“-Knopf, „Das habe ich schon“ und „Was dich inspiriert“ eingeklappt.
**Zu Annas Erlebnis:** Anna hat „Essie nagellack“ eingegeben (zwei Wörter). Die Erkennung startet erst ab drei Wörtern oder mit Zahl; darunter steht nur der Hinweis „Wir zeigen deinen Freunden passende Ideen dazu“, es erscheint keine Karte, und die Vorschläge kommen erst im Wunsch-Detail. Das ist gewollt (Entscheidung 053), kann aber wie ein Fehler wirken. Offen: Schwelle auf zwei Wörter senken.
Geprüft mit Playwright (390 px), axe ohne Befund.
