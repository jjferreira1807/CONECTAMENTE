"use client";
import Link from "next/link";
import { episodes } from "@/content/episodes";
import { useProgress } from "@/lib/store";
import { Check, Play } from "lucide-react";
import { cn } from "@/lib/cn";

export function EpisodeRoadmap() {
  const eps = useProgress((s) => s.episodes);
  return (
    <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {episodes.map((ep) => {
        const p = eps[ep.slug];
        const done = !!p?.completedAt;
        const started = !!p && (p.sectionsDone.length > 0 || p.minutesEngaged > 0);
        return (
          <li key={ep.slug}>
            <Link
              href={`/programa/${ep.slug}`}
              className={cn(
                "block hairline rounded-2xl p-4 transition-all hover:bg-ink/5",
                done && "bg-success/8"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs",
                    done
                      ? "bg-success text-bg"
                      : started
                        ? "bg-accent text-bg"
                        : "bg-ink/5 text-muted"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : started ? <Play className="h-3.5 w-3.5" /> : ep.number}
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted truncate">{ep.kicker}</p>
                  <p className="font-medium text-sm leading-snug mt-0.5">{ep.title}</p>
                  <p className="text-xs text-muted mt-1">
                    {done ? "Concluído" : started ? "Em curso" : "Por começar"} · {ep.durationMin} min
                  </p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
