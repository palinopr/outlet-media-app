import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Link2, ShieldCheck, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { tone } from "@/lib/tone-styles";
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

function sectionTone(variant: "admin" | "client") {
  const isClient = variant === "client";
  return {
    ...tone(variant),
    card: isClient
      ? "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3"
      : "rounded-2xl border border-[#f0ebe2] bg-[#fcfbf8] p-3",
    metric: isClient ? "bg-white/[0.04] text-white/75" : "bg-[#f7f5f1] text-[#6f6a63]",
    chip: isClient ? "bg-white/[0.06] text-white/75" : "bg-[#f1ece4] text-[#6f6a63]",
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
  const styles = sectionTone(variant);

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
