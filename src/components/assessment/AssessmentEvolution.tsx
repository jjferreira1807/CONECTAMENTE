"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass, RefreshCcw, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useProgress } from "@/lib/store";
import type { AssessmentSnapshot } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import {
  ASSESSMENT_MAX_SCORE,
  ASSESSMENT_BANDS,
  scoreToBand,
  computeScore,
} from "@/content/assessment";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";

// Always recompute the score from raw answers, so snapshots taken under an
// older scoring model display correctly under the current model. `score` in
// storage is treated as a cache; `answers` is authoritative.
function effectiveScore(s: AssessmentSnapshot): number {
  return computeScore(s.answers);
}

/**
 * Auto-reflexão · vista de evolução para a página /estatisticas.
 *
 * Três estados:
 *   • Sem baseline   → convite suave para começar pela auto-reflexão.
 *   • Só baseline    → mostra a leitura inicial + sugestão de refazer.
 *   • Baseline + ≥1  → comparação pré × pós com delta numérico e zonas
 *                       das bandas visualizadas numa linha contínua.
 *
 * Reutiliza o vocabulário visual existente: card, gradient teal→amber,
 * tabular-nums, mesma curva cinematic. Hidratação tratada antes do render.
 */

const CINEMATIC = [0.22, 1, 0.36, 1] as const;

export function AssessmentEvolution() {
  const baseline  = useProgress((s) => s.baselineAssessment());
  const latest    = useProgress((s) => s.latestAssessment());
  const hydrated  = useProgress((s) => s.hydrated);

  if (!hydrated) return null;

  if (!baseline) return <EmptyState />;

  const hasFollowup = latest && latest.takenAt !== baseline.takenAt;

  if (!hasFollowup) return <BaselineOnly />;

  return <Comparison />;
}

/* ─── Empty: no assessment yet ──────────────────────────────────── */

function EmptyState() {
  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          background:
            "radial-gradient(70% 100% at 100% 0%, rgb(var(--accent-2) / 0.14), transparent 60%)",
        }}
      />
      <div className="relative md:flex md:items-center md:gap-8">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.25em] text-accent inline-flex items-center gap-1.5">
            <Compass className="h-3 w-3" /> Auto-reflexão
          </p>
          <h3 className="font-serif text-2xl mt-2">
            Começa por reparar onde estás.
          </h3>
          <p className="prose-soft text-sm mt-3 max-w-xl">
            Oito perguntas curtas dão-te um ponto de partida — útil para
            comparares mais tarde, quando refizeres o quiz depois de alguns
            episódios.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:shrink-0">
          <Link
            href="/auto-reflexao"
            className="group inline-flex items-center gap-2 rounded-full bg-ink text-bg px-5 h-11 text-sm font-medium hover:bg-ink/90 transition-colors"
          >
            Fazer auto-reflexão
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

/* ─── Baseline only: invite a follow-up ─────────────────────────── */

function BaselineOnly() {
  const baseline = useProgress((s) => s.baselineAssessment())!;
  const score = effectiveScore(baseline);
  const animatedScore = useAnimatedNumber(score, { duration: 900 });
  const band = scoreToBand(score);
  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          background:
            "radial-gradient(60% 80% at 0% 0%, rgb(var(--accent) / 0.10), transparent 60%)",
        }}
      />
      <div className="relative flex flex-wrap items-start gap-6 md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent inline-flex items-center gap-1.5">
            <Compass className="h-3 w-3" /> Auto-reflexão · ponto de partida
          </p>
          <div className="mt-3 flex items-baseline gap-2.5">
            <p className="font-serif text-5xl md:text-6xl tabular-nums tracking-tight">
              {animatedScore}
            </p>
            <p className="text-muted">de <span className="tabular-nums">{ASSESSMENT_MAX_SCORE}</span></p>
          </div>
          <p className="font-serif text-xl mt-1">{band.label}</p>
          <p className="text-xs text-muted mt-2 tabular-nums">
            Feito em {fmtDate(baseline.takenAt)}
          </p>
        </div>

        <Link
          href="/auto-reflexao"
          className="group inline-flex items-center gap-2 rounded-full hairline bg-bg/60 px-4 h-10 text-sm hover:bg-bg/90 transition-colors"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Refazer
        </Link>
      </div>

      <BandStrip score={score} />

      <p className="prose-soft text-sm mt-5 max-w-2xl">
        Quando voltares depois de algumas semanas no programa, refaz a auto-reflexão.
        A diferença entre as duas leituras conta-te muito sobre o que mudou.
      </p>
    </Card>
  );
}

