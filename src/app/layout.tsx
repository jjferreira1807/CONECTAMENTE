import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProgressHydrator } from "@/components/ProgressHydrator";
import { Atmosphere } from "@/components/Atmosphere";
import { IntroCutscene } from "@/components/IntroCutscene";
import { IntroBlocker } from "@/components/IntroBlocker";
import { PageTransition } from "@/components/PageTransition";
import { AppReadyProvider } from "@/components/AppReady";

// Explicit weights + extended Latin (PT-PT diacritics). Specifying weights
// helps next/font pre-compute size-adjusted fallbacks accurately, eliminating
// CLS during font swap.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});
const lora = Lora({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-lora",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://conectamente.pt";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Conectamente — Reaprende a tua relação com a internet",
    template: "%s · Conectamente",
  },
  description:
    "Programa digital de bem-estar baseado em Terapia Cognitivo-Comportamental para adultos com uso excessivo da internet, ansiedade, isolamento e dificuldades de sono.",
  keywords: [
    "uso excessivo da internet", "TCC", "terapia cognitivo-comportamental",
    "saúde mental", "ansiedade", "sono", "mindfulness", "Portugal",
  ],
  authors: [{ name: "Conectamente" }],
  openGraph: {
    title: "Conectamente",
    description: "Reaprende a tua relação com a internet — em 12 sessões guiadas.",
    locale: "pt_PT",
    type: "website",
    siteName: "Conectamente",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Conectamente" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conectamente",
    description: "Reaprende a tua relação com a internet — em 12 sessões guiadas.",
    images: ["/og.jpg"],
  },
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  colorScheme: "dark light",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F2EB" },
    { media: "(prefers-color-scheme: dark)", color: "#06090E" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-PT"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable}`}
    >
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:text-bg focus:px-4 focus:py-2"
        >
          Saltar para o conteúdo principal
        </a>

        {/* Pre-paint blocker — black overlay rendered server-side. The
            client-side IntroCutscene either fades it out (returning visitor)
            or transitions into the full cinematic experience. */}
        <IntroBlocker />

        <ThemeProvider>
          <AppReadyProvider>
            <ProgressHydrator />
            <Atmosphere />
            {/* Suspense gate: IntroCutscene reads useSearchParams which would
                otherwise opt the entire app into dynamic rendering. */}
            <Suspense fallback={null}>
              <IntroCutscene />
            </Suspense>
            <SiteHeader />
            <main id="main" className="pt-20">
              <PageTransition>{children}</PageTransition>
            </main>
            <SiteFooter />
          </AppReadyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
