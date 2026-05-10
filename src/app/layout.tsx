import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProgressHydrator } from "@/components/ProgressHydrator";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
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
    "uso excessivo da internet",
    "TCC",
    "terapia cognitivo-comportamental",
    "saúde mental",
    "ansiedade",
    "sono",
    "mindfulness",
    "Portugal",
  ],
  authors: [{ name: "Conectamente" }],
  openGraph: {
    title: "Conectamente",
    description:
      "Reaprende a tua relação com a internet — em 12 sessões guiadas.",
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
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0C1016" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" suppressHydrationWarning className={`${inter.variable} ${lora.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:text-bg focus:px-4 focus:py-2"
        >
          Saltar para o conteúdo principal
        </a>
        <ThemeProvider>
          <ProgressHydrator />
          <SiteHeader />
          <main id="main" className="pt-20">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
