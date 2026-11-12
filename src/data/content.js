/* Statische Inhalte und Beispieldaten. Später durch API / Produkt-Feed ersetzbar. */
export const CATS=[
 {id:'wohnen',n:'Wohnen & Interior',a:'vase',t:0},{id:'technik',n:'Technik',a:'headphones',t:4},
 {id:'kochen',n:'Kochen',a:'pan',t:2},{id:'sport',n:'Sport',a:'sneaker',t:5},
 {id:'reisen',n:'Reisen',a:'suitcase',t:1},{id:'mode',n:'Mode',a:'sweater',t:0},
 {id:'genuss',n:'Genuss',a:'mug',t:2},{id:'buecher',n:'Bücher',a:'book',t:3},
 {id:'erlebnisse',n:'Erlebnisse',a:'ticket',t:5},{id:'outdoor',n:'Outdoor',a:'tent',t:1},
 {id:'spielen',n:'Spielzeug & Basteln',a:'game',t:5}];
export const cat=id=>CATS.find(c=>c.id===id)||CATS[0];
export const ACT=[
 {l:'Kaffee brühen',t:'kaffee'},{l:'Kochen',t:'kochen'},{l:'Backen',t:'kochen'},{l:'Einrichten',t:'wohnen'},
 {l:'Lesen',t:'lesen'},{l:'Wandern',t:'wandern'},{l:'Laufen',t:'laufen'},{l:'Radfahren',t:'rad'},
 {l:'Reisen planen',t:'reisen'},{l:'Gärtnern',t:'garten'},{l:'Töpfern',t:'keramik'},{l:'Tee genießen',t:'tee'},
 {l:'Musik hören',t:'musik'},{l:'Brettspiele',t:'spiele'},{l:'Malen & Basteln',t:'basteln'},{l:'Bauen & Konstruieren',t:'bauen'},{l:'Vorlesen',t:'vorlesen'},{l:'Tiere',t:'tiere'},{l:'Draußen spielen',t:'draussen'}];
