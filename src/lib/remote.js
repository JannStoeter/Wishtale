/*
 * Anbindung an Supabase:
 *  - loadMine(): eigene Profile, Wünsche, Geschenke laden (oder erstes Profil anlegen)
 *  - scheduleSync(): Änderungen aus dem App-Zustand abgleichen und speichern
 *  - fetchPublic(): Gast-Ansicht, läuft über die RPC-Funktion public_profile (sieht jeder Besucher gleich)
 *  - Gast-Aktionen: reserve / release / bought über RPC, mit zufälligem Browser-Token
 */
import { safeImg } from './wishimg.js';
import { sb } from './supabase.js';
import { S, W } from '../state.js';
import { kwOf } from './util.js';
import { safeSocial } from './social.js';

/* ---------- Mapping App <-> Datenbank ---------- */
const VIS_DEFAULT = { interests: 'giver', cats: 'giver', brands: 'giver', tries: 'giver', nogos: 'giver', alts: 'giver', style: 'giver', social: 'giver' };
const num = v => (v == null ? null : +v);

export const wishToRow = (w, profileId) => ({
  id: w.id, profile_id: profileId, title: w.t, kind: w.kind, prio: w.prio, note: w.note || '', link: w.link || '',
  price: w.price || null, budget: w.budget || null, category: w.c || 'wohnen', occ: w.occ || [], vis: w.vis || 'alle',
  status: w.status || 'offen', via: w.via || null, pid: w.pid || null, kw: w.kw || [], art: w.a || null, tone: w.tone || 0,
  img_url: /^https:\/\//.test(w.img || '') ? w.img : '', img_src: String(w.imgSrc || '').slice(0, 120), no_suggest: !!w.noSuggest,
});
export const wishFromRow = r => W({
  id: r.id, t: r.title, kind: r.kind, prio: r.prio, note: r.note, link: r.link, price: num(r.price), budget: r.budget,
  c: r.category, occ: r.occ || [], vis: r.vis || 'alle', status: r.status || 'offen', via: r.via || undefined, pid: r.pid || undefined,
  kw: r.kw && r.kw.length ? r.kw : kwOf(r.title), a: r.art || undefined, tone: r.tone || 0, img: safeImg(r.img_url), imgSrc: r.img_src || '', noSuggest: !!r.no_suggest,
});
const giftToRow = (g, profileId) => ({
  id: g.id, profile_id: profileId, what: g.what, from_name: g.from, when_label: g.when || '',
  liked: g.liked || 'ja', have: !!g.have, again: !!g.again, kw: g.kw || [],
});
const giftFromRow = (r, i) => ({
  id: r.id, what: r.what, from: r.from_name, when: r.when_label, liked: r.liked, have: r.have, again: r.again,
  a: 'gift', tone: i % 6, kw: r.kw && r.kw.length ? r.kw : kwOf(r.what),
});
const profileToRow = a => ({
  ...(a.social && Object.keys(a.social).length ? { social: a.social } : (a.socialWas ? { social: {} } : {})),
  name: a.name, tone: a.tone || 0, about: a.about || '', age: a.age || null,
  interests: a.interests || [], cats: a.cats || [], brands: a.brands || [], tries: a.tries || [],
  nogos: a.nogos || [], alts: a.alts || [], style: a.style || [], vis: { ...VIS_DEFAULT, ...(a.vis || {}) },
});
const accountFromRow = (p, wishes, gifts) => ({
  dbId: p.id, handle: p.handle, name: p.name, age: p.age, managed: p.managed, tone: p.tone, about: p.about,
  interests: p.interests, cats: p.cats, brands: p.brands, tries: p.tries, nogos: p.nogos, alts: p.alts,
  style: p.style || [], vis: { ...VIS_DEFAULT, ...(p.vis || {}) },
  social: safeSocial(p.social), socialWas: !!(p.social && Object.keys(p.social).length),
  invited: [], inbox: [],
  wishes: wishes.filter(w => w.profile_id === p.id).map(wishFromRow),
  history: gifts.filter(g => g.profile_id === p.id).map(giftFromRow),
});

