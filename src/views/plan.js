/* Mein Plan: was dein Konto kann, was verbraucht wurde und was sich buchen lässt. */
import { S } from '../state.js';
import { esc } from '../lib/util.js';
import { FEATURES, PLANS, FREE_CORE } from '../lib/features.js';

const eur = c => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(c / 100);
const day = iso => new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
const every = i => (i === 'month' ? ' pro Monat' : i === 'year' ? ' pro Jahr' : '');

export function Plan() {
  if (!S.auth.user) return `<div class="wrap"><div class="pagehead"><h1>Mein Plan</h1><p class="muted">Melde dich an, dann siehst du hier, was dein Konto kann.</p></div></div>`;
  const p = S.plan;
  if (!p || !p.loaded) return `<div class="wrap"><div class="pagehead"><h1>Mein Plan</h1></div><p class="muted" role="status">Wird geladen …</p></div>`;
  const e = p.ent || { plan: 'free', features: [], usage: {} };
  const paid = !!e.paid_until || (e.plan === 'plus' && !e.founder_until);
  const founder = e.plan === 'plus' && !e.paid_until && e.founder_until && Date.parse(e.founder_until) > Date.now();
  const plusList = Object.values(FEATURES).filter(f => f.plan === 'plus').map(f => f.label);
  const calls = Object.entries(e.usage || {}).filter(([k]) => k.startsWith('ideas') || k.startsWith('zettel')).reduce((a, [, v]) => a + v.calls, 0);
  const status = founder
    ? `Du nutzt Wishtale Plus als Gründerin oder Gründer, kostenlos bis ${day(e.founder_until)}. Danach bleibt der Kern frei, und du entscheidest in Ruhe, ob du Plus buchen möchtest.`
    : e.plan === 'plus' ? `Du hast Wishtale Plus${e.paid_until ? ` bis ${day(e.paid_until)}` : ''}.` : 'Du nutzt Wishtale kostenlos. Das Wichtigste bleibt immer frei.';
  return `<div class="wrap"><div class="pagehead"><p class="eyebrow">Konto</p><h1>Mein Plan: ${esc(PLANS[e.plan] || e.plan)}</h1><p class="muted" style="max-width:620px">${esc(status)}</p></div>
   <div class="psec" style="margin-bottom:18px"><h3 aria-level="2">Immer frei</h3><ul class="plist">${FREE_CORE.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
   <div class="psec" style="margin-bottom:18px"><h3 aria-level="2">Mit Plus</h3><ul class="plist">${plusList.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    ${calls ? `<p class="muted" style="font-size:14px">In diesem Monat hat Wishtale ${calls} Mal für dich nachgedacht.</p>` : ''}</div>
   ${p.offers.length ? `<div class="psec"><h3 aria-level="2">Buchen</h3><div class="recs grid">${p.offers.map(o => `<article class="rec" style="display:block"><div><h3>${esc(o.title)}</h3><p class="why">${esc(o.description)}</p>
     <p><b>${eur(o.price_cents)}</b>${every(o.interval)} <span class="muted" style="font-size:13px">inkl. USt.</span></p>
     <div class="row"><button class="btn pri sm" data-act="buy" data-code="${esc(o.code)}" ${p.busy ? 'disabled' : ''}>${o.interval ? 'Abonnieren' : 'Buchen'}</button></div></div></article>`).join('')}</div></div>`
    : '<p class="muted">Buchbare Angebote erscheinen hier, sobald es welche gibt.</p>'}
   ${paid ? '<p style="margin-top:14px"><button class="btn ghost sm" data-act="portal" style="padding-left:0">Abo verwalten oder kündigen</button></p>' : ''}
   ${p.error ? `<p role="alert" style="color:var(--warn)">${esc(p.error)}</p>` : ''}
   <p class="disc" style="margin-top:18px">Preise verstehen sich inklusive Umsatzsteuer. Die Zahlung läuft über Stripe.</p></div>`;
}
