"use client";
import { motion } from "framer-motion";

/**
 * Triple concentric progress rings — Apple Health style.
 *
 * Each ring is a percentage in [0, 1] with its own colour and label.
 * The rings are slightly rotated and use round caps for the soft "wellness"
 * feel. Inner halo glows when any ring nears completion.
 */
interface RingSpec {
  value: number;     // 0..1
  color: string;     // CSS colour (any valid stroke)
  bg: string;        // CSS colour for the unfilled track
  label?: string;    // Optional; for screen readers if no legend is supplied
}

interface Props {
  size?: number;
  stroke?: number;
  gap?: number;
  rings: [RingSpec, RingSpec, RingSpec];
  center?: { value: string; sub?: string };
}

export function TripleRing({
  size = 220,
  stroke = 14,
  gap = 4,
  rings,
  center,
}: Props) {
  const r1 = (size - stroke) / 2;
  const r2 = r1 - stroke - gap;
  const r3 = r2 - stroke - gap;
  const cx = size / 2;
  const radii = [r1, r2, r3] as const;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden style={{ transform: "rotate(-90deg)" }}>
        {rings.map((ring, i) => {
          const r = radii[i];
          const c = 2 * Math.PI * r;
          const v = Math.min(1, Math.max(0, ring.value));
          return (
            <g key={i}>
              <circle
                cx={cx} cy={cx} r={r}
                fill="none"
                stroke={ring.bg}
                strokeWidth={stroke}
              />
              <motion.circle
                cx={cx} cy={cx} r={r}
                fill="none"
                stroke={ring.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                style={{
                  strokeDasharray: c,
                  filter: v >= 0.95 ? `drop-shadow(0 0 8px ${ring.color})` : undefined,
                }}
                initial={{ strokeDashoffset: c }}
                animate={{ strokeDashoffset: c * (1 - v) }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </g>
          );
        })}
      </svg>
      {center && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-serif text-3xl tabular-nums">{center.value}</p>
          {center.sub && <p className="text-xs text-muted mt-0.5">{center.sub}</p>}
        </div>
      )}
    </div>
  );
}

/**
 * Legend strip — one line per ring, with coloured dot, label, value.
 */
export function TripleRingLegend({ rings }: { rings: { label: string; value: string; color: string }[] }) {
  return (
    <ul className="space-y-3">
      {rings.map((r) => (
        <li key={r.label} className="flex items-center gap-3 text-sm">
          <span
            aria-hidden
            className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
            style={{ background: r.color, boxShadow: `0 0 8px ${r.color}` }}
          />
          <span className="text-muted">{r.label}</span>
          <span className="ml-auto font-medium tabular-nums">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}
