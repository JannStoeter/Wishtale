import { nid, kwOf } from './lib/util.js';

export const W=(o)=>{const w=Object.assign({id:nid('w'),kind:'produkt',prio:2,link:'',note:'',status:'offen',vis:'alle',res:null,bought:false,tone:0,img:null,occ:[],budget:null},o,{kw:o.kw||kwOf(o.t)});if(w.kind==='kategorie'&&!w.budget){const m=/bis\s*(\d+)/i.exec(w.t);if(m)w.budget=+m[1]}return w};
export const S={
 auth:{user:null,demo:false,sync:'idle',syncError:'',error:''},
 guest:null,
 promo:null,
 plan:null,
 given:[],
 me:{
  id:'me',name:'Lena',tone:2,
  interests:['Lesen','Wandern','Kochen'],cats:['buecher','outdoor','kochen','wohnen'],
  brands:['Patagonia','Le Creuset','Aesop','Leuchtturm1917'],tries:['Keramikkurs','Segeln'],style:[],
  nogos:['Duftkerzen','Socken','Deko-Kitsch'],alts:['Buchhandlung vor Ort','Wunschgutschein','IKEA-Gutschein','Spende: Naturschutz'],
  vis:{interests:'alle',cats:'alle',brands:'alle',tries:'giver',nogos:'giver',alts:'giver'},
  wishes:[
   W({id:'m1',t:'Le Creuset Bräter, 24 cm',c:'kochen',prio:3,occ:['weihnachten'],a:'pot',tone:2,note:'Gerne in Vulkanrot oder Grau.',link:'lecreuset.de',res:'other',kw:['bräter']}),
   W({id:'m2',t:'Merino-Pullover, naturweiß',c:'mode',prio:2,a:'sweater',tone:0,note:'Größe M, gern ohne Logo.',kw:['pullover']}),
   W({id:'m3',t:'Ultraleichte Wanderstöcke',c:'outdoor',prio:2,a:'sticks',tone:1,link:'',kw:['wanderstöcke','stöcke']}),
   W({id:'m4',t:'Ein Wochenende in den Bergen',c:'erlebnisse',kind:'erlebnis',prio:3,occ:['geburtstag'],a:'mountain',tone:5,note:'Hütte, Ruhe, keine Pläne.',kw:['wochenende']}),
   W({id:'m5',t:'Keramik-Schnupperkurs',c:'erlebnisse',kind:'erlebnis',prio:2,a:'vase',tone:2,kw:['keramikkurs']}),
   W({id:'m6',t:'Etwas Schönes für den Balkon',c:'wohnen',kind:'frei',prio:1,a:'plant',tone:1,note:'Überrasch mich. Pflanzen oder Licht.',kw:['balkon']}),
   W({id:'m7',t:'Leseleuchte fürs Bett',c:'wohnen',prio:1,a:'lamp',tone:4,status:'selbst',kw:['leseleuchte']})
  ],
  history:[
   {id:'h1',what:'Notizbuch Leuchtturm1917',from:'Mama',when:'Dezember 2025',liked:'ja',have:true,again:true,a:'journal',tone:3,kw:['notizbuch']},
   {id:'h2',what:'Kerzen-Set „Winterwald“',from:'Kollegin Anja',when:'Dezember 2025',liked:'nein',have:false,again:false,a:'lamp',tone:0,kw:['kerzen']},
   {id:'h3',what:'Gutschein Buchhandlung',from:'Paul',when:'Juni 2026',liked:'ja',have:false,again:true,a:'book',tone:1,kw:['gutschein']}
  ],
  inbox:[
   {id:'i1',what:'Duftkerzen-Set „Zedernholz“',from:'Tante Karin',when:'vor 3 Tagen',a:'lamp',tone:0,kw:['duftkerzen']},
   {id:'i2',what:'Wanderstrümpfe aus Merino',from:'Paul',when:'vor einer Woche',a:'sweater',tone:1,kw:['wanderstrümpfe']}
  ]
 },
 people:{
  jonas:{id:'jonas',name:'Jonas',tone:5,
   interests:['Kaffee brühen','Kochen','Einrichten'],cats:['genuss','kochen','wohnen'],brands:['Hario','Stelton','Fellow','Muji'],
   tries:['Kochkurs','Keramikkurs'],style:[],nogos:['Duftkerzen','Krimskrams'],alts:['Lokaler Kaffeeröster','Wunschgutschein','IKEA-Gutschein','Spende: Tierschutz'],
   wishes:[
    W({id:'j1',t:'Hochwertige Kaffeemühle',c:'genuss',prio:3,a:'grinder',tone:2,note:'Handmühle, gern mit Keramik-Mahlwerk.',kw:['mühle'],res:'other'}),
    W({id:'j2',t:'Wochenend-Kochkurs: frische Pasta',c:'erlebnisse',kind:'erlebnis',prio:2,occ:['geburtstag'],a:'cooking',tone:5,kw:['kochkurs']}),
    W({id:'j3',t:'Japanisches Messerset',c:'kochen',prio:2,occ:['weihnachten'],a:'knife',tone:4,kw:['messerset','messer']}),
    W({id:'j4',t:'Etwas Schönes für das Flurregal',c:'wohnen',kind:'frei',prio:1,a:'vase',tone:0,note:'Keine Deko-Klischees, eher Material und Form.',kw:['flurregal']}),
    W({id:'j5',t:'Siebträgermaschine',c:'genuss',a:'mug',tone:3,status:'selbst',kw:['siebträger','kaffeemaschine','espressomaschine']}),
    W({id:'j6',t:'Gusseisenpfanne',c:'kochen',a:'pan',tone:3,status:'selbst',kw:['pfanne']}),
    W({id:'j7',t:'Pastamaschine',c:'kochen',a:'scale',tone:4,status:'selbst',kw:['pastamaschine']}),
    W({id:'j8',t:'Hochwertiger Wasserkocher mit Temperaturwahl bis 180 €',c:'kochen',kind:'kategorie',prio:2,a:'pot',tone:0,note:'Gern schlicht, ohne Schnickschnack.',occ:['weihnachten']})
   ],
   gifts:[
    {id:'g1',what:'Kochbuch „Ottolenghi Simple“',from:'Oma',when:'2025',liked:'ja',a:'book',tone:2,kw:['ottolenghi']},
    {id:'g2',what:'Weinglas-Set',from:'Familie',when:'2024',liked:'ja',a:'glasses',tone:0,kw:['weingläser']},
    {id:'g3',what:'Duftkerzen-Set',from:'Kollegin',when:'2025',liked:'nein',a:'lamp',tone:0,kw:['duftkerzen']}
   ]},
  mira:{id:'mira',name:'Mira',tone:1,
   interests:['Wandern','Lesen','Reisen planen'],cats:['outdoor','buecher','reisen'],brands:['Fjällräven','Moleskine'],
   tries:['Tauchen','Segeln'],style:[{id:'hanna'}],nogos:['Deko-Kitsch'],alts:['Buchhandlung vor Ort','Wunschgutschein','Reise-Gutschein'],
   wishes:[
    W({id:'r1',t:'Leichte Daunenjacke',c:'outdoor',prio:3,a:'sweater',tone:1,kw:['daunenjacke']}),
    W({id:'r2',t:'Wanderstöcke, ultraleicht',c:'outdoor',prio:2,a:'sticks',tone:4,kw:['wanderstöcke','stöcke'],res:'other'}),
    W({id:'r3',t:'Ein Wochenende auf einer Berghütte',c:'erlebnisse',kind:'erlebnis',prio:2,a:'mountain',tone:5,kw:['berghütte']}),
    W({id:'r4',t:'Trekkingsandalen',c:'outdoor',a:'sneaker',tone:0,status:'selbst',kw:['trekkingsandalen','sandalen']}),
    W({id:'r5',t:'Rucksack, 40 Liter',c:'outdoor',a:'bag',tone:2,status:'selbst',kw:['rucksack']}),
    W({id:'r6',t:'Hochwertige Pfanne bis 100 €',c:'kochen',kind:'kategorie',prio:2,a:'pan',tone:2,note:'Für den Alltag, gern etwas für viele Jahre.',occ:['weihnachten','geburtstag']})
   ],
   gifts:[{id:'g4',what:'Reiseführer Norwegen',from:'Lena',when:'2025',liked:'ja',a:'book',tone:3,kw:['reiseführer']}]},
  noah:{id:'noah',name:'Noah',age:5,managed:true,parent:'Mira',tone:0,
   interests:['Bauen & Konstruieren','Draußen spielen','Tiere'],cats:['spielen','outdoor'],brands:[],tries:['Reiten'],nogos:['Laute Spielzeuge'],alts:['Tierpark-Eintritt','Buchhandlung vor Ort'],
   wishes:[
    W({id:'n1',t:'Großes Bausteine-Set',c:'spielen',prio:3,a:'game',tone:5,occ:['weihnachten'],note:'Holz oder Bio-Kunststoff, gern viele Teile.'}),
    W({id:'n2',t:'Ein Tag im Tierpark',c:'erlebnisse',kind:'erlebnis',prio:2,a:'animals',tone:1,occ:['geburtstag'],kw:['tierpark']}),
    W({id:'n3',t:'Gummistiefel',c:'outdoor',a:'sneaker',tone:2,status:'selbst',kw:['gummistiefel']})
   ],gifts:[]}
 },
 ui:{creator:null,acct:'me',occ:'weihnachten',big:false,pickId:null,view:'home',step:0,person:'jonas',tab:'wuensche',wf:'offen',wc:'alle',preview:false,modal:null,swap:null,swapSel:[],idea:'',ideaRes:null,kind:'alle',budget:100,saved:{},chosen:{},wishCtx:'guest'}
};
export const initials=n=>n.slice(0,1).toUpperCase();
S.accounts={me:S.me};delete S.me;
Object.defineProperty(S,'me',{get(){return S.accounts[S.ui.acct]},enumerable:true});
S.accounts.emma={id:'emma',name:'Emma',age:6,managed:true,tone:1,invited:['Oma','Opa','Tante Karin'],
 interests:['Malen & Basteln','Tiere','Draußen spielen'],cats:['spielen','buecher','outdoor'],brands:[],tries:['Reiten'],
 nogos:['Laute Spielzeuge','Süßigkeiten'],alts:['Buchhandlung vor Ort','Tierpark-Eintritt','Spende: Tierschutz'],
 vis:{interests:'giver',cats:'giver',brands:'giver',tries:'giver',nogos:'giver',alts:'giver'},
 wishes:[
  W({id:'e1',t:'Bausteine-Set aus Holz',c:'spielen',prio:3,a:'game',tone:5,occ:['weihnachten'],res:'other',kw:['bausteine']}),
  W({id:'e2',t:'Einen Tag auf dem Reiterhof',c:'erlebnisse',kind:'erlebnis',prio:3,a:'animals',tone:2,occ:['geburtstag'],res:'other',bought:true,note:'Ponys streicheln und füttern.',kw:['reiterhof']}),
  W({id:'e3',t:'Bilderbuch mit Tieren',c:'buecher',prio:2,a:'book',tone:3,kw:['bilderbuch']}),
  W({id:'e4',t:'Rucksack für die Kita',c:'mode',a:'bag',tone:0,status:'selbst',kw:['rucksack']})
 ],
 history:[{id:'h4',what:'Holzpuzzle Tierwelt',from:'Oma',when:'Mai 2026',liked:'ja',have:true,again:true,a:'game',tone:5,kw:['holzpuzzle']}],
 inbox:[{id:'i3',what:'Plüsch-Dino, laut brüllend',from:'Onkel Tom',when:'vor 2 Tagen',a:'plant',tone:1,kw:['plüsch']}]};
