import { S, initials } from '../state.js';
import { esc, ic } from '../lib/util.js';
import { art } from '../lib/art.js';
import { ACT, CATS, BRANDS, TRIES, NOGOS, ALTS, KID_CATS, KID_OPTS, cat, crea } from '../data/content.js';
import { VisPill, Legend } from './shared.js';
import { GuestPage } from './giver.js';
import { ViewSeg, PreviewBanner } from './wishes.js';
import { completeness } from '../lib/tale.js';
import { AppPromo } from './inspiration.js';

export const STEPS=[
 {k:'interests',t:'Was machst du in deiner freien Zeit am liebsten?',h:'Such dir aus, was zu deinem Alltag passt. Daran erkennen wir später, über welche Geschenke du dich wirklich freuen würdest.',opts:()=>ACT.map(a=>a.l)},
 {k:'cats',t:'In welchen Welten fühlst du dich zuhause?',h:'Tippe auf die Bereiche, die zu dir passen. Du kannst später jederzeit etwas ergänzen oder wieder wegnehmen.',tiles:true},
 {k:'brands',t:'Gibt es Marken, bei denen du gern stöberst?',h:'Das hilft uns, Vorschläge zu finden, die zu deinem Geschmack passen. Wenn dir gerade keine einfällt, ist das auch völlig in Ordnung.',opts:()=>BRANDS},
 {k:'tries',t:'Was würdest du gern einmal ausprobieren?',h:'Vielleicht einen Kurs, ein Wochenende oder etwas ganz Neues? Gerade dafür lassen sich schöne Erlebnisse verschenken.',opts:()=>TRIES},
 {k:'nogos',t:'Gibt es etwas, das du lieber nicht geschenkt bekommen möchtest?',h:'Das sehen nur Menschen, die dir etwas schenken wollen. So ersparst du ihnen und dir manche Enttäuschung.',opts:()=>NOGOS},
 {k:'alts',t:'Und wenn deinen Freunden gar nichts einfällt?',h:'Dann freuen sie sich vielleicht über einen Gutschein, einen Besuch in deinem Lieblingsladen oder eine Spende. Sag uns, was dir davon gefallen würde.',opts:()=>ALTS}
];
/* Auswahl zu einem Thema (Interessen, Welten, Marken …). Wird in der Einrichtung und direkt im Profil genutzt. */
export function Picker(st){
  let body='';
  if(st.tiles){
    body=`<div class="tiles">${CATS.filter(c=>!S.me.managed||KID_CATS.includes(c.id)).map(c=>{const on=S.me.cats.includes(c.id);return `<button class="tile ${on?'on':''}" data-act="pick" data-k="cats" data-v="${c.id}" aria-pressed="${on}">${art(c.a,c.t)}<span>${c.n}<i class="tick">${ic('check','sm')}</i></span></button>`}).join('')}</div>`;
  }else{
    const list=[...new Set([...(S.me.managed&&KID_OPTS[st.k]?KID_OPTS[st.k]:st.opts()),...S.me[st.k]])];
    body=`<div class="opts">${list.map(o=>{const on=S.me[st.k].includes(o);return `<button class="opt ${on?'on':''}" data-act="pick" data-k="${st.k}" data-v="${esc(o)}" aria-pressed="${on}">${esc(o)}</button>`}).join('')}</div>
    <form data-form="custom" class="addrow"><input type="hidden" name="k" value="${st.k}"><label class="sr" for="cust" style="position:absolute;left:-9999px">Eigene Angabe</label><input id="cust" name="v" class="inp" placeholder="Fehlt etwas? Schreib es einfach dazu" autocomplete="off"><button class="btn sec sm" type="submit">${ic('plus','sm')}Hinzufügen</button></form>`;
  }
  return body;
}
const NAME_STEP={k:'name',t:'Wie dürfen wir dich nennen?',h:'Dein Vorname reicht völlig. So begrüßen wir dich in deinem Wishtale und deine Freunde sehen später, bei wem sie gerade stöbern.',name:true};
const CHOICE_STEP={k:'choice',t:'Wie möchtest du starten?',h:'Beides ist in Ordnung, und du kannst jederzeit zwischen den Wegen wechseln.',choice:true};
/* Ohne Konto beginnt die Einrichtung mit dem Namen, das Konto kommt erst am Ende. Danach darf man wählen: gleich Wünsche aufschreiben oder erst das Profil einrichten. */
const kidText=st=>{const n=esc(S.me.name||'das Kind');const T={
 interests:{t:`Was spielt und macht ${n} am liebsten?`,h:'Such aus, was zu eurem Alltag passt. Daran erkennen wir, welche Geschenke zum Alter passen und Freude machen.'},
 cats:{t:`In welchen Welten ist ${n} zuhause?`,h:'Tippt auf die Bereiche, die zu passen. Das lässt sich jederzeit ändern.'},
 brands:{t:`Welche Marken und Spielwelten mag ${n}?`,h:'Zum Beispiel LEGO, Playmobil oder SIKU. Wenn euch gerade nichts einfällt, ist das auch in Ordnung.'},
 tries:{t:`Was würde ${n} gern einmal ausprobieren?`,h:'Ein Ausflug, ein Kurs oder etwas ganz Neues? Dafür lassen sich schöne Erlebnisse verschenken.'},
 nogos:{t:`Was soll ${n} lieber nicht geschenkt bekommen?`,h:'Das sehen nur Menschen, die etwas schenken wollen. So bleiben Enttäuschungen aus.'},
 alts:{t:'Und wenn den Schenkenden gar nichts einfällt?',h:`Dann freut sich ${n} vielleicht über einen Gutschein oder einen gemeinsamen Ausflug.`},
};return T[st.k]||{t:st.t,h:st.h}};
export const steps=()=>S.auth.user?[CHOICE_STEP,...STEPS]:[NAME_STEP,CHOICE_STEP,...STEPS];
export function Start(){
  const list0=steps(),anon=!S.auth.user;
  S.ui.step=Math.max(0,Math.min(S.ui.step,list0.length-1));
  const i=S.ui.step,st=list0[i],last=i===list0.length-1;
  let body='';
  if(st.name){
    body=`<form data-form="draftname" class="addrow" style="margin-top:22px"><label class="sr" for="dn" style="position:absolute;left:-9999px">Dein Vorname</label><input id="dn" class="inp" data-prof="name" value="${esc(S.me.name)}" maxlength="60" placeholder="Zum Beispiel Lena" autocomplete="given-name"></form>`;
  }else if(st.choice){
    body=`<div class="choices">
     <button class="choice" data-act="quick"><b>Direkt Wünsche aufschreiben</b><span>In einer Minute steht deine erste Wunschliste. Dein Profil kannst du jederzeit später ergänzen.</span></button>
     <button class="choice main" data-act="next"><span class="pill ok">Empfohlen</span><b>Erst mein Profil einrichten</b><span>Mit deinen Interessen, Lieblingsmarken und dem, was du schon hast, passen die Vorschläge für deine Freunde viel besser. Das dauert etwa zwei Minuten.</span></button></div>`;
  }else body=Picker(st);
  return `<div class="wrap"><div class="ob">
   <div class="prog" role="img" aria-label="Schritt ${i+1} von ${list0.length}">${list0.map((_,j)=>`<i class="${j<=i?'on':''}"></i>`).join('')}</div>
   <p class="eyebrow">Dein Wishtale · ${i+1} von ${list0.length}</p>
   ${S.me.managed?`<div class="banner green" style="margin-top:10px">${ic('user')}<span>Du richtest gerade das Profil für ${esc(S.me.name)} ein. Am schönsten wird es, wenn ihr es zusammen macht.</span></div>`:''}
   <h1>${S.me.managed?kidText(st).t:st.t}</h1><p class="muted" style="font-size:17px">${S.me.managed?kidText(st).h:st.h}</p>
   ${body}
   <div class="obnav">${i?`<button class="btn ghost" data-act="prev">${ic('back','sm')}Zurück</button>`:anon?`<a class="btn ghost" href="../">${ic('back','sm')}Zur Startseite</a>`:`<button class="btn ghost" data-act="go" data-v="profil">${ic('back','sm')}Abbrechen</button>`}
   ${st.choice?'':`<button class="btn pri" data-act="${last?'finish':'next'}">${last?(anon?'Fertig, weiter zu meinem Konto':'Fertig, zeig mir mein Profil'):'Weiter'} ${ic('arrow','sm')}</button>`}</div>
  </div></div>`;
}

