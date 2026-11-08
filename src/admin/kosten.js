import { sb } from '../lib/supabase.js';
import { esc, toast, money } from './util.js';

const modelOf = key => (key.includes(':') ? key.split(':').slice(1).join(':') : 'früher (ohne Modellangabe)');
const featOf = key => key.split(':')[0];
const FEAT = { 'ideas.guest': 'Ideen für Gäste', 'ideas.self': 'Ideen in der Inspiration', 'ideas.wish': 'Produktvorschläge zum Wunsch', zettel: 'Wunschzettel einlesen' };
const n = v => new Intl.NumberFormat('de-DE').format(v);

export async function mount(el) {
  const [c, s, o, k] = await Promise.all([
    sb.rpc('admin_costs'), sb.from('settings').select('value').eq('key', 'llm_prices').maybeSingle(),
    sb.from('orders').select('amount_cents,paid_at,status').eq('status', 'paid'), sb.from('idea_cache').select('*', { count: 'exact', head: true }),
  ]);
  if (c.error) throw c.error;
  let prices = (s.data && s.data.value) || {};
  const rows = c.data, models = [...new Set(rows.map(r => modelOf(r.key)))];
  const cost = r => { const p = prices[modelOf(r.key)]; return p ? (r.tokens_in / 1e6) * (+p.in || 0) + (r.tokens_out / 1e6) * (+p.out || 0) : null; };
  const periods = [...new Set(rows.map(r => r.period))];
  const revenue = per => o.data.filter(x => (x.paid_at || '').startsWith(per)).reduce((a, x) => a + x.amount_cents, 0) / 100;
  el.innerHTML = `<div class="head"><div><h1>Kosten</h1><p class="muted">Verbrauch der KI-Aufrufe je Funktion und Modell. Trag unten die Preise aus der Anthropic-Console ein, dann rechnet das CMS die Kosten in Euro aus.</p></div></div>
   <section class="card"><h2>Preise je Modell (Euro pro 1 Million Token)</h2>
    <p class="muted">Du findest sie in der Anthropic-Console beim jeweiligen Modell. Die Eingabe-Token sind der Text, den Wishtale mitschickt, die Ausgabe-Token die Antwort. Rechne Dollar bitte selbst in Euro um.</p>
    <form data-f="prices"><div class="tablewrap"><table><thead><tr><th>Modell</th><th>Eingabe</th><th>Ausgabe</th></tr></thead><tbody>${models.map(m => `<tr><td>${esc(m)}</td>
     <td><input class="inp" name="in:${esc(m)}" inputmode="decimal" value="${esc(prices[m]?.in ?? '')}" aria-label="Eingabepreis ${esc(m)}" style="max-width:110px"></td>
     <td><input class="inp" name="out:${esc(m)}" inputmode="decimal" value="${esc(prices[m]?.out ?? '')}" aria-label="Ausgabepreis ${esc(m)}" style="max-width:110px"></td></tr>`).join('') || '<tr><td colspan="3" class="muted">Noch kein Verbrauch.</td></tr>'}</tbody></table></div>
     <div class="row"><button class="btn pri sm" type="submit">Preise speichern</button></div></form></section>
   ${periods.map(per => {
     const rs = rows.filter(r => r.period === per), tot = rs.reduce((a, r) => a + (cost(r) || 0), 0), known = rs.every(r => cost(r) != null), rev = revenue(per);
     return `<section class="card"><h2>${esc(per)}</h2><div class="stats">
      <div class="stat"><b>${n(rs.reduce((a, r) => a + r.calls, 0))}</b><span>KI-Aufrufe</span></div>
      <div class="stat"><b>${known ? money(tot) : '–'}</b><span>Kosten${known ? '' : ' (Preise fehlen)'}</span></div>
      <div class="stat"><b>${money(rev)}</b><span>Umsatz (bezahlt)</span></div>
      <div class="stat"><b>${known ? money(rev - tot) : '–'}</b><span>Rohertrag</span></div></div>
     <div class="tablewrap"><table><thead><tr><th>Funktion</th><th>Modell</th><th>Aufrufe</th><th>Konten</th><th>Token ein / aus</th><th>Kosten</th><th>je Aufruf</th></tr></thead><tbody>${rs.map(r => { const cc = cost(r); return `<tr><td>${esc(FEAT[featOf(r.key)] || featOf(r.key))}</td><td>${esc(modelOf(r.key))}</td><td>${n(r.calls)}</td><td>${n(r.accounts)}</td><td>${n(r.tokens_in)} / ${n(r.tokens_out)}</td><td>${cc == null ? '–' : money(cc)}</td><td>${cc == null ? '–' : money(cc / r.calls)}</td></tr>`; }).join('')}</tbody></table></div></section>`;
   }).join('') || '<p class="muted">Noch keine KI-Aufrufe gebucht.</p>'}
   <p class="muted">Im Zwischenspeicher liegen ${k.count ?? 0} fertige Antworten. Aufrufe mit unveränderter Eingabe kosten nichts und erscheinen hier nicht.</p>`;
  el.querySelector('[data-f=prices]').onsubmit = async e => {
    e.preventDefault(); const d = new FormData(e.target), next = {};
    for (const m of models) { const i = parseFloat(String(d.get('in:' + m)).replace(',', '.')), u = parseFloat(String(d.get('out:' + m)).replace(',', '.')); if (Number.isFinite(i) && Number.isFinite(u)) next[m] = { in: i, out: u }; }
    const { error } = await sb.from('settings').upsert({ key: 'llm_prices', value: next }); if (error) return toast(error.message, true);
    toast('Preise gespeichert.'); mount(el);
  };
}
