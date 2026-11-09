/*
 * Tribunal: liest die Fragen und Positionen aus docs/tribunal/ (Dateien im Repo, von Claude und ChatGPT geschrieben) und liefert sie
 * der Entwickler-Seite. Nur für Admins. Die Dateien liegen über includeFiles in vercel.json bei der Funktion.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = () => join(process.cwd(), 'docs', 'tribunal');
const clip = (s, n) => String(s ?? '').slice(0, n);

/** „---\nkey: wert\n---\nText“ → { meta, body } */
export function parseDoc(src) {
  const m = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(String(src).replace(/\r\n/g, '\n'));
  if (!m) return { meta: {}, body: String(src).trim() };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i < 1 || /^\s*#/.test(line)) continue;
    meta[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).replace(/\s+#\s.*$/, '').trim();
  }
  return { meta, body: m[2].trim() };
}

/** „A=Text | B=Text“ → [{ key, label }] */
export function parseOptions(v) {
  return String(v || '').split('|').map(x => x.trim()).filter(Boolean).map(x => { const i = x.indexOf('='); return i > 0 ? { key: x.slice(0, i).trim().slice(0, 4), label: clip(x.slice(i + 1).trim(), 200) } : null; }).filter(Boolean).slice(0, 8);
}

export function loadTopics(root = ROOT()) {
  let dirs = [];
  try { dirs = readdirSync(root).filter(d => /^\d{3}-[a-z0-9-]{1,70}$/.test(d) && statSync(join(root, d)).isDirectory()).sort().reverse(); } catch { return []; }
  return dirs.map(id => {
    const dir = join(root, id);
    let q; try { q = parseDoc(readFileSync(join(dir, 'frage.md'), 'utf8')); } catch { return null; }
    const positions = readdirSync(dir).filter(f => /^(claude|chatgpt)(-\d+)?\.md$/.test(f)).map(f => {
      const { meta, body } = parseDoc(readFileSync(join(dir, f), 'utf8'));
      const round = +(/-(\d+)\.md$/.exec(f) || [0, 1])[1];
      return {
        file: f, autor: f.startsWith('chatgpt') ? 'chatgpt' : 'claude', runde: round, datum: clip(meta.datum, 10), empfehlung: clip(meta.empfehlung, 8),
        sicherheit: clip(meta.sicherheit, 12), aufwand: clip(meta.aufwand, 12), kosten: clip(meta.kosten, 200), body: clip(body, 8000),
      };
    }).sort((a, b) => a.runde - b.runde || a.autor.localeCompare(b.autor));
    return { id, titel: clip(q.meta.titel || id, 160), art: ['befund', 'aufgabe'].includes(q.meta.art) ? q.meta.art : 'entscheidung', status: clip(q.meta.status || 'offen', 20), erstellt: clip(q.meta.erstellt, 10), von: clip(q.meta.von, 10), optionen: parseOptions(q.meta.optionen), frage: clip(q.body, 8000), positions };
  }).filter(Boolean);
}
