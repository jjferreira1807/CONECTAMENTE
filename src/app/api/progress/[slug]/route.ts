import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ok, errNotFound, errServer } from "@/lib/api/response";
import { requireUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";

export const dynamic = "force-dynamic";

interface Params { params: { slug: string } }

/** GET /api/progress/:slug — progress for one episode. */
export async function GET(req: NextRequest, { params }: Params) {
  const ctx = await requireUser(req, RATE_LIMITS.read);
  if (ctx instanceof NextResponse) return ctx;

  const { data, error } = await ctx.supabase
    .from("user_progress")
    .select("*")
    .eq("episode_slug", params.slug)
    .maybeSingle();

  if (error) return errServer(error.message);
  if (!data) return errNotFound("Progresso");
  return ok(data);
}

/** DELETE /api/progress/:slug — reset progress for one episode. */
export async function DELETE(req: NextRequest, { params }: Params) {
  const ctx = await requireUser(req, RATE_LIMITS.write);
  if (ctx instanceof NextResponse) return ctx;

  const { error } = await ctx.supabase
    .from("user_progress")
    .delete()
    .eq("episode_slug", params.slug);

  if (error) return errServer(error.message);
  return ok({ deleted: true });
}
