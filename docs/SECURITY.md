# Security · Conectamente

## Threat model

- **Targeted users**: vulnerable adults engaging with a mental-health product. Privacy and resilience matter as much as availability.
- **Sensitive data**: free-text reflections, mood, exercise outputs. Some of this content can be highly personal.
- **Attackers**: opportunistic credential stuffers, scrapers, GDPR-curious users.

## Defence in depth

### 1. Authentication

- Supabase email + password (8-char minimum).
- Optional Google OAuth.
- Email-confirmation required for new accounts.
- Recovery links expire (Supabase default).
- Session refresh handled in `src/middleware.ts` via `@supabase/ssr` so cookies stay valid across requests.

### 2. Authorisation — Row Level Security

Every table that holds user data has RLS enabled with policies that bind `user_id = auth.uid()`. See `supabase/migrations/`:

- `profiles_self_*`
- `user_progress_owner`
- `reflections_owner`
- `exercise_answers_owner`
- `mood_tracking_owner`
- `intentions_owner`
- `episode_mood_owner`
- `downloads_owner_rw`
- `notifications_owner_*`
- `analytics_owner_insert/select`

Public read tables (`episodes`, `sections`) have explicit `select` policies and no write policy — only the service role can mutate them.

### 3. Input validation

- All write endpoints validate bodies with Zod schemas (`src/lib/api/schemas.ts`).
- Payload sizes are capped (e.g. exercise JSON ≤ 64 KB; reflections ≤ 8000 chars).
- Slugs constrained by regex (`^[a-z0-9-]+$`).
- Dates validated as ISO `yyyy-mm-dd`.

### 4. Rate limiting

`src/lib/api/rateLimit.ts` implements a token bucket per (scope, user, IP). Default budgets:

| Scope     | Capacity | Window |
|-----------|----------|--------|
| authBurst | 5        | 60s    |
| write     | 60       | 60s    |
| read      | 240      | 60s    |
| analytics | 600      | 60s    |

> **Production note**: this limiter is process-local. On Vercel serverless, swap for `@upstash/ratelimit` backed by Redis (drop-in replacement). The shape of `rateLimit()` matches Upstash's `limit()`.

### 5. HTTP security headers

Set in `next.config.mjs` and `src/middleware.ts`:

- `Strict-Transport-Security` (HSTS, 2-year, includeSubDomains, preload)
- `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` denies camera, microphone, geolocation, FLoC
- `Content-Security-Policy`: restricts img/media/script/connect; allows Supabase domains

CSP currently allows `'unsafe-inline'` for styles (Tailwind runtime style attrs) and `'unsafe-eval'` for Next.js dev. For prod, switch to nonces — see `next/headers` docs.

### 6. CSRF

- Supabase auth uses HTTP-only cookies (`SameSite=Lax` by default).
- All write endpoints accept JSON only and rely on the same-origin cookie. The CSP `form-action 'self'` and `frame-ancestors 'none'` further block cross-site form submissions.

### 7. XSS

- React auto-escapes by default.
- `dangerouslySetInnerHTML` is used in **two** places only — episode body paragraphs (`SectionRenderer.tsx`) and CBT psychoeducation copy. This content is **authored** in `src/content/episodes.ts` (server-side, version-controlled). User-generated content is **never** rendered as HTML — only as text.

### 8. Secrets

- `SUPABASE_SERVICE_ROLE_KEY` is server-only (no `NEXT_PUBLIC_` prefix). It's used only in `src/lib/supabase/admin.ts` for trusted jobs.
- `.env.local` is git-ignored; `.env.example` shows the required keys.

### 9. Privacy / GDPR

- `GET /api/me/export` returns a full JSON dump of user-owned data.
- `POST /api/me/delete` wipes all user rows; with the service role configured, also deletes the auth user.
- `analytics_events` never stores IPs or user agents.
- The privacy page (`/privacidade`) explains exactly what's stored where.

### 10. Audit & logging

`src/lib/api/logger.ts` emits single-line JSON to stdout (Vercel-friendly). Errors that include sensitive data (passwords, tokens) are never logged.

## Open items / future hardening

- [ ] Move rate-limiter to Upstash for multi-region correctness.
- [ ] Tighten CSP with nonces; remove `'unsafe-eval'` post-build.
- [ ] Add Sentry (error monitoring) with PII scrubbing.
- [ ] 2FA via TOTP (Supabase native).
- [ ] Backup verification (Supabase nightly + restore drill quarterly).
- [ ] Dependency audit job in CI (`npm audit --omit=dev`).
