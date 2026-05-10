-- =====================================================================
-- Conectamente · 006 engagement (downloads, notifications)
-- =====================================================================

create table if not exists public.downloads (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  resource     text not null, -- e.g. "fichas/registo-pensamentos"
  format       text not null default 'pdf' check (format in ('pdf','html','print')),
  user_agent   text,
  created_at   timestamptz not null default now()
);

create index if not exists downloads_user_idx on public.downloads (user_id, created_at desc);
create index if not exists downloads_resource_idx on public.downloads (resource);

-- ---------------------------------------------------------------------
-- Notifications (in-app inbox; soft, gentle)
-- ---------------------------------------------------------------------

create table if not exists public.notifications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  kind         public.notification_kind not null default 'system',
  title        text not null,
  body         text,
  href         text,
  read_at      timestamptz,
  delivered_at timestamptz default now(),
  created_at   timestamptz not null default now()
);

create index if not exists notifications_user_unread_idx
  on public.notifications (user_id, created_at desc)
  where read_at is null;

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table public.downloads enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "downloads_owner_rw" on public.downloads;
create policy "downloads_owner_rw"
  on public.downloads for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Notifications: users can read and update (mark as read) their own.
-- Inserts come from server-side (service role).
drop policy if exists "notifications_owner_select" on public.notifications;
create policy "notifications_owner_select"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "notifications_owner_update" on public.notifications;
create policy "notifications_owner_update"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "notifications_owner_delete" on public.notifications;
create policy "notifications_owner_delete"
  on public.notifications for delete
  using (auth.uid() = user_id);

comment on table public.downloads is 'Audit trail of downloads (privacy-respecting; user_id only).';
comment on table public.notifications is 'Per-user soft notification inbox.';
