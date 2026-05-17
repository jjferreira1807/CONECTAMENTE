"use client";
/**
 * OAuth callback — client-side code exchange.
 *
 * The previous implementation was a server route handler that exchanged the
 * code via cookies and returned `NextResponse.redirect(/dashboard)`. That
 * counts as a full-page navigation, which unmounts the entire React tree
 * (cutscene, AppReady, theme, Zustand state, atmosphere, everything) and
 * re-hydrates from scratch — the "hard refresh" feel.
 *
 * Doing the exchange in the browser keeps us inside the SPA: `router.replace`
 * is a soft navigation, the layout (and therefore the cutscene component,
 * AppReady provider, etc.) stays mounted, and the dashboard fades in via
 * PageTransition. The session cookies that @supabase/ssr writes during the
 * exchange are picked up by subsequent server requests transparently.
 */
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";

function safeNext(raw: string | null): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

// useSearchParams forces client-side bailout; wrap in Suspense so the page
// can be statically rendered as a shell (Next 14 requirement).
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackShell label="A entrar…" />}>
      <CallbackInner />
    </Suspense>
  );
}

function CallbackShell({ label }: { label: string }) {
  // Visualmente vazio para o utilizador não ver um "ecrã intermédio" entre
  // Google e dashboard — o exchange demora ~50-300ms e o PageTransition do
  // dashboard faz crossfade por cima. A Atmosphere global pinta o fundo.
  // `sr-only` + `aria-live` mantêm o anúncio para leitores de ecrã.
  return (
    <div aria-live="polite" className="min-h-[40vh]">
      <span className="sr-only">{label}</span>
    </div>
  );
}

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  // Guard against double-execution (React 18 strict mode dev double-effects,
  // back-button hits, etc.). The Supabase code is single-use; a second
  // exchange returns an error we should ignore.
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const code = params?.get("code") ?? null;
    const next = safeNext(params?.get("next") ?? null);
    const type = params?.get("type"); // e.g. "recovery"

    if (!code) {
      router.replace("/entrar?error=missing_code");
      return;
    }
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      router.replace("/entrar?error=misconfigured");
      return;
    }

    (async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setError(error.message);
        router.replace(`/entrar?error=${encodeURIComponent(error.code ?? "unknown")}`);
        return;
      }
      // Password recovery flow goes to a dedicated form.
      if (type === "recovery") {
        router.replace("/auth/reset-password");
        return;
      }
      router.replace(next);
    })();
  }, [params, router]);

  // Visual is intentionally minimal — the IntroBlocker SSR overlay is already
  // painted by the layout, and the cutscene is configured to skip on /auth/*
  // routes (see IntroCutscene). The user spends ~50–200ms here before being
  // bounced to /dashboard, so a heavy spinner would only flash distractingly.
  return <CallbackShell label={error ?? "A entrar…"} />;
}