export const BRANDS=['Patagonia','Le Creuset','Aesop','Leuchtturm1917','Hario','Stelton','Fjällräven','Moleskine','Muji','Fellow'];
export const TRIES=['Keramikkurs','Segeln','Tauchen','Kochkurs','Fotokurs','Surfen','Reiten'];
export const NOGOS=['Duftkerzen','Socken','Deko-Kitsch','Krimskrams','Alkohol','Parfüm','Laute Spielzeuge','Süßigkeiten'];
export const ALTS=['IKEA-Gutschein','Amazon-Gutschein','Wunschgutschein','Buchhandlung vor Ort','Lieblingsrestaurant','Lokaler Kaffeeröster','Reise-Gutschein','Spende: Naturschutz','Spende: Tierschutz','Tierpark-Eintritt'];
export const OCC=[{id:'weihnachten',l:'Weihnachten'},{id:'geburtstag',l:'Geburtstag'},{id:'hochzeit',l:'Hochzeit'},{id:'einzug',l:'Einzug'},{id:'danke',l:'Dankeschön'}];
export const occL=id=>(OCC.find(o=>o.id===id)||{}).l||'';
export function occTip(o){
  if(o==='weihnachten'){const n=new Date(),d=Math.ceil((new Date(n.getFullYear(),11,24)-n)/864e5);return `${d>0?`Noch ${d} Tage. `:''}Zu Weihnachten passen Dinge, die es gemütlich machen, die man genießen und mit Vorfreude auspacken kann.`}
  return {none:'Ohne besonderen Anlass zeigen wir einfach das, was am besten zu den Interessen und Wünschen passt.',geburtstag:'Zum Geburtstag darf es ruhig etwas Persönlicheres sein, zum Beispiel ein Erlebnis oder ein Herzenswunsch.',hochzeit:'Zur Hochzeit freut sich das Paar über Dinge, die das gemeinsame Zuhause schöner machen.',einzug:'Zum Einzug sind Alltagsdinge schön, die ein neues Zuhause gleich wohnlicher machen.',danke:'Als Dankeschön darf es etwas Kleines und Persönliches sein, gern bis etwa 40 Euro.'}[o];
}
export const CREATORS=[
 {id:'nora',handle:'@nora.wohnt',name:'Nora Linde',niche:'Interior',scope:'Interior',a:'vase',tone:0,bio:'Ruhige Räume, ehrliche Materialien. Ich zeige, was bei mir wirklich im Alltag steht.',items:['x1','x2','x3','x4','x5']},
 {id:'kaan',handle:'@kaan.kocht',name:'Kaan Brandt',niche:'Kaffee und Küche',scope:'Küche',a:'grinder',tone:2,bio:'Gutes Werkzeug für Menschen, die gern kochen und Kaffee ernst nehmen.',items:['y1','y2','y3','y4','y5']},
 {id:'hanna',handle:'@hanna.draussen',name:'Hanna Voss',niche:'Outdoor und Reise',scope:'Outdoor',a:'tent',tone:1,bio:'Leicht packen, lange unterwegs sein. Meine Ausrüstung nach drei Jahren Praxis.',items:['z1','z2','z3','z4','z5']}
];
export const crea=id=>CREATORS.find(c=>c.id===id);
/* Beispieldaten: fiktive Creator, Preise ca. */
export const CPROD=[
 {id:'x1',t:'Handgeformte Steingut-Vase',p:42,c:'wohnen',a:'vase',tone:0,note:'Steht bei mir im Flur und wirkt auch ohne Blumen.'},
 {id:'x2',t:'Keramik-Tischlampe, matt',p:79,c:'wohnen',a:'lamp',tone:4,note:'Warmes Licht, das den Abend ruhiger macht.'},
 {id:'x3',t:'Zimmerpflanze im Keramiktopf',p:29,c:'wohnen',a:'plant',tone:1,note:'Pflegeleicht und der schnellste Weg zu mehr Leben im Raum.'},
 {id:'x4',t:'Mundgeblasene Wassergläser, 4er Set',p:44,c:'wohnen',a:'glasses',tone:5,note:'Jedes ein bisschen anders. Genau das gefällt mir.'},
 {id:'x5',t:'Papierleuchte, 45 cm',p:35,c:'wohnen',a:'lamp',tone:2,note:'Günstig, leicht und sieht nicht danach aus.'},
 {id:'y1',t:'Handkaffeemühle mit Keramik-Mahlwerk',p:55,c:'genuss',a:'grinder',tone:2,note:'Meine tägliche Mühle seit zwei Jahren.'},
 {id:'y2',t:'Pour-over-Karaffe aus Glas',p:39,c:'genuss',a:'bottle',tone:5,note:'Der einfachste Einstieg in Filterkaffee.'},
 {id:'y3',t:'Gusseisen-Bräter, 24 cm',p:120,c:'kochen',a:'pot',tone:2,note:'Brot, Schmorgerichte, Eintöpfe. Hält ewig.'},
 {id:'y4',t:'Küchenwaage mit Timer',p:34,c:'kochen',a:'scale',tone:4,note:'Wer einmal wiegt, backt nie wieder nach Gefühl.'},
 {id:'y5',t:'Abziehstein für Küchenmesser',p:40,c:'kochen',a:'knife',tone:4,note:'Scharfe Messer sind das beste Upgrade für jede Küche.'},
 {id:'z1',t:'Ultraleichte Wanderstöcke',p:79,c:'outdoor',a:'sticks',tone:1,note:'Entlasten die Knie auf langen Abstiegen spürbar.'},
 {id:'z2',t:'Isolierte Trinkflasche, 0,75 l',p:35,c:'outdoor',a:'bottle',tone:4,note:'Hält Tee den ganzen Tag warm.'},
 {id:'z3',t:'Merino-Buff',p:30,c:'outdoor',a:'sweater',tone:0,note:'Mein meistgenutztes Teil im Rucksack.'},
 {id:'z4',t:'Wanderkarte mit Kompass',p:24,c:'outdoor',a:'compass',tone:1,note:'Akku leer ist kein Problem mit Karte.'},
 {id:'z5',t:'Packwürfel-Set',p:26,c:'reisen',a:'suitcase',tone:5,note:'Ordnung im Rucksack, ohne Aufwand.'}
];
export const cprod=id=>CPROD.find(x=>x.id===id);
export const LOOKS=[
 {id:'l1',cid:'nora',t:'Ruhiger Flur',d:'Drei Dinge, die einen Eingangsbereich sofort wohnlicher machen.',scene:'flur',objs:[{k:'vase',x:95,y:338,s:1.6,tone:0,pid:'x1'},{k:'lamp',x:205,y:338,s:1.35,tone:2,pid:'x5'},{k:'plant',x:305,y:338,s:1.3,tone:1,pid:'x3'}]},
 {id:'l2',cid:'nora',t:'Abendlicht',d:'Warmes Licht und gutes Glas für Abende zu Hause.',scene:'abend',objs:[{k:'lamp',x:120,y:338,s:1.5,tone:4,pid:'x2'},{k:'glasses',x:270,y:338,s:1.4,tone:5,pid:'x4'}]},
 {id:'l3',cid:'kaan',t:'Kaffee-Ecke',d:'Mühle und Karaffe: alles für Filterkaffee am Morgen.',scene:'kaffee',objs:[{k:'grinder',x:105,y:338,s:1.5,tone:2,pid:'y1'},{k:'bottle',x:225,y:338,s:1.5,tone:5,pid:'y2'},{k:'mug',x:325,y:338,s:1,tone:0}]},
 {id:'l4',cid:'kaan',t:'Sonntags-Schmorgericht',d:'Das Werkzeug für Gerichte, die langsam gut werden.',scene:'schmoren',objs:[{k:'pot',x:110,y:338,s:1.6,tone:2,pid:'y3'},{k:'scale',x:235,y:338,s:1.2,tone:4,pid:'y4'},{k:'knife',x:330,y:338,s:1.1,tone:0,pid:'y5'}]},
 {id:'l5',cid:'hanna',t:'Hüttentour',d:'Das hat bei drei Tagen in den Bergen gereicht.',scene:'huette',objs:[{k:'sticks',x:100,y:440,s:1.7,tone:1,pid:'z1'},{k:'bottle',x:210,y:440,s:1.5,tone:4,pid:'z2'},{k:'sweater',x:315,y:440,s:1.5,tone:0,pid:'z3'}]},
 {id:'l6',cid:'hanna',t:'Packliste Wochenende',d:'Ordnung im Rucksack, ohne zu viel mitzunehmen.',scene:'packen',objs:[{k:'suitcase',x:120,y:420,s:1.6,tone:5,pid:'z5'},{k:'compass',x:275,y:380,s:1.4,tone:1,pid:'z4'}]}
];
export const LOOKSCOPE=['Alle','Interior','Küche','Outdoor'];
export const V={alle:{l:'Für alle mit Link',i:'globe'},giver:{l:'Für alle mit Link',i:'globe'},privat:{l:'Privat',i:'lock'},nur:{l:'Nur für dich',i:'eye'}};
export const PRIO=['','Nice to have','Wichtig','Sehr wichtig'];
export const FB={love:'Genau mein Geschmack!',happy:'Darüber freue ich mich sehr.',meh:'Schön, aber nicht ganz meins.',have:'Bereits vorhanden.',swap:'Ich würde lieber etwas anderes daraus machen.'};

