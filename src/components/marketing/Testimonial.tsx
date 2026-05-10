"use client";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { fadeUp } from "@/lib/motion";

/**
 * Composite testimonial — a phrase that reflects common patterns reported by
 * users in CBT digital programs (van Ballegooijen et al., 2014). Marked as
 * such; not attributed to a real individual.
 */
export function Testimonial() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <motion.figure
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <span aria-hidden className="text-7xl text-accent/30 leading-none font-serif">“</span>
          <blockquote className="heading-display text-2xl md:text-4xl leading-tight -mt-2">
            Não foi uma desintoxicação. Foi reaprender a escolher.
            Voltei a ouvir um disco inteiro sem pegar no telemóvel —
            é uma vitória que não cabe num story.
          </blockquote>
          <figcaption className="mt-8 text-sm text-muted">
            Voz composta de testemunhos típicos · programas digitais de TCC, ensaios clínicos 2014–2022.
          </figcaption>
        </motion.figure>
      </Container>
    </section>
  );
}
