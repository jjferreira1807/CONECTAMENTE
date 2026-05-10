-- =====================================================================
-- Conectamente · 007 analytics
-- Privacy-respecting product analytics. No IP, no user agent fingerprint;
-- only event kind, optional payload, user_id (nullable for anonymous).
-- =====================================================================

create table if not exists public.analytics_events (
  id           bigint generated always as identity primary key,
  user_id      uuid references auth.users(id) on delete set null,
  anon_id      uuid, -- pseudonymous id for anonymous users (browser-side, rotates)
  kind         public.event_kind not null,
  episode_slug citext,
  section_id   text,
  -- duration_ms for audio/page sessions; null otherwise
  duration_ms  integer check (duration_ms is null or duration_ms >= 0),
  -- attributes: small jsonb for kind-specific fields
  attrs        jsonb not null default '{}'::jsonb,
  occurred_at  timestamptz not null default now()
);

create index if not exists analytics_events_user_idx on public.analytics_events (user_id, occurred_at desc);
create index if not exists analytics_events_kind_idx on public.analytics_events (kind, occurred_at desc);
create index if not exists analytics_events_episode_idx on public.analytics_events (episode_slug, occurred_at desc);

-- ---------------------------------------------------------------------
-- Convenience view: weekly engagement per user (for the Stats page)
-- ---------------------------------------------------------------------

create or replace view public.v_weekly_engagement as
select
  user_id,
  date_trunc('week', occurred_at) as week_start,
  count(*) filter (where kind = 'audio_progress') as audio_ticks,
  count(*) filter (where kind = 'episode_complete') as episodes_completed,
  count(*) filter (where kind = 'mood_save') as mood_saves,
  count(*) filter (where kind = 'intention_save') as intention_saves,
  sum(coalesce(duration_ms, 0)) / 60000.0 as approx_minutes
from public.analytics_events
where user_id is not null
group by 1, 2;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table public.analytics_events enable row level security;

-- Authenticated users can insert their own events; reads restricted to owner.
drop policy if exists "analytics_owner_insert" on public.analytics_events;
create policy "analytics_owner_insert"
  on public.analytics_events for insert
  with check (
    user_id is null or user_id = auth.uid()
  );

drop policy if exists "analytics_owner_select" on public.analytics_events;
create policy "analytics_owner_select"
  on public.analytics_events for select
  using (user_id is not null and user_id = auth.uid());

-- No update/delete for users; service role bypasses RLS for retention jobs.

comment on table public.analytics_events is
  'Privacy-respecting product events. No IP, no UA. Optional anon_id for unsigned-in users.';
