-- Wishtale: Weg vom Besuch zum Konto je Herkunft (Dev 136). Nur lesend, nur für Admins, keine neue Tabelle.
-- Schritte sind verschiedene Besucher (täglich wechselnder Hash aus 0011) mit dem jeweiligen Ereignis.
-- Herkunft eines Besuchers: utm_source irgendeines seiner Ereignisse, sonst die verweisende Domain, sonst „direkt“.
-- Weil der Hash täglich wechselt, verknüpft die Herkunft nur Schritte desselben Tages, nie über Tage.
create or replace function public.admin_funnel(p_days int default 1, p_source text default null)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  d int := least(greatest(coalesce(p_days, 1), 1), 365);
  since timestamptz := date_trunc('day', now() at time zone 'Europe/Berlin') at time zone 'Europe/Berlin' - make_interval(days => d - 1);
  src text := nullif(lower(trim(coalesce(p_source, ''))), '');
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  return (
    with ev as (
      select e.visitor, e.name, e.label, e.path, e.utm_source, e.ref from public.events e
      where e.ts >= since and e.visitor is not null and e.name in ('view', 'cta', 'start', 'choice', 'signup_submit', 'step')
    ),
    who as (
      select visitor, coalesce(max(nullif(utm_source, '')), max(nullif(ref, '')), 'direkt') as source from ev group by visitor
    ),
    f as (select ev.* from ev join who using (visitor) where src is null or who.source = src)
    select jsonb_build_object(
      'days', d,
      'source', src,
      'steps', jsonb_build_object(
        'landing',       (select count(distinct visitor) from f where name = 'view'),
        'cta',           (select count(distinct visitor) from f where name = 'cta'),
        'start',         (select count(distinct visitor) from f where name = 'start'),
        'name',          (select count(distinct visitor) from f where name = 'step' and label = 'name_ok'),
        'quick',         (select count(distinct visitor) from f where name = 'choice' and label = 'quick'),
        'profile',       (select count(distinct visitor) from f where name = 'choice' and label = 'profile'),
        'register_view', (select count(distinct visitor) from f where name = 'step' and label = 'register_view'),
        'submit',        (select count(distinct visitor) from f where name = 'signup_submit'),
        'google',        (select count(distinct visitor) from f where name = 'step' and label = 'google_up'),
        'sent',          (select count(distinct visitor) from f where name = 'step' and label = 'signup_sent')
      ),
      'errors', (select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select substr(label, 12) as kind, count(*) as n from f where name = 'step' and label like 'signup_err:%' group by 1 order by 2 desc) x),
      'ctas', (select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select coalesce(label, 'ohne') as label, count(distinct visitor) as visitors from f where name = 'cta' group by 1 order by 2 desc limit 8) x),
      'accounts', (select count(*) from auth.users u where u.created_at >= since
        and (src is null or coalesce(nullif(lower(u.raw_user_meta_data->'utm'->>'source'), ''), 'direkt') = src)),
      'with_wish', (select count(distinct u.id) from auth.users u join public.profiles p on p.owner_id = u.id join public.wishes w on w.profile_id = p.id
        where u.created_at >= since and (src is null or coalesce(nullif(lower(u.raw_user_meta_data->'utm'->>'source'), ''), 'direkt') = src)),
      'sources', (select coalesce(jsonb_agg(x), '[]'::jsonb) from (
        select source, count(*) as visitors from who group by 1 order by 2 desc limit 12) x)
    )
  );
end $$;
revoke execute on function public.admin_funnel(int, text) from public, anon, authenticated;
grant execute on function public.admin_funnel(int, text) to authenticated;
