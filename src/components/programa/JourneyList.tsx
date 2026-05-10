"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import type { Episode } from "@/content/episodes";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/cn";

/**
 * Vertical journey of the 12 episodes. A hairline rail runs down the left;
 * each episode anchors to a state node (done / in-progress / upcoming).
 * Cards reveal on viewport entry with stagger.
 *
 * The "in-progress" node also pulses softly so users can see at a glance
 * where they left off.
 */
interface Props { episodes: Episode[] }

export function JourneyList({ episodes }: Props) {
  const ep = useProgress((s) => s.episodes);
  const hydrated = useProgress((s) => s.hydrated);

  return (
    <ol className="relative pl-12 md:pl-16">
      {/* Rail — vertical hairline */}
      <span
        aria-hidden
        className="absolute left-[18px] md:left-[22px] top-3 bottom-3 w-px"
        style={{
          background:
            "linear-gradient(to bottom, rgb(var(--accent) / 0.5) 0%, rgb(var(--border)) 30%, rgb(var(--border)) 70%, rgb(var(--accent-2) / 0.4) 100%)",
        }}
      />

      {episodes.map((e, idx) => {
        const p = ep[e.slug];
        const done = !!p?.completedAt;
        const started =
          !!p && (p.sectionsDone.length > 0 || p.minutesEngaged > 0);
        // first not-completed becomes the "current" focal point
        const current =
          hydrated && !done && started ? "current"
          : null;

        return (
          <motion.li
            key={e.slug}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: Math.min(idx * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-4"
          >
            {/* State node on the rail */}
            <span
              aria-hidden
              className="absolute -left-12 md:-left-16 top-6 inline-flex items-center justify-center w-9 h-9"
            >
              <span
                className={cn(
                  "relative inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-500",
                  done
                    ? "bg-accent text-bg shadow-[0_0_18px_rgb(var(--glow)/0.6)]"
                    : current === "current"
                      ? "bg-accent2/90 text-bg ring-2 ring-accent2/30 animate-slow-pulse"
                      : "bg-surface ring-1 ring-border text-muted"
                )}
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="text-[10px] font-medium tabular-nums">
                    {String(e.number).padStart(2, "0")}
                  </span>
                )}
              </span>
            </span>

            <Link
              href={`/programa/${e.slug}`}
              className={cn(
                "relative block rounded-3xl overflow-hidden border border-border/60 backdrop-blur-md",
                "bg-surface/70 transition-all duration-500 ease-cinematic",
                "hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-glow",
                "group"
              )}
            >
              {/* Per-episode gradient strip */}
              <div
                aria-hidden
                className={"absolute inset-x-0 top-0 h-12 bg-gradient-to-r " + e.themeColor + " opacity-50 pointer-events-none"}
              />

              <div className="relative p-6 md:p-7 flex items-start gap-5 md:gap-7">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                    <span>{e.kicker}</span>
                    <span className="text-subtle">·</span>
                    <span className="tabular-nums">{e.durationMin} min</span>
                    {current === "current" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent2/15 text-accent2 px-2 py-0.5 tracking-normal">
                        <Sparkles className="h-3 w-3" /> em curso
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-xl md:text-2xl mt-2 leading-snug">{e.title}</p>
                  <p className="text-sm text-muted mt-2 max-w-xl">{e.subtitle}</p>
                </div>

                <span
                  aria-hidden
                  className={cn(
                    "shrink-0 mt-1 inline-flex items-center justify-center h-10 w-10 rounded-full transition-all",
                    "bg-ink/5 text-muted",
                    "group-hover:bg-accent group-hover:text-bg group-hover:translate-x-0.5"
                  )}
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.li>
        );
      })}
    </ol>
  );
}
