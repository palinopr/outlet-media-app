import { BadgeCheck, Clock3, Image as ImageIcon, Megaphone } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { ClientFilter } from "@/components/admin/campaigns/client-filter";
import { WorkspaceApprovalsPanel } from "@/components/workspace/workspace-approvals-panel";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { getAdminApprovalsCenter } from "@/features/approvals/center";
import type { ApprovalCenterMetricKey } from "@/features/approvals/summary";
import { slugToLabel } from "@/lib/formatters";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata = { title: "Approvals" };

interface Props {
  searchParams: Promise<{ client?: string }>;
}

export default async function AdminApprovalsPage({ searchParams }: Props) {
  const { client } = await searchParams;
  const clientSlug = client && client !== "all" ? client : null;

  const [center, clientsRes] = await Promise.all([
    getAdminApprovalsCenter(clientSlug),
    supabaseAdmin?.from("clients").select("slug").order("name", { ascending: true }),
  ]);

  const clients = ((clientsRes?.data ?? []) as { slug: string | null }[])
    .map((row) => row.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);

  const metricIcons: Record<ApprovalCenterMetricKey, typeof BadgeCheck> = {
    pending_approvals: BadgeCheck,
    stale_pending: Clock3,
    recently_resolved: BadgeCheck,
    asset_reviews: ImageIcon,
    campaign_linked: Megaphone,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Approvals"
        description="Cross-app decision queue for campaigns, creative, workspace requests, and client-visible changes."
      >
        <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
          {clientSlug ? slugToLabel(clientSlug) : "All clients"}
        </span>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        {center.summary.metrics.map((metric) => {
          const Icon = metricIcons[metric.key];
          return (
            <StatCard
              key={metric.key}
              accent="from-cyan-500/18 to-emerald-500/10"
              icon={Icon}
              iconColor="text-cyan-300"
              label={metric.label}
              sub={metric.detail}
              value={String(metric.value)}
            />
          );
        })}
      </div>

      {clients.length > 0 ? (
        <div className="flex justify-end">
          <ClientFilter clients={clients} />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <WorkspaceApprovalsPanel
          approvals={center.pending}
          assetHrefPrefix="/admin/assets"
          campaignHrefPrefix="/admin/campaigns"
          canDecide
          crmHrefPrefix="/admin/crm"
          description="The highest-priority approvals that still need a human decision."
          emptyState="No approvals are waiting right now."
          eventHrefPrefix="/admin/events"
          showClientSlug
          title="Pending decisions"
          workspaceHrefPrefix="/admin/workspace"
        />
        <WorkspaceApprovalsPanel
          approvals={center.recent}
          assetHrefPrefix="/admin/assets"
          campaignHrefPrefix="/admin/campaigns"
          canDecide={false}
          crmHrefPrefix="/admin/crm"
          description="Recent yes/no outcomes across all approval flows."
          emptyState="No recent approval decisions yet."
          eventHrefPrefix="/admin/events"
          showClientSlug
          title="Recently resolved"
          workspaceHrefPrefix="/admin/workspace"
        />
      </div>

      <WorkspaceActivityFeed
        assetHrefPrefix="/admin/assets"
        basePath="/admin/workspace"
        campaignHrefPrefix="/admin/campaigns"
        crmHrefPrefix="/admin/crm"
        description="Recent approval requests, decisions, and related handoffs on the shared backbone."
        emptyState="Approval activity will appear here as requests and decisions move through the system."
        events={center.events}
        eventHrefPrefix="/admin/events"
        showClientSlug
        title="Approval timeline"
      />
    </div>
  );
}
