import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/schibsted-grotesk/index.css';
import '../admin/admin.css';
import './dev.css';
import { adminState, signIn, signOut } from '../admin/api.js';
import { sb } from '../lib/supabase.js';
import { $, esc, toast, fmtDate } from '../admin/util.js';
import { md } from './md.js';

const root = $('#root');
const AUTOR = { claude: 'Claude', chatgpt: 'ChatGPT' };
const LV = { hoch: 'hoch', mittel: 'mittel', niedrig: 'niedrig', klein: 'klein', groß: 'groß' };
let topics = [], verdicts = {};

function loginView(msg) {
  root.innerHTML = `<main id="main" class="login"><div class="card"><p class="eyebrow">Wishtale Entwickler</p><h1>Anmelden</h1><p class="muted">Nur für freigegebene Konten.</p>${msg ? `<p class="banner" role="alert">${esc(msg)}</p>` : ''}
   <form id="lf"><div class="fld"><label for="e">E-Mail</label><input id="e" class="inp" type="email" required autocomplete="email"></div><div class="fld"><label for="p">Passwort</label><input id="p" class="inp" type="password" required autocomplete="current-password"></div>
   <button class="btn pri" type="submit">Anmelden</button></form></div></main>`;
  $('#lf').onsubmit = async e => { e.preventDefault(); const { error } = await signIn($('#e').value.trim(), $('#p').value); if (error) return loginView('E-Mail oder Passwort stimmt nicht.'); boot(); };
}

