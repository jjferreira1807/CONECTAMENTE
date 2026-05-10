import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ok, errServer } from "@/lib/api/response";
import { requireUser } from "@/lib/api/session";
import { RATE_LIMITS } from "@/lib/api/rateLimit";
import { readJson, readSearchParams } from "@/lib/api/validate";
import { notificationCreateSchema } from "@/lib/api/schemas";
import { z } from "zod";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  unread: z.enum(["1", "true"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.read);
  if (ctx instanceof NextResponse) return ctx;

  const q = readSearchParams(req, querySchema);
  if (q instanceof NextResponse) return q;

  let qb = ctx.supabase
    .from("notifications")
    .select("id, kind, title, body, href, read_at, delivered_at, created_at")
    .order("created_at", { ascending: false })
    .limit(q.limit);

  if (q.unread) qb = qb.is("read_at", null);

  const { data, error } = await qb;
  if (error) return errServer(error.message);
  return ok(data ?? []);
}

/**
 * POST creates a notification for the authenticated user (self-only).
 * For server-to-user pushes, use the service role client (admin.ts).
 */
export async function POST(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.write);
  if (ctx instanceof NextResponse) return ctx;

  const body = await readJson(req, notificationCreateSchema);
  if (body instanceof NextResponse) return body;

  const { data, error } = await ctx.supabase
    .from("notifications")
    .insert({
      user_id: ctx.user.id,
      kind: body.kind,
      title: body.title,
      body: body.body ?? null,
      href: body.href ?? null,
    })
    .select()
    .single();

  if (error) return errServer(error.message);
  return ok(data);
}

/** PATCH /api/notifications — mark as read by id. */
export async function PATCH(req: NextRequest) {
  const ctx = await requireUser(req, RATE_LIMITS.write);
  if (ctx instanceof NextResponse) return ctx;

  const body = await readJson(req, z.object({
    id: z.string().uuid(),
    read: z.boolean().default(true),
  }));
  if (body instanceof NextResponse) return body;

  const { error } = await ctx.supabase
    .from("notifications")
    .update({ read_at: body.read ? new Date().toISOString() : null })
    .eq("id", body.id);

  if (error) return errServer(error.message);
  return ok({ updated: true });
}
