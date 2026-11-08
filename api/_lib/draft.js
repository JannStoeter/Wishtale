/*
 * Schreibassistent: macht aus einer Idee (oder einer Überarbeitungs-Anweisung) einen fertigen Instagram-Beitrag im Wishtale-Ton.
 * Nutzt die Claude-API. Der Schlüssel steht nur in Vercel (ANTHROPIC_API_KEY). Das Ergebnis wird streng geprüft und gekürzt,
 * bevor das CMS es bekommt, weil ein Sprachmodell nie blind vertraut werden darf.
 */
import { HttpError } from './auth.js';

export const aiConfigured = () => !!process.env.ANTHROPIC_API_KEY;
const MODEL = () => process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';

const SYSTEM = `Du schreibst Instagram-Beiträge für Wishtale, eine kleine deutsche App für Wunschlisten, die den Geschmack hinter den Wünschen zeigt (Interessen, Lieblingsmarken, was schon vorhanden ist, was man nicht möchte). Freunde finden damit Geschenke, die wirklich passen.

Marke und Ton:
- Tagline: „Die Wunschliste, die dich kennt.“ Claim: „Jeder Wunsch hat eine Geschichte.“
- warm, in ganzen Sätzen, du-Ansprache, leicht erzählend
- keine Stichpunkt-Ketten, kein „Kein X, kein Y“, keine Ausrufezeichen-Serien, höchstens ein Ausrufezeichen
- keine Kurzsätze aus ein oder zwei Wörtern mit Punkt („Gewählt. Reserviert.“). Lieber ein fließender Satz mit Verbindung
- Überschriften ohne Schlusspunkt, wenn sie ein ganzer Satz sind
- kein Komma vor „und“ zwischen zwei Hauptsätzen (Nebensätze behalten ihr Schlusskomma)
- keine Pronomen (er, sie) für Personen, deren Geschlecht nicht bekannt ist: Namen wiederholen. Genitiv von Namen: „Jonas’“, „Lenas“
- Der Fokus liegt immer aufs Wünschen und auf dem eigenen Wunschzettel. Keine Kaufaufforderungen, keine Rabatt- oder Preisversprechen, keine Dringlichkeit („nur noch heute“), keine erfundenen Zahlen, Zitate oder Nutzerstimmen
- Produkte nur als Beispiel für einen Wunsch und nur, wenn die Idee es verlangt. Dann steht „Anzeige |“ am Anfang der Bildunterschrift
- Wishtale ist kostenlos, braucht aber ein Konto. Behaupte nichts darüber hinaus

Folien (Feld „slides“), jede mit „type“:
- cover: eyebrow (kleine Zeile, bis 3 Wörter), title, sub (optional)
- chips: eyebrow, title, sub (optional), chips (3 bis 6 kurze Begriffe, ein führendes * hebt höchstens einen hervor)
- quote: eyebrow, title, quote (ein Satz)
- cta: title, sub. Immer die letzte Folie
Textlängen: title höchstens 90 Zeichen, sub höchstens 170, quote höchstens 170, ein Chip höchstens 28.

Bildunterschrift (Feld „caption“): 2 bis 5 kurze Absätze, endet mit „Den Link findest du in der Bio.“ und dann einer Leerzeile mit 5 bis 8 Hashtags, darunter #wishtale. Höchstens 1200 Zeichen.

Antworte ausschließlich mit einem JSON-Objekt, ohne Erklärung und ohne Codeblock:
{"title":"interner Titel","caption":"…","slides":[{"type":"cover","eyebrow":"…","title":"…","sub":"…"}]}`;

const FORMATS = {
  post: 'Karussell: 5 bis 8 Folien. Jede Folie trägt einen Gedanken, die Reihenfolge erzählt eine kleine Geschichte.',
  story: 'Story: 2 bis 4 Folien, jede steht für sich und ist sehr kurz (title höchstens 60 Zeichen). Keine Bildunterschrift nötig, caption darf leer bleiben.',
  reel: 'Reel (Video aus den Folien, jede etwa 3 Sekunden): 5 bis 7 Folien mit kurzen Titeln (höchstens 60 Zeichen), wenig Fließtext.',
};
const GOALS = { neu: 'Die Zielgruppe sind Menschen, die Wishtale noch nicht kennen.', bestehend: 'Die Zielgruppe sind Menschen, die schon ein Wishtale haben. Es geht darum, dass ihre Freunde passende Geschenke für sie finden.' };

