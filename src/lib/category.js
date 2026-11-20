/* Ordnet einen Produkttitel einer Kategorie zu (schneller Weg ohne KI). Reihenfolge zählt: Speziellere Bereiche stehen vor allgemeinen,
   „iPhone-Hülle“ soll Technik sein, nicht Mode, „Skihelm“ Wintersport, nicht Sport. Passt nichts, ist es „sonstiges“, und die KI ordnet nach (smartCats). */
const RULES = [
  ['baby', /\bbaby|kleinkind|neugeboren|kinderwagen|buggy|babyschale|wickel|schnuller|rassel|beißring|lernlöffel|krabbel|spieluhr|babyphone|stillkissen|lauflernwagen/i],
  ['spielen', /\btonies?\b|\btoni\b|toniebox|hörfigur|tiptoi|duplo|schleich|kinderlieder|spielfigur|spielzeug|spielset|puppe|barbie|hot wheels|matchbox|siku|ravensburger|haba\b|brio\b|holzeisenbahn|kinderküche|bobbycar|laufrad|kinderbuch|bilderbuch|sticker|lego|puzzle|brettspiel|gesellschaftsspiel|kartenspiel|playmobil|basteln|knete|bausteine|plüsch|kuscheltier|malbuch|bastelset/i],
  ['wintersport', /\bski\b|skier|skihelm|skibrille|skischuh|skistöcke|snowboard|langlauf|skitour|schneeschuh|schlitten|rodel|lawinen|tourenski|thermounterwäsche|skiunterwäsche/i],
  ['radsport', /fahrrad|e-?bike|rennrad|gravel|mountainbike|\bmtb\b|radhelm|fahrradhelm|radtrikot|radhose|fahrradschloss|fahrradlicht|fahrradtasche|klickpedal|radcomputer|fahrradträger|bikepacking/i],
  ['gaming', /playstation|\bps5\b|\bps4\b|xbox|nintendo|switch 2|switch oled|gaming|controller|videospiel|\bgame\b|steam deck|konsole/i],
  ['fitness', /hantel|kettlebell|fitness|yoga|pilates|klimmzug|faszienrolle|widerstandsband|trainingsmatte|gymnastikmatte|crosstrainer|laufband|rudergerät|heimtrainer|proteinpulver|protein|eiweiß|sportuhr|fitness-?tracker|garmin|whoop|gewichtsweste|springseil|liegestütz|krafttraining/i],
  ['musik', /gitarre|ukulele|klavier|keyboard|e-?piano|geige|violine|cello|schlagzeug|cajon|trommel|mundharmonika|flöte|saxophon|trompete|noten|plattenspieler|schallplatte|vinyl|plektren|gitarrensaite|metronom|mikrofon/i],
  ['technik', /iphone|ipad|macbook|airpods|samsung galaxy|smartphone|handy|handyhülle|hülle für|kopfhörer|ladekabel|ladegerät|powerbank|usb|bluetooth|lautsprecher|speaker|laptop|tablet|e-?reader|kindle|smartwatch|apple watch|kamera|gopro|objektiv|monitor|tastatur|computermaus|webcam|router|drohne|beamer|fernseher|\btv\b|soundbar|smart home|alexa|echo dot|tonie-?box/i],
  ['beauty', /creme|serum|hautpflege|gesichtspflege|make-?up|lippenstift|mascara|nagellack|essie|parfüm|parfum|eau de|duschgel|shampoo|haarpflege|föhn|glätteisen|lockenstab|rasierer|rasur|bartpflege|maniküre|pediküre|kosmetik|beauty|bodylotion|aesop|weleda|dyson airwrap/i],
  ['genuss', /kaffee|espresso|barista|kaffeewaage|handmühle|kaffeemühle|siebträger|milchaufschäumer|french press|aeropress|\btee\b|teekanne|matcha|wein|whisky|\bgin\b|\brum\b|schokolade|pralinen|gewürz|\bbier\b|olivenöl|feinkost|delikatesse/i],
  ['kochen', /pfanne|topf|messer|küchen|bräter|backform|backen|kochbuch|mixer|airfryer|heißluftfritteuse|auflauf|schneidebrett|reibe|kochen|pfannenwender|thermomix|nudel|dutch oven|wok|pizzastein|küchenmaschine|kitchenaid|waffeleisen|sous-?vide/i],
  ['garten', /garten|balkon|hochbeet|blumentopf|pflanzkübel|gießkanne|rasen|heckenschere|gartenschere|gartenschlauch|saatgut|samen|grill\b|grillen|weber|feuerschale|gartenmöbel|liegestuhl|vogelhaus|insektenhotel/i],
  ['heimwerken', /werkzeug|akkuschrauber|bohrmaschine|bohrhammer|stichsäge|kreissäge|schleifer|makita|bosch professional|dewalt|metabo|werkbank|wasserwaage|schraubendreher|bit-?set|zange|lötkolben|multitool|leatherman|werkzeugkoffer|messgerät/i],
  ['haustier', /\bhund|hunde|welpe|\bkatze|katzen|kratzbaum|leine|halsband|hundebett|katzenklo|futternapf|leckerli|aquarium|terrarium|hamster|kaninchen|meerschweinchen|vogelkäfig|pferd|reitsport/i],
  ['outdoor', /wander|zelt|rucksack|schlafsack|trekking|camping|stirnlampe|isomatte|thermosflasche|trinkflasche|outdoor|regenjacke|taschenmesser|fernglas|kletter|bouldern|kompass|gaskocher|hängematte/i],
  ['sport', /laufschuh|\blauf|joggen|marathon|trikot|schwimm|tennis|padel|badminton|squash|tischtennis|fußball|basketball|volleyball|handball|golf|\bball\b|boxen|boxhandschuh|kampfsport|skateboard|inliner|surf|\bsup\b|stand up paddle|sportschuh|sporttasche/i],
  ['reisen', /koffer|reise|packwürfel|nackenkissen|reiseadapter|passhülle|kofferwaage|trolley|kulturbeutel|reiseführer/i],
  ['buecher', /gebundenes buch|\bbuch\b|roman|taschenbuch|hardcover|notizbuch|bullet|kalender|hörbuch|bildband|\bband\b|comic|manga/i],
  ['mode', /pullover|jacke|hose|shirt|schuhe|sneaker|mütze|schal|handschuh|kleid|socken|tasche|geldbörse|portemonnaie|gürtel|sonnenbrille|\buhr\b|schmuck|kette|armband|ohrringe|ring\b|hoodie|mantel|stiefel/i],
  ['erlebnisse', /gutschein|ticket|konzert|eintritt|kurs\b|workshop|erlebnis|wellness|massage|kochkurs|fallschirm|ballonfahrt|escape room|musical|theater|festival/i],
  ['wohnen', /lampe|leuchte|vase|kerze|kissen|decke|teppich|regal|zimmerpflanze|bilderrahmen|rahmen|deko|duft|wecker|spiegel|tablett|korb|plaid|bettwäsche|handtuch|geschirr|tasse|becher|glas|gläser|sessel|stuhl|tisch\b|aufbewahrung/i],
];

/** Kategorie aus dem Titel oder fallback (Standard „sonstiges“). */
export function guessCategory(title, fallback = 'sonstiges') {
  const t = String(title || '');
  for (const [id, re] of RULES) if (re.test(t)) return id;
  return fallback;
}
/** true, wenn die Wortliste den Titel sicher kennt (sonst darf die KI nachordnen). */
export const knownCategory = title => guessCategory(title, '') !== '';
