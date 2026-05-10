import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { worksheets, getWorksheet } from "@/content/worksheets";
import { WorksheetView } from "@/components/worksheets/WorksheetView";
import type { Metadata } from "next";

export function generateStaticParams() {
  return worksheets.map((w) => ({ slug: w.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const w = getWorksheet(params.slug);
  return {
    title: w?.title ?? "Ficha",
    description: w?.description,
  };
}

export default function WorksheetPage({ params }: { params: { slug: string } }) {
  const w = getWorksheet(params.slug);
  if (!w) notFound();
  return (
    <Container className="py-10 md:py-16">
      <WorksheetView worksheet={w} />
    </Container>
  );
}
