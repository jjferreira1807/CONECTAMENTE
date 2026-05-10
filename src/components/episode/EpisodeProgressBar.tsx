"use client";
import { useProgress } from "@/lib/store";

export function EpisodeProgressBar({ slug, totalSections }: { slug: string; totalSections: number }) {
  const done = useProgress((s) => s.episodes[slug]?.sectionsDone?.length ?? 0);
  const pct = totalSections > 0 ? Math.min(1, done / totalSections) : 0;
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-accent transition-[width] duration-700 ease-out"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted tabular-nums">{Math.round(pct * 100)}%</span>
    </div>
  );
}
