"use client";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { fadeUp, stagger } from "@/lib/motion";
import { BookOpen, Sparkles, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const steps: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: BookOpen,
    title: "Compreender",
    body: "Cada sessão começa por explicar o que se passa — no cérebro, no comportamento, na vida diária. Sem jargão, sem mistério.",
  },
  {
    Icon: Sparkles,
    title: "Praticar",
    body: "Exercícios baseados em TCC, DBT e ACT. Pequenos, concretos, repetíveis. Não há ‘teoria’ por aplicar.",
  },
  {
    Icon: Compass,
    title: "Integrar",
    body: "Reflexões guardam-se automaticamente. Voltas quando precisares. O programa torna-se um manual pessoal.",
  },
];

export function Method() {
  return (
    <section className="relative py-24 md:py-32">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Método</p>
            <h2 className="heading-display text-3xl md:text-5xl mt-4">
              Três passos,<br />doze vezes.
            </h2>
            <p className="prose-soft mt-5 max-w-md">
              Cada episódio segue a mesma estrutura, deliberadamente repetitiva.
              É assim que se aprende — não com novidade infinita, mas com prática.
            </p>
          </div>
          <p className="prose-soft md:max-w-md">
            Inspirado em programas de TCC estruturada (Beck Institute, NICE
            Guidelines), adaptado a hábitos digitais e desenhado para adultos
            com vidas ocupadas.
          </p>
        </div>

        <motion.ol
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid md:grid-cols-3 gap-px bg-border/50 rounded-3xl overflow-hidden hairline backdrop-blur-md"
        >
          {steps.map(({ Icon, title, body }, i) => (
            <motion.li
              key={title}
              variants={fadeUp}
              className="relative bg-bg/70 p-7 md:p-9 group transition-colors duration-700 hover:bg-bg/95"
            >
              <span className="text-xs text-muted tabular-nums tracking-widest">0{i + 1}</span>
              <span className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/15">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-serif text-2xl mt-5">{title}</h3>
              <p className="prose-soft mt-3 max-w-sm">{body}</p>

              {/* subtle accent line that grows on hover */}
              <span
                aria-hidden
                className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-accent/0 via-accent/40 to-accent/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
              />
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </section>
  );
}
