/*
 * Bereiche, die vorerst ruhen (Dev 072). Inspiration ist seit 075 wieder da (Menü hinter dem Avatar). Die Daten bleiben erhalten, nur die Oberfläche blendet sie aus.
 * Der Entwicklermodus blendet sie zum Testen wieder ein: Schalter unter /dev/#entwickler, gespeichert nur in diesem Browser
 * (localStorage, gilt für /dev/ und /app/ gleichermaßen). Er schaltet nur Oberfläche frei, keine Rechte.
 */
const KEY = 'wishtale:devmode';
export const devMode = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };
export const setDevMode = on => { try { on ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY); } catch { /* nur für diese Sitzung */ } };
export const worldsOn = () => devMode();       // Welten: Auswahl, Fenster, Katalog-Produkte
export const inspirationOn = () => true;  // Seite „Inspiration“: seit 075 wieder da, erreichbar über das Menü hinter dem Avatar (Dev 073 ausgeblendet, durch 075 aufgehoben)
