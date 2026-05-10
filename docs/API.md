# API · Conectamente

All endpoints return a single JSON envelope:

```jsonc
// success
{ "ok": true, "data": <T> }

// failure
{ "ok": false, "error": { "code": "string", "message": "string", "details"?: any } }
```

Status codes follow REST conventions:

| Code | When                                              |
|------|---------------------------------------------------|
| 200  | Success                                           |
| 401  | `unauthorised` — no session or expired            |
| 403  | `forbidden` — RLS denied                          |
| 404  | `not_found`                                       |
| 422  | `invalid_input` — Zod validation failed           |
| 429  | `rate_limited`                                    |
| 500  | `server_error`                                    |
| 503  | `misconfigured` — Supabase env missing            |

All write endpoints are rate-limited per (user, IP). See `src/lib/api/rateLimit.ts`.

---

## Auth

### `POST /api/auth/recover`

Trigger a password recovery email. Always 200 (anti-enumeration).

```json
{ "email": "you@example.com" }
```

### `POST /api/auth/reset-password`

Set a new password (requires recovery session — Supabase signs you in via the recovery link).

```json
{ "password": "min-8-chars" }
```

### `POST /api/auth/signout`

Clears the session cookie.

### `GET /auth/callback?code=...&next=/dashboard&type=recovery?`

Server-side OAuth/email confirmation handler. Exchanges the code for a session and redirects to `next`. Special-cases `type=recovery` to send the user to `/auth/reset-password`.

---

## Episodes (public)

### `GET /api/episodes`

List of published episodes. Response cached at the edge (`s-maxage=300`).

```json
[{ "slug": "bem-vindo", "number": 1, "kicker": "...", "title": "...", "duration_min": 12, ... }]
```

### `GET /api/episodes/[slug]`

Single episode + ordered sections.

```json
{
  "slug": "bem-vindo",
  "number": 1,
  "title": "...",
  "sections": [{ "external_id": "intro", "kind": "text", "payload": {...} }]
}
```

---

## Progress (auth)

### `GET /api/progress`

All progress rows for the signed-in user (one per episode).

### `POST /api/progress`

Upsert progress for an episode. `sectionsDone` is merged with what's already stored — never replaces.

```json
{
  "episodeSlug": "bem-vindo",
  "sectionsDone": ["intro"],
  "minutesEngaged": 1.5,
  "completedAt": "2026-05-10T12:00:00Z"
}
```

### `GET /api/progress/[slug]`

Progress for one episode.

### `DELETE /api/progress/[slug]`

Reset progress for one episode.

---

## Reflections (auth)

### `GET /api/reflections`

All reflections.

### `POST /api/reflections`

Upsert one (debounced autosave).

```json
{ "episodeSlug": "tcc-conversa", "promptId": "reflexao", "answer": "..." }
```

---

## Exercises (auth)

### `GET /api/exercises`

All exercise answers (structured payloads).

### `POST /api/exercises`

```json
{ "episodeSlug": "ansiedade", "exerciseId": "thought-record-2", "payload": { ... } }
```

`payload` is bound to 64 KB.

---

## Mood (auth)

### `GET /api/mood?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=90`

### `POST /api/mood`

Upsert today's check-in (or specific day).

```json
{ "mood": 4, "energy": 3, "note": "noite difícil", "day": "2026-05-10" }
```

---

## Intentions (auth)

### `GET /api/intentions?limit=30`

Last N daily intentions, newest first.

### `POST /api/intentions`

```json
{ "text": "Hoje, deixo o telemóvel fora do quarto." }
```

### `PATCH /api/intentions`

Toggle the `done` flag for a given day.

```json
{ "day": "2026-05-10", "done": true }
```

---

## Notifications (auth)

### `GET /api/notifications?unread=1&limit=20`

### `POST /api/notifications`

Create a self-notification (e.g. a reminder the user scheduled).

### `PATCH /api/notifications`

```json
{ "id": "uuid", "read": true }
```

---

## Analytics

### `POST /api/analytics`

One event or a small batch. Anonymous users may pass `anonId`. Privacy-respecting — we never log IPs or user agents.

```json
{ "kind": "audio_progress", "episodeSlug": "ansiedade", "durationMs": 5000 }
```

or

```json
{ "events": [ { ... }, { ... } ] }
```

---

## Profile (auth)

### `GET /api/me`

Profile + auth metadata.

### `PATCH /api/me`

```json
{ "display_name": "Maria", "reminder_enabled": true, "reminder_hour": 21 }
```

---

## GDPR (auth)

### `GET /api/me/export`

Returns a JSON document with everything we hold for this user. `Content-Disposition: attachment`.

### `POST /api/me/delete`

Erases all user-owned rows. If `SUPABASE_SERVICE_ROLE_KEY` is configured, also deletes the auth user (cascades).

---

## Downloads (auth)

### `POST /api/downloads`

Logs a download/print event for product analytics.

```json
{ "resource": "fichas/registo-pensamentos", "format": "print" }
```
