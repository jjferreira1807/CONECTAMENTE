import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionRenderer } from "@/components/episode/SectionRenderer";
import { EpisodeProgressBar } from "@/components/episode/EpisodeProgressBar";
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
      <header
        className={
          "relative overflow-hidden bg-gradient-to-br " + ep.themeColor +
          " border-b border-border"
        }
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(40% 60% at 80% 0%, rgb(var(--accent) / 0.25) 0%, transparent 60%)",
          }}
        />
        <Container className="py-14 md:py-20">
          <Link href="/programa" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Voltar ao programa
          </Link>

          <div className="mt-6 max-w-3xl">
            <Badge>{ep.kicker} · Episódio {ep.number} · {ep.durationMin} min</Badge>
            <h1 className="heading-display text-4xl md:text-6xl mt-4">{ep.title}</h1>
            <p className="prose-soft mt-4 text-lg max-w-2xl">{ep.subtitle}</p>
          </div>

          <div className="mt-8 max-w-md">
            <EpisodeProgressBar slug={ep.slug} totalSections={ep.sections.length} />
          </div>
        </Container>
      </header>

      <Container className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-10 md:space-y-14">
          {ep.sections.map((s) => (
            <section key={s.id}>
              <SectionRenderer section={s} slug={ep.slug} />
            </section>
          ))}

          <CompleteEpisodeButton slug={ep.slug} />

          <nav className="border-t border-border pt-8 flex items-center justify-between gap-4">
            {prev ? (
              <Link href={`/programa/${prev.slug}`} className="group">
                <p className="text-xs text-muted">Anterior</p>
                <p className="font-medium mt-0.5 inline-flex items-center gap-1 group-hover:text-accent">
                  <ArrowLeft className="h-4 w-4" /> {prev.title}
                </p>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/programa/${next.slug}`} className="group text-right">
                <p className="text-xs text-muted">Próximo</p>
                <p className="font-medium mt-0.5 inline-flex items-center gap-1 group-hover:text-accent">
                  {next.title} <ArrowRight className="h-4 w-4" />
                </p>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button>Voltar ao dashboard</Button>
              </Link>
            )}
          </nav>
        </div>
      </Container>
    </>
  );
}
