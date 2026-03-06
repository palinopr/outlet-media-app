import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { requireClientAccess } from "@/features/client-portal/access";
import { getWorkspacePages } from "@/features/workspace/server";
import { PageList } from "@/components/workspace/page-list";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { WorkspaceApprovalsPanel } from "@/components/workspace/workspace-approvals-panel";
import { WorkQueueSection } from "@/components/workflow/work-queue-section";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { listApprovalRequests } from "@/features/approvals/server";
import { filterSystemEventsByClientScope, listSystemEvents } from "@/features/system-events/server";
import { getWorkQueue } from "@/features/work-queue/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClientWorkspacePage({ params }: Props) {
  const { slug } = await params;
  const { scope, userId } = await requireClientAccess(slug, "workspace");
  const [{ pages }, rawEvents, approvals, workQueue, assignedWorkQueue, agentOutcomes] = await Promise.all([
    getWorkspacePages(slug),
    listSystemEvents({ audience: "shared", clientSlug: slug, limit: 12 }),
    listApprovalRequests({
      audience: "shared",
      clientSlug: slug,
      scope,
      status: "pending",
      limit: 8,
    }),
    getWorkQueue({
      clientSlug: slug,
      limit: 6,
      mode: "client",
      scope,
    }),
    getWorkQueue({
      assigneeId: userId,
      clientSlug: slug,
      limit: 4,
      mode: "client",
      scope,
    }),
    listAgentOutcomes({
      audience: "shared",
      clientSlug: slug,
      limit: 6,
      scopeCampaignIds: scope?.allowedCampaignIds ?? null,
      scopeEventIds: scope?.allowedEventIds ?? null,
    }),
  ]);
  const events = await filterSystemEventsByClientScope(slug, rawEvents, {
    allowedCampaignIds: scope?.allowedCampaignIds ?? null,
    allowedEventIds: scope?.allowedEventIds ?? null,
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-8">
      <div>
        <p className="text-sm font-medium text-[#9b9a97]">Workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#2f2f2f]">
          Shared documents and notes
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#787774]">
          This is the shared workspace for plans, updates, and context your team can review together.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <PageList pages={pages} basePath={`/client/${slug}/workspace`} />
        <div className="space-y-6">
          <WorkQueueSection
            description="The shared cross-app work already assigned to you."
            emptyState="Nothing is directly assigned to you right now."
            showMetrics={false}
            summary={assignedWorkQueue}
            title="Assigned to you"
            variant="client"
          />
          <WorkQueueSection
            description="The shared next steps across campaigns, CRM, events, and creative work."
            summary={workQueue}
            title="Shared work queue"
            variant="client"
          />
          <WorkspaceApprovalsPanel approvals={approvals} canDecide />
          <AgentOutcomesPanel
            outcomes={agentOutcomes}
            title="Agent follow-through"
            description="Agent work and recommendations attached to the same shared workflows behind this workspace."
            campaignHrefPrefix={`/client/${slug}/campaign`}
            crmHrefPrefix={`/client/${slug}/crm`}
            assetHrefPrefix={`/client/${slug}/assets`}
            eventHrefPrefix={`/client/${slug}/event`}
            variant="client"
          />
          <WorkspaceActivityFeed
            events={events}
            basePath={`/client/${slug}/workspace`}
            campaignHrefPrefix={`/client/${slug}/campaign`}
            crmHrefPrefix={`/client/${slug}/crm`}
            assetHrefPrefix={`/client/${slug}/assets`}
            eventHrefPrefix={`/client/${slug}/event`}
          />
        </div>
      </div>
    </div>
  );
}
