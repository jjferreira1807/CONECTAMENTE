"use client";
/**
 * UserChip — avatar + nome/email do utilizador autenticado, com dropdown
 * mínimo para Dashboard e Sair.
 *
 * Lê tudo do `auth.users` do Supabase (session.user). NUNCA escreve este
 * conteúdo na nossa schema — o nome/avatar vêm directos da sessão do
 * Supabase para o cliente, em conformidade com o "no profiles table"
 * estabelecido em 20260511000100_drop_profiles.sql.
 *
 * Subscreve a `onAuthStateChange` para reagir a logout/expiração sem reload.
 * Quando não há sessão, renderiza `null` — o SiteHeader cai no fallback
 * "Entrar" button já existente.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { resetProgressStore } from "@/lib/store";
import { cn } from "@/lib/cn";

export interface SessionUser {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
}

function userFromSupabase(u: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
} | null): SessionUser | null {
  if (!u) return null;
  const meta = u.user_metadata ?? {};
  const name =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    null;
  const avatar =
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    (typeof meta.picture === "string" && meta.picture) ||
    null;
  return { id: u.id, email: u.email ?? null, name, avatar };
}

/**
 * Tiny shared hook so SiteHeader can decide whether to show "Entrar" or
 * the UserChip without duplicating the auth.onAuthStateChange wiring.
 * Returns `{ user, ready }` — `ready` is true once we've done at least one
 * getUser() round-trip, so the header can avoid flicker between unauth and
 * auth state on first paint.
 */
export function useSupabaseUser(): { user: SessionUser | null; ready: boolean } {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setReady(true);
      return;
    }
    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setUser(userFromSupabase(data.user));
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(userFromSupabase(session?.user ?? null));
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, ready };
}

/**
 * Normaliza URLs de avatar do Google. Strip do sufixo de tamanho que a
 * Supabase às vezes guarda em formato problemático (`=s96-c`, `=s400-c`)
 * e força `=s96-c` que costuma estar sempre disponível na CDN do Google.
 */
function normalizeAvatarUrl(url: string | null): string | null {
  if (!url) return null;
  if (!/googleusercontent\.com/.test(url)) return url;
  return url.replace(/=s\d+(-c)?$/, "") + "=s96-c";
}

export function UserChip({ className }: { className?: string }) {
  const { user } = useSupabaseUser();
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function signOut() {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setOpen(false);
    await supabase.auth.signOut();
    // Limpar a store local para que a próxima sessão (anónima ou outra
    // conta) no mesmo tab arranque com estado vazio. Sem isto, o snapshot
    // da conta anterior ficaria visível até refrescar o tab.
    resetProgressStore();
    router.replace("/");
  }

  if (!user) return null;

  const display = user.name ?? user.email ?? "Conta";
  const initials =
    (user.name ?? user.email ?? "?")
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full hairline bg-surface/80 pl-1 pr-2.5 h-10 hover:bg-ink/5 transition-colors"
      >
        {user.avatar && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={normalizeAvatarUrl(user.avatar) ?? user.avatar}
            alt=""
            width={28}
            height={28}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent text-[11px] font-medium">
            {initials}
          </span>
        )}
        <span className="text-sm text-ink max-w-[140px] truncate hidden md:inline">
          {display}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-2xl glass-strong shadow-cinematic p-1.5 text-sm"
        >
          <div className="px-3 py-2 border-b border-border/60">
            <p className="text-ink truncate">{display}</p>
            {user.email && user.email !== display && (
              <p className="text-xs text-muted truncate mt-0.5">{user.email}</p>
            )}
          </div>
          <Link
            href="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-ink/5 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 text-muted" />
            <span>Dashboard</span>
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-ink/5 transition-colors text-left"
          >
            <LogOut className="h-4 w-4 text-muted" />
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  );
}
