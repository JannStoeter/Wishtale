import test from 'node:test';
import assert from 'node:assert/strict';
import { priceForWish } from '../api/_lib/imgsearch.js';

const web = urls => ({ web: { results: urls.map(url => ({ url, title: 'x' })) } });

test('priceForWish: eigener Shop-Link zuerst, nur Euro', async () => {
  const read = async u => ({ 'https://shop.de/a': { title: 'Becher', price: 12.5, currency: 'EUR' }, 'https://shop.ch/b': { title: 'Becher', price: 15, currency: 'CHF' } })[u];
  assert.deepEqual(await priceForWish({ t: 'Becher', link: 'https://shop.de/a' }, { read }), { price: 12.5, source: 'shop.de', via: 'link' });
  assert.equal(await priceForWish({ t: 'Becher', link: 'https://shop.ch/b' }, { read }), null); // Franken: lieber leer
});

test('priceForWish: Herstellerseite nur bei passendem Titel, Marktplätze nie', async () => {
  const pages = {
    'https://www.idealo.de/x': { title: 'Sony WH-1000XM5 ab 249 €', price: 249, currency: 'EUR' },
    'https://www.sony.de/zubehoer': { title: 'Sony Zubehör Übersicht', price: 19, currency: 'EUR' },
    'https://www.sony.de/wh-1000xm5': { title: 'Sony WH-1000XM5 Kopfhörer', price: 379, currency: 'EUR' },
  };
  const read = async u => pages[u];
  const fetchJson = async () => web(Object.keys(pages));
  const r = await priceForWish({ t: 'Sony WH-1000XM5 Kopfhörer', q: 'Sony WH-1000XM5' }, { read, fetchJson });
  assert.equal(r.price, 379);
  assert.equal(r.source, 'sony.de');
  const none = await priceForWish({ t: 'Sony WH-1000XM4 Kopfhörer' }, { read, fetchJson }); // andere Modellnummer
  assert.equal(none, null);
});

test('priceForWish: Amazon-Link wird nicht gelesen, dann Suche', async () => {
  let readAmazon = false;
  const read = async u => { if (/amazon/.test(u)) readAmazon = true; return { title: 'LEGO Technic 42115 Lamborghini Sián', price: 379.99, currency: 'EUR' }; };
  const r = await priceForWish({ t: 'LEGO Technic 42115 Lamborghini', link: 'https://www.amazon.de/dp/B07W5XZ8JT' }, { read, fetchJson: async () => web(['https://www.lego.com/de-de/product/42115']) });
  assert.equal(readAmazon, false);
  assert.equal(r.price, 379.99);
});