/* ---- Profile ---- */
export function MgPanel(m){return `<section class="panel" style="margin-top:16px;display:grid;gap:10px"><div class="row" style="justify-content:space-between"><h3 aria-level="2" style="font-size:24px">Kind-Konto</h3><span class="pill">${ic('lock','sm')}Nur auf Einladung</span></div>
 <p class="muted" style="font-size:15px">Du pflegst Profil, Wünsche und Feedback für ${esc(m.name)}. Du siehst, was reserviert oder gekauft ist, damit nichts doppelt ankommt. ${esc(m.name)} bekommt davon nichts mit, damit die Überraschung bleibt.</p>
 <div class="chips">${m.invited.map(x=>`<span class="chip ok">${ic('check','sm')}${esc(x)}</span>`).join('')||'<span class="muted" style="font-size:14px">Noch niemand eingeladen.</span>'}</div>
 <div class="fld"><label for="mbd">Geburtsdatum</label><input id="mbd" class="inp" type="date" data-prof="birthdate" value="${esc(m.birthdate||'')}" max="${new Date().toISOString().slice(0,10)}" style="max-width:240px"><span class="muted" style="font-size:13px">${m.birthdate&&m.age!=null?`${esc(m.name)} ist ${m.age} Jahre alt. Deine Freunde sehen nur das Alter.`:`Damit passen Vorschläge zum Alter von ${esc(m.name)}. Deine Freunde sehen nur das Alter.`}</span></div>
 <div class="fld"><label for="msz">Aktuelle Kleidergröße <span class="muted" style="font-weight:400">(optional, aber empfohlen)</span></label><input id="msz" class="inp" data-prof="size" value="${esc(m.size||'')}" maxlength="20" placeholder="z. B. 104 oder Schuhgröße 28" style="max-width:320px"><span class="muted" style="font-size:13px">Kinder wachsen schnell: Trag hier die aktuelle Größe ein, dann passen Kleidung und Schuhe.</span></div>
 <div class="row"><button class="btn sec sm" data-act="invite">${ic('plus','sm')}Person einladen</button></div>
 <p class="disc" style="margin:0">Wir speichern den Vornamen, das Geburtsdatum und die Kleidergröße, keine Fotos und keinen Nachnamen. Das Profil sehen nur Menschen, die du eingeladen hast.</p></section>`}
