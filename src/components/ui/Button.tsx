"use client";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline" | "subtle" | "premium";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-bg hover:opacity-90 active:scale-[0.97] shadow-soft",
  premium:
    "relative bg-gradient-to-br from-accent to-accent2 text-bg shadow-ambient hover:brightness-110 active:scale-[0.97]",
  ghost:
    "bg-transparent text-ink hover:bg-ink/5 active:scale-[0.97]",
  outline:
    "bg-transparent text-ink hairline hover:bg-ink/5 backdrop-blur active:scale-[0.97]",
  subtle:
    "bg-ink/5 text-ink hover:bg-ink/10 backdrop-blur active:scale-[0.97]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-full",
  md: "h-11 px-5 text-[15px] rounded-full",
  lg: "h-12 px-6 text-base rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition duration-200 ease-cinematic select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