const clip = (v, n) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);

/** Prüft und kürzt das Ergebnis des Modells auf das Folienmodell des CMS. */
export function sanitize(raw, format = 'post') {
  let o = raw;
  if (typeof raw === 'string') {
    const m = raw.replace(/^```(?:json)?\s*|\s*```$/g, '').match(/\{[\s\S]*\}/);
    if (!m) throw new HttpError(502, 'Der Assistent hat keine brauchbare Antwort geliefert. Bitte versuche es noch einmal.');
    try { o = JSON.parse(m[0]); } catch { throw new HttpError(502, 'Die Antwort des Assistenten war unvollständig. Bitte versuche es noch einmal.'); }
  }
  const max = format === 'story' ? 5 : format === 'reel' ? 8 : 10;
  const types = ['cover', 'chips', 'quote', 'cta'];
  let slides = (Array.isArray(o.slides) ? o.slides : []).slice(0, max).map(s => {
    const type = types.includes(s.type) ? s.type : 'cover';
    return {
      type, theme: type === 'cta' ? 'gruen' : (s.theme === 'gruen' ? 'gruen' : 'creme'),
      eyebrow: clip(s.eyebrow, 40), title: clip(s.title, 120) || 'Dein Wishtale', sub: clip(s.sub, 220), quote: type === 'quote' ? clip(s.quote, 220) : '',
      chips: type === 'chips' ? (Array.isArray(s.chips) ? s.chips : []).slice(0, 8).map(c => clip(c, 30)).filter(Boolean) : [],
      handle: type === 'cta' ? '@wishtale.de' : '', domain: type === 'cta' ? 'wishtale.de' : '',
    };
  });
  if (!slides.length) throw new HttpError(502, 'Der Assistent hat keine Folien geliefert. Bitte versuche es noch einmal.');
  if (slides[slides.length - 1].type !== 'cta') slides.push({ type: 'cta', theme: 'gruen', eyebrow: '', title: 'Dein Wishtale wartet schon auf dich', sub: 'Erzähle deine eigene kleine Geschichte und bekomme Geschenke, die passen.', quote: '', chips: [], handle: '@wishtale.de', domain: 'wishtale.de' });
  slides = slides.slice(0, max);
  return { title: clip(o.title, 120) || 'Neuer Beitrag', caption: format === 'story' ? clip(o.caption, 2200) : String(o.caption ?? '').trim().slice(0, 2200), slides };
}

export async function draft(input, fetchImpl = fetch) {
  if (!aiConfigured()) throw new HttpError(400, 'Der Schreibassistent ist noch nicht verbunden.');
  const format = ['post', 'story', 'reel'].includes(input.format) ? input.format : 'post';
  let user;
  if (input.mode === 'revise') {
    const cur = JSON.stringify({ title: clip(input.current?.title, 120), caption: String(input.current?.caption || '').slice(0, 2200), slides: (input.current?.slides || []).slice(0, 10).map(s => ({ type: s.type, eyebrow: s.eyebrow, title: s.title, sub: s.sub, quote: s.quote, chips: s.chips })) });
    user = `Überarbeite diesen Beitrag nach der Anweisung und behalte, was nicht betroffen ist.\n\nFormat: ${FORMATS[format]}\n\nAktueller Beitrag:\n${cur}\n\nAnweisung: ${clip(input.instruction, 600)}`;
  } else {
    user = `Schreibe einen Beitrag zu dieser Idee.\n\nIdee: ${clip(input.idea, 800)}\n\nFormat: ${FORMATS[format]}\n${GOALS[input.goal] || GOALS.neu}`;
  }
  const r = await fetchImpl('https://api.anthropic.com/v1/messages', {
    method: 'POST', signal: AbortSignal.timeout(50000),
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODEL(), max_tokens: 2500, system: SYSTEM, messages: [{ role: 'user', content: user }] }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new HttpError(502, r.status === 401 ? 'Der Schlüssel für den Schreibassistenten wurde abgelehnt. Prüfe ANTHROPIC_API_KEY in Vercel.' : r.status === 429 ? 'Der Schreibassistent ist gerade überlastet. Bitte versuche es gleich noch einmal.' : `Der Schreibassistent hat einen Fehler gemeldet (${j.error?.message || r.status}).`);
  const text = (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
  return { ...sanitize(text, format), format };
}
