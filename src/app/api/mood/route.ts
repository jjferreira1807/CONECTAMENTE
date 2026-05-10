import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ok, errServer } from "@/lib/api/response";
import { requireUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";
import { readJson, readSearchParams } from "@/lib/api/validate";
import { moodUpsertSchema } from "@/lib/api/schemas";
import type { Json } from "@/lib/supabase/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  limit: z.coerce.number().int().min(1).max(365).optional(),
});

/** GET /api/mood?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=90 */
export async function GET(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.read);
  if (ctx instanceof NextResponse) return ctx;

  const q = readSearchParams(req, querySchema);
  if (q instanceof NextResponse) return q;

  let qb = ctx.supabase
    .from("mood_tracking")
    .select("day, mood, energy, note, updated_at")
    .order("day", { ascending: true });

  if (q.from) qb = qb.gte("day", q.from);
  if (q.to)   qb = qb.lte("day", q.to);
  if (q.limit) qb = qb.limit(q.limit);

  const { data, error } = await qb;
  if (error) return errServer(error.message);
  return ok(data ?? []);
}

/** POST /api/mood — upsert today's check-in (or specific day if provided). */
export async function POST(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.write);
  if (ctx instanceof NextResponse) return ctx;

  const body = await readJson(req, moodUpsertSchema);
  if (body instanceof NextResponse) return body;

  const day = body.day ?? new Date().toISOString().slice(0, 10);

  const { data, error } = await ctx.supabase
    .from("mood_tracking")
    .upsert(
      {
        user_id: ctx.user.id,
        day,
        mood: body.mood,
        energy: body.energy,
        note: body.note ?? null,
        context: (body.context ?? {}) as Json,
      },
      { onConflict: "user_id,day" }
    )
    .select()
    .single();

  if (error) return errServer(error.message);
  return ok(data);
}
