"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { episodes } from "@/content/episodes";
import { ArrowRight } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";

export function ProgramPreview() {
  const featured = episodes.slice(0, 6);
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <Container>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-xl">
            <p className="text-sm text-muted">O programa</p>
            <h2 className="heading-display text-3xl md:text-5xl mt-3">
              12 sessões. Uma direcção.
            </h2>
          </div>
          <Link
            href="/programa"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-accent"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((ep) => (
            <motion.div key={ep.slug} variants={fadeUp}>
              <Link
                href={`/programa/${ep.slug}`}
                className="block card group hover:shadow-glow transition-all"
              >
                <div className={"h-32 -mx-6 -mt-6 mb-5 rounded-t-3xl bg-gradient-to-br " + ep.themeColor}>
                  <div className="h-full flex items-end p-6">
                    <span className="font-serif text-5xl text-ink/40 tabular-nums">
                      {String(ep.number).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <p className="text-xs uppercase tracking-wider text-muted">{ep.kicker}</p>
                <p className="font-serif text-xl mt-1 leading-snug">{ep.title}</p>
                <p className="text-sm text-muted mt-2">{ep.subtitle}</p>
                <p className="text-xs text-muted mt-5">{ep.durationMin} min · áudio + exercício</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
