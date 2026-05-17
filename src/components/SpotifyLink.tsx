"use client";
import { cn } from "@/lib/cn";

/**
 * SpotifyLink — botão modular para abrir o podcast Conectamente no Spotify.
 *
 * Visualmente alinhado com o resto da UI (rounded-full pill, hairline,
 * curva cinematic, microinteracção de hover/active). Cumpre os requisitos:
 *
 *   • target="_blank" rel="noopener noreferrer" — abre nova aba seguro
 *   • aria-label "Ouvir podcast no Spotify"
 *   • Hover/active suaves via CSS (transform + opacity, GPU-friendly)
 *   • Sem dependência de framer-motion — leve, instantâneo no toque
 *
 * Aceita `variant`:
 *   • "default" — pill com ícone + texto (footer)
 *   • "icon"    — só ícone (compact, para header / barras estreitas)
 */
const SPOTIFY_URL = "https://open.spotify.com/show/033hKTDvkeAxNPdxY9V3ia";
const SPOTIFY_GREEN = "#1DB954";

export function SpotifyLink({
  variant = "default",
  className,
}: {
  variant?: "default" | "icon";
  className?: string;
}) {
  const isIcon = variant === "icon";
  return (
    <a
      href={SPOTIFY_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ouvir podcast no Spotify"
      title="Ouvir podcast no Spotify"
      className={cn(
        "group inline-flex items-center gap-2 rounded-full hairline bg-surface/70 text-ink",
        "transition-all duration-200 ease-cinematic select-none",
        "hover:bg-ink/5 hover:shadow-soft active:scale-[0.97]",
        isIcon ? "h-10 w-10 justify-center" : "h-10 pl-2 pr-4 text-sm",
        className,
      )}
    >
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 ease-cinematic group-hover:scale-105"
        style={{ background: SPOTIFY_GREEN }}
      >
        <SpotifyMark className="h-3.5 w-3.5 text-white" />
      </span>
      {!isIcon && (
        <span className="font-medium">Ouvir no Spotify</span>
      )}
    </a>
  );
}

/**
 * Mini Spotify mark (3 ondas + círculo). Inline SVG para evitar dependência
 * externa e permitir colorir via `currentColor` quando necessário.
 */
function SpotifyMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.94-.6-.12-.421.18-.84.6-.94 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.282 1.121zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
