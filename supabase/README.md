# Supabase migrations

Each SQL file is numbered, idempotent, and safe to re-run. Apply with:

```bash
supabase db push
```

…or paste them into the SQL Editor in order. Order matters — later files reference earlier ones.

## Files

| File                                    | Purpose                                           |
|-----------------------------------------|---------------------------------------------------|
| `20260510000100_init.sql`               | Extensions, enums, helper functions, triggers     |
| `20260510000200_profiles.sql`           | ~~Profiles table + auto-create trigger~~ — dropped by `20260511000100` |
| `20260510000300_content.sql`            | Episodes & sections (public-read)                 |
| `20260510000400_progress.sql`           | User progress, reflections, exercise answers      |
| `20260510000500_emotional.sql`          | Mood, intentions, episode mood                    |
| `20260510000600_engagement.sql`         | Downloads, notifications                          |
| `20260510000700_analytics.sql`          | Events table + weekly view                        |
| `20260510000800_storage.sql`            | Buckets + storage policies                        |
| `20260510000900_seed.sql`               | Seeds 12 episodes                                 |
| `20260511000100_drop_profiles.sql`      | **Privacy by design.** Removes `profiles` and the trigger that replicated Google's name/avatar. The app identifies users solely by `auth.uid()`. |

> **Note on `20260510000200_profiles.sql`:** This file is kept in the repo
> for historical traceability, but `20260511000100_drop_profiles.sql`
> reverses everything it created. Fresh database deployments can still run
> all migrations in order — the drop migration is idempotent.

## Verifying RLS

```sql
select tablename, rowsecurity from pg_tables
where schemaname = 'public'
order by tablename;
```

All `public` tables should report `rowsecurity = true` except for the
`v_weekly_engagement` view (views inherit underlying RLS).

## Verifying policies

```sql
select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

## Seeding sections (curriculum)

Episode sections currently live in `src/content/episodes.ts` and are
authoritative. To migrate them into the `sections` table, run the equivalent
of:

```sql
insert into public.sections (episode_id, external_id, position, kind, payload)
select e.id, s.external_id, s.position, s.kind::section_kind, s.payload
from public.episodes e
join (values
  ('bem-vindo', 'intro', 1, 'text', '{...}'::jsonb)
  -- ...
) as s(slug, external_id, position, kind, payload) on s.slug = e.slug
on conflict (episode_id, external_id) do update set
  position = excluded.position,
  kind = excluded.kind,
  payload = excluded.payload,
  updated_at = now();
```

For now the front-end reads from the bundled `episodes.ts`; a future
migration can copy that data into `sections` without code changes (the API
already prefers the DB version when configured).

## Reset (dev only)

```sql
drop schema public cascade;
create schema public;
```

Then re-run all migrations. **Never run this on production.**
