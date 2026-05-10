"use client";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { fadeUp, stagger } from "@/lib/motion";
import { Brain, Moon, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Zap,
    title: "Distracção crónica",
    body: "Pegas no telemóvel “só por um segundo” e perdes 40 minutos. Não é falta de vontade — é design comportamental.",
  },
  {
    Icon: Moon,
    title: "Sono fragmentado",
    body: "Adormeces tarde, acordas pior. O scroll nocturno mantém o cérebro em alerta quando devia desacelerar.",
  },
  {
    Icon: Users,
    title: "Conexão sem contacto",
    body: "Centenas de mensagens, mas a sensação de solidão fica. O cérebro social precisa de mais do que ecrãs.",
  },
  {
    Icon: Brain,
    title: "Ansiedade que pede ecrã",
    body: "Quando o desconforto aparece, a distracção é o sedativo mais barato. E o que deixa pior depois.",
  },
];

export function Problem() {
  return (
    <section className="relative py-24 md:py-32 border-t border-border/60">
      {/* Soft ambient layer specific to this section */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(var(--border) / 0.5), transparent)",
        }}
      />

      <Container>
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16">
          <div className="md:sticky md:top-32 self-start">
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Para quem é</p>
            <h2 className="heading-display text-3xl md:text-5xl mt-4">
              Conheces<br />alguma destas?
            </h2>
            <p className="prose-soft mt-5 max-w-sm">
              Pensado para adultos entre os 30 e os 60 que sentem que perderam o
              controlo da própria atenção, do sono ou do tempo. Não és tu — é o
              ambiente em que vivemos.
            </p>
          </div>

          <motion.ul
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid sm:grid-cols-2 gap-3.5"
          >
            {items.map(({ Icon, title, body }) => (
              <motion.li
                key={title}
                variants={fadeUp}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group relative card overflow-hidden"
              >
                {/* hover glow */}
                <span
                  aria-hidden
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background:
                      "radial-gradient(60% 80% at 20% 20%, rgb(var(--accent) / 0.18), transparent 60%)",
                  }}
                />
                <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/15">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="relative font-serif text-xl mt-5">{title}</h3>
                <p className="relative prose-soft text-sm mt-2">{body}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </section>
  );
}
