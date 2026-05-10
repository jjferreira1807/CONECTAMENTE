"use client";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { fadeUp, stagger } from "@/lib/motion";
import { BookOpen, Sparkles, Compass } from "lucide-react";

const steps = [
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
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-end">
          <div>
            <p className="text-sm text-muted">Método</p>
            <h2 className="heading-display text-3xl md:text-5xl mt-3">
              Três passos, doze vezes.
            </h2>
            <p className="prose-soft mt-4 max-w-md">
              Cada episódio segue a mesma estrutura, deliberadamente repetitiva.
              É assim que se aprende — não com novidade infinita, mas com prática.
            </p>
          </div>
          <p className="prose-soft md:max-w-md">
            Inspirado em programas de TCC estruturada (Beck Institute, NICE Guidelines),
            adaptado a hábitos digitais e desenhado para adultos com vidas ocupadas.
          </p>
        </div>

        <motion.ul
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-px bg-border rounded-3xl overflow-hidden hairline"
        >
          {steps.map(({ Icon, title, body }, i) => (
            <motion.li key={title} variants={fadeUp} className="bg-bg p-7 md:p-9 grid md:grid-cols-[auto_1fr] gap-6">
              <div>
                <p className="text-xs text-muted tabular-nums">0{i + 1}</p>
                <span className="mt-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/12 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div>
                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="prose-soft mt-2 max-w-xl">{body}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