/* ─── Baseline + follow-up: comparison ──────────────────────────── */

function Comparison() {
  const baseline = useProgress((s) => s.baselineAssessment())!;
  const latest   = useProgress((s) => s.latestAssessment())!;
  const baseScore   = effectiveScore(baseline);
  const latestScore = effectiveScore(latest);
  const baseBand   = scoreToBand(baseScore);
  const latestBand = scoreToBand(latestScore);

  const delta = latestScore - baseScore;
  const deltaAbs = Math.abs(delta);

  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          background:
            "radial-gradient(70% 90% at 50% 0%, rgb(var(--accent) / 0.10), transparent 60%)",
        }}
      />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.25em] text-accent inline-flex items-center gap-1.5">
          <Compass className="h-3 w-3" /> Auto-reflexão · evolução
        </p>
        <h3 className="font-serif text-2xl mt-2">
          Como mudou a tua relação com o digital
        </h3>

        <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <SnapshotBlock
            label="Início"
            score={baseScore}
            band={baseBand.label}
            takenAt={baseline.takenAt}
          />

          <DeltaPill delta={delta} deltaAbs={deltaAbs} />

          <SnapshotBlock
            label="Agora"
            score={latestScore}
            band={latestBand.label}
            takenAt={latest.takenAt}
            highlight
          />
        </div>

        <BandStrip score={latestScore} baselineScore={baseScore} />

        <p className="prose-soft text-sm mt-5 max-w-2xl">
          {comparisonNarrative(baseScore, latestScore)}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/auto-reflexao"
            className="group inline-flex items-center gap-2 rounded-full hairline bg-bg/60 px-4 h-10 text-sm hover:bg-bg/90 transition-colors"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Refazer mais uma vez
          </Link>
        </div>
      </div>
    </Card>
  );
}

function SnapshotBlock({
  label,
  score,
  band,
  takenAt,
  highlight,
}: {
  label: string;
  score: number;
  band: string;
  takenAt: string;
  highlight?: boolean;
}) {
  // Count-up suave para o número do snapshot. O "Agora" anima ligeiramente
  // mais depressa que o "Início" para o utilizador sentir que o destino é o
  // valor actual; o início chega primeiro à sua posição estática.
  const animatedScore = useAnimatedNumber(score, { duration: highlight ? 1100 : 800 });
  return (
    <div
      className={
        "rounded-2xl px-4 py-4 " +
        (highlight ? "bg-accent/8 ring-1 ring-accent/20" : "bg-bg/60 hairline")
      }
    >
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="font-serif text-4xl md:text-5xl tabular-nums tracking-tight">
          {animatedScore}
        </p>
        <p className="text-xs text-muted tabular-nums">/ {ASSESSMENT_MAX_SCORE}</p>
      </div>
      <p className="font-serif text-base mt-1">{band}</p>
      <p className="text-xs text-muted mt-2 tabular-nums">{fmtDate(takenAt)}</p>
    </div>
  );
}

