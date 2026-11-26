import test from 'node:test';
import assert from 'node:assert/strict';
import { igMessage } from '../api/_lib/instagram.js';

test('gesperrter Zugriff nennt Code und Hinweis', () => {
  const m = igMessage({ message: 'API access blocked.', code: 200, type: 'OAuthException' });
  assert.match(m, /Code 200/);
  assert.match(m, /gesperrt/);
  assert.doesNotMatch(m, /\.\./);
});

test('abgelaufener Schlüssel', () => {
  assert.match(igMessage({ message: 'Error validating access token', code: 190, error_subcode: 463 }), /190\/463.*META_ACCESS_TOKEN/);
});

test('ohne Meta-Fehler bleibt der Status', () => {
  assert.equal(igMessage({}, 500), 'Instagram: 500.');
});

import { withSiteLink } from '../src/lib/iglink.js';

test('Bildunterschrift bekommt wishtale.de vor den Hashtags', () => {
  const c = withSiteLink('Ein schöner Text.\n\n#wishtale #wunschliste');
  assert.equal(c, 'Ein schöner Text.\n\nZu Wishtale: wishtale.de (der Link steht auch in unserer Bio)\n\n#wishtale #wunschliste');
});

test('vorhandene Adresse wird nicht doppelt ergänzt', () => {
  const c = 'Den Link findest du in der Bio und unter wishtale.de.\n\n#wishtale';
  assert.equal(withSiteLink(c), c);
  assert.equal(withSiteLink(withSiteLink('Text')), withSiteLink('Text'));
});
