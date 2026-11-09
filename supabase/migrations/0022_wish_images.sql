-- Wishtale: Produktbilder zu Wünschen. Das Bild wird einmal in unseren eigenen Speicher kopiert (kein Hotlinking, keine Adresse des Besuchers
-- geht an fremde Server). img_src nennt die Herkunft (Adresse der Shop-Seite) für Transparenz und Hinweise von Rechteinhabern.

alter table public.wishes
  add column if not exists img_url text not null default '' check (img_url = '' or img_url ~* '^https://'),
  add column if not exists img_src text not null default '' check (char_length(img_src) <= 120);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wish-images', 'wish-images', true, 524288, array['image/jpeg'])
on conflict (id) do update set public = true, file_size_limit = 524288, allowed_mime_types = array['image/jpeg'];

-- Jede Person darf nur in den eigenen Ordner (<user-id>/…) hochladen und dort löschen. Lesen geht über die öffentliche Adresse.
create policy wish_images_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'wish-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy wish_images_delete on storage.objects for delete to authenticated
  using (bucket_id = 'wish-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create or replace function public.public_profile(p_handle text, p_token text default null)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare p public.profiles; th text; v jsonb;
begin
  select * into p from public.profiles where handle = lower(p_handle);
  if not found then return null; end if;
  th := case when p_token is not null and char_length(p_token) >= 16 then encode(extensions.digest(p_token, 'sha256'), 'hex') end;
  v := p.vis;
  return jsonb_build_object(
    'id', p.id, 'handle', p.handle, 'name', p.name, 'age', p.age, 'managed', p.managed,
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
        'reserved', r.id is not null,
        'bought', coalesce(r.state = 'bought', false),
        'mine', r.token_hash is not null and r.token_hash = th
      ) order by w.prio desc, w.created_at)
      from public.wishes w left join public.reservations r on r.wish_id = w.id
      where w.profile_id = p.id and w.vis <> 'privat'), '[]'::jsonb),
    -- Geschenke aus der Vergangenheit sehen Gäste nicht: kein Name, kein Anlass, keine Bewertung.
    -- Nur die Stichwörter bleiben, damit die Vorschläge nichts doppelt empfehlen.
    'gifts', coalesce((
      select jsonb_agg(jsonb_build_object('kw', g.kw) order by g.created_at desc)
      from public.gifts g where g.profile_id = p.id), '[]'::jsonb),
    'hidden', coalesce((
      select jsonb_agg(jsonb_build_object('kw', w.kw))
      from public.wishes w where w.profile_id = p.id and w.status = 'plan'), '[]'::jsonb)
  );
end $$;
