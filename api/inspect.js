import { requireUser, send, fail, HttpError } from './_lib/auth.js';
import { inspect, fetchImage } from './_lib/inspect.js';
import { findProductImage, amazonDirect, imageForWish, priceForWish, searchProducts, lookFor, titleForLink, amazonInfo, shortTitle } from './_lib/imgsearch.js';
import { guardSearch } from './_lib/limits.js';

const searchOn = () => !!process.env.BRAVE_SEARCH_API_KEY;

const seen = new Map(); // einfache Bremse pro Instanz: höchstens 20 Abrufe in 10 Minuten je Person
const limited = id => { const now = Date.now(), l = (seen.get(id) || []).filter(t => now - t < 600000); l.push(now); seen.set(id, l); return l.length > 40; };

/** Liest Name, Preis, Marke, Größe und Bildadresse einer Produktseite (Body: { url }) oder holt ein Produktbild (Body: { imageUrl }). Nur angemeldete Personen. */
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Nur POST.' });
  try {
    const { id } = await requireUser(req);
    if (limited(id)) throw new HttpError(429, 'Das waren gerade etwas viele Abrufe. Bitte versuche es in ein paar Minuten noch einmal.');
    if (req.body?.imageUrl) { // Produktbild holen (Bytes kommen als Base64 zurück, der Browser verkleinert und speichert es bei uns)
      const iu = String(req.body.imageUrl).trim();
      if (iu.length > 800) throw new HttpError(400, 'Das ist keine gültige Bildadresse.');
      return send(res, 200, { image: await fetchImage(iu) });
    }
    // Alles, was Brave fragt, zählt gegen die Tagesgrenzen (nur mit Schlüssel, sonst gibt es ohnehin null)
    if ((req.body?.imageQuery || req.body?.amazonQuery || req.body?.imageFor || req.body?.priceFor || req.body?.searchQuery || req.body?.titleFor) && searchOn()) await guardSearch(id);
    if (req.body?.searchQuery) { // Produktsuche im Wunschdialog (124): Treffer mit Name, Preis und Bild, nur zum Anzeigen
      const q = String(req.body.searchQuery).trim().slice(0, 120);
      if (q.length < 2) throw new HttpError(400, 'Bitte gib einen Suchbegriff ein.');
      const shop = ['amazon', 'otto'].includes(req.body.shop) ? req.body.shop : '';
      let results = await searchProducts(q, { shop }).catch(() => []);
      if (shop === 'otto' && results && !results.length) results = await searchProducts(q, {}).catch(() => []); // Otto findet nichts: andere Shops
      console.log('suche-wunsch', JSON.stringify({ shop: shop || 'alle', treffer: results ? results.length : null }));
      return send(res, 200, { results });
    }
    if (req.body?.imageQuery) { const q = String(req.body.imageQuery).slice(0, 120), look = await lookFor(q); return send(res, 200, { image: look ? await findProductImage(q, { look, images: { look } }).catch(() => null) : null }); } // Bild per Websuche (nur mit Schlüssel), sonst null
    if (req.body?.imageFor) { // Bild zu einem gespeicherten Wunsch: eigener Shop-Link zuerst, dann Herstellerseite, dann Bildersuche
      const f = req.body.imageFor, t = String(f.t || '').slice(0, 120), q = String(f.q || '').slice(0, 120), brand = String(f.brand || '').slice(0, 40), link = String(f.link || '').slice(0, 1000), img = String(f.img || '').slice(0, 800);
      const image = await imageForWish({ t, q, brand, link, img }).catch(() => null);
      console.log('bild-wunsch', JSON.stringify({ via: image?.via || 'keins', quelle: image?.source || '', titel: image?.title || '' }));
      return send(res, 200, { image });
    }
    if (req.body?.priceFor) { // Preis zu einem gespeicherten Wunsch: eigener Shop-Link zuerst, sonst Hersteller- oder Shopseite (nur echte Preise in Euro)
      const f = req.body.priceFor, t = String(f.t || '').slice(0, 120), q = String(f.q || '').slice(0, 120), brand = String(f.brand || '').slice(0, 40), link = String(f.link || '').slice(0, 1000);
      const price = await priceForWish({ t, q, brand, link }).catch(() => null);
      console.log('preis-wunsch', JSON.stringify({ via: price?.via || 'keins', quelle: price?.source || '', preis: price?.price || null }));
      return send(res, 200, { price });
    }
    if (req.body?.titleFor) { // Name zu einem Link, den wir nicht lesen (Amazon): nur die Titelzeile der Suchmaschine zur Produktnummer
      const link = String(req.body.titleFor).slice(0, 1000);
      // Bei Amazon zusätzlich die Seite selbst (Name, Preis, Bild; 139, Jann), parallel zur Suchmaschine
      const [found, pg] = await Promise.all([titleForLink(link).catch(() => null), amazonInfo(link).catch(() => null)]);
      const t = found || pg ? { ...(found || { host: 'amazon.de', via: 'amazon' }), title: (found && found.title) || shortTitle(pg.title || ''), price: pg?.price || null, imageUrl: pg?.imageUrl || found?.imageUrl || '' } : null;
      console.log('titel-link', JSON.stringify({ treffer: !!t, titel: t?.title || '' }));
      return send(res, 200, { title: t });
    }
    if (req.body?.amazonQuery) return send(res, 200, { amazon: await amazonDirect(req.body.amazonQuery) }); // direkter Amazon-Link über die Websuche (nur mit Schlüssel), sonst null
    const url = String(req.body?.url || '').trim();
    if (!url || url.length > 1000) throw new HttpError(400, 'Bitte füge einen Link ein.');
    try { return send(res, 200, { product: await inspect(url) }); }
    catch (e) { // Seite sperrt das Lesen (Thalia) oder zeigt kein Produkt: Name über die Suchmaschine zur Produktnummer der Adresse
      if (e.status !== 422 || !searchOn() || /amazon\.|amzn\./i.test(url)) throw e;
      await guardSearch(id).catch(() => { throw e; });
      const t = await titleForLink(url).catch(() => null);
      console.log('titel-link', JSON.stringify({ treffer: !!t, titel: t?.title || '', grund: e.message }));
      if (!t) throw e;
      return send(res, 200, { product: { title: t.title, price: null, currency: '', brand: '', size: '', description: '', host: t.host, source: 'suche', hasImage: !!t.imageUrl, imageUrl: t.imageUrl, url } });
    }
  } catch (e) { return fail(res, e); }
}
