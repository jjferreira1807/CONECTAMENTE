import { Hero } from "@/components/marketing/Hero";
import { Problem } from "@/components/marketing/Problem";
import { Method } from "@/components/marketing/Method";
import { ProgramPreview } from "@/components/marketing/ProgramPreview";
import { Science } from "@/components/marketing/Science";
import { Testimonial } from "@/components/marketing/Testimonial";
import { CTA } from "@/components/marketing/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Method />
      <ProgramPreview />
      <Science />
      <Testimonial />
      <CTA />
    </>
  );
}
