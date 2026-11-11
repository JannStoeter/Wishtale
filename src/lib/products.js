/*
 * Produkt-Zuordnung: Zu jedem Wunsch gibt es ein Produkt mit Amazon-Link.
 *  1. Kategorie-Wunsch ("Pfanne bis 100 €")  -> bester Treffer im Budget
 *  2. Link der Person                         -> genau dieser Link
 *  3. Treffer in Produktdaten / Katalog       -> Produkt mit Amazon-Seite (ASIN) bzw. Suche
 *  4. sonst                                   -> von Wishtale erzeugter Vorschlag (Amazon-Suche zur Wunschbeschreibung)
 */
import { same, overlap, norm, kwOf } from './util.js';
import { PRODUCTS, CATALOG } from '../data/content.js';
import { AMAZON_TAG, normUrl, searchUrl } from './shops.js';
import { picks, excluded, recommend } from '../logic.js';
import { weightOf } from './weights.js';
import { fits, wanted } from './fit.js';
import { livePRODUCTS } from './catalog.js';

export const amazonUrl = p => p.asin ? `https://www.amazon.de/dp/${p.asin}?tag=${AMAZON_TAG}` : searchUrl.amazon(p.search || p.t);

/**
 * Genaue Wünsche („Siku Fendt Traktor 824 mit Pflug“): Hier schlagen wir nichts anderes vor, sondern suchen genau diesen Begriff.
 * Ein Katalogprodukt zählt nur, wenn es den Wunsch inhaltlich abdeckt.
 */
const STOP = new Set(['mit', 'und', 'für', 'fuer', 'der', 'die', 'das', 'ein', 'eine', 'von', 'zum', 'zur', 'set']);
const words = t => norm(t).split(/[^a-zäöüss0-9]+/).filter(x => x && !STOP.has(x));
export const isSpecific = w => w.kind !== 'kategorie' && w.kind !== 'frei' && w.kind !== 'erlebnis' && (/\d/.test(w.t) || words(w.t).length >= 4);
export function covers(w, x) {
  if (!isSpecific(w)) return true;
  const hay = norm([x.t, x.brand, x.cat, x.search].filter(Boolean).join(' '));
  const ws = words(w.t);
  return ws.filter(k => hay.includes(k.length > 4 ? k.slice(0, -1) : k)).length / ws.length >= 0.8;
}

/** Ergebnis: { t, url, host, price, a, tone, source, ideas } */
export function productFor(person, w) {
  if (w.noSuggest && !deepLink(w.link)) return null;
  if (w.kind === 'kategorie') {
    const top = picks(person, w).list[0];
    if (top) return fromProduct(top.x, 'vorschlag');
  }
  const own = deepLink(w.link);
  if (own) return { t: w.t, url: own, host: new URL(own).hostname.replace(/^www\./, ''), price: w.price || null, priceBy: 'user', source: 'link', direct: true };
  // Nur Produkte, die zu den genannten Eigenschaften passen (z. B. „beschichtet“)
  const match = livePRODUCTS().filter(x => w.kw.some(k => same(k, x.cat)) && fits(w, x) && covers(w, x));
  const brandHit = match.find(x => norm(w.t).includes(norm(x.brand)));
  const catHit = brandHit || [...match].sort((a, b) => b.q - a.q)[0];
  if (catHit && w.kind !== 'frei') return fromProduct(catHit, 'katalog');
  const cat = !wanted(w).length && !isSpecific(w) && CATALOG.find(i => i.k === 'ding' && overlap(w.kw, i.kw));
  if (cat && w.kind !== 'frei') return { t: cat.t, url: searchUrl.amazon(cat.q || cat.t), host: 'amazon.de', range: cat.p, a: cat.a, source: 'katalog', direct: false };
  if (w.kind === 'erlebnis' || w.kind === 'frei') return null; // dafür gibt es Ideen (ideasFor)
  return { t: w.t, url: searchUrl.amazon(w.t), host: 'amazon.de', source: 'erzeugt', direct: false };
}

