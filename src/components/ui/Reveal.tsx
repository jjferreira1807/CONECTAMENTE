"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reveal — wrapper de entrada via `whileInView`.
 *
 * Faz fade-up subtil quando o conteúdo entra no viewport. Tudo opacity +
 * translate (GPU-friendly, sem layout thrash) e usa a curva cinematic do
 * projecto. `prefers-reduced-motion` é respeitado globalmente pelo `*` rule
 * em globals.css, mas a animação aqui também é tão curta que é cómoda.
 *
 * Uso:
 *   <Reveal><MeuCard /></Reveal>
 *   <Reveal delay={0.05}><OutroCard /></Reveal>
 */
export function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Defaults to <div>. Set "section" for landmark sections. */
  as?: "div" | "section" | "li" | "article";
}) {
  const Comp = (motion as unknown as Record<string, typeof motion.div>)[as] ?? motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
}
