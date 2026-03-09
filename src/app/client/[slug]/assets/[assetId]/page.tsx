import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CheckSquare,
  Image as ImageIcon,
  Link2,
  Video,
} from "lucide-react";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { AssetCommentsPanel } from "@/components/assets/asset-comments-panel";
import { AssetFollowUpItemsPanel } from "@/components/assets/asset-follow-up-items-panel";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { WorkspaceApprovalsPanel } from "@/components/workspace/workspace-approvals-panel";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { listAssetComments } from "@/features/asset-comments/server";
import { listAssetFollowUpItems } from "@/features/asset-follow-up-items/server";
import { listAssetApprovalRequests } from "@/features/approvals/server";
import type { AssetOperatingRecord } from "@/features/assets/server";
import { getAssetOperatingData } from "@/features/assets/server";
import { requireClientAccess } from "@/features/client-portal/access";
import { listAssetSystemEvents } from "@/features/system-events/server";
import { fmtDate, fmtNum } from "@/lib/formatters";
import { ClientPortalFooter } from "../../components/client-portal-footer";
import { StatCard } from "../../components/stat-card";

interface Props {
  params: Promise<{ assetId: string; slug: string }>;
}

function assetPreview(asset: AssetOperatingRecord) {
  if (asset.media_type === "video") {
    if (!asset.public_url) {
      return (
        <div className="flex aspect-[1.2] items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.03]">
          <Video className="h-10 w-10 text-white/25" />
        </div>
      );
    }

    return (
      <video
        className="aspect-[1.2] w-full rounded-3xl border border-white/[0.08] bg-white/[0.03] object-cover"
        controls
        preload="metadata"
      >
        <source src={asset.public_url} />
      </video>
    );
  }

  if (!asset.public_url) {
    return (
      <div className="flex aspect-[1.2] items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.03]">
        <ImageIcon className="h-10 w-10 text-white/25" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.public_url}
      alt={asset.file_name}
      className="aspect-[1.2] w-full rounded-3xl border border-white/[0.08] bg-white/[0.03] object-cover"
    />
  );
}

