import type { NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ok, errMisconfigured, errServer } from "@/lib/api/response";
import { rateLimit, rlKey, RATE_LIMITS } from "@/lib/api/rateLimit";
import { clientIp } from "@/lib/api/session";

export const dynamic = "force-dynamic";

/**
 * GET /api/episodes — list all published episodes (public).
 *
 * Cached at the CDN edge for 5 minutes; clients should use stale-while-revalidate.
 * Falls back to the bundled local content if Supabase isn't configured.
 */
export async function GET(req: NextRequest) {
  const ip = clientIp(req);
  if (!rateLimit(rlKey("episodes", ip), RATE_LIMITS.read).allowed) {
    return ok([], { headers: { "Retry-After": "60" } });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    // Local-only mode: read from bundled content.
    const { episodes } = await import("@/content/episodes");
    return ok(
      episodes.map((e) => ({
        slug: e.slug, number: e.number, kicker: e.kicker, title: e.title,
        subtitle: e.subtitle, description: e.description,
        duration_min: e.durationMin, theme_color: e.themeColor,
      })),
      { headers: cacheHeaders() }
    );
  }

  const { data, error } = await supabase
    .from("episodes")
    .select("slug, number, kicker, title, subtitle, description, duration_min, theme_color, position")
    .eq("published", true)
    .order("position", { ascending: true });

  if (error) return errServer(error.message);
  return ok(data ?? [], { headers: cacheHeaders() });
}

function cacheHeaders() {
  return {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
  } as Record<string, string>;
}
