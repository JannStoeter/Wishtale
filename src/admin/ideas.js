/*
 * Beitragsideen: Aus einer gewählten Idee entsteht ein fertiges Karussell mit Bildunterschrift, das im Studio weiter bearbeitet wird.
 * Ton: warm, ganze Sätze, du-Ansprache, Namen statt Pronomen. Kein Komma vor „und“ zwischen Hauptsätzen.
 */
import { blank } from './canvas.js';
import { gen } from '../lib/util.js';
import { PRODUCTS, PRICE_DATE, cat } from '../data/content.js';
import { WORLD_OF_CAT } from '../lib/products.js';
import { weightOf } from '../lib/weights.js';
import { livePRODUCTS } from '../lib/catalog.js';
import { amazonUrl } from '../lib/products.js';

const TAGS = '#wishtale #wunschliste #geschenkideen #geschenke #wishlist';
const S = (o = {}) => ({ ...blank(o.type || 'cover'), ...o });
const split = v => String(v || '').split(',').map(x => x.trim()).filter(Boolean);
const cta = (title = 'Dein Wishtale wartet schon auf dich', sub = 'Erzähle deine eigene kleine Geschichte und bekomme Geschenke, die passen.') => S({ type: 'cta', theme: 'gruen', title, sub, handle: '@wishtale.de', domain: 'wishtale.de' });
const daysToXmas = () => { const n = new Date(), x = new Date(n.getFullYear(), 11, 24); if (x < n) x.setFullYear(n.getFullYear() + 1); return Math.ceil((x - n) / 864e5); };
const week = () => Math.floor(Date.now() / (7 * 864e5));

/** Wählt ein Produkt automatisch: gewichtet nach Qualität und Kategorie-Gewichtung, wechselt jede Woche. */
export function pickProduct(offset = 0) {
  const pool = livePRODUCTS().map(x => ({ x, w: Math.max(0, x.q * weightOf(WORLD_OF_CAT[x.cat] || 'wohnen')) })).filter(e => e.w > 0);
  if (!pool.length) return null;
  const sorted = [...pool].sort((a, b) => b.w - a.w || a.x.id.localeCompare(b.x.id));
  // Aus der oberen Hälfte der gewichteten Liste rotieren, damit nicht immer dasselbe Produkt kommt
  const top = sorted.slice(0, Math.max(3, Math.ceil(sorted.length / 2)));
  return top[(week() + offset) % top.length].x;
}

/** Auswahlliste für die Produkt-Idee: Standard ist die automatische Wahl, daneben alle Produkte mit Marke, Welt und Hinweis auf die Gewichtung. */
function productOptions() {
  const auto = pickProduct(0);
  return [['', `Automatisch wählen${auto ? ` (diese Woche: ${auto.t})` : ''}`],
    ...PRODUCTS.map(x => [x.id, `${x.t}${x.brand ? ' · ' + x.brand : ''} · ${cat(WORLD_OF_CAT[x.cat] || 'wohnen').n}${weightOf(WORLD_OF_CAT[x.cat] || 'wohnen') === 0 ? ' (Kategorie ausgeblendet)' : ''}`])];
}

