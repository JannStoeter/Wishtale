/* Partnerlinks: Amazon-Tag und Awin-Deeplinks für Otto (node --test). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { withAwin, partnerLink, partnerOf, shopHost, awinTarget, clickRef, normUrl, AWIN_PUBLISHER } from '../src/lib/shops.js';

const OTTO = 'https://www.otto.de/p/le-creuset-braeter-S0ABC123/#variationId=S0ABC123XYZ';
const WID = '3f2a1b4c-9d8e-4f7a-b6c5-1234567890ab';

test('Otto-Link wird zum Awin-Deeplink mit encodeter Zieladresse', () => {
  const u = new URL(withAwin(OTTO, WID));
  assert.equal(u.origin + u.pathname, 'https://www.awin1.com/cread.php');
  assert.equal(u.searchParams.get('awinmid'), '14336');
  assert.equal(u.searchParams.get('awinaffid'), AWIN_PUBLISHER);
  assert.equal(u.searchParams.get('ued'), OTTO);
  assert.equal(u.searchParams.get('clickref'), '3f2a1b4c9d8e4f7ab6c51234567890ab');
  assert.ok(withAwin(OTTO, WID).includes('ued=' + encodeURIComponent(OTTO)));
});

test('Schema wie im Link Builder', () => {
  assert.equal(withAwin('https://otto.de'), 'https://www.awin1.com/cread.php?awinmid=14336&awinaffid=3165716&ued=https%3A%2F%2Fotto.de%2F');
});

test('http wird zu https, Unterdomains zählen, fremde Hosts bleiben', () => {
  assert.equal(awinTarget(withAwin('http://www.otto.de/p/x')), 'https://www.otto.de/p/x');
  assert.equal(partnerOf(withAwin('https://m.otto.de/p/x')), 'otto');
  assert.equal(withAwin('https://www.nototto.de/p/x'), 'https://www.nototto.de/p/x');
  assert.equal(withAwin('https://otto.de.example.com/p'), 'https://otto.de.example.com/p');
});

test('Click Reference ist kurz und alphanumerisch', () => {
  assert.equal(clickRef('a-b_c d/ä?1'), 'abcd1');
  assert.equal(clickRef('x'.repeat(80)).length, 40);
  assert.ok(!withAwin(OTTO, '').includes('clickref'));
  assert.ok(!withAwin(OTTO, '---').includes('clickref'));
});

test('partnerLink: Amazon behält Tag-Logik, Awin-Links werden nicht doppelt verpackt', () => {
  assert.match(partnerLink('https://www.amazon.de/dp/B000000000?tag=fremd-21', WID), /tag=jannst-21/);
  const once = partnerLink(OTTO, WID);
  assert.equal(partnerLink(once, 'anders'), once);
  assert.equal(partnerLink('https://www.lecreuset.de/braeter', WID), 'https://www.lecreuset.de/braeter');
  assert.equal(partnerLink('', WID), '');
});

test('partnerOf und shopHost erkennen den echten Shop hinter Awin', () => {
  const a = partnerLink(OTTO, WID);
  assert.equal(partnerOf(a), 'otto');
  assert.equal(shopHost(a), 'otto.de');
  assert.equal(partnerOf('https://www.amazon.de/s?k=x&tag=jannst-21'), 'amazon');
  assert.equal(partnerOf(OTTO), null); // ohne Deeplink kein Partnerlink
  assert.equal(partnerOf('https://www.lecreuset.de/x'), null);
  assert.equal(shopHost('kaputt'), '');
});

test('Gespeichert wird die echte Otto-Adresse (normUrl verpackt nicht)', () => {
  assert.equal(normUrl('otto.de/p/x'), 'https://otto.de/p/x');
});

test('Klick-Zählung erkennt Otto hinter Awin (shop_click)', async () => {
  const { shopLabel } = await import('../src/lib/track.js');
  const a = { href: partnerLink(OTTO, WID), dataset: { place: 'reserviert' }, closest: () => null };
  assert.equal(shopLabel(a, '#p/mia-abc123'), 'otto.gast.reserviert');
  assert.equal(shopLabel({ ...a, href: 'https://www.amazon.de/s?k=x' }, '#wuensche'), 'amazon.eigen.reserviert');
});

test('Otto-Suche für Ideen läuft über Awin, Anzeige einmal je Karte', async () => {
  const { searchUrl, ideaShops, ideaHref } = await import('../src/lib/shops.js');
  const u = new URL(searchUrl.otto('Kaffeemühle Hand', 'inspiration'));
  assert.equal(u.hostname, 'www.awin1.com');
  assert.equal(u.searchParams.get('ued'), 'https://www.otto.de/suche/Kaffeem%C3%BChle%20Hand/');
  assert.equal(u.searchParams.get('clickref'), 'inspiration');
  const html = ideaShops({ q: 'Kaffeemühle', t: 'Handmühle' });
  assert.equal((html.match(/Anzeige/g) || []).length, 1);
  assert.match(html, /Bei Amazon/); assert.match(html, /Bei Otto/);
  assert.doesNotMatch(ideaShops({ q: 'Kletterhalle', exp: true }), /sponsored|Anzeige/);
  assert.match(ideaHref({ q: 'x' }), /amazon\.de\/s\?k=x&tag=jannst-21/);
});
