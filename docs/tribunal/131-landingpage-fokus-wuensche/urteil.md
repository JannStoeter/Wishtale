---
topic: 131-landingpage-fokus-wuensche
status: entschieden
option: umsetzen
datum: 2026-11-25
umgesetzt: offen
---
**Jann im Projekt:** Beim Ankommen nur Wünsche, alles andere beim Scrollen oder per Klick in Rubriken.

Umsetzung: Einstieg mit Versprechen, einem Hauptknopf und einer echten Beispiel-Wunschliste (HTML statt Bildschirmfoto, keine Vorführung mit Reitern mehr, kein „Jetzt neu“-Band). Darunter „So funktioniert es“ in drei Schritten, dann „Mehr entdecken“ als Rubriken zum Aufklappen (Weihnachten, Gut zu wissen, Umzug von einer anderen Liste, Ratgeber), dann Fragen und Antworten und der Schlussknopf. Anker wie `#kinder` oder `#weihnachten` klappen ihre Rubrik auf. Die Hauptnavigation der Landingpage ist am Computer wieder sichtbar (`.lp-nav`, die App blendet `.nav` seit 075 aus).

Sprungmarken bei Google (Sitelinks): vergibt Google selbst, abhängig von Bekanntheit der Marke und klarer Seitenstruktur. Beeinflussbar: sichtbare Hauptnavigation mit echten Links, sprechende Titel, Sitemap, `WebSite` mit `alternateName`, Search Console. Die App (`/app/`) bleibt `noindex` (115), darum kann „Wunsch anlegen“ selbst kein Sitelink werden; der nächste indexierbare Ort ist `/ratgeber/wunschliste-erstellen`.