export const CATALOG=[
 {id:'k1',t:'Hochwertige Handkaffeemühle',p:89,c:'genuss',k:'ding',a:'grinder',tags:['kaffee'],kw:['mühle'],comp:'kaffeemaschine'},
 {id:'k2',t:'Barista-Set: Tamper und Milchkännchen',p:49,c:'genuss',k:'ding',a:'bottle',tags:['kaffee'],kw:['tamper'],comp:'siebträger'},
 {id:'k3',t:'Design-Kaffeegläser, 2er Set',p:28,c:'wohnen',k:'ding',a:'glasses',tags:['kaffee','wohnen'],kw:['kaffeegläser']},
 {id:'k4',t:'Kaffee-Tasting bei einem Röster',p:45,c:'genuss',k:'erlebnis',a:'mug',tags:['kaffee'],kw:['tasting']},
 {id:'k5',t:'Pour-over-Karaffe von Hario',p:39,c:'genuss',k:'ding',a:'bottle',tags:['kaffee'],kw:['karaffe'],brand:'Hario'},
 {id:'k6',t:'Kochbuch: Nordisch einfach',p:32,c:'buecher',k:'ding',a:'book',tags:['kochen','lesen'],kw:['nordisch']},
 {id:'k7',t:'Präzisionswaage für die Küche',p:34,c:'kochen',k:'ding',a:'scale',tags:['kochen'],kw:['waage']},
 {id:'k8',t:'Abziehstein für Küchenmesser',p:40,c:'kochen',k:'ding',a:'knife',tags:['kochen'],kw:['abziehstein']},
 {id:'k9',t:'Kräuter-Anzuchtset für die Fensterbank',p:24,c:'kochen',k:'ding',a:'plant',tags:['kochen','garten'],kw:['kräuterset']},
 {id:'k10',t:'Keramik-Schnupperkurs',p:65,c:'erlebnisse',k:'erlebnis',a:'vase',tags:['keramik','wohnen'],kw:['keramikkurs'],tr:'Keramik'},
 {id:'k11',t:'Leinen-Tischsets, 4er Set',p:36,c:'wohnen',k:'ding',a:'vase',tags:['wohnen','kochen'],kw:['tischset']},
 {id:'k12',t:'Handgeformte Steingut-Vase',p:42,c:'wohnen',k:'ding',a:'vase',tags:['wohnen'],kw:['vase']},
 {id:'k13',t:'Wanderkarte mit Kompass',p:24,c:'outdoor',k:'ding',a:'compass',tags:['wandern'],kw:['kompass']},
 {id:'k14',t:'Isolierte Trinkflasche',p:35,c:'outdoor',k:'ding',a:'bottle',tags:['wandern'],kw:['trinkflasche']},
 {id:'k15',t:'Wildkräuter-Wanderung mit Guide',p:58,c:'erlebnisse',k:'erlebnis',a:'mountain',tags:['wandern','kochen'],kw:['wildkräuter']},
 {id:'k16',t:'Merino-Buff',p:30,c:'outdoor',k:'ding',a:'sweater',tags:['wandern'],kw:['buff']},
 {id:'k17',t:'Clip-Leseleuchte fürs Buch',p:29,c:'buecher',k:'ding',a:'lamp',tags:['lesen'],kw:['leseleuchte']},
 {id:'k18',t:'Reisejournal aus Leder',p:39,c:'reisen',k:'ding',a:'journal',tags:['reisen','lesen'],kw:['reisejournal'],brand:'Leuchtturm1917'},
 {id:'k19',t:'Packwürfel-Set',p:26,c:'reisen',k:'ding',a:'suitcase',tags:['reisen'],kw:['packwürfel']},
 {id:'k20',t:'Pfannenwender aus Holz und Edelstahl',p:22,c:'kochen',k:'ding',a:'pan',tags:['kochen'],kw:['wender'],comp:'pfanne'},
 {id:'k21',t:'Japanisches Teeset',p:54,c:'genuss',k:'ding',a:'teapot',tags:['tee'],kw:['teeset']},
 {id:'k22',t:'Kooperatives Brettspiel',p:38,c:'wohnen',k:'ding',a:'game',tags:['spiele'],kw:['brettspiel']},
 {id:'k23',t:'Segel-Schnupperkurs am Wochenende',p:89,c:'erlebnisse',k:'erlebnis',a:'compass',tags:['segeln'],kw:['segelkurs'],tr:'Segeln'},
 {id:'k24',t:'Reiseführer Island',p:28,c:'reisen',k:'ding',a:'book',tags:['reisen','lesen'],kw:['reiseführer']},
 {id:'k25',t:'Offene Kopfhörer für Hörbuch und Musik',p:79,c:'technik',k:'ding',a:'headphones',tags:['musik','lesen'],kw:['kopfhörer']},
 {id:'c1',t:'Bausteine-Set aus Holz, 100 Teile',p:34,c:'spielen',k:'ding',a:'game',tags:['bauen'],kw:['bausteine']},
 {id:'c2',t:'Bastelset: Töpfern mit lufttrocknendem Ton',p:22,c:'spielen',k:'ding',a:'vase',tags:['basteln'],kw:['bastelset']},
 {id:'c3',t:'Bilderbuch-Sammlung zum Vorlesen',p:28,c:'buecher',k:'ding',a:'book',tags:['vorlesen'],kw:['bilderbuch']},
 {id:'c4',t:'Kinder-Fernglas für kleine Entdecker',p:25,c:'outdoor',k:'ding',a:'compass',tags:['draussen','tiere'],kw:['fernglas']},
 {id:'c5',t:'Kinder-Gartenset mit Mini-Werkzeug',p:24,c:'spielen',k:'ding',a:'plant',tags:['draussen','garten'],kw:['gartenset']},
 {id:'c6',t:'Tierpark-Besuch mit Patenschaftsurkunde',p:30,c:'erlebnisse',k:'erlebnis',a:'animals',tags:['tiere'],kw:['tierpark']}
];

