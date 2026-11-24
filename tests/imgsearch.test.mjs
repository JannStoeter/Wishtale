import test from 'node:test';
import assert from 'node:assert/strict';
import { fits, candidates, findProductImage, imageForWish } from '../api/_lib/imgsearch.js';

const HUE = 'Hue Bewegungsmelder für Flur und Treppe';

test('fits: Marke plus unterscheidendes Wort reicht, Füllwörter zählen nicht', () => {
  assert.equal(fits(HUE, 'Hue Bewegungsmelder | Philips Hue DE', 'philips-hue.com'), true);
  assert.equal(fits(HUE, 'Philips Hue Zubehör entdecken', 'philips-hue.com'), false); // Kategorieseite
  assert.equal(fits(HUE, 'Bewegungsmelder für innen kaufen', 'obi.de'), false); // ohne Marke nur mit genug Wörtern
  assert.equal(fits('LEGO Technic 42115', 'LEGO Technic 42143 Ferrari'), false); // andere Nummer
  assert.equal(fits('LEGO Technic 42115', 'LEGO 42115 Technic Lamborghini Sián'), true);
});

test('candidates: Bildagenturen, kleine Bilder, extreme Formate und fremde Titel fallen raus, Marke zuerst', () => {
  const r = (url, w, h, title, hostname) => ({ title, url: 'https://' + hostname + '/p', meta_url: { hostname }, properties: { url, width: w, height: h } });
  const json = { results: [
    r('https://www.alamy.com/x.jpg', 1000, 1000, 'Hue Bewegungsmelder Foto', 'www.alamy.com'),
    r('https://shop.de/klein.jpg', 120, 120, 'Hue Bewegungsmelder', 'shop.de'),
    r('https://shop.de/banner.jpg', 1600, 400, 'Hue Bewegungsmelder', 'shop.de'),
    r('https://blog.de/flur.jpg', 800, 800, 'Unser neuer Flur', 'blog.de'),
    r('https://shop.de/hue.jpg', 800, 800, 'Philips Hue Bewegungsmelder weiß', 'shop.de'),
    r('https://www.philips-hue.com/sensor.jpg', 800, 800, 'Hue Bewegungsmelder', 'www.philips-hue.com'),
  ] };
  const c = candidates(json, HUE);
  assert.deepEqual(c.map(x => x.img), ['https://www.philips-hue.com/sensor.jpg', 'https://shop.de/hue.jpg']);
});

test('findProductImage: Herstellerseite vor der Bildersuche', async () => {
  const web = { web: { results: [
    { url: 'https://www.amazon.de/dp/B076MGJTJ9' },
    { url: 'https://www.philips-hue.com/de-de/p/hue-bewegungsmelder/8719514342125' },
  ] } };
  const read = async url => ({ title: 'Hue Bewegungsmelder | Philips Hue DE', imageUrl: url.includes('philips') ? 'https://images.philips-hue.com/sensor.png' : null });
  const load = async u => ({ type: 'image/png', data: 'x', source: new URL(u).hostname });
  const im = await findProductImage(HUE, { fetchJson: async () => web, read, load });
  assert.equal(im.via, 'seite');
  assert.equal(im.source, 'philips-hue.com');
});

test('imageForWish: eigener Shop-Link zuerst, Amazon-Links nie', async () => {
  const seen = [];
  const read = async url => { seen.push(url); return { title: 'x', imageUrl: 'https://cdn.shop.de/a.jpg' }; };
  const load = async u => ({ type: 'image/jpeg', data: 'x', source: new URL(u).hostname });
  const a = await imageForWish({ t: HUE, link: 'https://www.shop.de/hue-sensor' }, { read, load });
  assert.equal(a.via, 'link');
  assert.equal(a.source, 'shop.de');
  const b = await imageForWish({ t: HUE, link: 'https://www.amazon.de/dp/B076MGJTJ9' }, { read, load, fetchJson: async () => ({ web: { results: [] }, results: [] }) });
  assert.equal(b, null);
  assert.deepEqual(seen, ['https://www.shop.de/hue-sensor']);
});

