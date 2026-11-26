import test from 'node:test';
import assert from 'node:assert/strict';
import { shortTitle, linkKey, titleForLink, ottoHit, imageForWish } from '../api/_lib/imgsearch.js';

test('shortTitle: langer Amazon-Titel wird zum Produktnamen', () => {
  assert.equal(shortTitle('LEGO DUPLO Classic Bauplatte in Grün 10460 Spielzeug ab 1 Jahr für Jungen und Mädchen, Baumodell für Kleinkinder : Amazon.de: Spielzeug'), 'LEGO DUPLO Classic Bauplatte in Grün 10460');
  assert.equal(shortTitle('Der kleine Drache Kokosnuss - Buch | Thalia'), 'Der kleine Drache Kokosnuss');
  assert.equal(shortTitle('Meine erste Kinderbibliothek - Meine ersten Gutenacht-Geschichten : Amazon.de: Bücher'), 'Meine erste Kinderbibliothek - Meine ersten Gutenacht-Geschichten');
  assert.equal(shortTitle('tonies Hörfigur Peppa Pig'), 'tonies Hörfigur Peppa Pig');
});

test('linkKey: ASIN bei Amazon, Artikelnummer sonst', () => {
  assert.deepEqual(linkKey('https://www.amazon.de/LEGO-10460-Kleinkinder-Ausstellen-Geburtstag/dp/B0BXQK2M5T/ref=sr_1_1'), { amazon: true, id: 'B0BXQK2M5T', host: 'amazon.de' });
  assert.equal(linkKey('https://www.thalia.de/shop/home/artikeldetails/A1068913389').id, 'A1068913389');
  assert.equal(linkKey('https://www.amazon.de/s?k=lego'), null);
});

test('titleForLink: nur Treffer mit derselben Produktnummer zählen', async () => {
  const fetchJson = async q => (q.startsWith('site:amazon.de') ? { web: { results: [
    { url: 'https://www.amazon.de/LEGO-Bauplatte/dp/B000000001', title: 'Falsches Produkt' },
    { url: 'https://www.amazon.de/LEGO-10460-Kleinkinder-Ausstellen-Geburtstag/dp/B0BXQK2M5T', title: 'LEGO DUPLO Classic Bauplatte in Grün 10460 Spielzeug ab 1 Jahr für ...', thumbnail: { original: 'https://m.media-amazon.com/x.jpg' } },
  ] } } : null);
  const r = await titleForLink('https://www.amazon.de/dp/B0BXQK2M5T?tag=jannst-21', { fetchJson });
  assert.equal(r.title, 'LEGO DUPLO Classic Bauplatte in Grün 10460');
  assert.equal(r.imageUrl, ''); // nie ein Amazon-Bild
  const none = await titleForLink('https://www.amazon.de/dp/B0BXQK2M5T', { fetchJson: async () => ({ web: { results: [{ url: 'https://www.amazon.de/x/dp/B000000001', title: 'Anderes' }] } }) });
  assert.equal(none, null);
  const thalia = await titleForLink('https://www.thalia.de/shop/home/artikeldetails/A1068913389', { fetchJson: async () => ({ web: { results: [{ url: 'https://www.thalia.de/shop/home/artikeldetails/A1068913389', title: 'Gregs Tagebuch 19 - Buch | Thalia', thumbnail: { original: 'https://images.thalia.media/x.jpg' } }] } }) });
  assert.equal(thalia.title, 'Gregs Tagebuch 19');
  assert.equal(thalia.imageUrl, 'https://images.thalia.media/x.jpg');
});

test('Amazon-Wunsch: Bild und Name von Otto, nur wenn der Titel eng passt', async () => {
  const img = { data: 'eA==', type: 'image/jpeg' };
  const fetchJson = async () => ({ web: { results: [
    { url: 'https://www.otto.de/p/lego-duplo-bauplatte-gruen-10460-S0ABC/', title: 'LEGO DUPLO Classic Bauplatte in Grün 10460 | OTTO' },
  ] } });
  const read = async () => ({ title: 'LEGO DUPLO Classic Bauplatte in Grün 10460', price: 12.99, currency: 'EUR', imageUrl: 'https://i.otto.de/x.jpg' });
  const load = async () => img;
  const hit = await ottoHit('LEGO DUPLO Classic Bauplatte in Grün 10460', { fetchJson, read, load });
  assert.equal(hit.price, 12.99);
  assert.equal(await ottoHit('LEGO DUPLO Classic Bauplatte in Grün 10461', { fetchJson, read, load }), null); // andere Nummer
  const im = await imageForWish({ t: 'LEGO DUPLO Classic Bauplatte in Grün 10460', link: 'https://www.amazon.de/dp/B0BXQK2M5T' }, { fetchJson, read, load, look: async () => false });
  assert.equal(im.via, 'otto');
});

test('modelQuery und Otto mit Marke und Modellnummer', async () => {
  const { modelQuery } = await import('../api/_lib/imgsearch.js');
  assert.equal(modelQuery('LEGO DUPLO 10460 Classic Bauplatte in Grün'), 'LEGO 10460');
  assert.equal(modelQuery('Tonies Figur Benjamin Blümchen'), null);
  const seen = [];
  const fetchJson = async q => { seen.push(q); return q.includes('LEGO 10460') && !q.includes('Classic') ? { web: { results: [{ url: 'https://www.otto.de/p/lego-10460-S0X/', title: 'LEGO® DUPLO® Konstruktionsspielsteine Classic Bauplatte in Grün (10460) | OTTO' }] } } : { web: { results: [] } }; };
  const read = async () => ({ title: 'LEGO® DUPLO® Konstruktionsspielsteine Classic Bauplatte in Grün (10460)', price: 11.99, currency: 'EUR', imageUrl: 'https://i.otto.de/x.jpg' });
  const hit = await ottoHit('LEGO DUPLO 10460 Classic Bauplatte in Grün', { fetchJson, read, load: async () => ({ data: 'x'.repeat(900000), type: 'image/jpeg' }) });
  assert.ok(hit && hit.image, 'großes Otto-Bild bleibt erhalten');
  assert.equal(seen.length, 2);
});
