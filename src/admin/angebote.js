import { sb } from '../lib/supabase.js';
import { list, save, remove } from './api.js';
import { esc, toast, toLocal, fromLocal, fmtDate } from './util.js';
import { FEATURES } from '../lib/features.js';

const eur = c => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(c / 100);
const TEMPLATES = {
  plus_monat: { code: 'plus_monat', kind: 'plan', title: 'Wishtale Plus, monatlich', description: 'KI-Ideen für dich und deine Gäste, Produktvorschläge zu jedem Wunsch und das Einlesen von Wunschzetteln.', price_cents: 399, interval: 'month', grants: { plan: 'plus' } },
  plus_jahr: { code: 'plus_jahr', kind: 'plan', title: 'Wishtale Plus, jährlich', description: 'Alles aus Plus, zwölf Monate zum günstigeren Preis.', price_cents: 2900, interval: 'year', grants: { plan: 'plus' } },
  zettel_paket: { code: 'zettel_paket', kind: 'pack', title: 'Wunschzettel-Paket', description: 'Fünf Wunschzettel einlesen lassen, drei Monate gültig.', price_cents: 199, interval: null, grants: { features: ['zettel'], days: 90 } },
  weihnacht: { code: 'weihnacht', kind: 'pack', title: 'Weihnachtspaket', description: 'Alle KI-Funktionen bis zum Jahresende.', price_cents: 499, interval: null, grants: { features: ['ideas.guest', 'ideas.self', 'ideas.wish', 'zettel'], days: 60 } },
};
const state = o => (!o.active ? ['Aus', ''] : o.starts_at && Date.parse(o.starts_at) > Date.now() ? ['Geplant', 'gold'] : o.ends_at && Date.parse(o.ends_at) <= Date.now() ? ['Beendet', ''] : ['Läuft', 'ok']);
const grantText = g => [g.plan ? `Plan ${g.plan}` : '', ...(g.features || []).map(f => FEATURES[f]?.label || f), g.credits ? `${g.credits} Guthaben` : '', g.days ? `${g.days} Tage` : ''].filter(Boolean).join(', ') || 'nichts';

