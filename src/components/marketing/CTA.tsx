"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { fadeUp } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="pb-24 md:pb-32">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative overflow-hidden rounded-[2rem] border border-border/60 backdrop-blur-md p-12 md:p-20 text-center"
        >
          {/* Multi-layer gradient backdrop — hidden em dark para fundo plano. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 dark:hidden"
            style={{
              background:
                "radial-gradient(60% 80% at 30% 20%, rgb(var(--accent) / 0.18), transparent 70%), radial-gradient(50% 70% at 80% 80%, rgb(var(--accent-2) / 0.16), transparent 70%), rgb(var(--surface) / 0.5)",
            }}
          />
          {/* Decorative orb — idem. */}
          <div
            aria-hidden
            className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full opacity-60 pointer-events-none dark:hidden"
            style={{
              background:
                "radial-gradient(closest-side, rgb(var(--accent-2) / 0.2), transparent 70%)",
              filter: "blur(60px)",
              animation: "drift 32s ease-in-out infinite",
            }}
          />

          <p className="text-xs uppercase tracking-[0.25em] text-accent">
            Sem cartão · sem compromissos
          </p>
          <h2 className="heading-display text-3xl md:text-5xl lg:text-6xl mt-4">
            Começa pelo episódio 1.<br />
            <span className="gradient-headline bg-gradient-to-r from-accent via-accent2 to-accent bg-clip-text text-transparent">
              Doze minutos.
            </span>
          </h2>
          <p className="prose-soft mt-6 max-w-lg mx-auto">
            O primeiro episódio é uma introdução honesta ao programa. Se sentires
            que não é para ti, não há email a perseguir-te. Está sempre aqui.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/programa/bem-vindo">
              <Button size="lg" variant="premium" className="group">
                Começar episódio 1
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
