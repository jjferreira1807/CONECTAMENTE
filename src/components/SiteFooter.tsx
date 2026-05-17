import Link from "next/link";
import { Container } from "./ui/Container";
import { Logomark } from "./brand/Logomark";
import { SpotifyLink } from "./SpotifyLink";

export function SiteFooter() {
  return (
    <footer className="mt-40 border-t border-border/60 bg-surface/40 backdrop-blur-md">
      <Container className="py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <Logomark size={32} />
            <p className="font-serif text-2xl tracking-tight">Conectamente</p>
          </div>
          <p className="mt-4 max-w-sm text-sm prose-soft">
            Um programa digital de 12 sessões para reencontrares equilíbrio com o
            digital — sem culpa, sem extremos, com estratégias práticas.
          </p>
          <div className="mt-5">
            <SpotifyLink />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium mb-3">Programa</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/programa" className="hover:text-ink">Episódios</Link></li>
            <li><Link href="/fichas" className="hover:text-ink">Fichas</Link></li>
            <li><Link href="/dashboard" className="hover:text-ink">Dashboard</Link></li>
            <li><Link href="/estatisticas" className="hover:text-ink">Progresso</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium mb-3">Recursos</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/auto-reflexao" className="hover:text-ink">Auto-reflexão</Link></li>
            <li><Link href="/sobre" className="hover:text-ink">Sobre o método</Link></li>
            <li><Link href="/ajuda" className="hover:text-ink">Como pedir ajuda</Link></li>
            <li><Link href="/sos" className="hover:text-ink">Apoio em crise</Link></li>
            <li><Link href="/privacidade" className="hover:text-ink">Privacidade</Link></li>
            <li><Link href="/termos" className="hover:text-ink">Termos</Link></li>
          </ul>
        </div>
      </Container>
      <Container className="pb-10">
        <div className="border-t border-border pt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-muted">
          <p>© {new Date().getFullYear()} Conectamente · Conteúdo psicoeducativo, não substitui acompanhamento profissional.</p>
          <p>
            Em crise? Liga 112 ou{" "}
            <a className="underline hover:text-ink" href="https://www.sosvozamiga.org" target="_blank" rel="noopener noreferrer">
              SOS Voz Amiga
            </a>
            .
          </p>
        </div>
      </Container>
    </footer>
  );
}
