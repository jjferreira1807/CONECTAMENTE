"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Conectamente logomark — neural + balance.
 *
 * Concept: a sphere (the mind) with internal neural connections converging to
 * a single point of balance, plus an offset orb representing equilibrium with
 * the digital world. Works at 24px to 240px.
 *
 *   • Static version    → identical to animated frame, used in head <link>
 *                         icons, footer, dense UI.
 *   • Animated version  → strokes draw in, dots pulse, soft halo breathes.
 *                         Used on intro loader, hero, login.
 */

interface Props {
  size?: number;
  animated?: boolean;
  variant?: "dual" | "mono"; // dual = green + amber; mono = single colour
  className?: string;
}

export function Logomark({ size = 36, animated = false, variant = "dual", className }: Props) {
  // Coordinates designed in a 64×64 viewBox.
  // Outer ring + 5 nodes + balance dot.
  const nodes = [
    { x: 32, y: 14 }, // top
    { x: 50, y: 24 }, // upper-right
    { x: 50, y: 44 }, // lower-right
    { x: 32, y: 54 }, // bottom
    { x: 14, y: 34 }, // left
  ];
  const center = { x: 32, y: 34 };
  // Connections: each node to centre + to its neighbours
  const lines: [number, number][] = [];
  nodes.forEach((_, i) => lines.push([i, -1])); // to centre
  for (let i = 0; i < nodes.length; i++) {
    lines.push([i, (i + 1) % nodes.length]);
  }

  const stroke = "rgb(var(--accent))";
  const strokeAmber = "rgb(var(--accent-2))";

  const drawTransition = (delay: number) => ({
    duration: animated ? 1.4 : 0,
    delay,
    ease: [0.22, 1, 0.36, 1] as const,
  });

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Conectamente"
    >
      <defs>
        <radialGradient id="cm-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.45" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cm-line" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.85" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Soft halo (only animated mode renders it) */}
      {animated && (
        <motion.circle
          cx={32} cy={34} r={26}
          fill="url(#cm-glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Outer ring */}
      <motion.circle
        cx={32} cy={34} r={22}
        fill="none"
        stroke={stroke}
        strokeWidth={1.4}
        strokeOpacity={0.4}
        initial={animated ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={drawTransition(0)}
      />

      {/* Connections */}
      {lines.map(([a, b], i) => {
        const start = nodes[a];
        const end = b === -1 ? center : nodes[b];
        return (
          <motion.line
            key={i}
            x1={start.x} y1={start.y}
            x2={end.x}   y2={end.y}
            stroke="url(#cm-line)"
            strokeWidth={1}
            strokeLinecap="round"
            initial={animated ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.7 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={drawTransition(0.15 + i * 0.07)}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r={2.2}
          fill={stroke}
          initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: animated ? 0.6 + i * 0.08 : 0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {/* Centre node */}
      <motion.circle
        cx={center.x} cy={center.y} r={3}
        fill={stroke}
        initial={animated ? { scale: 0 } : { scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ delay: animated ? 1.2 : 0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Balance dot — amber, offset, breathing */}
      {variant === "dual" && (
        <motion.circle
          cx={48} cy={50} r={3.5}
          fill={strokeAmber}
          initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 0.95 }}
          animate={
            animated
              ? { scale: [0, 1.15, 1], opacity: [0, 1, 0.95] }
              : { scale: 1, opacity: 0.95 }
          }
          transition={{ delay: animated ? 1.5 : 0, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------------ */

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-serif tracking-tight", className)}>
      Conectamente
    </span>
  );
}

export function LogoLockup({
  size = 32,
  animated = false,
  className,
}: { size?: number; animated?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Logomark size={size} animated={animated} />
      <Wordmark className="text-lg" />
    </span>
  );
}