async function load() {
  const { data: { session } } = await sb.auth.getSession();
  const r = await fetch('/api/tribunal', { headers: { authorization: 'Bearer ' + session.access_token } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Die Positionen lassen sich nicht laden.');
  topics = j.topics;
  const { data } = await sb.from('tribunal_verdicts').select('*');
  verdicts = Object.fromEntries((data || []).map(v => [v.topic, v]));
}

/** Stand je Entscheidung: aus Janns Urteil, sonst aus den Positionen. */
const stateOf = t => {
  const v = verdicts[t.id];
  if (v) return { k: v.status, label: v.status === 'entschieden' ? `Entschieden${v.option ? ': ' + v.option : ''}` : v.status === 'vertagt' ? 'Vertagt' : 'Abgelehnt', cls: v.status === 'entschieden' ? 'ok' : '' };
  return { k: 'offen', label: 'Offen', cls: 'gold' };
};
const latest = (t, autor) => [...t.positions].filter(p => p.autor === autor).pop();
function accord(t) {
  const c = latest(t, 'claude'), g = latest(t, 'chatgpt');
  if (!c && !g) return { cls: '', text: 'Noch keine Position.' };
  if (!c || !g) return { cls: 'gold', text: `Es fehlt noch die Position von ${c ? 'ChatGPT' : 'Claude'}.` };
  if (c.empfehlung && c.empfehlung === g.empfehlung && c.empfehlung !== 'keine') return { cls: 'ok', text: `Beide empfehlen Option ${c.empfehlung}.` };
  return { cls: 'warn2', text: `Uneinig: Claude empfiehlt ${c.empfehlung || '–'}, ChatGPT empfiehlt ${g.empfehlung || '–'}.` };
}
const optLabel = (t, k) => { const o = t.optionen.find(x => x.key === k); return o ? `${o.key}: ${o.label}` : k; };

function list(el, filter, title, lead) {
  const rows = topics.filter(filter);
  el.innerHTML = `<div class="head"><div><h1>${title}</h1><p class="muted">${lead}</p></div></div>
   <div class="tablewrap"><table><thead><tr><th>Entscheidung</th><th>Stand der KIs</th><th>Dein Urteil</th></tr></thead><tbody>${rows.map(t => { const a = accord(t), s = stateOf(t); return `<tr>
    <td><a href="#t/${esc(t.id)}"><b>${esc(t.titel)}</b></a><br><span class="muted">${esc(t.id)} · ${t.art === 'befund' ? 'Befund' : 'Entscheidung'}</span></td>
    <td><span class="pill ${a.cls}">${esc(a.text)}</span></td><td><span class="pill ${s.cls}">${esc(s.label)}</span></td></tr>`; }).join('') || '<tr><td colspan="3" class="muted">Hier ist nichts.</td></tr>'}</tbody></table></div>`;
}

function position(t, autor) {
  const ps = t.positions.filter(p => p.autor === autor);
  if (!ps.length) return `<section class="card pos wait"><h2>${AUTOR[autor]}</h2><p class="muted">Noch keine Position. Kopiere unten den Prompt und gib ihn ${AUTOR[autor]}.</p></section>`;
  return `<section class="card pos"><h2>${AUTOR[autor]}</h2>${ps.map(p => `<article class="round"><div class="row" style="gap:6px;flex-wrap:wrap">
    ${ps.length > 1 ? `<span class="pill">Runde ${p.runde}</span>` : ''}<span class="pill gold">Empfehlung: ${esc(p.empfehlung ? optLabel(t, p.empfehlung) : '–')}</span>
    ${p.sicherheit ? `<span class="pill">Sicherheit: ${esc(LV[p.sicherheit] || p.sicherheit)}</span>` : ''}${p.aufwand ? `<span class="pill">Aufwand: ${esc(LV[p.aufwand] || p.aufwand)}</span>` : ''}</div>
    ${p.kosten ? `<p class="muted" style="margin:8px 0 0">Kosten: ${esc(p.kosten)}</p>` : ''}<div class="md">${md(p.body)}</div><p class="muted" style="font-size:12px">${esc(p.file)}${p.datum ? ' · ' + esc(p.datum) : ''}</p></article>`).join('')}</section>`;
}

function prompt(t, autor) {
  const other = autor === 'claude' ? 'chatgpt' : 'claude';
  const hasMine = t.positions.some(p => p.autor === autor), round = t.positions.filter(p => p.autor === autor).length + 1;
  const file = `docs/tribunal/${t.id}/${autor}${round > 1 ? '-' + round : ''}.md`;
  return `Du bist ${AUTOR[autor]} im Wishtale-Repository. Lies AGENTS.md und docs/tribunal/README.md.\n\nAufgabe: Gib deine unabhängige Position zur Entscheidung „${t.titel}“ ab.\n1. Lies docs/tribunal/${t.id}/frage.md.\n` +
    (hasMine ? `2. Du hast schon eine Position abgegeben. Lies jetzt die Position von ${AUTOR[other]} (docs/tribunal/${t.id}/${other}*.md) und schreibe eine zweite Runde: bleibst du bei deiner Empfehlung, und was überzeugt dich nicht?\n` : `2. Lies die Position von ${AUTOR[other]} noch nicht, bevor du deine abgelegt hast.\n`) +
    `3. Schreibe ${file} im Format aus der README (Front matter mit autor, datum, empfehlung, sicherheit, aufwand, kosten; Abschnitte Begründung, Risiken, Gegenargument).\n4. Committe und pushe nur diese Datei. Trenne Belegtes, Vermutetes und nicht Geprüftes.`;
}

function topic(el, id) {
  const t = topics.find(x => x.id === id);
  if (!t) { el.innerHTML = '<p class="muted">Diese Entscheidung gibt es nicht.</p>'; return; }
  const a = accord(t), v = verdicts[t.id];
  el.innerHTML = `<p><a href="#offen">← Zurück</a></p><div class="head"><div><h1>${esc(t.titel)}</h1><p class="muted">${esc(t.id)} · ${t.art === 'befund' ? 'Befund' : 'Entscheidung'}${t.von ? ' · gestellt von ' + esc(AUTOR[t.von] || t.von) : ''}${t.erstellt ? ' · ' + esc(t.erstellt) : ''}</p></div></div>
   <section class="card"><div class="md">${md(t.frage)}</div>${t.optionen.length ? `<h3>Optionen</h3><ul>${t.optionen.map(o => `<li><b>${esc(o.key)}</b>: ${esc(o.label)}</li>`).join('')}</ul>` : ''}</section>
   <div class="banner ${a.cls === 'ok' ? '' : a.cls}" role="status"><b>${esc(a.text)}</b></div>
   <div class="cols">${position(t, 'claude')}${position(t, 'chatgpt')}</div>
   <section class="card"><h2>Dein Urteil</h2>
    ${v ? `<p><span class="pill ${stateOf(t).cls}">${esc(stateOf(t).label)}</span> <span class="muted">am ${esc(fmtDate(v.decided_at))}</span></p>${v.note ? `<p>${esc(v.note)}</p>` : ''}` : '<p class="muted">Noch nicht entschieden.</p>'}
    <form data-f="verdict" class="grid2"><div class="fld"><label for="vo">Option</label><select id="vo" name="option" class="sel"><option value="">Keine davon (eigene Lösung)</option>${t.optionen.map(o => `<option value="${esc(o.key)}" ${v && v.option === o.key ? 'selected' : ''}>${esc(o.key)}: ${esc(o.label)}</option>`).join('')}</select></div>
     <div class="fld"><label for="vs">Stand</label><select id="vs" name="status" class="sel">${[['entschieden', 'Entschieden'], ['vertagt', 'Vertagt'], ['abgelehnt', 'Abgelehnt']].map(([k, l]) => `<option value="${k}" ${(v ? v.status : 'entschieden') === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
     <div class="fld" style="grid-column:1/-1"><label for="vn">Begründung (damit du später weißt, warum)</label><textarea id="vn" name="note" class="ta" maxlength="2000">${esc(v ? v.note : '')}</textarea></div>
     <div class="row"><button class="btn pri" type="submit">Urteil speichern</button>${v ? '<button class="btn ghost" type="button" data-a="reset">Urteil zurücknehmen</button>' : ''}</div></form></section>
   <section class="card"><h2>Prompt für die nächste Runde</h2><p class="muted">Kopiere den Text und gib ihn der jeweiligen KI. Sie legt ihre Antwort als Datei im Repository ab.</p>
    ${['claude', 'chatgpt'].map(au => `<details><summary>Für ${AUTOR[au]}</summary><pre class="prompt">${esc(prompt(t, au))}</pre><button class="btn sec sm" data-a="copy" data-au="${au}">Kopieren</button></details>`).join('')}</section>`;
  el.onsubmit = async e => {
    if (e.target.dataset.f !== 'verdict') return; e.preventDefault(); const d = new FormData(e.target);
    const { error } = await sb.from('tribunal_verdicts').upsert({ topic: t.id, status: d.get('status'), option: d.get('option') || null, note: (d.get('note') || '').trim(), decided_at: new Date().toISOString() });
    if (error) return toast(error.message, true);
    toast('Gespeichert.'); await load(); topic(el, id);
  };
  el.onclick = async e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    if (b.dataset.a === 'copy') { try { await navigator.clipboard.writeText(prompt(t, b.dataset.au)); toast('Kopiert.'); } catch { toast('Kopieren hat nicht geklappt, markiere den Text von Hand.', true); } }
    if (b.dataset.a === 'reset') { if (!confirm('Das Urteil wirklich zurücknehmen?')) return; const { error } = await sb.from('tribunal_verdicts').delete().eq('topic', t.id); if (error) return toast(error.message, true); await load(); topic(el, id); }
  };
}

function guide(el) {
  el.innerHTML = `<div class="head"><div><h1>So funktioniert das Tribunal</h1><p class="muted">Du, Claude und ChatGPT arbeiten über dasselbe Repository.</p></div></div>
   <section class="card"><ol class="steps"><li><b>Frage stellen.</b> Wer eine Entscheidung braucht, legt unter <code>docs/tribunal/&lt;nummer&gt;-&lt;kurzname&gt;/frage.md</code> eine Frage mit Optionen an.</li>
    <li><b>Unabhängig antworten.</b> Claude schreibt <code>claude.md</code>, ChatGPT schreibt <code>chatgpt.md</code>. Jeder liest die Position des anderen erst, nachdem die eigene steht.</li>
    <li><b>Lesen und entscheiden.</b> Hier siehst du beide Positionen nebeneinander, ob sie einig sind, und triffst dein Urteil. Es steht in der Datenbank.</li>
    <li><b>Nachhaken.</b> Mit dem Prompt-Knopf holst du eine zweite Runde (<code>claude-2.md</code>, <code>chatgpt-2.md</code>).</li></ol>
    <p class="hint">Die Regeln und das Format stehen in <code>docs/tribunal/README.md</code> und <code>AGENTS.md</code>. Neue Dateien erscheinen hier nach dem nächsten Deploy. Die Seite ist nur für Admins sichtbar.</p></section>`;
}

async function show() {
  const key = location.hash.replace('#', '') || 'offen', el = $('#view');
  document.querySelectorAll('nav a').forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + (key.startsWith('t/') ? 'offen' : key) ? 'page' : 'false'));
  el.onsubmit = el.onclick = null;
  try {
    if (!topics.length) await load();
    if (key.startsWith('t/')) topic(el, key.slice(2));
    else if (key === 'entschieden') list(el, t => stateOf(t).k !== 'offen', 'Entschieden', 'Was du schon beantwortet oder vertagt hast.');
    else if (key === 'anleitung') guide(el);
    else list(el, t => stateOf(t).k === 'offen', 'Offene Entscheidungen', 'Hier wartet etwas auf dein Urteil. Ein Klick zeigt Claude und ChatGPT nebeneinander.');
  } catch (e) { el.innerHTML = `<div class="banner warn2" role="alert"><b>Das konnte nicht geladen werden.</b> ${esc(e.message || e)}<br>Auf einer Vorschau ohne Server-Funktionen (npm run dev) geht das nicht, auf der echten Seite schon.</div>`; }
}

async function boot() {
  const st = await adminState().catch(() => ({ state: 'out' }));
  if (st.state === 'out') return loginView();
  if (st.state === 'denied') { root.innerHTML = `<main id="main" class="login"><div class="card"><h1>Kein Zugriff</h1><p class="muted">Das Konto ${esc(st.user.email || '')} ist nicht als Administrator freigegeben.</p><button class="btn" id="so">Abmelden</button></div></main>`; $('#so').onclick = async () => { await signOut(); loginView(); }; return; }
  root.innerHTML = `<header class="bar"><a class="mark" href="#offen">wishtale<i></i> <span>Entwickler</span></a><nav aria-label="Entwickler">${[['offen', 'Offen'], ['entschieden', 'Entschieden'], ['anleitung', 'Anleitung']].map(([k, l]) => `<a href="#${k}">${l}</a>`).join('')}<a href="../cms/">CMS</a></nav><button class="btn ghost sm" id="so">Abmelden</button></header><main id="main"><div id="view" class="view"></div></main>`;
  $('#so').onclick = async () => { await signOut(); loginView(); };
  window.addEventListener('hashchange', show); show();
}
boot().catch(e => { console.error(e); loginView('Die Verbindung hat nicht geklappt.'); });
