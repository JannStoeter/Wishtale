/*
 * Passendes Symbol für Wünsche ohne Bild (statt des Anfangsbuchstabens).
 * Reihenfolge: Stichwort im Wunschnamen (speziell vor allgemein), sonst die Kategorie, sonst ein Geschenk.
 * Alle Symbole im selben Strich wie ICON in util.js (24er Raster, nur Linien, Farbe über currentColor).
 * Neues Symbol: Eintrag in GLYPH, Stichwörter in WORDS, bei Bedarf als Standard einer Kategorie in BY_CAT.
 */
import { esc } from './util.js';
import { guessCategory } from './category.js';

export const GLYPH = {
  gift: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-3 0-5-1-5-3s3-2 5 3c2-5 5-5 5-3s-2 3-5 3"/>',
  sweater: '<path d="M8.5 4L4 6.5 2.5 14l3 .8.5-3V20h12v-8.2l.5 3 3-.8L20 6.5 15.5 4"/><path d="M8.5 4c.8 1.4 2 2 3.5 2s2.7-.6 3.5-2M6 17.5h12"/>',
  shirt: '<path d="M8.5 4L3 7l2 3.6 2-1V20h10V9.6l2 1L21 7l-5.5-3c-.5 1.4-1.8 2.3-3.5 2.3S9 5.4 8.5 4z"/>',
  pants: '<path d="M6.5 3h11l1.5 18h-4.5L12 10l-2.5 11H5z"/><path d="M6.3 6.5h11.4"/>',
  dress: '<path d="M9.5 3h5l-1 4.5L18 21H6l4.5-13.5z"/><path d="M10.5 7.5h3"/>',
  shoe: '<path d="M2.5 17.5V8.5c2 .4 3.4 1.4 4.3 3h3.4l7.6 2.4c2 .6 3.7 1.8 3.7 3.6H2.5z"/><path d="M2.5 20h19M10 11.5V14M13 12.4v2.2"/>',
  cap: '<path d="M5 15a7 7 0 0114 0z"/><path d="M4 15h16v3.5H4zM12 8V6.8"/><circle cx="12" cy="5.3" r="1.5"/>',
  glasses: '<circle cx="6.5" cy="14" r="3.5"/><circle cx="17.5" cy="14" r="3.5"/><path d="M10 14c1.3-1 2.7-1 4 0M3 13l1.5-6M21 13l-1.5-6"/>',
  ring: '<circle cx="12" cy="15" r="6"/><path d="M9.6 9.5L8 6.5 10 4h4l2 2.5-1.6 3"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M15.5 14.5h2.5"/>',
  bag: '<path d="M5 8h14l1 12H4z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
  watch: '<rect x="7" y="7" width="10" height="10" rx="2.5"/><path d="M9 7l.7-4h4.6L15 7M9 17l.7 4h4.6L15 17M12 9.8V12l1.5 1"/>',
  headphones: '<path d="M4 15v-3a8 8 0 0116 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  tablet: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7.5h6M9 10.5h6M9 13.5h4"/>',
  laptop: '<rect x="4.5" y="5" width="15" height="10" rx="1.5"/><path d="M2.5 19h19l-2-4h-15z"/>',
  screen: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/>',
  camera: '<path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"/><circle cx="12" cy="13" r="3.5"/>',
  speaker: '<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="14" r="3.5"/><circle cx="12" cy="7.2" r="1"/>',
  gamepad: '<path d="M7 7h10a5 5 0 014.8 6.4l-1 3.4a2.5 2.5 0 01-4.3.9L14.5 16h-5l-2 1.7a2.5 2.5 0 01-4.3-.9l-1-3.4A5 5 0 017 7z"/><path d="M7.5 10v4M5.5 12h4M15.5 11h.01M18 13h.01"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01" stroke-width="2.4"/>',
  blocks: '<rect x="3" y="9.5" width="18" height="10.5" rx="1.5"/><path d="M6 9.5V7h4v2.5M14 9.5V7h4v2.5"/>',
  teddy: '<circle cx="12" cy="13.5" r="6.5"/><circle cx="6.3" cy="7" r="2.5"/><circle cx="17.7" cy="7" r="2.5"/><path d="M10 12h.01M14 12h.01" stroke-width="2.2"/><path d="M10.5 15.8c1 .7 2 .7 3 0"/>',
  stroller: '<path d="M12 4v8h8a8 8 0 00-8-8z"/><path d="M3 6h2l2 6h13a6 6 0 01-6 5H9.5A4.5 4.5 0 015 13"/><circle cx="8" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/>',
  paw: '<circle cx="6.5" cy="10.5" r="1.8"/><circle cx="10" cy="6" r="1.8"/><circle cx="14.5" cy="6" r="1.8"/><circle cx="18" cy="10.5" r="1.8"/><path d="M12 12c-3 0-5.5 3.5-5.5 6a2.5 2.5 0 003.5 2c1.2-.5 2.8-.5 4 0a2.5 2.5 0 003.5-2c0-2.5-2.5-6-5.5-6z"/>',
  dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5l3.8 2.8-1.4 4.4H9.6l-1.4-4.4z"/><path d="M12 3v4.5M15.8 10.3l4.5-1.6M14.4 14.7l2.7 3.8M9.6 14.7l-2.7 3.8M8.2 10.3L3.7 8.7"/>',
  racket: '<ellipse cx="14.5" cy="9.5" rx="5" ry="6.5" transform="rotate(45 14.5 9.5)"/><path d="M10.3 13.7L4 20M12 8l4 4M14 6l4 4"/>',
  bike: '<circle cx="5.5" cy="16" r="3.5"/><circle cx="18.5" cy="16" r="3.5"/><path d="M5.5 16L9 9h7.5l2 7M9 9l3 7H5.5M12 16l4.5-7M15 6h2.5L16.5 9M7.5 6.5h3"/>',
  tent: '<path d="M3 20L12 4l9 16z"/><path d="M9 20l3-6 3 6M2 20h20"/>',
  backpack: '<path d="M6 9a6 6 0 0112 0v10a2 2 0 01-2 2H8a2 2 0 01-2-2z"/><path d="M10 3.5h4M9 13h6v4H9z"/>',
  mountain: '<path d="M2 20l7-12 4 6 3-4 6 10z"/><path d="M7.2 11.5l1.8 1.3 1.8-1.3"/>',
  snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9.5 4L12 6l2.5-2M9.5 20l2.5-2 2.5 2"/>',
  bottle: '<path d="M10 2.5h4V5h-4zM9 5h6l1 3v12a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 018 20V8z"/><path d="M8 11h8M8 17h8"/>',
  suitcase: '<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V4.5h6V7M9 11v5M15 11v5"/>',
  book: '<path d="M5 5a2 2 0 012-2h12v15H7a2 2 0 00-2 2z"/><path d="M5 20a2 2 0 002 1h12v-3M9 7h6"/>',
  note: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  guitar: '<path d="M13.5 10.5L20 4M18.5 2.5L21.5 5.5"/><path d="M11.5 8.5c-1-1-3-1-4 0s-.5 2.5-1.5 3.5-3 .7-3.5 2.5c-.7 2.3 1 5.3 3.5 6.5 2 1 4.5.3 5-1.5.4-1.4 0-2.5 1-3.5s2.5-.5 3.5-1.5 1-3 0-4-3-1-4 0z"/><circle cx="9.5" cy="14.5" r="1.5"/>',
  vinyl: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 6a6 6 0 016 6"/>',
  plant: '<path d="M7 14h10l-1.5 7h-7z"/><path d="M12 14V8M12 8c0-3 2-5 5-5 0 3-2 5-5 5zM12 10.5c0-2.5-2-4.5-4.5-4.5 0 2.5 2 4.5 4.5 4.5z"/>',
  grill: '<path d="M4 9h16a8 8 0 01-16 0z"/><path d="M8 16l-2 5M16 16l2 5M12 17v4M9 3.5c-.8 1 .8 2 0 3M12 3c-.8 1 .8 2 0 3M15 3.5c-.8 1 .8 2 0 3"/>',
  hammer: '<path d="M12.5 5.5l3-3 6 6-3 3z"/><path d="M14 10l-9.5 9.5a1.5 1.5 0 01-2-2L12 8"/>',
  mug: '<path d="M4 9h12v6a5 5 0 01-5 5H9a5 5 0 01-5-5z"/><path d="M16 11h1.5a2.5 2.5 0 010 5H16M8 3.5c-.8 1 .8 2 0 3M12 3.5c-.8 1 .8 2 0 3"/>',
  wine: '<path d="M7 3h10l-.5 5a4.5 4.5 0 01-9 0z"/><path d="M12 12.5V20M8.5 21h7M7.3 6.5h9.4"/>',
  pan: '<circle cx="9.5" cy="12" r="6.5"/><path d="M16 11h5.5a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H16"/>',
  pot: '<path d="M4 9h16v8a3 3 0 01-3 3H7a3 3 0 01-3-3z"/><path d="M2 9h20M2 12h2M20 12h2M10 6h4"/>',
  knife: '<path d="M3 21l9.5-9.5M12.5 11.5L20 4c1 2 .8 5-1.5 7.3L15 14.5z"/>',
  lamp: '<path d="M8 3h8l3 8H5z"/><path d="M12 11v8M8 21h8"/>',
  candle: '<rect x="8" y="10" width="8" height="11" rx="1"/><path d="M12 10V8.2M12 3c1.5 1.5 1.5 3.5 0 4.2-1.5-.7-1.5-2.7 0-4.2z"/>',
  sofa: '<path d="M5 11V8a2 2 0 012-2h10a2 2 0 012 2v3"/><path d="M3 13a2 2 0 014 0v2h10v-2a2 2 0 014 0v5H3zM5 18v2M19 18v2"/>',
  vase: '<path d="M9 3h6M10 3v3c-3 1.5-4 4-4 7 0 4 2.5 8 6 8s6-4 6-8c0-3-1-5.5-4-7V3"/>',
  lipstick: '<path d="M8 21v-8h8v8zM9.5 13V9h5v4M10.5 9V5.5l3-2.5v6"/>',
  perfume: '<rect x="5" y="9" width="14" height="12" rx="3"/><path d="M10 9V6h4v3M9 4h6"/>',
  pump: '<rect x="7" y="9" width="10" height="12" rx="2.5"/><path d="M10 9V6h4v3M12 6V3h3.5"/>',
  ticket: '<path d="M3 7h18v3.5a1.5 1.5 0 000 3V17H3v-3.5a1.5 1.5 0 000-3z"/><path d="M15 7v10" stroke-dasharray="1.5 2"/>'
};

