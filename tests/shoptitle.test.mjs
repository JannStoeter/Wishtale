import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanShopTitle } from '../src/lib/linkname.js';
import { imageForWish } from '../api/_lib/imgsearch.js';
import { checkImageUrl } from '../api/_lib/inspect.js';

test('Shop-Titel ohne Werbezusätze', () => {
  assert.equal(cleanShopTitle('BOSS Eau de Toilette »Boss Bottled« online kaufen'), 'BOSS Eau de Toilette Boss Bottled');
  assert.equal(cleanShopTitle('Philips Hue Bridge - online kaufen | OTTO'), 'Philips Hue Bridge');
  assert.equal(cleanShopTitle('Harry Potter Band 1 bei Thalia'), 'Harry Potter Band 1');
  assert.equal(cleanShopTitle('LEGO 10460 jetzt günstig online kaufen'), 'LEGO 10460');
  assert.equal(cleanShopTitle('Kaufen'), 'Kaufen');
  assert.equal(cleanShopTitle('Sony WH-1000XM5'), 'Sony WH-1000XM5');
});

test('Bilder vom Bildserver von Amazon ja, Amazon-Seiten nein', () => {
  assert.ok(checkImageUrl('https://m.media-amazon.com/images/I/x.jpg'));
  assert.throws(() => checkImageUrl('https://www.amazon.de/dp/B0BXQK2M5T'));
  assert.throws(() => checkImageUrl('https://amzn.to/abc'));
});

test('Amazon-Wunsch: zuerst das Amazon-Bild über die ASIN', async () => {
  const fetchJson = async q => (q.startsWith('site:amazon.de') ? { web: { results: [
    { url: 'https://www.amazon.de/x/dp/B0BXQK2M5T', title: 'LEGO DUPLO Classic Bauplatte in Grün 10460', thumbnail: { original: 'https://m.media-amazon.com/x.jpg' } },
  ] } } : { web: { results: [] }, results: [] });
  const load = async u => ({ type: 'image/jpeg', data: 'AAAA', source: new URL(u).hostname });
  const im = await imageForWish({ t: 'LEGO DUPLO Bauplatte 10460', link: 'https://www.amazon.de/dp/B0BXQK2M5T' }, { fetchJson, load, read: async () => null, look: async () => false });
  assert.equal(im.via, 'amazon');
  assert.equal(im.source, 'amazon.de');
});

import { parseAmazon } from '../api/_lib/inspect.js';
import { priceForWish } from '../api/_lib/imgsearch.js';

test('Amazon-Seite: Name, Preis und Bild, Captcha-Seite gibt null', () => {
  const p = parseAmazon('<span id="productTitle"> BOSS Bottled 100 ml </span><div id="corePrice_feature_div"><span class="a-offscreen">54,95&nbsp;€</span></div>"hiRes":"https://m.media-amazon.com/images/I/71x.jpg"');
  assert.equal(p.title, 'BOSS Bottled 100 ml');
  assert.equal(p.price, 54.95);
  assert.equal(p.imageUrl, 'https://m.media-amazon.com/images/I/71x.jpg');
  assert.equal(parseAmazon('<title>Robot Check</title> captcha'), null);
});

test('Amazon-Wunsch: Preis zuerst von der Amazon-Seite', async () => {
  const r = await priceForWish({ t: 'BOSS Bottled', link: 'https://www.amazon.de/dp/B000000001' }, { amazon: async () => ({ title: 'BOSS Bottled', price: 54.95 }), fetchJson: async () => ({ web: { results: [] } }) });
  assert.equal(r.price, 54.95);
  assert.equal(r.via, 'amazon');
});
