/**
 * OAuth callback — server-side code exchange (padrão oficial Supabase).
 *
 * O PKCE flow precisa que o code_verifier (guardado em cookie no momento do
 * signInWithOAuth) seja lido durante o exchange. Quando isto é feito
 * client-side via document.cookie, há problemas conhecidos em produção
 * (Vercel + @supabase/ssr) — daí o `pkce_code_verifier_not_found`.
 *
 * Server-side com `cookies()` do next/headers gere os cookies via API
 * determinística do Next, evitando todos os edge-cases de SameSite/path
 * que aparecem no browser depois do redirect chain Google → Supabase →
 * volta a nós.
 *
 * Trade-off: NextResponse.redirect é uma navegação completa em vez de
 * SPA. Numa transição de auth única é aceitável.
 */
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

function safeNext(raw: string | null, origin: string): string {
  if (!raw) return `${origin}/auto-reflexao`;
  // Bloquear open-redirect attacks: apenas paths relativos do nosso domínio.
  if (!raw.startsWith("/") || raw.startsWith("//")) return `${origin}/auto-reflexao`;
  return `${origin}${raw}`;
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"), origin);
  const type = searchParams.get("type");

  if (!code) {
    return NextResponse.redirect(`${origin}/entrar?error=missing_code`);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.redirect(`${origin}/entrar?error=misconfigured`);
  }

  const cookieStore = cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) => {
        cookieStore.set({ name, value, ...options });
      },
      remove: (name: string, options: CookieOptions) => {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      `${origin}/entrar?error=${encodeURIComponent(error.code ?? "unknown")}`
    );
  }

  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/auth/reset-password`);
  }

  return NextResponse.redirect(next);
}
