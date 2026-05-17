import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ok } from "@/lib/api/response";
import { requireUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";

export const dynamic = "force-dynamic";

/**
 * GET /api/me — minimal identity probe.
 *
 * Returns ONLY `{ id, email }` from the auth session. We deliberately do not
 * maintain a `profiles` table — no display name, avatar, locale, or any
 * other profile field replicated from Google or asked of the user. The app
 * references the user solely by `user_id` (Supabase UUID); email lives in
 * `auth.users` because the OAuth flow requires it, never elsewhere.
 *
 * No PATCH endpoint: there is no profile to update.
 */
export async function GET(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.read);
  if (ctx instanceof NextResponse) return ctx;

  return ok({
    id: ctx.user.id,
    email: ctx.user.email,
  });
}
