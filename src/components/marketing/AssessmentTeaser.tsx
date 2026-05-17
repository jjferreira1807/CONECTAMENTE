"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";

/**
 * Auto-reflexão · entry-point teaser na homepage.
 *
 * Hand-off natural depois da secção "Para quem é": o utilizador acabou de se
 * reconhecer nos sintomas — este card oferece um próximo passo concreto e
 * leve, antes do mergulho no programa. Usa primitivos já existentes (card,
 * gradient teal→amber, motion.fadeUp) para se integrar sem peso.
 */
export function AssessmentTeaser() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative card overflow-hidden md:flex md:items-center md:gap-10"
        >
          {/* ambient gradient — escondido em dark para fundo coeso. */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none dark:hidden"
            style={{
              background:
                "radial-gradient(60% 80% at 100% 0%, rgb(var(--accent-2) / 0.16), transparent 60%), radial-gradient(50% 70% at 0% 100%, rgb(var(--accent) / 0.14), transparent 65%)",
            }}
          />

          <div className="relative flex-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted">
              <Compass className="h-3 w-3 text-accent" />
              Antes de começar
            </span>
            <h3 className="heading-display text-2xl md:text-4xl mt-4">
              Como está actualmente a tua relação com o digital?
            </h3>
            <p className="prose-soft mt-3 max-w-xl">
              Oito perguntas curtas — dois minutos — para olhar com mais clareza,
              sem julgamento. Fica como ponto de partida para comparar depois,
              quando quiseres.
            </p>
          </div>

          <div className="relative mt-6 md:mt-0 md:shrink-0">
            <Link
              href="/auto-reflexao"
              className="group inline-flex items-center gap-2 rounded-full bg-ink text-bg px-5 h-12 text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              Fazer auto-reflexão
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
