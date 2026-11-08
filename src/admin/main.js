import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/schibsted-grotesk/index.css';
import './admin.css';
import { adminState, signIn, signOut, count } from './api.js';
import { $, esc, toast } from './util.js';

const TABS = [['start', 'Übersicht'], ['auswertung', 'Auswertung'], ['produkte', 'Produkte'], ['aktionen', 'Aktionen'], ['katalog', 'Katalog'], ['konten', 'Konten und Pläne'], ['angebote', 'Angebote'], ['kosten', 'Kosten'], ['instagram', 'Instagram'], ['ads', 'Google Ads'], ['texte', 'Seitentexte'], ['verbindungen', 'Verbindungen']];
const MODS = { katalog: () => import('./katalog.js'), konten: () => import('./konten.js'), angebote: () => import('./angebote.js'), kosten: () => import('./kosten.js'), auswertung: () => import('./usage.js'), produkte: () => import('./products.js'), aktionen: () => import('./campaigns.js'), instagram: () => import('./instagram.js'), ads: () => import('./ads.js'), texte: () => import('./texts.js'), verbindungen: () => import('./connections.js') };
const root = $('#root');

function loginView(msg) {
  root.innerHTML = `<main id="main" class="login"><div class="card"><p class="eyebrow">Wishtale CMS</p><h1>Anmelden</h1><p class="muted">Nur für freigegebene Konten.</p>${msg ? `<p class="banner" role="alert">${esc(msg)}</p>` : ''}
   <form id="lf"><div class="fld"><label for="e">E-Mail</label><input id="e" class="inp" type="email" required autocomplete="email"></div><div class="fld"><label for="p">Passwort</label><input id="p" class="inp" type="password" required autocomplete="current-password"></div>
   <button class="btn pri" type="submit">Anmelden</button></form></div></main>`;
  $('#lf').onsubmit = async e => { e.preventDefault(); const { error } = await signIn($('#e').value.trim(), $('#p').value); if (error) return loginView('E-Mail oder Passwort stimmt nicht.'); boot(); };
}

async function dashboard(el) {
  const [p, c, s, a] = await Promise.all(['products', 'campaigns', 'social_posts', 'ad_plans'].map(count));
  const ready = p !== null;
  el.innerHTML = `<div class="head"><div><h1>Übersicht</h1><p class="muted">Von hier steuerst du Produkte, Aktionen, Instagram-Beiträge und Anzeigenpläne.</p></div></div>
  ${ready ? '' : '<div class="banner warn2"><b>Die Datenbank ist noch nicht vorbereitet.</b> Die Änderung <code>0005_cms.sql</code> wurde noch nicht angewendet. Führe sie im Supabase-SQL-Editor aus oder gib sie frei, dann funktioniert alles.</div>'}
  <div class="stats">${[['Produkte', p, '#produkte'], ['Aktionen', c, '#aktionen'], ['Instagram-Beiträge', s, '#instagram'], ['Anzeigenpläne', a, '#ads']].map(([t, n, h]) => `<a class="stat" href="${h}"><b>${n ?? '–'}</b><span>${t}</span></a>`).join('')}</div>
  <div class="card"><h2>Verbindungen</h2><ul class="conn"><li><span class="pill ok">Aktiv</span> Datenbank und Anmeldung (Supabase)</li><li id="ci"></li><li id="cg"></li></ul><p class="muted">Wie du Instagram und Google Ads verbindest, steht unter <a href="#verbindungen">Verbindungen</a>.</p></div>`;
  statusPills(el);
}

async function statusPills(el) {
  const set = (id, ok, text) => { const n = el.querySelector('#' + id); if (n) n.innerHTML = `<span class="pill ${ok ? 'ok' : ''}">${ok ? 'Verbunden' : 'Nicht verbunden'}</span> ${text}`; };
  set('ci', false, 'Instagram (direktes Veröffentlichen)'); set('cg', false, 'Google Ads (direkte Steuerung)');
  try { const { sb } = await import('../lib/supabase.js'); const { data: { session } } = await sb.auth.getSession(); const r = await fetch('/api/integrations', { headers: { authorization: 'Bearer ' + session.access_token } }); if (!r.ok) return; const j = await r.json(); set('ci', j.instagram.configured, 'Instagram (direktes Veröffentlichen)'); set('cg', j.googleAds.configured, 'Google Ads (direkte Steuerung)'); } catch { /* ohne Server-Funktionen */ }
}

async function show() {
  const key = (location.hash.replace('#', '') || 'start'), el = $('#view');
  document.querySelectorAll('nav a').forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + key ? 'page' : 'false'));
  try { key === 'start' || !MODS[key] ? await dashboard(el) : await (await MODS[key]()).mount(el); }
  catch (e) { el.innerHTML = `<div class="banner warn2" role="alert"><b>Das konnte nicht geladen werden.</b> ${esc(e.message || e)}<br>Falls die Datenbank-Änderung <code>0005_cms.sql</code> noch fehlt, wende sie zuerst an.</div>`; console.error(e); }
}

async function boot() {
  const st = await adminState().catch(() => ({ state: 'out' }));
  if (st.state === 'out') return loginView();
  if (st.state === 'denied') { root.innerHTML = `<main id="main" class="login"><div class="card"><h1>Kein Zugriff</h1><p class="muted">Das Konto ${esc(st.user.email || '')} ist nicht als Administrator freigegeben.</p><button class="btn pri" id="lo">Abmelden</button></div></main>`; $('#lo').onclick = async () => { await signOut(); loginView(); }; return; }
  root.innerHTML = `<header class="bar"><a class="mark" href="#start">wishtale<i></i> <span>CMS</span></a><nav aria-label="CMS">${TABS.map(([k, l]) => `<a href="#${k}">${l}</a>`).join('')}</nav><button class="btn ghost sm" id="so">Abmelden</button></header><main id="main"><div id="view"></div></main>`;
  $('#so').onclick = async () => { await signOut(); loginView(); };
  window.addEventListener('hashchange', show); show();
}
boot().catch(e => { console.error(e); loginView('Die Verbindung hat nicht geklappt.'); });
export { toast };