export const IDEAS = [
  // ---- Erklär-Serie (Reels, Karussells, Storys mit App-Ansichten, damit man versteht, wie Wishtale funktioniert) ----
  { id: 'r-erklaert', format: 'reel', group: 'Erklären', title: 'Reel: So funktioniert Wishtale', desc: 'Sechs Folien, rund 18 Sekunden: Wünsche sammeln, Link teilen, Gäste reservieren, und die Überraschung bleibt. Der beste Einstieg für neue Leute.', fields: [],
    build: () => ({
      title: 'Reel: So funktioniert Wishtale',
      caption: `So funktioniert Wishtale: Du sammelst deine Wünsche an einem Ort und schickst einen Link an alle, die dir etwas schenken möchten. Wer schenkt, reserviert einen Wunsch, und du siehst nicht, was schon besorgt ist, damit es eine Überraschung bleibt.\n\nKostenlos und ohne App-Store, den Link findest du in der Bio.\n\n${TAGS} #wunschzettel #weihnachtsgeschenke`,
      slides: [
        S({ eyebrow: 'Kurz erklärt', title: 'So funktioniert Wishtale', sub: 'Eine Wunschliste, ein Link und Geschenke, die wirklich passen.' }),
        S({ type: 'screen', scene: 'liste', eyebrow: 'Erstens', title: 'Du sammelst deine Wünsche an einem Ort' }),
        S({ type: 'screen', scene: 'link', eyebrow: 'Zweitens', title: 'Du schickst einen Link an alle, die dir etwas schenken wollen' }),
        S({ type: 'screen', scene: 'gast', eyebrow: 'Drittens', title: 'Wer schenken will, reserviert einen Wunsch, auch ohne Konto' }),
        S({ type: 'screen', scene: 'eigen', eyebrow: 'Und du', title: 'Du siehst nicht, was schon besorgt ist' }),
        cta('Leg deine Wunschliste an', 'Kostenlos, in wenigen Minuten, direkt im Browser.'),
      ],
    }) },
  { id: 'r-reservieren', format: 'reel', group: 'Erklären', title: 'Reel: Schenken, ohne etwas zu verraten', desc: 'Zeigt das Reservieren aus Sicht der Gäste und warum die beschenkte Person nichts davon sieht.', fields: [['name', 'Name der beschenkten Person', 'Mia'], ['helper', 'Name der schenkenden Person', 'Lena']],
    build: v => ({
      title: 'Reel: Schenken, ohne etwas zu verraten',
      caption: `${v.helper} öffnet ${gen(v.name)} Wunschliste, reserviert einen Wunsch, und alle anderen sehen, dass er vergeben ist. Nur ${v.name} sieht davon nichts, und am Geburtstag ist es trotzdem eine Überraschung.\n\nSo schenkt niemand doppelt und niemand muss heimlich in einer Gruppe nachfragen. Den Link findest du in der Bio.\n\n${TAGS} #geschenkideen #überraschung`,
      slides: [
        S({ eyebrow: 'Die Überraschung bleibt', title: 'Von einer Wunschliste schenken, ohne etwas zu verraten' }),
        S({ type: 'screen', scene: 'gast', eyebrow: 'Der Link', title: `${v.helper} öffnet ${gen(v.name)} Link und sieht, was noch frei ist` }),
        S({ type: 'screen', scene: 'reserviert', eyebrow: 'Reservieren', title: `${v.helper} reserviert, und für alle anderen ist der Wunsch vergeben` }),
        S({ type: 'screen', scene: 'eigen', eyebrow: `Bei ${v.name}`, title: `${v.name} sieht davon nichts, und die Überraschung bleibt` }),
        cta('Nie wieder doppelt schenken', 'Leg deine Wunschliste an und teile den Link.'),
      ],
    }) },
  { id: 'r-kind', format: 'reel', group: 'Kinder', title: 'Reel: Eine Wunschliste für dein Kind', desc: 'Für Eltern bis Weihnachten: Kind-Konto, Wunschzettel abfotografieren, Link in den Familienchat. Zeigt kein echtes Kind.', fields: [['kind', 'Name des Kindes (Beispiel)', 'Emil']],
    build: v => ({
      title: 'Reel: Eine Wunschliste für dein Kind',
      caption: `Der Wunschzettel klebt am Kühlschrank, und Oma fragt zum dritten Mal, was ${v.kind} sich wünscht? Mit Wishtale bekommt dein Kind eine eigene Wunschliste mit eigenem Link. Den gemalten Zettel fotografierst du einfach ab, und die Familie reserviert, ohne dass etwas doppelt kommt.\n\nDen Link findest du in der Bio.\n\n${TAGS} #wunschzettel #weihnachtenmitkindern #geschenkideenkinder #familienleben #mamaleben #papaleben`,
      slides: [
        S({ eyebrow: 'Für Eltern', title: 'Eine eigene Wunschliste für dein Kind', sub: 'Damit Oma, Opa und die Patentante nicht mehr raten müssen.' }),
        S({ type: 'screen', scene: 'kind', eyebrow: 'Kind-Konto', title: 'Jedes Kind bekommt eine eigene Liste mit eigenem Link', sub: 'Du pflegst sie, und das zweite Elternteil kann mitverwalten.' }),
        S({ type: 'screen', scene: 'zettel', eyebrow: 'Der Wunschzettel', title: 'Den gemalten Zettel fotografierst du einfach ab', sub: 'Wishtale macht daraus einzelne Wünsche, und du prüfst sie vor dem Speichern.' }),
        S({ type: 'screen', scene: 'linkkind', eyebrow: 'Die Familie', title: 'Dann schickst du den Link in den Familienchat' }),
        S({ eyebrow: 'Ohne Doppel', title: 'Wer etwas besorgt, reserviert es, und nichts kommt doppelt', sub: `Ihr Eltern seht, was reserviert ist, ${v.kind} nicht.` }),
        cta('Weihnachten kann kommen', 'Leg die Wunschliste für dein Kind an, den Link findest du in der Bio.'),
      ],
    }) },
  { id: 'r-speichern', format: 'reel', group: 'Erklären', title: 'Reel: Wünsche aus jedem Shop', desc: 'Link einfügen, und Name, Preis und Bild sind da, oder direkt in Wishtale suchen. Für Leute, die schon Wunschlisten in Shops haben.', fields: [],
    build: () => ({
      title: 'Reel: Wünsche aus jedem Shop',
      caption: 'Du hast etwas Schönes entdeckt und willst es nicht vergessen? Kopier den Link in Wishtale, und Name, Preis und Bild sind sofort da. Oder du suchst direkt in Wishtale, und am Ende steht alles auf einer Liste, egal aus welchem Shop.\n\nDen Link findest du in der Bio.\n\n' + TAGS + ' #onlineshopping',
      slides: [
        S({ eyebrow: 'Kennst du das', title: 'Du siehst etwas Schönes und willst es nicht vergessen' }),
        S({ type: 'screen', scene: 'eingeben', eyebrow: 'Mit Link', title: 'Link einfügen, und Name, Preis und Bild sind da' }),
        S({ type: 'screen', scene: 'suche', eyebrow: 'Ohne Link', title: 'Oder du suchst direkt in Wishtale' }),
        S({ type: 'screen', scene: 'liste', eyebrow: 'Am Ende', title: 'Alles steht auf einer Liste, egal aus welchem Shop' }),
        cta('Eine Liste für alle deine Wünsche', 'Leg sie an und teile den Link mit deinen Liebsten.'),
      ],
    }) },
  { id: 'k-schritte', group: 'Erklären', title: 'Karussell: In fünf Schritten zum Wishtale', desc: 'Sieben Folien mit Handy-Ansichten: eintragen, suchen, Geschmack, teilen, reservieren. Gut zum Anpinnen oben im Profil.', fields: [],
    build: () => ({
      title: 'In fünf Schritten zum Wishtale',
      caption: 'So legst du dein Wishtale an: Wünsche eintragen oder suchen, kurz erzählen, was dir gefällt und was du schon hast, und den Link teilen. Wer dir etwas schenkt, reserviert, und du bekommst nichts doppelt.\n\nSpeichere dir den Beitrag, falls du später anfangen möchtest. Den Link findest du in der Bio.\n\n' + TAGS + ' #wunschzettel #anleitung',
      slides: [
        S({ eyebrow: 'Anleitung', title: 'In fünf Schritten zum eigenen Wishtale', sub: 'Wisch nach links, es dauert nur ein paar Minuten.' }),
        S({ type: 'screen', scene: 'eingeben', eyebrow: 'Schritt 1', title: 'Trag deine Wünsche ein, mit Link oder ohne' }),
        S({ type: 'screen', scene: 'suche', eyebrow: 'Schritt 2', title: 'Oder such sie direkt in Wishtale' }),
        S({ type: 'screen', scene: 'geschmack', eyebrow: 'Schritt 3', title: 'Erzähl, was dir gefällt und was du schon hast' }),
        S({ type: 'screen', scene: 'link', eyebrow: 'Schritt 4', title: 'Teile deinen Link, wo du möchtest' }),
        S({ type: 'screen', scene: 'reserviert', eyebrow: 'Schritt 5', title: 'Deine Liebsten reservieren, und nichts kommt doppelt' }),
        cta('Fang gleich an', 'Dein Wishtale ist kostenlos und in wenigen Minuten angelegt.'),
      ],
    }) },
  { id: 'k-ideen', group: 'Erklären', title: 'Karussell: Wenn dir nichts einfällt', desc: 'Erklärt die Ideen von Wishtale: passend zum Geschmack, immer als Vorschlag erkennbar, nur was du übernimmst, landet auf der Liste.', fields: [],
    build: () => ({
      title: 'Wenn dir nichts einfällt',
      caption: 'Was wünsche ich mir eigentlich? Wenn dir nichts einfällt, hat Wishtale Ideen, die zu dem passen, was du magst und was du schon hast. Sie stehen immer getrennt von deinen eigenen Wünschen, und auf deine Liste kommt nur, was du selbst übernimmst.\n\nDen Link findest du in der Bio.\n\n' + TAGS + ' #geschenkideen #wunschzettel',
      slides: [
        S({ eyebrow: 'Kennst du das', title: 'Was wünsche ich mir eigentlich?', sub: 'Die Frage kommt jedes Jahr, meistens kurz vor Weihnachten.' }),
        S({ type: 'screen', scene: 'geschmack', eyebrow: 'Zuerst du', title: 'Du erzählst, was dir gefällt und was du schon hast' }),
        S({ type: 'screen', scene: 'ideen', eyebrow: 'Dann Wishtale', title: 'Wishtale schlägt Ideen vor, die dazu passen', sub: 'Sie stehen getrennt von deinen Wünschen, damit nichts verwechselt wird.' }),
        S({ type: 'chips', eyebrow: 'Du entscheidest', title: 'Nur was du übernimmst, landet auf deiner Liste', sub: 'Mit jeder Antwort lernt Wishtale deinen Geschmack ein bisschen besser kennen.', chips: ['*Auf meine Wunschliste', 'Habe ich schon', 'Passt nicht'] }),
        cta('Lass dich inspirieren', 'Leg dein Wishtale an und schau, was zu dir passt.'),
      ],
    }) },
  { id: 'k-gaeste', group: 'Erklären', title: 'Karussell: Du hast einen Wishtale-Link bekommen?', desc: 'Für die schenkende Seite, zum Beispiel Großeltern: Link öffnen, reservieren, kaufen, wo man möchte. Gut zum Weiterleiten.', fields: [],
    build: () => ({
      title: 'Du hast einen Wishtale-Link bekommen?',
      caption: 'Jemand hat dir einen Wishtale-Link geschickt? Öffne ihn einfach, ein Konto brauchst du dafür nicht. Such dir einen Wunsch aus und tippe auf „Reservieren“, dann wissen alle anderen, dass er vergeben ist, und die beschenkte Person erfährt nichts davon.\n\nSchick den Beitrag gern an Oma, Opa und alle, die beim Schenken mitmachen.\n\n' + TAGS + ' #weihnachtsgeschenke #großeltern',
      slides: [
        S({ eyebrow: 'Für alle, die schenken', title: 'Du hast einen Wishtale-Link bekommen?', sub: 'So einfach geht es, auch ohne Konto.' }),
        S({ type: 'screen', scene: 'link', eyebrow: 'Erstens', title: 'Tipp auf den Link, ein Konto brauchst du nicht' }),
        S({ type: 'screen', scene: 'gast', eyebrow: 'Zweitens', title: 'Such dir einen Wunsch aus und tippe auf Reservieren' }),
        S({ type: 'screen', scene: 'reserviert', eyebrow: 'Drittens', title: 'Für alle anderen ist der Wunsch jetzt vergeben', sub: 'Wer reserviert hat, sehen sie nicht.' }),
        S({ eyebrow: 'Viertens', title: 'Kaufen kannst du, wo du möchtest', sub: 'Im Laden um die Ecke oder online, ganz wie es dir passt.' }),
        cta('Und wenn du selbst Wünsche hast', 'Leg dein eigenes Wishtale an, den Link findest du in der Bio.'),
      ],
    }) },
  { id: 'k-gruender', group: 'Hinter Wishtale', title: 'Karussell: Hinter Wishtale (Gründer)', desc: 'Persönlicher Beitrag, etwa jeder sechste. Die Felder sind Platzhalter, bitte in eigenen Worten füllen. Ein Foto von dir passt gut auf die erste Folie (Art „Foto“).',
    fields: [['name', 'Dein Vorname', 'Jann'], ['warum', 'Warum es Wishtale gibt (ein, zwei Sätze, deine Worte)', 'Hier erzählst du in ein, zwei Sätzen, warum du Wishtale baust'], ['jetzt', 'Woran du gerade arbeitest', 'Hier steht, woran du gerade arbeitest']],
    build: v => ({
      title: 'Hinter Wishtale',
      caption: `Hallo, ich bin ${v.name} und baue Wishtale. ${v.warum}\n\nSchreib mir gern, was dir fehlt oder was dich stört, ich lese mit.\n\n${TAGS} #gründer #startup #hinterdenkulissen`,
      slides: [
        S({ eyebrow: 'Hinter Wishtale', title: `Hallo, ich bin ${v.name} und baue Wishtale` }),
        S({ eyebrow: 'Warum', title: 'Warum es Wishtale gibt', sub: v.warum }),
        S({ eyebrow: 'Was mir wichtig ist', title: 'Deine Wünsche bleiben der Kern', sub: 'Vorschläge von Wishtale sind immer als Vorschlag erkennbar, und wer dir etwas schenkt, verrät dir nichts.' }),
        S({ eyebrow: 'Gerade', title: 'Woran ich gerade arbeite', sub: v.jetzt }),
        cta('Schreib mir, was dir fehlt', 'Per Nachricht hier auf Instagram oder über wishtale.de.'),
      ],
    }) },
  { id: 's-erklaert', format: 'story', group: 'Erklären', title: 'Story-Folge: Kurz erklärt', desc: 'Fünf Stories hintereinander mit Handy-Ansichten. Einen Link-Sticker zu wishtale.de setzt du danach in der Instagram-App, das geht über die Schnittstelle nicht.', fields: [],
    build: () => ({
      title: 'Story: Kurz erklärt', caption: '',
      slides: [
        S({ eyebrow: 'Kurz erklärt', title: 'Weißt du schon, was du dir zu Weihnachten wünschst?', sub: 'Tipp weiter, wir zeigen dir, wie Wishtale funktioniert.' }),
        S({ type: 'screen', scene: 'liste', eyebrow: 'Erstens', title: 'Du sammelst deine Wünsche' }),
        S({ type: 'screen', scene: 'link', eyebrow: 'Zweitens', title: 'Du teilst einen Link' }),
        S({ type: 'screen', scene: 'reserviert', eyebrow: 'Drittens', title: 'Deine Liebsten reservieren, und nichts kommt doppelt' }),
        cta('Probier es aus', 'Den Link findest du in unserer Bio.'),
      ],
    }) },
  { id: 's-kind', format: 'story', group: 'Kinder', title: 'Story-Folge: Wunschzettel fürs Kind', desc: 'Drei Stories für Eltern: Zettel abfotografieren, eigene Kinderliste, Link an die Familie.', fields: [],
    build: () => ({
      title: 'Story: Wunschzettel fürs Kind', caption: '',
      slides: [
        S({ type: 'screen', scene: 'zettel', eyebrow: 'Für Eltern', title: 'Den Wunschzettel einfach abfotografieren' }),
        S({ type: 'screen', scene: 'kind', eyebrow: 'Kind-Konto', title: 'Daraus wird eine eigene Liste für dein Kind' }),
        S({ type: 'screen', scene: 'linkkind', eyebrow: 'Die Familie', title: 'Und Oma und Opa wissen endlich, was passt' }),
        cta('Weihnachten kann kommen', 'Den Link findest du in unserer Bio.'),
      ],
    }) },
  { id: 's-doppelt', format: 'story', group: 'Erklären', title: 'Story: Schon mal doppelt bekommen?', desc: 'Eine Frage zum Mitmachen, dann die Lösung. Eine Umfrage oder ein Fragen-Sticker lässt sich danach in der Instagram-App ergänzen.', fields: [],
    build: () => ({
      title: 'Story: Schon mal doppelt bekommen?', caption: '',
      slides: [
        S({ eyebrow: 'Kurze Frage', title: 'Hast du schon einmal etwas doppelt geschenkt bekommen?', sub: 'Erzähl es uns gern per Nachricht.' }),
        S({ type: 'screen', scene: 'reserviert', eyebrow: 'Mit Wishtale', title: 'Wer etwas besorgt, reserviert es, und alle anderen sehen das' }),
        cta('So bleibt jedes Geschenk einmalig', 'Den Link findest du in unserer Bio.'),
      ],
    }) },
  { id: 'tale', title: 'So lebt dein Tale', desc: 'Die Geschichte von einer Person, ihrem Wishtale und einem Geschenk, das passt. Der Klassiker für den Einstieg.',
    fields: [['name', 'Name der Person', 'Jonas'], ['helper', 'Name der schenkenden Person', 'Lena'], ['interests', 'Interessen (mit Komma)', 'Kaffee brühen, Kochen, Einrichten'], ['brands', 'Marken (mit Komma)', 'Hario, Fellow'], ['wishes', 'Wünsche (mit Komma)', 'Handkaffeemühle, Wasserkocher, Kochkurs'], ['owned', 'Schon vorhanden (mit Komma)', 'Siebträgermaschine, Gusseisenpfanne'], ['pick', 'Das schenkt die Person', 'die Waage und den Kurs'], ['tale', 'Kleine Geschichte (Zitat)', 'liebt guten Kaffee. Für den perfekten Espresso nimmt sich die Person am Sonntag gern etwas mehr Zeit.']],
    build: v => ({
      title: `So lebt dein Tale: ${v.name}`,
      caption: `${v.helper} sucht ein Geschenk für ${v.name}. Wishtale zeigt, was sich ${v.name} wünscht, was ${v.name} schon hat und was dazu noch passen könnte, und für ${v.name} bleibt es trotzdem eine Überraschung.\n\nWie sieht dein Wishtale aus? Den Link findest du in der Bio.\n\n${TAGS} #geschenkideen`,
      slides: [
        S({ eyebrow: 'So lebt dein Tale', title: `Lernen wir ${v.name} kennen`, sub: `${v.name} hat ein Wishtale angelegt, und auf den nächsten Folien siehst du, wie daraus ein Geschenk wird, das wirklich passt.` }),
        S({ type: 'chips', eyebrow: 'Der Anfang', title: `Zuerst erzählt ${v.name}, was ${v.name} gefällt`, sub: 'Ein paar freundliche Fragen am Anfang, ganz ohne Formular.', chips: [...split(v.interests).map((c, i) => (i ? '' : '*') + c), ...split(v.brands)] }),
        S({ type: 'chips', eyebrow: 'Die Wünsche', title: `Dann sammelt ${v.name} Wünsche, über die sich ${v.name} freuen würde`, sub: 'Ein Produkt, ein Erlebnis oder einfach eine Idee, so wie sie gerade einfällt.', chips: split(v.wishes).map((c, i) => (i ? '' : '*') + c) }),
        S({ type: 'chips', eyebrow: 'Das Vorhandene', title: `Und ${v.name} trägt ein, was schon im Schrank steht`, sub: 'Damit nichts doppelt geschenkt wird, nicht einmal aus Versehen.', chips: split(v.owned).map(c => '*' + c) }),
        S({ eyebrow: 'Der Link', title: `${v.helper} öffnet ${gen(v.name)} Link und sieht alles auf einer Seite`, sub: 'Wünsche, Vorlieben und das, was schon da ist, ohne Konto und ohne Nachfragen.' }),
        S({ type: 'quote', eyebrow: 'Die Vorschläge', title: `Wishtale zeigt ${v.helper}, was zu ${v.name} passt`, quote: `${v.name} ${v.tale}` }),
        S({ eyebrow: 'Das Ende', title: `${v.helper} entscheidet sich für ${v.pick}. Für ${v.name} bleibt es eine Überraschung`, sub: 'Für alle anderen Freunde steht dort jetzt, dass sich schon jemand darum kümmert.' }),
        cta(),
      ],
    }) },
  { id: 'mehr', title: 'Mehr als eine Wunschliste', desc: 'Erklärt in sechs Folien, was Wishtale von einer normalen Wunschliste unterscheidet.', fields: [],
    build: () => ({
      title: 'Mehr als eine Wunschliste',
      caption: 'Eine Wunschliste sagt dir, was du dir wünschst, aber sie erzählt nicht, warum und was du längst zu Hause hast. Wishtale erzählt auch das, und deine Freunde finden Geschenke, die wirklich passen.\n\nDen Link findest du in der Bio.\n\n' + TAGS,
      slides: [
        S({ eyebrow: 'Wishtale', title: 'Mehr als eine Wunschliste', sub: 'Neben deinen Wünschen erzählt Wishtale, was dich ausmacht.' }),
        S({ type: 'chips', eyebrow: 'Dein Geschmack', title: 'Deine Interessen und Lieblingsmarken', sub: 'Daran erkennen deine Freunde, was zu dir passt.', chips: ['*Kaffee brühen', 'Wandern', 'Lesen', 'Hario', 'Patagonia'] }),
        S({ type: 'chips', eyebrow: 'Das Vorhandene', title: 'Was du schon hast, steht auch drin', sub: 'So bekommst du nichts doppelt.', chips: ['*Siebträgermaschine', '*Wanderrucksack', '*Notizbuch'] }),
        S({ type: 'chips', eyebrow: 'Bitte nicht', title: 'Und was du lieber nicht geschenkt bekommst', sub: 'Das sehen nur Menschen, die dir etwas schenken wollen.', chips: ['Duftkerzen', 'Deko-Kitsch', 'Socken'] }),
        S({ eyebrow: 'Das Ergebnis', title: 'Deine Freunde müssen nicht mehr raten und du bekommst nichts doppelt', sub: 'So kommen Geschenke an, über die man sich wirklich freut.' }),
        cta(),
      ],
    }) },
  { id: 'kennt', title: 'Die Wunschliste, die dich kennt', desc: 'Kurzer, allgemeiner Beitrag für neue Leute: Was ist Wishtale und wofür ist es gut?', fields: [],
    build: () => ({
      title: 'Die Wunschliste, die dich kennt',
      caption: 'Jede Wunschliste zeigt, was du dir wünschst. Deine zeigt auch, wer du bist.\n\nLege dein Wishtale an und lass deine Freunde das passende Geschenk finden. Den Link findest du in der Bio.\n\n' + TAGS,
      slides: [
        S({ eyebrow: 'Wishtale', title: 'Die Wunschliste, die dich kennt', sub: 'Eine kleine Geschichte über dich, für Geschenke, die wirklich passen.' }),
        S({ eyebrow: 'Das Problem', title: 'Zum Geburtstag heißt es oft: Ich wünsche mir nichts Besonderes', sub: 'Und deine Freunde stehen ratlos vor dem Regal.' }),
        S({ type: 'chips', eyebrow: 'Die Lösung', title: 'In deinem Wishtale steht, was dich ausmacht', sub: 'Deine Wünsche und der Geschmack dahinter.', chips: ['*Wünsche', 'Interessen', 'Lieblingsmarken', 'Schon vorhanden', 'Bitte nicht'] }),
        S({ eyebrow: 'Der Link', title: 'Ein Link für alle deine Freunde', sub: 'Sie sehen alles auf einer Seite, ohne Konto und ohne Nachfragen.' }),
        cta(),
      ],
    }) },
  { id: 'fragen', title: 'Drei Fragen für bessere Geschenke', desc: 'Lehrreicher Beitrag mit drei Fragen, die jedem Geschenk helfen.', fields: [],
    build: () => ({
      title: 'Drei Fragen für bessere Geschenke',
      caption: 'Drei Fragen, und das nächste Geschenk sitzt: Was macht die Person in ihrer freien Zeit, was hat sie schon, und was möchte sie lieber nicht bekommen?\n\nIn deinem Wishtale beantwortest du sie einmal, und deine Freunde finden alles auf einer Seite. Den Link findest du in der Bio.\n\n' + TAGS,
      slides: [
        S({ eyebrow: 'Geschenke-Tipp', title: 'Drei Fragen, und das nächste Geschenk sitzt', sub: 'Mit diesen Fragen wird aus Raten ein Treffer.' }),
        S({ eyebrow: 'Frage 1', title: 'Was macht die Person am liebsten in der freien Zeit?', sub: 'Daran erkennst du, wofür sich Freude lohnt.' }),
        S({ eyebrow: 'Frage 2', title: 'Was steht schon im Schrank?', sub: 'So vermeidest du das zweite Waffeleisen.' }),
        S({ eyebrow: 'Frage 3', title: 'Was möchte die Person lieber nicht bekommen?', sub: 'Auch das ist eine Antwort, die Enttäuschungen erspart.' }),
        cta('Alle drei Antworten stehen in deinem Wishtale', 'Lege es an und teile den Link mit deinen Freunden.'),
      ],
    }) },
  { id: 'xmas', title: 'Weihnachten ohne Rätselraten', desc: 'Saisonbeitrag mit Countdown bis Heiligabend (die Tage werden beim Erstellen berechnet).', fields: [],
    build: () => ({
      title: 'Weihnachten ohne Rätselraten',
      caption: `Noch ${daysToXmas()} Tage bis Heiligabend. Genug Zeit, um ein Wishtale anzulegen und deinen Liebsten das Schenken leichter zu machen.\n\nDen Link findest du in der Bio.\n\n${TAGS} #weihnachten #weihnachtsgeschenke`,
      slides: [
        S({ eyebrow: 'Weihnachten', title: `Noch ${daysToXmas()} Tage bis Heiligabend`, sub: 'Genug Zeit für Geschenke, die wirklich passen.' }),
        S({ eyebrow: 'Der Plan', title: 'Leg dein Wishtale an und teile den Link', sub: 'Deine Familie und deine Freunde sehen sofort, was dir gefällt und was du schon hast.' }),
        S({ type: 'chips', eyebrow: 'Dazu gehört', title: 'Alles auf einer Seite', chips: ['*Wünsche', 'Lieblingsmarken', 'Schon vorhanden', 'Bitte nicht', 'Reservieren ohne Doppel'] }),
        cta('Weihnachten kann kommen', 'Dein Wishtale ist in wenigen Minuten angelegt.'),
      ],
    }) },
  { id: 'wunsch', format: 'story', title: 'Wunsch des Tages (Story)', desc: 'Kurze Story-Folgen: eine Frage ans Publikum, dein Wunsch und der Weg zum eigenen Wunschzettel.',
    fields: [['frage', 'Frage', 'Was wünschst du dir gerade?'], ['wunsch', 'Dein Wunsch des Tages', 'Ein ruhiger Sonntag und ein frisch gebrühter Kaffee']],
    build: v => ({
      title: 'Story: Wunsch des Tages', caption: '',
      slides: [S({ eyebrow: 'Wünsch dir was', title: v.frage, sub: 'Antworte uns gern in der Story.' }), S({ eyebrow: 'Unser Wunsch des Tages', title: v.wunsch, theme: 'gruen' }), cta('Was steht auf deinem Wunschzettel?', 'Lege dein Wishtale an, den Link findest du in unserer Bio.')],
    }) },
  { id: 'countdown', format: 'story', title: 'Countdown bis Heiligabend (Story)', desc: 'Eine Story mit den Tagen bis Heiligabend und dem Hinweis auf den Wunschzettel. Die Tage werden beim Erstellen berechnet.', fields: [],
    build: () => ({
      title: 'Story: Countdown', caption: '',
      slides: [S({ eyebrow: 'Weihnachten', title: `Noch ${daysToXmas()} Tage bis Heiligabend`, sub: 'Weißt du schon, was du dir wünschst?' }), cta('Schreib es auf, solange noch Zeit ist', 'Dein Wishtale ist in wenigen Minuten angelegt.')],
    }) },
  { id: 'produkt', title: 'Wunsch-Idee der Woche', desc: 'Eine Anregung zum Wünschen, mit einem Produkt als Beispiel. Das Produkt wählt Wishtale automatisch, passend zu deiner Gewichtung. Bitte nur gelegentlich einsetzen, damit es nicht nach Werbung aussieht.',
    fields: [['intro', 'Einstiegssatz', 'Weihnachten steht vor der Tür, aber du weißt nicht, was du dir wünschen sollst? Schau dir das hier an'], ['product', 'Produkt', '', productOptions], ['anzeige', 'Mit „Anzeige“ kennzeichnen (ja oder nein)', 'ja']],
    build: v => {
      const x = (v.product && PRODUCTS.find(p => p.id === v.product)) || pickProduct(0);
      if (!x) return { title: 'Wunsch-Idee der Woche', caption: '', slides: [S({ title: 'Gerade ist kein Produkt ausgewählt', sub: 'Unter Produkte steht jede Kategorie auf null. Stelle dort mindestens eine wieder auf 100 %.' })] };
      const world = cat(WORLD_OF_CAT[x.cat] || 'wohnen').n, ad = !/^n/i.test(String(v.anzeige || 'ja'));
      return {
        title: `Wunsch-Idee: ${x.t}`, product: x.id,
        caption: `${ad ? 'Anzeige | ' : ''}${v.intro}:\n\n${x.t}${x.brand ? ` von ${x.brand}` : ''}. ${(x.pros || []).slice(0, 2).join(' ')}\n\nVielleicht ist das ein Wunsch für deinen Wunschzettel? In deinem Wishtale sammelst du alles, worüber du dich freuen würdest, und deine Freunde finden es ohne Nachfragen. Den Link findest du in der Bio.${ad ? '\n\nAls Amazon-Partner verdiene ich an qualifizierten Verkäufen.' : ''}\n\n${TAGS} #wunschzettel${ad ? ' #werbung' : ''}`,
        slides: [
          S({ eyebrow: 'Wünsch dir was', title: v.intro, sub: 'Eine Idee für deinen Wunschzettel.' }),
          S({ type: 'photo', photoKey: x.a, eyebrow: x.brand || world, title: x.t, sub: x.price ? `Bei Amazon zuletzt ca. ${x.price.toFixed(2).replace('.', ',')} € gesehen (Stand ${PRICE_DATE}), der Preis kann abweichen.` : 'Den aktuellen Preis siehst du bei Amazon.' }),
          S({ type: 'chips', eyebrow: 'Darum könnte es dir gefallen', title: 'Das spricht dafür', chips: (x.pros || []).slice(0, 4).map((c, i) => (i ? '' : '*') + c) }),
          S({ eyebrow: 'Dein Wunschzettel', title: 'Setz es auf deine Wunschliste, wenn es dir gefällt', sub: 'In deinem Wishtale steht neben den Wünschen auch, was du schon hast und was dich ausmacht.' }),
          cta('Sammle deine Wünsche an einem Ort', 'Lege dein Wishtale an und teile den Link mit deinen Freunden.'),
        ],
        link: amazonUrl(x),
      };
    } },
  { id: 'aktion', title: 'Aktion aus dem CMS', desc: 'Baut aus einer deiner Aktionen (zum Beispiel Black Week oder Weihnachten) ein Karussell, das ums Wünschen geht.', fields: [['campaign', 'Aktion', '']], ctx: true,
    build: (v, ctx) => buildCampaignPost((ctx.campaigns || []).find(x => x.id === v.campaign) || (ctx.campaigns || [])[0], ctx) },
];