/* Nur echte Produktlinks zählen. Eine bloße Shop-Startseite (z. B. lecreuset.de) ersetzen wir durch ein Amazon-Produkt. */
function deepLink(raw) {
  const u = normUrl(raw);
  if (!u) return null;
  const { pathname, search } = new URL(u);
  return pathname.length > 1 || search ? u : null;
}

const fromProduct = (x, source) => ({ t: x.t, url: amazonUrl(x), host: 'amazon.de', price: x.price, a: x.a, tone: x.tone, brand: x.brand, source, direct: !!x.asin });

/** Ideen zu freien Wünschen ("Etwas Schönes für den Balkon"): passende Katalogprodukte. */
export function ideasFor(person, w, n = 3) {
  const stop = new Set(kwOf(w.t));
  return CATALOG.filter(i => i.k === 'ding' && !excluded(person, i) && (i.c === w.c || i.tags.some(t => stop.has(t))))
    .slice(0, n);
}

/**
 * Angebote zu einem Wunsch für das Detail-Fenster: ein Hauptvorschlag und Alternativen.
 * Jedes Angebot hat eine id, damit der Gast eines davon wählen kann.
 */
export function offersFor(person, w) {
  if (w.noSuggest) { // „Hierfür keine Vorschläge“: nur der eigene Link der Person bleibt
    const own = deepLink(w.link);
    return { main: own ? { t: w.t, url: own, host: new URL(own).hostname.replace(/^www\./, ''), price: w.price || null, priceBy: 'user', source: 'link', direct: true, id: 'main' } : null, alts: [], over: 0 };
  }
  const main = productFor(person, w);
  if (w.kind === 'kategorie') {
    const { list, over } = picks(person, w);
    const offers = list.map(e => ({ ...fromProduct(e.x, 'vorschlag'), id: e.x.id, why: e.why }));
    return { main: offers[0] || (main && { ...main, id: 'main' }) || null, alts: offers.slice(1, 4), over };
  }
  const pool = livePRODUCTS().filter(x => w.kw.some(k => same(k, x.cat)) && fits(w, x) && covers(w, x));
  if (main && pool.length && w.kind !== 'frei') {
    const mp = pool.find(x => x.t === main.t);
    const alts = pool.filter(x => x !== mp).sort((a, b) => b.q - a.q).slice(0, 3).map(x => ({ ...fromProduct(x, 'katalog'), id: x.id }));
    return { main: { ...main, id: mp ? mp.id : 'main' }, alts, over: 0 };
  }
  const alts = w.kind === 'frei'
    ? ideasFor(person, w, 3).map(i => ({ t: i.t, url: searchUrl.amazon(i.q || i.t), host: 'amazon.de', range: i.p, a: i.a, source: 'idee', direct: false, id: i.id }))
    : [];
  return { main: main ? { ...main, id: 'main' } : null, alts, over: 0 };
}

/** Beliebte Wunschideen für Profile, die noch kaum etwas angegeben haben. Gewichtung aus dem CMS gilt auch hier. */
export function popularOffers(n = 4) {
  return livePRODUCTS()
    .map(x => ({ x, sc: x.q * weightOf(WORLD_OF_CAT[x.cat] || 'wohnen') }))
    .filter(e => e.sc > 0).sort((a, b) => b.sc - a.sc).slice(0, n)
    .map(({ x }) => ({ ...fromProduct(x, 'katalog'), id: x.id, why: [] }));
}

/**
 * „So etwas habe ich schon“: Zu einem Vorschlag die Art des Produkts (nicht das genaue Produkt), z. B. „Kopfhörer“ oder „Bratpfanne“.
 * Wird als „schon vorhanden“ gespeichert, dann tauchen Vorschläge dieser Art nicht mehr auf.
 */