export function Profil(){
  const m=S.me,pv=S.ui.preview;
  const sec=(k,title,inner)=>{
    const vk=m.vis[k]||'giver';
    if(pv&&vk==='privat')return '';
    const st=STEPS.find(x=>x.k===k),ed=!pv&&st&&S.ui.editK===k;
    const btn=!pv&&st?`<button class="linkbtn" data-act="pedit" data-k="${k}">${ed?'Fertig':'Ändern'}</button>`:'';
    return `<section class="psec"><div class="hd"><h3 aria-level="2">${title}</h3><span class="row" style="gap:10px">${btn}${VisPill(vk,pv?null:k)}</span></div>${ed?Picker(st):inner}</section>`;
  };
  const chips=(a,cls='')=>a.length?`<div class="chips">${a.map(x=>`<span class="chip ${cls}">${esc(x)}</span>`).join('')}</div>`:'<p class="muted">Noch nichts hinterlegt.</p>';
  const line=`${esc(m.name)} ${m.interests.length?`liebt ${m.interests.slice(0,3).map(esc).join(', ')}`:'hat noch keine Interessen hinterlegt'}. ${m.nogos.length?`Lieber nichts mit ${m.nogos.slice(0,2).map(esc).join(' oder ')}.`:''} ${m.alts.length?`Wenn die Idee fehlt: ${esc(m.alts[0])}.`:''}`;
  return `<div class="wrap">
   ${pv?'':AppPromo()}
   ${pv?'':`   <div class="pcard"><span class="av t${m.tone}">${initials(m.name)}</span>
    <div><p class="eyebrow" style="color:#B8C4A8">Wishtale</p><h1>${esc(m.name)}</h1><p style="margin-top:8px">${m.about&&m.about.trim()?esc(m.about):line}</p>${m.about&&m.about.trim()?'':`<a class="linkbtn" href="#about" data-act="focusabout" style="color:var(--accent-ink);margin-top:6px;display:inline-block">Ein paar Sätze über dich schreiben</a>`}</div>
    <div class="row" style="gap:8px"><button class="btn gold sm" data-act="share">Link teilen</button>${S.auth.user&&!m.managed?`<button class="btn sec sm" style="border-color:var(--accent-ink);color:var(--accent-ink)" data-act="inviteopen">Jemanden einladen</button>`:''}${m.handle?`<a class="btn sec sm" style="border-color:var(--accent-ink);color:var(--accent-ink)" href="#p/${m.handle}" target="_blank" rel="noopener">Als Gast ansehen</a>`:''}</div></div>`}
   <div class="row" style="margin:18px 0 4px;justify-content:space-between">
     ${ViewSeg()}
   </div>
   ${pv?PreviewBanner():`<p class="muted" style="font-size:14px;margin-top:8px">Du entscheidest selbst, wer was sieht. Tippe einfach auf die Sichtbarkeit neben einem Bereich, um sie zu ändern.</p>`}
   ${pv?GuestPage(m,{preview:true}):`
   ${Meter(m)}
   ${m.managed?MgPanel(m):''}
   ${AboutSec(m)}
   ${sec('interests','Interessen',chips(m.interests))}
   ${sec('cats','Welten',`<div class="catrow">${m.cats.map(id=>{const c=cat(id);return `<button class="catmini" data-act="world" data-id="${c.id}" data-ctx="own" aria-label="Welt ${c.n} öffnen">${art(c.a,c.t)}<div>${c.n}</div></button>`}).join('')||'<p class="muted">Noch nichts hinterlegt.</p>'}</div>`)}
   ${(m.style||[]).length?sec('style','Im Notfall',`<div class="chips">${m.style.map(x=>`<button class="chip gold" data-act="creator" data-id="${x.id}" data-go="1">${esc(crea(x.id).scope)} von ${esc(crea(x.id).handle)}</button>`).join('')}</div><p class="muted" style="font-size:14px">Wenn deinen Freunden nichts Konkretes einfällt, können sie sich an diesen Listen orientieren.</p>`):''}
   ${sec('brands','Lieblingsmarken',chips(m.brands))}
   ${sec('tries','Möchte ich ausprobieren',chips(m.tries,'gold'))}
   ${sec('nogos','Bitte nicht',chips(m.nogos,'warn'))}
   ${sec('alts','Alternativen, wenn keine Idee passt',chips(m.alts,'ok'))}
   ${OwnedSec(m)}
   ${SocialSec(m)}
   <section class="psec"><div class="hd"><h3 aria-level="2">Dein Feedback</h3>${VisPill('nur')}</div><p class="muted">Wie dir ein Geschenk wirklich gefallen hat, bleibt unter uns. Wer dir etwas geschenkt hat, bekommt höchstens eine freundliche Nachricht.</p></section>
   ${Legend()}`}
  </div>`;
}

