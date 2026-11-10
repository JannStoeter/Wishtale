/* Willkommens-Rundgang beim ersten Anmelden: vier kurze Ansichten laufen von selbst, damit niemand leer im Raum steht. */
import { S } from '../state.js';
import { esc } from '../lib/util.js';
import { photoUrl } from '../data/photos.js';
import { render } from '../render.js';

const flagKey = () => 'wishtale:welcomed:' + (S.auth.user ? S.auth.user.id : '');
export const markWelcomed = () => { try { localStorage.setItem(flagKey(), '1'); } catch { /* nur für diese Sitzung */ } };
const welcomed = () => { try { return localStorage.getItem(flagKey()) === '1'; } catch { return false; } };

let idx = 0, timer = null, typer = null;
const SCENES = ['Wunsch', 'Einlesen', 'Ideen', 'Teilen'];
const img = (k, w = 600) => { const u = photoUrl(k, w); return u ? `<span class="imgbox art"><img src="${u}" alt="" width="${w}" height="${Math.round(w * 0.75)}" loading="lazy" decoding="async" onerror="this.remove()"></span>` : '<span class="imgbox art"></span>'; };
const rec = (k, t, why, chip, extra = '') => `<div class="rec">${img(k, 300)}<div><span class="eyebrow">${extra || 'Vorschlag von Wishtale'}</span><p class="rh">${t}</p><p class="why">${why}</p><div class="row" style="gap:6px"><span class="chip">${chip}</span></div></div></div>`;
const FULL = 'Hochwertige Pfanne bis 100 €';

function scene(i, name) {
  if (i === 0) return `<p class="eyebrow">Neuer Wunsch</p><div class="sinput"><span class="typed" id="wtyped">${esc(FULL)}</span><i class="caret" aria-hidden="true"></i></div>
   <p class="muted" style="font-size:13.5px;margin:8px 0 10px">Ein Produkt, ein Erlebnis oder einfach eine Idee, so wie sie dir einfällt.</p>
   <p class="eyebrow" style="margin:6px 0 8px">Passende Produkte von Wishtale</p><div class="srecs">${rec('pan', 'Edelstahlpfanne, 28 cm', 'Gut zum scharfen Anbraten.', 'ca. 60 bis 100 €')}${rec('pot', 'Gusseiserne Pfanne', 'Hält ein Leben lang.', 'ca. 40 bis 90 €')}</div>`;
  if (i === 1) return `<p class="eyebrow">Schon eine Liste? Einfach einfügen</p>
   <div class="spaste" aria-hidden="true"><span>Hario V60 Keramik Kaffeefilter Dripper Größe 02, weiß, 1-4 Tassen, Pour Over Handfilter</span><span>4,7 ★★★★★ (12.481) · 24,90 € · Auf Lager · In den Einkaufswagen</span><span>Fellow Stagg EKG Elektrischer Wasserkocher mit Temperaturwahl, 0,9 L</span></div>
   <p class="eyebrow" style="margin:14px 0 8px">Wishtale macht daraus einzelne Wünsche</p><div class="srecs">${rec('kettle', 'Hario V60 Keramik Dripper, Größe 02', 'Weiß, für 1 bis 4 Tassen', '24,90 €', 'Aus deiner Liste')}${rec('teapot', 'Fellow Stagg EKG Wasserkocher, 0,9 L', 'Mit Temperaturwahl', '179,00 €', 'Aus deiner Liste')}</div>`;
  if (i === 2) return `<p class="eyebrow">Dein Geschmack macht den Unterschied</p>
   <div class="chips"><span class="chip on">Kaffee brühen</span><span class="chip on">Kochen</span><span class="chip">Hario</span><span class="chip ok">Siebträgermaschine schon da</span><span class="chip warn">Nicht: Duftkerzen</span></div>
   <p class="eyebrow" style="margin:14px 0 8px">Ideen, die zu dir passen</p><div class="srecs">${rec('mug', 'Kaffee-Probierset kleiner Röstereien', 'Passt, weil du Kaffee gern selbst brühst.', 'ca. 20 bis 35 €')}${rec('cooking', 'Backkurs mit Sauerteig', 'Etwas mit den Händen zum Ausprobieren.', 'Erlebnis')}</div>`;
  return `<p class="eyebrow">So sehen es deine Freunde</p>
   <div class="wprev-card" style="grid-template-columns:1fr"><div><strong>wishtale.de/#p/${esc((S.me.handle || 'dein-name'))}</strong><span class="muted" style="font-size:13px;display:block;margin-top:4px">Dein Link: Freunde brauchen kein Konto und sehen Wünsche und Vorschläge auf einer Seite.</span></div></div>
   <div class="wgrid swish" style="margin-top:12px"><div class="wcard compact"><div class="wmedia">${img('grinder', 500)}<span class="wstate ok">Reserviert</span></div><div class="wbody"><p class="wt rh">Kaffeemühle</p><p class="wp">Reserviert von jemandem</p></div></div><div class="wcard compact"><div class="wmedia">${img('knife', 500)}</div><div class="wbody"><p class="wt rh">Messerset</p><p class="wp">Noch offen</p></div></div></div>
   <p class="muted" style="font-size:13.5px;margin-top:10px">Die Überraschung bleibt: Du siehst nie, wer was reserviert oder schenkt.</p>`;
}

