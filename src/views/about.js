/* Info-Welt: Tipp auf den Profilkopf öffnet ein Fenster, das die Person in kleinen Kapiteln vorstellt. */
import { S, initials, guestPerson } from '../state.js';
import { esc, gen } from '../lib/util.js';
import { art } from '../lib/art.js';
import { ABOUT, cat } from '../data/content.js';
import { ownedOf } from '../logic.js';
import { voucherLink } from '../lib/shops.js';
import { ageText } from '../lib/age.js';
import { instagramUrl } from '../lib/social.js';

const and = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' und ' + a[a.length - 1] : a[0] || '';

export function AboutModal() {
  const ctx = S.ui.aboutCtx || 'guest';
  const p = ctx === 'guest' ? guestPerson() : S.me;
  if (!p) return '';
  const own = ctx === 'own';
  const hide = k => own && p.vis && p.vis[k] === 'privat';
  const n = esc(p.name);
  const about = p.about || ABOUT[p.id] || '';
  const ints = hide('interests') ? [] : p.interests || [];
  const brands = hide('brands') ? [] : p.brands || [];
  const tries = p.tries || [];
  const nogos = hide('nogos') ? [] : p.nogos || [];
  const owned = ownedOf(p).filter(w => w.vis !== 'privat').map(w => w.t);
  const soc = p.social || {};
  const ch = (k, t, inner) => inner ? `<section class="ab-ch"><p class="ab-k"><span>${k}</span>${t}</p>${inner}</section>` : '';
  let i = 0; const no = () => String(++i).padStart(2, '0');

  const sIn = ints.length ? `<p class="ab-big">${ints.map(x => `<span>${esc(x)}</span>`).join('<i aria-hidden="true">·</i>')}</p>` : '';
  const sWorld = p.cats?.length ? `<div class="ab-worlds">${p.cats.map(id => { const c = cat(id); return c ? `<button class="ab-world" data-act="world" data-id="${c.id}" data-ctx="${own ? 'own' : 'guest'}" aria-label="Welt ${esc(c.n)} öffnen">${art(c.a, c.t)}<span>${esc(c.n)}</span></button>` : ''; }).join('')}</div><p class="ab-note">Tippe auf eine Welt, dann erzählen wir dir, was dazu passen könnte.</p>` : '';
  const sBrand = brands.length ? `<div class="ab-brands">${brands.map(b => `<span>${esc(b)}</span>`).join('')}</div>` : '';
  const sTry = tries.length ? `<p class="ab-try">${n} möchte gern einmal <b>${esc(and(tries))}</b> ausprobieren. Damit machst du ein Erlebnis daraus, an das ${n} sich erinnert.</p>` : '';
  const sSize = p.size ? `<p class="ab-try">${n} trägt zurzeit <b>${esc(p.size)}</b>. Das hilft bei Kleidung und Schuhen, und Kinder wachsen schnell: Im Zweifel lieber eine Nummer größer.</p>` : '';
  const sKnow = (nogos.length || owned.length) ? `<div class="ab-two">
    ${nogos.length ? `<div class="ab-col no"><h3>Lieber nicht</h3><ul>${nogos.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
    ${owned.length ? `<div class="ab-col ok"><h3>Hat ${n} schon</h3><ul>${owned.slice(0, 14).map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
   </div>` : '';
  const sInsp = (soc.pinterest || soc.instagram) ? `<p class="ab-note" style="margin-top:0">Hier sammelt ${n} Ideen und Fundstücke. Ein Blick darauf verrät oft mehr als jede Wunschliste.</p><div class="row" style="gap:8px">${soc.pinterest ? `<button class="btn sec sm" data-act="pins" data-ctx="${own ? 'own' : 'guest'}">Pins ansehen</button><a class="chip" href="${esc(soc.pinterest)}" target="_blank" rel="noopener noreferrer">Pinterest ↗</a>` : ''}${soc.instagram ? `<a class="chip" href="${esc(instagramUrl(soc.instagram))}" target="_blank" rel="noopener noreferrer">Instagram @${esc(soc.instagram)} ↗</a>` : ''}</div>` : '';
  const alts = p.alts || [];
  const sAlt = alts.length ? `<div class="chips">${alts.map(a => { const v = voucherLink(a); return `<a class="chip ok" href="${v.url}" target="_blank" rel="noopener noreferrer${v.ad ? ' sponsored nofollow' : ''}">${esc(a)} ↗</a>`; }).join('')}</div>${alts.some(a => voucherLink(a).ad) ? '<span class="ad">Enthält Anzeige (Amazon-Partnerlink)</span>' : ''}` : '';

  return `<div class="scrim" data-act="closebg"><div class="sheet wide ab" role="dialog" aria-modal="true" aria-labelledby="mt">
   <div class="ab-hero">
    <button class="ab-x" data-act="close" aria-label="Schließen">×</button>
    <span class="av t${p.tone}">${initials(p.name)}</span>
    <p class="eyebrow">${p.managed ? `Kind-Konto${p.age != null ? ', ' + ageText(p.age) : ''}` : 'Eine kleine Geschichte über'}</p>
    <h2 id="mt">${n}</h2>
    ${about ? `<blockquote>${esc(about)}</blockquote>` : ints.length ? `<blockquote>${n} liebt ${esc(and(ints.slice(0, 3)))}.</blockquote>` : ''}
   </div>
   <div class="ab-body">
    ${ch(sIn ? no() : '', `Was ${n} begeistert`, sIn)}
    ${ch(sWorld ? no() : '', `${esc(gen(p.name))} Welten`, sWorld)}
    ${ch(sBrand ? no() : '', 'Lieblingsmarken', sBrand)}
    ${ch(sTry ? no() : '', 'Einmal ausprobieren', sTry)}
    ${ch(sSize ? no() : '', 'Aktuelle Größe', sSize)}
    ${ch(sKnow ? no() : '', 'Gut zu wissen', sKnow)}
    ${ch(sInsp ? no() : '', `Das inspiriert ${n}`, sInsp)}
    ${ch(sAlt ? no() : '', 'Wenn nichts passt', sAlt ? `<p class="ab-note" style="margin-top:0">Damit liegst du bei ${n} trotzdem richtig:</p>${sAlt}` : '')}
    <div class="row" style="justify-content:center;margin-top:8px"><button class="btn pri" data-act="close">Zurück zur Wunschliste</button></div>
   </div>
  </div></div>`;
}
