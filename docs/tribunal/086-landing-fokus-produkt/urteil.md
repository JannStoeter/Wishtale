---
topic: 086-landing-fokus-produkt
status: entschieden
option: Anweisung
datum: 2026-11-15
umgesetzt: 41e62c0
---
**Umgesetzt (`index.html`, `src/landing.js`, `src/styles/main.css`, Bilder `public/landing/*.jpg`):**
- Einstieg: dunkelgrüne Marke „Neu · Jetzt neu: Wunschzettel einfach hochladen“, Überschrift bleibt „Die Wunschliste, die dich kennt.“, kürzerer Satz zum Produkt („Schreib deine Wünsche auf oder lade ein Foto vom Wunschzettel hoch …“), ein großer Knopf „Kostenlos Wunschliste anlegen“, daneben „Beispiel ansehen“, darunter „Kostenlos und ohne App-Download, in wenigen Minuten fertig“.
- Statt der gezeichneten Vorführung ein Handy mit **echten Ansichten aus der App** in drei Schritten (1 Hochladen, 2 Liste, 3 Für Freunde), jeweils mit kurzem Guide als Sprechblase, läuft von selbst, Anhalten und Reiter wie bisher. Bilder selbst ausgeliefert (zusammen etwa 270 KB, das erste mit Vorrang, die anderen nachgeladen), Hinweis „Echte Ansichten aus der App mit Beispielpersonen“.
- Am Handy erscheint unten ein klebender Knopf „Kostenlos Wunschliste anlegen“, sobald der Knopf im Einstieg aus dem Bild ist, und verschwindet beim Abschluss.
- Schritt 1 von „So funktioniert es“ nennt das Hochladen, Abschluss-Knopf heißt ebenfalls „Kostenlos Wunschliste anlegen“, Beschreibung und Vorschau-Text für geteilte Links nennen das Hochladen.
- Texte bleiben über die vorhandenen `data-edit`-Schlüssel bearbeitbar, neue Schlüssel: `hero.neu`, `hero.cta`, `hero.mini`, `hero.g1t` bis `hero.g3p`, `cta.btn`, `sticky.cta`. Keine Schlüssel umbenannt.
- Messung: Klicks auf alle Knöpfe zur App werden wie bisher als `cta` gezählt, UTM-Kürzel aus der Werbung reisen mit (Auswertung im CMS).
Getestet mit Playwright (390 und 1280 px): keine waagerechte Verschiebung, Reiter schalten, klebender Knopf erscheint und verschwindet, axe ohne Befund. Nicht getestet: echtes Gerät, Ladezeit unter echter Mobilverbindung.

**Nachbesserung (Janns Rückmeldung: „Einmal haben wir Mia und einmal Jonas, und man sieht nicht das echte Produkt, wie im Reel soll es sein“):** Alle Ansichten zeigen jetzt dieselbe Beispielperson Mia wie im Reel, in vier Schritten: 1 Hochladen (eingelesener Zettel mit erkannten Produkten), 2 Liste (die beiden Produkte mit Bild und Preis oben, weil Mia sie als „Sehr wichtig“ markiert hat), 3 Produkt (Produktansicht der Kopfhörer mit Preis und „Bei Amazon ansehen“), 4 Für Freunde (Mias Seite, wie Freunde sie sehen). Die Bilder entstehen mit demselben Skript wie das Reel (`npm run promo:zettel`, Aufnahmen in `promo/out/_shots`), Hinweis darunter: „Echte Ansichten aus der App mit einer Beispielperson und Beispielpreisen“.
