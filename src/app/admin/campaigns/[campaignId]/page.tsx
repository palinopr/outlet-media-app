import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SyncButton } from "@/components/admin/campaigns/campaign-cells";
import { CampaignDetailDashboard } from "@/components/admin/campaigns/campaign-detail-dashboard";
import { ClientRequestsPanel } from "@/components/admin/client-requests-panel";
import { getCampaignOperatingData } from "@/features/campaigns/server";
import { fmtDate, fmtUsd } from "@/lib/formatters";
import { getCampaignStatusCfg } from "@/lib/status";

interface Props {
  params: Promise<{ campaignId: string }>;
  searchParams?: Promise<{ tab?: string }>;
}

export default async function AdminCampaignDetailPage({ params, searchParams }: Props) {
  const { campaignId } = await params;
  const { tab } = (await searchParams) ?? {};
  const activeTab = tab === "requests" ? "requests" : "overview";
  const data = await getCampaignOperatingData(campaignId);

  if (!data) notFound();

  const { campaign } = data;
  const statusCfg = getCampaignStatusCfg(campaign.status);
  const requestClientSlug = data.comments[0]?.clientSlug ?? (campaign.clientSlug !== "unknown" ? campaign.clientSlug : null);
  const openRequestCount = data.comments.filter(
    (comment) => comment.visibility === "shared" && !comment.parentCommentId && !comment.resolved,
  ).length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      <div className="flex items-center">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground border border-border/50 rounded-md px-2.5 py-1.5 hover:bg-muted/50"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Campaign Detail</h1>
            <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusCfg.bg} ${statusCfg.text} border-current/30`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} ${statusCfg.label === "Active" ? "animate-pulse" : ""}`} />
              {statusCfg.label}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">{campaign.name}</span>
            <span>&middot;</span>
            <span>since {campaign.startTime ? fmtDate(campaign.startTime) : "--"}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">Daily budget</span>
            <span className="text-xl tracking-tight text-muted-foreground">
              {campaign.dailyBudget != null ? fmtUsd(campaign.dailyBudget) : "--"}
            </span>
          </div>
          <div className="flex flex-col gap-2 relative top-1">
            <SyncButton
              campaignId={campaign.campaignId}
              status={campaign.status}
              dailyBudget={campaign.dailyBudget != null ? Math.round(campaign.dailyBudget * 100) : null}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border/60">
        <Link
          href={`/admin/campaigns/${campaignId}`}
          className={`relative px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "overview"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/80"
          }`}
        >
          Overview
          {activeTab === "overview" ? (
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-t bg-foreground" />
          ) : null}
        </Link>
        <Link
          href={`/admin/campaigns/${campaignId}?tab=requests`}
          className={`relative px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "requests"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/80"
          }`}
        >
          Client requests
          {openRequestCount > 0 ? <span className="ml-1.5 text-[10px] text-muted-foreground">{openRequestCount}</span> : null}
          {activeTab === "requests" ? (
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-t bg-foreground" />
          ) : null}
        </Link>
      </div>

      {activeTab === "overview" ? (
        <CampaignDetailDashboard data={data} />
      ) : (
        <ClientRequestsPanel
          clientSlug={requestClientSlug}
          comments={data.comments}
          entityId={campaign.campaignId}
          entityLabel={campaign.name}
          entityType="campaign"
        />
      )}
    </div>
  );
}
