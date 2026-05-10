# Deployment · Conectamente

Target platform: **Vercel** + **Supabase**. Both have generous free tiers.

## 1. Provision Supabase

1. Create a project at <https://supabase.com> (region close to your users — e.g. `eu-west-1`).
2. In **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## 2. Apply migrations

You can either use the Supabase CLI:

```bash
brew install supabase/tap/supabase
supabase link --project-ref <ref>
supabase db push
```

…or run each `.sql` file in order from the **SQL Editor** in the dashboard. Files in `supabase/migrations/` are numbered and idempotent.

After running, you should have:

- 12 tables in `public`: `profiles`, `episodes`, `sections`, `user_progress`, `reflections`, `exercise_answers`, `mood_tracking`, `intentions`, `episode_mood`, `downloads`, `notifications`, `analytics_events`
- 5 storage buckets: `audio`, `videos`, `covers`, `pdfs`, `avatars`
- A trigger `on_auth_user_created` on `auth.users` that creates a profile
- 12 episodes seeded with content slugs

Verify RLS is on:

```sql
select tablename, rowsecurity from pg_tables where schemaname='public';
```

## 3. Configure Auth (Supabase dashboard)

- **Authentication → URL Configuration**:
  - `Site URL`: `https://conectamente.pt` (or your domain)
  - `Redirect URLs` (allow-list):
    - `https://conectamente.pt/auth/callback`
    - `http://localhost:3000/auth/callback`
- **Authentication → Providers**:
  - Email: enable + require confirmations
  - Google (optional): paste OAuth client ID + secret from Google Cloud Console
- **Email templates**: customise the recovery and confirmation messages (PT-PT). The recovery template should link to `{{ .SiteURL }}/auth/callback?type=recovery&next=/auth/reset-password`.

## 4. Deploy to Vercel

```bash
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL          # production, preview, dev
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY         # production only
vercel env add NEXT_PUBLIC_SITE_URL              # production
vercel deploy --prod
```

The first deploy will:

1. Install dependencies
2. Run `next build`
3. Generate 33+ static routes for episodes/worksheets
4. Edge-cache `/api/episodes` (s-maxage 300s)

## 5. Storage assets

Upload your audio/video/covers via the Supabase dashboard or CLI:

```bash
supabase storage cp local/audio/01-bem-vindo.mp3 audio/01-bem-vindo.mp3
```

Then point `episodes.audio_path = '01-bem-vindo.mp3'` (the path inside the bucket).

The frontend resolves the public URL via `supabase.storage.from('audio').getPublicUrl(audio_path)`.

## 6. Custom domain

Map `conectamente.pt` to Vercel. Update Supabase URL Configuration to match. Redeploy.

## 7. Observability

- **Logs**: Vercel project → Logs (server logs from `console.log` JSON lines).
- **Database**: Supabase → Database → Query Performance.
- **Auth**: Supabase → Authentication → Logs.

## 8. Backups

Supabase performs daily backups on Pro plans. For free-tier projects, schedule a nightly `pg_dump` via GitHub Actions:

```yaml
- run: PGPASSWORD=$SUPABASE_DB_PASSWORD pg_dump -h db.${SUPABASE_REF}.supabase.co -U postgres -d postgres -F c > backup.dump
```

## 9. Rollback

The schema is forward-only by design (no destructive migrations). To rollback:

1. Use Supabase point-in-time restore (Pro+).
2. Or restore the latest `pg_dump`.

## 10. Local dev

```bash
cp .env.example .env.local      # fill in keys
npm install
npm run dev
```

Without keys, the app runs in local-only mode (localStorage). Useful for design work.
