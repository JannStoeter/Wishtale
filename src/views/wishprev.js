/* Vorschau im Wunschformular: Wie sehen Freunde den Wunsch? Erscheint schon beim Anlegen, sobald ein Name da ist. */
import { S } from '../state.js';
import { esc } from '../lib/util.js';
import { art } from '../lib/art.js';
import { cat } from '../data/content.js';
import { searchUrl } from '../lib/shops.js';
import { ideasOf, aiStatus } from '../lib/ideas.js';
import { AiLoading } from './ailoading.js';

export const draftKey = t => 'draft:' + String(t || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80);
const REL = 'noopener noreferrer sponsored nofollow';

export function WishPrev(title, catId) {
  const t = String(title || '').trim();
  if (t.length < 3) return '';
  const c = cat(catId || 'wohnen'), key = draftKey(t), st = aiStatus(key), list = ideasOf(key);
  const price = i => (i.from && i.to ? `ca. ${i.from} bis ${i.to} €` : i.to ? `bis ca. ${i.to} €` : '');
  const ai = st === 'loading' ? AiLoading('Wishtale sucht passende Produkte …')
    : list.length ? `<p class="eyebrow" style="margin:12px 0 8px">Passende Produkte von Wishtale</p>${list.map(i => `<div class="aivar"><div><span class="eyebrow">Vorschlag von Wishtale</span><strong class="ot">${esc(i.t)}</strong>${price(i) ? `<span class="muted" style="font-size:13px;display:block">${price(i)}</span>` : ''}${i.why ? `<span class="muted" style="font-size:13px;display:block">${esc(i.why)}</span>` : ''}</div></div>`).join('')}` : '';
  return `<div class="wprev"><p class="eyebrow">${S.ui.wprevMsg || 'So sehen Freunde diesen Wunsch'}</p>
   <div class="wprev-card"><span class="wprev-art">${art(c.a, c.t)}</span><div><strong>${esc(t)}</strong><span class="muted" style="font-size:13px;display:block">Suche nach genau diesem Wunsch, Preis bei Amazon</span><a class="btn amz sm" style="margin-top:8px" href="${searchUrl.amazon(t)}" target="_blank" rel="${REL}">Bei Amazon suchen</a></div></div>
   ${ai}</div>`;
}