export async function mount(el) {
  let rows = [], edit = null, st = null;
  try { const { data: { session } } = await sb.auth.getSession(); const r = await fetch('/api/integrations', { headers: { authorization: 'Bearer ' + session.access_token } }); if (r.ok) st = (await r.json()).payments; } catch { /* Status bleibt unbekannt */ }
  const load = async () => { rows = await list('offers', 'sort', true); draw(); };
  const form = () => { const o = edit, g = o.grants || {}; return `<form class="card" data-f="offer" style="margin:16px 0"><h2>${o.id ? 'Angebot bearbeiten' : 'Neues Angebot'}</h2><div class="grid2">
    <div class="fld"><label for="o-c">Kürzel (klein, ohne Leerzeichen)</label><input id="o-c" name="code" class="inp" required pattern="[a-z0-9_]{3,40}" value="${esc(o.code)}" ${o.id ? 'readonly' : ''}></div>
    <div class="fld"><label for="o-t">Titel</label><input id="o-t" name="title" class="inp" required maxlength="80" value="${esc(o.title)}"></div>
    <div class="fld" style="grid-column:1/-1"><label for="o-d">Beschreibung</label><textarea id="o-d" name="description" class="ta" maxlength="400">${esc(o.description)}</textarea></div>
    <div class="fld"><label for="o-p">Preis in Euro (brutto, inkl. USt.)</label><input id="o-p" name="price" class="inp" required inputmode="decimal" value="${o.price_cents != null ? (o.price_cents / 100).toFixed(2).replace('.', ',') : ''}"></div>
    <div class="fld"><label for="o-i">Abrechnung</label><select id="o-i" name="interval" class="sel"><option value="">Einmalig</option><option value="month" ${o.interval === 'month' ? 'selected' : ''}>Monatlich (Abo)</option><option value="year" ${o.interval === 'year' ? 'selected' : ''}>Jährlich (Abo)</option></select></div>
    <div class="fld"><label for="o-pl">Plan</label><select id="o-pl" name="plan" class="sel"><option value="">Kein Plan</option><option value="plus" ${g.plan === 'plus' ? 'selected' : ''}>Plus</option></select></div>
    <div class="fld"><label for="o-cr">Guthaben (Aktionen)</label><input id="o-cr" name="credits" type="number" min="0" max="1000" class="inp" value="${g.credits || 0}"></div>
    <div class="fld" style="grid-column:1/-1"><span class="lb">Einzelrechte</span><div class="row" style="flex-wrap:wrap;gap:12px">${Object.entries(FEATURES).filter(([, f]) => f.plan !== 'free').map(([k, f]) => `<label><input type="checkbox" name="features" value="${k}" ${(g.features || []).includes(k) ? 'checked' : ''}> ${esc(f.label)}</label>`).join('')}</div></div>
    <div class="fld"><label for="o-dy">Laufzeit der Einzelrechte in Tagen (leer = unbefristet)</label><input id="o-dy" name="days" type="number" min="1" max="3650" class="inp" value="${g.days || ''}"></div>
    <div class="fld"><label for="o-s">Reihenfolge</label><input id="o-s" name="sort" type="number" class="inp" value="${o.sort || 0}"></div>
    <div class="fld"><label for="o-a">Buchbar ab (optional)</label><input id="o-a" name="starts" type="datetime-local" class="inp" value="${esc(toLocal(o.starts_at))}"></div>
    <div class="fld"><label for="o-e">Buchbar bis (optional)</label><input id="o-e" name="ends" type="datetime-local" class="inp" value="${esc(toLocal(o.ends_at))}"></div>
    <div class="fld" style="grid-column:1/-1"><label><input type="checkbox" name="active" ${o.active ? 'checked' : ''}> Angebot ist eingeschaltet (nur dann und im Zeitfenster sehen es Nutzer)</label></div></div>
    <div class="row"><button class="btn pri" type="submit">Speichern</button><button class="btn ghost" type="button" data-a="cancel">Abbrechen</button></div></form>`; };
  const draw = () => {
    el.innerHTML = `<div class="head"><div><h1>Angebote</h1><p class="muted">Pläne und Einzelaktionen, die Nutzer buchen können, samt Zeitfenster. Ein Angebot erscheint erst, wenn es eingeschaltet ist und im Zeitraum liegt.</p></div><button class="btn pri" data-a="new">Neues Angebot</button></div>
     <div class="banner ${st && st.configured ? '' : 'warn2'}">${st && st.configured ? '<b>Zahlungen sind verbunden.</b> Buchungen laufen über Stripe.' : `<b>Bezahlen ist noch nicht freigeschaltet.</b> Buchungen starten erst, wenn in Vercel <code>STRIPE_SECRET_KEY</code> ${st && st.secret ? '(gesetzt)' : '(fehlt)'} und <code>STRIPE_WEBHOOK_SECRET</code> ${st && st.webhook ? '(gesetzt)' : '(fehlt)'} eingetragen sind. In Stripe richtest du den Webhook auf <code>/api/stripe-webhook</code> ein (Ereignisse: checkout.session.completed, invoice.paid, customer.subscription.deleted).`}</div>
     <p class="muted">Vorlagen zum Befüllen (Preise sind Platzhalter, nichts wird ohne Speichern angelegt):
      ${Object.entries(TEMPLATES).map(([k, t]) => `<button class="btn ghost sm" data-a="tpl" data-k="${k}">${esc(t.title)}</button>`).join(' ')}</p>
     ${edit ? form() : ''}
     <div class="tablewrap"><table><thead><tr><th>Angebot</th><th>Preis</th><th>Inhalt</th><th>Zeitraum</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(o => { const [l, c] = state(o); return `<tr><td><b>${esc(o.title)}</b><br><span class="muted"><code>${esc(o.code)}</code></span></td>
      <td>${eur(o.price_cents)}${o.interval === 'month' ? ' / Monat' : o.interval === 'year' ? ' / Jahr' : ''}</td><td class="muted">${esc(grantText(o.grants || {}))}</td>
      <td class="muted">${o.starts_at ? esc(fmtDate(o.starts_at)) : 'sofort'} bis ${o.ends_at ? esc(fmtDate(o.ends_at)) : 'offen'}</td><td><span class="pill ${c}">${l}</span></td>
      <td class="actions"><button class="btn sec sm" data-a="edit" data-id="${o.id}">Bearbeiten</button> <button class="btn ghost sm" data-a="toggle" data-id="${o.id}">${o.active ? 'Ausschalten' : 'Einschalten'}</button> <button class="btn ghost sm" data-a="del" data-id="${o.id}">Löschen</button></td></tr>`; }).join('') || '<tr><td colspan="6" class="muted">Noch keine Angebote.</td></tr>'}</tbody></table></div>`;
  };
  el.onsubmit = async e => {
    if (e.target.dataset.f !== 'offer') return; e.preventDefault(); const d = new FormData(e.target);
    const price = parseFloat(String(d.get('price')).replace(',', '.'));
    if (!Number.isFinite(price) || price < 0) return toast('Bitte gib einen gültigen Preis ein.', true);
    const grants = {}; if (d.get('plan')) grants.plan = d.get('plan'); const fs = d.getAll('features'); if (fs.length) grants.features = fs;
    const cr = parseInt(d.get('credits'), 10); if (cr > 0) grants.credits = cr; const dy = parseInt(d.get('days'), 10); if (dy > 0) grants.days = dy;
    if (!Object.keys(grants).length) return toast('Das Angebot muss mindestens einen Plan, ein Recht oder Guthaben geben.', true);
    const row = { ...(edit.id ? { id: edit.id } : {}), code: d.get('code'), kind: grants.plan ? 'plan' : 'pack', title: d.get('title').trim(), description: (d.get('description') || '').trim(), price_cents: Math.round(price * 100), interval: d.get('interval') || null, grants, active: d.get('active') === 'on', starts_at: fromLocal(d.get('starts')), ends_at: fromLocal(d.get('ends')), sort: parseInt(d.get('sort'), 10) || 0 };
    try { await save('offers', row); edit = null; toast('Gespeichert.'); await load(); } catch (err) { toast(err.message || 'Das hat nicht geklappt.', true); }
  };
  el.onclick = async e => {
    const b = e.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a, o = rows.find(r => r.id === b.dataset.id);
    try {
      if (a === 'new') { edit = { code: '', title: '', description: '', price_cents: null, interval: null, grants: {}, active: false, sort: rows.length }; return draw(); }
      if (a === 'tpl') { edit = { ...TEMPLATES[b.dataset.k], active: false, sort: rows.length }; return draw(); }
      if (a === 'cancel') { edit = null; return draw(); }
      if (a === 'edit') { edit = { ...o }; return draw(); }
      if (a === 'toggle') { await save('offers', { id: o.id, active: !o.active }); return load(); }
      if (a === 'del') { if (!confirm('Angebot wirklich löschen? Bereits bezahlte Bestellungen bleiben erhalten.')) return; await remove('offers', o.id); return load(); }
    } catch (err) { toast(err.message || 'Das hat nicht geklappt.', true); }
  };
  await load();
}
