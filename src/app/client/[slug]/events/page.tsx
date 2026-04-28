import { redirect } from "next/navigation";

interface ClientEventsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ClientEventsPage({ params }: ClientEventsPageProps) {
  const { slug } = await params;
  redirect(`/client/${slug}/campaigns`);
}
