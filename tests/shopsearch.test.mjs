import test from 'node:test';
import assert from 'node:assert/strict';
import { searchAmazon, searchOtto } from '../api/_lib/imgsearch.js';

const web = results => async () => ({ web: { results } });

test('Amazon: nur Produktseiten mit ASIN, passend zum Suchbegriff, ohne Bild und Preis', async () => {
  const r = await searchAmazon('Tonies Weihnachten', { fetchJson: web([
    { url: 'https://www.amazon.de/tonies-Weihnachtslieder-H%C3%B6rfigur/dp/B08ABCDEF1', title: 'Amazon.de: tonies Weihnachten Hörfigur mit Liedern' },
    { url: 'https://www.amazon.de/dp/B08ABCDEF1?th=1', title: 'tonies Weihnachten doppelt' },
    { url: 'https://www.amazon.de/s?k=tonies', title: 'Suche tonies' },
    { url: 'https://www.amazon.de/dp/B09ZZZZZZ9', title: 'Kaffeemaschine Edelstahl' },
  ]) });
  assert.equal(r.length, 1);
  assert.equal(r[0].url, 'https://www.amazon.de/dp/B08ABCDEF1');
  assert.equal(r[0].image, null);
  assert.equal(r[0].price, null);
  assert.match(r[0].t, /^tonies Weihnachten/);
});

test('Otto: Produktseiten lesen, Preis und Bild übernehmen, sonst Titel und Vorschaubild', async () => {
  const read = async url => (url.includes('S0A') ? { title: 'tonies Hörfigur Weihnachtslieder', price: 16.99, currency: 'EUR', imageUrl: 'https://i.otto.de/a.jpg' } : null);
  const load = async u => ({ type: 'image/jpeg', data: 'x'.repeat(10), source: u });
  const r = await searchOtto('tonies weihnachtslieder', { read, load, fetchJson: web([
    { url: 'https://www.otto.de/p/tonies-hoerfigur-weihnachtslieder-S0A/', title: 'tonies Hörfigur Weihnachtslieder | OTTO' },
    { url: 'https://www.otto.de/p/tonies-weihnachtslieder-2-S0B/#variationId=1', title: 'tonies Weihnachtslieder 2 | OTTO', thumbnail: { src: 'https://imgs.search.brave.com/b.jpg' } },
    { url: 'https://www.otto.de/suche/tonies/', title: 'tonies bei OTTO' },
  ]) });
  assert.equal(r.length, 2);
  assert.equal(r[0].price, 16.99);
  assert.equal(r[0].image.source, 'https://i.otto.de/a.jpg');
  assert.equal(r[1].t, 'tonies Weihnachtslieder 2');
  assert.equal(r[1].image.source, 'https://imgs.search.brave.com/b.jpg');
  assert.equal(r[1].url, 'https://www.otto.de/p/tonies-weihnachtslieder-2-S0B/');
});
