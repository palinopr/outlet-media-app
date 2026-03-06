import Link from "next/link";
import { Image as ImageIcon, Link2, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { ClientFilter } from "@/components/admin/campaigns/client-filter";
import { buildAssetLibrarySummary } from "@/features/assets/summary";
import { listAssetLibrary } from "@/features/assets/server";
import { slugToLabel, timeAgo } from "@/lib/formatters";
import { statusColor } from "@/features/assets/lib";
import { supabaseAdmin } from "@/lib/supabase";

interface Props {
  searchParams: Promise<{ client?: string }>;
}

export default async function AdminAssetsPage({ searchParams }: Props) {
  const { client } = await searchParams;
  const clientSlug = client && client !== "all" ? client : null;

  const [records, clientsRes] = await Promise.all([
    listAssetLibrary(clientSlug, 72),
    supabaseAdmin
      ?.from("clients")
      .select("slug")
      .order("name", { ascending: true }),
  ]);

  const summary = buildAssetLibrarySummary(records, 8);
  const clients = ((clientsRes?.data ?? []) as { slug: string | null }[])
    .map((row) => row.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);

  const imageCount = records.filter((record) => record.asset.media_type === "image").length;
  const videoCount = records.filter((record) => record.asset.media_type === "video").length;
  const linkedCount = summary.metrics.find((metric) => metric.key === "linked_assets")?.value ?? 0;
  const reviewCount = summary.metrics.find((metric) => metric.key === "needs_review")?.value ?? 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Assets"
        description="Creative operating view across uploaded files, campaign linkage, and review queue."
      >
        <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
          {clientSlug ? slugToLabel(clientSlug) : "All clients"}
        </span>
      </AdminPageHeader>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <StatCard
          label="Total assets"
          value={String(records.length)}
          icon={ImageIcon}
          accent="from-cyan-500/20 to-blue-500/20"
          iconColor="text-cyan-400"
        />
        <StatCard
          label="Needs review"
          value={String(reviewCount)}
          icon={Link2}
          accent="from-amber-500/20 to-orange-500/20"
          iconColor="text-amber-400"
        />
        <StatCard
          label="Linked to campaigns"
          value={String(linkedCount)}
          icon={Link2}
          accent="from-emerald-500/20 to-teal-500/20"
          iconColor="text-emerald-400"
        />
        <StatCard
          label="Images"
          value={String(imageCount)}
          icon={ImageIcon}
          accent="from-violet-500/20 to-purple-500/20"
          iconColor="text-violet-400"
        />
        <StatCard
          label="Videos"
          value={String(videoCount)}
          icon={Video}
          accent="from-rose-500/20 to-pink-500/20"
          iconColor="text-rose-400"
        />
      </div>

      <Card className="border-border/60">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 pb-2">
          <p className="text-sm font-semibold">
            {clientSlug ? slugToLabel(clientSlug) : "All assets"}
            <span className="ml-1.5 font-normal text-muted-foreground">({records.length})</span>
          </p>
          {clients.length > 0 ? <ClientFilter clients={clients} /> : null}
        </div>

        <div className="grid gap-6 px-4 pb-4 pt-2 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.4fr)]">
          <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
            <div className="mb-4">
              <p className="text-sm font-medium text-[#787774]">Review queue</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
                Assets needing attention
              </h2>
              <p className="mt-1 text-sm text-[#9b9a97]">
                New creative, partially classified assets, or files that are not linked to a campaign yet.
              </p>
            </div>

            {summary.attentionAssets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
                No asset review queue right now.
              </div>
            ) : (
              <div className="space-y-3">
                {summary.attentionAssets.map((asset) => (
                  <Link
                    key={asset.id}
                    href={`/admin/assets/${asset.id}`}
                    className="block rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-4 transition-colors hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#2f2f2f]">
                          {asset.fileName}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#9b9a97]">
                          <span>{slugToLabel(asset.clientSlug)}</span>
                          <span>&middot;</span>
                          <span>{timeAgo(asset.createdAt)}</span>
                        </div>
                      </div>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusColor(asset.status)}`}
                      >
                        {asset.status}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {asset.reasons.map((reason) => (
                        <span
                          key={reason}
                          className="rounded-full bg-[#f1ece4] px-2 py-1 text-[11px] font-medium text-[#6f6a63]"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                    {asset.linkedCampaignNames.length > 0 ? (
                      <p className="mt-3 text-xs text-[#787774]">
                        Linked: {asset.linkedCampaignNames.join(", ")}
                      </p>
                    ) : null}
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]">
            <div className="mb-4">
              <p className="text-sm font-medium text-[#787774]">Library</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#2f2f2f]">
                Recent creative
              </h2>
              <p className="mt-1 text-sm text-[#9b9a97]">
                The latest assets uploaded across clients, with campaign linkage and review state.
              </p>
            </div>

            {records.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]">
                No assets have been uploaded yet.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {records.map(({ asset, linkedCampaignCount, linkedCampaignNames }) => (
                  <Link
                    key={asset.id}
                    href={`/admin/assets/${asset.id}`}
                    className="group overflow-hidden rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] transition-colors hover:bg-white"
                  >
                    <div className="relative aspect-[1.12] overflow-hidden bg-[#f6f3ee]">
                      {asset.media_type === "video" ? (
                        asset.public_url ? (
                          <video
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                          >
                            <source src={asset.public_url} />
                          </video>
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Video className="h-8 w-8 text-[#b5aca0]" />
                          </div>
                        )
                      ) : asset.public_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asset.public_url}
                          alt={asset.file_name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-[#b5aca0]" />
                        </div>
                      )}

                      <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusColor(asset.status)}`}
                        >
                          {asset.status}
                        </span>
                        {asset.placement ? (
                          <span className="rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white/80">
                            {asset.placement}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-2 p-3">
                      <p className="truncate text-sm font-medium text-[#2f2f2f]">
                        {asset.file_name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#9b9a97]">
                        <span>{slugToLabel(asset.client_slug)}</span>
                        <span>&middot;</span>
                        <span>{timeAgo(asset.created_at)}</span>
                      </div>
                      <p className="truncate text-xs text-[#787774]">
                        {linkedCampaignCount > 0
                          ? `Linked to ${linkedCampaignNames.join(", ")}`
                          : "No linked campaign yet"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </Card>
    </div>
  );
}
