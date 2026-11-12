/*
 * Erkennung im Wunsch-Dialog, direkt unter dem Namensfeld. Drei Zustände (S.ui.wr.st):
 *  vague   – allgemeiner Wunsch: nur eine Hinweiszeile, keine Karten
 *  unsure  – gesucht, aber nichts Sicheres gefunden: ehrlicher Hinweis, nichts geht verloren
 *  loading – kleiner Platzhalter, der Dialog bleibt bedienbar
 *  found   – genau eine Karte „Das haben wir erkannt“ mit „Passt“ und „Nicht das Richtige“
 *  alts    – nach „Nicht das Richtige“: bis zu 4 anklickbare Alternativen
 *  none    – neutraler Hinweis (zum Beispiel Amazon-Link ohne lesbaren Namen)
 * Das Namensfeld wird nur nach einem Klick überschrieben.
 */
import { S } from '../state.js';
import { esc, ic, money } from '../lib/util.js';
import { cat } from '../data/content.js';
import { ideasOf, aiStatus } from '../lib/ideas.js';

export const draftKey = t => 'draft:' + String(t || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80);
/** Konkret genug für eine Erkennung: mindestens zwei Wörter. */
export const concrete = t => { const w = String(t || '').split(/\s+/).filter(x => /\p{L}{2,}|\d/u.test(x)); return w.length >= 2; };
export const altPrice = i => (i.from && i.to ? Math.round((i.from + i.to) / 2) : i.to || i.from || null);

const thumb = (img, c, t) => img && img.preview ? `<img src="${img.preview}" alt="">` : `<span class="art mono t${c.t % 6}" aria-hidden="true"><b>${esc(((String(t || '').match(/[\p{L}\p{N}]/u) || ['?'])[0]).toUpperCase())}</b></span>`;

export function WishRec() {
  const r = S.ui.wr;
  if (!r || !r.st) return '';
  const c = cat(r.c || 'wohnen');
  if (r.st === 'vague') return `<p class="wr-hint">${ic('spark', 'sm')}Wir zeigen deinen Freunden passende Ideen dazu.</p>`;
  if (r.st === 'unsure') return `<p class="wr-hint">${ic('spark', 'sm')}<span>${r.err ? 'Die Produktsuche hat gerade nicht geklappt.' : 'Wir haben dazu kein sicheres Produkt gefunden.'} Vielleicht gibt es mehrere passende Produkte: Schreib gern noch etwas dazu, zum Beispiel die Farbe, die Sorte oder die Größe (Essie Nagellack rot), oder füge den Link zu einem Shop ein. Dein Wunsch bleibt in jedem Fall, wie du ihn geschrieben hast, und deine Freunde sehen dazu passende Ideen von Wishtale.</span></p>`;
  if (r.st === 'none') return r.msg ? `<p class="wr-hint">${esc(r.msg)}</p>` : '';
  if (r.st === 'loading') return `<div class="wr-card wr-load scan" role="status" aria-live="polite"><span class="wr-thumb"><span class="wr-lens" aria-hidden="true"></span></span><span><b>Wishtale schaut, welches Produkt du meinst</b><span class="wr-steps" aria-hidden="true"><i>Name prüfen</i><i>Im Netz suchen</i><i>Titel, Preis und Bild vergleichen</i></span><small>Du kannst währenddessen weiter ausfüllen oder speichern.</small></span></div>`;
  if (r.st === 'found') {
    const k = r.cand;
    if (r.accepted) return `<p class="wr-hint ok">${ic('check', 'sm')}Übernommen: ${esc(k.t)}${k.price ? `, ${money(k.price)}` : ''}. Du kannst alles noch ändern.</p>`;
    return `<div class="wr-card" aria-live="polite"><span class="wr-thumb">${thumb(k.img, c, k.t)}</span>
     <span class="wr-body"><span class="eyebrow">Das haben wir erkannt${k.host ? ` · gefunden bei ${esc(k.host)}` : ''}</span><b>${esc(k.t)}</b>${k.price ? `<small>${k.est ? 'ca. ' : ''}${money(k.price)}${k.est ? ', üblicher Preis' : ''}</small>` : '<small>Preis noch offen</small>'}</span>
     <span class="wr-acts"><button type="button" class="btn pri sm" data-act="wraccept">Passt</button><button type="button" class="btn ghost sm" data-act="wrreject">Nicht das Richtige</button></span></div>`;
  }
  if (r.st === 'alts') {
    const key = draftKey(r.t), st = aiStatus(key), list = ideasOf(key).slice(0, 4);
    if (st === 'loading' || st === 'none') return `<div class="wr-card wr-load" role="status"><span class="wr-thumb"><span class="wr-lens" aria-hidden="true"></span></span><span><b>Wishtale sucht Alternativen …</b><small>Du kannst währenddessen weiter ausfüllen oder speichern.</small></span></div>`;
    if (!list.length) return `<p class="wr-hint">Dazu haben wir gerade keine Alternativen. Dein Wunsch bleibt so, wie du ihn geschrieben hast.</p>`;
    return `<div class="wr-alts"><p class="wr-sub">Optional: Produkt übernehmen</p>${list.map((i, n) => `<button type="button" class="wr-alt ${r.chosen === n ? 'on' : ''}" data-act="wrpick" data-i="${n}" aria-pressed="${r.chosen === n}"><span class="wr-check" aria-hidden="true">${r.chosen === n ? '✓' : ''}</span><span><b>${esc(i.t)}</b>${altPrice(i) ? `<small>ca. ${money(altPrice(i))}</small>` : ''}</span></button>`).join('')}</div>`;
  }
  return '';
}
