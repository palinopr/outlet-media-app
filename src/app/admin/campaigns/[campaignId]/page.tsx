import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  MousePointerClick,
  Target,
  TrendingUp,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { WorkspaceApprovalsPanel } from "@/components/workspace/workspace-approvals-panel";
import { CampaignActionItemsPanel } from "@/components/campaigns/campaign-action-items-panel";
import { CampaignCommentsPanel } from "@/components/campaigns/campaign-comments-panel";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { SyncButton } from "@/components/admin/campaigns/campaign-cells";
import { listCampaignAgentOutcomes } from "@/features/agent-outcomes/server";
import { getCampaignOperatingData } from "@/features/campaigns/server";
import { fmtDate, fmtNum, fmtObjective, fmtUsd, slugToLabel } from "@/lib/formatters";

interface Props {
  params: Promise<{ campaignId: string }>;
}

export default async function AdminCampaignDetailPage({ params }: Props) {
  const { campaignId } = await params;
  const { userId } = await auth();
  const data = await getCampaignOperatingData(campaignId);

  if (!data) notFound();

  const { campaign, assets, approvals, comments, events, actionItems } = data;
  const agentOutcomes = await listCampaignAgentOutcomes(
    campaign.clientSlug,
    campaign.campaignId,
    "all",
    6,
  );
  const metaAdAccountId = process.env.META_AD_ACCOUNT_ID?.replace(/^act_/, "") ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/campaigns"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to campaigns
        </Link>
      </div>

      <AdminPageHeader
        title={campaign.name}
        description="Campaign operating view for approvals, assets, and recent activity."
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            {slugToLabel(campaign.clientSlug)}
          </span>
          <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            {fmtObjective(campaign.objective)}
          </span>
          <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
            {campaign.status}
          </span>
          <SyncButton
            campaignId={campaign.campaignId}
            status={campaign.status}
            dailyBudget={campaign.dailyBudget != null ? Math.round(campaign.dailyBudget * 100) : null}
          />
          {metaAdAccountId ? (
            <a
              href={`https://www.facebook.com/adsmanager/manage/campaigns?act=${metaAdAccountId}&selected_campaign_ids=${campaign.campaignId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Open in Meta
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </div>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Spend"
          value={fmtUsd(campaign.spend)}
          icon={Target}
          accent="from-cyan-500/20 to-blue-500/20"
          iconColor="text-cyan-400"
        />
        <StatCard
          label="ROAS"
          value={campaign.roas != null ? `${campaign.roas.toFixed(1)}x` : "---"}
          icon={TrendingUp}
          accent="from-violet-500/20 to-purple-500/20"
          iconColor="text-violet-400"
        />
        <StatCard
          label="Impressions"
          value={fmtNum(campaign.impressions)}
          icon={Eye}
          accent="from-blue-500/20 to-indigo-500/20"
          iconColor="text-blue-400"
        />
        <StatCard
          label="Clicks / CTR"
          value={`${fmtNum(campaign.clicks)}${campaign.ctr != null ? ` (${campaign.ctr.toFixed(1)}%)` : ""}`}
          icon={MousePointerClick}
          accent="from-emerald-500/20 to-teal-500/20"
          iconColor="text-emerald-400"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <div className="space-y-6">
          <CampaignActionItemsPanel
            campaignId={campaign.campaignId}
            clientSlug={campaign.clientSlug}
            items={actionItems}
            canManage
            title="Campaign actions"
            description="First-class next steps for the team, client, and agents attached to this campaign."
            emptyState="No action items have been created for this campaign yet."
          />

          <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Creative</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">Linked campaign assets</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Assets that matched this campaign by name and placement context.
                </p>
              </div>
              <Link
                href={`/client/${campaign.clientSlug}/assets`}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
              >
                Open client library
              </Link>
            </div>

            {assets.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
                No campaign-linked assets yet.
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {assets.map((asset) => (
                  <a
                    key={asset.id}
                    href={asset.publicUrl ?? undefined}
                    target={asset.publicUrl ? "_blank" : undefined}
                    rel={asset.publicUrl ? "noopener noreferrer" : undefined}
                    className="group overflow-hidden rounded-2xl border border-border/70 bg-background transition-colors hover:border-border hover:bg-muted/20"
                  >
                    <div className="relative aspect-[1.25] overflow-hidden bg-muted/30">
                      {asset.mediaType === "video" ? (
                        <div className="flex h-full items-center justify-center">
                          <Video className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      ) : asset.publicUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asset.publicUrl}
                          alt={asset.fileName}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 p-3">
                      <p className="truncate text-sm font-medium">{asset.fileName}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{asset.status}</span>
                        {asset.placement ? <span>&middot; {asset.placement}</span> : null}
                        {asset.width && asset.height ? (
                          <span>&middot; {asset.width}x{asset.height}</span>
                        ) : null}
                      </div>
                      {asset.folder ? (
                        <p className="truncate text-xs text-muted-foreground">{asset.folder}</p>
                      ) : null}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <CampaignCommentsPanel
            allowAdminOnly
            allowCreateActionItems
            canDeleteAny
            campaignId={campaign.campaignId}
            clientSlug={campaign.clientSlug}
            comments={comments}
            currentUserId={userId ?? ""}
            linkedActionSourceIds={actionItems
              .filter((item) => item.sourceEntityType === "campaign_comment" && item.sourceEntityId)
              .map((item) => item.sourceEntityId as string)}
            title="Campaign discussion"
            description="Keep campaign feedback, blockers, and internal notes attached to the campaign itself."
          />
          <WorkspaceApprovalsPanel
            approvals={approvals}
            canDecide
            title="Campaign approvals"
            description="Pending decisions connected to this campaign."
            emptyState="No campaign approvals are waiting right now."
          />
          <WorkspaceActivityFeed
            events={events}
            basePath="/admin/workspace"
            title="Campaign activity"
            description={
              campaign.startTime
                ? `Recent work on this campaign. Started ${fmtDate(campaign.startTime)}.`
                : "Recent work on this campaign across the shared system."
            }
            emptyState="Campaign activity will appear here as the team changes state, uploads creative, and resolves approvals."
            showClientSlug
          />
          <AgentOutcomesPanel
            canCreateActionItems
            outcomes={agentOutcomes}
            title="Agent follow-through"
            description="Recent agent triage and Meta handoff work attached to this campaign."
            emptyState="No agent tasks have been triggered for this campaign yet."
            variant="admin"
          />
        </div>
      </div>
    </div>
  );
}
