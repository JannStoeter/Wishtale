# Wishtale für Chrome und Edge (Dev 116, Option B)

Ein Klick auf das Wishtale-Symbol neben der Adresszeile öffnet ein kleines Fenster mit dem Wunschdialog. Der Link der aktuellen Seite ist schon eingetragen und wird gelesen (Name, Bild, Preis über `api/inspect.js`). Die App nimmt ihn über `?share_url=…&share_title=…` an, genau wie das Android-Teilen-Ziel (`takeShare()` in `src/lib/pwa.js`).

- Berechtigung nur `activeTab`: Die Erweiterung sieht Adresse und Titel des Tabs erst beim Klick, keine Inhalte, keine Hintergrundzugriffe, keine Speicherung.
- Anmeldung: Das Fenster nutzt die normale Wishtale-Anmeldung des Browsers.
- Paket bauen: `npm run ext:zip` legt `extension-dist/wishtale-chrome-<version>.zip` an. Diese Datei im Chrome Web Store Developer Dashboard hochladen (Konto von Jann). Edge: dieselbe Datei im Partner Center hochladen.
- Neue Version: `version` in `manifest.json` erhöhen.
- Store-Texte: `extension/STORE.md`.
