import type { Metadata } from "next";
import { BellRing, Bot, CheckSquare, Image as ImageIcon, MessageSquareMore, BadgeCheck } from "lucide-react";
import { DashboardActionCenterSection } from "@/components/dashboard/dashboard-action-center";
import { DashboardAssetsSection } from "@/components/dashboard/dashboard-assets-section";
import { DashboardOpsSummarySection } from "@/components/dashboard/dashboard-ops-summary";
import { StatCard } from "@/components/admin/stat-card";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { WorkspaceApprovalsPanel } from "@/components/workspace/workspace-approvals-panel";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { WorkQueueSection } from "@/components/workflow/work-queue-section";
import { ClientPortalFooter } from "../components/client-portal-footer";
import { requireClientAccess } from "@/features/client-portal/access";
import { getClientUpdatesCenter } from "@/features/client-updates/server";
import { slugToLabel } from "@/lib/formatters";
import { getEnabledServices } from "@/lib/client-services";
import type { OperationsCenterMetricKey } from "@/features/operations-center/summary";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);
  return {
    title: `${clientName} Updates`,
    description: `Shared approvals, discussion, and next steps for ${clientName}`,
  };
}

export default async function ClientUpdatesPage({ params }: Props) {
  const { slug } = await params;
  const { scope, userId } = await requireClientAccess(slug);

  const [updates, enabledServices] = await Promise.all([
    getClientUpdatesCenter(slug, scope, userId),
    getEnabledServices(slug),
  ]);

  const metricIcons: Record<OperationsCenterMetricKey, typeof BadgeCheck> = {
    pending_approvals: BadgeCheck,
    open_discussions: MessageSquareMore,
    crm_follow_ups: CheckSquare,
    agent_follow_through: Bot,
    assets_needing_review: ImageIcon,
  };
  const showAssets =
    enabledServices?.includes("assets") ||
    (updates.assetSummary.metrics.find((metric) => metric.key === "total_assets")?.value ?? 0) > 0;
  const showCrm =
    enabledServices?.includes("crm") || updates.actionCenter.crmFollowUps.length > 0;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-bl from-violet-500/[0.08] to-transparent blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <BellRing className="h-4 w-4 text-cyan-400/70" />
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Updates Center
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Shared updates and next steps
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-white/60">
              Follow approvals, discussion, creative review, and agent follow-through in one place.
            </p>
          </div>
          {updates.snapshot.lastSharedEventAt ? (
            <div className="self-start rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60">
              Last shared update{" "}
              {new Date(updates.snapshot.lastSharedEventAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {updates.snapshot.metrics.map((metric) => {
          const Icon = metricIcons[metric.key];
          return (
            <StatCard
              key={metric.key}
              icon={Icon}
              iconColor="bg-white/[0.08] text-white/80"
              label={metric.label}
              sub={metric.detail}
              value={String(metric.value)}
              variant="glass"
            />
          );
        })}
      </div>

      <DashboardOpsSummarySection
        campaignHrefPrefix={`/client/${slug}/campaign`}
        description="A simple summary of the campaigns with the most open decisions, discussion, and next steps."
        emptyState="Your campaign workflows look clear right now."
        summary={updates.opsSummary}
        title="What needs attention"
        variant="client"
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <WorkspaceApprovalsPanel
          approvals={updates.approvals}
          canDecide
          title="Approvals waiting on you"
          description="Clear yes or no decisions that keep work moving."
          emptyState="No shared approvals are waiting right now."
        />
        <AgentOutcomesPanel
          assetHrefPrefix={`/client/${slug}/assets`}
          campaignHrefPrefix={`/client/${slug}/campaign`}
          crmHrefPrefix={`/client/${slug}/crm`}
          description="Visible agent work, recommendations, and triage connected to your account."
          eventHrefPrefix={`/client/${slug}/event`}
          outcomes={updates.agentOutcomes}
          title="Agent follow-through"
          variant="client"
        />
      </div>

      <DashboardActionCenterSection
        actionCenter={updates.actionCenter}
        assetHrefPrefix={`/client/${slug}/assets`}
        assetLibraryHref={`/client/${slug}/assets`}
        campaignHrefPrefix={`/client/${slug}/campaign`}
        crmHrefPrefix={`/client/${slug}/crm`}
        description="The most recent threads and relationship follow-ups that still need a response."
        eventHrefPrefix={`/client/${slug}/event`}
        showApprovals={false}
        showCrmFollowUps={showCrm}
        variant="client"
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <WorkQueueSection
          description="The cross-app work already assigned to you across campaigns, CRM, events, and creative workflow."
          emptyState="Nothing is directly assigned to you right now."
          showMetrics={false}
          summary={updates.assignedWorkQueue}
          title="Assigned to you"
          variant="client"
        />
        <WorkQueueSection
          description="The shared next steps across campaigns, CRM, events, and creative work that still need a human move."
          summary={updates.workQueue}
          title="Shared work queue"
          variant="client"
        />
      </div>

      {showAssets ? (
        <DashboardAssetsSection
          assetHrefPrefix={`/client/${slug}/assets`}
          description="Creative that still needs review or stronger campaign context."
          href={`/client/${slug}/assets`}
          libraryHrefLabel="Open assets"
          summary={updates.assetSummary}
          title="Creative review snapshot"
          variant="client"
        />
      ) : null}

      <WorkspaceActivityFeed
        events={updates.events}
        basePath={`/client/${slug}/workspace`}
        campaignHrefPrefix={`/client/${slug}/campaign`}
        crmHrefPrefix={`/client/${slug}/crm`}
        assetHrefPrefix={`/client/${slug}/assets`}
        eventHrefPrefix={`/client/${slug}/event`}
        title="Shared timeline"
        description="Recent shared work across campaigns, CRM, assets, events, and the workspace shell."
        emptyState="Shared updates will appear here as work moves through the system."
      />

      <ClientPortalFooter dataSource="database" />
    </div>
  );
}
