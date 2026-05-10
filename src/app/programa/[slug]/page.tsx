import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionRenderer } from "@/components/episode/SectionRenderer";
import { EpisodeHeader } from "@/components/episode/EpisodeHeader";
import { episodes, getEpisode } from "@/content/episodes";
import { CompleteEpisodeButton } from "@/components/episode/CompleteEpisodeButton";
import type { Metadata } from "next";

export function generateStaticParams() {
  return episodes.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const ep = getEpisode(params.slug);
  if (!ep) return { title: "Episódio" };
  return {
    title: `${ep.number}. ${ep.title}`,
    description: ep.description,
  };
}

export default function EpisodePage({ params }: { params: { slug: string } }) {
  const ep = getEpisode(params.slug);
  if (!ep) notFound();

  const idx = episodes.findIndex((e) => e.slug === ep.slug);
  const prev = idx > 0 ? episodes[idx - 1] : null;
  const next = idx < episodes.length - 1 ? episodes[idx + 1] : null;

  return (
    <>
      <EpisodeHeader
        number={ep.number}
        kicker={ep.kicker}
        title={ep.title}
        subtitle={ep.subtitle}
        durationMin={ep.durationMin}
        themeColor={ep.themeColor}
        slug={ep.slug}
        totalSections={ep.sections.length}
      />

      <Container className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-12 md:space-y-16">
          {ep.sections.map((s) => (
            <section key={s.id}>
              <SectionRenderer section={s} slug={ep.slug} />
            </section>
          ))}

          <CompleteEpisodeButton slug={ep.slug} />

          <nav className="border-t border-border/60 pt-10 flex items-center justify-between gap-4">
            {prev ? (
              <Link href={`/programa/${prev.slug}`} className="group">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Anterior</p>
                <p className="font-medium mt-1.5 inline-flex items-center gap-1.5 group-hover:text-accent transition-colors">
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  {prev.title}
                </p>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/programa/${next.slug}`} className="group text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Próximo</p>
                <p className="font-medium mt-1.5 inline-flex items-center gap-1.5 group-hover:text-accent transition-colors">
                  {next.title}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </p>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button variant="premium">Voltar ao dashboard</Button>
              </Link>
            )}
          </nav>
        </div>
      </Container>
    </>
  );
}
