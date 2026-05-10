"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { fadeUp, stagger } from "@/lib/motion";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-10 md:pt-14 pb-20 md:pb-32 overflow-hidden">
      <Aurora />
      <Container>
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.p variants={fadeUp} className="text-sm text-muted">
            Programa digital de 12 sessões · TCC · em PT-PT
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="heading-display text-5xl md:text-7xl mt-5"
          >
            Reaprende a tua relação<br />
            <span className="text-accent">com a internet.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="prose-soft mt-6 text-lg max-w-xl"
          >
            Sem extremos. Sem culpa. Um caminho guiado, baseado em Terapia
            Cognitivo-Comportamental, para adultos que sentem que o telemóvel
            ocupa demasiado espaço no dia — e no sono.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/programa">
              <Button size="lg">
                Começar gratuitamente <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/intro">
              <Button size="lg" variant="outline">
                <Play className="h-4 w-4" /> Ver introdução · 90s
              </Button>
            </Link>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-5 text-xs text-muted">
            Sem anúncios. Sem cookies de tracking. O teu progresso fica neste dispositivo
            (ou na tua conta, se preferires).
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-20 md:mt-28"
        >
          <Stats />
        </motion.div>
      </Container>
    </section>
  );
}

function Aurora() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full bg-gradient-warm blur-3xl"
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(var(--border) / 0.6), transparent)",
        }}
      />
    </div>
  );
}

function Stats() {
  const items = [
    { k: "12", v: "sessões guiadas" },
    { k: "8", v: "exercícios interactivos" },
    { k: "5", v: "fichas descarregáveis" },
    { k: "100%", v: "em português de Portugal" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden hairline">
      {items.map((it) => (
        <div key={it.v} className="bg-bg p-5">
          <p className="font-serif text-3xl tabular-nums">{it.k}</p>
          <p className="text-xs text-muted mt-1">{it.v}</p>
        </div>
      ))}
    </div>
  );
}
