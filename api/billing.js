import { send } from './_lib/auth.js';
import checkout from './_lib/h/checkout.js';
import portal from './_lib/h/portal.js';

/* Zahlungs-Aufrufe aus der App (Kasse und Kundenportal) an einer Stelle. /api/checkout und /api/portal leitet vercel.json hierher um. */
const OPS = { checkout, portal };
export default function handler(req, res) {
  const op = String(req.query?.op || '');
  return OPS[op] ? OPS[op](req, res) : send(res, 404, { error: 'Unbekannte Funktion.' });
}
