import type { NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  errMisconfigured, errRateLimited, errUnauthorised,
} from "./response";
import { rateLimit, rlKey, type RATE_LIMITS } from "./rateLimit";
import { NextResponse } from "next/server";

/**
 * We intentionally keep the Supabase client untyped at the API boundary.
 * Zod schemas in `src/lib/api/schemas.ts` are the contract for input
 * validation; row shapes are documented in `src/lib/supabase/types.ts` and
 * `supabase/migrations/`. This avoids fighting deep type-inference issues
 * when the `Database` generic doesn't propagate through `@supabase/ssr`.
 */
export type TypedSupabaseClient = SupabaseClient;

/**
 * Resolve the authenticated user (or fail early). Also enforces a per-IP
 * + per-user rate limit. Use at the top of every handler:
 *
 *   const ctx = await requireUser(req, RATE_LIMITS.write);
 *   if (ctx instanceof NextResponse) return ctx;
 *   const { user, supabase } = ctx;
 */
type Limit = (typeof RATE_LIMITS)[keyof typeof RATE_LIMITS];

interface UserContext {
  user: { id: string; email?: string | null };
  supabase: TypedSupabaseClient;
}

export async function requireUser(req: NextRequest, limit?: Limit): Promise<UserContext | NextResponse> {
  const supabase = getSupabaseServer() as TypedSupabaseClient | null;
  if (!supabase) return errMisconfigured();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return errUnauthorised();

  if (limit) {
    const ip = clientIp(req);
    const rl = rateLimit(rlKey("user", user.id, ip), limit);
    if (!rl.allowed) return errRateLimited();
  }

  return { user: { id: user.id, email: user.email }, supabase };
}

/**
 * Like requireUser but allows anonymous (for analytics/public endpoints).
 * Still rate limits by IP.
 */
type MaybeCtx =
  | { user: null; supabase: null; rateLimited: false }
  | { user: { id: string } | null; supabase: TypedSupabaseClient; rateLimited: boolean };

export async function maybeUser(req: NextRequest, limit?: Limit): Promise<MaybeCtx> {
  const supabase = getSupabaseServer() as TypedSupabaseClient | null;
  if (!supabase) return { user: null, supabase: null, rateLimited: false };

  const { data: { user } } = await supabase.auth.getUser();
  const u = user ? { id: user.id } : null;
  if (limit) {
    const ip = clientIp(req);
    const key = u ? rlKey("user", u.id, ip) : rlKey("anon", ip);
    const rl = rateLimit(key, limit);
    if (!rl.allowed) return { user: u, supabase, rateLimited: true };
  }
  return { user: u, supabase, rateLimited: false };
}

export function clientIp(req: NextRequest): string {
  // Vercel & most reverse proxies forward the real IP here.
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
