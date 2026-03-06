import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckSquare,
  Image as ImageIcon,
  Link2,
  Video,
} from "lucide-react";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { AssetOperatingPanel } from "@/components/admin/assets/asset-operating-panel";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { WorkspaceApprovalsPanel } from "@/components/workspace/workspace-approvals-panel";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { listAssetApprovalRequests } from "@/features/approvals/server";
import { getAssetOperatingData, getAssetRecordById } from "@/features/assets/server";
import { listAssetSystemEvents } from "@/features/system-events/server";
import { fmtDate, fmtNum, slugToLabel } from "@/lib/formatters";

interface Props {
  params: Promise<{ assetId: string }>;
}

function assetPreview(asset: Awaited<ReturnType<typeof getAssetRecordById>>) {
  if (!asset) return null;

  if (asset.media_type === "video") {
    if (!asset.public_url) {
      return (
        <div className="flex aspect-[1.2] items-center justify-center rounded-3xl border border-dashed border-[#e7e0d3] bg-[#faf8f5]">
          <Video className="h-10 w-10 text-[#b5aca0]" />
        </div>
      );
    }

    return (
      <video
        className="aspect-[1.2] w-full rounded-3xl border border-[#ece8df] bg-[#faf8f5] object-cover"
        controls
        preload="metadata"
      >
        <source src={asset.public_url} />
      </video>
    );
  }

  if (!asset.public_url) {
    return (
      <div className="flex aspect-[1.2] items-center justify-center rounded-3xl border border-dashed border-[#e7e0d3] bg-[#faf8f5]">
        <ImageIcon className="h-10 w-10 text-[#b5aca0]" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.public_url}
      alt={asset.file_name}
      className="aspect-[1.2] w-full rounded-3xl border border-[#ece8df] bg-[#faf8f5] object-cover"
    />
  );
}

