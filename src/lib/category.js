/* Ordnet einen Produkttitel einer Kategorie zu. Reihenfolge zählt: „iPhone-Hülle“ soll Technik sein, nicht Mode oder Wohnen. */
const RULES = [
  ['spielen', /\btonies?\b|\btoni\b|toniebox|hörfigur|tiptoi|duplo|schleich|kinderlieder|spielfigur|spielzeug|spielset|puppe|barbie|hot wheels|matchbox|siku|ravensburger|haba\b|brio\b|holzeisenbahn|kinderküche|bobbycar|laufrad|baby|kleinkind|rassel|beißring|lernlöffel|kinderbuch|bilderbuch|sticker|stofftier/i],
  ['technik', /iphone|ipad|macbook|airpods|samsung galaxy|smartphone|handy|handyhülle|hülle für|kopfhörer|ladekabel|ladegerät|powerbank|usb|bluetooth|lautsprecher|speaker|laptop|tablet|e-?reader|kindle|smartwatch|kamera|gopro|monitor|tastatur|computermaus|webcam|router|drohne|konsole|playstation|nintendo|\bhdmi\b/i],
  ['genuss', /kaffee|espresso|barista|kaffeewaage|handmühle|kaffeemühle|wasserkocher|french press|aeropress|\btee\b|teekanne|wein|whisky|gin\b|schokolade|gewürz|bier|olivenöl|feinkost/i],
  ['kochen', /pfanne|topf|messer|küchen|bräter|backform|backen|kochbuch|mixer|airfryer|auflauf|schneidebrett|reibe|kochen|pfannenwender|thermomix|nudel|dutch oven/i],
  ['outdoor', /wander|zelt|rucksack|schlafsack|trekking|camping|stirnlampe|isomatte|thermosflasche|trinkflasche|outdoor|regenjacke|taschenmesser|fernglas/i],
  ['sport', /lauf|yoga|hantel|fitness|trikot|sportuhr|fahrrad|radhelm|training|schwimm|tennis|fußball|ball\b|gymnastik|trainingsmatte/i],
  ['reisen', /koffer|reise|packwürfel|nackenkissen|reiseadapter|passhülle|kofferwaage|trolley/i],
  ['spielen', /lego|puzzle|brettspiel|gesellschaftsspiel|kartenspiel|playmobil|basteln|malen|knete|bausteine|plüsch|kuscheltier|spielzeug/i],
  ['buecher', /gebundenes buch|\bbuch\b|roman|taschenbuch|hardcover|notizbuch|bullet|kalender|hörbuch|bildband|\bband\b/i],
  ['mode', /pullover|jacke|hose|shirt|schuhe|sneaker|mütze|schal|handschuh|kleid|socken|tasche|geldbörse|portemonnaie|gürtel|sonnenbrille|\buhr\b|schmuck|kette|armband/i],
  ['wohnen', /lampe|vase|kerze|kissen|decke|teppich|regal|pflanze|bilderrahmen|rahmen|deko|duft|wecker|spiegel|tablett|korb|plaid/i],
];
export function guessCategory(title, fallback = 'wohnen') {
  const t = String(title || '');
  for (const [id, re] of RULES) if (re.test(t)) return id;
  return fallback;
}
