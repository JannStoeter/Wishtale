/* Hilfe: freiwillige Themenwahl, echte Klickführungen und häufige Fragen. */
import { S } from '../state.js';
import { ic, esc } from '../lib/util.js';
import { GUIDES } from '../lib/guide.js';

export const FAQ = [
  ['Wie erstelle ich meine Wunschliste?', 'Über „Wunsch hinzufügen“ kannst du ein Produkt, ein Erlebnis oder eine freie Idee eintragen. Ein Link ist optional. Mit „Liste hochladen“ liest du ein Foto oder Text ein und prüfst die erkannten Wünsche vor dem Speichern.'],
  ['Brauchen meine Freunde ein Konto?', 'Zum Öffnen deines Links und zum Reservieren brauchen deine Freunde kein Konto. Wer ein eigenes Wishtale hat, kann sich anmelden und findet die eigenen Bereiche weiterhin im Avatar-Menü.'],
  ['Sehe ich, was reserviert oder gekauft wurde?', 'Auf deiner eigenen Wunschliste bleibt die Auswahl deiner Freunde verborgen. Bei einem verwalteten Kind-Profil können die Eltern den Status sehen, damit Geschenke nicht doppelt ankommen.'],
  ['Wie finde ich als Gast meine Reservierung wieder?', 'Öffne die Wunschliste im selben Browser. Dort kannst du deine Reservierung wieder freigeben oder als gekauft markieren. Ohne Konto hängt die Zuordnung am Browser; beim Löschen der Browserdaten oder beim Gerätewechsel kann sie verloren gehen.'],
  ['Wer sieht private Wünsche und mein Feedback?', 'Private Wünsche siehst nur du beziehungsweise die berechtigte Verwaltung deines Profils. Deine Kartenantworten und dein persönliches Feedback werden deinen Freunden nicht angezeigt. Wishtale nutzt solche Angaben, um passendere Vorschläge zu finden.'],
  ['Was machen die Geschmackskarten?', 'Mit den Karten lernt Wishtale deinen Geschmack besser kennen. „Gefällt mir“ legt keinen Wunsch an. „Habe ich schon“ gibt es für konkrete Ideen; eine allgemeine Kategorie wie Mützen ist damit nicht pauschal ausgeschlossen.'],
  ['Muss ich jedes Produkt genau kennen?', 'Nein. Schreib zum Beispiel „Hochwertige Pfanne bis 100 €“, dann sucht Wishtale für deine Freunde passende Vorschläge heraus. Auch ohne Link finden sie bei Amazon etwas Passendes.'],
  ['Gibt es Wishtale als App?', 'Ja. Leg Wishtale auf deinen Home-Bildschirm, dann öffnet es sich mit eigenem Symbol und ohne Browserleiste. Im Menü unter „Wishtale als App“ steht, wie das auf deinem Handy geht. Auf Android kannst du danach Produkte aus Shop-Apps über „Teilen“ direkt an Wishtale schicken.'],
  ['Kann ich Wünsche direkt aus einem Shop speichern?', 'Ja. Am iPhone legst du einmal den Kurzbefehl „Zu Wishtale“ an, danach tippst du in Safari oder in der App eines Shops auf „Teilen“ und dann auf „Zu Wishtale“. Auf Android steht Wishtale im Teilen-Menü, sobald du es als App installiert hast, und am Computer hilft ein Knopf in der Lesezeichenleiste. Im Menü unter „Aus jedem Shop speichern“ steht, wie es auf deinem Gerät geht.'],
  ['Sind die Vorschläge schon meine Wünsche?', 'Vorschläge von Wishtale sind Anregungen. Erst wenn du „Auf meine Wunschliste“ wählst, wird daraus ein eigener Wunsch. Unter deinen Wünschen stehen die Ideen von Wishtale. Am Handy sind sie zuerst eingeklappt und öffnen sich mit einem Tipp auf die Zeile, mit dem Auge klappst du sie wieder ein.'],
  ['Wo finde ich Profil, Historie und weitere Profile?', 'Tippe oben auf deinen Avatar. Das Menü führt zu Profil und Persönlichkeit, Social Media, Historie, Inspiration, Kind-Profilen und Einstellungen. Das Logo und „Zurück zur Wunschliste“ bringen dich zu deinen Wünschen zurück.'],
  ['Warum passen manche Vorschläge noch nicht?', 'Interessen, Lieblingsmarken, konkrete Wünsche und die Geschmackskarten geben Wishtale mehr Anhaltspunkte. Vorschläge können trotzdem unpassend sein. Prüfe Produkt, Variante und Preis selbst, bevor du etwas kaufst.'],
  ['Was bedeutet Anzeige bei einem Shop-Link?', 'Einige Links sind Partnerlinks. Wenn darüber ein Kauf zustande kommt, kann Wishtale eine Provision erhalten. Preise in Vorschlägen sind Richtwerte und können vom Shoppreis abweichen.'],
];
export function TourModal() {
  const faq = S.ui.helpTab === 'faq';
  return `<div class="scrim" data-act="closebg"><div class="sheet tour" role="dialog" aria-modal="true" aria-labelledby="mt">
   <div class="sheet-head"><h2 id="mt">Hilfe und Rundgang</h2><button type="button" class="sheet-x" data-act="close" aria-label="Hilfe schließen">×</button></div>
   <div class="help-switch" role="group" aria-label="Hilfebereich"><button type="button" class="btn ${faq?'sec':'pri'} sm" data-act="helptab" data-v="guides" aria-pressed="${!faq}">Geführte Rundgänge</button><button type="button" class="btn ${faq?'pri':'sec'} sm" data-act="helptab" data-v="faq" aria-pressed="${faq}">Häufige Fragen (FAQ)</button></div>
   ${faq?`<div class="help-faq">${FAQ.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`:`<p class="muted">Was möchtest du tun? Wähle ein Thema. Wir zeigen dir die echten Buttons und begleiten dich Schritt für Schritt. Du kannst jederzeit aufhören.</p>
    <ul class="tour-list help-guides">${Object.entries(GUIDES).filter(([id])=>(id!=='taste'||!S.me.managed)&&(id!=='share'||S.me.wishes.length>0)).map(([id,g])=>`<li><button type="button" class="help-choice" data-act="guidestart" data-id="${id}"><span class="tour-ic">${ic(g.icon)}</span><span>${esc(g.title)}<small>${g.steps.length} Schritte</small></span>${ic('arrow','sm')}</button></li>`).join('')}</ul>`}
  </div></div>`;
}
