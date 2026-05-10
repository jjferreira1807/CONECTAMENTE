"use client";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { fadeUp, stagger } from "@/lib/motion";
import { Brain, Moon, Users, Zap } from "lucide-react";

const items = [
  {
    Icon: Zap,
    title: "Distracção crónica",
    body: "Pegas no telemóvel “só por um segundo” e perdes 40 minutos. Não é falta de vontade — é design comportamental.",
  },
  {
    Icon: Moon,
    title: "Sono fragmentado",
    body: "Adormeces tarde, acordas pior. O scroll nocturno mantém o cérebro em alerta quando devia estar a desacelerar.",
  },
  {
    Icon: Users,
    title: "Conexão sem contacto",
    body: "Centenas de mensagens, mas a sensação de solidão fica. O cérebro social precisa de mais do que ecrãs.",
  },
  {
    Icon: Brain,
    title: "Ansiedade que pede ecrã",
    body: "Quando o desconforto aparece, a distracção é o sedativo mais barato. E também o que deixa pior depois.",
  },
];

export function Problem() {
  return (
    <section className="py-20 md:py-28 border-t border-border bg-surface/50">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm text-muted">Para quem é</p>
          <h2 className="heading-display text-3xl md:text-5xl mt-3">
            Conheces alguma destas?
          </h2>
          <p className="prose-soft mt-4">
            Pensado para adultos entre os 30 e os 60 que sentem que perderam o
            controlo da própria atenção, do sono ou do tempo. Não és tu — é o
            ambiente em que vivemos.
          </p>
        </div>

        <motion.ul
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {items.map(({ Icon, title, body }) => (
            <motion.li key={title} variants={fadeUp} className="card hover:shadow-glow">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-serif text-xl mt-4">{title}</h3>
              <p className="prose-soft text-sm mt-2">{body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
