/*
 * Kleine Geschichte (Tale) zu einer Welt. Wird aus dem Profil zusammengesetzt, ohne Pronomen,
 * damit sie für jede Person passt. Reihenfolge: Interesse, Gewohnheit, Marken, Wünsche, Vorhandenes, Überleitung.
 */
import { ACT } from '../data/content.js';

const WORLD_TAGS = {
  genuss: ['kaffee', 'tee'], kochen: ['kochen'], wohnen: ['wohnen', 'garten', 'keramik'], buecher: ['lesen', 'vorlesen'],
  outdoor: ['wandern', 'draussen', 'tiere', 'rad'], reisen: ['reisen'], spielen: ['spiele', 'basteln', 'bauen'],
  technik: ['musik'], sport: ['laufen', 'rad'], mode: [], erlebnisse: ['keramik'],
};
const WORLD_BRANDS = {
  Hario: 'genuss', Fellow: 'genuss', Stelton: 'wohnen', Muji: 'wohnen', Aesop: 'wohnen', 'Le Creuset': 'kochen',
  Patagonia: 'outdoor', Fjällräven: 'outdoor', Moleskine: 'buecher', Leuchtturm1917: 'buecher',
};
const quote = a => a.map(x => `„${x}“`);
const list = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' und ' + a.slice(-1));

const BANK = {
  genuss: n => [`${n} nimmt sich gern Zeit für die kleinen Genussmomente im Alltag.`, 'Eine gute Tasse Kaffee oder Tee am Sonntagmorgen, in aller Ruhe getrunken, gehört bestimmt dazu.', `Damit aus dem Ritual ein richtiges kleines Fest wird, könnten ${n} diese Dinge gefallen:`],
  kochen: n => [`${n} steht gern in der Küche.`, 'Mit gutem Werkzeug macht das Kochen noch mehr Spaß und aus einem gewöhnlichen Abendessen wird ein kleines Ritual.', `Für noch mehr Freude am Herd könnten ${n} diese Dinge gefallen:`],
  wohnen: n => [`${n} richtet das Zuhause Stück für Stück ein.`, 'Dabei zählen weniger die vielen Dinge als die wenigen, die sich gut anfühlen und gut aussehen.', `Zu diesem Stil könnten ${n} diese Dinge gefallen:`],
  buecher: n => [`${n} versinkt gern in einem guten Buch.`, 'Ein gemütlicher Platz, gutes Licht und ein ruhiger Abend, mehr braucht es dafür gar nicht.', `Damit die Lesestunden noch schöner werden, könnten ${n} diese Dinge gefallen:`],
  outdoor: n => [`${n} ist am liebsten draußen unterwegs.`, 'Wer leicht packt und weit läuft, kommt abends müde und zufrieden an.', `Für das nächste Abenteuer könnten ${n} diese Dinge gefallen:`],
  reisen: n => [`${n} plant gern die nächste Reise.`, 'Gutes Gepäck und kleine Begleiter machen das Unterwegssein leichter und das Ankommen schöner.', `Für die nächste Reise könnten ${n} diese Dinge gefallen:`],
  spielen: n => [`${n} spielt, baut und bastelt mit Begeisterung.`, 'Dabei entstehen oft die schönsten Geschichten.', `Für noch mehr Spielfreude könnten ${n} diese Dinge gefallen:`],
  technik: n => [`${n} mag gute Technik, solange sie einfach funktioniert.`, 'Ob Musik, ein Hörbuch oder ein ruhiger Abend mit Kopfhörern: Es soll sich vor allem gut anhören.', `Dazu könnten ${n} diese Dinge gefallen:`],
  sport: n => [`${n} bewegt sich gern.`, 'Mit der richtigen Ausrüstung macht jede Runde gleich ein bisschen mehr Spaß.', `Für die nächste Runde könnten ${n} diese Dinge gefallen:`],
  mode: n => [`${n} legt Wert auf Dinge, die sich gut anfühlen.`, 'Am liebsten sind natürliche Materialien und schlichte Schnitte, die lange halten.', `Dazu könnten ${n} diese Dinge gefallen:`],
  erlebnisse: n => [`${n} sammelt lieber Erlebnisse als Dinge.`, 'Ein Nachmittag, an den man sich lange erinnert, ist oft das schönste Geschenk.', `Dafür könnten ${n} diese Ideen gefallen:`],
};