export default async function AdminAssetDetailPage({ params }: Props) {
  const { assetId } = await params;
  const assetRecord = await getAssetRecordById(assetId);
  if (!assetRecord) notFound();

  const [approvals, events] = await Promise.all([
    listAssetApprovalRequests({
      audience: "all",
      assetId,
      clientSlug: assetRecord.client_slug,
      limit: 8,
      status: "pending",
    }),
    listAssetSystemEvents({
      audience: "all",
      assetId,
      clientSlug: assetRecord.client_slug,
      limit: 10,
    }),
  ]);

  const linkedCampaignIds = new Set<string>();

  for (const approval of approvals) {
    if (approval.entityType === "campaign" && approval.entityId) {
      linkedCampaignIds.add(approval.entityId);
      continue;
    }

    const campaignId = approval.metadata.campaignId;
    if (typeof campaignId === "string" && campaignId.length > 0) {
      linkedCampaignIds.add(campaignId);
    }
  }

  for (const event of events) {
    if (event.entityType === "campaign" && event.entityId) {
      linkedCampaignIds.add(event.entityId);
      continue;
    }

    const campaignId = event.metadata.campaignId;
    if (typeof campaignId === "string" && campaignId.length > 0) {
      linkedCampaignIds.add(campaignId);
    }
  }

  const data = await getAssetOperatingData(assetId, linkedCampaignIds);
  if (!data) notFound();

  const agentOutcomes =
    data.linkedCampaigns.length > 0
      ? await listAgentOutcomes({
          audience: "all",
          clientSlug: data.asset.client_slug,
          limit: 4,
          scopeCampaignIds: data.linkedCampaigns.map((campaign) => campaign.campaignId),
        })
      : [];

  const dimensions =
    data.asset.width && data.asset.height
      ? `${fmtNum(data.asset.width)}x${fmtNum(data.asset.height)}`
      : "---";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/assets"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to assets
        </Link>
      </div>

      <AdminPageHeader
        title={data.asset.file_name}
        description="Asset operating view across review state, campaign linkage, approvals, and recent activity."
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            {slugToLabel(data.asset.client_slug)}
          </span>
          <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            {data.asset.status}
          </span>
          <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            {data.asset.media_type}
          </span>
        </div>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Linked campaigns"
          value={String(data.linkedCampaigns.length)}
          icon={Link2}
          accent="from-cyan-500/20 to-blue-500/20"
          iconColor="text-cyan-400"
        />
        <StatCard
          label="Pending approvals"
          value={String(approvals.length)}
          icon={CheckSquare}
          accent="from-amber-500/20 to-orange-500/20"
          iconColor="text-amber-400"
        />
        <StatCard
          label="Dimensions"
          value={dimensions}
          icon={ImageIcon}
          accent="from-violet-500/20 to-purple-500/20"
          iconColor="text-violet-400"
        />
        <StatCard
          label="Created"
          value={fmtDate(data.asset.created_at)}
          icon={data.asset.media_type === "video" ? Video : ImageIcon}
          accent="from-emerald-500/20 to-teal-500/20"
          iconColor="text-emerald-400"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.95fr)]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
            <div className="mb-4">
              <p className="text-sm font-medium text-[#787774]">Preview</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
                Hosted creative
              </h2>
              <p className="mt-1 text-sm text-[#9b9a97]">
                Review the asset itself before moving it further through campaign workflow.
              </p>
            </div>
            {assetPreview(data.asset)}
          </section>

          <AssetOperatingPanel asset={data.asset} />

          <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
            <div className="mb-4">
              <p className="text-sm font-medium text-[#787774]">Linked campaigns</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
                Promotion context
              </h2>
              <p className="mt-1 text-sm text-[#9b9a97]">
                Campaigns this asset is attached to by direct workflow events or name-based classification.
              </p>
            </div>

            {data.linkedCampaigns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
                This asset is not linked to a campaign yet.
              </div>
            ) : (
              <div className="space-y-3">
                {data.linkedCampaigns.map((campaign) => (
                  <Link
                    key={campaign.campaignId}
                    href={`/admin/campaigns/${campaign.campaignId}`}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4 transition-colors hover:bg-white"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#2f2f2f]">{campaign.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#9b9a97]">
                        <span>{campaign.status}</span>
                        {campaign.impressions != null ? (
                          <>
                            <span>&middot;</span>
                            <span>{fmtNum(campaign.impressions)} impressions</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-right text-xs text-[#9b9a97]">
                      <p>{campaign.roas != null ? `${campaign.roas.toFixed(1)}x ROAS` : "No ROAS yet"}</p>
                      {campaign.clicks != null ? <p className="mt-1">{fmtNum(campaign.clicks)} clicks</p> : null}
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
            description="Pending reviews triggered by uploads or folder imports tied to this asset."
            emptyState="No approvals are waiting for this asset right now."
          />

          <WorkspaceActivityFeed
            events={events}
            assetHrefPrefix="/admin/assets"
            basePath="/admin/assets"
            title="Asset activity"
            description="Recent upload, review, and workflow events attached to this asset."
            emptyState="Asset activity will appear here as review state and workflow context change."
          />

          <AgentOutcomesPanel
            canCreateActionItems
            outcomes={agentOutcomes}
            title="Agent follow-through"
            description="Agent tasks triggered from campaign workflow connected to this asset."
            emptyState="No agent work is attached to this asset yet."
            variant="admin"
            campaignHrefPrefix="/admin/campaigns"
          />

          <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
            <p className="text-sm font-medium text-[#787774]">Asset snapshot</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
              Quick context
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Folder</p>
                <p className="mt-2 text-sm font-medium text-[#2f2f2f]">
                  {data.asset.folder ?? "Uncategorized"}
                </p>
              </div>
              <div className="rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#9b9a97]">Labels</p>
                <p className="mt-2 text-sm font-medium text-[#2f2f2f]">
                  {data.asset.labels?.length ? data.asset.labels.join(", ") : "No labels yet"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
