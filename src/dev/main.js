import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/schibsted-grotesk/index.css';
import '../admin/admin.css';
import './dev.css';
import { adminState, signIn, signOut } from '../admin/api.js';
import { sb } from '../lib/supabase.js';
import { $, esc, toast, fmtDate } from '../admin/util.js';
import { md } from './md.js';
import { mountShell } from '../admin/shell.js';

const root = $('#root');
const AUTOR = { claude: 'Claude', chatgpt: 'ChatGPT' };
const LV = { hoch: 'hoch', mittel: 'mittel', niedrig: 'niedrig', klein: 'klein', groß: 'groß' };
let topics = [], verdicts = {}, requests = [], shell = null;

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
  requests = (await sb.from('tribunal_requests').select('*').order('created_at', { ascending: false })).data || [];
}

/** Stand je Entscheidung: aus Janns Urteil, sonst aus den Positionen. */
const stateOf = t => {
  const v = verdicts[t.id];
  if (v) return { k: v.status, label: v.status === 'entschieden' ? `Entschieden${v.option ? ': ' + v.option : ''}` : v.status === 'vertagt' ? 'Vertagt' : 'Abgelehnt', cls: v.status === 'entschieden' ? 'ok' : '' };
  return { k: 'offen', label: 'Offen', cls: 'gold' };
};
const buildPill = v => (!v || v.build === 'nein' ? '' : v.build === 'freigegeben' ? '<span class="pill gold">Zum Bauen freigegeben</span>' : `<span class="pill ok">Umgesetzt${v.build_ref ? ' (' + esc(v.build_ref) + ')' : ''}</span>`);
const latest = (t, autor) => [...t.positions].filter(p => p.autor === autor).pop();
function accord(t) {
  const c = latest(t, 'claude'), g = latest(t, 'chatgpt');
  if (!c && !g) return { cls: '', text: 'Noch keine Position.' };
  if (!c || !g) return { cls: 'gold', text: `Es fehlt noch die Position von ${c ? 'ChatGPT' : 'Claude'}.` };
  if (c.empfehlung && c.empfehlung === g.empfehlung && c.empfehlung !== 'keine') return { cls: 'ok', text: `Beide empfehlen Option ${c.empfehlung}.` };
  return { cls: 'warn2', text: `Uneinig: Claude empfiehlt ${c.empfehlung || '–'}, ChatGPT empfiehlt ${g.empfehlung || '–'}.` };
}
const ART = { entscheidung: 'Entscheidung', befund: 'Befund', aufgabe: 'Aufgabe' };
const optLabel = (t, k) => { const o = t.optionen.find(x => x.key === k); return o ? `${o.key}: ${o.label}` : k; };

function list(el, filter, title, lead) {
  const rows = topics.filter(filter);
  el.innerHTML = `<div class="head"><div><h1>${title}</h1><p class="muted">${lead}</p></div></div>
   <div class="tablewrap"><table><thead><tr><th>Entscheidung</th><th>Stand der KIs</th><th>Dein Urteil</th><th>Bauen</th></tr></thead><tbody>${rows.map(t => { const a = accord(t), s = stateOf(t); return `<tr>
    <td><a href="#t/${esc(t.id)}"><b>${esc(t.titel)}</b></a><br><span class="muted">${esc(t.id)} · ${ART[t.art] || 'Entscheidung'}</span></td>
    <td><span class="pill ${a.cls}">${esc(a.text)}</span></td><td><span class="pill ${s.cls}">${esc(s.label)}</span></td><td>${buildPill(verdicts[t.id]) || '<span class="muted">–</span>'}</td></tr>`; }).join('') || '<tr><td colspan="4" class="muted">Hier ist nichts.</td></tr>'}</tbody></table></div>`;
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
    `3. Schreibe ${file} im Format aus der README (Front matter mit autor, datum, empfehlung, sicherheit, aufwand, kosten; Abschnitte Begründung, Risiken, Gegenargument).\n4. Lege dafür den Branch tribunal/${autor}-${t.id.slice(0, 3)} an, committe nur diese Datei und öffne einen Pull Request nach main. Ändere nichts anderes, auch keinen Code, und schreibe nicht direkt in main.\n5. Trenne Belegtes, Vermutetes und nicht Geprüftes.`;
}

