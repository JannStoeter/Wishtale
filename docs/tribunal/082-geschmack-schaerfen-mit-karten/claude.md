---
autor: claude
datum: 2026-11-13
empfehlung: A
sicherheit: mittel
aufwand: mittel
kosten: keine KI-Kosten je Kartenrunde, einmalig die redaktionelle Arbeit an etwa 40 Karten und eigenen Illustrationen, ein bis zwei Arbeitstage Technik
---
## Begründung
Ich habe die Position von ChatGPT gelesen, nachdem ich Frage und eigene Einschätzung im Chat formuliert hatte. Wir sind uns in der Richtung einig: **A, feste und geprüfte Karten für den Start.** Die Begründung ist bei uns beiden dieselbe (vergleichbare Signale, keine Kosten je Person, keine Rückkopplung aus den eigenen Empfehlungen). Ich ergänze fünf Punkte, die ich im Code nachgeprüft habe oder anders gewichte.

**1. Die bestehende Signal-Logik muss zuerst differenziert werden, sonst schadet die Funktion.** ChatGPT hat recht, ich habe es nachgelesen: In `api/_lib/ideas.js` landen `no` **und** `have` gleichermaßen im Bereich `avoid.strong` (Zeile 110: `kind !== 'yes'`), und dort werden verwandte Begriffe über Wortstämme (`startsWith` ab fünf Zeichen) mit ausgeschlossen. Wer „Kaffeemühle“ als „habe ich schon“ markiert, bekommt damit auch alles Kaffee-Verwandte nicht mehr vorgeschlagen, obwohl er Kaffee mag. Bei einzelnen Rückmeldungen war das tragbar, bei einem Stapel von Karten würde es die Gast-Ideen schnell ausdünnen. Vorschlag: `have` schließt nur die Produktart aus, nicht den Stamm, und zählt für den Geschmack positiv („hat schon, mag also“). `no` schließt die Karte aus, nicht automatisch die Kategorie. Erst danach die Karten freischalten.

**2. Eigene Tabelle statt `taste_signals`.** Die Abfrage liest nur die neuesten 60 Zeilen (Zeile 56). Mit Karten würden sie alte, wichtige Hinweise verdrängen, und wiederholte Runden zählten mehrfach. Besser: Tabelle `taste_cards` (Profil, Karten-ID, Antwort, Version, geändert am, höchstens eine Zeile je Profil und Karte), vom Server zu wenigen Merkmalen aggregiert („mag: Kaffee, Keramik; hat schon: Bratpfanne; nicht: Duftkerzen“) und der KI als kurzer Absatz mitgegeben. Das macht Antworten ändern, einsehen und löschen einfach (eine Zeile je Karte) und bleibt klein.

**3. Wer die Gast-Ideen mit den Karten verwechselt, verrät sich selbst.** Die Karten zeigen breite Produktarten und Stile ohne Shop, die Gast-Ideen bleiben konkrete Vorschläge aus anderen Titeln. Dass jemand, der Kaffee mag, Kaffee-Ideen erwarten kann, lässt sich nicht verhindern, und das ist auch in Ordnung: Die Überraschung liegt im konkreten Produkt und darin, wer es auswählt, nicht in der Richtung.

**4. Ideen unter den eigenen Wünschen entfallen, die Vorschau öffnet nichts mehr vor.** Ich schlage vor, den Abschnitt „Ideen von Wishtale“ auf der Wünsche-Seite jetzt zu entfernen (Jann hat gefragt, ob wir das tun sollen, es wartet auf sein Ja). An seiner Stelle steht höchstens eine ruhige Zeile „Deinen Geschmack schärfen, dauert drei Minuten“. Die Seite Inspiration im Menü bleibt für den Übergang, bis die Karten sie ersetzen. ChatGPT sagt zusätzlich, die Vorschau solle keine Gast-Ideen automatisch vorladen und zeigen. Das übernehme ich: In der Vorschau werden sie nur auf ausdrücklichen Wunsch geladen, das spart auch Aufrufe.

**5. Umfang und Reihenfolge.** Etwa 40 Karten in 8 bis 10 Kategorien (Küche, Kaffee und Tee, Wohnen, Lesen, Spiele, Technik, Draußen, Selbstfürsorge, Kreatives, dazu Kinder in drei Altersstufen), je Runde höchstens zehn, am Ende ein freundlicher Abschluss und kein Autostart der nächsten Runde. Antwortknöpfe: „Gefällt mir“, „Passt nicht“, „Habe ich schon“, dazu „Überspringen“ und „Rückgängig“. Wischen als Zugabe, nicht als einzige Bedienung. Zugang aus dem Menü („Für dich“), aus der Einladung unter der Wunschliste und aus der Klicktour von 077. So wird das auch die wichtigste dezente Pflege-Aufforderung.

Erste Version (klein): Datenmodell mit Karten-Datei im Repository, Seite im Menü, Tastaturbedienung, Zurücksetzen, Datenschutz-Abschnitt 11. Danach die Signal-Logik aus Punkt 1 und die Aggregation. Kinderkarten und Illustrationen als zweiter Schritt, bis dahin erscheint die Seite nur für Erwachsene.

## Risiken
Der Lerneffekt ist noch nicht gemessen. Feste Karten können einseitig sein, deshalb Kategorien und Stile mischen und nach den ersten Wochen prüfen, ob die Gast-Ideen wirklich besser angeklickt werden (`idea_click`, Passt-nicht-Quote). Mehr Geschmacksdaten je Person heißt mehr Verantwortung: Löschung bei Konto-Löschung, Zurücksetzen, Abschnitt 11, bei Kind-Konten nur Eltern, und keine Hochrechnung auf sensible Eigenschaften. Eigene Illustrationen sind Arbeit, Fotos wären riskanter wegen der Rechte. Die Karten sollen nicht wie ein Spiel zum Dauerwischen werden, deshalb die Obergrenze je Runde.

## Gegenargument
Wer neu ist, wird bei zehn Karten zum Geschmack gefragt, bevor er überhaupt einen Wunsch eingetragen hat, und das kann abschrecken. Dem begegnen wir, indem die Karten nie vor dem ersten Wunsch erscheinen und nur freiwillig angeboten werden. Und wenn die Karten wenig bringen, haben wir wenig verloren: Feste Karten sind billig, und der Umbau der Signal-Logik ist ohnehin überfällig.
