import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Eye,
  MousePointer,
  Target,
  Image as ImageIcon,
  Activity,
  BadgeCheck,
  Lightbulb,
} from "lucide-react";
import { parseRange } from "@/lib/constants";
import { fmtUsd, fmtNum } from "@/lib/formatters";
import { roasLabel } from "../../lib";
import { getCampaignDetail } from "./data";
import { AdsPreview } from "@/components/client/ads-preview";
import { RecommendationsList } from "@/components/client/recommendations";
import { WorkspaceActivityFeed } from "@/components/workspace/workspace-activity-feed";
import { WorkspaceApprovalsPanel } from "@/components/workspace/workspace-approvals-panel";
import { CampaignActionItemsPanel } from "@/components/campaigns/campaign-action-items-panel";
import { CampaignCommentsPanel } from "@/components/campaigns/campaign-comments-panel";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { listCampaignActionItems } from "@/features/campaign-action-items/server";
import { listCampaignAgentOutcomes } from "@/features/agent-outcomes/server";
import { listCampaignComments } from "@/features/campaign-comments/server";
import { listCampaignApprovalRequests } from "@/features/approvals/server";
import { ClientPortalFooter } from "../../components/client-portal-footer";
import { StatCard } from "../../components/stat-card";
import { CampaignDetailHeader } from "../../components/campaign-detail-header";
import { CampaignAnalytics } from "../../components/campaign-analytics";
import { requireClientAccess } from "@/features/client-portal/access";
import { listCampaignSystemEvents } from "@/features/system-events/server";

interface Props {
  params: Promise<{ slug: string; campaignId: string }>;
  searchParams: Promise<{ range?: string }>;
}

export default async function CampaignDetailPage({ params, searchParams }: Props) {
  const { slug, campaignId } = await params;
  const { scope, userId } = await requireClientAccess(slug, "meta_ads");
  const { range: rangeParam } = await searchParams;
  const range = parseRange(rangeParam, "7");

  const [data, events, approvals, actionItems, comments, agentOutcomes] = await Promise.all([
    getCampaignDetail(slug, campaignId, range, scope),
    listCampaignSystemEvents({
      audience: "shared",
      clientSlug: slug,
      campaignId,
      limit: 6,
    }),
    listCampaignApprovalRequests({
      audience: "shared",
      clientSlug: slug,
      campaignId,
      status: "pending",
      limit: 6,
    }),
    listCampaignActionItems({
      audience: "shared",
      campaignId,
      clientSlug: slug,
      limit: 12,
    }),
    listCampaignComments({
      audience: "shared",
      campaignId,
      clientSlug: slug,
    }),
    listCampaignAgentOutcomes(slug, campaignId, "shared", 6),
  ]);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-white/60 text-sm">Campaign not found.</p>
        <Link
          href={`/client/${slug}`}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" /> Back to dashboard
        </Link>
      </div>
    );
  }

  const {
    campaign: c,
    ageGender,
    placements,
    geography,
    ads,
    hourly,
    daily,
    recommendations,
    dataSource,
    rangeLabel,
  } = data;

  return (
    <div className="space-y-6">
      <CampaignDetailHeader slug={slug} range={range} campaign={c} />

      {/* -- Key Metrics -- */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            icon={TrendingUp}
            iconColor="bg-violet-500/10 ring-1 ring-violet-500/20 text-violet-400"
            label="ROAS"
            value={c.roas != null ? `${c.roas.toFixed(1)}x` : "--"}
            sub={roasLabel(c.roas)}
          />
        </div>
        <StatCard
          icon={Target}
          iconColor="bg-emerald-500/10 ring-1 ring-emerald-500/20 text-emerald-400"
          label="Revenue"
          value={fmtUsd(c.revenue)}
        />
        <StatCard
          icon={Eye}
          iconColor="bg-blue-500/10 ring-1 ring-blue-500/20 text-blue-400"
          label="Impressions"
          value={fmtNum(c.impressions)}
        />
        <StatCard
          icon={MousePointer}
          iconColor="bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-400"
          label="Clicks"
          value={fmtNum(c.clicks)}
          sub={c.ctr != null ? `${c.ctr.toFixed(2)}% CTR` : undefined}
        />
        <StatCard
          icon={Activity}
          iconColor="bg-cyan-500/10 ring-1 ring-cyan-500/20 text-cyan-400"
          label="CPC"
          value={c.cpc != null ? `$${c.cpc.toFixed(2)}` : "--"}
          sub={c.cpm != null ? `$${c.cpm.toFixed(2)} CPM` : undefined}
        />
      </div>

      <CampaignAnalytics
        ageGender={ageGender}
        placements={placements}
        geography={geography}
        ads={ads}
        hourly={hourly}
        daily={daily}
        rangeLabel={rangeLabel}
      />

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-3.5 w-3.5 text-white/50" />
          <span className="section-label">Campaign workflow</span>
        </div>
        <CampaignActionItemsPanel
          campaignId={campaignId}
          clientSlug={slug}
          items={actionItems}
          canManage={false}
          title="Campaign next steps"
          description="Shared follow-ups, approvals, and handoffs attached directly to this campaign."
          emptyState="No shared next steps are active for this campaign right now."
        />
        <CampaignCommentsPanel
          allowAdminOnly={false}
          canDeleteAny={false}
          campaignId={campaignId}
          clientSlug={slug}
          comments={comments}
          currentUserId={userId}
          title="Campaign discussion"
          description="Talk through creative, campaign changes, and next steps with the Outlet team in one shared thread."
          emptyState="No shared campaign comments yet."
        />
        <div className="grid gap-4 xl:grid-cols-2">
          <WorkspaceApprovalsPanel
            approvals={approvals}
            canDecide
            title="Campaign approvals"
            description="Approvals tied directly to this campaign will show up here."
            emptyState="No campaign approvals are pending right now."
          />
          <WorkspaceActivityFeed
            events={events}
            campaignHrefPrefix={`/client/${slug}/campaign`}
            eventHrefPrefix={`/client/${slug}/event`}
            title="Campaign activity"
            description="Visible campaign changes logged across the shared system."
            emptyState="Campaign updates will appear here as the team changes status, budget, or ownership."
          />
        </div>
        <AgentOutcomesPanel
          outcomes={agentOutcomes}
          title="Agent follow-through"
          description="See when the Outlet team has asked an agent to review this campaign and what came back."
          emptyState="No shared agent follow-through is visible for this campaign yet."
          variant="client"
        />
      </section>

      {/* -- Recommendations -- */}
      {recommendations.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Insights & Recommendations</span>
          </div>
          <RecommendationsList items={recommendations} />
        </section>
      )}

      {/* -- Ads -- */}
      {ads.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-3.5 w-3.5 text-white/50" />
            <span className="section-label">Ad Performance</span>
            <span className="text-xs text-white/45 ml-auto">{ads.length} ads</span>
          </div>
          <AdsPreview ads={ads} />
        </section>
      )}

      {/* -- Empty state -- */}
      {dataSource === "supabase" && ageGender.length === 0 && ads.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-sm text-white/50 mb-1">Demographics and ad breakdowns unavailable</p>
          <p className="text-xs text-white/40">
            Live data from Meta is required for detailed breakdowns. Showing cached totals.
          </p>
        </div>
      )}

      <ClientPortalFooter dataSource={dataSource} showClock />
    </div>
  );
}
