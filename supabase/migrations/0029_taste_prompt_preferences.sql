-- 089: Häufigkeit und Ablehnungen des freiwilligen Hinweises, je Profil und geräteübergreifend.
create table public.taste_prompt_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  last_shown_at timestamptz not null default now(),
  dismissals smallint not null default 0 check (dismissals between 0 and 3)
);
alter table public.taste_prompt_preferences enable row level security;
revoke all on public.taste_prompt_preferences from anon, authenticated;
grant select, insert, update, delete on public.taste_prompt_preferences to authenticated;
create policy taste_prompt_own on public.taste_prompt_preferences for all to authenticated
  using (public.can_manage(profile_id)) with check (public.can_manage(profile_id));

-- Atomar: zwei Tabs oder Geräte dürfen im selben Zeitraum nicht beide neu einblenden.
create function public.claim_taste_prompt(p_profile_id uuid)
returns setof public.taste_prompt_preferences language sql security invoker set search_path = '' as $$
  insert into public.taste_prompt_preferences (profile_id) values (p_profile_id)
  on conflict (profile_id) do update set last_shown_at = now()
    where taste_prompt_preferences.dismissals < 3
      and taste_prompt_preferences.last_shown_at <= now() - interval '7 days'
  returning *;
$$;
create function public.dismiss_taste_prompt(p_profile_id uuid)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  update public.taste_prompt_preferences set dismissals = least(3, dismissals + 1)
    where profile_id = p_profile_id;
  return found;
end;
$$;
revoke all on function public.claim_taste_prompt(uuid), public.dismiss_taste_prompt(uuid) from public, anon;
grant execute on function public.claim_taste_prompt(uuid), public.dismiss_taste_prompt(uuid) to authenticated;
