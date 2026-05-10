"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EpisodeProgressBar } from "./EpisodeProgressBar";

interface Props {
  number: number;
  kicker: string;
  title: string;
  subtitle?: string;
  durationMin: number;
  themeColor: string; // e.g. "from-accent/30 to-accent2/20"
  slug: string;
  totalSections: number;
}

/**
 * Cinematic episode header. Per-episode ambient gradient with breathing orb,
 * staggered text reveal, hairline progress bar. Replaces the previous flat
 * gradient strip.
 */
export function EpisodeHeader({
  number, kicker, title, subtitle, durationMin, themeColor, slug, totalSections,
}: Props) {
  return (
    <header
      className={"relative overflow-hidden border-b border-border/60 bg-gradient-to-br " + themeColor}
    >
      {/* Multi-layer ambient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(60% 80% at 80% 0%, rgb(var(--accent) / 0.22), transparent 70%), radial-gradient(40% 60% at 10% 100%, rgb(var(--accent-2) / 0.18), transparent 70%)",
        }}
      />
      {/* Breathing orb */}
      <motion.div
        aria-hidden
        className="absolute -top-32 right-[8%] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--accent) / 0.35), transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative py-16 md:py-24">
        <Link
          href="/programa"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao programa
        </Link>

        <motion.div
          className="mt-8 max-w-3xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1">
              <Sparkles className="h-3 w-3 text-accent" />
              {kicker}
            </span>
            <span className="text-subtle">·</span>
            <span className="font-serif text-base text-ink/70 tabular-nums tracking-normal normal-case">
              Episódio {String(number).padStart(2, "0")}
            </span>
            <span className="text-subtle">·</span>
            <span className="tracking-normal normal-case text-muted">{durationMin} min</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="heading-display text-4xl md:text-6xl lg:text-7xl mt-6"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="prose-soft mt-5 text-lg md:text-xl max-w-2xl"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-10 max-w-md"
        >
          <EpisodeProgressBar slug={slug} totalSections={totalSections} />
        </motion.div>
      </Container>
    </header>
  );
}
