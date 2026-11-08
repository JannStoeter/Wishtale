import { sb } from '../lib/supabase.js';
import { esc, toast, fmtDate, toLocal, fromLocal } from './util.js';
import { FEATURES, PLANS } from '../lib/features.js';

const DAY = 864e5;
const what = e => (e.kind === 'plan' ? `Plan ${PLANS[e.key] || e.key}` : e.kind === 'credit' ? `${e.quantity} Guthaben` : `Recht: ${FEATURES[e.key]?.label || e.key}`);

export async function mount(el) {
  let found = null, ents = [];
  const plans = (await sb.from('settings').select('value').eq('key', 'plans').maybeSingle()).data?.value || {};
  const loadEnts = async uid => { const { data } = await sb.from('entitlements').select('*').eq('user_id', uid).order('created_at', { ascending: false }); ents = data || []; };
  const draw = () => {
    el.innerHTML = `<div class="head"><div><h1>Konten und Pläne</h1><p class="muted">Hier legst du fest, wer was nutzen darf. Durchgesetzt wird auf dem Server, nicht in der App.</p></div></div>
     <section class="card"><h2>Gründerphase</h2>
      <p class="muted">Solange dieses Datum in der Zukunft liegt, haben alle Konten Plus, auch ohne Buchung. Danach gilt für alle ohne Buchung der kostenlose Plan. Kündige die Umstellung vorher an und stelle erst dann um, wenn Zahlungen und rechtliche Texte bereit sind.</p>
      <form data-f="founder" class="row"><label class="sr" for="fu">Ende der Gründerphase</label><input id="fu" name="until" type="datetime-local" class="inp" style="max-width:260px" value="${esc(toLocal(plans.founder_until))}"><button class="btn pri sm" type="submit">Speichern</button>
      <button class="btn ghost sm" type="button" data-a="founder-off">Gründerphase jetzt beenden</button></form></section>
     <section class="card"><h2>Was ist wo frei?</h2><div class="tablewrap"><table><thead><tr><th>Funktion</th><th>Ab Plan</th></tr></thead><tbody>${Object.entries(FEATURES).map(([k, f]) => `<tr><td>${esc(f.label)}<br><span class="muted"><code>${esc(k)}</code></span></td><td><span class="pill ${f.plan === 'free' ? 'ok' : 'gold'}">${esc(PLANS[f.plan])}</span></td></tr>`).join('')}</tbody></table></div>
      <p class="hint">Die Zuordnung steht im Code (<code>api/_lib/entitlements.js</code> und <code>src/lib/features.js</code>). Eine Änderung braucht einen Deploy, damit Server und Anzeige zusammenpassen.</p></section>
     <section class="card"><h2>Rechte vergeben</h2>
      <form data-f="find" class="row"><label class="sr" for="fe">E-Mail</label><input id="fe" name="email" type="email" class="inp" required placeholder="E-Mail-Adresse des Kontos" style="max-width:340px"><button class="btn sec sm" type="submit">Konto suchen</button></form>
      ${found === false ? '<p class="muted">Zu dieser Adresse gibt es kein Konto.</p>' : ''}
      ${found ? `<div style="margin-top:12px"><p><b>${esc(found.email)}</b> <span class="muted">seit ${esc(fmtDate(found.created_at))}</span></p>
       <div class="tablewrap"><table><thead><tr><th>Recht</th><th>Quelle</th><th>Gültig bis</th><th></th></tr></thead><tbody>${ents.map(e => `<tr><td>${esc(what(e))}</td><td>${esc(e.source)}</td><td>${e.valid_until ? esc(fmtDate(e.valid_until)) : 'unbefristet'}</td><td class="actions"><button class="btn ghost sm" data-a="revoke" data-id="${e.id}">Entziehen</button></td></tr>`).join('') || '<tr><td colspan="4" class="muted">Keine eigenen Rechte. Es gilt der Plan der Gründerphase oder der kostenlose Plan.</td></tr>'}</tbody></table></div>
       <form data-f="grant" class="grid2" style="margin-top:12px">
        <div class="fld"><label for="gk">Was</label><select id="gk" name="what" class="sel"><option value="plan:plus">Plan Plus</option>${Object.entries(FEATURES).filter(([, f]) => f.plan !== 'free').map(([k, f]) => `<option value="feature:${k}">Recht: ${esc(f.label)}</option>`).join('')}<option value="credit:credits">Guthaben (Aktionen)</option></select></div>
        <div class="fld"><label for="gq">Menge (nur bei Guthaben)</label><input id="gq" name="qty" type="number" min="1" max="1000" class="inp" value="5"></div>
        <div class="fld"><label for="gd">Laufzeit in Tagen (leer = unbefristet)</label><input id="gd" name="days" type="number" min="1" max="3650" class="inp" placeholder="z. B. 90"></div>
        <div class="row" style="align-items:end"><button class="btn pri sm" type="submit">Vergeben</button></div></form></div>` : ''}</section>`;
  };
  el.onsubmit = async e => {
    const t = e.target.dataset.f; if (!t) return; e.preventDefault(); const d = new FormData(e.target);
    try {
      if (t === 'founder') { const iso = fromLocal(d.get('until')); const { error } = await sb.from('settings').upsert({ key: 'plans', value: { ...plans, founder_until: iso } }); if (error) throw error; plans.founder_until = iso; toast('Gespeichert.'); }
      if (t === 'find') { const { data, error } = await sb.rpc('admin_find_user', { p_email: d.get('email') }); if (error) throw error; found = data && data[0] ? data[0] : false; if (found) await loadEnts(found.id); }
      if (t === 'grant') {
        const [kind, key] = String(d.get('what')).split(':'), days = parseInt(d.get('days'), 10);
        const row = { user_id: found.id, kind, key, source: 'admin', valid_until: days > 0 ? new Date(Date.now() + days * DAY).toISOString() : null, ...(kind === 'credit' ? { quantity: parseInt(d.get('qty'), 10) || 1 } : {}) };
        const { error } = await sb.from('entitlements').insert(row); if (error) throw error; await loadEnts(found.id); toast('Vergeben.');
      }
    } catch (err) { toast(err.message || 'Das hat nicht geklappt.', true); }
    draw();
  };
  el.onclick = async e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    try {
      if (b.dataset.a === 'revoke') { if (!confirm('Dieses Recht wirklich entziehen?')) return; const { error } = await sb.from('entitlements').delete().eq('id', b.dataset.id); if (error) throw error; await loadEnts(found.id); }
      if (b.dataset.a === 'founder-off') { if (!confirm('Die Gründerphase jetzt beenden? Alle Konten ohne Buchung wechseln sofort in den kostenlosen Plan.')) return; const iso = new Date().toISOString(); const { error } = await sb.from('settings').upsert({ key: 'plans', value: { ...plans, founder_until: iso } }); if (error) throw error; plans.founder_until = iso; }
    } catch (err) { toast(err.message || 'Das hat nicht geklappt.', true); }
    draw();
  };
  draw();
}
