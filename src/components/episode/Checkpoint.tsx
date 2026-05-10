"use client";
import { useProgress } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  episodeSlug: string;
  sectionId: string;
  label: string;
}

export function Checkpoint({ episodeSlug, sectionId, label }: Props) {
  const done = useProgress((s) => s.episodes[episodeSlug]?.sectionsDone?.includes(sectionId));
  const mark = useProgress((s) => s.markSection);
  return (
    <button
      type="button"
      onClick={() => {
        mark(episodeSlug, sectionId);
        remote.progress({ episodeSlug, sectionsDone: [sectionId] });
        remote.analytics({ kind: "section_complete", episodeSlug, sectionId });
      }}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full px-4 h-11 text-sm transition",
        done
          ? "bg-success/15 text-success"
          : "bg-ink/5 text-ink hover:bg-ink/10"
      )}
    >
      <span
        className={cn(
          "h-5 w-5 rounded-full inline-flex items-center justify-center",
          done ? "bg-success text-bg" : "hairline"
        )}
      >
        {done && <Check className="h-3 w-3" />}
      </span>
      {done ? "Concluído" : label}
    </button>
  );
}