test('modelCode: Modellangaben ja, Mengen und Maße nein', async () => {
  const { modelCode } = await import('../api/_lib/match.js');
  for (const t of ['Stirnlampe aufladbar 150 lm - UL500 grau', 'OOONO CO-DRIVER NO2', 'LEGO Technic 42115', 'Sony WH-1000XM5']) assert.equal(modelCode(t), true, t);
  for (const t of ['Großer Reisekoffer 4 Rollen', 'Fernseher 65 Zoll', 'Powerbank 20000mAh', 'Becher 500ml', 'Hue Bewegungsmelder für Flur und Treppe']) assert.equal(modelCode(t), false, t);
});

test('imageForWish: Bild der erkannten Seite zuerst, Deal-Seiten nie', async () => {
  const load = async u => ({ type: 'image/jpeg', data: 'x', source: new URL(u).hostname });
  const a = await imageForWish({ t: HUE, img: 'https://www.philips-hue.com/sensor.jpg' }, { load });
  assert.equal(a.via, 'erkannt');
  const r = (hostname) => ({ title: 'Hue Bewegungsmelder', url: 'https://' + hostname + '/p', meta_url: { hostname }, properties: { url: 'https://' + hostname + '/a.jpg', width: 800, height: 800 } });
  assert.deepEqual(candidates({ results: [r('www.monsterdealz.de'), r('www.mydealz.de')] }, HUE), []);
});

test('parseMatch: feste Marke wird mitgeliefert, Produktart ohne Marke nicht', async () => {
  const { parseMatch } = await import('../api/_lib/match.js');
  const hue = parseMatch('{"erkannt": true, "marke": "Philips Hue", "titel": "Philips Hue Bewegungsmelder", "sicherheit": 0.6}');
  assert.equal(hue.brand, 'Philips Hue');
  const koffer = parseMatch('{"erkannt": false, "marke": null, "titel": "", "sicherheit": 0.2}');
  assert.equal(koffer.brand, null);
});

test('fits: Marke allein reicht nicht, anderes Produkt derselben Marke fällt raus (Hue Taster)', () => {
  const B = 'Philips Hue';
  assert.equal(fits(HUE, 'Hue Bewegungsmelder | Philips Hue DE', 'philips-hue.com', B), true);
  assert.equal(fits(HUE, 'Hue Tap Dial Schalter | Philips Hue DE', 'philips-hue.com', B), false);
  assert.equal(fits(HUE, 'Philips Hue Dimmschalter Bewegungsmelder Set', 'philips-hue.com', B), false);
  assert.equal(fits(HUE, 'Philips Hue Smart Button', 'philips-hue.com', B), false);
  assert.equal(fits('Philips Hue Motion Sensor', 'Hue Motion Sensor', 'philips-hue.com', B), true);
  assert.equal(fits('Philips Hue Motion Sensor', 'Hue Dimmer Switch', 'philips-hue.com', B), false);
});

test('imageForWish: deutscher Wunsch oder erkannter englischer Name, aber nie ein anderes Produkt', async () => {
  const web = { web: { results: [{ url: 'https://www.philips-hue.com/de-de/p/hue-tap-dial' }, { url: 'https://www.philips-hue.com/de-de/p/hue-motion-sensor' }] } };
  const titles = { 'hue-tap-dial': 'Hue Tap Dial Schalter', 'hue-motion-sensor': 'Hue Motion Sensor' };
  const read = async url => ({ title: titles[url.split('/').pop()], imageUrl: url + '.jpg' });
  const load = async u => ({ type: 'image/jpeg', data: 'x', source: new URL(u).hostname });
  const im = await imageForWish({ t: HUE, q: 'Philips Hue Motion Sensor', brand: 'Philips Hue' }, { fetchJson: async () => web, read, load });
  assert.equal(im.title, 'Hue Motion Sensor');
});
