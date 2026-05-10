"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { fadeUp } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="pb-20 md:pb-28">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-warm p-10 md:p-16 text-center"
        >
          <p className="text-sm text-muted">Sem cartão. Sem compromissos.</p>
          <h2 className="heading-display text-3xl md:text-5xl mt-3">
            Começa pelo episódio 1.<br />
            <span className="text-accent">Doze minutos.</span>
          </h2>
          <p className="prose-soft mt-5 max-w-lg mx-auto">
            O primeiro episódio é uma introdução honesta ao programa. Se sentires
            que não é para ti, não há email a perseguir-te. Está sempre aqui.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/programa/bem-vindo">
              <Button size="lg">
                Começar episódio 1 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sobre">
              <Button size="lg" variant="ghost">Como funciona</Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
