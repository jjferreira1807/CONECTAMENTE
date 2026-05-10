import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container mx-auto max-w-6xl px-5 md:px-8", className)} {...rest} />;
}