const TYPE_LABEL = { pfanne: 'Bratpfanne', bräter: 'Bräter', messerset: 'Messerset', wasserkocher: 'Wasserkocher', mühle: 'Kaffeemühle', wanderstöcke: 'Wanderstöcke' };
const cap = s => String(s).charAt(0).toUpperCase() + String(s).slice(1);
export function ownedTypeFor(id) {
  const x = PRODUCTS.find(p => p.id === id);
  if (x) return { label: TYPE_LABEL[x.cat] || cap(x.cat), kw: [x.cat], a: x.a, tone: x.tone, c: WORLD_OF_CAT[x.cat] || 'wohnen' };
  const it = CATALOG.find(i => String(i.id) === String(id));
  if (it) {
    // Art des Produkts: Wort vor dem Doppelpunkt („Kochbuch: …“), sonst das Stichwort, wenn es im Titel steht, sonst der erste Teil des Titels
    const head = it.t.split(/:| für | mit /)[0].trim();
    const key = (it.kw || [])[0];
    const label = it.t.includes(':') ? head : (key && norm(it.t).includes(norm(key)) ? cap(key) : head);
    return { label: cap(label), kw: [...new Set([...(it.kw || []), ...kwOf(label)])], a: it.a, tone: 0, c: it.c };
  }
  return null;
}

/** Ein paar Produkte für die Aktion in der App: reihum je ein Treffer aus den Welten der Person, sonst beliebte Wunschideen. */
export function promoOffers(person, n = 3) {
  const out = [], seen = new Set();
  for (let i = 0; i < 3 && out.length < n; i++) {
    for (const cid of person.cats) {
      const o = worldOffers(person, cid, i + 1)[i];
      if (o && !seen.has(o.id)) { seen.add(o.id); out.push({ ...o, _cid: cid }); if (out.length >= n) break; }
    }
  }
  for (const o of popularOffers(n + 3)) if (out.length < n && !seen.has(o.id)) { seen.add(o.id); out.push({ ...o, _cid: 'wohnen' }); }
  return out;
}

/* ---------- Welten ---------- */
export const WORLD_OF_CAT = { pfanne: 'kochen', bräter: 'kochen', messerset: 'kochen', wasserkocher: 'genuss', mühle: 'genuss', wanderstöcke: 'outdoor' };
const strip = t => String(t).replace(/<[^>]+>/g, '');
const nearby = t => `https://www.google.de/search?q=${encodeURIComponent(t + ' in der Nähe')}`;

/**
 * Produkte und Erlebnisse zu einer Welt (z. B. "genuss") aus dem, was wir über die Person wissen:
 * Interessen, Marken, Wünsche. Ausgeschlossen: was sie schon hat, schon bekam oder nicht möchte.
 */
export function worldOffers(person, cid, n = 6) {
  const out = [];
  livePRODUCTS().filter(x => WORLD_OF_CAT[x.cat] === cid && !excluded(person, { kw: [...kwOf(x.t), x.cat] })).forEach(x => {
    const wt = weightOf(cid);
    if (wt === 0) return;
    const why = [];
    let sc = x.q * wt;
    if (person.brands.includes(x.brand)) { sc += 4; why.push(`${x.brand} gehört zu den Lieblingsmarken.`); }
    if (person.wishes.some(w => w.status === 'offen' && w.kw.some(k => same(k, x.cat)))) { sc += 3; why.push('Passt zu einem Wunsch auf der Liste.'); }
    out.push({ sc, offer: { ...fromProduct(x, 'katalog'), id: x.id, why } });
  });
  recommend(person).good.filter(g => g.it.c === cid).forEach(g => {
    const exp = g.it.k === 'erlebnis';
    out.push({
      sc: g.sc,
      offer: {
        t: g.it.t, url: exp ? nearby(g.it.q || g.it.t) : searchUrl.amazon(g.it.q || g.it.t), host: exp ? 'google.de' : 'amazon.de', cta: exp ? 'In der Nähe suchen' : null,
        range: exp ? null : g.it.p, a: g.it.a, source: 'idee', direct: false, id: g.it.id, exp, why: g.why.slice(0, 2).map(strip),
      },
    });
  });
  const seen = new Set();
  return out.sort((a, b) => b.sc - a.sc).map(o => o.offer).filter(o => !seen.has(o.t) && seen.add(o.t)).slice(0, n);
}
