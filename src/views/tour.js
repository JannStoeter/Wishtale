/* Kurzer Rundgang: freiwillig, jederzeit über die Kopfzeile erreichbar, startet nie von selbst (Dev 075). */
import { ic } from '../lib/util.js';

const STEPS = [
  ['plus', 'Wünsche hinzufügen', 'Tippe auf „Wunsch hinzufügen“ und schreib, was du dir wünschst. Wishtale erkennt das Produkt und fragt, ob es passt. Eine fertige Liste liest du über „Liste einlesen“ ein, als Text oder Foto.'],
  ['link', 'Teilen', 'Mit „Teilen“ schickst du deinen Freunden die Wunschliste. Mit „So sehen es deine Freunde“ prüfst du vorher, was sie sehen. Die Überraschung bleibt: Du siehst nie, was reserviert ist.'],
  ['spark', 'Geschmack schärfen', 'Im Menü findest du kurze Kartenrunden. Mit „Gefällt mir“, „Nicht mein Geschmack“ und „Habe ich schon“ lernt Wishtale, was zu dir passt. Nichts davon kommt auf deine Wunschliste, deine Freunde sehen es nie, und für sie werden die Ideen besser.'],
  ['user', 'Das Menü', 'Hinter deinem Avatar oben rechts liegen Profil und Persönlichkeit, Social Media, Inspiration, Historie, weitere Profile und Kind-Konten, Einladen und deine Einstellungen. Von dort kommst du mit „Zurück zur Wunschliste“ immer wieder hierher.'],
];

export function TourModal() {
  return `<div class="scrim" data-act="closebg"><div class="sheet tour" role="dialog" aria-modal="true" aria-labelledby="mt">
   <div class="sheet-head"><h2 id="mt">Ein kurzer Rundgang</h2><button type="button" class="sheet-x" data-act="close" aria-label="Schließen">×</button></div>
   <p class="muted">Vier Dinge, mit denen du dich schnell zurechtfindest. Du kannst den Rundgang jederzeit oben wieder öffnen.</p>
   <ol class="tour-list">${STEPS.map(([i, t, d]) => `<li><span class="tour-ic">${ic(i)}</span><div><h3 aria-level="3">${t}</h3><p>${d}</p></div></li>`).join('')}</ol>
   <div class="sheet-foot"><button class="btn pri" data-act="close">Verstanden</button></div>
  </div></div>`;
}
