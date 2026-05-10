"use client";
import { useProgress } from "@/lib/store";
import { episodes } from "@/content/episodes";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/episode/ProgressRing";
import { MoodPicker } from "@/components/episode/MoodPicker";
import { IntentionInput } from "./IntentionInput";
import { EpisodeRoadmap } from "./EpisodeRoadmap";
import { Flame, Headphones, Calendar } from "lucide-react";

export function DashboardClient() {
  const eps = useProgress((s) => s.episodes);
  const streak = useProgress((s) => s.streak());
  const checkIns = useProgress((s) => s.checkIns);
  const hydrated = useProgress((s) => s.hydrated);

  const completed = Object.values(eps).filter((e) => e.completedAt).length;
  const totalMinutes = Math.round(
    Object.values(eps).reduce((acc, e) => acc + e.minutesEngaged, 0)
  );
  const pct = episodes.length > 0 ? completed / episodes.length : 0;

  if (!hydrated) {
    return <div className="h-[60vh]" aria-hidden />;
  }

  return (
    <>
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-muted">{greeting()}</p>
          <h1 className="heading-display text-4xl md:text-5xl mt-2">
            O que precisas <span className="text-accent">hoje?</span>
          </h1>
        </div>
        <div className="text-sm text-muted tabular-nums">
          {new Date().toLocaleDateString("pt-PT", {
            weekday: "long", day: "numeric", month: "long",
          })}
        </div>
      </header>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="text-sm text-muted">Intenção do dia</p>
          <IntentionInput />
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Progresso geral</p>
              <p className="font-serif text-2xl mt-1">{completed}/{episodes.length} episódios</p>
            </div>
            <ProgressRing value={pct} size={84} stroke={6} sublabel="" />
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <MoodPicker />
        <Card>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-warn/15 text-warn">
              <Flame className="h-5 w-5" />
            </span>
            <p className="text-sm text-muted">Sequência de check-ins</p>
          </div>
          <p className="font-serif text-4xl mt-3 tabular-nums">{streak}</p>
          <p className="text-sm text-muted">{streak === 1 ? "dia" : "dias"} consecutivos</p>
          <p className="prose-soft text-xs mt-3">
            Pequenos check-ins diários revelam padrões que de outra forma se diluem na semana.
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Headphones className="h-5 w-5" />
            </span>
            <p className="text-sm text-muted">Tempo no programa</p>
          </div>
          <p className="font-serif text-4xl mt-3 tabular-nums">{totalMinutes}</p>
          <p className="text-sm text-muted">minutos ouvidos</p>
          <p className="prose-soft text-xs mt-3">
            Mais importante que a quantidade é a regularidade — pouco e seguido, todos os dias.
          </p>
        </Card>
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="heading-display text-2xl md:text-3xl">Roteiro</h2>
          <p className="text-sm text-muted inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" /> {checkIns.length} {checkIns.length === 1 ? "check-in" : "check-ins"}
          </p>
        </div>
        <EpisodeRoadmap />
      </section>
    </>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 19) return "Boa tarde";
  return "Boa noite";
}
