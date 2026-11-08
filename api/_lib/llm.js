/*
 * Ein Ort für alle Sprachmodell-Aufrufe der Nutzerfunktionen. Zwei Stufen:
 *  - main:  das große Modell (ANTHROPIC_MODEL, Standard claude-sonnet-5-5) für alles mit Qualitätsanspruch
 *  - light: das kleine Modell (ANTHROPIC_MODEL_LIGHT, Standard claude-haiku-5-5) für einfache Aufgaben
 * Später austauschbar: Sind LIGHT_LLM_BASE_URL, LIGHT_LLM_KEY und LIGHT_LLM_MODEL gesetzt, läuft die Stufe „light“ über eine
 * OpenAI-kompatible Schnittstelle (zum Beispiel ein anderer Anbieter). Achtung: Ein neuer Anbieter ist ein neuer Auftragsverarbeiter und
 * muss vorher in datenschutz.html stehen, bei Anbietern außerhalb der EU samt Rechtsgrundlage für die Übermittlung.
 * Bilder gehen immer an Anthropic (Stufe main).
 */
import { HttpError } from './auth.js';

export const aiConfigured = () => !!process.env.ANTHROPIC_API_KEY;
export const modelFor = tier => (tier === 'light' ? (process.env.LIGHT_LLM_MODEL || process.env.ANTHROPIC_MODEL_LIGHT || 'claude-haiku-5-5') : (process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5'));
const external = tier => tier === 'light' && process.env.LIGHT_LLM_BASE_URL && process.env.LIGHT_LLM_KEY;

/** content: Text oder Anthropic-Inhaltsliste. Liefert { text, usage: { input_tokens, output_tokens }, model, stop }. */
export async function complete({ tier = 'main', system, content, maxTokens = 2000, timeoutMs = 50000 }, fetchImpl = fetch) {
  const model = modelFor(tier);
  if (external(tier)) {
    const r = await fetchImpl(`${process.env.LIGHT_LLM_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST', signal: AbortSignal.timeout(timeoutMs),
      headers: { authorization: `Bearer ${process.env.LIGHT_LLM_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'system', content: system }, { role: 'user', content: typeof content === 'string' ? content : content.filter(c => c.type === 'text').map(c => c.text).join('\n') }] }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { console.error('llm-extern', r.status, String(j.error?.message || '').slice(0, 200)); throw new HttpError(502, 'Die KI antwortet gerade nicht. Bitte versuche es noch einmal.'); }
    return { text: j.choices?.[0]?.message?.content || '', usage: { input_tokens: j.usage?.prompt_tokens || 0, output_tokens: j.usage?.completion_tokens || 0 }, model, stop: j.choices?.[0]?.finish_reason };
  }
  const r = await fetchImpl('https://api.anthropic.com/v1/messages', {
    method: 'POST', signal: AbortSignal.timeout(timeoutMs),
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: [{ role: 'user', content }] }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    console.error('anthropic', r.status, j.error?.type, String(j.error?.message || '').slice(0, 200));
    throw new HttpError(502, r.status === 429 ? 'Gerade ist viel los. Bitte versuche es in einer Minute noch einmal.' : 'Die KI antwortet gerade nicht. Bitte versuche es noch einmal.');
  }
  return { text: (j.content || []).filter(c => c.type === 'text').map(c => c.text).join(''), usage: j.usage || {}, model, stop: j.stop_reason };
}

/** Zwischenspeicher mit Fingerabdruck: gleiche Eingabe = gleiche Antwort, ohne neuen Aufruf. Nur mit Dienstschlüssel, sonst still aus. */
import { createHash } from 'node:crypto';
import { rest } from './auth.js';
const skey = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
export const fingerprint = obj => createHash('sha256').update(JSON.stringify(obj)).digest('hex');
const MAX_AGE = 45 * 864e5;

export async function cacheGet(hash, fetchImpl = fetch) {
  const k = skey(); if (!k) return null;
  try {
    const [row] = await rest(k, fetchImpl)(`idea_cache?select=result,created_at&hash=eq.${hash}&limit=1`);
    return row && Date.now() - Date.parse(row.created_at) < MAX_AGE ? row.result : null;
  } catch { return null; }
}
export async function cachePut(hash, feature, result, fetchImpl = fetch) {
  const k = skey(); if (!k) return;
  try { await rest(k, fetchImpl)('idea_cache?on_conflict=hash', { method: 'POST', body: { hash, feature, result, created_at: new Date().toISOString() } }); } catch (e) { console.error('cache', e.message); }
}