/* ---------- Handle ---------- */
const slug = s => (s || 'wishtale').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 20) || 'wishtale';
const rand = () => { const a = new Uint8Array(6); (globalThis.crypto || window.crypto).getRandomValues(a); return Array.from(a, x => (x % 36).toString(36)).join(''); }; // 6 Zeichen aus Zufallszahlen, kaum zu erraten
const makeHandle = name => `${slug(name).padEnd(3, 'x')}-${rand()}`;

/* ---------- Laden ---------- */
export async function loadMine(user) {
  const { data: profs, error } = await sb.from('profiles').select('*').eq('owner_id', user.id).order('created_at');
  if (error) throw error;
  let list = profs;
  if (!list.length) {
    const name = user.user_metadata?.full_name || (user.email || 'Ich').split('@')[0];
    let created = null;
    for (let i = 0; i < 4 && !created; i++) {
      const { data, error: e } = await sb.from('profiles')
        .insert({ owner_id: user.id, handle: makeHandle(name), name: name.slice(0, 60) }).select().single();
      if (!e) created = data; else if (e.code !== '23505') throw e;
    }
    if (!created) throw new Error('Profil konnte nicht angelegt werden.');
    list = [created];
  }
  const ids = list.map(p => p.id);
  const [w, g] = await Promise.all([
    sb.from('wishes').select('*').in('profile_id', ids).order('created_at'),
    sb.from('gifts').select('*').in('profile_id', ids).order('created_at', { ascending: false }),
  ]);
  if (w.error) throw w.error; if (g.error) throw g.error;

  const main = list.find(p => !p.managed) || list[0];
  const accounts = { me: accountFromRow(main, w.data, g.data) };
  accounts.me.id = 'me';
  for (const p of list.filter(x => x.id !== main.id)) {
    accounts[p.id] = accountFromRow(p, w.data, g.data);
    accounts[p.id].id = p.id;
    // Eltern sehen bei Kind-Konten, welche Wünsche reserviert oder gekauft sind (nicht von wem).
    const r = await sb.rpc('owner_reservations', { p_profile_id: p.id });
    (r.data || []).forEach(x => {
      const wish = accounts[p.id].wishes.find(y => y.id === x.wish_id);
      if (wish) { wish.res = 'other'; wish.bought = x.state === 'bought'; }
    });
  }
  S.accounts = accounts;
  S.ui.acct = 'me';
  snapshotAll();
}

/* ---------- Speichern (Abgleich per Snapshot) ---------- */
const snaps = {}; // key -> { profile, wishes:{id:json}, gifts:{id:json} }
const j = JSON.stringify;

function snapshotAccount(key, a) {
  snaps[key] = {
    profile: j(profileToRow(a)),
    wishes: Object.fromEntries(a.wishes.map(w => [w.id, j(wishToRow(w, a.dbId))])),
    gifts: Object.fromEntries(a.history.map(g => [g.id, j(giftToRow(g, a.dbId))])),
  };
}
function snapshotAll() { Object.keys(snaps).forEach(k => delete snaps[k]); Object.entries(S.accounts).forEach(([k, a]) => a.dbId && snapshotAccount(k, a)); }

