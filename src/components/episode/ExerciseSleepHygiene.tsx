"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useProgress } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";

const items = [
  "Tirar telemóvel do quarto a partir das 22h",
  "Suspender ecrãs 60 min antes de dormir",
  "Hora de deitar consistente (±30 min)",
  "Quarto fresco e escuro (cortinas blackout)",
  "Sem cafeína depois das 16h",
  "Banho morno ou alongamentos antes de dormir",
  "Sem álcool nas 3h anteriores",
  "Deixar o pensamento numa folha junto da cama",
];

export function ExerciseSleepHygiene({ episodeSlug, exerciseId }: { episodeSlug: string; exerciseId: string }) {
  const stored = useProgress((s) => s.episodes[episodeSlug]?.exercises?.[exerciseId]) as string[] | undefined;
  const save = useProgress((s) => s.saveExercise);
  const [picked, setPicked] = useState<string[]>(stored ?? []);

  useEffect(() => {
    const t = setTimeout(() => {
      save(episodeSlug, exerciseId, picked);
      remote.exercise({ episodeSlug, exerciseId, payload: picked });
    }, 300);
    return () => clearTimeout(t);
  }, [picked, save, episodeSlug, exerciseId]);

  const toggle = (i: string) =>
    setPicked((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));

  return (
    <Card>
      <p className="text-sm text-muted">Exercício</p>
      <h3 className="font-serif text-2xl mt-1">Compromissos de sono</h3>
      <p className="prose-soft mt-2 text-sm">
        Escolhe 2 ou 3 mudanças realistas para experimentares esta semana. Não tudo —
        só o que consegues manter <strong>7 dias seguidos</strong> sem te castigares.
      </p>
      <ul className="mt-5 space-y-2">
        {items.map((i) => {
          const sel = picked.includes(i);
          return (
            <li key={i}>
              <label className="flex items-center gap-3 hairline rounded-xl px-4 py-3 cursor-pointer hover:bg-ink/5">
                <input
                  type="checkbox" checked={sel} onChange={() => toggle(i)}
                  className="h-4 w-4 accent-accent"
                />
                <span className={sel ? "" : "text-muted"}>{i}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