function topic(el, id) {
  const t = topics.find(x => x.id === id);
  if (!t) { el.innerHTML = '<p class="muted">Diese Entscheidung gibt es nicht.</p>'; return; }
  const a = accord(t), v = verdicts[t.id];
  el.innerHTML = `<p><a href="#offen">← Zurück</a></p><div class="head"><div><h1>${esc(t.titel)}</h1><p class="muted">${esc(t.id)} · ${ART[t.art] || 'Entscheidung'}${t.von ? ' · gestellt von ' + esc(AUTOR[t.von] || t.von) : ''}${t.erstellt ? ' · ' + esc(t.erstellt) : ''}</p></div></div>
   <section class="card"><div class="md">${md(t.frage)}</div>${t.optionen.length ? `<h3>Optionen</h3><ul>${t.optionen.map(o => `<li><b>${esc(o.key)}</b>: ${esc(o.label)}</li>`).join('')}</ul>` : ''}</section>
   <div class="banner ${a.cls === 'ok' ? '' : a.cls}" role="status"><b>${esc(a.text)}</b></div>
   <div class="cols">${position(t, 'claude')}${position(t, 'chatgpt')}</div>
   <section class="card"><h2>Dein Urteil</h2>
    ${v ? `<p><span class="pill ${stateOf(t).cls}">${esc(stateOf(t).label)}</span> ${buildPill(v)} <span class="muted">am ${esc(fmtDate(v.decided_at))}</span></p>${v.note ? `<p>${esc(v.note)}</p>` : ''}` : '<p class="muted">Noch nicht entschieden.</p>'}
    <form data-f="verdict" class="grid2"><div class="fld"><label for="vo">Option</label><select id="vo" name="option" class="sel"><option value="">Keine davon (eigene Lösung)</option>${t.optionen.map(o => `<option value="${esc(o.key)}" ${v && v.option === o.key ? 'selected' : ''}>${esc(o.key)}: ${esc(o.label)}</option>`).join('')}</select></div>
     <div class="fld"><label for="vs">Stand</label><select id="vs" name="status" class="sel">${[['entschieden', 'Entschieden'], ['vertagt', 'Vertagt'], ['abgelehnt', 'Abgelehnt']].map(([k, l]) => `<option value="${k}" ${(v ? v.status : 'entschieden') === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
     <div class="fld" style="grid-column:1/-1"><label for="vb">Umsetzung</label><select id="vb" name="build" class="sel" ${v && v.build === 'umgesetzt' ? 'disabled' : ''}><option value="nein" ${!v || v.build === 'nein' ? 'selected' : ''}>Nur festhalten, noch nichts bauen</option><option value="freigegeben" ${v && v.build === 'freigegeben' ? 'selected' : ''}>Zum Bauen freigeben (Claude setzt es beim nächsten Abgleich um)</option>${v && v.build === 'umgesetzt' ? '<option selected>Umgesetzt</option>' : ''}</select></div>
     <div class="fld" style="grid-column:1/-1"><label for="vn">Begründung (damit du später weißt, warum)</label><textarea id="vn" name="note" class="ta" maxlength="2000">${esc(v ? v.note : '')}</textarea></div>
     <div class="row"><button class="btn pri" type="submit">Urteil speichern</button>${v ? '<button class="btn ghost" type="button" data-a="reset">Urteil zurücknehmen</button>' : ''}</div></form></section>
   <section class="card"><h2>Prompt für die nächste Runde</h2><p class="muted">Kopiere den Text und gib ihn der jeweiligen KI. Sie legt ihre Antwort als Datei im Repository ab.</p>
    ${['claude', 'chatgpt'].map(au => `<details><summary>Für ${AUTOR[au]}</summary><pre class="prompt">${esc(prompt(t, au))}</pre><button class="btn sec sm" data-a="copy" data-au="${au}">Kopieren</button></details>`).join('')}</section>`;
  el.onsubmit = async e => {
    if (e.target.dataset.f !== 'verdict') return; e.preventDefault(); const d = new FormData(e.target);
    const row = { topic: t.id, status: d.get('status'), option: d.get('option') || null, note: (d.get('note') || '').trim(), decided_at: new Date().toISOString() };
    if (!(v && v.build === 'umgesetzt')) row.build = d.get('status') === 'entschieden' ? (d.get('build') || 'nein') : 'nein';
    const { error } = await sb.from('tribunal_verdicts').upsert(row);
    if (error) return toast(error.message, true);
    toast('Gespeichert.'); await load(); topic(el, id);
  };
  el.onclick = async e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    if (b.dataset.a === 'copy') { try { await navigator.clipboard.writeText(prompt(t, b.dataset.au)); toast('Kopiert.'); } catch { toast('Kopieren hat nicht geklappt, markiere den Text von Hand.', true); } }
    if (b.dataset.a === 'reset') { if (!confirm('Das Urteil wirklich zurücknehmen?')) return; const { error } = await sb.from('tribunal_verdicts').delete().eq('topic', t.id); if (error) return toast(error.message, true); await load(); topic(el, id); }
  };
}

function inbox() {
  const open = requests.filter(r => r.status === 'neu');
  return open.length ? `<section class="card"><h2>Posteingang: neue Fragen von dir</h2><p class="muted">Diese Fragen warten darauf, dass Claude sie beim nächsten Abgleich als Ordner anlegt. Danach geben Claude und ChatGPT ihre Positionen ab.</p>
   <ul class="reqs">${open.map(r => `<li><b>${esc(r.title)}</b><span class="muted"> · ${esc(fmtDate(r.created_at))}</span>${r.context ? `<br><span class="muted">${esc(r.context.slice(0, 220))}${r.context.length > 220 ? ' …' : ''}</span>` : ''} <button class="btn ghost sm" data-a="req-drop" data-id="${r.id}">Verwerfen</button></li>`).join('')}</ul></section>` : '';
}

function newQuestion(el) {
  el.innerHTML = `<div class="head"><div><h1>Neue Frage stellen</h1><p class="muted">Für Entscheidungen, bei denen du drei Meinungen willst: Claude, ChatGPT und deine eigene. Einfache Dinge bespricht Claude im Chat mit dir.</p></div></div>
   <form data-f="req" class="card"><div class="fld"><label for="rt">Frage als Titel</label><input id="rt" name="title" class="inp" required minlength="3" maxlength="160" placeholder="z. B. Soll Plus 3,99 € im Monat kosten?"></div>
    <div class="fld"><label for="rc">Worum geht es? (Kontext, Zahlen, was du schon weißt)</label><textarea id="rc" name="context" class="ta" maxlength="3000"></textarea></div>
    <div class="fld"><label for="ro">Optionen (eine pro Zeile, optional)</label><textarea id="ro" name="options" class="ta" maxlength="1500" placeholder="Option A\nOption B"></textarea><p class="hint">Ohne Optionen schlagen Claude und ChatGPT welche vor.</p></div>
    <div class="row"><button class="btn pri" type="submit">Frage abschicken</button></div></form>`;
  el.onsubmit = async e => {
    if (e.target.dataset.f !== 'req') return; e.preventDefault(); const d = new FormData(e.target);
    const { error } = await sb.from('tribunal_requests').insert({ title: d.get('title').trim(), context: (d.get('context') || '').trim(), options: (d.get('options') || '').trim() });
    if (error) return toast(error.message, true);
    toast('Abgeschickt. Claude legt sie beim nächsten Abgleich an.'); await load(); location.hash = '#offen';
  };
}

function queue(el) {
  const q = Object.values(verdicts).filter(v => v.build === 'freigegeben'), done = Object.values(verdicts).filter(v => v.build === 'umgesetzt').slice(0, 20);
  const row = v => { const t = topics.find(x => x.id === v.topic); return `<tr><td><a href="#t/${esc(v.topic)}"><b>${esc(t ? t.titel : v.topic)}</b></a><br><span class="muted">${esc(v.option && t ? optLabel(t, v.option) : 'eigene Lösung')}</span></td><td class="muted">${esc(v.note || '')}</td><td>${v.build === 'umgesetzt' ? esc(v.build_ref || '') + (v.built_at ? '<br><span class="muted">' + esc(fmtDate(v.built_at)) + '</span>' : '') : esc(fmtDate(v.decided_at))}</td></tr>`; };
  el.innerHTML = `<div class="head"><div><h1>Bauliste</h1><p class="muted">Aufträge, die du freigegeben hast. Gebaut wird erst, wenn du im Chat mit Claude „Abgleich“ sagst.</p></div></div>
   <section class="card"><h2>Wartet auf den Abgleich (${q.length})</h2><div class="tablewrap"><table><thead><tr><th>Entscheidung</th><th>Deine Begründung</th><th>Freigegeben</th></tr></thead><tbody>${q.map(row).join('') || '<tr><td colspan="3" class="muted">Nichts freigegeben.</td></tr>'}</tbody></table></div></section>
   <section class="card"><h2>Zuletzt umgesetzt</h2><div class="tablewrap"><table><thead><tr><th>Entscheidung</th><th>Deine Begründung</th><th>Stand</th></tr></thead><tbody>${done.map(row).join('') || '<tr><td colspan="3" class="muted">Noch nichts.</td></tr>'}</tbody></table></div></section>`;
}

function guide(el) {
  el.innerHTML = `<div class="head"><div><h1>So funktioniert das Tribunal</h1><p class="muted">Du, Claude und ChatGPT arbeiten über dasselbe Repository.</p></div></div>
   <section class="card"><ol class="steps"><li><b>Frage stellen.</b> Wer eine Entscheidung braucht, legt unter <code>docs/tribunal/&lt;nummer&gt;-&lt;kurzname&gt;/frage.md</code> eine Frage mit Optionen an.</li>
    <li><b>Unabhängig antworten.</b> Claude schreibt <code>claude.md</code>, ChatGPT schreibt <code>chatgpt.md</code>. Jeder liest die Position des anderen erst, nachdem die eigene steht.</li>
    <li><b>Lesen und entscheiden.</b> Hier siehst du beide Positionen nebeneinander, ob sie einig sind, und triffst dein Urteil. Es steht in der Datenbank.</li>
    <li><b>Nachhaken.</b> Mit dem Prompt-Knopf holst du eine zweite Runde (<code>claude-2.md</code>, <code>chatgpt-2.md</code>).</li>
    <li><b>Bauen lassen.</b> Stellst du das Urteil auf „Zum Bauen freigeben“, landet es in der Bauliste. Claude setzt es beim nächsten Abgleich um und trägt Umsetzung und Commit ein.</li></ol>
    <h3>Was hierher gehört und was im Chat bleibt</h3>
    <p>Hierher kommen Entscheidungen, bei denen drei Meinungen helfen: schwer rückgängig zu machen, kosten Geld, berühren Recht oder Datenschutz, ändern die Architektur oder das Geschäftsmodell, oder du möchtest es ausdrücklich. Alles Einfache (Wortlaut, Anordnung, kleine Gestaltung) bespricht Claude direkt mit dir im Chat.</p>
    <h3>Wer hat das letzte Wort?</h3>
    <p>Der Chat mit Claude bleibt deine zentrale Stelle. Diese Seite sammelt und hält Entscheidungen fest, sie startet von sich aus nichts. Mit „Abgleich“ im Chat liest Claude neue Fragen, Urteile und die Bauliste, fasst sie dir zusammen und baut, was freigegeben ist.</p>
    <p class="hint">Die Regeln und das Format stehen in <code>docs/tribunal/README.md</code> und <code>AGENTS.md</code>. Neue Dateien erscheinen hier nach dem nächsten Deploy. Die Seite ist nur für Admins sichtbar.</p></section>`;
}

async function show() {
  const key = location.hash.replace('#', '') || 'offen', el = shell.view;
  shell.current(key.startsWith('t/') ? 'offen' : key);
  el.onsubmit = el.onclick = null;
  try {
    if (!topics.length) await load();
    shell.badge('offen', topics.filter(t => stateOf(t).k === 'offen').length + requests.filter(r => r.status === 'neu').length);
    shell.badge('bauen', Object.values(verdicts).filter(v => v.build === 'freigegeben').length);
    if (key.startsWith('t/')) topic(el, key.slice(2));
    else if (key === 'entschieden') list(el, t => stateOf(t).k !== 'offen', 'Entschieden', 'Was du schon beantwortet oder vertagt hast.');
    else if (key === 'anleitung') guide(el);
    else if (key === 'neu') newQuestion(el);
    else if (key === 'bauen') queue(el);
    else { list(el, t => stateOf(t).k === 'offen', 'Offene Entscheidungen', 'Hier wartet etwas auf dein Urteil. Ein Klick zeigt Claude und ChatGPT nebeneinander.'); el.querySelector('.head').insertAdjacentHTML('afterend', inbox()); el.onclick = async e => { const b = e.target.closest('[data-a=req-drop]'); if (!b) return; const { error } = await sb.from('tribunal_requests').update({ status: 'verworfen' }).eq('id', b.dataset.id); if (error) return toast(error.message, true); await load(); show(); }; }
  } catch (e) { el.innerHTML = `<div class="banner warn2" role="alert"><b>Das konnte nicht geladen werden.</b> ${esc(e.message || e)}<br>Auf einer Vorschau ohne Server-Funktionen (npm run dev) geht das nicht, auf der echten Seite schon.</div>`; }
}

async function boot() {
  const st = await adminState().catch(() => ({ state: 'out' }));
  if (st.state === 'out') return loginView();
  if (st.state === 'denied') { root.innerHTML = `<main id="main" class="login"><div class="card"><h1>Kein Zugriff</h1><p class="muted">Das Konto ${esc(st.user.email || '')} ist nicht als Administrator freigegeben.</p><button class="btn" id="so">Abmelden</button></div></main>`; $('#so').onclick = async () => { await signOut(); loginView(); }; return; }
  shell = mountShell(root, { app: 'dev', user: st.user, onSignOut: async () => { await signOut(); loginView(); }, groups: [
    { title: 'Entscheiden', items: [['offen', 'Offen', 'list'], ['neu', 'Neue Frage', 'plus'], ['bauen', 'Bauliste', 'hammer'], ['entschieden', 'Entschieden', 'check']] },
    { title: 'Hilfe', items: [['anleitung', 'Anleitung', 'info']] },
  ] });
  window.addEventListener('hashchange', show); show();
}
boot().catch(e => { console.error(e); loginView('Die Verbindung hat nicht geklappt.'); });