/** Stichwörter im Wunschnamen. Speziell vor allgemein: „Laufschuhe“ ist ein Schuh, „Kochbuch“ ein Buch, „Fahrradlicht“ ein Fahrrad. */
const WORDS = [
  ['ticket', /gutschein|ticket|konzert|eintritt|kurs\b|workshop|erlebnis|musical|theater|festival|\bkino|wellness|massage|escape room|ballonfahrt|fallschirm/],
  ['book', /buch\b|bücher|buches|\broman|comic|manga|hörbuch|bildband|reiseführer|kalender|taschenbuch|hardcover/],
  ['blocks', /lego|duplo|playmobil|bausteine|bauklötze|bauklotz/],
  ['teddy', /kuscheltier|teddy|plüsch|stofftier|puppe|steiff|tonie|spielzeug|spielfigur|schleich/],
  ['gamepad', /playstation|\bps[45]\b|xbox|nintendo|\bswitch\b|controller|konsole|videospiel|gaming|steam deck|\bgame\b/],
  ['dice', /brettspiel|gesellschaftsspiel|kartenspiel|würfel|puzzle|spieleabend|\bspiele?\b|catan|monopoly|uno\b/],
  ['stroller', /kinderwagen|buggy|babyschale|\bbaby|kinderbett|wickel|schnuller/],
  ['paw', /\bhund\b|hunde(?!rt)|katze|kratzbaum|hundeleine|halsband|futternapf|haustier|aquarium|hamster|kaninchen|meerschwein|leckerli/],
  ['bike', /fahrrad|e-?bike|rennrad|mountainbike|\bmtb\b|radhelm|gravel|laufrad|\bbike\b|radtrikot|bikepacking/],
  ['snow', /\bski|snowboard|schlitten|rodel|langlauf|schneeschuh/],
  ['headphones', /kopfhörer|airpods|headset|earbuds|in-?ear/],
  ['watch', /\buhr\b|\buhren|armbanduhr|smartwatch|apple watch|sportuhr|fitness-?tracker|garmin|wecker/],
  ['phone', /iphone|smartphone|\bhandy|galaxy s|pixel \d/],
  ['tablet', /ipad|tablet|kindle|e-?reader|tolino/],
  ['laptop', /laptop|macbook|chromebook|computer|\bpc\b|tastatur|maus\b/],
  ['screen', /monitor|fernseher|\btv\b|beamer|bildschirm|fire stick/],
  ['camera', /kamera|gopro|objektiv|polaroid|instax|camera|drohne/],
  ['speaker', /lautsprecher|speaker|soundbar|sonos|boombox|echo dot|radio/],
  ['vinyl', /plattenspieler|schallplatte|vinyl/],
  ['guitar', /gitarre|ukulele|\bbass\b/],
  ['note', /klavier|piano|geige|violine|cello|noten\b|flöte|trompete|saxophon|schlagzeug|cajon|mikrofon|musik/],
  ['shoe', /schuh|sneaker|stiefel|boots|sandale|pantoffel|crocs|birkenstock|slipper|loafer/],
  ['sweater', /pullover|\bpulli|hoodie|sweatshirt|sweater|strickjacke|cardigan|jacke|mantel|weste|fleece|parka|anorak/],
  ['shirt', /t-?shirt|shirt|hemd|bluse|\btop\b|trikot|polo/],
  ['pants', /hose\b|hosen|jeans|leggings|shorts|chino/],
  ['dress', /kleid|dirndl|\brock\b/],
  ['cap', /mütze|beanie|\bcap\b|\bhut\b|schal\b|handschuh|stirnband/],
  ['glasses', /brille/],
  ['ring', /\bringe?\b|kette|armband|ohrring|schmuck|anhänger|pandora|brosche/],
  ['wallet', /geldbörse|portemonnaie|portmonee|brieftasche|wallet|kartenetui/],
  ['backpack', /rucksack|daypack/],
  ['suitcase', /koffer|trolley|reisetasche|kulturbeutel|packwürfel|weekender/],
  ['bag', /tasche|beutel|shopper|clutch/],
  ['tent', /zelt|camping|schlafsack|isomatte|hängematte|stirnlampe/],
  ['mountain', /wander|kletter|boulder|trekking/],
  ['racket', /tennis|padel|badminton|squash|tischtennis|schläger/],
  ['ball', /\bball\b|bälle|fußball|basketball|volleyball|handball|golf/],
  ['dumbbell', /hantel|kettlebell|fitness|krafttraining|klimmzug|yoga|pilates|faszien|springseil|protein/],
  ['bottle', /trinkflasche|thermosflasche|isolierflasche|thermobecher|wasserflasche/],
  ['candle', /kerze|teelicht|raumduft|diffuser/],
  ['wine', /wein|whisky|whiskey|\bgin\b|\brum\b|sekt|champagner|\bbier|cocktail|gläser|\bglas\b|likör|prosecco|aperol/],
  ['mug', /kaffee|espresso|\btee|tasse|becher|matcha|barista|siebträger|french press|aeropress|milchaufschäumer/],
  ['knife', /messer|schneidebrett|multitool/],
  ['pan', /pfanne|\bwok\b|crêpe|crepe/],
  ['pot', /topf|töpfe|bräter|dutch oven|cocotte|thermomix|küchenmaschine|kitchenaid|mixer|airfryer|heißluftfritteuse|backform|backen|waffeleisen|kochen/],
  ['grill', /grill|smoker|feuerschale|plancha/],
  ['plant', /pflanze|blume|garten|hochbeet|samen|saatgut|kaktus|monstera|blumentopf|gießkanne|balkon|bonsai|orchidee/],
  ['hammer', /werkzeug|akkuschrauber|bohr|säge|schleifer|hammer|zange|schraub|werkbank|makita|dewalt|metabo|wasserwaage|lötkolben/],
  ['lamp', /lampe|leuchte|licht|\bhue\b|bewegungsmelder|smart ?home/],
  ['sofa', /sofa|sessel|couch|kissen|decke|plaid|sitzsack|bettwäsche/],
  ['vase', /vase|deko|bilderrahmen|poster|teppich|spiegel/],
  ['lipstick', /lippenstift|make-?up|mascara|nagellack|lidschatten|rouge|lipgloss|essie/],
  ['perfume', /parfum|parfüm|eau de|\bduft/],
  ['pump', /creme|serum|pflege|shampoo|duschgel|lotion|kosmetik|\bhaar|rasier|\bbart|föhn|glätteisen|airwrap/]
];

