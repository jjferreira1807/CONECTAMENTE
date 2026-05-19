"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Lock, AlertTriangle, Check } from "lucide-react";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("As palavras-passe não coincidem."); return; }
    if (password.length < 8) { setError("Mínimo 8 caracteres."); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error?.message ?? "Erro");
      setDone(true);
      setTimeout(() => { window.location.href = "/dashboard"; }, 400);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field icon={<Lock className="h-4 w-4" />} label="Nova palavra-passe">
          <input
            type="password" required minLength={8}
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent outline-none text-[15px]"
            placeholder="mínimo 8 caracteres"
          />
        </Field>
        <Field icon={<Lock className="h-4 w-4" />} label="Confirma">
          <input
            type="password" required minLength={8}
            value={confirm} onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-transparent outline-none text-[15px]"
            placeholder="repete"
          />
        </Field>

        {error && (
          <p className="flex items-start gap-2 text-sm text-danger">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
          </p>
        )}
        {done && (
          <p className="flex items-start gap-2 text-sm text-success">
            <Check className="h-4 w-4 mt-0.5 shrink-0" /> Atualizado. A redireccionar…
          </p>
        )}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "A guardar…" : "Definir palavra-passe"}
        </Button>
      </form>
    </Card>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
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
