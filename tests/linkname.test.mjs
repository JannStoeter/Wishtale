import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nameFromLink } from '../src/lib/linkname.js';

test('Name aus dem Pfad', () => {
  assert.equal(nameFromLink('https://www.otto.de/p/sony-wh-1000xm5-kopfhoerer-schwarz-1234567890/#variationId=1'), 'Sony Wh 1000xm5 Kopfhoerer Schwarz');
  assert.equal(nameFromLink('https://shop.example.de/products/blauer-becher-mit-punkten?variant=42'), 'Blauer Becher mit Punkten');
});
test('Ohne lesbaren Pfad: kein Name, nie „Wunsch von …“', () => {
  assert.equal(nameFromLink('https://www.zalando.de/p/ABC123XYZ9'), '');
  assert.equal(nameFromLink('https://www.thalia.de/shop/home/artikeldetails/A1068913389'), '');
  assert.equal(nameFromLink('https://www.amazon.de/dp/B0BXYZ1234'), '');
  assert.equal(nameFromLink(''), '');
});
