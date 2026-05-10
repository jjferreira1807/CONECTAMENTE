import type { NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ok, errMisconfigured, errNotFound, errServer } from "@/lib/api/response";

export const dynamic = "force-dynamic";

interface Params { params: { slug: string } }

/**
 * GET /api/episodes/:slug — episode + ordered sections (public).
 */
export async function GET(_req: NextRequest, { params }: Params) {
  const supabase = getSupabaseServer();

  if (!supabase) {
    const { getEpisode } = await import("@/content/episodes");
    const ep = getEpisode(params.slug);
    if (!ep) return errNotFound("Episódio");
    return ok(ep, { headers: cacheHeaders() });
  }

  const { data: ep, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .maybeSingle();
  if (error) return errServer(error.message);
  if (!ep) return errNotFound("Episódio");

  const { data: sections, error: secErr } = await supabase
    .from("sections")
    .select("external_id, position, kind, title, payload")
    .eq("episode_id", ep.id)
    .order("position", { ascending: true });
  if (secErr) return errServer(secErr.message);

  return ok({ ...ep, sections: sections ?? [] }, { headers: cacheHeaders() });
}

function cacheHeaders() {
  return {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
  } as Record<string, string>;
}
