import { ZettelModal } from './zettel.js';
import { WelcomeModal } from './welcome.js';
import { InviteModal } from './invite.js';
import { AboutModal } from './about.js';
import { TourModal } from './tour.js';
import { WishRec } from './wishprev.js';
import { imgBoxHtml } from '../lib/wishimg.js';
import { S, initials } from '../state.js';
import { esc, ic } from '../lib/util.js';
import { CATS, PRIO, KID_CATS } from '../data/content.js';
import { WishModal } from './wishmodal.js';
import { GivenModal, GiftGivenModal } from './given.js';
import { WorldModal } from './world.js';
import { PinsModal } from './pins.js';
import { AMAZON_DISCLOSURE, searchUrl } from '../lib/shops.js';

export function AcctModal(){
  const rows=Object.entries(S.accounts).map(([id,a])=>`<div class="altrow" style="grid-template-columns:44px 1fr auto"><span class="av t${a.tone}" style="width:44px;height:44px">${initials(a.name)}</span><div><strong>${esc(a.name)}${a.age?`, ${a.age}`:''}</strong><br><span class="muted" style="font-size:13.5px">${a.managed?`Kind-Konto, verwaltet von ${esc(S.accounts.me.name)}`:'Hauptkonto'}</span></div>${S.ui.acct===id?'<span class="chip ok">Aktiv</span>':`<button class="btn sec sm" data-act="acct" data-id="${id}">Wechseln</button>`}</div>`).join('');
  return `<div class="scrim" data-act="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt">
   <h2 id="mt">Konten</h2>${S.auth.user?`<p class="muted" style="font-size:14px;margin-bottom:10px">Angemeldet als <b>${esc(S.auth.user.email||'')}</b></p>`:`<div class="banner" style="margin-bottom:12px"><span>Du bist im Demo-Modus. Deine Eingaben bleiben nur in diesem Browser. <button class="chip" data-act="tologin">Eigenes Wishtale anlegen</button></span></div>`}${rows}
   <h3 style="font-size:24px;margin:20px 0 6px">Kind-Konto anlegen</h3>
   <p class="muted" style="font-size:14.5px;margin-bottom:12px">Für Kinder pflegst du Profil und Wünsche selbst. Du siehst, was reserviert ist, damit nichts doppelt kommt. Das Kind bekommt davon nichts mit, damit die Überraschung bleibt.</p>
   <form data-form="child">
    <div class="fld"><label for="cn">Vorname</label><input id="cn" name="name" class="inp" required autocomplete="off"></div>
    <div class="fld"><label for="cb">Geburtsdatum</label><input id="cb" name="birthdate" type="date" class="inp" required min="${new Date().getFullYear()-18}-01-01" max="${new Date().toISOString().slice(0,10)}"><span class="muted" style="font-size:13px">Damit passen Vorschläge und Ideen zum Alter. Deine Freunde sehen nur das Alter, nie das Geburtsdatum.</span></div>
    <div class="fld"><label for="cs">Aktuelle Kleidergröße <span class="muted" style="font-weight:400">(optional, aber empfohlen)</span></label><input id="cs" name="size" class="inp" maxlength="20" placeholder="z. B. 104 oder Schuhgröße 28" autocomplete="off"><span class="muted" style="font-size:13px">Das hilft Schenkenden bei Kleidung und Schuhen. Kinder wachsen schnell, du kannst sie jederzeit im Profil ändern.</span></div>
    <p class="disc" style="margin:0 0 12px">Du legst das Konto als sorgeberechtigte Person an. Wir speichern dafür den Vornamen, das Geburtsdatum und auf Wunsch die Kleidergröße, keine Fotos und keinen Nachnamen.</p>
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn ghost" data-act="close">Schließen</button><button class="btn pri" type="submit">Anlegen und einrichten</button></div>
   </form>
   <div class="row" style="margin-top:14px"><button class="btn sec sm" data-act="stepsshow">${ic('check','sm')}Erste Schritte anzeigen</button></div>
   ${S.auth.user?`<div class="row" style="justify-content:space-between;margin-top:18px"><span class="disc" style="margin:0">Deine Daten liegen in deinem Wishtale-Konto.</span><button class="btn sec sm" data-act="logout">Abmelden</button></div><div class="row" style="margin-top:10px"><a class="btn ghost sm" href="#plan" style="padding-left:0">Mein Plan</a><button class="btn ghost sm" data-act="newpw" style="padding-left:0">Passwort ändern</button><button class="btn ghost sm" data-act="delacct" style="padding-left:0;color:var(--warn)">Konto und alle Daten löschen</button></div>`:`<p class="disc" style="margin-top:18px">Alle Daten liegen nur in deinem Browser. <button class="chip" data-act="reset">Demodaten zurücksetzen</button></p>`}</div></div>`;
}
export function AmazonModal(){
  const z=S.ui.az,r=z.res,ok=r&&!r.error;
  const ideas=[...new Set([...S.me.interests,...S.me.wishes.filter(w=>w.status==='offen').map(w=>w.t.split(',')[0])])].slice(0,6);
  return `<div class="scrim" data-act="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt">
   <h2 id="mt">Bei Amazon suchen und übernehmen</h2>
   <p class="muted" style="font-size:14.5px;margin-bottom:14px">Stöbere in Ruhe bei Amazon und öffne ein Produkt, das dir gefällt. Danach kommst du einfach hierher zurück und fügst den Link ein. Um den Rest kümmern wir uns.</p>
   <section class="azstep"><p class="eyebrow">1 · Suchen</p>
    <form data-form="azsearch" class="addrow"><label for="azq" style="position:absolute;left:-9999px">Suchbegriff</label><input id="azq" name="q" data-az="q" class="inp" value="${esc(z.q)}" placeholder="z. B. Kaffeemühle, Wanderstöcke" autocomplete="off"><button class="btn amz" type="submit">Bei Amazon suchen ${ic('arrow','sm')}</button></form>
    <div class="chips" style="margin-top:8px">${ideas.map(i=>`<button type="button" class="chip" data-act="azq" data-v="${esc(i)}">${esc(i)}</button>`).join('')}</div>
    <p class="disc" style="margin:8px 0 0">Amazon öffnet in einem neuen Tab. ${AMAZON_DISCLOSURE}</p></section>
   <section class="azstep"><p class="eyebrow">2 · Link einfügen</p>
    <form data-form="azlink" class="addrow"><label for="azurl" style="position:absolute;left:-9999px">Amazon-Link</label><input id="azurl" name="text" data-az="text" class="inp" value="${esc(z.text)}" placeholder="Link der Produktseite einfügen" autocomplete="off"><button class="btn sec" type="button" data-act="azclip">Aus Zwischenablage</button></form>
    <p class="muted" style="font-size:13px;margin-top:6px">In der Amazon-App tippst du beim Produkt auf „Teilen“ und fügst den Text hier einfach ein. Auch Kurzlinks (amzn.eu, amzn.to) und Adressen aus dem Browser sind in Ordnung, wir erkennen alles automatisch.</p>
    ${z.busy?`<p class="muted" style="font-size:14px;margin-top:8px" role="status">Einen Moment, wir schauen uns das Produkt an …</p>`:''}
    ${r&&r.error?`<div class="banner" style="margin-top:10px">${ic('x')}<span>${esc(r.error)}</span></div>`:''}</section>
   ${ok?`<section class="azstep azprev"><p class="eyebrow">3 · Prüfen und speichern</p>
    <form data-form="azadd">
     <div class="fld"><label for="azt">Name des Wunsches</label><input id="azt" name="t" data-az="title" class="inp" required value="${esc(z.title)}" placeholder="Produktname"></div>
     <div class="fld"><label for="azp">Preis in Euro (optional, wie bei Amazon angezeigt)</label><input id="azp" name="price" data-az="price" class="inp" inputmode="decimal" value="${esc(z.price)}" placeholder="z. B. 69,90"></div>
     <div class="fld"><label for="azc">Kategorie${z.catAuto?' (haben wir passend zum Namen gewählt)':''}</label><select id="azc" name="c" data-az="c" class="sel">${CATS.map(c=>`<option value="${c.id}" ${z.c===c.id?'selected':''}>${c.n}</option>`).join('')}</select></div>
     <p class="muted" style="font-size:13px;margin-bottom:10px"><a href="${searchUrl.idealo(z.title||'')}" target="_blank" rel="noopener noreferrer" class="linkbtn">Aktuellen Preis bei idealo nachsehen</a><br>Amazon-Produkt ${esc(r.asin)} · der Link enthält unsere Partner-ID.</p>
     <div class="row"><button class="btn pri" type="submit">${ic('plus','sm')}Auf meine Wunschliste</button></div>
    </form></section>`:''}
   <div class="row" style="justify-content:flex-end;margin-top:12px"><button type="button" class="btn ghost" data-act="close">Schließen</button></div>
  </div></div>`;
}
export function Modal(){
  const m=S.ui.modal;if(!m)return '';
  if(m==='welcome')return WelcomeModal();
  if(m==='invite')return InviteModal();
  if(m==='about')return AboutModal();
  if(m==='tour')return TourModal();
  if(m==='amazon')return AmazonModal();
  if(m==='given')return GivenModal();
  if(m==='giftgiven')return GiftGivenModal();
  if(m==='zettel')return ZettelModal();
  if(m==='wishdetail')return WishModal();
  if(m==='world')return WorldModal();
  if(m==='pins')return PinsModal();
  if(m==='accounts')return AcctModal();
  if(m==='wish'){}
  const d=(m==='wish'&&S.ui.editWish&&S.me.wishes.find(w=>w.id===S.ui.editWish))||{};
  if(m==='wish'){const ed=!!S.ui.editWish,more=ed&&(d.note||d.img||d.vis==='privat'||d.noSuggest||d.status==='plan'||(d.prio&&d.prio!==2));return `<div class="scrim" data-act="closebg"><div class="sheet wishsheet" role="dialog" aria-modal="true" aria-labelledby="mt">
   <div class="sheet-head"><h2 id="mt">${ed?'Wunsch bearbeiten':'Neuer Wunsch'}</h2><button type="button" class="sheet-x" data-act="close" aria-label="Schließen">×</button></div>
   <form data-form="wish">
    <div class="fld"><label for="wt" class="lf-t">Was wünschst du dir?</label><input id="wt" name="t" class="inp big" required placeholder="Produkt, Erlebnis oder Idee, auch ein kopierter Titel oder Link" autocomplete="off" value="${esc(d.t||S.ui.prefill||'')}"></div>
    <div id="wprev" aria-live="polite">${ed?'':WishRec()}</div>
    <div class="fld linkfirst"><label for="wl">Link zum Produkt <span class="muted" style="font-weight:400">(optional)</span></label>
     <div class="lf-row"><input id="wl" name="link" class="inp" placeholder="Link zu einem Shop einfügen" autocomplete="off" value="${esc(d.link||'')}"><button type="button" class="btn sec" data-act="readlink">Einlesen</button></div>
     <p id="wlstat" class="hint" role="status" aria-live="polite">Shop-Links lesen wir direkt. Bei Amazon genügt der kopierte Produkttitel oben im Namensfeld, den Link selbst lesen wir nicht aus.${ed?'':` Noch nichts gefunden? <button type="button" class="linkbtn" data-act="azopen">Bei Amazon suchen</button>`}</p></div>
    <div class="fld"><span class="lb">Art</span><div class="radios">${[['produkt','Produkt'],['kategorie','Nur Kategorie'],['erlebnis','Erlebnis'],['frei','Freier Wunsch']].map(([v,l])=>`<label><input type="radio" name="kind" value="${v}" ${(d.kind||'produkt')===v?'checked':''}><span>${l}</span></label>`).join('')}</div></div>
    <div class="fld f-budget"><label for="wb">Budget bis (Euro)</label><input id="wb" name="budget" type="number" min="1" inputmode="numeric" class="inp" placeholder="z. B. 100" value="${d.budget||''}"></div>
    <div class="fld f-price"><label for="wp">Preis (Euro, optional)</label><input id="wp" name="price" class="inp" inputmode="decimal" placeholder="z. B. 69,90" value="${d.price?String(d.price).replace('.',','):''}"></div>
    <details class="wmore" ${more?'open':''}><summary>Mehr Angaben <span class="muted">Notiz, Kategorie, Wichtigkeit, Bild, Sichtbarkeit</span></summary>
     <div class="fld"><label for="wn">Notiz</label><textarea id="wn" name="note" class="ta" placeholder="Farbe, Größe, Stimmung">${esc(d.note||'')}</textarea></div>
     <div class="fld"><label for="wc2">Kategorie</label><select id="wc2" name="c" class="sel">${CATS.filter(c=>!S.me.managed||KID_CATS.includes(c.id)).map(c=>`<option value="${c.id}" ${(d.c||'wohnen')===c.id?'selected':''}>${c.n}</option>`).join('')}</select></div>
     <div class="fld"><span class="lb">Wie wichtig ist es dir?</span><div class="radios">${[1,2,3].map(n=>`<label><input type="radio" name="prio" value="${n}" ${n===(d.prio||2)?'checked':''}><span>${PRIO[n]}</span></label>`).join('')}</div></div>
     <div id="wimg" class="wimg">${imgBoxHtml(d.img?{preview:d.img,src:d.imgSrc}:null)}</div>
     <div class="fld"><span class="lb">Bild (optional${ed&&d.img?', ein neues ersetzt das alte':''})</span><label class="filebtn"><input id="wi" name="img" type="file" accept="image/*"><span>Foto auswählen</span></label></div>
     <div class="fld"><label for="wv">Wer sieht das?</label><select id="wv" name="vis" class="sel">${[['alle','Für alle mit meinem Link'],['privat','Privat, nur ich']].map(([v,l])=>`<option value="${v}" ${((d.vis==='giver'?'alle':d.vis)||'alle')===v?'selected':''}>${l}</option>`).join('')}</select></div>
     <div class="fld"><label class="chk"><input type="checkbox" name="nosug" value="1" ${d.noSuggest?'checked':''}><span>Hierfür keine Vorschläge generieren</span></label><span class="muted" style="font-size:13.5px">Wishtale zeigt dann bei diesem Wunsch keine Produkte und Ideen. Deine Freunde lesen, dass das auf deinen Wunsch so ist.</span></div>
     <div class="fld"><label class="chk"><input type="checkbox" name="plan" value="1" ${d.status==='plan'?'checked':''}><span>Das möchte ich mir selbst erfüllen</span></label><span class="muted" style="font-size:13.5px">Niemand sieht diesen Wunsch. Wishtale schlägt deinen Freunden dafür nichts vor und nutzt ihn nur, um deinen Geschmack besser zu verstehen.</span></div>
    </details>
    <p id="wdup" class="hint attn" role="alert" hidden></p>
    <div class="sheet-foot"><button type="button" class="btn ghost" data-act="close">Abbrechen</button><button class="btn pri" type="submit">${ed?'Änderungen speichern':'Wunsch speichern'}</button></div>
   </form></div></div>`;}
  return `<div class="scrim" data-act="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt">
   <h2 id="mt">Geschenk eintragen</h2>
   <form data-form="gift">
    <div class="fld"><label for="gw">Was war es?</label><input id="gw" name="what" class="inp" required autocomplete="off"></div>
    <div class="fld"><label for="gf">Von wem?</label><input id="gf" name="from" class="inp" required autocomplete="off"></div>
    <div class="fld"><label for="gd">Wann?</label><input id="gd" name="when" type="month" class="inp" value="2026-11"></div>
    <div class="fld"><span class="lb">Hat es gefallen?</span><div class="radios">${[['ja','Ja'],['teils','Teils, teils'],['nein','Nein']].map(([v,l],i)=>`<label><input type="radio" name="liked" value="${v}" ${i?'':'checked'}><span>${l}</span></label>`).join('')}</div></div>
    <div class="fld"><span class="lb">Ist es noch vorhanden?</span><div class="radios"><label><input type="radio" name="have" value="1" checked><span>Ja</span></label><label><input type="radio" name="have" value="0"><span>Nein</span></label></div></div>
    <div class="fld"><span class="lb">Würdest du dich erneut darüber freuen?</span><div class="radios"><label><input type="radio" name="again" value="1" checked><span>Ja</span></label><label><input type="radio" name="again" value="0"><span>Eher nicht</span></label></div></div>
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn ghost" data-act="close">Abbrechen</button><button class="btn pri" type="submit">Speichern</button></div>
   </form></div></div>`;
}
