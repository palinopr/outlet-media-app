"use client";

import { DashboardOpsSummarySection } from "@/components/dashboard/dashboard-ops-summary";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { WorkQueueSection } from "@/components/workflow/work-queue-section";
import type { AgentOutcomeView } from "@/features/agent-outcomes/summary";
import type { DashboardOpsSummary } from "@/features/dashboard/summary";
import type { SystemEvent } from "@/features/system-events/server";
import type { WorkQueueSummary } from "@/features/work-queue/summary";

interface ClientOverviewTabProps {
  agentOutcomes: AgentOutcomeView[];
  clientSlug: string;
  opsSummary: DashboardOpsSummary;
  recentActivity: SystemEvent[];
  workQueue: WorkQueueSummary;
}

export function ClientOverviewTab({
  agentOutcomes,
  clientSlug,
  opsSummary,
  recentActivity,
  workQueue,
}: ClientOverviewTabProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)]">
      <div className="space-y-6">
        <DashboardOpsSummarySection
          campaignHrefPrefix="/admin/campaigns"
          description="Workflow pressure, open decisions, and shared campaign momentum for this client account."
          emptyState="This client account does not have any flagged campaign workflows right now."
          summary={opsSummary}
          title="Client workflow overview"
          variant="admin"
        />
        <WorkQueueSection
          description="Cross-app next steps tied to this client across campaigns, CRM, events, and creative review."
          summary={workQueue}
          title="Client work queue"
          variant="admin"
        />
      </div>

      <div className="space-y-6">
        <AgentOutcomesPanel
          assetHrefPrefix="/admin/assets"
          canCreateActionItems
          campaignHrefPrefix="/admin/campaigns"
          crmHrefPrefix="/admin/crm"
          description="Bounded agent work requested for this client account and the follow-through that came back."
          eventHrefPrefix="/admin/events"
          outcomes={agentOutcomes}
          title="Agent follow-through"
          variant="admin"
        />
        <WorkspaceActivityFeed
          assetHrefPrefix="/admin/assets"
          basePath="/admin/workspace"
          campaignHrefPrefix="/admin/campaigns"
          crmHrefPrefix="/admin/crm"
          description="Recent shared workflow movement across this client account."
          eventHrefPrefix="/admin/events"
          events={recentActivity}
          title={`${clientSlug} activity`}
        />
      </div>
    </div>
  );
}
