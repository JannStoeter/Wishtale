-- Wishtale: Kind-Konten mit Geburtsdatum und Kleidergröße (Auftrag von Jann).
-- Das Geburtsdatum bleibt im Konto der Eltern. Gäste sehen über public_profile nur das daraus berechnete Alter (nie Tag oder Monat),
-- dazu die Kleidergröße, wenn sie angegeben ist.
alter table public.profiles add column if not exists birthdate date;
alter table public.profiles add column if not exists clothing_size text;
alter table public.profiles drop constraint if exists profiles_birthdate_check;
alter table public.profiles add constraint profiles_birthdate_check check (birthdate is null or (birthdate >= date '1900-01-01' and birthdate <= current_date + 1));
alter table public.profiles drop constraint if exists profiles_clothing_size_check;
alter table public.profiles add constraint profiles_clothing_size_check check (clothing_size is null or char_length(clothing_size) <= 20);

create or replace function public.public_profile(p_handle text, p_token text default null)
returns jsonb language plpgsql stable security definer set search_path = '' as $function$
declare p public.profiles; th text; v jsonb;
begin
  select * into p from public.profiles where handle = lower(p_handle);
  if not found then return null; end if;
  th := case when p_token is not null and char_length(p_token) >= 16 then encode(extensions.digest(p_token, 'sha256'), 'hex') end;
  v := p.vis;
  return jsonb_build_object(
    'id', p.id, 'handle', p.handle, 'name', p.name,
    'age', coalesce(case when p.birthdate is not null then extract(year from age(current_date, p.birthdate))::int end, p.age),
    'size', nullif(btrim(coalesce(p.clothing_size, '')), ''),
    'managed', p.managed,
    'parent_name', p.parent_name, 'tone', p.tone, 'about', p.about,
    'interests', case when v->>'interests' = 'privat' then '[]'::jsonb else to_jsonb(p.interests) end,
    'cats',      case when v->>'cats'      = 'privat' then '[]'::jsonb else to_jsonb(p.cats) end,
    'brands',    case when v->>'brands'    = 'privat' then '[]'::jsonb else to_jsonb(p.brands) end,
    'tries',     case when v->>'tries'     = 'privat' then '[]'::jsonb else to_jsonb(p.tries) end,
    'nogos',     case when v->>'nogos'     = 'privat' then '[]'::jsonb else to_jsonb(p.nogos) end,
    'alts',      case when v->>'alts'      = 'privat' then '[]'::jsonb else to_jsonb(p.alts) end,
    'style',     case when v->>'style'     = 'privat' then '[]'::jsonb else p.style end,
    'social',    case when v->>'social'    = 'privat' then '{}'::jsonb else p.social end,
    'wishes', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'title', w.title, 'kind', w.kind, 'prio', w.prio, 'note', w.note, 'link', w.link,
        'price', w.price, 'budget', w.budget, 'category', w.category, 'occ', w.occ, 'status', w.status,
        'via', w.via, 'pid', w.pid, 'kw', w.kw, 'art', w.art, 'tone', w.tone, 'img_url', w.img_url, 'img_src', w.img_src,
        'no_suggest', w.no_suggest,
        'reserved', r.id is not null,
        'bought', coalesce(r.state = 'bought', false),
        'mine', r.token_hash is not null and r.token_hash = th
      ) order by w.prio desc, w.created_at)
      from public.wishes w left join public.reservations r on r.wish_id = w.id
      where w.profile_id = p.id and w.vis <> 'privat'), '[]'::jsonb),
    'gifts', coalesce((
      select jsonb_agg(jsonb_build_object('kw', g.kw) order by g.created_at desc)
      from public.gifts g where g.profile_id = p.id), '[]'::jsonb)
  );
end $function$;
