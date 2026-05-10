import { NextResponse, type NextRequest } from "next/server";
import { ok, errServer } from "@/lib/api/response";
import { maybeUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";
import { readJson } from "@/lib/api/validate";
import { analyticsEventSchema } from "@/lib/api/schemas";
import type { Json } from "@/lib/supabase/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

const batchSchema = z.union([
  analyticsEventSchema,
  z.object({ events: z.array(analyticsEventSchema).min(1).max(50) }),
]);

/**
 * POST /api/analytics — send one event or a small batch.
 * Anonymous users are allowed (anon_id may be supplied client-side).
 * Privacy: we never store IPs or user agents.
 */
export async function POST(req: NextRequest) {
  const ctx = await maybeUser(req, RATE_LIMITS.analytics);
  if (ctx.rateLimited) return ok({ accepted: 0 }); // silent drop on overload
  if (!ctx.supabase) return ok({ accepted: 0 }); // local-only mode: no-op

  const body = await readJson(req, batchSchema);
  if (body instanceof NextResponse) return body;

  const events = "events" in body ? body.events : [body];

  const rows = events.map((e) => ({
    user_id: ctx.user?.id ?? null,
    anon_id: e.anonId ?? null,
    kind: e.kind,
    episode_slug: e.episodeSlug ?? null,
    section_id: e.sectionId ?? null,
    duration_ms: e.durationMs ?? null,
    attrs: (e.attrs ?? {}) as Json,
  }));

  const { error } = await ctx.supabase.from("analytics_events").insert(rows);
  if (error) return errServer(error.message);
  return ok({ accepted: rows.length });
}
