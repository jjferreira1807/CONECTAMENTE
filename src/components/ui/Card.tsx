import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "card p-6 md:p-7 shadow-soft transition-shadow hover:shadow-glow",
        className
      )}
      {...rest}
    />
  );
}

export function GlassCard({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-2xl p-6 md:p-7", className)} {...rest} />;
}
