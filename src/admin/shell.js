/*
 * Gemeinsamer Rahmen für CMS und Entwickler-Seite: linke Seitenleiste wie in einem klassischen Arbeitswerkzeug.
 * Oben das Logo und der Wechsel zwischen den Bereichen, in der Mitte die Navigation in Gruppen, unten Konto und Abmelden.
 * Auf schmalen Bildschirmen wird die Leiste zum ausklappbaren Menü.
 */
import { esc } from './util.js';

const I = {
  home: '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8"/>',
  book: '<path d="M4 4h12a3 3 0 013 3v13H7a3 3 0 01-3-3zM4 17a3 3 0 013-3h12"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  mega: '<path d="M3 11v3a1 1 0 001 1h2l7 4V6L6 10H4a1 1 0 00-1 1zM17 8a5 5 0 010 8"/>',
  cam: '<rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/>',
  ads: '<path d="M3 17l5-6 4 3 8-9M15 5h5v5"/>',
  text: '<path d="M5 6h14M5 12h14M5 18h9"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M17 11a3 3 0 100-6M18.5 14.7c2 .5 3.2 2.2 3.5 5"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8zM7.5 8.5h.01"/>',
  coins: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  plug: '<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 01-12 0zM12 17v5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  hammer: '<path d="M14 6l4 4M5 19l9-9M11 3l3 3-5 5-3-3zM17 9l4 4"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.8"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
  out: '<path d="M10 4H5a1 1 0 00-1 1v14a1 1 0 001 1h5M15 8l4 4-4 4M19 12H9"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
};
export const icon = n => `<svg class="ic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ''}</svg>`;

/**
 * app: 'cms' | 'dev'. groups: [{ title, items: [[hash, label, iconName]] }]. Gibt das Element für den Inhalt zurück.
 */
export function mountShell(root, { app, groups, user, onSignOut }) {
  root.innerHTML = `<div class="app" data-app="${app}">
   <aside class="side" id="side" aria-label="Seitenleiste">
    <div class="side-top"><a class="mark" href="#${groups[0].items[0][0]}">wishtale<i></i></a></div>
    <div class="switch" role="group" aria-label="Bereich"><a href="${app === 'cms' ? '#' : '../cms/'}" ${app === 'cms' ? 'aria-current="true"' : ''}>CMS</a><a href="${app === 'dev' ? '#' : '../dev/'}" ${app === 'dev' ? 'aria-current="true"' : ''}>Entwickler</a></div>
    <nav class="side-nav" aria-label="${app === 'cms' ? 'CMS' : 'Entwickler'}">${groups.map(g => `<div class="side-g">${g.title ? `<p class="side-h">${esc(g.title)}</p>` : ''}${g.items.map(([k, l, ic]) => `<a class="side-a" href="#${k}" data-k="${k}">${icon(ic)}<span>${esc(l)}</span><b class="badge" hidden></b></a>`).join('')}</div>`).join('')}</nav>
    <div class="side-foot"><a class="side-a" href="../app/" target="_blank" rel="noopener">${icon('ext')}<span>Zur App</span></a>
     <div class="who"><span class="who-m" title="${esc(user?.email || '')}">${esc(user?.email || '')}</span><button class="side-a so" id="so" type="button">${icon('out')}<span>Abmelden</span></button></div></div>
   </aside>
   <div class="side-scrim" id="scrim" hidden></div>
   <div class="mainwrap"><header class="topbar"><button class="menu" id="menu" type="button" aria-controls="side" aria-expanded="false" aria-label="Menü öffnen">${icon('menu')}</button><span class="crumb" id="crumb"></span></header>
    <main id="main"><div id="view" class="view"></div></main></div></div>`;
  const side = root.querySelector('#side'), scrim = root.querySelector('#scrim'), btn = root.querySelector('#menu');
  const set = open => { side.classList.toggle('open', open); scrim.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
  btn.onclick = () => set(!side.classList.contains('open'));
  scrim.onclick = () => set(false);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  side.addEventListener('click', e => { if (e.target.closest('.side-nav a')) set(false); });
  root.querySelector('#so').onclick = onSignOut;
  return {
    view: root.querySelector('#view'),
    /** aktuellen Menüpunkt markieren und in der Kopfzeile (mobil) benennen */
    current(key) {
      let label = '';
      root.querySelectorAll('.side-nav a').forEach(a => { const on = a.dataset.k === key; a.setAttribute('aria-current', on ? 'page' : 'false'); if (on) label = a.querySelector('span').textContent; });
      root.querySelector('#crumb').textContent = label;
    },
    badge(key, n) { const b = root.querySelector(`.side-nav a[data-k="${key}"] .badge`); if (b) { b.textContent = n; b.hidden = !n; } },
  };
}
