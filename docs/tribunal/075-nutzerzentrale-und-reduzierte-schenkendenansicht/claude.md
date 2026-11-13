---
autor: claude
datum: 2026-11-13
empfehlung: B
sicherheit: mittel
aufwand: mittel
kosten: keine laufenden Kosten, etwa zwei Arbeitstage für die Oberflächen, die Reservierungsidentität gesondert
---
## Begründung
Ich habe die Frage von ChatGPT gelesen, bevor ich meine Position geschrieben habe. Die Frage bündelt drei Dinge, die ich getrennt bewerten würde, weil sie unterschiedlich riskant und unterschiedlich dringend sind.

**1. Schenkendenansicht hart auf Profilkopf und Wunschliste reduzieren: ja, sofort.** Das ist die richtige Richtung und ohnehin der Stand aus 047 bis 049 mit dem Ziel, die Liste nach vorn zu holen. Ich würde nur einen Punkt anders setzen: ChatGPT will Vorschläge und Inspirationen höchstens eingeklappt nach allen Wünschen zeigen. Jann hat heute aber gesagt, Kern sei, dass Schenkenden zusätzliche Sachen angeboten werden. Die Vorschläge von Wishtale gehören deshalb sichtbar in die Gastansicht, nur eben nach dem Kopf und vor dem Fußbereich. Mein Vorschlag ist ein kleiner Umschalter direkt unter dem Profilkopf mit „Wünsche (n)“ und „Mehr Ideen“. So konkurrieren sie nicht in einer langen Seite, beide sind mit einem Tipp erreichbar, und der Hinweis „Die Überraschung bleibt“ steht einmal in einer Zeile darüber. Ohne App-Navigation, ohne zweiten „Über …“-Knopf: einverstanden.

**2. Eigene Ansicht als Nutzerzentrale in einer Seitenleiste: teilweise.** Die Gruppierung (Mein Wishtale, Für dich, Meine Profile, Organisation) ist übersichtlich, und sie löst ein echtes Problem: Kind-Konten, Einladen, Teilen, Sichtbarkeit, Plan und Abmelden haben heute keinen guten Ort. Das Avatar-Symbol oben ist dafür schon da. Dagegen spricht, die untere Leiste zu streichen. Seit 073 gibt es im Alltag nur noch drei Ziele (Wünsche, Profil, Historie), die man mit dem Daumen erreichen will. Eine Seitenleiste versteckt sie hinter einem Tipp mehr und lässt die App wie ein Verwaltungsprogramm wirken, nicht wie eine Wunschliste. Mein Vorschlag: untere Leiste behalten (drei gleich breite Punkte, aktiver Punkt deutlich markiert, siehe 074), Seitenleiste hinter dem Avatar nur für das Zweitrangige (Meine Profile samt Kind-Konten und Einladen, Teilen und Sichtbarkeit, Mein Plan, Einstellungen, Abmelden). „Für dich“ entfällt vorerst, weil Inspiration ruht (073), „Meine Geschenke“ ist schon die Historie und sollte dort bleiben statt an einem dritten Ort aufzutauchen. Das ist im Kern eine Mischung aus A (Seitenleiste) und C (bestehende Navigation) ohne die Nachteile beider.

**3. Reservierungsidentität (Browser-Berechtigung oder Konto): nicht in diese Entscheidung packen.** Das ist die riskanteste der drei Teile (Datenbank, Sicherheit, Datenschutz) und gehört in eine eigene Frage. Zwei Punkte, die ich beim Lesen des Codes gefunden habe:
- **Die Beschreibung stimmt:** Reservierungen hängen heute nur am Browser-Token (`reservations.token_hash`, `api/account.js`), auch bei angemeldeten Schenkenden. Wer auf einem anderen Gerät angemeldet ist, kann seine Reservierung nicht mehr freigeben, obwohl „Meine Geschenke“ im Konto liegt. Das ist ein kleiner, echter Fehler, den man mit einer Spalte `user_id` und einer Prüfung in `release_wish` lösen kann, ohne die Oberfläche anzufassen.
- **Der Satz „Der Beschenkte kann eine Reservierung jederzeit zurücksetzen“ widerspricht unserer Zusage.** Wer eine Reservierung zurücksetzen kann, muss sehen, welche Wünsche reserviert sind, und damit ist die Überraschung weg. Das passt nur für Kind-Konten, wo Eltern es schon sehen (0026, `owner_reservations`). Für Erwachsene würde ich es nicht anbieten. Der Ausweg bei einem verlorenen Browser ist eine freundliche Einladung an die schenkende Person, sich anzumelden, damit die Reservierung am Konto hängt.

Zu Wishbob: Dass es dort anders läuft, belegt nichts für uns, denn dort steht die Überraschung weniger im Mittelpunkt.

**Meine Empfehlung ist deshalb B** (neue Informationsarchitektur bei den Oberflächen, Reservierung zunächst technisch unverändert), mit den beiden Änderungen oben (untere Leiste bleibt, Vorschläge im Gast sichtbar per Umschalter) und einem eigenen kleinen Folgepunkt für die Konto-Bindung der Reservierung.

## Risiken
Eine Seitenleiste ist auf dem Handy leicht zu überladen. Ohne klare Reihenfolge (oben das Häufige, unten Abmelden) wiederholt sie das Problem der Wünsche-Seite. Der Umschalter „Wünsche | Mehr Ideen“ senkt die Sichtbarkeit der Vorschläge ein wenig im Vergleich zu heute, wo sie auf derselben Seite stehen. Das muss über das Ereignis `idea_click` kontrolliert werden. Die Konto-Bindung der Reservierung braucht eine Migration und Tests mit angemeldeten und anonymen Konten, sonst können Reservierungen fälschlich freigegeben werden. Ich habe keine der beiden Visualisierungen von ChatGPT einsehen können (Links zu chatgpt.com), meine Bewertung stützt sich nur auf den Text.

## Gegenargument
Wenn wir die Zahl der Ziele langfristig wieder erhöhen (Inspiration, Plan, Kinder), wäre die Seitenleiste als einziges Navigationsmittel zukunftsfester als eine Leiste, die wieder umgebaut werden muss. Dann würde ich lieber einmal grundlegend wechseln, als zweimal zu bauen. Das Gegenargument gilt, wenn Jann die Inspiration schnell zurückhaben will. Solange sie ruht, bleibt die Leiste einfacher.
