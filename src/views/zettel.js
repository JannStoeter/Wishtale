/* Wunschzettel hochladen: Foto oder Text einlesen, Liste prüfen, in die Wunschliste übernehmen. */
import { S } from '../state.js';
import { esc, ic } from '../lib/util.js';

export function ZettelModal() {
  const z = S.ui.zt || {};
  const head = `<div class="scrim" data-act="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt">`;
  if (z.items) {
    const name = z.name ? ` von ${esc(z.name)}` : '';
    return `${head}<h2 id="mt">Das haben wir auf dem Wunschzettel${name} gefunden</h2>
     <p class="muted" style="margin:6px 0 12px">Bitte lies kurz drüber: Du kannst Wünsche anpassen oder abwählen. Danach kannst du bei jedem Wunsch den Link ergänzen, oder Wishtale macht Vorschläge.${z.unclear ? ` ${z.unclear === 1 ? 'Ein Wunsch war' : z.unclear + ' Wünsche waren'} nicht lesbar und fehlt${z.unclear === 1 ? '' : 'en'} deshalb.` : ''}</p>
     <form data-form="zettelsave" style="display:grid;gap:8px">
      ${z.items.map((w, i) => `<div class="row" style="gap:10px;align-items:center"><input type="checkbox" name="on" value="${i}" checked aria-label="Wunsch übernehmen"><input class="inp" name="t${i}" value="${esc(w.t)}" maxlength="120" aria-label="Wunsch ${i + 1}" style="flex:1">${w.note ? `<span class="muted" style="font-size:13px">${esc(w.note)}</span>` : ''}</div>`).join('')}
      <div class="row" style="justify-content:flex-end;margin-top:8px"><button type="button" class="btn ghost" data-act="close">Abbrechen</button><button class="btn pri" type="submit">Zur Wunschliste hinzufügen</button></div>
     </form></div></div>`;
  }
  return `${head}<h2 id="mt">Wunschzettel hochladen</h2>
   <p class="muted" style="margin:6px 0 12px">Mach ein Foto vom Wunschzettel oder füge den Text ein. Wishtale liest die einzelnen Wünsche heraus, und du prüfst sie, bevor etwas gespeichert wird. Das Foto wird nur zum Lesen verwendet und nicht gespeichert.</p>
   <form data-form="zettel" style="display:grid;gap:12px">
    <div class="fld"><label for="zt-f">Foto oder Scan (bis zu 4 Bilder)</label><input id="zt-f" name="files" type="file" accept="image/*" multiple class="inp"></div>
    <div class="fld"><label for="zt-t">Oder der Text</label><textarea id="zt-t" name="text" class="ta" maxlength="20000" placeholder="z. B. Lego Technik Bagger, Siku Traktor …"></textarea></div>
    <details class="muted" style="font-size:14px"><summary style="cursor:pointer;color:var(--ink)">So liest du eine Amazon-Wunschliste ein</summary>
     <p style="margin:8px 0 0">Amazon bietet keinen Export an, aber so geht es trotzdem: Öffne deine Wunschliste auf amazon.de, scrolle bis ganz nach unten, damit alles geladen ist, markiere die ganze Seite (Strg+A beziehungsweise Cmd+A), kopiere sie und füge sie oben bei „Der Text“ ein. Am Handy genügen Screenshots der Liste, die du oben als Bilder hochlädst. Wishtale sucht die Produktnamen und Preise heraus, Links und Bilder kommen nicht mit. Dein Name und deine Adresse bei Amazon gehören nicht dazu, lass sie gern weg.</p></details>
    ${z.error ? `<p role="alert" style="color:var(--bad,#a33)">${esc(z.error)}</p>` : ''}
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn ghost" data-act="close">Abbrechen</button><button class="btn pri" type="submit" ${z.busy ? 'disabled' : ''}>${z.busy ? 'Wishtale liest …' : `${ic('check', 'sm')}Wünsche herauslesen`}</button></div>
   </form></div></div>`;
}
