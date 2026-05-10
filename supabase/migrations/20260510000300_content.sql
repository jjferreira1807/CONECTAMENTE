-- =====================================================================
-- Conectamente · 003 content (episodes, sections)
-- Curriculum content. Read-only for users; writes happen via migrations
-- or admin (service role).
-- =====================================================================

create table if not exists public.episodes (
  id            uuid primary key default gen_random_uuid(),
  slug          citext unique not null,
  number        smallint not null check (number > 0),
  kicker        text not null,
  title         text not null,
  subtitle      text,
  description   text,
  duration_min  smallint not null default 10 check (duration_min between 1 and 120),
  theme_color   text,
  audio_path    text, -- relative path inside `audio` storage bucket
  cover_path    text, -- relative path inside `covers` storage bucket
  published     boolean not null default true,
  position      smallint not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists episodes_position_idx on public.episodes (position) where published;
create index if not exists episodes_number_idx on public.episodes (number) where published;

drop trigger if exists trg_episodes_updated_at on public.episodes;
create trigger trg_episodes_updated_at
  before update on public.episodes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Sections: each episode has an ordered list of sections.
-- Source of truth for sectionsDone progress.
-- ---------------------------------------------------------------------

create table if not exists public.sections (
  id          uuid primary key default gen_random_uuid(),
  episode_id  uuid not null references public.episodes(id) on delete cascade,
  external_id text not null, -- the id used by the front-end (e.g. "intro")
  position    smallint not null default 0,
  kind        public.section_kind not null,
  title       text,
  -- payload: full section data as JSON for rendering. Mirrors the front-end
  -- `Section` shape; flexible by design so curriculum changes don't require
  -- schema migrations.
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (episode_id, external_id)
);

create index if not exists sections_episode_idx on public.sections (episode_id, position);

drop trigger if exists trg_sections_updated_at on public.sections;
create trigger trg_sections_updated_at
  before update on public.sections
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- RLS — content is public-read.
-- ---------------------------------------------------------------------

alter table public.episodes enable row level security;
alter table public.sections enable row level security;

drop policy if exists "episodes_public_read" on public.episodes;
create policy "episodes_public_read"
  on public.episodes for select
  using (published = true);

drop policy if exists "sections_public_read" on public.sections;
create policy "sections_public_read"
  on public.sections for select
  using (
    exists (
      select 1 from public.episodes e
      where e.id = sections.episode_id and e.published = true
    )
  );

-- Writes: only service role (bypasses RLS). No policy needed.

comment on table public.episodes is 'Programme content. Public read.';
comment on table public.sections is 'Ordered sections per episode. Public read.';
