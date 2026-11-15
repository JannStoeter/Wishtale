---
autor: chatgpt
datum: 2026-11-15
empfehlung: A
sicherheit: mittel
aufwand: mittel
kosten: einmalig Entwicklungsaufwand; laufend zusätzlicher leichter KI-Aufruf nur bei neu erzeugten Ideenlisten, Mehrkosten noch zu messen
---
## Begründung
Ich empfehle **A mit einer Prüfung von Idee UND Begründung**, nicht nur sprachlicher Glättung. Geschmackskarten verbessern die Informationsgrundlage; sie verhindern aber keine erfundenen Tatsachen. Ein zweiter Prüfschritt kann Fehler reduzieren, garantiert jedoch keine Wahrheit.

**Hinweis:** Nach mindestens drei eigenen offenen Wünschen eine kleine, schließbare Zeile unter der Liste: „Was gefällt dir? Hilf Wishtale, passendere Ideen für deine Freunde zu finden.“ Knopf „Geschmack schärfen“. Maximal einmal pro Woche anbieten, nach drei bewussten Ablehnungen dauerhaft ausblenden, nach zehn tatsächlich beantworteten Karten nicht mehr anbieten. Überspringen zählt nicht als Antwort. Kein Startzwang und kein Verschieben vor die Wünsche. Anzeigezustand je Profil, bei Anmeldung geräteübergreifend; nur wegen eines Ladefehlers der Antworten darf der Hinweis nicht erneut erscheinen. Kind-Konten vorerst ausnehmen, weil 082 dort keine Karten anbietet. Mit 077 abstimmen, damit nicht gleichzeitig mehrere Profilpflege-Hinweise entstehen. „Drei Minuten“ würde ich ohne Nutzertest nicht versprechen.

**Prüfung:** Ein gemeinsamer kurzer Aufruf für die gesamte Ideenliste, nicht acht einzelne Aufrufe. Jede Idee hat eine stabile ID; geprüft werden Titel, Suchbegriff, Voraussetzungen und Begründung. Der Prüfer erhält einen ausdrücklich freigegebenen öffentlichen Faktenbestand und darf daraus knappe Belege zuordnen. Private Geschmacksdaten dürfen die Auswahl beeinflussen, aber nicht in Texten an Gäste auftauchen. Bestehende Ausschlüsse, Alter und Budget bleiben zusätzlich serverseitig verbindlich. Beispiel: „mag Apple“ plus „programmiert“ belegt weder Mac-Besitz noch Programmieren am Mac. Ein Mac-spezifisches Zubehör kann deshalb auch mit entschärftem Text ungeeignet sein; dann Idee entfernen oder durch eine nachweislich unabhängige Variante ersetzen.

**Technisch entscheidend:** In api/_lib/ideas.js validiert sanitize() derzeit Form und Ausschlüsse, nicht die Tatsachen der Begründung. Nur geprüfte Resultate dürfen künftig in cachePut() landen. Prüfmodell und Prüfregel-Version gehören in fingerprint(), sonst umgehen alte Antworten aus dem bis zu 45 Tage gültigen Cache die Prüfung. Bei Fehler, unvollständiger Antwort oder Timeout keine ungeprüfte Begründung veröffentlichen: betroffene Ideen auslassen, gegebenenfalls vorhandenen sicheren Rückfall verwenden. Keine endlose Neugenerierung, um wieder acht Ideen zu erreichen. Prüfer darf fremde IDs nicht ergänzen oder Artikel vertauschen. Verbrauch beider Aufrufe erfassen, Zeitbudget begrenzen.

Die eigenen Wünsche bleiben ohne konkrete Gast-Ideen; 082 und die Überraschung werden beibehalten. Vor Freigabe eine kleine Vergleichssammlung testen: Apple/Programmieren, dünnes Profil, ausschließlich private Vorliebe, konkrete Besitzangabe, Kind, Budget und widersprüchliche Antworten. Gefordert sind weniger unbelegte Behauptungen und keine schlechtere Passung, nicht bloß flüssigerer Text.

## Risiken
Die Angaben „ein Viertel mehr Kosten“ und „ein bis zwei Sekunden“ in frage.md sind unbestätigte Schätzungen. Gleicher Anbieter oder verwandte Modelle können dieselben Fehler übersehen; die Wirkung muss anhand festgehaltener Beispiele geprüft werden. Ein strenger Filter kann wenige Ideen übrig lassen. Datenschutz Abschnitt 11 bei veränderter Verarbeitung und Speicherung der Hinweispräferenzen aktualisieren; keine neuen Dienste stillschweigend hinzufügen. Ich habe Frage, Empfehlungslogik, Kartenverwaltung und Cache gelesen; keine Live-KI-Aufrufe oder Nutzertests durchgeführt. Dies ist eine Bewertung, keine Umsetzung.

## Gegenargument
B wäre schneller und günstiger; nach 088 könnten die strengeren Anweisungen bereits genügen. Der konkrete Vertrauensverlust durch erfundene persönliche Tatsachen spricht für mich trotzdem für A, sofern die zweite Prüfung einen messbaren Zusatznutzen liefert. Zeigt der Vergleich keinen Vorteil, sollte sie nicht dauerhaft zusätzliche Kosten verursachen.
