-- Wishtale: Geräte je Bereich (Dev 097). Eigene Funktion, admin_usage() bleibt unverändert.
-- Bereiche: Landingpage (view auf /), eigene App (app_open, neu), Gast-Link (guest_view).
-- app_open trägt im Feld label nur „pwa“ (vom Home-Bildschirm) oder „browser“.
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
    )
  );
end $$;
revoke execute on function public.admin_usage_devices(int) from public, anon, authenticated;
grant execute on function public.admin_usage_devices(int) to authenticated;