function AboutSec(m){
  return `<section class="psec"><div class="hd"><h3 aria-level="2">Über mich</h3>${VisPill('alle')}</div>
   ${m.managed?'':`<div class="fld"><label for="pname">Dein Vorname</label><input id="pname" class="inp" data-prof="name" value="${esc(m.name)}" maxlength="60" autocomplete="given-name"></div>`}
   <label for="about" class="muted" style="font-size:14px">Erzähl in ein paar Sätzen etwas über dich. Deine Freunde lesen das als Erstes, wenn sie etwas für dich suchen, und bekommen so ein Gefühl dafür, was dir gefällt.</label>
   <textarea id="about" class="ta" data-prof="about" maxlength="320" placeholder="z. B. Ich koche gern für Freunde, trinke meinen Kaffee selbst gebrüht und richte meine Wohnung Stück für Stück ein.">${esc(m.about||'')}</textarea></section>`;
}

/* Wie gut kennen wir dich? Je mehr im Profil steht, desto besser die Vorschläge. */
function Meter(m){
  const c=completeness(m);
  return `<section class="meter" aria-label="Wie gut kennen wir dich"><div class="row" style="justify-content:space-between;gap:10px"><strong>Dein Wishtale ist zu ${c.pct} % fertig</strong><span class="muted" style="font-size:13px">${c.pct>=80?'Das sieht richtig gut aus':c.pct>=50?'Ein schöner Anfang':'Da geht noch einiges'}</span></div>
   <div class="bar" role="progressbar" aria-label="Fortschritt deines Wishtale" aria-valuenow="${c.pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${c.pct}%"></i></div>
   <p class="muted" style="font-size:13.5px">Je besser wir dich kennen, desto treffender können wir deinen Freunden passende Ideen zeigen.${c.next.length?` Ein guter nächster Schritt: <b>${esc(c.next[0])}</b>`:''}</p></section>`;
}

