---
topic: 110-otto-links-ueber-awin
status: entschieden
option: Otto-Links zentral als Awin-Deeplink mit Click Reference
datum: 2026-11-24
umgesetzt: offen (Pull Request, Jann prüft und merged)
---
Gespeichert bleibt die echte Otto-Adresse. Erst beim Anzeigen macht `partnerLink()` in `src/lib/shops.js` daraus den Awin-Deeplink (`awinmid=14336`, `awinaffid=3165716`, `clickref=<Wunsch-ID ohne Bindestriche>`, `ued=<encodete Otto-Adresse>`). Weitere Awin-Händler sind ein Eintrag in `AWIN_MERCHANTS`. Otto-Links tragen „Anzeige“ wie Amazon-Links, `shop_click` zählt sie als `otto`. Datenschutz Abschnitt 9 nennt Awin.

Nachtrag (Jann, 2026-11-24 abends): Auch die Ideen-Karten (eigene Inspiration und Gastansicht) bekommen Otto. Sie zeigen jetzt „Bei Amazon“ und „Bei Otto“ mit einem gemeinsamen Hinweis „Anzeige“, und Name und geschätzter Preis führen direkt zum Shop, weil der Klick auf den Preis vorher nichts tat.
