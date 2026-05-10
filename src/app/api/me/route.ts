import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ok, errServer, errNotFound } from "@/lib/api/response";
import { requireUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";
import { readJson } from "@/lib/api/validate";
import { profileUpdateSchema } from "@/lib/api/schemas";

export const dynamic = "force-dynamic";

/** GET /api/me — own profile + auth info. */
export async function GET(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.read);
  if (ctx instanceof NextResponse) return ctx;

  const { data: profile, error } = await ctx.supabase
    .from("profiles")
    .select("*")
    .eq("id", ctx.user.id)
    .maybeSingle();

  if (error) return errServer(error.message);
  if (!profile) return errNotFound("Perfil");

  return ok({
    id: ctx.user.id,
    email: ctx.user.email,
    profile,
  });
}

/** PATCH /api/me — update profile. */
export async function PATCH(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.write);
  if (ctx instanceof NextResponse) return ctx;

  const body = await readJson(req, profileUpdateSchema);
  if (body instanceof NextResponse) return body;

  const { data, error } = await ctx.supabase
    .from("profiles")
    .update(body)
    .eq("id", ctx.user.id)
    .select()
    .single();

  if (error) return errServer(error.message);
  return ok(data);
}
