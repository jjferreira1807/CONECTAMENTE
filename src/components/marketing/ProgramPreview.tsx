"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { episodes } from "@/content/episodes";
import { ArrowRight } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";

/**
 * Premium episode card preview — large numerals, ambient gradient header
 * unique per episode, micro-interactions on hover.
 */
export function ProgramPreview() {
  const featured = episodes.slice(0, 6);
  return (
    <section className="py-24 md:py-32 border-t border-border/60">
      <Container>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-accent">O programa</p>
            <h2 className="heading-display text-3xl md:text-5xl mt-4">
              12 sessões. Uma direcção.
            </h2>
          </div>
          <Link
            href="/programa"
            className="group inline-flex items-center gap-1.5 text-sm font-medium hover:text-accent transition-colors"
          >
            Ver todas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((ep) => (
            <motion.div key={ep.slug} variants={fadeUp}>
              <Link
                href={`/programa/${ep.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-border/60 bg-surface/70 backdrop-blur-md transition duration-500 ease-cinematic hover:border-accent/30 hover:-translate-y-1 hover:shadow-glow"
              >
                <div
                  className={"h-36 relative bg-gradient-to-br " + ep.themeColor}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background:
                        "radial-gradient(50% 70% at 70% 20%, rgb(255 255 255 / 0.12), transparent 70%)",
                    }}
                  />
                  <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between">
                    <span className="font-serif text-6xl text-ink/30 tabular-nums leading-none">
                      {String(ep.number).padStart(2, "0")}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-ink/60 pb-1">
                      {ep.durationMin} min
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">{ep.kicker}</p>
                  <p className="font-serif text-xl mt-2 leading-snug">{ep.title}</p>
                  <p className="text-sm text-muted mt-2 line-clamp-2">{ep.subtitle}</p>
                  <span
                    aria-hidden
                    className="mt-5 inline-flex items-center gap-1 text-xs text-accent opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
                  >
                    Começar episódio <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
