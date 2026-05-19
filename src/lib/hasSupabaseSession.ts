/**
 * Sync check for a Supabase session — no async round-trip, no flicker.
 *
 * Used by `IntroCutscene` and `QuizGate` to decide *immediately on mount*
 * whether the visitor is already authenticated. `useSupabaseUser` does a
 * `supabase.auth.getUser()` round-trip and only resolves after ~100-200ms;
 * the cutscene/gate decisions need to happen on first render, before any
 * timer chain starts, so we sniff the cookie set by `@supabase/ssr`
 * instead.
 *
 * Cookie name pattern (per @supabase/ssr): `sb-<project-ref>-auth-token`
 * — sometimes chunked as `.0`, `.1` for large payloads.
 *
 * It is OK if the cookie is stale: this only controls onboarding UI
 * (cutscene + quiz redirect). Real auth still happens via Supabase.
 */
export function hasSupabaseSession(): boolean {
  if (typeof document === "undefined") return false;
  try {
    return document.cookie
      .split("; ")
      .some((c) => /^sb-[^=]+-auth-token(\.\d+)?=/.test(c));
  } catch {
    return false;
  }
}
