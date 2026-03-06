import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Link2, ShieldCheck, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { slugToLabel, timeAgo } from "@/lib/formatters";
import type {
  AssetAttentionItem,
  AssetLibrarySummary,
} from "@/features/assets/summary";

interface DashboardAssetsSectionProps {
  assetHrefPrefix?: string;
  description?: string;
  emptyState?: string;
  href: string;
  libraryHrefLabel?: string;
  showClientSlug?: boolean;
  summary: AssetLibrarySummary;
  title?: string;
  variant: "admin" | "client";
}

function tone(variant: "admin" | "client") {
  if (variant === "client") {
    return {
      body: "rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5",
      card: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3",
      empty:
        "rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-6 text-sm text-white/50",
      muted: "text-white/50",
      text: "text-white",
      link: "text-cyan-300 hover:text-cyan-200",
      metric: "bg-white/[0.04] text-white/75",
      chip: "bg-white/[0.06] text-white/75",
    };
  }

  return {
    body: "rounded-[28px] border border-[#ece8df] bg-white/95 p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.5)]",
    card: "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-3",
    empty:
      "rounded-2xl border border-dashed border-[#e7e0d3] bg-[#faf8f5] px-4 py-6 text-sm text-[#9b9a97]",
    muted: "text-[#9b9a97]",
    text: "text-[#2f2f2f]",
    link: "text-[#0f7b6c] hover:text-[#0b5e52]",
    metric: "bg-[#f7f5f1] text-[#6f6a63]",
    chip: "bg-[#f1ece4] text-[#6f6a63]",
  };
}

const METRICS = [
  { key: "total_assets", label: "Assets", icon: ImageIcon },
  { key: "needs_review", label: "Review", icon: ShieldCheck },
  { key: "approved_assets", label: "Approved", icon: ShieldCheck },
  { key: "linked_assets", label: "Linked", icon: Link2 },
] as const;

function assetHref(
  asset: AssetAttentionItem,
  assetHrefPrefix: string | undefined,
  href: string,
) {
  if (assetHrefPrefix) return `${assetHrefPrefix}/${asset.id}`;
  return href;
}

export function DashboardAssetsSection({
  assetHrefPrefix,
  description = "Creative review pressure, linked assets, and files that still need campaign context.",
  emptyState = "No assets need attention right now.",
  href,
  libraryHrefLabel = "Open assets",
  showClientSlug = false,
  summary,
  title = "Asset snapshot",
  variant,
}: DashboardAssetsSectionProps) {
  const styles = tone(variant);

  return (
    <section className={styles.body}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn("text-sm font-medium", styles.muted)}>Assets</p>
          <h2 className={cn("mt-1 text-xl font-semibold tracking-tight", styles.text)}>{title}</h2>
          <p className={cn("mt-1 text-sm", styles.muted)}>{description}</p>
        </div>
        <Link href={href} className={cn("inline-flex items-center gap-1 text-sm font-medium", styles.link)}>
          {libraryHrefLabel}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {METRICS.map(({ key, label, icon: Icon }) => {
          const metric = summary.metrics.find((entry) => entry.key === key);
          return (
            <div key={key} className={cn("rounded-2xl px-3 py-3", styles.metric)}>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-80">
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </div>
              <p className="mt-2 text-2xl font-semibold">{metric?.value ?? 0}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        {summary.attentionAssets.length === 0 ? (
          <div className={styles.empty}>{emptyState}</div>
        ) : (
          <div className="space-y-3">
            {summary.attentionAssets.map((asset) => (
              <div key={asset.id} className={styles.card}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={cn("text-sm font-medium", styles.text)}>{asset.fileName}</p>
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", styles.metric)}>
                        {asset.mediaType === "video" ? (
                          <span className="inline-flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            Video
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            Image
                          </span>
                        )}
                      </span>
                      {showClientSlug ? (
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", styles.metric)}>
                          {slugToLabel(asset.clientSlug)}
                        </span>
                      ) : null}
                    </div>
                    <p className={cn("mt-1 text-sm", styles.muted)}>{timeAgo(asset.createdAt)}</p>
                    {asset.linkedCampaignNames.length > 0 ? (
                      <p className={cn("mt-1 text-sm", styles.muted)}>
                        Linked: {asset.linkedCampaignNames.join(", ")}
                      </p>
                    ) : (
                      <p className={cn("mt-1 text-sm", styles.muted)}>No linked campaign yet.</p>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {asset.reasons.map((reason) => (
                        <span
                          key={reason}
                          className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", styles.chip)}
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Link
                        href={assetHref(asset, assetHrefPrefix, href)}
                        className={cn("inline-flex items-center gap-1 text-sm font-medium", styles.link)}
                      >
                        {assetHrefPrefix ? "Open asset" : "Open library"}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
