"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useProgress } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";

const opcoes = [
  "Mandar mensagem a alguém de quem sinto falta",
  "Combinar um café offline com 1 pessoa",
  "Telefonar (sim, ligar) durante 5 minutos a alguém",
  "Sentar-me 15 min num café/jardim sem telemóvel",
  "Ir ao supermercado sem fones",
  "Dizer à pessoa em casa: ‘como te sentiste hoje?’",
  "Escrever uma carta/postal à mão",
];

export function ExerciseSocialChallenge({ episodeSlug, exerciseId }: { episodeSlug: string; exerciseId: string }) {
  const stored = useProgress((s) => s.episodes[episodeSlug]?.exercises?.[exerciseId]) as string | undefined;
  const save = useProgress((s) => s.saveExercise);
  const [chosen, setChosen] = useState(stored ?? "");

  useEffect(() => {
    const t = setTimeout(() => {
      save(episodeSlug, exerciseId, chosen);
      remote.exercise({ episodeSlug, exerciseId, payload: chosen });
    }, 300);
    return () => clearTimeout(t);
  }, [chosen, save, episodeSlug, exerciseId]);

  return (
    <Card>
      <p className="text-sm text-muted">Exercício social</p>
      <h3 className="font-serif text-2xl mt-1">Um pequeno gesto humano</h3>
      <p className="prose-soft mt-2 text-sm">
        Escolhe <strong>um</strong> gesto para fazer ainda esta semana. Pequeno é melhor do
        que ambicioso. O isolamento corrói-se em microcontactos, não em projectos.
      </p>
      <div className="mt-5 grid gap-2">
        {opcoes.map((o) => (
          <label
            key={o}
            className={
              "flex items-center gap-3 hairline rounded-xl px-4 py-3 cursor-pointer transition " +
              (chosen === o ? "bg-accent/15 ring-1 ring-accent" : "hover:bg-ink/5")
            }
          >
            <input
              type="radio" name="social" value={o} checked={chosen === o}
              onChange={() => setChosen(o)} className="accent-accent"
            />
            {o}
          </label>
        ))}
      </div>
    </Card>
  );
}
