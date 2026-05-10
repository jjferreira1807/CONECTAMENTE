interface Props {
  value: number;        // 0..1
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({
  value, size = 120, stroke = 8, label, sublabel,
}: Props) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const v = Math.min(1, Math.max(0, value));
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Progresso ${Math.round(v * 100)}%`}
    >
      <svg width={size} height={size} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-border" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          className="stroke-accent transition-[stroke-dashoffset] duration-700 ease-out"
          strokeWidth={stroke} strokeLinecap="round"
          style={{
            strokeDasharray: C,
            strokeDashoffset: C * (1 - v),
            transform: "rotate(-90deg)",
            transformOrigin: "center",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <p className="font-serif text-2xl tabular-nums">{label}</p>}
        {sublabel && <p className="text-xs text-muted mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}
