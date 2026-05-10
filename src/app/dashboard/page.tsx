import { Container } from "@/components/ui/Container";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "O teu progresso, intenções e check-ins.",
};

export default function DashboardPage() {
  return (
    <Container className="py-12 md:py-20">
      <DashboardClient />
    </Container>
  );
}
