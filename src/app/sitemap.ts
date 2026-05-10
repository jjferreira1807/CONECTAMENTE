import type { MetadataRoute } from "next";
import { episodes } from "@/content/episodes";
import { worksheets } from "@/content/worksheets";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://conectamente.pt";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ["", "/programa", "/dashboard", "/fichas", "/estatisticas", "/sobre", "/sos", "/intro", "/entrar"];
  const lastModified = new Date();
  return [
    ...fixed.map((p) => ({
      url: BASE + p,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...episodes.map((e) => ({
      url: `${BASE}/programa/${e.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...worksheets.map((w) => ({
      url: `${BASE}/fichas/${w.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
