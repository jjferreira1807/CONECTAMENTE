"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getSupabaseBrowser, supabaseConfigured } from "@/lib/supabase/client";
import { Mail, Lock, AlertTriangle, Check } from "lucide-react";
import Link from "next/link";

type Mode = "signin" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null);
    if (!supabaseConfigured) {
      setError(
        "Auth não configurada. Adiciona NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY a .env.local."
      );
      return;
    }
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setInfo("Verifica o teu email para confirmar a conta.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Sanitise the `next` param to block open-redirect attacks: only
        // accept relative paths under our origin.
        const params = new URLSearchParams(window.location.search);
        const raw = params.get("next") ?? "";
        const safe = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
        window.location.href = safe;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    if (!supabaseConfigured) return setError("Auth não configurada.");
    const supabase = getSupabaseBrowser(); if (!supabase) return;
    // Feedback imediato: o botão fica disabled antes do browser navegar para
    // o Google (~100-300ms). Sem isto, o utilizador não tem sinal de que o
    // clique registou. Se a navegação ocorrer, este estado fica "preso" em
    // loading — mas o componente desmonta quando o browser sai do domínio,
    // por isso não há flash de volta ao estado idle.
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      // Login OAuth aterra primeiro no quiz de auto-reflexão (baseline na
      // primeira visita, follow-up nas seguintes) — depois o utilizador
      // segue para o programa/dashboard. Apontar o `next` directamente
      // para /auto-reflexao evita o flicker de passar por /dashboard antes
      // do QuizGate corrigir a rota.
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/auto-reflexao` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function onRecover() {
    setError(null); setInfo(null);
    if (!email) return setError("Indica o teu email primeiro.");
    setLoading(true);
    try {
      const r = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await r.json();
      setInfo("Se a conta existir, vais receber um email.");
    } finally { setLoading(false); }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex rounded-full bg-ink/5 p-1 text-sm">
          <button
            onClick={() => setMode("signin")}
            className={
              "px-3.5 py-1.5 rounded-full transition " +
              (mode === "signin" ? "bg-surface shadow-soft" : "text-muted")
            }
          >
            Entrar
          </button>
          <button
            onClick={() => setMode("signup")}
            className={
              "px-3.5 py-1.5 rounded-full transition " +
              (mode === "signup" ? "bg-surface shadow-soft" : "text-muted")
            }
          >
            Criar conta
          </button>
        </div>
      </div>

      <button
        type="button" onClick={onGoogle}
        disabled={loading}
        aria-busy={loading}
        className="w-full mb-4 inline-flex items-center justify-center gap-2 rounded-full hairline h-11 text-sm font-medium hover:bg-ink/5 disabled:cursor-wait disabled:opacity-70"
      >
        <GoogleIcon /> Continuar com Google
      </button>

      <div className="flex items-center gap-3 my-4 text-xs text-muted">
        <span className="flex-1 h-px bg-border" /> ou <span className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field icon={<Mail className="h-4 w-4" />} label="Email">
          {/* `text-base` (16px) é crítico — iOS Safari faz zoom automático em
              qualquer input < 16px, deslocando o layout e empurrando o teclado
              de forma desconfortável. `inputMode="email"` mostra o teclado
              email-optimised (com @ e .com). */}
          <input
            type="email" required autoComplete="email"
            inputMode="email" enterKeyHint="next"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent outline-none text-base"
            placeholder="o-teu@email.pt"
          />
        </Field>
        <Field icon={<Lock className="h-4 w-4" />} label="Palavra-passe">
          <input
            type="password" required minLength={8}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            enterKeyHint={mode === "signup" ? "done" : "go"}
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent outline-none text-base"
            placeholder="mínimo 8 caracteres"
          />
        </Field>

        {mode === "signin" && (
          <button
            type="button" onClick={onRecover}
            className="text-xs text-muted hover:text-ink underline"
          >
            Esqueceste a palavra-passe?
          </button>
        )}

        {error && (
          <p className="flex items-start gap-2 text-sm text-danger">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
          </p>
        )}
        {info && (
          <p className="flex items-start gap-2 text-sm text-success">
            <Check className="h-4 w-4 mt-0.5 shrink-0" /> {info}
          </p>
        )}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "A processar…" : mode === "signin" ? "Entrar" : "Criar conta"}
        </Button>
      </form>

      <p className="mt-6 text-xs text-muted text-center">
        Preferes não criar conta?{" "}
        <Link href="/dashboard" className="underline hover:text-ink">Continuar localmente</Link>.
        O progresso fica neste dispositivo.
      </p>
    </Card>
  );
}

function Field({
  icon, label, children,
}: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">{label}</span>
      <div className="mt-1.5 flex items-center gap-2.5 hairline rounded-xl bg-bg/40 px-3.5 h-11">
        <span className="text-muted">{icon}</span>
        {children}
      </div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1Z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.56-2.77c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/>
      <path fill="#FBBC05" d="M5.85 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.35-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.67-2.84Z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.13 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38Z"/>
    </svg>
  );
}
