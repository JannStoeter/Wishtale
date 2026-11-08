/*
 * Rechte und Verbrauch (Freemium). Gedacht für die Server-Funktionen: Sie fragen hier, ob eine Funktion für ein Konto freigeschaltet ist,
 * und buchen den Verbrauch der KI-Aufrufe. Durchgesetzt wird nur hier, die Oberfläche blendet höchstens Hinweise ein.
 * Gründerphase: Solange settings.plans.founder_until in der Zukunft liegt, gilt für alle der Plan „plus“.
 * Ohne Dienstschlüssel (zum Beispiel lokal) ist alles frei, damit nichts kaputtgeht.
 */
import { SUPABASE_URL, rest } from './auth.js';

/** Funktionsliste: Schlüssel -> kleinster Plan. „free“ ist der Kern. Neue Funktion = ein Eintrag. */
export const FEATURES = {
  'ideas.guest': 'plus',   // KI-Ideen in der Gast-Ansicht eines Profils (zählt beim Profilinhaber)
  'ideas.self': 'plus',    // KI-Ideen in der eigenen Inspiration
  'ideas.wish': 'plus',    // Produktvorschläge im Wunsch-Fenster
  'zettel': 'plus',        // Wunschzettel einlesen
  'inspect': 'free',       // Produktlink lesen
};
const RANK = { free: 0, plus: 1 };
const key = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function entitlementsOf(userId, fetchImpl = fetch) {
  const k = key();
  if (!k || !/^[0-9a-f-]{36}$/i.test(userId || '')) return { plan: 'plus', features: new Set(), credits: 0, open: true };
  try {
    const q = rest(k, fetchImpl), now = new Date().toISOString();
    const [rows, set] = await Promise.all([
      q(`entitlements?select=kind,key,quantity,valid_from,valid_until&user_id=eq.${userId}&valid_from=lte.${now}&or=(valid_until.is.null,valid_until.gt.${now})`),
      q('settings?select=value&key=eq.plans&limit=1'),
    ]);
    const founder = Date.parse(set?.[0]?.value?.founder_until || '') > Date.now();
    const plan = (rows || []).filter(r => r.kind === 'plan').map(r => r.key)[0] || (founder ? 'plus' : 'free');
    return {
      plan, features: new Set((rows || []).filter(r => r.kind === 'feature').map(r => r.key)),
      credits: (rows || []).filter(r => r.kind === 'credit').reduce((a, r) => a + (r.quantity || 0), 0), open: false,
    };
  } catch (e) { console.error('rechte', e.message); return { plan: 'plus', features: new Set(), credits: 0, open: true }; } // im Zweifel nicht aussperren
}

export const can = (ent, feature) => ent.open || ent.features.has(feature) || (RANK[ent.plan] ?? 0) >= (RANK[FEATURES[feature] || 'free'] ?? 0);

/** Verbrauch eines KI-Aufrufs buchen (Aufrufe und Token), still bei Fehlern. */
export async function recordUsage(userId, feature, usage = {}, fetchImpl = fetch) {
  const k = key();
  if (!k || !/^[0-9a-f-]{36}$/i.test(userId || '')) return;
  try {
    const headers = String(k).startsWith('sb_secret_') ? { apikey: k } : { apikey: k, authorization: `Bearer ${k}` };
    await fetchImpl(`${SUPABASE_URL}/rest/v1/rpc/bump_usage`, {
      method: 'POST', headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ p_user: userId, p_key: feature, p_in: usage.input_tokens | 0, p_out: usage.output_tokens | 0 }),
    });
  } catch (e) { console.error('verbrauch', e.message); }
}

/** Wem gehört das Profil (für Gast-Aufrufe: der Verbrauch geht auf das Konto der beschenkten Person). */
export async function ownerOf(handle, fetchImpl = fetch) {
  const k = key();
  if (!k) return null;
  try { return (await rest(k, fetchImpl)(`profiles?select=owner_id&handle=eq.${encodeURIComponent(handle)}&limit=1`))?.[0]?.owner_id || null; } catch { return null; }
}
