-- =====================================================================
-- Conectamente · 008 storage buckets and policies
--
-- Buckets:
--   audio   — episode narrations (public read; admin write)
--   videos  — onboarding & supporting clips (public read; admin write)
--   covers  — episode cover art (public read; admin write)
--   pdfs    — generated worksheets, optional uploads (private)
--   avatars — user-uploaded avatars (public read; owner write)
-- =====================================================================

insert into storage.buckets (id, name, public) values
  ('audio',   'audio',   true)  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values
  ('videos',  'videos',  true)  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values
  ('covers',  'covers',  true)  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values
  ('pdfs',    'pdfs',    false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true)  on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Public read for content buckets
-- ---------------------------------------------------------------------

drop policy if exists "Public read audio"   on storage.objects;
create policy "Public read audio"
  on storage.objects for select
  using (bucket_id = 'audio');

drop policy if exists "Public read videos"  on storage.objects;
create policy "Public read videos"
  on storage.objects for select
  using (bucket_id = 'videos');

drop policy if exists "Public read covers"  on storage.objects;
create policy "Public read covers"
  on storage.objects for select
  using (bucket_id = 'covers');

drop policy if exists "Public read avatars" on storage.objects;
create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- ---------------------------------------------------------------------
-- Avatars: each user manages files under their own folder (uid/...)
-- ---------------------------------------------------------------------

drop policy if exists "Users upload own avatar" on storage.objects;
create policy "Users upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users update own avatar" on storage.objects;
create policy "Users update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete own avatar" on storage.objects;
create policy "Users delete own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------
-- PDFs: each user can read/write only their own folder
-- ---------------------------------------------------------------------

drop policy if exists "Users read own pdfs" on storage.objects;
create policy "Users read own pdfs"
  on storage.objects for select
  using (
    bucket_id = 'pdfs'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users write own pdfs" on storage.objects;
create policy "Users write own pdfs"
  on storage.objects for insert
  with check (
    bucket_id = 'pdfs'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete own pdfs" on storage.objects;
create policy "Users delete own pdfs"
  on storage.objects for delete
  using (
    bucket_id = 'pdfs'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );
