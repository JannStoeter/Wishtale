import test from 'node:test';
import assert from 'node:assert/strict';
import { applyReview, reviewFacts, reviewIdeas } from '../api/_lib/idea-review.js';
import { promptEligible, WEEK } from '../src/lib/taste-prompt-rules.js';
import { ideasFor } from '../api/_lib/ideas.js';

const ideas = [{ t: 'Mac-Tastatur', q: 'Mac Tastatur', why: 'Jochen programmiert am Mac.', from: 20, to: 40 }, { t: 'Notizbuch', q: 'Notizbuch schlicht', why: 'Jochen mag schlichte Dinge.', from: 10, to: 20 }];
const profile = { name: 'Jochen', interests: ['Programmieren'], brands: ['Apple'], wishes: [{ title: 'Privater Wunsch', vis: 'privat' }, { title: 'Geheim', status: 'plan' }], hidden: [{ kw: ['geheim'] }], gifts: [{ what: 'Geheimes Geschenk' }] };
const facts = reviewFacts(profile);

test('nur öffentliche Fakten werden als Belege angeboten, Marke wird nicht zu Besitz', () => {
  assert.deepEqual(facts.map(f => f.value), ['Programmieren', 'Apple']);
  assert.equal(facts[1].type, 'Mag die Marke');
  assert.ok(!JSON.stringify(facts).includes('Mac'));
});
test('Mac-Voraussetzung verwerfen, belegte Idee umformulieren ohne Produktdaten zu ändern', () => {
  const out = applyReview(ideas, facts, { reviews: [{ id: 'i0', decision: 'drop' }, { id: 'i1', decision: 'rewrite', why: 'Für Jochens Interesse am Programmieren lassen sich darin Ideen festhalten.', evidence: ['f0'], t: 'Manipuliert', from: 999 }] });
  assert.equal(out.length, 1);
  assert.equal(out[0].t, 'Notizbuch');
  assert.equal(out[0].from, 10);
  assert.match(out[0].why, /Programmieren/);
});
test('fehlende, doppelte, unbekannte Belege und ungültige Entscheidungen werden nicht übernommen', () => {
  for (const reviews of [[], [{ id: 'i0', decision: 'keep', evidence: ['privat'] }], [{ id: 'i0', decision: 'keep', evidence: [] }], [{ id: 'i0', decision: 'keep', evidence: ['f0'] }, { id: 'i0', decision: 'drop' }], [{ id: 'fremd', decision: 'keep', evidence: ['f0'] }]]) assert.deepEqual(applyReview(ideas, facts, { reviews }), []);
});
test('Prüfung nutzt genau einen Aufruf, erfasst Verbrauch und übermittelt keine privaten Daten', async () => {
  let calls = 0, usage = 0, guards = 0;
  const result = await reviewIdeas(ideas, profile, { mode: 'gift', budget: 50, guard: async () => guards++, onUsage: async () => usage++, run: async request => {
    calls++;
    const data = JSON.parse(request.content);
    assert.equal(data.ideas.length, 2);
    assert.equal(data.budget, 50);
    assert.ok(!request.content.includes('Geheimes Geschenk'));
    return { text: JSON.stringify({ reviews: [{ id: 'i1', decision: 'rewrite', why: 'Jochen interessiert sich für Programmieren.', evidence: ['f0'] }] }), model: 'test', usage: { input_tokens: 10 } };
  } });
  assert.equal(result.length, 1); assert.equal(calls, 1); assert.equal(usage, 1); assert.equal(guards, 1);
});
test('leeres öffentliches Profil, Timeout und defektes JSON liefern niemals ungeprüfte Ideen', async () => {
  assert.deepEqual(await reviewIdeas(ideas, {}, { run: () => { throw Error('darf nicht laufen'); } }), []);
  assert.deepEqual(await reviewIdeas(ideas, profile, { run: async () => { throw Error('Timeout'); } }), []);
  assert.deepEqual(await reviewIdeas(ideas, profile, { run: async () => ({ text: 'kaputt' }) }), []);
});
test('Hinweis erst ab drei Wünschen, nicht für Kinder oder nach zehn Antworten', () => {
  const input = { managed: false, wishes: 3, answered: 0, now: Date.UTC(2026, 10, 16) };
  assert.equal(promptEligible(input), true);
  for (const patch of [{ wishes: 2 }, { managed: true }, { answered: 10 }, { preference: { dismissals: 3 } }]) assert.equal(promptEligible({ ...input, ...patch }), false);
  assert.equal(promptEligible({ ...input, preference: { last_shown_at: new Date(input.now - WEEK + 1).toISOString() } }), false);
  assert.equal(promptEligible({ ...input, preference: { last_shown_at: new Date(input.now - WEEK).toISOString(), dismissals: 2 } }), true);
});

test('kompletter Ideenablauf: nach Review bleiben Budget und Produktdaten verbindlich', async () => {
  const before = process.env.ANTHROPIC_API_KEY;
  process.env.ANTHROPIC_API_KEY = 'test-only';
  let calls = 0, usages = 0;
  const fakeFetch = async (url, request) => {
    if (url.endsWith('/rpc/public_profile')) return new Response(JSON.stringify({ name: 'Jochen', interests: ['Programmieren'], wishes: [] }));
    if (!url.includes('api.anthropic.com')) throw Error('Unerwarteter Aufruf');
    const body = JSON.parse(request.body);
    calls++;
    const text = calls === 1
      ? JSON.stringify({ ideas: [{ titel: 'Notizbuch', suche: 'Notizbuch schlicht', begruendung: 'Jochen programmiert am Mac.', von: 10, bis: 20 }] })
      : JSON.stringify({ reviews: [{ id: 'i0', decision: 'rewrite', why: 'Für Jochens Programmierideen.', evidence: ['f0'] }] });
    if (calls === 2) assert.ok(body.system.includes('Voraussetzungen'));
    return new Response(JSON.stringify({ content: [{ type: 'text', text }], model: 'test', usage: { input_tokens: 5, output_tokens: 5 } }));
  };
  try {
    const out = await ideasFor('jochen', 'ohne', fakeFetch, { mode: 'gift', budget: 20, onUsage: async () => usages++ });
    assert.equal(calls, 2); assert.equal(usages, 2);
    assert.deepEqual(out.ideas.map(i => [i.t, i.why, i.to]), [['Notizbuch', 'Für Jochens Programmierideen.', 20]]);
  } finally {
    if (before === undefined) delete process.env.ANTHROPIC_API_KEY; else process.env.ANTHROPIC_API_KEY = before;
  }
});
