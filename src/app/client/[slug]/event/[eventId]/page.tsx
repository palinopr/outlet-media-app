import { redirect } from "next/navigation";

interface EventDetailPageProps {
  params: Promise<{ slug: string; eventId: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  redirect(`/client/${slug}/campaigns`);
}
