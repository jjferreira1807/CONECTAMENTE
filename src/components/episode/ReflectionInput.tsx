"use client";
import { useEffect, useState } from "react";
import { useProgress } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";
import { Check } from "lucide-react";

interface Props {
  episodeSlug: string;
  promptId: string;
  prompt: string;
  placeholder?: string;
  rows?: number;
}

/**
 * Free-text reflection field with debounced autosave to the progress store.
 * Shows a soft "guardado" indicator. Resilient: never blocks input.
 */
export function ReflectionInput({
  episodeSlug, promptId, prompt, placeholder, rows = 4,
}: Props) {
  const stored = useProgress((s) => s.episodes[episodeSlug]?.reflections?.[promptId] ?? "");
  const save = useProgress((s) => s.saveReflection);
  const [value, setValue] = useState(stored);
  const [saved, setSaved] = useState(false);

  useEffect(() => setValue(stored), [stored]);

  useEffect(() => {
    if (value === stored) return;
    setSaved(false);
    const t = setTimeout(() => {
      save(episodeSlug, promptId, value);
      remote.reflection({ episodeSlug, promptId, answer: value });
      setSaved(true);
    }, 400);
    return () => clearTimeout(t);
  }, [value, stored, save, episodeSlug, promptId]);

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="font-medium text-[15px]">{prompt}</p>
        <span aria-live="polite" className="shrink-0">
          {saved && value && (
            <span className="inline-flex items-center gap-1 text-xs text-success">
              <Check className="h-3.5 w-3.5" /> guardado
            </span>
          )}
        </span>
      </div>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? "Escreve livremente — só tu vês isto."}
        className="mt-3 w-full bg-bg/40 hairline rounded-xl p-3.5 text-[15px] outline-none focus:border-accent resize-none"
      />
    </div>
  );
}
