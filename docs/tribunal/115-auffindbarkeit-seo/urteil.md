---
topic: 115-auffindbarkeit-seo
status: entschieden
option: SEO-Grundlagen und Ratgeberseiten
datum: 2026-11-24
umgesetzt: offen
---
**Jann im Projekt-Chat:** prüfen, ob Wishtale gefunden wird.

Befund (24.11.2026): Die Grundlagen stimmen (Titel, Beschreibung, canonical der Startseite, robots.txt, Sitemap, HTTPS, www leitet mit 308 auf wishtale.de, App und Gast-Links `noindex`, CMS und Entwickler-Seite gesperrt). In einer Websuche nach `site:wishtale.de` taucht die Seite noch nicht auf; ob Google sie kennt, zeigt verlässlich nur die Search Console, die Jann einrichten muss.

Umgesetzt im Pull Request:
- `giftlyapp.vercel.app` lieferte dieselbe Seite ohne Sperre (doppelte Inhalte); dort jetzt `X-Robots-Tag: noindex, nofollow` (`vercel.json`, Bedingung `host`).
- `X-Robots-Tag: noindex` zusätzlich für `/app/…` und `/w/…`, damit private Listen und Gast-Links sicher nicht in den Index kommen, auch wenn ein Link irgendwo öffentlich steht.
- Startseite: Teilen-Bild im Querformat (`/og/wunschliste.jpg`, 1200×630 statt Hochformat), `og:url`, `og:type`, `og:locale`, `og:site_name`, strukturierte Daten (Organization, WebSite, WebApplication mit Preis 0 Euro).
- Rechtsseiten mit `canonical`, Fußzeilen verlinken direkt auf `/impressum`, `/datenschutz`, `/barrierefreiheit` (vorher Umweg über eine Weiterleitung von `.html`).

Nachtrag (Jann im Thread): „Baue die Seite so um das es passt! Also die Unterseiten“. Die Search Console richtet Jann selbst ein.

Gebaut: Ratgeber unter `/ratgeber` mit vier Seiten (`ratgeber/*.html`, Einstieg `src/ratgeber.js`, Stil `.guide` in `src/styles/main.css`): „Wunschliste online erstellen“, „Wunschzettel für Weihnachten“, „Wunschzettel für Kinder“, „Geschenke nicht doppelt kaufen“. Jede Seite hat eigenen Titel, Beschreibung, canonical, Open Graph, JSON-LD (Article und BreadcrumbList), ein echtes App-Bild aus `public/landing/`, Querverweise und einen Knopf zur App. Verlinkt aus der Fußzeile der Startseite (Schlüssel `footer.rg0` bis `footer.rg4`), aus dem Weihnachtsabschnitt (`weihnachten.rg`) und den Rechtsseiten, eingetragen in `public/sitemap.xml`. Statistik nutzt die vorhandenen Ereignisse `view` und `cta` (Label `ratgeber:…`), nichts Neues für die Datenschutzerklärung.