export default async function ClientAssetDetailPage({ params }: Props) {
  const { slug, assetId } = await params;
  const { scope, userId } = await requireClientAccess(slug, "assets");

  const data = await getAssetOperatingData(assetId, [], scope, slug);
  if (!data || data.asset.client_slug !== slug) notFound();

  const [approvals, comments, events, agentOutcomes, followUpItems] = await Promise.all([
    listAssetApprovalRequests({
      audience: "shared",
      assetId,
      clientSlug: slug,
      limit: 6,
      status: "pending",
    }),
    listAssetComments({
      assetId,
      audience: "shared",
      clientSlug: slug,
    }),
    listAssetSystemEvents({
      audience: "shared",
      assetId,
      clientSlug: slug,
      limit: 8,
    }),
    listAgentOutcomes({
      assetId,
      audience: "shared",
      clientSlug: slug,
      limit: 4,
      scopeCampaignIds:
        data.linkedCampaigns.length > 0
          ? data.linkedCampaigns.map((campaign) => campaign.campaignId)
          : undefined,
    }),
    listAssetFollowUpItems({
      assetId,
      audience: "shared",
      clientSlug: slug,
      limit: 24,
    }),
  ]);

  const dimensions =
    data.asset.width && data.asset.height
      ? `${fmtNum(data.asset.width)}x${fmtNum(data.asset.height)}`
      : "--";

  return (
    <div className="space-y-6">
      <Link
        href={`/client/${slug}/assets`}
        className="inline-flex items-center gap-1.5 text-xs text-white/45 transition-colors hover:text-white/80"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to assets
      </Link>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="section-label">Assets</p>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/60">
            {data.asset.status}
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/60">
            {data.asset.media_type}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">{data.asset.file_name}</h1>
        <p className="max-w-3xl text-sm text-white/55">
          Shared review, approvals, and discussion for this creative asset.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Link2}
          iconColor="bg-cyan-500/10 ring-1 ring-cyan-500/20 text-cyan-400"
          label="Linked campaigns"
          value={String(data.linkedCampaigns.length)}
        />
        <StatCard
          icon={BadgeCheck}
          iconColor="bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-400"
          label="Pending approvals"
          value={String(approvals.length)}
        />
        <StatCard
          icon={ImageIcon}
          iconColor="bg-violet-500/10 ring-1 ring-violet-500/20 text-violet-400"
          label="Dimensions"
          value={dimensions}
        />
        <StatCard
          icon={data.asset.media_type === "video" ? Video : CheckSquare}
          iconColor="bg-emerald-500/10 ring-1 ring-emerald-500/20 text-emerald-400"
          label="Created"
          value={fmtDate(data.asset.created_at)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <div className="space-y-6">
          <section className="glass-card p-5">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                Preview
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">Hosted creative</h2>
              <p className="mt-1 text-sm text-white/55">
                Review the current live asset before discussing changes or approvals.
              </p>
            </div>
            {assetPreview(data.asset)}
            {data.asset.public_url ? (
              <div className="mt-4">
                <a
                  href={data.asset.public_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-cyan-300 hover:text-cyan-200"
                >
                  Open hosted asset
                  <Link2 className="h-3.5 w-3.5" />
                </a>
              </div>
            ) : null}
          </section>

          <AssetCommentsPanel
            allowAdminOnly={false}
            assetId={assetId}
            canDeleteAny={false}
            clientSlug={slug}
            comments={comments}
            currentUserId={userId}
            description="Talk through creative feedback, requested changes, and review context with the Outlet team."
            emptyState="No shared asset discussion yet."
            title="Asset discussion"
            variant="client"
          />

          <AssetFollowUpItemsPanel
            assetId={assetId}
            canManage={false}
            clientSlug={slug}
            items={followUpItems}
            title="Creative next steps"
            description="Shared follow-up work attached directly to this creative asset."
            emptyState="No shared asset follow-up items are active yet."
            variant="client"
          />

          <section className="glass-card p-5">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                Promotion context
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">Linked campaigns</h2>
              <p className="mt-1 text-sm text-white/55">
                Campaigns this asset is currently tied to through naming or workflow events.
              </p>
            </div>

            {data.linkedCampaigns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.03] px-4 py-6 text-sm text-white/45">
                This asset is not linked to a campaign yet.
              </div>
            ) : (
              <div className="space-y-3">
                {data.linkedCampaigns.map((campaign) => (
                  <Link
                    key={campaign.campaignId}
                    href={`/client/${slug}/campaign/${campaign.campaignId}`}
                    className="block rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:border-white/[0.14] hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{campaign.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/45">
                          <span>{campaign.status}</span>
                          {campaign.impressions != null ? (
                            <>
                              <span>&middot;</span>
                              <span>{fmtNum(campaign.impressions)} impressions</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div className="text-right text-xs text-white/45">
                        <p>{campaign.roas != null ? `${campaign.roas.toFixed(1)}x ROAS` : "No ROAS yet"}</p>
                        {campaign.clicks != null ? <p className="mt-1">{fmtNum(campaign.clicks)} clicks</p> : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <WorkspaceApprovalsPanel
            approvals={approvals}
            canDecide
            title="Asset approvals"
            description="Pending shared reviews tied directly to this asset."
            emptyState="No asset approvals are pending right now."
          />

          <WorkspaceActivityFeed
            events={events}
            assetHrefPrefix={`/client/${slug}/assets`}
            campaignHrefPrefix={`/client/${slug}/campaign`}
            crmHrefPrefix={`/client/${slug}/crm`}
            basePath={`/client/${slug}/assets`}
            eventHrefPrefix={`/client/${slug}/event`}
            title="Asset activity"
            description="Visible review and workflow events attached to this creative."
            emptyState="Shared asset updates will appear here as work moves forward."
          />

          <AgentOutcomesPanel
            assetHrefPrefix={`/client/${slug}/assets`}
            outcomes={agentOutcomes}
            title="Agent follow-through"
            description="Shared agent review tied to this creative asset."
            emptyState="No shared agent follow-through is visible for this asset yet."
            variant="client"
            campaignHrefPrefix={`/client/${slug}/campaign`}
          />
        </div>
      </div>

      <ClientPortalFooter dataSource="supabase" />
    </div>
  );
}
