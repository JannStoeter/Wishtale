/*
 * Shop-Links. Ohne Produkt-Feed gibt es keine garantierten Direktlinks oder Live-Preise.
 * Darum erzeugen wir aus Wunsch/Produkt eine Suchanfrage und verlinken auf Preisvergleich und Shops,
 * dort sieht man tagesaktuelle Preise. Eigene Links der Nutzer (Wunsch-Link) haben Vorrang.
 */
const enc = encodeURIComponent;

/* Amazon-PartnerNet Tracking-ID. Wird als ?tag=... an alle amazon.de-Links gehängt. */
export const AMAZON_TAG = 'jannst-21';

/** Pflichthinweis laut Amazon-PartnerNet-Teilnahmebedingungen. */
export const AMAZON_DISCLOSURE = 'Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.';

/** Hängt die Partner-ID an jede amazon.de-URL (auch an Direktlinks von Nutzern). */
export function withAmazonTag(url) {
  try {
    const u = new URL(url);
    if (/(^|\.)amazon\.de$/i.test(u.hostname)) u.searchParams.set('tag', AMAZON_TAG);
    return u.href;
  } catch { return url; }
}

/*
 * Awin (Publisher 3165716). Je zugesagtem Programm eine Händler-ID (awinmid). Bisher nur Otto DE.
 * Gespeichert wird immer die ursprüngliche Shop-Adresse, der Awin-Deeplink entsteht erst beim Anzeigen (partnerLink),
 * damit das Bearbeiten-Feld die echte Adresse zeigt und eine geänderte ID sofort überall gilt.
 */
export const AWIN_PUBLISHER = '3165716';
export const AWIN_MERCHANTS = [
  { shop: 'otto', name: 'Otto', mid: '14336', host: /(^|\.)otto\.de$/i },
];
const AWIN_HOST = /(^|\.)awin1\.com$/i;

/** Click Reference für Awin: nur Buchstaben und Ziffern, höchstens 40 Zeichen (Wunsch-ID, nie Personendaten). */
export const clickRef = v => String(v ?? '').replace(/[^a-z0-9]/gi, '').slice(0, 40);

/** Awin-Händler zu einer Adresse, oder null. */
export function awinMerchant(url) {
  try { const h = new URL(url).hostname; return AWIN_MERCHANTS.find(m => m.host.test(h)) || null; } catch { return null; }
}

/** Macht aus einer Händler-Adresse (z. B. otto.de) den Awin-Deeplink, mit Click Reference. Andere Adressen bleiben gleich. */
export function withAwin(url, ref) {
  const m = awinMerchant(url);
  if (!m) return url;
  let target;
  try { const u = new URL(url); u.protocol = 'https:'; target = u.href; } catch { return url; }
  const r = clickRef(ref);
  return `https://www.awin1.com/cread.php?awinmid=${m.mid}&awinaffid=${AWIN_PUBLISHER}${r ? `&clickref=${r}` : ''}&ued=${enc(target)}`;
}

/** Ein Awin-Deeplink zeigt auf diese Shop-Adresse (ued), sonst null. */
export function awinTarget(url) {
  try {
    const u = new URL(url);
    if (!AWIN_HOST.test(u.hostname)) return null;
    const t = u.searchParams.get('ued');
    return t && /^https?:\/\//i.test(t) ? t : null;
  } catch { return null; }
}

/** Shop, den ein Partnerlink erreicht: 'amazon', 'otto' oder null (kein Partnerlink). */
export function partnerOf(url) {
  const real = awinTarget(url) || url;
  try { if (/(^|\.)amazon\.de$/i.test(new URL(real).hostname)) return 'amazon'; } catch { return null; }
  const m = awinMerchant(real);
  return m && awinTarget(url) ? m.shop : null;
}