/** Karussell zu einer Aktion: Es geht immer ums Wünschen, nicht ums Kaufen. */
export function buildCampaignPost(c, ctx = {}) {
  if (!c) return { title: 'Aktion', caption: '', slides: [S({ title: 'Lege zuerst unter Aktionen eine Aktion an' }), cta()] };
  const prods = (c.product_ids || []).map(id => (ctx.products || []).find(p => p.id === id)).filter(Boolean);
  const head = c.headline || c.title;
  return {
    title: `Aktion: ${c.title}`, campaignId: c.id,
    caption: `${head}\n\n${c.body || ''}\n\nLege dein Wishtale an und teile den Link mit deinen Liebsten. Den Link findest du in der Bio.\n\n${TAGS} #wunschzettel${prods.length ? ' #werbung' : ''}`.replace(/\n\n\n/g, '\n\n'),
    slides: [
      S({ eyebrow: 'Wünsch dir was', title: head, sub: '' }),
      ...(c.body ? [S({ eyebrow: 'Dein Wunschzettel', title: 'So geht das mit deinem Wishtale', sub: c.body })] : []),
      S({ type: 'chips', eyebrow: 'Das gehört dazu', title: 'Alles, was dich ausmacht, auf einer Seite', chips: ['*Deine Wünsche', 'Interessen', 'Lieblingsmarken', 'Schon vorhanden', 'Bitte nicht'] }),
      ...(prods.length ? [S({ type: 'chips', eyebrow: 'Ein paar Ideen', title: 'Vielleicht ist ja etwas für deinen Wunschzettel dabei', chips: prods.map((p, i) => (i ? '' : '*') + p.title) })] : []),
      cta(c.cta_label || 'Meinen Wunschzettel anlegen', 'Dein Wishtale ist in wenigen Minuten angelegt.'),
    ],
  };
}
