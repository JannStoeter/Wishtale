-- Wishtale: geteilte Links in der Auswertung (Dev 105). Ergänzt admin_usage_devices() um „links“:
-- Aufrufe der Gastansicht, die über wishtale.de/w/<kürzel> kamen (guest_view mit label 'link'), dazu alle Gastaufrufe zum Vergleich und je Tag.
create or replace function public.admin_usage_devices(p_days int default 30)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  d int := least(greatest(coalesce(p_days, 30), 1), 365);
  since timestamptz := date_trunc('day', now() at time zone 'Europe/Berlin') at time zone 'Europe/Berlin' - make_interval(days => d - 1);
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  return jsonb_build_object(
    'areas', (select coalesce(jsonb_agg(x order by x.ord), '[]'::jsonb) from (
      select a.ord, a.area,
        count(distinct e.visitor) filter (where e.device = 'mobile') as mobile,
        count(distinct e.visitor) filter (where e.device = 'tablet') as tablet,
        count(distinct e.visitor) filter (where e.device = 'desktop') as desktop,
        count(distinct e.visitor) as total
      from (values (1, 'landing', 'view'), (2, 'app', 'app_open'), (3, 'guest', 'guest_view')) as a(ord, area, ev)
      left join public.events e on e.name = a.ev and e.ts >= since and (a.ev <> 'view' or e.path = '/')
      group by a.ord, a.area) x),
    'app_mode', jsonb_build_object(
      'pwa', (select count(distinct visitor) from public.events where name = 'app_open' and label = 'pwa' and ts >= since),
      'browser', (select count(distinct visitor) from public.events where name = 'app_open' and coalesce(label, 'browser') <> 'pwa' and ts >= since)
    ),
    'links', jsonb_build_object(
      'opens', (select count(*) from public.events where name = 'guest_view' and label = 'link' and ts >= since),
      'visitors', (select count(distinct visitor) from public.events where name = 'guest_view' and label = 'link' and ts >= since),
      'mobile', (select count(distinct visitor) from public.events where name = 'guest_view' and label = 'link' and device = 'mobile' and ts >= since),
      'guest_all', (select count(*) from public.events where name = 'guest_view' and ts >= since),
      'daily', (select coalesce(jsonb_agg(jsonb_build_object('d', to_char(g, 'YYYY-MM-DD'), 'n',
          (select count(*) from public.events e where e.name = 'guest_view' and e.label = 'link' and (e.ts at time zone 'Europe/Berlin')::date = g)) order by g), '[]'::jsonb)
        from generate_series((since at time zone 'Europe/Berlin')::date, (now() at time zone 'Europe/Berlin')::date, interval '1 day') as g)
    )
  );
end $$;
revoke execute on function public.admin_usage_devices(int) from public, anon, authenticated;
grant execute on function public.admin_usage_devices(int) to authenticated;