export function WelcomeModal() {
  const name = S.me && S.me.name ? esc(S.me.name.split(' ')[0]) : '';
  return `<div class="scrim" data-act="welcomeskip" data-bg="1"><div class="sheet welcome" role="dialog" aria-modal="true" aria-labelledby="mt">
   <p class="eyebrow">Willkommen bei Wishtale</p><h2 id="mt">${name ? `Schön, dass du da bist, ${name}` : 'Schön, dass du da bist'}</h2>
   <p class="muted" style="margin:4px 0 12px">So funktioniert Wishtale in vier kurzen Ansichten, alle Beispiele sind erfunden.</p>
   <div class="stage" id="wstage" style="max-width:none;box-shadow:none">
    <div class="sscenes">${SCENES.map((n, i) => `<section class="vs ${i === idx ? 'on' : ''}" data-label="${n}" aria-label="${n}">${scene(i, n)}</section>`).join('')}</div>
    <div class="stabs"><div class="stab-row" style="grid-template-columns:repeat(4,1fr)" role="group" aria-label="Ansicht wählen">${SCENES.map((n, i) => `<button type="button" class="stab ${i === idx ? 'on' : ''}" data-act="wtab" data-i="${i}" aria-pressed="${i === idx}">${n}</button>`).join('')}</div></div>
   </div>
   <div class="row" style="justify-content:flex-end;margin-top:14px"><button type="button" class="btn ghost" data-act="welcomeskip">Später</button><button type="button" class="btn sec" data-act="welcomeimport">Liste einlesen</button><button type="button" class="btn pri" data-act="welcomego">Ersten Wunsch aufschreiben</button></div>
  </div></div>`;
}

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function type() {
  clearInterval(typer);
  const el = document.getElementById('wtyped'); if (!el) return;
  if (reduce()) { el.textContent = FULL; return; }
  el.textContent = ''; let n = 0;
  typer = setInterval(() => { const e = document.getElementById('wtyped'); if (!e) { clearInterval(typer); return; } n++; e.textContent = FULL.slice(0, n); if (n >= FULL.length) clearInterval(typer); }, 55);
}
export function showScene(i, user) {
  idx = (i + SCENES.length) % SCENES.length;
  document.querySelectorAll('#wstage .vs').forEach((s, k) => s.classList.toggle('on', k === idx));
  document.querySelectorAll('#wstage .stab').forEach((t, k) => { t.classList.toggle('on', k === idx); t.setAttribute('aria-pressed', k === idx); });
  if (idx === 0) type();
  if (user) startWelcome();
}
export function startWelcome() {
  clearInterval(timer);
  if (reduce()) return;
  timer = setInterval(() => { if (S.ui.modal !== 'welcome' || !document.getElementById('wstage')) { clearInterval(timer); return; } showScene(idx + 1); }, 6500);
}
export function stopWelcome() { clearInterval(timer); clearInterval(typer); idx = 0; }

/** Öffnet den Rundgang einmal pro Konto, solange noch keine Wünsche da sind. */
export function maybeWelcome() {
  if (!S.auth.user || S.ui.modal || welcomed() || /neues-passwort|passwort-vergessen/.test(location.hash)) return;
  if (S.me && S.me.wishes && S.me.wishes.length) { markWelcomed(); return; }
  idx = 0; S.ui.modal = 'welcome'; render();
  setTimeout(() => { type(); startWelcome(); }, 60);
}
