import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

/**
 * Soft, glassy card. Default has a subtle border and modest blur; on hover,
 * lifts very slightly and gains an ambient glow ring.
 */
export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "card p-6 md:p-7 shadow-soft",
        "transition-all duration-500 ease-cinematic",
        "hover:shadow-glow hover:border-accent/30",
        className
      )}
      {...rest}
    />
  );
}

export function GlassCard({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-2xl p-6 md:p-7", className)} {...rest} />;
}

/**
 * "Hero" card with a subtle gradient halo and stronger glass.
 */
export function FeatureCard({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-6 md:p-7",
        "bg-gradient-to-br from-elevated/90 to-surface/70",
        "border border-border/60 backdrop-blur-md shadow-cinematic",
        "transition-all duration-500 ease-cinematic",
        "hover:border-accent/30",
        className
      )}
      {...rest}
    />
  );
}
