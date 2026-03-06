import type { Metadata } from "next";
import { BadgeCheck, Clock3, Image as ImageIcon, Megaphone } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { WorkspaceApprovalsPanel } from "@/components/workspace/workspace-approvals-panel";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { ClientPortalFooter } from "../components/client-portal-footer";
import { getClientApprovalsCenter } from "@/features/approvals/center";
import type { ApprovalCenterMetricKey } from "@/features/approvals/summary";
import { requireClientAccess } from "@/features/client-portal/access";
import { slugToLabel } from "@/lib/formatters";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);
  return {
    title: `${clientName} Approvals`,
    description: `Pending and recent approvals for ${clientName}`,
  };
}

export default async function ClientApprovalsPage({ params }: Props) {
  const { slug } = await params;
  const { scope } = await requireClientAccess(slug);
  const center = await getClientApprovalsCenter(slug, scope);

  const metricIcons: Record<ApprovalCenterMetricKey, typeof BadgeCheck> = {
    pending_approvals: BadgeCheck,
    stale_pending: Clock3,
    recently_resolved: BadgeCheck,
    asset_reviews: ImageIcon,
    campaign_linked: Megaphone,
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.08] via-sky-500/[0.04] to-transparent" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-gradient-to-tl from-amber-400/[0.08] to-transparent blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-cyan-300/80" />
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                Approvals Center
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Decisions that keep work moving
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-white/60">
              Review open requests, confirm recent decisions, and follow the approval timeline in one place.
            </p>
          </div>
          <div className="self-start rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60">
            Shared approval workflow
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {center.summary.metrics.map((metric) => {
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

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <WorkspaceApprovalsPanel
          approvals={center.pending}
          assetHrefPrefix={`/client/${slug}/assets`}
          campaignHrefPrefix={`/client/${slug}/campaign`}
          canDecide
          crmHrefPrefix={`/client/${slug}/crm`}
          description="Clear yes or no decisions that keep campaigns, creative review, and shared work moving."
          emptyState="No shared approvals are waiting right now."
          eventHrefPrefix={`/client/${slug}/event`}
          title="Waiting on you"
          workspaceHrefPrefix={`/client/${slug}/workspace`}
        />
        <WorkspaceApprovalsPanel
          approvals={center.recent}
          assetHrefPrefix={`/client/${slug}/assets`}
          campaignHrefPrefix={`/client/${slug}/campaign`}
          canDecide={false}
          crmHrefPrefix={`/client/${slug}/crm`}
          description="The most recent approval outcomes across your shared work."
          emptyState="No recent approval decisions yet."
          eventHrefPrefix={`/client/${slug}/event`}
          title="Recently resolved"
          workspaceHrefPrefix={`/client/${slug}/workspace`}
        />
      </div>

      <WorkspaceActivityFeed
        assetHrefPrefix={`/client/${slug}/assets`}
        basePath={`/client/${slug}/workspace`}
        campaignHrefPrefix={`/client/${slug}/campaign`}
        crmHrefPrefix={`/client/${slug}/crm`}
        description="A running timeline of approval requests, decisions, and related follow-through."
        emptyState="Approval updates will appear here as work moves through the system."
        events={center.events}
        eventHrefPrefix={`/client/${slug}/event`}
        title="Approval timeline"
      />

      <ClientPortalFooter dataSource="database" />
    </div>
  );
}
