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
