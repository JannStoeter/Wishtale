/*
 * Katalog-Entwürfe mit KI (nur für Admins im CMS): Die KI schlägt etablierte Produktlinien mit Eigenschaften vor, ein Mensch prüft und gibt frei.
 * Erst freigegebene Einträge erscheinen in der App. Der Aufruf kostet einmal, danach kostet jede Anzeige nichts mehr.
 */
import { HttpError } from './auth.js';
import { complete } from './llm.js';
import { CATS, CATALOG } from '../../src/data/content.js';

export const WORLDS = CATS.map(c => c.id);
export const TAGS = [...new Set(CATALOG.flatMap(i => i.tags))];
const OCC = ['weihnachten', 'geburtstag', 'hochzeit', 'einzug', 'danke'];
const clip = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
const norm = s => String(s || '').toLowerCase().replace(/ß/g, 'ss');
const kwOf = t => norm(t).split(/[^a-zäöüss0-9]+/).filter(w => w.length >= 4);

const SYSTEM = `Du pflegst den Geschenkkatalog von Wishtale, einer deutschen App für Wunschlisten. Du schlägst Einträge vor, die ein Mensch danach prüft und freigibt.

Regeln:
- Nur etablierte Produktlinien oder Produktarten, die du sicher kennst und die es üblicherweise zu kaufen gibt: Marke und Reihe oder Produktart, ohne Modellnummern, ohne erfundene Namen. Im Zweifel lieber eine Produktart ohne Marke („Handkaffeemühle mit Keramikmahlwerk“).
- Gute Ruf-Auswahl: bewährte Qualität, fairer Preis, in Deutschland lieferbar. Keine Aussagen zu Testsiegen, Bewertungen oder Zahlen.
- Verschieden: unterschiedliche Preislagen, mindestens ein Drittel ohne Markennamen, nichts doppelt oder in Varianten desselben Produkts.
- „art“ ist „ding“ oder „erlebnis“. Bei einem Erlebnis ist „suche“ der Begriff für die Suche in der Nähe.
- „tags“ nur aus der erlaubten Liste, „kw“ sind 1 bis 3 Stichwörter, die in Wünschen vorkommen könnten (kleingeschrieben).
- „anlass“ nur aus: ${OCC.join(', ')}.
- „hinweis“: ein kurzer Satz zur Prüfung für den Menschen, zum Beispiel worauf er achten soll (Lieferbarkeit, Preisentwicklung).

Antworte ausschließlich mit einem JSON-Objekt ohne Erklärung und ohne Codeblock:
{"items":[{"titel":"…","marke":"","art":"ding","suche":"…","tags":[],"kw":[],"von":20,"bis":40,"anlass":[],"hinweis":"…"}]}`;

export function sanitize(raw, world, existing = []) {
  let o = raw;
  if (typeof raw === 'string') {
    const m = raw.replace(/^```(?:json)?\s*|\s*```$/g, '').match(/\{[\s\S]*\}/);
    if (!m) throw new HttpError(502, 'Keine brauchbare Antwort.');
    try { o = JSON.parse(m[0]); } catch { throw new HttpError(502, 'Unvollständige Antwort.'); }
  }
  const have = new Set(existing.map(norm)), seen = new Set();
  return (Array.isArray(o.items) ? o.items : []).slice(0, 20).map(i => {
    const von = Math.round(Number(i.von)), bis = Math.round(Number(i.bis));
    const title = clip(i.titel, 120);
    return {
      title, brand: clip(i.marke, 60), world, kind: i.art === 'erlebnis' ? 'erlebnis' : 'ding', search: clip(i.suche, 80) || title,
      tags: (Array.isArray(i.tags) ? i.tags : []).map(t => norm(t)).filter(t => TAGS.includes(t)).slice(0, 4),
      kw: (Array.isArray(i.kw) ? i.kw : []).flatMap(kwOf).slice(0, 4),
      price_from: Number.isFinite(von) && von > 0 && von < 5000 ? von : null, price_to: Number.isFinite(bis) && bis > 0 && bis < 5000 ? bis : null,
      occ: (Array.isArray(i.anlass) ? i.anlass : []).filter(a => OCC.includes(a)),
      note: clip(i.hinweis, 200), status: 'draft', source: 'ai',
    };
  }).filter(i => i.title && !/https?:/i.test(i.title + i.search) && !have.has(norm(i.title)) && !seen.has(norm(i.title)) && seen.add(norm(i.title)));
}

export async function generate({ world, topic, n, existing }, fetchImpl = fetch) {
  if (!WORLDS.includes(world)) throw new HttpError(400, 'Unbekannte Welt.');
  const count = Math.max(3, Math.min(15, parseInt(n, 10) || 10));
  const ex = (Array.isArray(existing) ? existing : []).map(t => clip(t, 100)).slice(0, 120);
  const world_n = CATS.find(c => c.id === world).n;
  const user = `Welt: ${world_n} (${world})${topic ? `\nSchwerpunkt: ${clip(topic, 200)}` : ''}\nGib ${count} neue Einträge.\nErlaubte Tags: ${TAGS.join(', ')}\nBereits vorhanden, nicht wiederholen: ${ex.join('; ') || 'nichts'}`;
  const r = await complete({ tier: 'main', system: SYSTEM, content: user, maxTokens: 4000, timeoutMs: 55000 }, fetchImpl);
  return { items: sanitize(r.text, world, ex), usage: r.usage, model: r.model };
}
