/*
 * Bereiche, die vorerst ruhen (Dev 072, 073). Die Daten bleiben erhalten, nur die Oberfläche blendet sie aus.
 * Der Entwicklermodus blendet sie zum Testen wieder ein: Schalter unter /dev/#entwickler, gespeichert nur in diesem Browser
 * (localStorage, gilt für /dev/ und /app/ gleichermaßen). Er schaltet nur Oberfläche frei, keine Rechte.
 */
const KEY = 'wishtale:devmode';
export const devMode = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };
export const setDevMode = on => { try { on ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY); } catch { /* nur für diese Sitzung */ } };
export const worldsOn = () => devMode();       // Welten: Auswahl, Fenster, Katalog-Produkte
export const inspirationOn = () => devMode();  // Seite „Inspiration“
