/*
 * Dauerhafte Begrenzung der KI-Aufrufe (Missbrauchsschutz). Gezählt wird in der Datenbank (hit_limit, 0021), nicht im Speicher einer
 * einzelnen Serverinstanz. Es zählen nur Aufrufe, die wirklich das Sprachmodell erreichen (Zwischenspeicher-Treffer sind kostenlos).
 * Grenzen lassen sich mit Umgebungsvariablen anpassen. Ohne Dienstschlüssel oder bei Datenbankfehlern wird nicht gesperrt (nichts geht kaputt),
 * dann bleiben die Grenzen im Speicher und die Ausgabengrenze bei Anthropic.
 */
import { createHash } from 'node:crypto';
import { HttpError, SUPABASE_URL } from './auth.js';

const key = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const num = (v, d) => (Number.isFinite(+v) && +v > 0 ? +v : d);
const DAY = 86400;

export const LIMITS = () => ({
  ipPerDay: num(process.env.LIMIT_IP_PER_DAY, 40),          // KI-Aufrufe aus Gast-Ansichten je Adresse und Tag
  profilePerDay: num(process.env.LIMIT_PROFILE_PER_DAY, 120), // alle KI-Aufrufe, die auf ein Konto gehen, je Tag
  zettelPerDay: num(process.env.LIMIT_ZETTEL_PER_DAY, 15),    // Wunschzettel je Konto und Tag
  globalPerDay: num(process.env.LIMIT_GLOBAL_PER_DAY, 3000),  // Notbremse für alle KI-Aufrufe zusammen
});

/** Adresse nur als Hash und je Tag anders, damit nichts Rückverfolgbares gespeichert wird. */
export const ipHash = ip => createHash('sha256').update(`${ip}|${new Date().toISOString().slice(0, 10)}|wishtale`).digest('hex').slice(0, 24);

async function hit(bucket, seconds, max, fetchImpl = fetch) {
  const k = key();
  if (!k) return { ok: true };
  try {
    const headers = String(k).startsWith('sb_secret_') ? { apikey: k } : { apikey: k, authorization: `Bearer ${k}` };
    const r = await fetchImpl(`${SUPABASE_URL}/rest/v1/rpc/hit_limit`, { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body: JSON.stringify({ p_bucket: bucket, p_window_seconds: seconds, p_max: max }) });
    if (!r.ok) { console.error('limit', r.status); return { ok: true }; }
    return await r.json();
  } catch (e) { console.error('limit', e.message); return { ok: true }; }
}

/**
 * Prüft die Grenzen für einen KI-Aufruf. Wirft 429 mit freundlichem Text, wenn eine Grenze erreicht ist.
 * who: { ip?, payer?, feature }
 */
export async function guardLlm({ ip, payer, feature }, fetchImpl = fetch) {
  const L = LIMITS();
  const checks = [['global', DAY, L.globalPerDay, 'Wishtale ist heute sehr gefragt. Bitte versuche es morgen noch einmal.']];
  if (payer) checks.push([`u:${payer}`, DAY, feature === 'zettel' ? L.zettelPerDay : L.profilePerDay, 'Für heute sind die Ideen aufgebraucht. Morgen geht es weiter.']);
  if (ip) checks.push([`ip:${ipHash(ip)}`, DAY, L.ipPerDay, 'Von hier kamen heute sehr viele Anfragen. Bitte versuche es morgen noch einmal.']);
  for (const [b, s, m, msg] of checks) {
    const r = await hit(`${feature}:${b}`.replace(/^[^:]+:global/, 'llm:global'), s, m, fetchImpl);
    if (!r.ok) throw new HttpError(429, msg);
  }
}
