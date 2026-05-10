"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/Button";
import { cn } from "@/lib/cn";
import { Logomark } from "./brand/Logomark";

const links = [
  { href: "/programa", label: "Programa" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/fichas", label: "Fichas" },
  { href: "/estatisticas", label: "Progresso" },
  { href: "/sobre", label: "Sobre" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4"
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-6xl px-5 md:px-8",
          scrolled && "transition-all"
        )}
      >
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-3 md:px-4 h-14 transition-all duration-500 ease-cinematic",
            scrolled ? "glass-strong shadow-cinematic" : "bg-transparent"
          )}
          aria-label="Principal"
        >
          <Link href="/" className="flex items-center gap-2.5 pl-2 group">
            <Logomark size={30} />
            <span className="font-serif text-lg tracking-tight">Conectamente</span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "px-3.5 py-2 text-sm rounded-full transition-colors",
                      active ? "text-ink bg-ink/5" : "text-muted hover:text-ink hover:bg-ink/5"
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden md:inline-flex" />
            <Link href="/entrar" className="hidden md:inline-flex">
              <Button size="sm" variant="subtle">Entrar</Button>
            </Link>
            <Link href="/programa" className="hidden md:inline-flex">
              <Button size="sm" variant="premium">Começar</Button>
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hairline bg-surface/80"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl p-3 shadow-soft">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block px-3 py-2.5 text-sm rounded-xl hover:bg-ink/5"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="flex items-center justify-between px-3 pt-3 border-t border-border mt-2">
                <ThemeToggle />
                <div className="flex gap-2">
                  <Link href="/entrar"><Button size="sm" variant="subtle">Entrar</Button></Link>
                  <Link href="/programa"><Button size="sm">Começar</Button></Link>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

