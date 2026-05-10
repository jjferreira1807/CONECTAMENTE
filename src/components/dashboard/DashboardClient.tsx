"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useProgress } from "@/lib/store";
import { episodes } from "@/content/episodes";
import { Card } from "@/components/ui/Card";
import { MoodPicker } from "@/components/episode/MoodPicker";
import { IntentionInput } from "./IntentionInput";
import { EpisodeRoadmap } from "./EpisodeRoadmap";
import { TripleRing, TripleRingLegend } from "./TripleRing";
import { Flame, Headphones, Calendar, Sparkles } from "lucide-react";

/**
 * Apple Health-inspired dashboard.
 *
 * Layout:
 *   ┌─ Greeting + hero ribbon ──────────────────────────────────────┐
 *   ├─ Daily intention            ┃ Progress (triple-ring)          ┤
 *   ├─ Mood check-in              ┃ Streak  ┃ Tempo                 ┤
 *   └─ Roadmap (full width) ─────────────────────────────────────────┘
 */
export function DashboardClient() {
  const eps = useProgress((s) => s.episodes);
  const streak = useProgress((s) => s.streak());
  const checkIns = useProgress((s) => s.checkIns);
  const intentions = useProgress((s) => s.intentions);
  const hydrated = useProgress((s) => s.hydrated);

  const stats = useMemo(() => {
    const completed = Object.values(eps).filter((e) => e.completedAt).length;
    const total = episodes.length;
    const totalMinutes = Math.round(
      Object.values(eps).reduce((acc, e) => acc + e.minutesEngaged, 0)
    );
    // last-7-day mood + intention coverage as a rough "engagement" ratio
    const last7 = new Date();
    last7.setDate(last7.getDate() - 6);
    const last7iso = last7.toISOString().slice(0, 10);
    const moodDays = new Set(checkIns.filter((c) => c.date >= last7iso).map((c) => c.date));
    const intentionDays = new Set(intentions.filter((i) => i.date >= last7iso).map((i) => i.date));
    const engagement = (moodDays.size + intentionDays.size) / 14; // max 14 events in 7 days
    return {
      completed, total,
      programRatio: total ? completed / total : 0,
      streakRatio: Math.min(1, streak / 21),    // 21-day habit benchmark
      engagementRatio: Math.min(1, engagement),
      totalMinutes,
    };
  }, [eps, checkIns, intentions, streak]);

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <>
      <Hero />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 relative overflow-hidden">
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Intenção do dia</p>
          <IntentionInput />
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-accent">Progresso</p>
              <p className="font-serif text-3xl mt-2 tabular-nums">
                {stats.completed}<span className="text-muted text-xl">/{stats.total}</span>
              </p>
              <p className="text-xs text-muted mt-1">episódios concluídos</p>
            </div>
            <TripleRing
              size={120}
              stroke={9}
              gap={3}
              rings={[
                { value: stats.programRatio,    color: "rgb(var(--accent))",   bg: "rgb(var(--border))" },
                { value: stats.streakRatio,     color: "rgb(var(--accent-2))", bg: "rgb(var(--border))" },
                { value: stats.engagementRatio, color: "rgb(var(--glow) / 0.7)", bg: "rgb(var(--border))" },
              ]}
              center={{ value: `${Math.round(stats.programRatio * 100)}%` }}
            />
          </div>
          <div className="mt-5 pt-5 border-t border-border/60">
            <TripleRingLegend
              rings={[
                { label: "Programa",   value: `${Math.round(stats.programRatio * 100)}%`,    color: "rgb(var(--accent))" },
                { label: "Sequência",  value: `${streak}d`,                                   color: "rgb(var(--accent-2))" },
                { label: "Envolvimento (7d)", value: `${Math.round(stats.engagementRatio * 100)}%`, color: "rgb(var(--glow))" },
              ]}
            />
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <MoodPicker />

        <Card>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent2/15 text-accent2 ring-1 ring-accent2/20">
              <Flame className="h-5 w-5" />
            </span>
            <p className="text-xs uppercase tracking-[0.25em] text-muted">Sequência de check-ins</p>
          </div>
          <p className="font-serif text-5xl mt-5 tabular-nums">{streak}</p>
          <p className="text-sm text-muted mt-1">{streak === 1 ? "dia" : "dias"} consecutivos</p>
          <p className="prose-soft text-xs mt-4 max-w-xs">
            Pequenos check-ins diários revelam padrões que de outra forma se diluem na semana.
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/20">
              <Headphones className="h-5 w-5" />
            </span>
            <p className="text-xs uppercase tracking-[0.25em] text-muted">Tempo no programa</p>
          </div>
          <p className="font-serif text-5xl mt-5 tabular-nums">{stats.totalMinutes}</p>
          <p className="text-sm text-muted mt-1">minutos ouvidos</p>
          <p className="prose-soft text-xs mt-4 max-w-xs">
            Mais importante que a quantidade é a regularidade — pouco e seguido, todos os dias.
          </p>
        </Card>
      </div>

      <section className="mt-16">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Roteiro</p>
            <h2 className="heading-display text-2xl md:text-3xl mt-2">A tua jornada</h2>
          </div>
          <p className="text-sm text-muted inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {checkIns.length} {checkIns.length === 1 ? "check-in" : "check-ins"}
          </p>
        </div>
        <EpisodeRoadmap />
      </section>
    </>
  );
}

/* ------------------------------------------------------------------------ */

function Hero() {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-border/60 backdrop-blur-md p-7 md:p-10">
      {/* Ambient layer */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 80% at 0% 0%, rgb(var(--accent) / 0.18), transparent 70%), radial-gradient(50% 70% at 100% 100%, rgb(var(--accent-2) / 0.18), transparent 70%), rgb(var(--surface) / 0.5)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute -top-24 right-[-10%] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--accent) / 0.22), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> {greeting()}
          </p>
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mt-3">
            O que precisas <span className="text-muted">hoje?</span>
          </h1>
        </div>
        <p className="text-sm text-muted tabular-nums">
          {new Date().toLocaleDateString("pt-PT", {
            weekday: "long", day: "numeric", month: "long",
          })}
        </p>
      </div>
    </header>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 19) return "Boa tarde";
  return "Boa noite";
}

/* ------------------------------------------------------------------------ */

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-44 rounded-3xl bg-surface/60 backdrop-blur-md animate-pulse" />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 h-40 rounded-3xl bg-surface/60 backdrop-blur-md animate-pulse" />
        <div className="h-40 rounded-3xl bg-surface/60 backdrop-blur-md animate-pulse" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-44 rounded-3xl bg-surface/60 backdrop-blur-md animate-pulse" />
        ))}
      </div>
    </div>
  );
}
