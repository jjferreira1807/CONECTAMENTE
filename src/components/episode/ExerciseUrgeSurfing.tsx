"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useProgress } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";
import { Wind } from "lucide-react";

/**
 * "Surfar a vontade" (urge surfing) — técnica DBT/TCC de tolerância à urgência.
 * O utilizador classifica a intensidade antes/depois de uma respiração de 90s.
 */
export function ExerciseUrgeSurfing({ episodeSlug, exerciseId }: { episodeSlug: string; exerciseId: string }) {
  const save = useProgress((s) => s.saveExercise);
  const stored = useProgress((s) => s.episodes[episodeSlug]?.exercises?.[exerciseId]) as
    | { before: number; after: number; trigger: string }
    | undefined;

  const [before, setBefore] = useState(stored?.before ?? 5);
  const [after, setAfter] = useState(stored?.after ?? 5);
  const [trigger, setTrigger] = useState(stored?.trigger ?? "");
  const [phase, setPhase] = useState<"before" | "breathing" | "after" | "done">(
    stored ? "done" : "before"
  );
  const [count, setCount] = useState(90);

  useEffect(() => {
    if (phase !== "breathing") return;
    if (count <= 0) { setPhase("after"); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, count]);

  const finish = () => {
    const payload = { before, after, trigger };
    save(episodeSlug, exerciseId, payload);
    remote.exercise({ episodeSlug, exerciseId, payload });
    setPhase("done");
  };

  return (
    <Card>
      <p className="text-sm text-muted">Exercício</p>
      <h3 className="font-serif text-2xl mt-1">Surfar a vontade</h3>
      <p className="prose-soft mt-2 text-sm">
        A vontade de pegar no telemóvel funciona como uma onda: sobe, atinge um pico e desce.
        Em vez de a combater ou de ceder, vamos observá-la.
      </p>

      {phase === "before" && (
        <div className="mt-5 space-y-4">
          <Field label="Que situação ou gatilho estás a sentir agora?">
            <input
              value={trigger} onChange={(e) => setTrigger(e.target.value)}
              placeholder="Ex.: tédio, fila, notificação, conversa difícil…"
              className="w-full bg-bg/40 hairline rounded-xl p-3 outline-none focus:border-accent"
            />
          </Field>
          <Slider label="Intensidade da vontade (0–10)" value={before} onChange={setBefore} />
          <Button onClick={() => { setPhase("breathing"); setCount(90); }} className="mt-2">
            Começar respiração
          </Button>
        </div>
      )}

      {phase === "breathing" && (
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-accent/15 animate-breathe" />
            <Wind className="h-8 w-8 text-accent" />
          </div>
          <p className="mt-4 font-serif text-3xl tabular-nums">{count}s</p>
          <p className="text-sm text-muted mt-1">Inspira 4s · sustém 2s · expira 6s</p>
        </div>
      )}

      {phase === "after" && (
        <div className="mt-5 space-y-4">
          <p className="prose-soft text-sm">E agora, a vontade continua igual?</p>
          <Slider label="Intensidade após respirar (0–10)" value={after} onChange={setAfter} />
          <Button onClick={finish}>Concluir exercício</Button>
        </div>
      )}

      {phase === "done" && (
        <div className="mt-5 grid grid-cols-2 gap-4">
          <Stat label="Antes" value={`${before}/10`} />
          <Stat label="Depois" value={`${after}/10`} />
          <p className="col-span-2 prose-soft text-sm">
            Repara: a vontade não desapareceu, mas tornou-se observável. Cada vez que a surfas,
            estás a treinar o cérebro a tolerar o desconforto sem alimentar o circuito.
          </p>
          <Button variant="subtle" size="sm" onClick={() => setPhase("before")}>Repetir</Button>
        </div>
      )}
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="tabular-nums text-ink">{value}</span>
      </div>
      <input
        type="range" min={0} max={10} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="hairline rounded-xl p-4">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="font-serif text-2xl mt-1">{value}</p>
    </div>
  );
}
