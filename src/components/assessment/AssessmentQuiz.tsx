"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, RefreshCcw, Sparkles, Check } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_MAX_SCORE,
  LIKERT_OPTIONS,
  scoreToBand,
  computeScore,
} from "@/content/assessment";
import { useProgress } from "@/lib/store";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";

/**
 * Auto-reflexão · multi-step UI integrada na linguagem visual existente.
 *
 * Três estados:
 *   1. INTRO    — card de boas-vindas, contextualização ética, botão Começar.
 *   2. QUIZ     — uma pergunta por step, 5 botões Likert grandes, progresso.
 *   3. RESULT   — score visual, banda interpretativa, CTA para programa/SOS.
 *
 * Tudo usa a mesma curva cinematic ([0.22, 1, 0.36, 1]), os mesmos cards e
 * botões já existentes no site, e respeita prefers-reduced-motion via o
 * universal `*` rule em globals.css. Resultado guardado no Zustand store.
 */

type Phase = "intro" | "quiz" | "result";

const CINEMATIC = [0.22, 1, 0.36, 1] as const;

export function AssessmentQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<(number | undefined)[]>(
    () => ASSESSMENT_QUESTIONS.map(() => undefined),
  );
  const [stepIndex, setStepIndex] = useState(0);

  const saveAssessment = useProgress((s) => s.saveAssessment);
  // Detecta se já existe baseline: nesse caso esta toma é um pós-teste e a
  // UI deve enquadrar como "comparação", não como "primeira vez".
  const hasBaseline = useProgress((s) => s.baselineAssessment() !== undefined);

  const total = ASSESSMENT_QUESTIONS.length;
  const allAnswered = answers.every((a) => typeof a === "number");
  // Score = count of "alert" answers (frequentemente/quase sempre).
  // See computeScore in @/content/assessment.
  const score = useMemo(
    () => computeScore(answers.map((v) => v ?? 0)),
    [answers],
  );
  const band = useMemo(() => scoreToBand(score), [score]);

  function startQuiz() {
    setPhase("quiz");
    setStepIndex(0);
  }

  function selectAnswer(value: number) {
    const nextAnswers: (number | undefined)[] = [
      ...answers.slice(0, stepIndex),
      value,
      ...answers.slice(stepIndex + 1),
    ];
    setAnswers(nextAnswers);
    if (stepIndex + 1 < total) {
      setStepIndex(stepIndex + 1);
    } else {
      finishQuiz(nextAnswers);
    }
  }

  function finishQuiz(final: (number | undefined)[]) {
    const filled = final.map((v) => v ?? 0);
    const finalScore = computeScore(filled);
    const finalBand = scoreToBand(finalScore);
    saveAssessment({
      takenAt: new Date().toISOString(),
      answers: filled,
      score: finalScore,
      bandId: finalBand.id,
    });
    setPhase("result");
  }

  function restart() {
    setAnswers(ASSESSMENT_QUESTIONS.map(() => undefined));
    setStepIndex(0);
    setPhase("intro");
  }

  function back() {
    if (stepIndex === 0) {
      setPhase("intro");
    } else {
      setStepIndex(stepIndex - 1);
    }
  }

  return (
    <Container className="py-12 md:py-20 max-w-3xl">
      <AnimatePresence mode="wait" initial={false}>
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: CINEMATIC }}
          >
            <Intro onStart={startQuiz} isFollowup={hasBaseline} />
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: CINEMATIC }}
          >
            <QuizStep
              stepIndex={stepIndex}
              total={total}
              answers={answers}
              onSelect={selectAnswer}
              onBack={back}
            />
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.7, ease: CINEMATIC }}
          >
            <Result
              score={allAnswered ? score : 0}
              band={band}
              onRestart={restart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function Intro({
  onStart,
  isFollowup,
}: {
  onStart: () => void;
  isFollowup: boolean;
}) {
  // Consentimento informado simples: a UI exige tick explícito antes de
  // habilitar o botão "Começar". Não é guardado — é só um gesto consciente
  // antes do primeiro item. Em refazes seguintes (`isFollowup`), o pedido
  // continua activo porque o utilizador pode aceder à app em vários estados
  // emocionais e o lembrete não custa nada.
  const [accepted, setAccepted] = useState(false);

  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs tracking-wider uppercase text-muted">
        <Sparkles className="h-3 w-3 text-accent" />
        {isFollowup ? "Auto-reflexão · pós-teste · 2 min" : "Bem-vindo · Auto-reflexão · 2 min"}
      </div>

      <h1 className="heading-display text-4xl md:text-6xl mt-6">
        Antes de começares,<br /> uma breve pausa.
      </h1>

      <p className="prose-soft mt-6 text-lg max-w-xl">
        O <strong>Conectamente</strong> é um programa psicoeducativo de equilíbrio digital — episódios curtos, exercícios práticos e estratégias inspiradas em TCC para reaprenderes a tua relação com a internet, sem extremos nem culpa.
        Começamos por <strong>oito perguntas curtas</strong> para reparares no que tens à frente.
        Não é um diagnóstico nem um teste — é um convite a olhar com mais clareza, sem julgamento.
      </p>

      {/* Enquadramento prático */}
      <div className="mt-10 grid gap-4 md:grid-cols-2 max-w-2xl">
        <div className="card">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Tempo</p>
          <p className="font-serif text-lg mt-1.5">~ 2 minutos</p>
          <p className="prose-soft text-sm mt-1">
            Oito itens, escala de 5 pontos, sem texto livre.
          </p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Confidencialidade</p>
          <p className="font-serif text-lg mt-1.5">Fica contigo</p>
          <p className="prose-soft text-sm mt-1">
            Guardado no teu dispositivo. Se tens conta, sincroniza com a tua
            conta — nunca partilhado.
          </p>
        </div>
      </div>

      <div className="mt-4 card max-w-2xl">
        <p className="font-serif text-xl">O que vais ver no final</p>
        <ul className="prose-soft mt-3 text-sm space-y-1.5 list-disc pl-5">
          <li>Uma leitura do teu padrão actual — em quatro zonas possíveis.</li>
          <li>Sugestões práticas adaptadas à tua zona.</li>
          {isFollowup ? (
            <li>Comparação com a tua leitura inicial — em <Link href="/estatisticas" className="underline hover:text-ink">Estatísticas</Link>.</li>
          ) : (
            <li>Um ponto de partida — para comparar depois, se quiseres.</li>
          )}
        </ul>
      </div>

      {/* Sobre o instrumento */}
      <details className="mt-4 max-w-2xl group">
        <summary className="cursor-pointer text-sm text-muted hover:text-ink transition-colors">
          Como interpretar &amp; sobre o instrumento ↓
        </summary>
        <div className="prose-soft text-sm mt-3 space-y-2 pl-1">
          <p>
            Os 8 itens são inspirados em instrumentos validados de uso
            problemático da internet (IAT, PIUQ). A pontuação final é o número
            de áreas onde dizes “frequentemente” ou “quase sempre” (0–8) —
            mapeada para quatro zonas de reflexão.
          </p>
          <p>
            <strong>Limites:</strong> é uma ferramenta de auto-reflexão, não um
            teste clínico. Pontuações altas <em>não</em> confirmam patologia;
            pontuações baixas <em>não</em> excluem sofrimento. Em qualquer
            caso, falar com um(a) profissional pode ajudar — vê{" "}
            <Link href="/ajuda" className="underline hover:text-ink">
              Como pedir ajuda
            </Link>
            .
          </p>
        </div>
      </details>

      {/* Consentimento informado */}
      <label className="mt-8 flex items-start gap-3 max-w-2xl cursor-pointer group">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-border accent-accent shrink-0"
        />
        <span className="prose-soft text-sm">
          Compreendo que esta auto-reflexão é <strong>psicoeducativa</strong> e
          não substitui acompanhamento profissional. As respostas ficam no meu
          dispositivo (ou na minha conta, se autenticado). Posso refazer ou
          apagar quando quiser.
        </span>
      </label>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          onClick={onStart}
          disabled={!accepted}
          className="gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFollowup ? "Começar pós-teste" : "Começar"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
        <Link href="/programa">
          <Button size="lg" variant="outline">
            Ver programa primeiro
          </Button>
        </Link>
      </div>

      <p className="mt-8 text-xs text-muted max-w-xl">
        Em crise, não esperes pelo final — liga <strong>112</strong> ou{" "}
        <strong>SNS24 (808 24 24 24)</strong>. Para apoio fora-de-crise, vê{" "}
        <Link href="/ajuda" className="underline hover:text-ink">
          Como pedir ajuda
        </Link>
        .
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function QuizStep({
  stepIndex,
  total,
  answers,
  onSelect,
  onBack,
}: {
  stepIndex: number;
  total: number;
  answers: (number | undefined)[];
  onSelect: (v: number) => void;
  onBack: () => void;
}) {
  const q = ASSESSMENT_QUESTIONS[stepIndex];
  const current = answers[stepIndex];
  const progress = ((stepIndex + (current !== undefined ? 1 : 0)) / total) * 100;

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {stepIndex === 0 ? "Voltar à introdução" : "Pergunta anterior"}
        </button>
        <span className="tabular-nums">
          {String(stepIndex + 1).padStart(2, "0")} <span className="text-subtle">/</span> {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-3 h-[2px] w-full bg-border/60 rounded-full overflow-hidden">
        <motion.div
          className="h-full"
          style={{
            transformOrigin: "left",
            background:
              "linear-gradient(90deg, rgb(var(--accent) / 0.85), rgb(var(--accent-2) / 0.95))",
            willChange: "transform",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.7, ease: CINEMATIC }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: CINEMATIC }}
          className="mt-12"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-accent">
            Pergunta {stepIndex + 1}
          </p>
          <h2 className="heading-display text-3xl md:text-5xl mt-3">
            {q.prompt}
          </h2>
          {q.hint && (
            <p className="prose-soft mt-4 text-base max-w-xl">{q.hint}</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="mt-10 grid gap-2.5">
        {LIKERT_OPTIONS.map((opt) => {
          const selected = current === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.25, ease: CINEMATIC }}
              className={
                "group relative card text-left flex items-center justify-between gap-4 transition-colors " +
                (selected
                  ? "ring-1 ring-accent/50 bg-accent/8"
                  : "hover:bg-ink/[0.03]")
              }
              aria-pressed={selected}
            >
              <span className="flex items-center gap-4">
                <span
                  className={
                    "inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium tabular-nums transition-colors " +
                    (selected
                      ? "bg-accent text-bg"
                      : "bg-ink/5 text-muted group-hover:bg-ink/10")
                  }
                >
                  {selected ? <Check className="h-4 w-4" /> : opt.value}
                </span>
                <span className={selected ? "text-ink" : "text-ink/85"}>
                  {opt.label}
                </span>
              </span>
              <span className="text-xs text-subtle hidden md:inline">
                {opt.short}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-muted">
        Sem certo ou errado — escolhe a resposta que mais se aproxima do teu dia-a-dia recente.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function Result({
  score,
  band,
  onRestart,
}: {
  score: number;
  band: ReturnType<typeof scoreToBand>;
  onRestart: () => void;
}) {
  const pct = score / ASSESSMENT_MAX_SCORE;
  // Count-up para o número grande do resultado — 1s, reduced-motion-safe.
  const animatedScore = useAnimatedNumber(score, { duration: 1000 });

  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs tracking-wider uppercase text-muted">
        <Sparkles className="h-3 w-3 text-accent" />
        {band.kicker}
      </div>

      <h1 className="heading-display text-4xl md:text-6xl mt-6">
        {band.summary}
      </h1>

      {/* Score visual — gradient arc */}
      <div className="mt-10 card max-w-2xl relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none dark:hidden"
          style={{
            background:
              "radial-gradient(80% 100% at 50% 0%, rgb(var(--accent) / 0.10), transparent 60%)",
          }}
        />
        <div className="relative flex items-baseline gap-3">
          <p className="font-serif text-6xl md:text-7xl tabular-nums tracking-tight">
            {animatedScore}
          </p>
          <p className="text-muted">
            de <span className="tabular-nums">{ASSESSMENT_MAX_SCORE}</span>
          </p>
        </div>
        <p className="font-serif text-2xl mt-2 text-ink">{band.label}</p>

        <div className="mt-6 h-[3px] w-full rounded-full bg-border/60 overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              transformOrigin: "left",
              background:
                "linear-gradient(90deg, rgb(var(--accent) / 0.85), rgb(var(--accent-2) / 0.95))",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: pct }}
            transition={{ duration: 1.2, ease: CINEMATIC, delay: 0.2 }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-subtle tabular-nums">
          <span>0</span>
          <span>{ASSESSMENT_MAX_SCORE}</span>
        </div>
      </div>

      <div className="prose-soft mt-10 space-y-4 max-w-2xl">
        {band.interpretation.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <p className="prose-soft mt-6 text-ink max-w-2xl">{band.suggestion}</p>

      {/* Card de risco elevado — só nas bandas Excessivo e Sobrecarga, com
          tom acolhedor e duas vias concretas: /ajuda (fora-de-crise) e /sos
          (crise). Evita alarmismo: a mensagem reforça que pedir apoio é um
          passo de cuidado, não um sinal de fracasso. */}
      {(band.id === "excessivo" || band.id === "sobrecarga") && (
        <div className="mt-10 card max-w-2xl bg-accent/6 border-accent/25">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">
            Vale a pena pedir apoio
          </p>
          <p className="font-serif text-xl mt-2">
            {band.id === "sobrecarga"
              ? "Pelas tuas respostas, faz sentido falar com alguém."
              : "Se quiseres ir mais longe, considera apoio profissional."}
          </p>
          <p className="prose-soft text-sm mt-3 max-w-xl">
            Pedir apoio não significa que algo está “muito mal” — significa
            tempo e espaço para pensar com alguém treinado. O Conectamente é
            uma boa ferramenta de partida, mas não substitui acompanhamento
            profissional. Em Portugal, podes começar pelo médico de família
            (encaminhamento gratuito no SNS) ou por centros especializados.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href="/ajuda"
              className="group inline-flex items-center gap-2 rounded-full bg-ink text-bg px-4 h-10 text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              Como pedir ajuda
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            {band.id === "sobrecarga" && (
              <Link
                href="/sos"
                className="inline-flex items-center gap-2 rounded-full hairline bg-bg/60 px-4 h-10 text-sm hover:bg-bg/90 transition-colors"
              >
                Em crise · linhas de apoio
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link href="/programa">
          <Button size="lg" className="gap-2 group">
            Abrir programa
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors px-3 py-2"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Refazer
        </button>
      </div>

      <p className="mt-10 text-xs text-muted max-w-xl">
        Esta auto-reflexão é psicoeducativa e não substitui acompanhamento
        profissional. Se algo do que sentes for intenso ou persistente, fala
        com um(a) profissional qualificado(a). Vê{" "}
        <Link href="/ajuda" className="underline hover:text-ink">
          Como pedir ajuda
        </Link>
        .
      </p>
    </div>
  );
}
