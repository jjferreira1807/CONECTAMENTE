"use client";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { fadeUp } from "@/lib/motion";

const refs = [
  {
    title: "Beck, A. (1979)",
    body: "Cognitive Therapy and the Emotional Disorders — base do modelo cognitivo aplicado.",
  },
  {
    title: "Linehan, M. (1993)",
    body: "Skills Training Manual for Treating BPD — origem da técnica de tolerância à urgência.",
  },
  {
    title: "Holt-Lunstad et al. (2015)",
    body: "Loneliness and Social Isolation as Risk Factors for Mortality — Perspectives on Psychological Science.",
  },
  {
    title: "Lembke, A. (2021)",
    body: "Dopamine Nation — neurociência aplicada à recompensa moderna.",
  },
  {
    title: "Walker, M. (2017)",
    body: "Why We Sleep — base da componente de sono.",
  },
  {
    title: "Hayes, S. (2012)",
    body: "Acceptance and Commitment Therapy — exercício de valores.",
  },
];

export function Science() {
  return (
    <section className="py-20 md:py-28 bg-surface/40 border-t border-border">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm text-muted">Em que se baseia</p>
          <h2 className="heading-display text-3xl md:text-5xl mt-3">
            Conteúdo psicoeducativo,<br /> com referências reais.
          </h2>
          <p className="prose-soft mt-4">
            Não somos um substituto de acompanhamento profissional — e dizemo-lo
            abertamente. Mas cada exercício e cada ideia parte de literatura revista
            por pares, traduzida para PT-PT acessível e aplicável no dia-a-dia.
          </p>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {refs.map((r) => (
            <motion.li key={r.title} variants={fadeUp} className="hairline rounded-2xl p-5">
              <p className="font-medium">{r.title}</p>
              <p className="prose-soft text-sm mt-1.5">{r.body}</p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
