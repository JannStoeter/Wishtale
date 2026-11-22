import { sb } from '../lib/supabase.js';
import { esc } from './util.js';

const nf = n => new Intl.NumberFormat('de-DE').format(+n || 0);
const pct = (a, b) => (b > 0 ? Math.round(a / b * 100) + ' %' : '–');
const AREA = { landing: 'Landingpage', app: 'Eigene App', guest: 'Gast-Link' };
const DEV = { mobile: 'Handy', desktop: 'Computer', tablet: 'Tablet', unbekannt: 'Unbekannt' };
const day = d => new Date(d + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });

export async function mount(el) {
  let days = 30, data = null, err = '';
  const load = async () => {
    el.innerHTML = head() + '<p class="muted">Wird geladen …</p>';
    const [{ data: d, error }, dv] = await Promise.all([sb.rpc('admin_usage', { p_days: days }), sb.rpc('admin_usage_devices', { p_days: days })]);
    if (error) { err = error.message; data = null; } else { data = d; data.byArea = dv.error ? null : dv.data; err = ''; }
    draw();
  };
  const head = () => `<div class="head"><div><h1>Auswertung</h1><p class="muted">So wird Wishtale genutzt. Die Zahlen kommen ohne Cookies und ohne Wiedererkennung einzelner Menschen zustande.</p></div>
    <div class="seg" role="group" aria-label="Zeitraum">${[7, 30, 90].map(n => `<button class="btn ${days === n ? 'pri' : 'sec'} sm" data-days="${n}">${n} Tage</button>`).join(' ')}</div></div>`;
  const bars = (rows, key, label) => {
    const max = Math.max(1, ...rows.map(r => +r[key]));
    return `<div class="bars" role="img" aria-label="${label}">${rows.map(r => `<span class="cbar" title="${day(r.d)}: ${nf(r[key])}"><i style="height:${Math.max(2, Math.round(+r[key] / max * 100))}%"></i></span>`).join('')}</div>
     <div class="barsx"><span>${day(rows[0].d)}</span><span>${day(rows[rows.length - 1].d)}</span></div>`;
  };
  const table = (title, rows, cols) => `<section class="card"><h2>${title}</h2>${rows.length ? `<table><tbody>${rows.map(r => `<tr>${cols.map((c, i) => `<td ${i ? 'style="text-align:right"' : ''}>${c(r)}</td>`).join('')}</tr>`).join('')}</tbody></table>` : '<p class="muted">Noch keine Daten.</p>'}</section>`;
  const draw = () => {
    if (err) { el.innerHTML = head() + `<div class="banner warn2" role="alert"><b>Die Auswertung konnte nicht geladen werden.</b> ${esc(err)}<br>Falls die Datenbank-Änderung <code>0011_usage.sql</code> noch fehlt, wende sie zuerst an.</div>`; bind(); return; }
    const f = data.funnel, t = data.totals;
    const steps = [
      ['Besucher der Startseite', f.visitors, 'Pro Tag gezählt. Wer an drei Tagen kommt, zählt dreimal.'],
      ['Klick auf „Wishtale erstellen“ oder „Anmelden“', f.cta, ''],
      ['Einrichtung gestartet', f.start, ''],
      ['Konto-Formular abgeschickt', f.submit, 'Ein Teil bestätigt die E-Mail nicht.'],
      ['Neue Konten (bestätigt)', f.accounts, 'Aus der Datenbank, nicht aus der Messung.'],
      ['Davon mit mindestens einem Wunsch', f.with_wish, 'Das ist die Zahl, auf die es ankommt.'],
    ];
    const top = Math.max(1, f.visitors, f.accounts);
    el.innerHTML = head() + `
    <div class="stats">${[['Besucher', f.visitors], ['Neue Konten', f.accounts], ['Mit erstem Wunsch', f.with_wish], ['Neue Wünsche', t.wishes_period], ['Gast-Aufrufe', t.guest_views], ['Reservierungen', t.reserved]].map(([l, n]) => `<div class="stat"><b>${nf(n)}</b><span>${l}</span></div>`).join('')}</div>
    <section class="card"><h2>Der Weg vom Besuch zum Wunsch</h2>
     <ol class="funnel">${steps.map(([l, n, h], i) => `<li><div class="frow"><span>${esc(l)}</span><b>${nf(n)}</b></div><div class="fbar"><i style="width:${Math.min(100, Math.round(n / top * 100))}%"></i></div><small class="muted">${i ? `${pct(n, steps[i - 1][1])} vom Schritt davor` : ''}${h ? (i ? ' · ' : '') + esc(h) : ''}</small></li>`).join('')}</ol>
     <p class="hint">Bei der Einrichtung wählten ${nf(f.quick)} „Direkt Wünsche aufschreiben“ und ${nf(f.profile)} „Erst mein Profil einrichten“. Besucher, die „Do Not Track“ nutzen, werden nicht gezählt, die Zahlen sind deshalb etwas niedriger als die Wirklichkeit.</p></section>
    ${data.byArea && data.byArea.links ? (() => { const L = data.byArea.links; return `<section class="card"><h2>Geteilte Links</h2>
     <div class="stats">${[['Geöffnet', L.opens], ['Verschiedene Menschen', L.visitors], ['Davon am Handy', L.visitors ? pct(L.mobile, L.visitors) : '–'], ['Alle Gastaufrufe', L.guest_all]].map(([l, n]) => `<div class="stat"><b>${typeof n === 'number' ? nf(n) : n}</b><span>${l}</span></div>`).join('')}</div>
     ${bars(L.daily, 'n', 'Geöffnete geteilte Links pro Tag')}
     <p class="hint">Gezählt wird, wie oft jemand über einen geteilten Link (wishtale.de/w/…) eine Wunschliste geöffnet hat. Links aus der Zeit vor dem 22.11.2026 und direkt aufgerufene Gastansichten zählen nur unter „Alle Gastaufrufe“. Menschen mit „Do Not Track“ fehlen, Admins zählen nicht mit.</p></section>`; })() : ''}
    <div class="grid2">
     <section class="card"><h2>Besucher pro Tag</h2>${bars(data.daily, 'visitors', 'Besucher pro Tag')}</section>
     <section class="card"><h2>Neue Konten pro Tag</h2>${bars(data.daily, 'signups', 'Neue Konten pro Tag')}</section>
    </div>
    <div class="grid2">
     ${table('Woher die Besucher kommen', data.sources, [r => esc(r.source), r => nf(r.visitors)])}
     ${table('Woher die neuen Konten kommen', data.account_sources, [r => esc(r.source), r => nf(r.accounts)])}
     ${table('Aktionen und Anzeigen (UTM-Kürzel)', data.campaigns, [r => esc(r.campaign), r => nf(r.visitors) + ' Besucher', r => nf(r.accounts) + ' Konten'])}
     ${table('Geräte (Landingpage)', data.devices, [r => esc(DEV[r.device] || r.device), r => nf(r.visitors)])}
     ${data.byArea ? `<section class="card"><h2>Geräte je Bereich</h2><table><thead><tr><th>Bereich</th><th style="text-align:right">Handy</th><th style="text-align:right">Computer</th><th style="text-align:right">Tablet</th><th style="text-align:right">Anteil Handy</th></tr></thead><tbody>${data.byArea.areas.map(r => `<tr><td>${esc(AREA[r.area] || r.area)}</td><td style="text-align:right">${nf(r.mobile)}</td><td style="text-align:right">${nf(r.desktop)}</td><td style="text-align:right">${nf(r.tablet)}</td><td style="text-align:right">${r.total ? pct(r.mobile, r.total) : '–'}</td></tr>`).join('')}</tbody></table>
      <p class="hint">Eigene App zählt Menschen, die angemeldet ihre Wunschliste öffnen; davon ${nf(data.byArea.app_mode.pwa)} vom Home-Bildschirm und ${nf(data.byArea.app_mode.browser)} im Browser. Gast-Link zählt Aufrufe fremder Wunschlisten. Admins werden nicht mitgezählt, sobald sie einmal angemeldet waren.</p></section>` : ''}
     ${table('Länder', data.countries, [r => esc(r.country), r => nf(r.visitors)])}
     <section class="card"><h2>Gesamt</h2><table><tbody>
      <tr><td>Konten insgesamt</td><td style="text-align:right">${nf(t.accounts)}</td></tr>
      <tr><td>Konten mit Wünschen</td><td style="text-align:right">${nf(t.accounts_with_wish)} (${pct(t.accounts_with_wish, t.accounts)})</td></tr>
      <tr><td>Wünsche insgesamt</td><td style="text-align:right">${nf(t.wishes)}</td></tr>
      <tr><td>Im Zeitraum reserviert / gekauft</td><td style="text-align:right">${nf(t.reserved)} / ${nf(t.bought)}</td></tr>
      <tr><td>Demo ausprobiert</td><td style="text-align:right">${nf(t.demo)}</td></tr></tbody></table></section>
    </div>
    <section class="card"><h2>So kannst du die Zahlen lesen</h2><ul class="steps">
     <li><b>Kürzel für Anzeigen:</b> Hänge an deine Links <code>?utm_source=instagram&amp;utm_campaign=black-week</code>. Dann siehst du oben, wie viele Besucher und Konten dazu gehören.</li>
     <li><b>Vorsicht bei kleinen Zahlen:</b> Unter etwa 100 Besuchern sagt eine Veränderung von ein paar Prozent nichts aus.</li>
     <li><b>Was nicht gemessen wird:</b> Wer die Seite nach einer Woche wieder besucht, ist für uns ein neuer Besucher. Das schützt die Privatsphäre, macht aber „Wer kommt zurück?“ unscharf. Dafür helfen die Konten: Wie viele Wünsche legen sie an?</li></ul></section>`;
    bind();
  };
  const bind = () => { el.querySelectorAll('[data-days]').forEach(b => { b.onclick = () => { days = +b.dataset.days; load(); }; }); };
  await load();
}
