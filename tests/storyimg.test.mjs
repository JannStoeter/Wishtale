import { test } from 'node:test';
import assert from 'node:assert/strict';
import { storyWishes, storyTitle } from '../src/lib/storyimg.js';

test('Story-Bild zeigt nur offene, nicht private Wünsche, wichtigste zuerst', () => {
  const w = [
    { t: 'A', status: 'offen', vis: 'alle', prio: 1 },
    { t: 'Geheim', status: 'offen', vis: 'privat', prio: 3 },
    { t: 'B', status: 'offen', vis: 'alle', prio: 3 },
    { t: 'Plan', status: 'plan', vis: 'privat', prio: 3 },
    { t: 'Erledigt', status: 'selbst', vis: 'alle', prio: 3 },
  ];
  assert.deepEqual(storyWishes(w).map(x => x.t), ['B', 'A']);
});

test('Titel ohne Pronomen, Kind-Konto mit Namen', () => {
  assert.equal(storyTitle({ name: 'Emil', managed: true }), 'Was sich Emil wünscht');
  assert.equal(storyTitle({ name: 'Mia' }), 'Was ich mir wünsche');
});
