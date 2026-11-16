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

## 2026-11-16 · 092 · Vorschau im Demokonto geprüft
- Commits: Funktionskorrektur `e7c27fbc6e364cbb9a1e9e33c027c15aaeedeff6`; dieser Abschlusscommit dokumentiert das Ergebnis.
- Geändert: Bau fertig, Urteil, Entscheidungsspiegel und technische Notiz aktualisiert.
- Geprüft: Vercel-Produktion READY. Cloud-Browser, angemeldetes Demokonto: Ausblenden lässt Titel und Auge stehen; ausgeblendeter Zustand überlebt Neuladen; Wiedereinblenden am Auge erfolgreich; eingeblendeter Zustand überlebt Neuladen. Desktop 1363 px, kein horizontaler Überlauf, Auge 46 × 44 px, gleiche Zeile wie Titel. ESLint und Build vor Abschluss-Push.
- Datenbank und Dienste: unverändert. Anmeldung ausschließlich über sichere Browser-Anmeldemaske; keine Zugangsdaten gespeichert oder geloggt.
- Zurücknehmen: git revert e7c27fb, Abschlussdokumentation entsprechend anpassen.
- Offen: 390 px weiterhin nicht visuell geprüft (Cloud-Browser ohne Größensteuerung); Datenbankeintrag der Dev-Seite durch Claude beim Abgleich.

## 2026-11-16 · 093 · Hilfe-Umbau angekündigt
- Auftrag: Jann, geführte Klicktour, klickbarer nächster Profilschritt, FAQ.
- Geändert: Bauankündigung und Auftrag 093.
- Geprüft: ESLint und Build vor Push; keine UI geändert.
- Datenbank und Dienste: unverändert.
- Zurücknehmen: Ankündigungscommit mit git revert zurücknehmen.
- Offen: Implementierung und Bedienprüfung folgen.

## 2026-11-16 · 093 · Geführte Hilfe und direkte Profil-Einstiege
- Auftrag: Jann: auswählbare Klicktouren, klickbarer nächster Profil-Schritt, FAQ.
- Geändert: Freiwillige Themenauswahl statt Text-Rundgang; Hilfe hebt die echten Ziele hervor, folgt passenden Klicks und endet vor Eingaben, Speicherung oder Versand. Abbrechen und Escape lassen Formulare unberührt. FAQ in Hilfe und direkt im Avatar-Menü. Profilfortschritt ordnet Hinweise stabilen Zielschlüsseln zu; Klick öffnet Auswahl oder Dialog und fokussiert das Feld.
- Warum: Wünsche und persönliches Profil ohne Suchwege einrichten können.
- Geprüft: ESLint und Build; Node-Modulprüfungen mit Vite-env-Adapter für Profilziele, 100%-Zustand, Klickfolgen, falsche Klicks, leere Liste, Kind-Kontext, FAQ-Inhalte und Meter-Aktion. Vor-Push-Sichtprüfung lokal weiterhin nicht möglich; echte Bedienprüfung im Cloud-Browser folgt nach Deploy. 390 px ungeprüft.
- Datenbank und Dienste: unverändert, keine neuen Pakete, Ereignisse oder Browser-Speichereinträge; die Führung liegt nur im flüchtigen UI-Zustand.
- Zurücknehmen: Diesen Implementierungscommit mit git revert zurücknehmen.
- Offen: Live-Bedienprüfung und Abschlussdokumentation folgen.

## 2026-11-16 · 093 · Liveprüfung und Abschluss
- Commits: Implementierung `94b11c11114d20d643ad6315b2ab3f7064b36265`; dieser Abschlusscommit dokumentiert und verbessert die Fokusübergabe beim Ende einer Tour.
- Geändert: Bau fertig, Urteil und Entscheidungsspiegel. Nach Tourende Fokus am tatsächlichen Ziel statt Rücksprung in die Kopfzeile.
- Geprüft: Vercel-Implementierungsdeploy READY. Cloud-Browser im angemeldeten Demokonto, 1363 px: alle fünf Touren bis Ziel; leere Wunschliste im Kind-Kontext; Formularwert nach Beenden erhalten und danach abgebrochen, nichts angelegt; FAQ öffnen und Antwort aufklappen; Shift+Tab in Hilfe und Escape; Profil-Direkteinstieg bei 0 % fokussiert #about, bei 100 % kein nächster Schritt. Kein horizontaler Überlauf. ESLint und Build erneut vor Abschluss-Push.
- Datenbank und Dienste: unverändert, keine neuen Pakete oder gespeicherten Daten. Keine Zugangsdaten dokumentiert. Lediglich vorhandene Ansichten und die bestehende Vorschau-Checkliste im Demokonto bedient.
- Zurücknehmen: git revert 94b11c1 und diesen Abschlusscommit, in umgekehrter Reihenfolge.
- Offen: 390 px, echter Safari und Screenreader ungeprüft; Claude ergänzt beim Abgleich den Dev-Datenbankeintrag.

## 2026-11-16 · 093/092 · Sichtprüfung bei exakt 390 CSS-Pixeln
- Auftrag: Jann: „Führe bitte die Sichtprüfung bei 390px durch“.
- Geändert: Nur Prüfnachweise in den Urteilen 093 und 092 sowie dieses Log, kein Website-Code.
- Geprüft: Produktionsstand 46483ef im angemeldeten Demokonto. Cloud-Chromium tatsächlich auf innerWidth 390 / innerHeight 742 CSS-Pixel, 125 % Browserzoom und normale Seitenleiste; gemessen DPR 1,25, ca. 378 px Inhaltsbreite wegen Desktop-Scrollbalken. DevTools-Geräteemulation war per Organisationsrichtlinie gesperrt und blieb gesperrt. Alle fünf Touren bis Ziel, Modal/Fotoauswahl, Menüziel, Karten-Themen und Teilen-Button ohne Zielüberdeckung oder seitlichen Überlauf. FAQ lesbar und aufklappbar; Profiltipp setzt Fokus auf sichtbares #about im unvollständigen Kind-Demoprofil. Vorschauzeile und Auge einzeilig, Augenbutton ca. 45,6 × 44 px, beide Richtungen funktionieren. Keine Inhalte gespeichert, Dateien hochgeladen, Karten bewertet oder Links geteilt. ESLint und Build vor Dokumentationspush.
- Befund: P3, FAQ-Schließen-Kopfzeile scrollt aus dem Sichtbereich. Sticky-Kopfzeile als Verbesserung vorgeschlagen, kein Funktionsblocker, nicht geändert.
- Datenbank und Dienste: unverändert, keine Pakete oder neue Datenverarbeitung.
- Zurücknehmen: Diesen reinen Dokumentationscommit mit git revert zurücknehmen.
- Offen: Echter iPhone-/Safari-Test einschließlich Touch, VoiceOver und Bildschirmtastatur bleibt ausstehend. 390-px-Layoutprüfung ist erledigt.
