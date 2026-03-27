import { redirect } from "next/navigation";

interface ClientReportsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ClientReportsPage({ params }: ClientReportsPageProps) {
  const { slug } = await params;

  redirect(`/client/${slug}/campaigns`);
}