export function switchTo(id){const u=S.ui;u.acct=id;u.wf='offen';u.wc='alle';u.preview=false;u.swap=null;u.swapSel=[];u.modal=null}

/* ============ Persistenz (localStorage) ============ */
const KEY='wishtale:v1';
const PERSIST_UI=['acct','occ','person','big','budget','saved','cf','onlyOpen','chosen'];
const DRAFT_KEY='wishtale:draft';

/* ---- Entwurf: Wer ohne Konto sein Wishtale einrichtet, arbeitet in einem eigenen Entwurf (nie in den Demo-Daten). ---- */
export const blankDraft=()=>({id:'draft',name:'',tone:2,interests:[],cats:[],brands:[],tries:[],nogos:[],alts:[],style:[],
 vis:{interests:'giver',cats:'giver',brands:'giver',tries:'giver',nogos:'giver',alts:'giver'},wishes:[],history:[],inbox:[],invited:[],about:''});
export const draftHasData=()=>{const d=S.accounts.draft;return !!d&&(d.interests.length+d.cats.length+d.brands.length+d.tries.length+d.nogos.length+d.alts.length>0||!!d.name)};
export function ensureDraft(){
  if(!S.accounts.draft){
    let d=null;
    try{d=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null')}catch{}
    S.accounts.draft=d&&Array.isArray(d.interests)?{...blankDraft(),...d,id:'draft'}:blankDraft();
  }
  return S.accounts.draft;
}
export function clearDraft(){delete S.accounts.draft;try{localStorage.removeItem(DRAFT_KEY)}catch{}if(S.ui.acct==='draft')S.ui.acct='me'}
export function setDemo(on){S.auth.demo=on;try{on?sessionStorage.setItem('wishtale:demo','1'):sessionStorage.removeItem('wishtale:demo')}catch{}}

export function loadState(){
  try{S.auth.demo=sessionStorage.getItem('wishtale:demo')==='1'}catch{}
  try{
    const d=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('giftly:v1')||'null'); // alter Schlüssel: Daten aus der Zeit vor der Umbenennung übernehmen
    if(!d)return;
    if(d.accounts&&d.accounts.me)S.accounts=d.accounts;
    if(d.people&&Object.keys(d.people).length)S.people=d.people;
    PERSIST_UI.forEach(k=>{if(d.ui&&k in d.ui)S.ui[k]=d.ui[k]});
    delete S.accounts.draft;
    if(!S.accounts[S.ui.acct]||S.ui.acct==='draft')S.ui.acct='me';
  }catch{/* defekte oder blockierte Speicherung: mit Beispieldaten starten */}
}
export function saveState(){
  if(S.auth.user)return; // angemeldet: Quelle der Wahrheit ist Supabase
  try{
    const {draft,...accounts}=S.accounts;
    if(draft&&draftHasData())localStorage.setItem(DRAFT_KEY,JSON.stringify(draft));
    const ui=Object.fromEntries(PERSIST_UI.map(k=>[k,S.ui[k]]));
    if(ui.acct==='draft')ui.acct='me';
    localStorage.setItem(KEY,JSON.stringify({accounts,people:S.people,ui}));
  }catch{/* Speicher voll (z. B. große Bilder) oder nicht verfügbar */}
}
export function resetState(){
  try{localStorage.removeItem(KEY)}catch{}
  location.hash='#profil';location.reload();
}

/** Person, deren Profil gerade als Gast geöffnet ist (Beispielprofile oder ein Konto aus diesem Browser). */
export const guestPerson=()=>(S.guest&&S.guest.handle===S.ui.person&&S.guest.person)||S.people[S.ui.person]||null;
