import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { slugToLabel } from "@/lib/formatters";

interface ClientReportsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ClientReportsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);

  return {
    title: `${clientName} Campaigns`,
    description: `Campaign performance for ${clientName}`,
  };
}

export default async function ClientReportsPage({ params }: ClientReportsPageProps) {
  const { slug } = await params;
  redirect(`/client/${slug}/campaigns`);
}
