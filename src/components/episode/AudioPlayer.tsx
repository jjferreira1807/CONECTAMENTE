"use client";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  /** Não usado — mantido para compatibilidade com o SectionRenderer e o
   *  formato de `episodes.ts`. O playback é feito no Spotify. */
  src?: string;
  title: string;
  subtitle?: string;
  /** Não usado — mantido para compatibilidade. */
  onTick?: (secondsElapsed: number) => void;
}

/**
 * Cartão de áudio — passou a redireccionar para o podcast oficial no
 * Spotify em vez de reproduzir localmente. Mantém o vocabulário visual
 * do player original (card elevado, ambient halo, waveform decorativa)
 * para a página do episódio continuar coerente; mas o botão central
 * abre o show no Spotify, em nova aba, sem expor o utilizador.
 *
 * O Props interface foi mantido propositadamente — `src` e `onTick`
 * são ignorados mas o SectionRenderer e os dados em `episodes.ts` não
 * precisam de mudar.
 */
const SPOTIFY_URL = "https://open.spotify.com/show/033hKTDvkeAxNPdxY9V3ia";
const SPOTIFY_GREEN = "#1DB954";

export function AudioPlayer({ title, subtitle }: Props) {
  return (
    <div className="relative">
      {/* Ambient halo — herdado da versão anterior, mais subtil. Dark mode
          fica plano: o brilho radial parecia descolado do fundo escuro. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[2rem] dark:hidden"
        style={{
          background:
            "radial-gradient(60% 70% at 30% 20%, rgb(var(--accent) / 0.18), transparent 70%), radial-gradient(50% 60% at 80% 80%, rgb(var(--accent-2) / 0.14), transparent 70%)",
          filter: "blur(28px)",
        }}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <a
        href={SPOTIFY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir "${title}" no Spotify`}
        className="relative card p-5 md:p-7 shadow-cinematic bg-elevated/85 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <div className="flex items-center gap-4 md:gap-5">
          <Waveform />

          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted inline-flex items-center gap-2">
              <SpotifyMark
                className="h-3.5 w-3.5"
                style={{ color: SPOTIFY_GREEN }}
              />
              {subtitle ?? "Ouvir no Spotify"}
            </p>
            <p className="font-medium truncate mt-1">{title}</p>
          </div>

          <SpotifyCta />
        </div>
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function SpotifyCta() {
  return (
    <motion.span
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative z-[1] inline-flex items-center gap-2 rounded-full px-4 h-12 text-sm font-medium text-white",
        "shadow-ambient",
      )}
      style={{ background: SPOTIFY_GREEN }}
    >
      <SpotifyMark className="h-4 w-4 text-white" />
      Ouvir no Spotify
      <ExternalLink className="h-3.5 w-3.5 opacity-80" />
    </motion.span>
  );
}

function Waveform() {
  return (
    <div
      aria-hidden
      className="hidden sm:flex items-center gap-[3px] h-12 w-24 origin-center"
    >
      {WAVE_HEIGHTS.map((h, i) => (
        <span
          key={i}
          className="block w-[3px] rounded-full bg-gradient-to-t from-accent to-accent2"
          style={{
            height: `${h * 100}%`,
            opacity: 0.55,
          }}
        />
      ))}
    </div>
  );
}

const WAVE_HEIGHTS = [
  0.35, 0.55, 0.78, 0.42, 0.68, 0.92, 0.5, 0.72,
  0.88, 0.6, 0.45, 0.82, 0.95, 0.5, 0.7, 0.4,
  0.62, 0.85, 0.55, 0.4, 0.78, 0.6, 0.45, 0.32,
];

function SpotifyMark({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.94-.6-.12-.421.18-.84.6-.94 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.282 1.121zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
