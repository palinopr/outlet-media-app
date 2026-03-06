import { notFound } from "next/navigation";
import { getClientDetail } from "../data";
import { ClientDetailView } from "@/components/admin/clients/client-detail";
import { getDashboardOpsSummary } from "@/features/dashboard/server";
import { listSystemEvents } from "@/features/system-events/server";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { getWorkQueue } from "@/features/work-queue/server";
import { getEventOperationsSummary } from "@/features/events/server";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const client = await getClientDetail(id);
  if (!client) notFound();

  const [opsSummary, recentActivity, agentOutcomes, workQueue, eventOperations] =
    await Promise.all([
      getDashboardOpsSummary({
        clientSlug: client.slug,
        limit: 5,
        mode: "admin",
      }),
      listSystemEvents({
        audience: "all",
        clientSlug: client.slug,
        limit: 8,
      }),
      listAgentOutcomes({
        audience: "all",
        clientSlug: client.slug,
        limit: 5,
      }),
      getWorkQueue({
        clientSlug: client.slug,
        limit: 8,
        mode: "admin",
      }),
      getEventOperationsSummary({
        clientSlug: client.slug,
        limit: 5,
        mode: "admin",
      }),
    ]);

  return (
    <ClientDetailView
      agentOutcomes={agentOutcomes}
      client={client}
      eventOperations={eventOperations}
      opsSummary={opsSummary}
      recentActivity={recentActivity}
      workQueue={workQueue}
    />
  );
}
