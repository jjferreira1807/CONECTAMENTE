"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useProgress } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";

/**
 * Escada de valores — reconectar acções digitais com o que importa.
 * Inspirado em ACT (Hayes): se o telemóvel é a "ferramenta", qual é o valor?
 */
const valoresPropostos = [
  "Família próxima", "Amizades verdadeiras", "Saúde física", "Aprendizagem",
  "Criatividade", "Trabalho com sentido", "Tempo na natureza", "Espiritualidade",
  "Descanso", "Amor romântico",
];

type Data = { topo: string[]; acoes: string };

export function ExerciseValuesLadder({ episodeSlug, exerciseId }: { episodeSlug: string; exerciseId: string }) {
  const stored = useProgress((s) => s.episodes[episodeSlug]?.exercises?.[exerciseId]) as Data | undefined;
  const save = useProgress((s) => s.saveExercise);
  const [topo, setTopo] = useState<string[]>(stored?.topo ?? []);
  const [acoes, setAcoes] = useState(stored?.acoes ?? "");

  useEffect(() => {
    const t = setTimeout(() => {
      const payload = { topo, acoes };
      save(episodeSlug, exerciseId, payload);
      remote.exercise({ episodeSlug, exerciseId, payload });
    }, 400);
    return () => clearTimeout(t);
  }, [topo, acoes, save, episodeSlug, exerciseId]);

  const toggle = (v: string) => {
    setTopo((cur) =>
      cur.includes(v) ? cur.filter((x) => x !== v) : cur.length >= 3 ? cur : [...cur, v]
    );
  };

  return (
    <Card>
      <p className="text-sm text-muted">Exercício</p>
      <h3 className="font-serif text-2xl mt-1">O que está debaixo do scroll?</h3>
      <p className="prose-soft mt-2 text-sm">
        Escolhe até 3 valores que mais te importam <em>nesta fase da vida</em>. Não os
        ideais — os teus. Depois, repara: que percentagem do teu tempo digital
        contribui para os servir?
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {valoresPropostos.map((v) => {
          const sel = topo.includes(v);
          return (
            <button
              key={v}
              onClick={() => toggle(v)}
              className={
                "rounded-full px-3.5 py-1.5 text-sm transition " +
                (sel ? "bg-accent text-bg" : "bg-ink/5 hover:bg-ink/10")
              }
            >
              {v}
            </button>
          );
        })}
      </div>

      <label className="block mt-6">
        <span className="text-xs uppercase tracking-wider text-muted">
          Em que pequena acção concreta podes traduzir um destes valores ainda esta semana?
        </span>
        <textarea
          rows={3}
          value={acoes}
          onChange={(e) => setAcoes(e.target.value)}
          placeholder="Ex.: jantar sem telemóvel à mesa, terças-feiras."
          className="mt-1.5 w-full bg-bg/40 hairline rounded-xl p-3 outline-none focus:border-accent resize-none"
        />
      </label>
    </Card>
  );
}
