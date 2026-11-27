import test from 'node:test';
import assert from 'node:assert/strict';
import { staleGhosts, lastActive } from '../api/_lib/ghosts.js';

const day = 864e5, now = Date.parse('2026-12-31T00:00:00Z');
const iso = d => new Date(now - d * day).toISOString();
const id = n => `00000000-0000-0000-0000-00000000000${n}`;

test('lastActive nimmt den jüngsten Zeitpunkt', () => {
  assert.equal(lastActive({ created_at: iso(40), last_sign_in_at: iso(10) }), now - 10 * day);
  assert.equal(lastActive({ created_at: iso(40) }, now - 2 * day), now - 2 * day);
});

test('nur ruhende, anonyme Konten ohne neue Wünsche werden gelöscht', async () => {
  const users = [
    { id: id(1), is_anonymous: true, created_at: iso(45) },  // ruht, Wünsche alt → weg
    { id: id(2), is_anonymous: true, created_at: iso(45) },  // Wunsch vor 3 Tagen geändert → bleibt
    { id: id(3), is_anonymous: false, created_at: iso(90) }, // gesichert → bleibt
    { id: id(4), is_anonymous: true, created_at: iso(5) },   // neu → bleibt
  ];
  const fake = async url => {
    const ok = d => ({ ok: true, json: async () => d });
    if (url.includes('/auth/v1/admin/users')) return ok({ users });
    if (url.includes('/rest/v1/profiles')) return ok([{ id: 'p1', owner_id: id(1), updated_at: iso(44) }, { id: 'p2', owner_id: id(2), updated_at: iso(44) }]);
    if (url.includes('/rest/v1/wishes')) return ok([{ profile_id: 'p2', updated_at: iso(3) }, { profile_id: 'p1', updated_at: iso(40) }]);
    return { ok: false, json: async () => ({}) };
  };
  assert.deepEqual(await staleGhosts('k', fake, now), [id(1)]);
});