/** Liefert { paragraphs: [...], ask } für eine Welt. */
export function worldTale(p, cid, cats) {
  const n = p.name;
  const tags = WORLD_TAGS[cid] || [];
  const ints = p.interests.filter(l => tags.includes((ACT.find(a => a.l === l) || {}).t));
  const [s1, s2, ask] = (BANK[cid] || BANK.wohnen)(n);
  const out = [];

  // Zuspitzung bei Kaffee: persönlicher als der Standardsatz.
  if (cid === 'genuss' && p.interests.includes('Kaffee brühen')) {
    out.push(`${n} liebt guten Kaffee. Für den perfekten Espresso nimmt sich ${n} am Sonntag gern auch mal etwas mehr Zeit.`);
  } else {
    out.push(`${s1}${ints.length ? ` ${list(ints)} ${ints.length > 1 ? 'gehören' : 'gehört'} fest dazu.` : ''} ${s2}`);
  }

  const brands = p.brands.filter(b => WORLD_BRANDS[b] === cid);
  if (brands.length) out.push(brands.length > 1 ? `Zu den Lieblingsmarken gehören hier ${list(brands)}.` : `Zu den Lieblingsmarken gehört hier ${brands[0]}.`);

  const wishes = p.wishes.filter(w => w.status === 'offen' && w.c === cid && w.vis !== 'privat').map(w => w.t);
  if (wishes.length) { const w3 = wishes.slice(0, 3); out.push(w3.length > 1 ? `Auf der Wunschliste stehen bereits ${list(quote(w3))}.` : `Auf der Wunschliste steht bereits ${quote(w3)[0]}.`); };

  const owned = p.wishes.filter(w => w.status === 'selbst' && w.c === cid && w.vis !== 'privat').map(w => w.t);
  if (owned.length) out.push(`${n} besitzt bereits ${list(quote(owned.slice(0, 3)))}. Deshalb achten wir hier besonders auf Dinge, die das gut ergänzen.`);

  return { paragraphs: out, ask: cid === 'genuss' && p.interests.includes('Kaffee brühen') ? `Um den perfekten Kaffee zu erzeugen, könnten ${n} diese Produkte noch gefallen:` : ask };
}

/** Wie gut kennen wir die Person? 0 bis 100 plus nächste Schritte. */
export function completeness(a) {
  const owned = a.wishes.filter(w => w.status === 'selbst').length;
  const open = a.wishes.filter(w => w.status === 'offen').length;
  const steps = [
    [15, !!(a.about && a.about.trim().length > 20), 'Erzähl in ein paar Sätzen etwas über dich.'],
    [15, a.interests.length >= 3, 'Such dir mindestens drei Interessen aus, die zu dir passen.'],
    [10, a.cats.length >= 3, 'Wähle ein paar Welten, in denen du dich zuhause fühlst.'],
    [10, a.brands.length >= 3, 'Verrate uns ein paar Lieblingsmarken.'],
    [10, a.nogos.length >= 1, 'Sag uns, was du lieber nicht geschenkt bekommen möchtest.'],
    [5, a.tries.length >= 1, 'Überlege, was du gern einmal ausprobieren würdest.'],
    [5, a.alts.length >= 2, 'Such dir ein paar Alternativen aus, falls deinen Freunden nichts einfällt.'],
    [15, open >= 5, 'Sammle ein paar Wünsche, am besten mindestens fünf.'],
    [10, owned >= 3, 'Trag ein paar Dinge ein, die du schon hast.'],
    [5, a.history.length >= 1, 'Erzähl uns von einem Geschenk, das du schon bekommen hast.'],
  ];
  const pct = steps.reduce((s, [pts, ok]) => s + (ok ? pts : 0), 0);
  return { pct, next: steps.filter(([, ok]) => !ok).map(([, , t]) => t) };
}

/** Profil noch zu dünn für persönliche Ideen (Interessen, Marken, Welten, Über-Text zusammen weniger als vier Angaben). */
export const thinProfile = p => ((p.interests || []).length + (p.brands || []).length + (p.cats || []).length + (String(p.about || '').trim().length > 20 ? 2 : 0)) < 4;
