import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ok, errServer } from "@/lib/api/response";
import { requireUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";
import { readJson } from "@/lib/api/validate";
import { downloadSchema } from "@/lib/api/schemas";

export const dynamic = "force-dynamic";

/** POST /api/downloads — register a download event. Returns 200 even on misconfig. */
export async function POST(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.write);
  if (ctx instanceof NextResponse) return ctx;

  const body = await readJson(req, downloadSchema);
  if (body instanceof NextResponse) return body;

  const { error } = await ctx.supabase.from("downloads").insert({
    user_id: ctx.user.id,
    resource: body.resource,
    format: body.format,
    user_agent: req.headers.get("user-agent")?.slice(0, 200) ?? null,
  });

  if (error) return errServer(error.message);
  return ok({ logged: true });
}
