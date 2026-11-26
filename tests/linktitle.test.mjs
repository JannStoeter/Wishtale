import test from 'node:test';
import assert from 'node:assert/strict';
import { shortTitle, linkKey, titleForLink } from '../api/_lib/imgsearch.js';

test('shortTitle: langer Amazon-Titel wird zum Produktnamen', () => {
  assert.equal(shortTitle('LEGO DUPLO Classic Bauplatte in Grün 10460 Spielzeug ab 1 Jahr für Jungen und Mädchen, Baumodell für Kleinkinder : Amazon.de: Spielzeug'), 'LEGO DUPLO Classic Bauplatte in Grün 10460');
  assert.equal(shortTitle('Der kleine Drache Kokosnuss - Buch | Thalia'), 'Der kleine Drache Kokosnuss');
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