/* Produkte, die man schon hat. Sie fließen in die Empfehlungen ein, damit nichts doppelt gekauft wird. */
function OwnedSec(m){
  const owned=m.wishes.filter(w=>w.status==='selbst');
  return `<section class="psec"><div class="hd"><h3 aria-level="2">Das habe ich schon</h3>${VisPill('alle')}</div>
   <p class="muted" style="font-size:14px">Was steht bei dir zu Hause schon im Schrank? Trag es hier ein, zum Beispiel eine Siebträgermaschine. Dann schlagen wir dir und deinen Freunden nichts vor, was du bereits hast.</p>
   ${owned.length?`<div class="chips">${owned.map(w=>`<span class="chip ok">${esc(w.t)}<button class="chipx" data-act="ownedel" data-id="${w.id}" aria-label="${esc(w.t)} entfernen">×</button></span>`).join('')}</div>`:''}
   <form data-form="owned" class="addrow"><label for="ownedt" style="position:absolute;left:-9999px">Was hast du schon?</label><input id="ownedt" name="t" class="inp" placeholder="z. B. Siebträgermaschine, Wanderrucksack" autocomplete="off" maxlength="120"><button class="btn sec sm" type="submit">${ic('plus','sm')}Hinzufügen</button></form></section>`;
}

/* Pinterest und Instagram verlinken. Freunde sehen auf der Profilseite, was dich inspiriert. */
function SocialSec(m){
  const s=m.social||{};
  return `<section class="psec"><div class="hd"><h3 aria-level="2">Was dich inspiriert</h3>${VisPill((m.vis&&m.vis.social)||'giver','social')}</div>
   <p class="muted" style="font-size:14px">Wenn du magst, verlinkst du hier dein Pinterest oder dein Instagram. Deine Freunde können sich dort umsehen und bekommen ein Gefühl für deinen Geschmack, ohne selbst ein Konto zu brauchen. Bei Pinterest zeigen wir ihnen deine Pins sogar direkt hier an.</p>
   <form data-form="social" class="authform">
    <div class="fld"><label for="sp">Pinterest (dein Profil oder ein Board)</label><input id="sp" name="pinterest" class="inp" inputmode="url" autocomplete="off" placeholder="z. B. pinterest.de/dein-name/kaffee-ecke" value="${esc(s.pinterest||'')}"></div>
    <div class="fld"><label for="si">Instagram (dein Name)</label><input id="si" name="instagram" class="inp" autocomplete="off" placeholder="@dein-name" value="${esc(s.instagram||'')}"></div>
    <p class="hint" style="margin:0">Wird gespeichert, sobald du das Feld verlässt, wie alles andere im Profil.</p>
   </form>
   <p class="disc" style="margin:0">Pins werden erst angezeigt, wenn deine Freunde dem Laden der Pinterest-Inhalte zustimmen. Einen Instagram-Kanal können wir nur verlinken, weil Instagram keine Einbettung ganzer Profile erlaubt.</p></section>`;
}
