import { sb } from '../lib/supabase.js';
import { list, save, remove } from './api.js';
import { esc, toast } from './util.js';
import { CATS, CATALOG } from '../data/content.js';
import { searchUrl } from '../lib/shops.js';

const STATUS = { draft: ['Entwurf', ''], approved: ['Freigegeben', 'ok'], hidden: ['Ausgeblendet', ''] };
const price = r => (r.price_to ? `${r.price_from ? r.price_from + ' bis ' : 'bis '}${r.price_to} €` : '');

export async function mount(el) {
  let rows = [], cand = null, busy = false, f = { world: 'genuss', topic: '', n: 10 }, flt = { world: 'alle', status: 'alle' };
  const load = async () => { rows = await list('catalog_items', 'created_at', false); draw(); };
  const fixed = id => CATALOG.filter(i => i.c === id).length;
  const coverage = () => `<section class="card"><h2>Wie voll ist der Katalog?</h2><p class="muted">Je Welt: feste Ideen im Code, freigegebene Einträge und offene Entwürfe. Welten mit wenigen Einträgen führen schnell zu immer gleichen Vorschlägen.</p>
    <div class="tablewrap"><table><thead><tr><th>Welt</th><th>Fest</th><th>Freigegeben</th><th>Entwurf</th><th></th></tr></thead><tbody>${CATS.map(c => {
      const a = rows.filter(r => r.world === c.id && r.status === 'approved').length, d = rows.filter(r => r.world === c.id && r.status === 'draft').length, tot = fixed(c.id) + a;
      return `<tr><td><b>${esc(c.n)}</b></td><td>${fixed(c.id)}</td><td>${a}</td><td>${d}</td><td>${tot < 12 ? '<span class="pill gold">Wenig</span>' : '<span class="pill ok">Gut</span>'}</td></tr>`;
    }).join('')}</tbody></table></div></section>`;
  const gen = () => `<section class="card"><h2>Neue Einträge schreiben lassen</h2>
    <p class="muted">Die KI schlägt etablierte Produktlinien mit Eigenschaften vor. Du prüfst sie, danach erscheinen sie ohne weitere Kosten in der App. Die Vorschläge kennen kein Live-Angebot, prüfe deshalb Lieferbarkeit und Ruf über den Link „Bei Amazon prüfen“.</p>
    <form data-f="gen" class="grid2">
     <div class="fld"><label for="g-w">Welt</label><select id="g-w" name="world" class="sel">${CATS.map(c => `<option value="${c.id}" ${f.world === c.id ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select></div>
     <div class="fld"><label for="g-n">Anzahl</label><input id="g-n" name="n" class="inp" type="number" min="3" max="15" value="${f.n}"></div>
     <div class="fld" style="grid-column:1/-1"><label for="g-t">Schwerpunkt (optional)</label><input id="g-t" name="topic" class="inp" maxlength="200" placeholder="z. B. Geschenke bis 40 Euro für Kaffeeliebhaber" value="${esc(f.topic)}"></div>
     <div class="row"><button class="btn pri" type="submit" ${busy ? 'disabled' : ''}>${busy ? 'Wird geschrieben …' : 'Entwürfe schreiben lassen'}</button></div></form></section>`;
  const candidates = () => cand ? `<section class="card"><h2>Zum Prüfen (${cand.length})</h2>
    ${cand.length ? `<div class="tablewrap"><table><thead><tr><th></th><th>Eintrag</th><th>Preis</th><th>Hinweis zur Prüfung</th><th></th></tr></thead><tbody>${cand.map((c, i) => `<tr><td><input type="checkbox" data-i="${i}" ${c.on ? 'checked' : ''} aria-label="Auswählen"></td>
     <td><b>${esc(c.title)}</b><br><span class="muted">${esc(c.brand || 'ohne Marke')} · ${c.kind === 'erlebnis' ? 'Erlebnis' : 'Geschenk'} · ${esc(c.tags.join(', '))}</span></td><td>${esc(price(c))}</td><td class="muted">${esc(c.note)}</td>
     <td><a class="btn ghost sm" href="${esc(searchUrl.amazon(c.search))}" target="_blank" rel="noopener noreferrer">Bei Amazon prüfen</a></td></tr>`).join('')}</tbody></table></div>
     <div class="row"><button class="btn pri sm" data-a="cand-save" data-s="approved">Ausgewählte freigeben</button><button class="btn sec sm" data-a="cand-save" data-s="draft">Ausgewählte als Entwurf speichern</button><button class="btn ghost sm" data-a="cand-drop">Verwerfen</button></div>`
     : '<p class="muted">Die KI hat nichts Neues geliefert, das noch nicht im Katalog steht. Versuche einen anderen Schwerpunkt.</p>'}</section>` : '';
  const table = () => {
    const shown = rows.filter(r => (flt.world === 'alle' || r.world === flt.world) && (flt.status === 'alle' || r.status === flt.status));
    return `<section class="card"><h2>Einträge (${shown.length})</h2>
     <div class="row"><label class="sr" for="fw">Welt</label><select id="fw" class="sel" data-flt="world" style="max-width:220px"><option value="alle">Alle Welten</option>${CATS.map(c => `<option value="${c.id}" ${flt.world === c.id ? 'selected' : ''}>${esc(c.n)}</option>`).join('')}</select>
      <label class="sr" for="fs">Status</label><select id="fs" class="sel" data-flt="status" style="max-width:200px"><option value="alle">Alle</option>${Object.entries(STATUS).map(([k, [l]]) => `<option value="${k}" ${flt.status === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
     <div class="tablewrap"><table><thead><tr><th>Eintrag</th><th>Welt</th><th>Preis</th><th>Status</th><th></th></tr></thead><tbody>${shown.map(r => `<tr><td><b>${esc(r.title)}</b><br><span class="muted">${esc(r.brand || 'ohne Marke')} · ${esc(r.note)}</span></td>
      <td>${esc((CATS.find(c => c.id === r.world) || {}).n || r.world)}</td><td>${esc(price(r))}</td><td><span class="pill ${STATUS[r.status][1]}">${STATUS[r.status][0]}</span></td>
      <td class="actions"><a class="btn ghost sm" href="${esc(searchUrl.amazon(r.search || r.title))}" target="_blank" rel="noopener noreferrer">Prüfen</a>
       ${r.status !== 'approved' ? `<button class="btn pri sm" data-a="set" data-id="${r.id}" data-s="approved">Freigeben</button>` : `<button class="btn sec sm" data-a="set" data-id="${r.id}" data-s="hidden">Ausblenden</button>`}
       <button class="btn ghost sm" data-a="del" data-id="${r.id}">Löschen</button></td></tr>`).join('') || '<tr><td colspan="5" class="muted">Noch keine Einträge.</td></tr>'}</tbody></table></div></section>`;
  };
  const draw = () => {
    el.innerHTML = `<div class="head"><div><h1>Katalog</h1><p class="muted">Der Katalog speist die kostenlosen Vorschläge. Die KI schreibt Entwürfe, du gibst frei, und jeder Eintrag kostet nur einmal.</p></div></div>${coverage()}${gen()}${candidates()}${table()}`;
  };
  el.onsubmit = async e => {
    if (e.target.dataset.f !== 'gen') return;
    e.preventDefault();
    const d = new FormData(e.target); f = { world: d.get('world'), topic: (d.get('topic') || '').trim(), n: +d.get('n') || 10 };
    busy = true; draw();
    try {
      const { data: { session } } = await sb.auth.getSession();
      const existing = [...rows.filter(r => r.world === f.world).map(r => r.title), ...CATALOG.filter(i => i.c === f.world).map(i => i.t)];
      const r = await fetch('/api/catalog-gen', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ ...f, existing }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Das hat nicht geklappt.');
      cand = j.items.map(c => ({ ...c, on: true }));
    } catch (err) { toast(err.message, true); }
    busy = false; draw();
  };
  el.onchange = e => {
    if (e.target.dataset.i != null) cand[+e.target.dataset.i].on = e.target.checked;
    if (e.target.dataset.flt) { flt[e.target.dataset.flt] = e.target.value; draw(); }
  };
  el.onclick = async e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    try {
      if (b.dataset.a === 'cand-drop') { cand = null; return draw(); }
      if (b.dataset.a === 'cand-save') {
        const sel = cand.filter(c => c.on).map(({ on, ...c }) => ({ ...c, status: b.dataset.s }));
        if (!sel.length) return toast('Bitte wähle mindestens einen Eintrag aus.', true);
        const { error } = await sb.from('catalog_items').insert(sel); if (error) throw error;
        cand = null; toast(`${sel.length} ${sel.length === 1 ? 'Eintrag' : 'Einträge'} gespeichert.`); return load();
      }
      if (b.dataset.a === 'set') { await save('catalog_items', { id: b.dataset.id, status: b.dataset.s }); return load(); }
      if (b.dataset.a === 'del') { if (!confirm('Eintrag wirklich löschen?')) return; await remove('catalog_items', b.dataset.id); return load(); }
    } catch (err) { toast(err.message || 'Das hat nicht geklappt.', true); }
  };
  await load();
}
