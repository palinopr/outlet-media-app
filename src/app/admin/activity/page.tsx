import type { Metadata } from "next";
import { Suspense } from "react";
import {
  BadgeCheck,
  Bot,
  CheckSquare,
  Image as ImageIcon,
  MessageSquareMore,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Card } from "@/components/ui/card";
import { getActivity } from "./data";
import { ActivityFilters } from "@/components/admin/activity/activity-filters";
import { ActivityTable } from "@/components/admin/activity/activity-table";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DashboardOpsSummarySection } from "@/components/dashboard/dashboard-ops-summary";
import { DashboardActionCenterSection } from "@/components/dashboard/dashboard-action-center";
import { DashboardAssetsSection } from "@/components/dashboard/dashboard-assets-section";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { getAdminOperationsCenter } from "@/features/operations-center/server";
import type { OperationsCenterMetricKey } from "@/features/operations-center/summary";

export const metadata: Metadata = { title: "Activity" };

interface Props {
  searchParams: Promise<{ user?: string; type?: string; range?: string }>;
}

export default async function ActivityPage({ searchParams }: Props) {
  const { user, type, range } = await searchParams;

  const selectedUser = user ?? "all";
  const selectedType = type ?? "all";
  const selectedRange = range ?? "7d";

  const [{ rows, stats, users, fromDb }, operations] = await Promise.all([
    getActivity({
      user: selectedUser !== "all" ? selectedUser : null,
      eventType: selectedType !== "all" ? selectedType : null,
      range: selectedRange,
    }),
    getAdminOperationsCenter(),
  ]);

  const metricIcons: Record<OperationsCenterMetricKey, typeof BadgeCheck> = {
    pending_approvals: BadgeCheck,
    open_discussions: MessageSquareMore,
    crm_follow_ups: CheckSquare,
    agent_follow_through: Bot,
    assets_needing_review: ImageIcon,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Activity"
        description="The shared operations center for approvals, discussions, agent follow-through, and the legacy audit log."
      >
        <span className="inline-flex items-center gap-1.5 rounded border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
          Shared backbone
        </span>
        {operations.snapshot.lastSharedEventAt ? (
          <span className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-muted-foreground">
            Last shared event{" "}
            {new Date(operations.snapshot.lastSharedEventAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        ) : null}
        {fromDb ? (
          <span className="inline-flex items-center gap-1.5 rounded border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Audit log live
          </span>
        ) : (
          <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400">
            Audit log unavailable
          </span>
        )}
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        {operations.snapshot.metrics.map((metric) => {
          const Icon = metricIcons[metric.key];
          return (
            <StatCard
              key={metric.key}
              label={metric.label}
              value={String(metric.value)}
              sub={metric.detail}
              icon={Icon}
              accent="from-white/[0.02] to-transparent"
              iconColor="text-[#0f7b6c]"
            />
          );
        })}
      </div>

      <DashboardOpsSummarySection
        campaignHrefPrefix="/admin/campaigns"
        description="The live campaign workload across approvals, next steps, discussions, and recent updates."
        emptyState="No campaigns need immediate operating attention right now."
        summary={operations.opsSummary}
        title="Operations summary"
        variant="admin"
      />

      <DashboardActionCenterSection
        actionCenter={operations.actionCenter}
        assetHrefPrefix="/admin/assets"
        assetLibraryHref="/admin/assets"
        campaignHrefPrefix="/admin/campaigns"
        crmHrefPrefix="/admin/crm"
        description="The highest-priority approvals, CRM follow-ups, and discussions that still need a human response."
        eventHrefPrefix="/admin/events"
        variant="admin"
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardAssetsSection
          assetHrefPrefix="/admin/assets"
          description="Creative that still needs review or campaign context."
          href="/admin/assets"
          libraryHrefLabel="Open asset queue"
          showClientSlug
          summary={operations.assetSummary}
          title="Creative pressure"
          variant="admin"
        />
        <AgentOutcomesPanel
          assetHrefPrefix="/admin/assets"
          canCreateActionItems
          campaignHrefPrefix="/admin/campaigns"
          crmHrefPrefix="/admin/crm"
          description="Agent work that is still queued, unresolved, or ready to turn into next steps."
          eventHrefPrefix="/admin/events"
          outcomes={operations.agentOutcomes}
          title="Agent follow-through"
          variant="admin"
        />
      </div>

      <WorkspaceActivityFeed
        assetHrefPrefix="/admin/assets"
        campaignHrefPrefix="/admin/campaigns"
        crmHrefPrefix="/admin/crm"
        events={operations.events}
        eventHrefPrefix="/admin/events"
        basePath="/admin/workspace"
        title="Shared operations activity"
        description="Recent work across campaigns, events, CRM, assets, and the workspace shell."
        emptyState="Shared activity will appear here as work moves through the system."
        showClientSlug
      />

      <Card className="border-border/60">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 pb-2">
          <div>
            <p className="text-sm font-semibold">
              Legacy admin audit log
              <span className="ml-1.5 font-normal text-muted-foreground">({rows.length})</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Direct admin page views, actions, and errors. Keep this as a lower-level audit trail behind the shared operations center.
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>{stats.totalToday} events today</span>
              <span>&middot;</span>
              <span>{stats.activeUsersToday} active users</span>
              <span>&middot;</span>
              <span>{stats.errorsToday} errors</span>
              <span>&middot;</span>
              <span>Most active page {stats.mostActivePage?.replace("/admin/", "") ?? "--"}</span>
            </div>
          </div>
          <Suspense>
            <ActivityFilters users={users} />
          </Suspense>
        </div>
        <ActivityTable rows={rows} />
      </Card>
    </div>
  );
}
