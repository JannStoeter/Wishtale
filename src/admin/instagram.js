import { list, save, remove } from './api.js';
import { sb } from '../lib/supabase.js';
import { esc, toast, slug, toLocal, fromLocal, fmtDate, lines } from './util.js';
import { drawSlide, loadFonts, blank, blob, TYPES, THEMES, FORMATS } from './canvas.js';
import { makeReel } from './reel.js';
import { IDEAS } from './ideas.js';
import { SCENES } from './scenes.js';
import { withSiteLink } from '../lib/iglink.js';
import { PHOTOS, photoUrl } from '../data/photos.js';

const STATUS = { draft: 'Entwurf', ready: 'Bereit', posted: 'Gepostet' };
const pad = i => String(i + 1).padStart(2, '0');

export async function mount(el) {
  let posts = [], cur = null, sel = 0, mode = 'list', idea = null, conn = null, busy = '', ctx = { campaigns: [], products: [] };
  let reel = { blob: null, url: '', progress: 0, secs: 3, audio: null, warnings: [] }, note = '', own = false, undo = null;
  const imgs = new Map(), lib = new Map(); // Eigene Fotos nur im Speicher; Bibliotheksfotos nach Schlüssel
  await loadFonts();
  const resetReel = () => { if (reel.url) URL.revokeObjectURL(reel.url); reel = { blob: null, url: '', progress: 0, secs: reel.secs || 3, audio: null, warnings: [] }; note = ''; };
  const load = async () => {
    posts = await list('social_posts', 'updated_at', false);
    const [c, p] = await Promise.all([sb.from('campaigns').select('*').order('starts_at', { ascending: false }), sb.from('products').select('*')]);
    ctx = { campaigns: c.data || [], products: p.data || [] };
    let want = null; try { want = sessionStorage.getItem('cms:open-post'); sessionStorage.removeItem('cms:open-post'); } catch { /* ohne Speicher */ }
    const hit = want && posts.find(x => x.id === want);
    if (hit) { cur = { ...hit, slides: JSON.parse(JSON.stringify(hit.slides)) }; sel = 0; status(); }
    draw();
  };
  const status = async () => {
    try { const { data: { session } } = await sb.auth.getSession(); const r = await fetch('/api/integrations', { headers: { authorization: 'Bearer ' + session.access_token } }); conn = r.ok ? await r.json() : null; } catch { conn = null; }
    if (cur) draw();
  };
  const libImg = key => {
    if (lib.has(key)) return lib.get(key);
    lib.set(key, null);
    fetch(photoUrl(key, 1200)).then(r => r.blob()).then(createImageBitmap).then(bm => { lib.set(key, bm); paint(); }).catch(() => {});
    return null;
  };
  const imgFor = i => imgs.get(i) || (cur.slides[i].photoKey ? libImg(cur.slides[i].photoKey) : null);
  const ensureImages = async () => { await Promise.all(cur.slides.map(async s => { if (s.photoKey && !lib.get(s.photoKey)) { try { lib.set(s.photoKey, await createImageBitmap(await (await fetch(photoUrl(s.photoKey, 1200))).blob())); } catch { /* Platzhalter */ } } })); };
  const paint = () => {
    const c = el.querySelector('#cv'); if (!c || !cur) return;
    drawSlide(c, cur.slides[sel], sel, cur.slides.length, { image: imgFor(sel), format: cur.format });
    el.querySelectorAll('.thumb canvas').forEach((t, i) => drawSlide(t, cur.slides[i], i, cur.slides.length, { image: imgFor(i), format: cur.format }));
  };
  const slideForm = () => {
    const s = cur.slides[sel]; if (!s) return '';
    return `<div class="card"><div class="row"><b>Folie ${sel + 1}</b>
     <button class="btn ghost sm" data-a="up" ${sel ? '' : 'disabled'}>Nach vorn</button><button class="btn ghost sm" data-a="down" ${sel < cur.slides.length - 1 ? '' : 'disabled'}>Nach hinten</button><button class="btn ghost sm" data-a="dupslide">Kopieren</button><button class="btn ghost sm danger" data-a="delslide" ${cur.slides.length > 1 ? '' : 'disabled'}>Löschen</button></div>
     <div class="grid2"><div class="fld"><label for="s-type">Art</label><select id="s-type" data-s="type" class="sel">${Object.entries(TYPES).map(([k, v]) => `<option value="${k}" ${s.type === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
     <div class="fld"><label for="s-theme">Farbe</label><select id="s-theme" data-s="theme" class="sel">${Object.keys(THEMES).map(k => `<option value="${k}" ${s.theme === k ? 'selected' : ''}>${k === 'creme' ? 'Hell (Creme)' : 'Dunkel (Grün)'}</option>`).join('')}</select></div>
     <div class="fld wide"><label for="s-eye">Kleine Zeile oben</label><input id="s-eye" data-s="eyebrow" class="inp" value="${esc(s.eyebrow)}"></div>
     <div class="fld wide"><label for="s-title">Überschrift</label><textarea id="s-title" data-s="title" class="ta" rows="2">${esc(s.title)}</textarea></div>
     <div class="fld wide"><label for="s-sub">Text darunter</label><textarea id="s-sub" data-s="sub" class="ta" rows="3">${esc(s.sub)}</textarea></div>
     ${s.type === 'quote' ? `<div class="fld wide"><label for="s-q">Zitat</label><textarea id="s-q" data-s="quote" class="ta" rows="3">${esc(s.quote)}</textarea></div>` : ''}
     ${s.type === 'chips' ? `<div class="fld wide"><label for="s-ch">Chips (eine pro Zeile, ein * davor hebt hervor)</label><textarea id="s-ch" data-s="chips" class="ta" rows="5">${esc((s.chips || []).join('\n'))}</textarea></div>` : ''}
     ${s.type === 'photo' ? `<div class="fld"><label for="s-pk">Foto aus der Bibliothek</label><select id="s-pk" data-s="photoKey" class="sel"><option value="">Eigenes Foto oder keins</option>${Object.keys(PHOTOS).map(k => `<option value="${k}" ${s.photoKey === k ? 'selected' : ''}>${esc(k)}</option>`).join('')}</select></div><div class="fld"><label for="s-img">Oder eigenes Foto (nur in dieser Sitzung)</label><input id="s-img" type="file" accept="image/*" class="inp"></div>` : ''}
     ${s.type === 'screen' ? `<div class="fld wide"><label for="s-sc">Was das Handy zeigt</label><select id="s-sc" data-s="scene" class="sel">${Object.entries(SCENES).map(([k, v]) => `<option value="${k}" ${(s.scene || 'liste') === k ? 'selected' : ''}>${esc(v.label)}</option>`).join('')}</select></div>` : ''}
     ${s.type === 'cta' ? `<div class="fld"><label for="s-h">Instagram-Name</label><input id="s-h" data-s="handle" class="inp" value="${esc(s.handle)}"></div><div class="fld"><label for="s-d">Webadresse</label><input id="s-d" data-s="domain" class="inp" value="${esc(s.domain)}"></div>` : ''}
     <div class="fld wide"><label for="s-f">Fußzeile</label><input id="s-f" data-s="footer" class="inp" value="${esc(s.footer ?? 'Jeder Wunsch hat eine Geschichte.')}"></div></div></div>`;
  };
  const publishBox = () => {
    const ok = conn && conn.instagram && conn.instagram.configured, fmt = cur.format || 'post';
    const hint = cur.title.startsWith('Aktion:') ? '<p class="banner"><b>Dieser Beitrag gehört zu einer Aktion.</b> Lies Texte und Bildunterschrift kurz durch, prüfe die geplante Zeit und wähle dann „Einplanen“ oder „Jetzt posten“.</p>' : cur.title.startsWith('Wunsch-Idee:') ? '<p class="banner"><b>Das ist ein Beitrag mit einem Produkt als Beispiel.</b> Setze solche Beiträge nur gelegentlich ein, höchstens jeden vierten, damit der Fokus auf dem Wünschen bleibt.</p>' : '';
    const hasVideo = !!(reel.blob || cur.video_url);
    const can = ok && !busy && (fmt !== 'reel' || hasVideo);
    const reelBox = fmt !== 'reel' ? '' : `<div class="card sub"><h3>Video erzeugen</h3>
      <div class="grid2"><div class="fld"><label for="r-secs">Sekunden pro Folie</label><select id="r-secs" data-r="secs" class="sel">${[2, 3, 4, 5].map(n => `<option ${reel.secs === n ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
      <div class="fld"><label for="r-aud">Musik (optional, MP3 oder M4A)</label><input id="r-aud" type="file" accept="audio/*" class="inp" data-r="audio"><p class="hint">Nutze nur Musik, für die du die Rechte hast (lizenzfrei oder selbst gemacht).</p></div></div>
      <div class="row"><button class="btn pri" data-a="mkreel" ${busy ? 'disabled' : ''}>${busy === 'reel' ? `Video wird erzeugt … ${Math.round(reel.progress * 100)} %` : reel.blob ? 'Video neu erzeugen' : 'Video erzeugen'}</button>${reel.blob ? '<button class="btn sec" data-a="dlreel">Video herunterladen</button>' : ''}</div>
      ${reel.warnings.map(w => `<p class="banner warn2" role="status">${esc(w)}</p>`).join('')}
      ${reel.url ? `<video class="reelprev" src="${reel.url}" controls playsinline muted></video><p class="hint">${(reel.blob.size / 1048576).toFixed(1)} MB · ${cur.slides.length * reel.secs} Sekunden</p>` : cur.video_url ? '<p class="hint">Ein Video ist schon hochgeladen. Du kannst es direkt posten oder ein neues erzeugen.</p>' : '<p class="hint">Erzeuge zuerst das Video. Das dauert je nach Länge etwa eine halbe Minute, bitte lass den Tab offen.</p>'}</div>`;
    return `<div class="card"><h2>Veröffentlichen</h2>${hint}
     ${cur.status === 'posted' ? `<p><span class="pill ok">Gepostet</span> ${cur.posted_at ? fmtDate(cur.posted_at) : ''} ${cur.ig_permalink ? `<a href="${esc(cur.ig_permalink)}" target="_blank" rel="noopener">Auf Instagram ansehen</a>` : ''}</p>` : ''}
     ${cur.publish_error ? `<p class="banner warn2" role="alert"><b>Letzter Versuch fehlgeschlagen:</b> ${esc(cur.publish_error)}</p>` : ''}
     ${note ? `<p class="banner" role="status">${esc(note)}</p>` : ''}
     ${fmt === 'story' ? '<p class="muted">Jede Folie wird eine eigene Story, in der Reihenfolge der Folien. Stories verschwinden nach 24 Stunden. Links, Umfragen und Sticker kannst du über die API nicht setzen, dafür öffne die Story danach in der Instagram-App.</p>' : ''}
     ${reelBox}
     ${ok ? '' : `<p class="banner">Instagram ist noch nicht verbunden. Unter <a href="#verbindungen">Verbindungen</a> steht, wie du es einrichtest. Bis dahin lädst du die Dateien herunter und postest in der Instagram-App.</p>`}
     <div class="row"><button class="btn pri" data-a="postnow" ${can ? '' : 'disabled'}>${busy === 'post' ? 'Wird veröffentlicht …' : fmt === 'story' ? 'Jetzt als Stories posten' : fmt === 'reel' ? 'Jetzt als Reel posten' : 'Jetzt auf Instagram posten'}</button>
     <button class="btn sec" data-a="schedule" ${can ? '' : 'disabled'}>${busy === 'stage' ? 'Wird vorbereitet …' : 'Einplanen (wird zur geplanten Zeit gepostet)'}</button></div>
     <p class="hint">Beim Einplanen wird alles hochgeladen und der Beitrag auf „Bereit“ gesetzt. Gepostet wird, sobald die geplante Zeit erreicht ist. Auf dem kostenlosen Vercel-Plan prüft das System einmal täglich.</p></div>`;
  };
  const reviseBox = () => `<div class="card"><h2>Mit dem Assistenten überarbeiten</h2>${aiOk() ? `<div class="fld"><label for="rv">Was soll sich ändern?</label><textarea id="rv" class="ta" rows="2" placeholder="z. B. kürzer, wärmer, mehr aufs Wünschen konzentrieren, ohne Produkt"></textarea></div><div class="row"><button class="btn sec" data-a="revise" ${busy ? 'disabled' : ''}>${busy === 'ai' ? 'Wishtale schreibt …' : 'Überarbeiten'}</button>${undo ? '<button class="btn ghost" data-a="undo">Letzte Änderung rückgängig</button>' : ''}</div>` : '<p class="muted">Der Schreibassistent ist noch nicht verbunden, siehe <a href="#verbindungen">Verbindungen</a>.</p>'}</div>`;
  const editor = () => `<div class="studio">
    <div><div class="card"><div class="grid2"><div class="fld wide"><label for="p-t">Interner Titel</label><input id="p-t" data-p="title" class="inp" value="${esc(cur.title)}"></div>
     <div class="fld"><label for="p-fmt">Format</label><select id="p-fmt" data-p="format" class="sel">${Object.entries(FORMATS).map(([k, v]) => `<option value="${k}" ${(cur.format || 'post') === k ? 'selected' : ''}>${v.label}</option>`).join('')}</select></div>
     <div class="fld"><label for="p-st">Status</label><select id="p-st" data-p="status" class="sel">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${cur.status === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
     <div class="fld"><label for="p-sc">Geplant für</label><input id="p-sc" data-p="scheduled_for" type="datetime-local" class="inp" value="${toLocal(cur.scheduled_for)}"></div>
     <div class="fld wide"><label for="p-c">Bildunterschrift</label><textarea id="p-c" data-p="caption" class="ta" rows="9" maxlength="2200">${esc(cur.caption)}</textarea><p class="hint"><span id="cc">${cur.caption.length}</span>/2200 Zeichen. Fehlt „wishtale.de“, ergänzt Wishtale beim Veröffentlichen eine Zeile mit der Adresse.</p></div></div></div>
     ${slideForm()}${reviseBox()}</div>
    <div><div class="canvaswrap ${cur.format && cur.format !== 'post' ? 'tallc' : ''}"><canvas id="cv" role="img" aria-label="Vorschau der Folie ${sel + 1}"></canvas></div>
     <div class="thumbs ${cur.format && cur.format !== 'post' ? 'tallc' : ''}">${cur.slides.map((_, i) => `<button class="thumb ${i === sel ? 'on' : ''}" data-a="pick" data-i="${i}" aria-label="Folie ${i + 1} auswählen"><canvas></canvas></button>`).join('')}<button class="thumb add" data-a="add" aria-label="Folie hinzufügen">+</button></div>
     <div class="row"><button class="btn pri" data-a="save">Speichern</button><button class="btn sec" data-a="png">Diese Folie als Bild</button><button class="btn sec" data-a="all">Alle Folien als Bilder</button></div>
     ${publishBox()}
     <div class="row"><button class="btn ghost" data-a="back">Zurück zur Liste</button>${cur.id ? '<button class="btn ghost danger" data-a="delpost">Beitrag löschen</button>' : ''}</div></div></div>`;
  const ideasView = () => {
    if (idea) {
      const f = idea.fields.length ? idea.fields : [];
      return `<div class="head"><div><h1>${esc(idea.title)}</h1><p class="muted">${esc(idea.desc)}</p></div></div><form class="card" data-f="idea"><div class="grid2">
       ${f.map(([k, label, def, opts]) => opts ? `<div class="fld wide"><label for="i-${k}">${label}</label><select id="i-${k}" name="${k}" class="sel">${opts().map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select></div>` : k === 'campaign' ? `<div class="fld wide"><label for="i-${k}">${label}</label><select id="i-${k}" name="${k}" class="sel">${ctx.campaigns.map(c => `<option value="${c.id}">${esc(c.title)}</option>`).join('') || '<option value="">Noch keine Aktion angelegt</option>'}</select></div>` : `<div class="fld ${def.length > 40 ? 'wide' : ''}"><label for="i-${k}">${label}</label><input id="i-${k}" name="${k}" class="inp" value="${esc(def)}"></div>`).join('')}</div>
       <div class="grid2"><div class="fld wide"><label for="i-format">Als welches Format?</label><select id="i-format" name="format" class="sel">${[['post', 'Beitrag (Karussell)'], ['story', 'Story (jede Folie eine eigene Story)'], ['reel', 'Reel (Video aus den Folien, mit Text und Musik)']].map(([k, l]) => `<option value="${k}" ${(idea.format || 'post') === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>
       <div class="row"><button class="btn pri" type="submit">Folien erstellen</button><button class="btn ghost" type="button" data-a="ideas">Andere Idee wählen</button></div>
       <p class="hint">Du kannst alles danach in Ruhe bearbeiten: Texte, Reihenfolge, Farben, Fotos und die Bildunterschrift.</p></form>`;
    }
    if (own) return `<div class="head"><div><h1>Eigene Idee</h1><p class="muted">Beschreibe in ein, zwei Sätzen, worum es gehen soll. Der Schreibassistent macht daraus Folien und Bildunterschrift im Wishtale-Ton.</p></div></div>
     <form class="card" data-f="own"><div class="fld"><label for="o-idea">Deine Idee</label><textarea id="o-idea" name="idea" class="ta" rows="4" required maxlength="800" placeholder="z. B. Am ersten Advent können deine Freunde schon sehen, was auf deinem Wunschzettel steht"></textarea></div>
      <div class="grid2"><div class="fld"><label for="o-goal">Für wen?</label><select id="o-goal" name="goal" class="sel"><option value="neu">Menschen, die Wishtale noch nicht kennen</option><option value="bestehend">Menschen, die schon ein Wishtale haben</option></select></div>
      <div class="fld"><label for="o-format">Als welches Format?</label><select id="o-format" name="format" class="sel"><option value="post">Beitrag (Karussell)</option><option value="story">Story</option><option value="reel">Reel (Video)</option></select></div></div>
      ${aiOk() ? '' : '<p class="banner">Der Schreibassistent ist noch nicht verbunden (siehe <a href="#verbindungen">Verbindungen</a>). Bis dahin entsteht ein einfacher Entwurf, den du von Hand fertig schreibst.</p>'}
      <div class="row"><button class="btn pri" type="submit" ${busy ? 'disabled' : ''}>${busy === 'ai' ? 'Wishtale schreibt …' : 'Beitrag erstellen'}</button><button class="btn ghost" type="button" data-a="ideas">Zurück zu den Ideen</button></div></form>`;
    return `<div class="head"><div><h1>Welche Idee möchtest du posten?</h1><p class="muted">Wähle eine Idee. Wishtale erstellt daraus die Folien und die Bildunterschrift, und du bearbeitest sie danach.</p></div><button class="btn ghost" data-a="list">Zurück zur Liste</button></div>
     ${posts.slice(0, 4).some(p => p.title.startsWith('Wunsch-Idee:')) ? '<div class="banner"><b>Zur Erinnerung:</b> Unter den letzten Beiträgen war schon einer mit einem Produkt. Wir empfehlen höchstens jeden vierten, damit der Feed nach Wunschzettel aussieht und nicht nach Werbung.</div>' : ''}
     <div class="ideas"><button class="card idea" data-a="own"><b>Eigene Idee</b><span class="muted">Du beschreibst die Idee, Wishtale schreibt Folien und Bildunterschrift dazu.</span></button>${IDEAS.map(i => `<button class="card idea" data-a="idea" data-id="${i.id}"><b>${esc(i.title)}</b><span class="muted">${esc(i.desc)}</span></button>`).join('')}<button class="card idea" data-a="blankpost"><b>Leerer Beitrag</b><span class="muted">Von Grund auf selbst bauen.</span></button></div>`;
  };
  const draw = () => {
    if (mode === 'ideas') { el.innerHTML = ideasView(); return; }
    if (cur) { el.innerHTML = `<div class="head"><div><h1>${esc(cur.title)}</h1><p class="muted">Die Vorschau zeigt genau das Bild, das du herunterlädst oder postest (1080 × 1350).</p></div></div>${editor()}`; paint(); return; }
    el.innerHTML = `<div class="head"><div><h1>Instagram</h1><p class="muted">Wähle eine Idee, bearbeite die Folien und poste sie, direkt von hier oder aus der Instagram-App.</p></div><button class="btn pri" data-a="ideas">Beitrag hinzufügen</button></div>
     <div class="tablewrap"><table><thead><tr><th>Beitrag</th><th>Format</th><th>Folien</th><th>Geplant</th><th>Status</th><th></th></tr></thead><tbody>
     ${posts.map(p => `<tr><td><b>${esc(p.title)}</b></td><td>${esc((FORMATS[p.format] || FORMATS.post).label.replace(/ \(.*\)/, ''))}</td><td>${p.slides.length}</td><td>${fmtDate(p.scheduled_for)}</td><td><span class="pill ${p.status === 'posted' ? 'ok' : p.status === 'ready' ? 'gold' : ''}">${STATUS[p.status]}</span></td><td class="actions"><button class="btn sec sm" data-a="open" data-id="${p.id}">Öffnen</button></td></tr>`).join('') || '<tr><td colspan="6" class="muted">Noch keine Beiträge. Mit „Beitrag hinzufügen“ wählst du eine Idee.</td></tr>'}</tbody></table></div>`;
  };
  const render = async (i, type, q) => { const c = document.createElement('canvas'); drawSlide(c, cur.slides[i], i, cur.slides.length, { image: imgFor(i), format: cur.format }); return blob(c, type, q); };
  const dl = async i => { await ensureImages(); const b = await render(i, 'image/png'), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `wishtale-${slug(cur.title)}-${pad(i)}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
  const persist = async () => {
    const row = { ...(cur.id ? { id: cur.id } : {}), title: cur.title.trim() || 'Beitrag', status: cur.status, caption: cur.caption, slides: cur.slides, scheduled_for: cur.scheduled_for || null, image_urls: cur.image_urls || [], format: cur.format || 'post', video_url: cur.video_url || null, posted_at: cur.status === 'posted' ? (cur.posted_at || new Date().toISOString()) : null };
    const r = await save('social_posts', row); cur = { ...cur, ...r }; toast('Gespeichert.');
  };
  /** Bilder als JPEG hochladen (Instagram akzeptiert nur JPEG) und die öffentlichen Adressen im Beitrag speichern. Bei Reels das Video. */
  const stage = async () => {
    if (!cur.id) await persist();
    const stamp = Date.now(), pub = path => sb.storage.from('social-posts').getPublicUrl(path).data.publicUrl;
    if (cur.format === 'reel') {
      if (reel.blob) {
        const path = `${cur.id}/${stamp}-reel.mp4`;
        const { error } = await sb.storage.from('social-posts').upload(path, reel.blob, { contentType: 'video/mp4', upsert: false }); if (error) throw error;
        cur.video_url = pub(path);
      }
      if (!cur.video_url) throw new Error('Bitte erzeuge zuerst das Video.');
      return;
    }
    await ensureImages();
    const urls = [];
    for (let i = 0; i < cur.slides.length; i++) {
      const path = `${cur.id}/${stamp}-${pad(i)}.jpg`, b = await render(i, 'image/jpeg', 0.92);
      const { error } = await sb.storage.from('social-posts').upload(path, b, { contentType: 'image/jpeg', upsert: false }); if (error) throw error;
      urls.push(pub(path));
    }
    cur.image_urls = urls;
  };
  const mkReel = async () => {
    await ensureImages(); busy = 'reel'; reel.progress = 0; reel.warnings = []; draw();
    try {
      const out = await makeReel({ slides: cur.slides, imageFor: imgFor, secondsPerSlide: reel.secs, audioFile: reel.audio, onProgress: p => { reel.progress = p; const bt = el.querySelector('[data-a=mkreel]'); if (bt) bt.textContent = `Video wird erzeugt … ${Math.round(p * 100)} %`; } });
      if (out.blob.size > 50 * 1048576) throw new Error('Das Video ist größer als 50 MB. Bitte kürze es oder wähle weniger Sekunden pro Folie.');
      if (reel.url) URL.revokeObjectURL(reel.url);
      reel.blob = out.blob; reel.url = URL.createObjectURL(out.blob); reel.warnings = out.warnings;
    } finally { busy = ''; draw(); }
  };
  /** Reel: Instagram verarbeitet das Video. Wir fragen alle 6 Sekunden nach, bis es fertig ist (höchstens 5 Minuten). */
  const waitReel = async () => {
    for (let i = 0; i < 50; i++) {
      await new Promise(r => setTimeout(r, 6000));
      const r = await fetch('/api/instagram', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + await token() }, body: JSON.stringify({ action: 'finish', postId: cur.id }) });
      const j = await r.json().catch(() => ({}));
      if (r.status === 202) { note = `Instagram verarbeitet das Video noch … (${(i + 1) * 6} s)`; draw(); continue; }
      if (!r.ok) throw new Error(j.error || 'Das Veröffentlichen hat nicht geklappt.');
      return;
    }
    throw new Error('Instagram braucht ungewöhnlich lange. Der Beitrag bleibt vorbereitet, versuche es später mit „Jetzt als Reel posten“ noch einmal.');
  };
  const aiOk = () => !!(conn && conn.ai && conn.ai.configured);
  const askAI = async body => {
    const r = await fetch('/api/draft', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + await token() }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Der Assistent hat nicht geantwortet.'); return j.post;
  };
  /** Ohne Assistent: ein schlichter Entwurf aus der Idee, den du von Hand weiterbearbeitest. */
  const plainDraft = (text, goal) => {
    const t = String(text).trim();
    return { title: t.slice(0, 60), caption: `${t}\n\nIn deinem Wishtale sammelst du alles, worüber du dich freuen würdest, und deine Freunde finden es ohne Nachfragen. Den Link findest du in der Bio und unter wishtale.de.\n\n#wishtale #wunschliste #geschenkideen #wunschzettel`,
      slides: [{ ...blank('cover'), eyebrow: 'Wünsch dir was', title: t.slice(0, 110) }, { ...blank('chips'), eyebrow: 'Dein Wishtale', title: goal === 'bestehend' ? 'Damit deine Freunde das Passende für dich finden' : 'Alles, was dich ausmacht, auf einer Seite', chips: ['*Deine Wünsche', 'Interessen', 'Lieblingsmarken', 'Schon vorhanden', 'Bitte nicht'] }, blank('cta')] };
  };
  const token = async () => (await sb.auth.getSession()).data.session.access_token;
  el.onclick = async e => {
    const b = e.target.closest('[data-a]'); if (!b || b.disabled) return; const a = b.dataset.a;
    try {
      if (a === 'ideas') { mode = 'ideas'; idea = null; own = false; draw(); }
      else if (a === 'own') { own = true; idea = null; draw(); }
      else if (a === 'list') { mode = 'list'; idea = null; own = false; draw(); }
      else if (a === 'idea') { idea = IDEAS.find(i => i.id === b.dataset.id); draw(); }
      else if (a === 'blankpost') { cur = { title: 'Neuer Beitrag', status: 'draft', caption: '', slides: [{ ...blank('cover'), title: 'Dein Titel' }, blank('cta')], scheduled_for: null }; mode = 'list'; sel = 0; imgs.clear(); draw(); status(); }
      else if (a === 'open') { cur = { ...posts.find(p => p.id === b.dataset.id) }; cur.slides = JSON.parse(JSON.stringify(cur.slides)); sel = 0; imgs.clear(); draw(); status(); }
      else if (a === 'back') { if (!confirm('Ungespeicherte Änderungen gehen verloren. Zur Liste zurück?')) return; cur = null; await load(); }
      else if (a === 'pick') { sel = +b.dataset.i; draw(); }
      else if (a === 'add') { cur.slides.push(blank('cover')); sel = cur.slides.length - 1; draw(); }
      else if (a === 'dupslide') { cur.slides.splice(sel + 1, 0, JSON.parse(JSON.stringify(cur.slides[sel]))); sel++; draw(); }
      else if (a === 'delslide') { cur.slides.splice(sel, 1); imgs.delete(sel); sel = Math.max(0, sel - 1); draw(); }
      else if (a === 'up' || a === 'down') { const j = a === 'up' ? sel - 1 : sel + 1;[cur.slides[sel], cur.slides[j]] = [cur.slides[j], cur.slides[sel]]; const x = imgs.get(sel), y = imgs.get(j); x ? imgs.set(j, x) : imgs.delete(j); y ? imgs.set(sel, y) : imgs.delete(sel); sel = j; draw(); }
      else if (a === 'save') await persist();
      else if (a === 'png') await dl(sel);
      else if (a === 'all') { for (let i = 0; i < cur.slides.length; i++) { await dl(i); await new Promise(r => setTimeout(r, 350)); } }
      else if (a === 'schedule') {
        if (!cur.scheduled_for) return toast('Bitte zuerst eine Zeit bei „Geplant für“ wählen.', true);
        busy = 'stage'; draw(); try { await stage(); cur.status = 'ready'; cur.publish_error = null; await persist(); toast('Eingeplant. Der Beitrag wird zur geplanten Zeit gepostet.'); } finally { busy = ''; draw(); }
      }
      else if (a === 'revise') {
        const ins = el.querySelector('#rv')?.value.trim(); if (!ins) return toast('Bitte schreibe, was sich ändern soll.', true);
        if (cur.slides.some(x => x.type === 'photo' || x.type === 'screen')) return toast('Beiträge mit Foto- oder Handy-Folien kann der Assistent noch nicht überarbeiten. Ändere sie von Hand.', true);
        busy = 'ai'; draw();
        try {
          const before = JSON.stringify({ caption: cur.caption, slides: cur.slides });
          const out = await askAI({ mode: 'revise', instruction: ins, format: cur.format || 'post', current: { title: cur.title, caption: cur.caption, slides: cur.slides } });
          undo = before; cur.caption = out.caption; cur.slides = out.slides; sel = 0; toast('Überarbeitet. Mit „Rückgängig“ holst du die vorige Fassung zurück.');
        } finally { busy = ''; draw(); }
      }
      else if (a === 'undo') { const o = JSON.parse(undo); cur.caption = o.caption; cur.slides = o.slides; undo = null; sel = 0; draw(); }
      else if (a === 'mkreel') await mkReel();
      else if (a === 'dlreel') { const l = document.createElement('a'); l.href = reel.url; l.download = `wishtale-${slug(cur.title)}.mp4`; l.click(); }
      else if (a === 'postnow') {
        if (!confirm(cur.format === 'story' ? 'Diese Folien jetzt als Stories veröffentlichen?' : cur.format === 'reel' ? 'Dieses Reel jetzt veröffentlichen?' : 'Diesen Beitrag jetzt auf Instagram veröffentlichen?')) return;
        busy = 'post'; note = ''; draw();
        try {
          await stage(); await persist();
          const r = await fetch('/api/instagram', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + await token() }, body: JSON.stringify({ action: 'publish', postId: cur.id }) });
          const j = await r.json().catch(() => ({}));
          if (r.status === 202) { note = 'Instagram verarbeitet das Video. Das dauert einen Moment, bitte lass den Tab offen.'; draw(); await waitReel(); }
          else if (!r.ok) throw new Error(j.error || 'Das Veröffentlichen hat nicht geklappt.');
          const { data } = await sb.from('social_posts').select('*').eq('id', cur.id).single(); if (data) cur = { ...cur, ...data };
          note = ''; toast('Veröffentlicht. Es ist auf Instagram.');
        } catch (err) { const { data } = await sb.from('social_posts').select('*').eq('id', cur.id).single(); if (data) cur = { ...cur, ...data }; throw err; }
        finally { busy = ''; draw(); }
      }
      else if (a === 'delpost') { if (confirm('Diesen Beitrag wirklich löschen?')) { await remove('social_posts', cur.id); cur = null; await load(); } }
    } catch (err) { toast('Das hat nicht geklappt: ' + (err.message || err), true); }
  };
  const createFrom = async (i, v) => {
    const out = i.build(v, ctx);
    // Jeder Beitrag und jedes Reel endet mit der Abschlussfolie samt Adresse, die Bildunterschrift nennt wishtale.de
    if ((v.format || 'post') !== 'story' && out.slides.length && out.slides[out.slides.length - 1].type !== 'cta') out.slides.push({ ...blank('cta') });
    out.caption = (v.format || 'post') === 'story' ? out.caption : withSiteLink(out.caption);
    cur = { title: out.title, status: 'draft', caption: out.caption, slides: out.slides, scheduled_for: null, image_urls: [], format: v.format || 'post' };
    resetReel();
    mode = 'list'; idea = null; sel = 0; imgs.clear(); draw(); status(); toast('Die Folien sind erstellt. Jetzt kannst du alles bearbeiten.');
  };
  el.onsubmit = async e => {
    e.preventDefault();
    if (e.target.dataset.f === 'own') {
      const fd = new FormData(e.target), idea0 = String(fd.get('idea') || '').trim(), format = fd.get('format'), goal = fd.get('goal');
      busy = 'ai'; draw();
      try {
        const out = aiOk() ? await askAI({ mode: 'draft', idea: idea0, format, goal }) : plainDraft(idea0, goal);
        cur = { title: out.title, status: 'draft', caption: format === 'story' ? out.caption : withSiteLink(out.caption), slides: out.slides, scheduled_for: null, image_urls: [], format }; own = false; mode = 'list'; sel = 0; imgs.clear(); resetReel(); undo = null;
        toast(aiOk() ? 'Fertig. Lies alles in Ruhe durch und passe an, was nicht passt.' : 'Der Entwurf steht. Schreibe ihn jetzt von Hand fertig.');
      } catch (err) { toast('Das hat nicht geklappt: ' + (err.message || err), true); }
      finally { busy = ''; draw(); if (cur) status(); }
      return;
    }
 const fd = new FormData(e.target), v = {}; for (const [k, x] of fd.entries()) v[k] = x; try { await createFrom(idea, v); } catch (err) { toast('Das hat nicht geklappt: ' + (err.message || err), true); } };
  el.oninput = e => {
    const t = e.target;
    if (t.dataset.p) { cur[t.dataset.p] = t.dataset.p === 'scheduled_for' ? fromLocal(t.value) : t.value; if (t.dataset.p === 'caption') el.querySelector('#cc').textContent = t.value.length; return; }
    if (t.dataset.s && t.tagName !== 'SELECT') { const s = cur.slides[sel]; s[t.dataset.s] = t.dataset.s === 'chips' ? lines(t.value) : t.value; paint(); }
  };
  el.onchange = e => {
    const t = e.target;
    if (t.dataset.p === 'status') { cur.status = t.value; return; }
    if (t.dataset.p === 'format') { cur.format = t.value; cur.image_urls = []; draw(); return; }
    if (t.dataset.r === 'secs') { reel.secs = +t.value; reel.blob = null; if (reel.url) URL.revokeObjectURL(reel.url); reel.url = ''; draw(); return; }
    if (t.dataset.r === 'audio') { reel.audio = t.files[0] || null; return; }
    if (t.dataset.s === 'type' || t.dataset.s === 'theme' || t.dataset.s === 'photoKey' || t.dataset.s === 'scene') { cur.slides[sel][t.dataset.s] = t.value; if (t.dataset.s === 'photoKey') imgs.delete(sel); draw(); }
    if (t.id === 's-img' && t.files[0]) { const f = t.files[0]; createImageBitmap(f).then(bm => { imgs.set(sel, bm); paint(); }).catch(() => toast('Das Bild konnte nicht gelesen werden.', true)); }
  };
  await load(); status();
}
