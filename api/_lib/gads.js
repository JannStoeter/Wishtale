/*
 * Google Ads über die REST-Schnittstelle: Kampagnen lesen, pausieren, Budget ändern, Suchkampagne aus einem Plan anlegen.
 * Voraussetzungen (alles als Umgebungsvariablen in Vercel): Entwickler-Token, OAuth-Client (ID und Secret), Refresh-Token, Kunden-ID.
 * Neue Kampagnen werden immer pausiert angelegt, damit nichts ungeprüft Geld kostet.
 */
import { HttpError } from './auth.js';

const env = () => ({
  dev: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '', id: process.env.GOOGLE_ADS_CLIENT_ID || '', secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
  refresh: process.env.GOOGLE_ADS_REFRESH_TOKEN || '', customer: (process.env.GOOGLE_ADS_CUSTOMER_ID || '').replace(/\D/g, ''),
  login: (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || '').replace(/\D/g, ''), version: process.env.GOOGLE_ADS_API_VERSION || 'v22',
});
export const gadsConfigured = () => { const e = env(); return !!(e.id && e.secret && e.refresh && e.customer); }; // Der Entwickler-Token ist nach neueren Google-Regeln optional (Zugriffsstufe hängt am Cloud-Projekt), ohne ihn wird kein Kopf gesendet

async function accessToken(fetchImpl) {
  const e = env();
  const r = await fetchImpl('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: e.id, client_secret: e.secret, refresh_token: e.refresh, grant_type: 'refresh_token' }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw new HttpError(502, 'Google hat die Anmeldung abgelehnt. Prüfe Client-ID, Secret und Refresh-Token.');
  return j.access_token;
}

async function api(path, body, fetchImpl) {
  const e = env(), token = await accessToken(fetchImpl);
  const headers = { authorization: `Bearer ${token}`, 'content-type': 'application/json', ...(e.dev ? { 'developer-token': e.dev } : {}), ...(e.login ? { 'login-customer-id': e.login } : {}) };
  const r = await fetchImpl(`https://googleads.googleapis.com/${e.version}/customers/${e.customer}/${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const d = j.error?.details?.[0]?.errors?.[0]?.message || j.error?.message || `Fehler ${r.status}`;
    throw new HttpError(502, `Google Ads: ${d}`);
  }
  return j;
}

export async function campaigns(fetchImpl = fetch) {
  const q = `SELECT campaign.id, campaign.name, campaign.status, campaign_budget.id, campaign_budget.amount_micros, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
    FROM campaign WHERE campaign.status != 'REMOVED' AND segments.date DURING LAST_30_DAYS ORDER BY metrics.cost_micros DESC`;
  const j = await api('googleAds:search', { query: q }, fetchImpl);
  return (j.results || []).map(r => ({
    id: r.campaign.id, name: r.campaign.name, status: r.campaign.status, budgetId: r.campaignBudget?.id, dailyBudget: (+r.campaignBudget?.amountMicros || 0) / 1e6,
    impressions: +r.metrics?.impressions || 0, clicks: +r.metrics?.clicks || 0, cost: (+r.metrics?.costMicros || 0) / 1e6, conversions: +r.metrics?.conversions || 0,
  }));
}

export async function setStatus(campaignId, status, fetchImpl = fetch) {
  if (!/^\d+$/.test(String(campaignId))) throw new HttpError(400, 'Ungültige Kampagne.');
  if (!['ENABLED', 'PAUSED'].includes(status)) throw new HttpError(400, 'Ungültiger Status.');
  const cid = env().customer;
  await api('campaigns:mutate', { operations: [{ updateMask: 'status', update: { resourceName: `customers/${cid}/campaigns/${campaignId}`, status } }] }, fetchImpl);
}

export async function setBudget(budgetId, euro, fetchImpl = fetch) {
  const v = Number(euro);
  if (!/^\d+$/.test(String(budgetId)) || !(v > 0 && v <= 1000)) throw new HttpError(400, 'Ungültiges Budget (0 bis 1000 Euro pro Tag).');
  const cid = env().customer;
  await api('campaignBudgets:mutate', { operations: [{ updateMask: 'amountMicros', update: { resourceName: `customers/${cid}/campaignBudgets/${budgetId}`, amountMicros: String(Math.round(v * 1e6)) } }] }, fetchImpl);
}

const kw = k => (/^\[.*\]$/.test(k) ? { text: k.slice(1, -1), matchType: 'EXACT' } : /^".*"$/.test(k) ? { text: k.slice(1, -1), matchType: 'PHRASE' } : { text: k, matchType: 'BROAD' });
const clip = (t, n) => String(t).slice(0, n);

/** Legt aus einem Plan eine pausierte Suchkampagne an (Budget, Kampagne, Standort Deutschland, Sprache Deutsch, Anzeigengruppe, Suchbegriffe, Anzeige). */
export async function createFromPlan(plan, fetchImpl = fetch) {
  if ((plan.headlines || []).length < 3 || (plan.descriptions || []).length < 2) throw new HttpError(400, 'Der Plan braucht mindestens 3 Überschriften und 2 Beschreibungen.');
  if (!/^https:\/\//.test(plan.final_url || '')) throw new HttpError(400, 'Die Ziel-Adresse fehlt.');
  const cid = env().customer, stamp = new Date().toISOString().slice(0, 10);
  const url = new URL(plan.final_url); url.searchParams.set('utm_source', 'google'); url.searchParams.set('utm_medium', 'cpc'); if (plan.utm_campaign) url.searchParams.set('utm_campaign', plan.utm_campaign);
  const budget = `customers/${cid}/campaignBudgets/-1`, campaign = `customers/${cid}/campaigns/-2`, group = `customers/${cid}/adGroups/-3`;
  const ops = [
    { campaignBudgetOperation: { create: { resourceName: budget, name: `${plan.name} Budget ${stamp} ${Date.now()}`, amountMicros: String(Math.round((plan.budget_daily || 5) * 1e6)), deliveryMethod: 'STANDARD', explicitlyShared: false } } },
    { campaignOperation: { create: { resourceName: campaign, name: `${plan.name} ${stamp}`, status: 'PAUSED', advertisingChannelType: 'SEARCH', campaignBudget: budget, manualCpc: { enhancedCpcEnabled: false },
      networkSettings: { targetGoogleSearch: true, targetSearchNetwork: false, targetContentNetwork: false }, containsEuPoliticalAdvertising: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING' } } },
    { campaignCriterionOperation: { create: { campaign, location: { geoTargetConstant: 'geoTargetConstants/2276' } } } }, // Deutschland
    { campaignCriterionOperation: { create: { campaign, language: { languageConstant: 'languageConstants/1001' } } } }, // Deutsch
    { adGroupOperation: { create: { resourceName: group, name: `${plan.name} Anzeigengruppe`, campaign, status: 'ENABLED', type: 'SEARCH_STANDARD', cpcBidMicros: '500000' } } },
    ...(plan.keywords || []).slice(0, 80).map(k => ({ adGroupCriterionOperation: { create: { adGroup: group, status: 'ENABLED', keyword: kw(k) } } })),
    { adGroupAdOperation: { create: { adGroup: group, status: 'ENABLED', ad: { finalUrls: [url.href], responsiveSearchAd: {
      headlines: plan.headlines.slice(0, 15).map(t => ({ text: clip(t, 30) })), descriptions: plan.descriptions.slice(0, 4).map(t => ({ text: clip(t, 90) })) } } } } },
  ];
  await api('googleAds:mutate', { mutateOperations: ops }, fetchImpl);
  return { name: `${plan.name} ${stamp}` };
}