function DeltaPill({ delta, deltaAbs }: { delta: number; deltaAbs: number }) {
  // Anima a diferença absoluta também, alinhada com os snapshots.
  const animatedDelta = useAnimatedNumber(deltaAbs, { duration: 1100 });
  // Lower score = improvement. Higher score = worsening.
  const tone =
    delta < 0 ? "text-accent" : delta > 0 ? "text-warn" : "text-muted";
  const Icon =
    delta < 0 ? TrendingDown : delta > 0 ? TrendingUp : Minus;
  const label =
    delta < 0 ? "menos" : delta > 0 ? "mais" : "igual";
  return (
    <div className="hidden md:flex flex-col items-center justify-center py-2">
      <span className={`inline-flex items-center gap-1.5 text-sm font-medium tabular-nums ${tone}`}>
        <Icon className="h-4 w-4" />
        {deltaAbs > 0 ? `${animatedDelta} ${label}` : "igual"}
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-subtle mt-1">
        pontos
      </span>
    </div>
  );
}

/* Linear strip showing all four bands + markers for baseline and latest. */
function BandStrip({
  score,
  baselineScore,
}: {
  score: number;
  baselineScore?: number;
}) {
  return (
    <div className="mt-7">
      <div className="relative h-2 rounded-full overflow-hidden hairline bg-bg/60">
        {ASSESSMENT_BANDS.map((b, i) => {
          const width = ((b.range[1] - b.range[0] + 1) / (ASSESSMENT_MAX_SCORE + 1)) * 100;
          const left  = (b.range[0] / (ASSESSMENT_MAX_SCORE + 1)) * 100;
          const intensity = [0.18, 0.32, 0.48, 0.65][i] ?? 0.4;
          return (
            <div
              key={b.id}
              className="absolute inset-y-0"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                background:
                  i < 2
                    ? `rgb(var(--accent) / ${intensity})`
                    : `rgb(var(--accent-2) / ${intensity})`,
              }}
            />
          );
        })}

        {baselineScore !== undefined && (
          <Marker
            x={baselineScore / ASSESSMENT_MAX_SCORE}
            color="rgb(var(--muted))"
            label="início"
          />
        )}
        <Marker
          x={score / ASSESSMENT_MAX_SCORE}
          color="rgb(var(--ink))"
          label="agora"
        />
      </div>

      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-subtle">
        {ASSESSMENT_BANDS.map((b) => (
          <span key={b.id} className="hidden md:inline">
            {b.kicker}
          </span>
        ))}
      </div>
    </div>
  );
}

function Marker({ x, color, label }: { x: number; color: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: CINEMATIC }}
      className="absolute -top-1.5 -bottom-1.5"
      style={{ left: `calc(${x * 100}% - 1px)`, width: 2 }}
      aria-label={label}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
    </motion.div>
  );
}

/* ─── helpers ───────────────────────────────────────────────────── */

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function comparisonNarrative(base: number, latest: number) {
  // Thresholds tuned for the 0-8 "alert areas" score. A drop of 3+ areas is
  // a clear improvement; 1-2 is a meaningful nudge; 0 = stable.
  const d = latest - base;
  if (d <= -3) {
    return "Há uma mudança clara na direção do equilíbrio. O que estás a praticar está a fazer diferença — vale a pena manter o ritmo, sem pressas.";
  }
  if (d <= -1) {
    return "Há um movimento na direção certa. Os ajustes pequenos contam — repara no que tem funcionado para ti e protege esses gestos.";
  }
  if (d >= 3) {
    return "A leitura desta vez subiu de forma notória. Pode ser uma fase difícil, não um retrocesso definitivo. Volta aos primeiros episódios sem culpa — eles são desenhados para estes momentos.";
  }
  if (d >= 1) {
    return "A leitura subiu um pouco. Sem alarmismo — pode reflectir uma semana mais agitada. Vale a pena olhar para o que mudou no contexto.";
  }
  return "As leituras estão próximas. Estabilidade é informação útil — diz-nos que o padrão actual é o teu ponto de equilíbrio actual. O que quiseres mover daqui é uma escolha consciente.";
}
