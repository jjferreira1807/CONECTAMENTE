"use client";
import { useEffect, useState } from "react";
import { useProgress } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";
import { Card } from "@/components/ui/Card";
import { Check } from "lucide-react";

interface Props { episodeSlug: string; exerciseId: string; }

type Record = {
  situation: string;
  thought: string;
  emotion: string;
  evidenceFor: string;
  evidenceAgainst: string;
  alternative: string;
};

const empty: Record = {
  situation: "", thought: "", emotion: "",
  evidenceFor: "", evidenceAgainst: "", alternative: "",
};

/**
 * Registo de pensamentos — exercício clássico de TCC adaptado a uso digital.
 * Autosave em store. Estrutura inspirada em Beck/Greenberger & Padesky.
 */
export function ExerciseThoughtRecord({ episodeSlug, exerciseId }: Props) {
  const stored = useProgress((s) => s.episodes[episodeSlug]?.exercises?.[exerciseId]) as Record | undefined;
  const save = useProgress((s) => s.saveExercise);
  const [data, setData] = useState<Record>(stored ?? empty);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (stored) setData(stored); }, [stored]);
  useEffect(() => {
    setSaved(false);
    const t = setTimeout(() => {
      save(episodeSlug, exerciseId, data);
      remote.exercise({ episodeSlug, exerciseId, payload: data });
      setSaved(true);
    }, 500);
    return () => clearTimeout(t);
  }, [data, save, episodeSlug, exerciseId]);

  const fields: { key: keyof Record; label: string; hint: string }[] = [
    { key: "situation", label: "1. Situação", hint: "Onde, quando, com quem? Quase sempre antes de pegar no telemóvel." },
    { key: "thought",  label: "2. Pensamento automático", hint: "“Tenho de ver agora”, “Vou ficar de fora”, “Preciso de me distrair”." },
    { key: "emotion",  label: "3. Emoção (0–100)", hint: "Ansiedade 70, tédio 50, irritação 40…" },
    { key: "evidenceFor",     label: "4. Evidências a favor", hint: "Factos concretos que sustentam o pensamento." },
    { key: "evidenceAgainst", label: "5. Evidências contra",  hint: "Factos que o contradizem ou matizam." },
    { key: "alternative",     label: "6. Pensamento alternativo equilibrado", hint: "Uma versão mais útil e realista." },
  ];

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">Exercício TCC</p>
          <h3 className="font-serif text-2xl mt-1">Registo de pensamentos</h3>
        </div>
        <span aria-live="polite">
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs text-success">
              <Check className="h-3.5 w-3.5" /> guardado
            </span>
          )}
        </span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="text-xs uppercase tracking-wider text-muted">{f.label}</span>
            <textarea
              rows={f.key === "alternative" ? 4 : 3}
              value={data[f.key]}
              onChange={(e) => setData((d) => ({ ...d, [f.key]: e.target.value }))}
              placeholder={f.hint}
              className="mt-1.5 w-full bg-bg/40 hairline rounded-xl p-3 text-[14px] outline-none focus:border-accent resize-none"
            />
          </label>
        ))}
      </div>
    </Card>
  );
}