/** Hostname zum Anzeigen ohne www, auch hinter einem Awin-Deeplink („otto.de“ statt „awin1.com“). */
export function shopHost(url) {
  try { return new URL(awinTarget(url) || url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

/** Zentrale Stelle für ausgehende Shop-Links: Amazon bekommt die Partner-ID, Awin-Händler den Deeplink. */
export function partnerLink(url, ref) {
  if (!url || awinTarget(url)) return url;
  return withAwin(withAmazonTag(url), ref);
}

/** Macht aus "shop.de/produkt" eine gültige https-URL; liefert null bei leerer/ungültiger Eingabe. */
export function normUrl(raw) {
  const v = (raw || '').trim();
  if (!v) return null;
  const u = /^https?:\/\//i.test(v) ? v : 'https://' + v;
  try { const p = new URL(u); return /\./.test(p.hostname) ? withAmazonTag(p.href) : null; } catch { return null; }
}

export const searchUrl = {
  idealo: q => `https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=${enc(q)}`,
  google: q => `https://www.google.de/search?tbm=shop&q=${enc(q)}`,
  amazon: q => `https://www.amazon.de/s?k=${enc(q)}&tag=${AMAZON_TAG}`,
};

export const shopLinks = q => [
  { n: 'idealo', u: searchUrl.idealo(q) },
  { n: 'Google Shopping', u: searchUrl.google(q) },
  { n: 'Amazon', u: searchUrl.amazon(q) },
];

/** Anzeige-HTML: eine Zeile mit Link-Chips. Externe Links immer mit noopener und sponsored. */
export const linkChip = (href, label) =>
  `<a class="chip" href="${href}" target="_blank" rel="noopener noreferrer sponsored">${label}</a>`;

export const shopChips = q => shopLinks(q).map(s => linkChip(s.u, s.n)).join('');

/** Die Amazon-App teilt „Titel + Link“. Der Text vor dem Link ist oft der Produktname. */
export function shareTitle(text, link) {
  let t = String(text || '').split(link)[0].replace(/["„“”]/g, '').replace(/\s+/g, ' ').trim();
  const m = t.match(/^(?:schau dir|sieh dir)\b(.*?)\ban\s*:?\s*(.*)$/i);
  if (m) {
    const rest = m[2].trim();
    t = rest || m[1].replace(/\b(mal|diesen|dieses|diese|artikel|produkt|das|den|die)\b/gi, '').trim();
  }
  t = t.replace(/[:\-–|\s]+$/, '').trim();
  return t.length >= 4 ? t.slice(0, 90) : '';
}

/**
 * Liest einen von Amazon kopierten Link (oder Teilen-Text) und macht daraus ASIN, Titel und Partnerlink.
 * Der Titel stammt aus dem Link-Text der Produktseite. Er ist nur ein Vorschlag und bleibt editierbar.
 */
export function parseAmazonInput(text) {
  const m = String(text || '').match(/https?:\/\/[^\s<>"]+/i);
  if (!m) return { error: 'Kein Link gefunden. Kopiere die Adresse der Produktseite bei Amazon.' };
  let url;
  try { url = new URL(m[0].replace(/[).,;]+$/, '')); } catch { return { error: 'Der Link ist ungültig.' }; }
  const host = url.hostname.toLowerCase();
  if (/^(amzn\.(to|eu)|a\.co)$/.test(host)) return { short: true, shortUrl: url.href, hint: shareTitle(text, m[0]) };
  if (!/(^|\.)amazon\.de$/.test(host)) return { error: 'Bitte einen Link von amazon.de verwenden.' };
  const a = url.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d|exec\/obidos\/asin)\/([A-Z0-9]{10})/i);
  if (!a) return { error: 'Das ist keine Produktseite (es fehlt /dp/…). Öffne das Produkt und kopiere dann den Link.' };
  const asin = a[1].toUpperCase();
  const parts = url.pathname.split('/').filter(Boolean);
  const i = parts.findIndex(x => /^(dp|product|d|asin)$/i.test(x));
  const seg = i > 0 ? parts[i - 1] : '';
  let title = '';
  if (seg && !/^(-|gp|exec|obidos|aw|de|en|s)$/i.test(seg)) {
    try { title = decodeURIComponent(seg).replace(/-/g, ' ').replace(/\s+/g, ' ').trim(); } catch { /* ignorieren */ }
  }
  if (!title) title = shareTitle(text, m[0]);
  return { asin, title: title.slice(0, 90), url: `https://www.amazon.de/dp/${asin}?tag=${AMAZON_TAG}` };
}

/**
 * Links für "Wenn nichts passt" (Gutscheine, lokale Läden, Spenden). Noch ohne Partnerprogramm: Der Nutzer
 * soll trotzdem sofort ans Ziel kommen. Später können hier Affiliate-Links hinterlegt werden.
 * Alles mit Suche statt festen Unterseiten, weil sich Shop-Adressen oft ändern.
 */
const VOUCHERS = {
  'amazon-gutschein': { url: () => `https://www.amazon.de/s?k=${enc('Amazon.de Gutschein')}&tag=${AMAZON_TAG}`, tag: 'Anzeige' },
  'wunschgutschein': { url: () => 'https://www.wunschgutschein.de/' },
  'buchhandlung vor ort': { url: () => 'https://www.genialokal.de/' },
  'lokaler kaffeeröster': { url: () => `https://www.google.de/maps/search/${enc('Kaffeerösterei in der Nähe')}` },
  'spende: naturschutz': { url: () => 'https://www.nabu.de/' },
  'spende: tierschutz': { url: () => 'https://www.tierschutzbund.de/' },
};
export function voucherLink(label) {
  const v = VOUCHERS[String(label).toLowerCase()];
  if (v) return { url: v.url(), ad: !!v.tag };
  return { url: `https://www.google.de/search?q=${enc(String(label).replace(/^Spende:\s*/i, 'Spenden für ') + ' kaufen')}`, ad: false };
}
