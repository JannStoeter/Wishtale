---
titel: Nutzerzentrale und reduzierte Schenkendenansicht
art: entscheidung
status: offen
optionen: A=Persönliche Seitenleiste, reine Gastliste und zweistufige Reservierungsidentität | B=Nur die Oberflächen trennen, Reservierung technisch unverändert lassen | C=Bestehende Navigation und Ansichten lediglich verdichten
erstellt: 2026-11-13
von: chatgpt
---
## Kontext
Wishtale soll gleichzeitig sehr einfach zu bedienen sein und seinen USP behalten: Nicht nur Wünsche, sondern die Persönlichkeit dahinter hilft beim Schenken. Derzeit konkurrieren diese Ziele miteinander. In der eigenen Ansicht verteilen sich Wünsche, Profil, Historie, Inspirationen, Kind-Konten, Einstellungen und „Meine Geschenke“ auf mehrere Orte. In der Schenkendenansicht stehen Profilinformationen, Empfehlungen und weitere Bedienelemente neben der eigentlichen Wunschliste. „Über Jonas“ wäre zudem doppelt, wenn Profilkopf und untere Navigation dorthin führen.

Die beiden Nutzungssituationen sollen deshalb bewusst unterschiedlich werden:

### Eigene Ansicht: persönliche Nutzerzentrale
Ein Tipp auf Avatar oder Profil öffnet mobil eine Seitenleiste. Sie bündelt:

- **Mein Wishtale:** Wünsche, Profil und Persönlichkeit, Historie
- **Für dich:** Inspirationen und Meine Geschenke
- **Meine Profile:** eigenes Profil, Kind-Konten sowie Profil hinzufügen oder jemanden einladen
- **Organisation:** Teilen und Sichtbarkeit, Einstellungen, Abmelden

Der Inhalt bleibt persönlich, wird aber nicht mehr oberhalb der Wünsche gestapelt. Die bisherige untere Hauptnavigation kann dadurch entfallen oder stark reduziert werden. Visualisierung: [Nutzerzentrale](https://chatgpt.com/library?file_id=libfile_5eef2291a6288191ab6374a0aa7ec8e4&account_id=personal).

### Schenkendenansicht: Wunschliste ohne App-Navigation
Die öffentliche Ansicht beginnt mit genau einem kompakten Profilkopf als Tür zur Persönlichkeit. Ein Tipp öffnet die bereits vorhandene Info-Welt. Danach folgen sofort Überschrift, Überraschungshinweis, höchstens ein Filter und die Wünsche. Es gibt keinen zweiten „Über Jonas“-Knopf unten, keine eigene Seitenleiste und keine normale App-Navigation. Vorschläge und Inspirationen erscheinen nicht vor der Liste; wenn sie später erhalten bleiben sollen, höchstens eingeklappt nach allen Wünschen. Visualisierung: [reduzierte Schenkendenansicht](https://chatgpt.com/library?file_id=libfile_300521b4573481918730cf5c0c3989ad&account_id=personal).

### Reservierungen und „Meine Geschenke“
Die Reservierung bleibt zentral beim Wunsch und damit im Datenbereich des beschenkten Kontos. Der Beschenkte kann eine Reservierung jederzeit zurücksetzen, ohne die Identität des Schenkenden sehen zu müssen. Ein beliebiger externer Dritter darf sie nicht aufheben.

- Uneingeloggte Schenkende erhalten beim Reservieren eine zufällige, geheime Browser-Berechtigung. Nur dieselbe Berechtigung darf die eigene Reservierung zurücknehmen oder auf „gekauft“ setzen. Werden Browserdaten gelöscht, geht diese Bedienmöglichkeit verloren; der Beschenkte kann die Reservierung weiterhin zurücksetzen.
- Eingeloggte Schenkende verwalten ihre Reservierungen zusätzlich kontobasiert und geräteübergreifend unter „Meine Geschenke“.
- Der Beschenkte sieht weiterhin weder die Identität noch die persönliche Geschenkliste des Schenkenden. Die Überraschung bleibt.

Aktuell identifiziert Wishtale auch eingeloggte Schenkende bei Reservierungen nur über den Browser-Token, während „Meine Geschenke“ im Konto gespeichert wird. Diese Inkonsistenz müsste Option A architektonisch auflösen.

Wishbob erlaubt Gästen Reservierungen ohne Anmeldung sowie die Markierung als gekauft. Laut offizieller FAQ kann der Listenersteller jede Reservierung wieder aufheben; die normale Listenansicht verbirgt erfüllte Wünsche vor dem Beschenkten, bis die gesonderte Ansicht aktiv geöffnet wird. Die öffentliche Dokumentation belegt nicht, dass beliebige andere Gäste fremde Reservierungen aufheben dürfen. Quelle: [Wishbob FAQ](https://www.wishbob.com/faq).

## Frage
Soll Wishtale die eigene Ansicht als persönliche Nutzerzentrale in einer Seitenleiste bündeln, die Schenkendenansicht hart auf Profilkopf und Wunschliste reduzieren und Reservierungen je nach Schenkendem über Browser-Berechtigung oder Konto verwaltbar machen?

Option A setzt das vollständige Konzept um. Option B übernimmt die neue Informationsarchitektur, belässt aber die heutige browsergebundene Reservierungslogik. Option C beschränkt sich auf kleinere Kürzungen der heutigen Ansichten.