let timer, running = false, again = false;
export function scheduleSync() {
  if (!S.auth.user) return;
  clearTimeout(timer);
  setSync('saving');
  timer = setTimeout(run, 900);
}
function setSync(state, msg = '') {
  S.auth.sync = state; S.auth.syncError = msg;
  const el = document.getElementById('syncst');
  if (el) { el.textContent = { saving: 'Speichert …', saved: 'Gespeichert', error: 'Nicht gespeichert' }[state] || ''; el.dataset.state = state; el.title = msg; }
}
async function run() {
  if (running) { again = true; return; }
  running = true;
  try {
    for (const [key, a] of Object.entries(S.accounts)) await syncAccount(key, a);
    setSync('saved');
  } catch (e) {
    console.error('Sync fehlgeschlagen', e);
    setSync('error', e.message || String(e));
  } finally {
    running = false;
    if (again) { again = false; scheduleSync(); }
  }
}
async function syncAccount(key, a) {
  if (!a.dbId) { // neues Kind-Konto
    for (let i = 0; i < 4 && !a.dbId; i++) {
      const { data, error } = await sb.from('profiles').insert({
        owner_id: S.auth.user.id, handle: makeHandle(a.name), managed: !!a.managed, ...profileToRow(a),
      }).select().single();
      if (!error) { a.dbId = data.id; a.handle = data.handle; } else if (error.code !== '23505') throw error;
    }
    if (!a.dbId) throw new Error('Konto konnte nicht angelegt werden.');
    snaps[key] = { profile: j(profileToRow(a)), wishes: {}, gifts: {} };
  }
  const s = snaps[key] || (snaps[key] = { profile: '', wishes: {}, gifts: {} });
  const prof = j(profileToRow(a));
  if (prof !== s.profile) {
    const { error } = await sb.from('profiles').update(profileToRow(a)).eq('id', a.dbId);
    if (error) throw error;
    s.profile = prof;
  }
  await syncList('wishes', a.wishes, s.wishes, w => wishToRow(w, a.dbId));
  await syncList('gifts', a.history, s.gifts, g => giftToRow(g, a.dbId));
}
async function syncList(table, items, snap, toRow) {
  const cur = new Map(items.map(x => [x.id, toRow(x)]));
  const changed = [...cur].filter(([id, row]) => j(row) !== snap[id]).map(([, row]) => row);
  const removed = Object.keys(snap).filter(id => !cur.has(id));
  if (changed.length) {
    const { error } = await sb.from(table).upsert(changed);
    if (error) throw error;
    changed.forEach(r => { snap[r.id] = j(r); });
  }
  if (removed.length) {
    const { error } = await sb.from(table).delete().in('id', removed);
    if (error) throw error;
    removed.forEach(id => delete snap[id]);
  }
}

/* ---------- Gast ---------- */
export function guestToken() {
  try {
    let t = localStorage.getItem('wishtale:guest');
    if (!t) { t = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, ''); localStorage.setItem('wishtale:guest', t); }
    return t;
  } catch { return 'x'.repeat(8) + crypto.randomUUID(); } // Speicher blockiert: Token nur für diese Sitzung
}

/** Öffentliche Sicht auf ein Profil. Liefert null, wenn es das Handle nicht gibt. */
export async function fetchPublic(handle) {
  const { data, error } = await sb.rpc('public_profile', { p_handle: handle, p_token: guestToken() });
  if (error) throw error;
  if (!data) return null;
  return {
    remote: true, id: data.handle, dbId: data.id, handle: data.handle, name: data.name, age: data.age, managed: data.managed,
    parent: data.parent_name, tone: data.tone, about: data.about,
    interests: data.interests, cats: data.cats, brands: data.brands, tries: data.tries, nogos: data.nogos, alts: data.alts,
    style: data.style || [],
    social: safeSocial(data.social),
    wishes: data.wishes.map(r => {
      const w = wishFromRow({ ...r, title: r.title, vis: 'alle' });
      w.res = r.reserved ? (r.mine ? 'me' : 'other') : null;
      w.bought = !!(r.reserved && r.mine && r.bought);
      return w;
    }),
    hidden: (data.hidden || []).map(h => ({ kw: h.kw || [] })),
    gifts: data.gifts.map((g, i) => ({ what: g.what, from: g.from, when: g.when, kw: g.kw && g.kw.length ? g.kw : kwOf(g.what), liked: 'ja', a: 'gift', tone: i % 6 })),
  };
}

const GUEST_OP = { reserve_wish: 'reserve', release_wish: 'release', mark_bought: 'bought' };
/** Reservieren, Freigeben, „gekauft“: laufen über den Server (je Adresse begrenzt), nicht direkt gegen die Datenbank. */
export async function guestRpc(fn, wishId) {
  const op = GUEST_OP[fn];
  if (!op) throw new Error('Unbekannte Aktion.');
  const r = await fetch('/api/account?op=' + op, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ wish: wishId, token: guestToken() }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Das hat nicht geklappt.');
  return j;
}
