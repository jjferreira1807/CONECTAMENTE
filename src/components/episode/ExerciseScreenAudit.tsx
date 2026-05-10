"use client";
import { useEffect, useState } from "react";
import { useProgress } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";
import { Card } from "@/components/ui/Card";

/**
 * Auditoria de uso digital — utilizador estima horas/dia por categoria.
 * Total visualizado em barra; não é um julgamento, é um espelho.
 */
const cats = [
  { key: "social",   label: "Redes sociais" },
  { key: "video",    label: "Vídeo / streaming" },
  { key: "messaging",label: "Mensagens" },
  { key: "news",     label: "Notícias / scroll" },
  { key: "work",     label: "Trabalho" },
  { key: "other",    label: "Outros" },
] as const;

type Key = typeof cats[number]["key"];
type Data = Record<Key, number>;
const empty: Data = { social: 0, video: 0, messaging: 0, news: 0, work: 0, other: 0 };

export function ExerciseScreenAudit({ episodeSlug, exerciseId }: { episodeSlug: string; exerciseId: string }) {
  const stored = useProgress((s) => s.episodes[episodeSlug]?.exercises?.[exerciseId]) as Data | undefined;
  const save = useProgress((s) => s.saveExercise);
  const [data, setData] = useState<Data>(stored ?? empty);

  useEffect(() => { if (stored) setData(stored); }, [stored]);
  useEffect(() => {
    const t = setTimeout(() => {
      save(episodeSlug, exerciseId, data);
      remote.exercise({ episodeSlug, exerciseId, payload: data });
    }, 400);
    return () => clearTimeout(t);
  }, [data, save, episodeSlug, exerciseId]);

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <p className="text-sm text-muted">Exercício</p>
      <h3 className="font-serif text-2xl mt-1">Mapa do meu dia digital</h3>
      <p className="prose-soft mt-2 text-sm">
        Estima quantas horas, num dia normal, gastas em cada categoria. Não há números
        certos ou errados — só queres ver o teu mapa real.
      </p>

      <div className="mt-5 space-y-4">
        {cats.map((c) => (
          <div key={c.key}>
            <div className="flex justify-between text-sm">
              <span>{c.label}</span>
              <span className="tabular-nums text-muted">{data[c.key].toFixed(1)} h</span>
            </div>
            <input
              type="range" min={0} max={8} step={0.5}
              value={data[c.key]}
              onChange={(e) => setData((d) => ({ ...d, [c.key]: Number(e.target.value) }))}
              className="w-full accent-accent"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 hairline rounded-xl p-4 bg-bg/40">
        <p className="text-xs uppercase tracking-wider text-muted">Total estimado</p>
        <p className="font-serif text-3xl mt-1 tabular-nums">{total.toFixed(1)} h/dia</p>
        <p className="text-sm text-muted mt-2">
          O dia tem 24 horas; em média, dormimos 7–8. Sobram cerca de 16 horas “acordadas”.
          Que percentagem dessas estás a viver através de um ecrã?
        </p>
      </div>
    </Card>
  );
}
