import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ok, errServer } from "@/lib/api/response";
import { requireUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";
import { readJson, readSearchParams } from "@/lib/api/validate";
import { intentionUpsertSchema, intentionToggleSchema } from "@/lib/api/schemas";
import { z } from "zod";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(365).default(30),
});

export async function GET(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.read);
  if (ctx instanceof NextResponse) return ctx;

  const q = readSearchParams(req, querySchema);
  if (q instanceof NextResponse) return q;

  const { data, error } = await ctx.supabase
    .from("intentions")
    .select("day, text, done, updated_at")
    .order("day", { ascending: false })
    .limit(q.limit);

  if (error) return errServer(error.message);
  return ok(data ?? []);
}

/** POST upsert one intention. */
export async function POST(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.write);
  if (ctx instanceof NextResponse) return ctx;

  const body = await readJson(req, intentionUpsertSchema);
  if (body instanceof NextResponse) return body;

  const day = body.day ?? new Date().toISOString().slice(0, 10);

  const { data, error } = await ctx.supabase
    .from("intentions")
    .upsert(
      {
        user_id: ctx.user.id,
        day,
        text: body.text,
        done: body.done ?? false,
      },
      { onConflict: "user_id,day" }
    )
    .select()
    .single();

  if (error) return errServer(error.message);
  return ok(data);
}

/** PATCH /api/intentions — toggle done flag for a given day. */
export async function PATCH(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.write);
  if (ctx instanceof NextResponse) return ctx;

  const body = await readJson(req, intentionToggleSchema);
  if (body instanceof NextResponse) return body;

  const { data, error } = await ctx.supabase
    .from("intentions")
    .update({ done: body.done })
    .eq("day", body.day)
    .select()
    .maybeSingle();

  if (error) return errServer(error.message);
  return ok(data);
}