/** Standard je Kategorie (IDs aus CATS in src/data/content.js). */
const BY_CAT = {
  wohnen: 'vase', kochen: 'pan', genuss: 'mug', technik: 'headphones', gaming: 'gamepad', fitness: 'dumbbell',
  sport: 'ball', radsport: 'bike', outdoor: 'backpack', wintersport: 'snow', reisen: 'suitcase', mode: 'sweater',
  beauty: 'pump', buecher: 'book', musik: 'note', garten: 'plant', heimwerken: 'hammer', spielen: 'teddy',
  baby: 'stroller', haustier: 'paw', erlebnisse: 'ticket', sonstiges: 'gift'
};

/** Name des Symbols zu Titel und Kategorie. */
export function wishIcon(title, catId) {
  const t = String(title || '').toLowerCase();
  if (t) for (const [k, re] of WORDS) if (re.test(t)) return k;
  if (catId && BY_CAT[catId] && catId !== 'sonstiges') return BY_CAT[catId];
  return BY_CAT[guessCategory(t)] || 'gift';
}

/** Fertiges SVG (dekorativ, Farbe über currentColor). */
export const wishGlyph = (title, catId, cls = '') =>
  `<svg class="wglyph ${esc(cls)}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${GLYPH[wishIcon(title, catId)] || GLYPH.gift}</svg>`;
