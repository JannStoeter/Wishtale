# Log: ChatGPT

Einträge nach `docs/log/README.md`, neue Einträge ans Ende.

## 2026-11-16 · 092 · Umsetzung angekündigt
- Commits: dieser Ankündigungscommit auf main (Agent: chatgpt).
- Auftrag: Eigene Empfehlungen in die Hauptansicht zurückholen und Logo-Ziel korrigieren; von Jann ausdrücklich freigegeben.
- Geändert: Bauankündigung und Wortlaut unter Tribunal 092.
- Warum: Gemeinsame Arbeit sichtbar koordinieren.
- Geprüft: ESLint und Produktionsbuild vor Push; keine Oberfläche geändert.
- Datenbank und Dienste: unverändert.
- Zurücknehmen: Ankündigungscommit mit git revert zurücknehmen.
- Offen: Implementierung und Ansichtsprüfung folgen.

## 2026-11-16 · 092 · Hauptansicht umgesetzt
- Commits: dieser Implementierungscommit auf main; Ankündigung `98b99bd`.
- Auftrag: Von Jann freigegebene eigene Vorschläge unter den Wünschen und Logo als Heimweg.
- Geändert: Wiederverwendung der eigenen Ideenansicht, Lade-/Leerzustand, mobile Liste, Anzeige-Kennzeichnung. Ausblenden und im Avatar-Menü wieder einschalten, getrennt je Profil im Browser. Karten und TasteHint bleiben. App-Logo führt zur Wunschliste und beendet die Vorschau; Gast ohne Login behält den Landingpage-Link.
- Warum: Wünsche und passende Ideen gemeinsam zugänglich machen, ohne die Geschenkauswahl offenzulegen. Keine Gast-Ideen oder Reservierungen in der eigenen Empfehlungsansicht.
- Geprüft: ESLint, Produktionsbuild; Node-Prüfung mit lokalem Vite-env-Adapter: Profiltrennung der Präferenz, ungültiger Speicher, eigener statt Gast-Cache, Ausblenden und Logo-Ziele. Lokaler Browserstart ist in dieser Umgebung gesperrt; visuelle Prüfung bei 390 px und Desktop sowie realer eingeloggter Ablauf vor Push nicht möglich. Prüfung der öffentlichen Produktion folgt.
- Datenbank und Dienste: Keine Änderungen oder neuen Pakete; nur lokale Anzeigepräferenz, in Datenschutz Abschnitt 7 ergänzt. Bestehende Ideen-API und deren Datenschutz gelten weiter.
- Zurücknehmen: Implementierungscommit mit git revert zurücknehmen.
- Offen: Geschmackskarten selbst unverändert; PR 16 / Tribunal 089 wird nicht mit übernommen. Subdomain zurückgestellt. Deploy und Liveprüfung folgen; Datenbank-Dev-Eintrag beim Claude-Abgleich.

## 2026-11-16 · 092 · Abschluss und Liveprüfung
- Commits: Implementierung `8d70841f10184ad599bc1883de08f4dfcef071ee`, Ankündigung `98b99bd`; dieser Abschlusscommit enthält ausschließlich Dokumentation.
- Auftrag: Freigegebenen Umbau direkt hochladen und prüfen.
- Geändert: Bau auf fertig, Urteil mit Implementierungscommit, Entscheidungsspiegel ergänzt.
- Warum: Umsetzung, Rücknahme und verbleibende Prüflücken nachvollziehbar dokumentieren.
- Geprüft: Implementierungsdeploy Vercel Produktion READY (`dpl_9P6vAeqNH2bkuWNL9XtaUKR6jkGF`). Cloud-Browser Demo bei 1363 px: Profil über Menü geöffnet, Logo zurück zur Wunschliste, scrollWidth 1348 px, kein horizontaler Überlauf. ESLint und Build erneut vor Dokumentationspush.
- Datenbank und Dienste: Keine Änderungen, keine Pakete; keine Migration erforderlich.
- Zurücknehmen: git revert 8d70841; Abschlussdokumentation bei Bedarf ebenfalls zurücknehmen.
- Offen: Echte angemeldete Empfehlungen, deren Bedienung und mobile 390-px-Ansicht konnten nicht visuell geprüft werden. PR 16 / 089 ist unabhängig. Claude ergänzt beim Abgleich den Datenbankeintrag der Dev-Seite.

## 2026-11-16 · 092 · Nachbesserung angekündigt
- Auftrag: Jann möchte eine bleibende Zeile „Deine Vorschau“ mit Auge zum Aus- und Einblenden.
- Geändert: Bauankündigung wieder in Arbeit.
- Geprüft: ESLint und Build vor Push; noch keine UI-Änderung.
- Datenbank und Dienste: unverändert.
- Offen: Umsetzung folgt im nächsten Commit.

## 2026-11-16 · 092 · Vorschau bleibt direkt einschaltbar
- Auftrag: Janns Nachbesserung: bleibende Zeile „Deine Vorschau“ mit Augensymbol.
- Geändert: Abschnittskopf bleibt beim Ausblenden erhalten; Auge öffnet, durchgestrichenes Auge schließt. Ein Umschalter mit aria-expanded, aria-controls, eindeutiger Beschriftung und Fokuswiederherstellung. Kopfzeile bleibt auch mobil einzeilig, Touchfläche mindestens 44 × 44 px. Menü-Umschalter bleibt zusätzlich.
- Geprüft: ESLint, Build und gezielte Modulprüfung (sichtbarer Inhalt, eingeklappte Zeile ohne Ideen, beide aria-expanded-Zustände, Profiltrennung). Demokonto im Cloud-Browser angemeldet; Liveprüfung der neuen Steuerung folgt nach Deploy. 390 px noch nicht geprüft.
- Datenbank und Dienste: unverändert; gleiche bestehende Browserpräferenz, keine neuen Pakete oder Ereignisse. Zugangsdaten werden nicht dokumentiert.
- Zurücknehmen: Diesen Funktionscommit mit git revert zurücknehmen.
- Offen: Liveprüfung und Abschlussdokumentation folgen.
