import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Image as ImageIcon, Video, ArrowLeft } from "lucide-react";
import { AgentOutcomesPanel } from "@/components/agents/agent-outcomes-panel";
import { ConversationsCenter } from "@/components/conversations/conversations-center";
import { WorkQueueSection } from "@/components/workflow/work-queue-section";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { slugToLabel } from "@/lib/formatters";
import { AssetGallery } from "@/features/assets/asset-gallery";
import { mapAssetRows } from "@/features/assets/lib";
import { listAssets } from "@/features/assets/server";
import { getConversationsCenter } from "@/features/conversations/server";
import { buildConversationsSummary } from "@/features/conversations/summary";
import { getWorkQueue } from "@/features/work-queue/server";
import { buildWorkQueueSummary } from "@/features/work-queue/summary";
import { requireClientAccess } from "@/features/client-portal/access";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const clientName = slugToLabel(slug);
  return {
    title: `${clientName} Assets`,
    description: `Ad creative assets for ${clientName}`,
  };
}

export default async function ClientAssetsPage({ params }: Props) {
  const { slug } = await params;
  const { scope } = await requireClientAccess(slug, "assets");
  const clientName = slugToLabel(slug);
  const [mapped, conversations, workQueue, outcomes] = await Promise.all([
    listAssets(slug, scope).then(mapAssetRows),
    getConversationsCenter({
      clientSlug: slug,
      kinds: ["asset"],
      limit: 6,
      mode: "client",
    }),
    getWorkQueue({
      clientSlug: slug,
      kinds: ["asset_follow_up"],
      limit: 6,
      mode: "client",
    }),
    listAgentOutcomes({
      audience: "shared",
      clientSlug: slug,
      contextType: "asset",
      limit: 6,
    }),
  ]);
  const allowedAssetIds = new Set(mapped.map((asset) => asset.id));
  const visibleThreads = conversations.threads.filter((thread) => allowedAssetIds.has(thread.targetId));
  const visibleQueueItems = workQueue.items.filter((item) => allowedAssetIds.has(item.contextId));
  const visibleOutcomes = outcomes.filter(
    (outcome) => outcome.assetId && allowedAssetIds.has(outcome.assetId),
  );
  const visibleConversations = {
    summary: buildConversationsSummary(visibleThreads),
    threads: visibleThreads,
  };
  const visibleWorkQueue = buildWorkQueueSummary(visibleQueueItems, { limit: 6 });

  const imageCount = mapped.filter((a) => a.mediaType === "image").length;
  const videoCount = mapped.filter((a) => a.mediaType === "video").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.07] via-violet-500/[0.05] to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.08] to-transparent rounded-full blur-3xl" />

        <div className="relative">
          <Link
            href={`/client/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition mb-4"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-cyan-400/70" />
                <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
                  Assets
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {clientName} Ad Assets
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20">
              <ImageIcon className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Total Assets
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-none">
            {mapped.length}
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Images
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tighter leading-none">
            {imageCount}
          </p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20">
              <Video className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Videos
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-violet-400 tracking-tighter leading-none">
            {videoCount}
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <WorkQueueSection
          description="Creative follow-through still waiting on review, routing, or delivery."
          summary={visibleWorkQueue}
          title="Asset next steps"
          variant="client"
        />

        <AgentOutcomesPanel
          assetHrefPrefix={`/client/${slug}/assets`}
          campaignHrefPrefix={`/client/${slug}/campaign`}
          crmHrefPrefix={`/client/${slug}/crm`}
          description="What the agents reviewed about your creative and what follow-through is still in motion."
          eventHrefPrefix={`/client/${slug}/event`}
          outcomes={visibleOutcomes}
          title="Asset agent follow-through"
          variant="client"
        />
      </div>

      <ConversationsCenter
        assetHrefPrefix={`/client/${slug}/assets`}
        campaignHrefPrefix={`/client/${slug}/campaign`}
        crmHrefPrefix={`/client/${slug}/crm`}
        description="Open creative discussions attached directly to the files and campaign work they affect."
        eventHrefPrefix={`/client/${slug}/event`}
        summary={visibleConversations.summary}
        threads={visibleConversations.threads}
        title="Asset discussions"
        variant="client"
      />

      {/* Asset Gallery (always shown so import input is accessible) */}
      <AssetGallery assets={mapped} clientSlug={slug} />
    </div>
  );
}
