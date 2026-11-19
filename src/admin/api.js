import { sb } from '../lib/supabase.js';
import { setStatsOff } from '../lib/track.js';

const ok = ({ data, error }) => { if (error) throw error; return data; };
export const list = (table, order = 'created_at', asc = false) => sb.from(table).select('*').order(order, { ascending: asc }).then(ok);
export const save = (table, row) => (row.id
  ? sb.from(table).update(row).eq('id', row.id).select().single()
  : sb.from(table).insert(row).select().single()).then(ok);
export const remove = (table, id) => sb.from(table).delete().eq('id', id).then(ok);
export const count = async table => { const { count: n, error } = await sb.from(table).select('*', { count: 'exact', head: true }); return error ? null : n; };

export async function adminState() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return { state: 'out' };
  let { data: yes } = await sb.rpc('is_admin');
  if (!yes) { const c = await sb.rpc('claim_admin'); yes = c.data === true; }
  if (yes) setStatsOff(true); // eigene Besuche verfälschen die Auswertung nicht
  return { state: yes ? 'admin' : 'denied', user: session.user };
}
export const signIn = (email, password) => sb.auth.signInWithPassword({ email, password });
export const signOut = () => sb.auth.signOut();
