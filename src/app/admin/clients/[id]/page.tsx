import { notFound } from "next/navigation";
import { getClientDetail } from "../data";
import { ClientDetailView } from "@/components/admin/clients/client-detail";
import { getEventOperationsSummary } from "@/features/events/server";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const client = await getClientDetail(id);
  if (!client) notFound();

  const eventOperations = await getEventOperationsSummary({
    clientSlug: client.slug,
    limit: 5,
    mode: "admin",
  });

  return <ClientDetailView client={client} eventOperations={eventOperations} />;
}
