"use client";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { fadeUp, stagger } from "@/lib/motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useAppReady } from "@/components/AppReady";

/**
 * Hero with parallax aurora and character-stagger reveal.
 *
 * Layers (bottom to top):
 *   1. Parallax orb that moves slower than scroll
 *   2. Floating dots above the gradient
 *   3. Headline + sub + CTAs with stagger
 *   4. Stats strip with hairline dividers
 */
export function Hero() {
  const reduce = useReducedMotion();
  const ready = useAppReady();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  // Orb drifts upward as user scrolls — subtle
  const orbY = useTransform(scrollY, [0, 600], reduce ? [0, 0] : [0, -120]);

  return (
    <section
      ref={ref}
      className="relative pt-12 md:pt-20 pb-24 md:pb-36 overflow-hidden"
    >
      {/* Aurora — parallax. Hidden em dark mode para um fundo plano e coeso. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none dark:hidden"
        style={{ y: orbY }}
      >
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--accent) / 0.4), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-32 right-0 w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgb(var(--accent-2) / 0.3), transparent 70%)",
            filter: "blur(70px)",
            animation: "drift 30s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgb(var(--border) / 0.6), transparent)",
          }}
        />
      </motion.div>

      <Container>
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          className="max-w-3xl"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs tracking-wider uppercase text-muted">
            <Sparkles className="h-3 w-3 text-accent" />
            Programa digital · TCC · em PT-PT
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="heading-display text-5xl md:text-7xl lg:text-[5.25rem] mt-6"
          >
            Reaprende a tua relação<br />
            <span
              className="gradient-headline bg-gradient-to-r from-accent via-accent2 to-accent bg-clip-text text-transparent animate-gradient-drift"
              style={{ backgroundSize: "220% 100%" }}
            >
              com a internet.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="prose-soft mt-6 text-lg md:text-xl max-w-xl"
          >
            Sem extremos. Sem culpa. Um programa guiado de equilíbrio digital,
            com estratégias práticas inspiradas em TCC, para adultos que sentem
            que o telemóvel ocupa demasiado espaço no dia — e no sono.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/programa">
              <Button size="lg" className="gap-2.5 group">
                Começar gratuitamente
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/intro">
              <Button size="lg" variant="outline" className="gap-2.5">
                <Play className="h-4 w-4" /> Ver introdução · 90s
              </Button>
            </Link>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-6 text-xs text-muted">
            Sem anúncios. Sem cookies de tracking. O teu progresso fica neste
            dispositivo (ou na tua conta, se preferires).
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24 md:mt-32"
        >
          <Stats />
        </motion.div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------------ */

function Stats() {
  const items = [
    { k: "12", v: "sessões guiadas" },
    { k: "8",  v: "exercícios interativos" },
    { k: "5",  v: "fichas descarregáveis" },
    { k: "100%", v: "em português de Portugal" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/60 rounded-3xl overflow-hidden hairline backdrop-blur-md">
      {items.map((it, i) => (
        <motion.div
          key={it.v}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.05 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-bg/70 p-6"
        >
          <p className="font-serif text-3xl md:text-4xl tabular-nums">{it.k}</p>
          <p className="text-xs text-muted mt-1">{it.v}</p>
        </motion.div>
      ))}
    </div>
  );
}