export const OCCMAP={k1:['weihnachten','geburtstag'],k2:['weihnachten','geburtstag'],k3:['weihnachten','einzug','hochzeit'],k4:['geburtstag'],k5:['weihnachten'],k6:['weihnachten','geburtstag'],k7:['einzug'],k8:['danke'],k9:['einzug','danke'],k10:['geburtstag'],k11:['einzug','hochzeit','weihnachten'],k12:['einzug','hochzeit','danke'],k13:['geburtstag'],k14:['danke'],k15:['geburtstag'],k16:['weihnachten'],k17:['weihnachten','geburtstag'],k18:['weihnachten','geburtstag'],k19:['geburtstag'],k20:['danke','einzug'],k21:['weihnachten','hochzeit'],k22:['weihnachten','einzug'],k23:['geburtstag'],k24:['geburtstag'],k25:['weihnachten','geburtstag'],c1:['weihnachten','geburtstag'],c2:['geburtstag','weihnachten'],c3:['weihnachten','geburtstag'],c4:['geburtstag'],c5:['geburtstag','weihnachten'],c6:['geburtstag']};
CATALOG.forEach(i=>i.occ=OCCMAP[i.id]||[]);
/* Beispieldaten für Kategorie-Wünsche. Später: Produkt-Feed eines Partnernetzwerks. */
export const PRICE_DATE='November 2026';
export const PRODUCTS=[
 /* asin = Amazon.de-Produktseite.
    price = bei Amazon beobachteter Preis (Stand: PRICE_DATE), nur wo wirklich gesehen, sonst null.
    est = grobe Schätzung, nur für den Budget-Filter, wird nie als Preis angezeigt. q = Qualität 1-5. */
 {id:'p1',cat:'pfanne',attrs:['eisen'],search:'de Buyer Mineral B Element Eisenpfanne 28 cm',asin:'B07JJ5SDHG',t:'de Buyer Mineral B Element Eisenpfanne, 28 cm',brand:'de Buyer',est:70,price:69.79,q:5,a:'pan',tone:3,pros:['Schmiedeeisen, wird mit der Zeit von selbst antihaftend','Für Induktion und Backofen geeignet','Hält bei Pflege Jahrzehnte']},
 {id:'p2',cat:'pfanne',attrs:['beschichtet'],search:'Fissler Adamant Classic Bratpfanne 28 cm',asin:'B07HMVHC7Y',t:'Fissler Adamant Classic Bratpfanne, 28 cm',brand:'Fissler',est:85,price:83.41,q:4,a:'pan',tone:4,pros:['Beschichtet und pflegeleicht','Induktionsgeeignet','Made in Germany']},
 {id:'p3',cat:'pfanne',attrs:['guss'],search:'Lodge Gusseisen Pfanne 26 cm vorgebrannt',asin:'B07PJTDL7N',t:'Lodge Gusseisenpfanne, 26 cm',brand:'Lodge',est:50,price:null,q:4,a:'pan',tone:0,pros:['Robust und bereits eingebrannt','Ofenfest','Günstiger Einstieg in Gusseisen']},
 {id:'p4',cat:'pfanne',attrs:['guss','emailliert'],search:'Staub Bratpfanne Holzgriff 28 cm',asin:'B01EZAFYC4',t:'Staub Gusseisen-Bratpfanne, 28 cm',brand:'Staub',est:135,price:135.12,q:5,a:'pot',tone:2,pros:['Emaillierter Boden, kratzfest','Sehr gleichmäßige Hitze','30 Jahre Garantie']},
 {id:'p8',cat:'pfanne',attrs:['guss','emailliert'],search:'Le Creuset Signature Bratpfanne Holzgriff 28 cm',asin:'B09MZFSTZ9',t:'Le Creuset Signature Gusseisen-Bratpfanne, 28 cm',brand:'Le Creuset',est:160,price:null,q:5,a:'pan',tone:2,pros:['Emailliertes Gusseisen, hält ein Leben lang','Für alle Herdarten und den Backofen','Klassiker in vielen Farben']},
 {id:'p5',cat:'wasserkocher',attrs:['temperatur','schwanenhals','edelstahl'],search:'Fellow Stagg EKG Wasserkocher',asin:'B077JBQZPX',t:'Fellow Stagg EKG Wasserkocher',brand:'Fellow',est:190,price:null,q:5,a:'kettle',tone:3,pros:['Temperatur auf das Grad genau einstellbar','Schwanenhals für kontrolliertes Gießen','Hält die Temperatur bis 60 Minuten']},
 {id:'p6',cat:'wasserkocher',attrs:['schwanenhals','edelstahl'],search:'Bonavita Wasserkocher Schwanenhals 1 Liter',asin:'B005YR0IBU',t:'Bonavita Schwanenhals-Wasserkocher, 1 Liter',brand:'Bonavita',est:60,price:null,q:4,a:'kettle',tone:4,pros:['Schlankes Design aus Edelstahl','Präzises Gießen für Filterkaffee','Gutes Preis-Leistungs-Verhältnis']},
 {id:'p7',cat:'wasserkocher',attrs:['retro'],search:'Smeg Wasserkocher KLF03',asin:'B07RN84DSH',t:'Smeg Wasserkocher KLF03, schwarz',brand:'Smeg',est:115,price:null,q:3,a:'kettle',tone:5,pros:['Auffälliges Retro-Design','Automatische Abschaltung bei 100 °C','Mehrere Farben']},
 {id:'p9',cat:'bräter',attrs:['guss','emailliert'],search:'Le Creuset Signature Bräter rund 24 cm ofenrot',asin:'B00VA5H8AY',t:'Le Creuset Signature Bräter, rund, 24 cm',brand:'Le Creuset',est:250,price:null,q:5,a:'pot',tone:2,pros:['Emailliertes Gusseisen, 4,2 Liter','Für alle Herdarten und Induktion','Backofenfest, hält Jahrzehnte']}
 ,{id:'p10',cat:'mühle',attrs:['hand','keramik'],search:'Hario Skerton Pro Kaffeemühle Keramik',asin:'B01MXJI90S',t:'Hario Skerton Pro Handkaffeemühle mit Keramikmahlwerk',brand:'Hario',est:55,price:null,q:5,a:'grinder',tone:2,pros:['Keramik-Mahlwerk, Mahlgrad einstellbar','Fasst 100 g Bohnen','Handmühle für Filterkaffee und Espresso']},
 {id:'p11',cat:'messerset',search:'zayiko Kasshoku Damastmesser Set',asin:'B0771X3QWQ',t:'zayiko Kasshoku Damastmesser-Set, 3-teilig',brand:'zayiko',est:90,price:null,q:4,a:'knife',tone:4,pros:['Japanischer Damaststahl mit VG10-Kern','Santoku, kleines Santoku und Officemesser','Mit Geschenkbox']},
 {id:'p12',cat:'wanderstöcke',search:'Black Diamond Distance Carbon Z Wanderstöcke',asin:'B0DYNLGC7H',t:'Black Diamond Distance Carbon Z Wanderstöcke',brand:'Black Diamond',est:130,price:128.8,q:5,a:'sticks',tone:1,pros:['Carbon, besonders leicht','Faltbar, passt in jeden Rucksack','Entlastet die Knie bergab']}
];

/* Kurzvorstellung für die Profilseite (Beispieldaten). */
export const ABOUT={
  jonas:'Jonas ist 34, arbeitet als Produktdesigner und kocht am liebsten für Freunde. Seinen Kaffee brüht er selbst und seine Wohnung richtet er Stück für Stück ein, am liebsten mit wenigen, guten Dingen.',
  mira:'Mira ist 31 und plant jedes freie Wochenende eine Tour in die Berge. Sie packt leicht, liest unterwegs viel und freut sich über Dinge, die lange halten.',
  noah:'Noah ist 5 und baut am liebsten riesige Türme. Er liebt Tiere, vor allem Ponys, und ist am liebsten draußen unterwegs.'
};
