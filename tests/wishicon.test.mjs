import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wishIcon, wishGlyph, GLYPH } from '../src/lib/wishicon.js';

test('Stichwörter im Namen geben das passende Symbol', () => {
  const cases = {
    'Grauer Pullover aus Merino': 'sweater', 'Laufschuhe Asics Novablast': 'shoe', 'Sony WH-1000XM5 Kopfhörer': 'headphones',
    'Kochbuch Ottolenghi': 'book', 'Le Creuset Bräter': 'pot', 'Fahrradlicht': 'bike', 'Skihelm': 'snow', 'LEGO Technic Porsche': 'blocks',
    'Kaffeemühle Comandante': 'mug', 'Kratzbaum für die Katze': 'paw', 'Duftkerze Feige': 'candle', 'Konzertkarten Coldplay': 'ticket',
    'Hundert Jahre Einsamkeit Buch': 'book', 'Kleine Vase': 'vase', 'Nintendo Switch 2': 'gamepad', 'Ohrringe Gold': 'ring'
  };
  for (const [t, k] of Object.entries(cases)) assert.equal(wishIcon(t, 'sonstiges'), k, t);
});

test('ohne Stichwort zählt die Kategorie, sonst ein Geschenk', () => {
  assert.equal(wishIcon('Etwas Schönes von Arket', 'mode'), 'sweater');
  assert.equal(wishIcon('Überraschung', 'sonstiges'), 'gift');
  assert.equal(wishIcon('', undefined), 'gift');
});

test('jedes Symbol ist ein SVG ohne Text', () => {
  for (const [k, g] of Object.entries(GLYPH)) assert.ok(g.startsWith('<') && !/<text/.test(g), k);
  assert.ok(!/<b>/.test(wishGlyph('Pullover', 'mode')));
});
