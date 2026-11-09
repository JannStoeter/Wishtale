import { send } from './_lib/auth.js';
import integrations from './_lib/h/integrations.js';
import draft from './_lib/h/draft.js';
import catalog from './_lib/h/catalog.js';
import ads from './_lib/h/ads.js';
import tribunal from './_lib/h/tribunal.js';

/*
 * Sammelstelle für die Admin-Funktionen (Vercel Hobby erlaubt höchstens 12 Server-Funktionen).
 * Die alten Adressen /api/integrations, /api/draft, /api/catalog-gen, /api/ads und /api/tribunal leitet vercel.json hierher um (Parameter op).
 * Jede Funktion prüft selbst zuerst per requireAdmin.
 */
const OPS = { integrations, draft, catalog, ads, tribunal };
export default function handler(req, res) {
  const op = String(req.query?.op || '');
  return OPS[op] ? OPS[op](req, res) : send(res, 404, { error: 'Unbekannte Funktion.' });
}
