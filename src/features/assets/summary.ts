import type { AssetLibraryRecord } from "./server";

export interface AssetLibraryMetric {
  key: "approved_assets" | "linked_assets" | "needs_review" | "total_assets";
  label: string;
  value: number;
}

export interface AssetAttentionItem {
  id: string;
  clientSlug: string;
  createdAt: string;
  fileName: string;
  linkedCampaignCount: number;
  linkedCampaignNames: string[];
  mediaType: string;
  reasons: string[];
  status: string;
}

export interface AssetLibrarySummary {
  attentionAssets: AssetAttentionItem[];
  metrics: AssetLibraryMetric[];
}

function assetReviewWeight(status: string) {
  switch (status) {
    case "new":
      return 0;
    case "labeled":
      return 1;
    case "approved":
      return 3;
    case "archived":
      return 4;
    default:
      return 2;
  }
}

function assetAttentionReasons(record: AssetLibraryRecord) {
  const reasons: string[] = [];

  if (record.asset.status === "new" || record.asset.status === "labeled") {
    reasons.push("needs review");
  }

  if (record.linkedCampaignCount === 0) {
    reasons.push("not linked");
  }

  return reasons;
}

export function buildAssetLibrarySummary(
  assets: AssetLibraryRecord[],
  limit = 8,
): AssetLibrarySummary {
  const needsReview = assets.filter(
    (record) => record.asset.status === "new" || record.asset.status === "labeled",
  ).length;
  const approved = assets.filter((record) => record.asset.status === "approved").length;
  const linked = assets.filter((record) => record.linkedCampaignCount > 0).length;

  const attentionAssets = assets
    .map((record) => ({
      id: record.asset.id,
      clientSlug: record.asset.client_slug,
      createdAt: record.asset.created_at,
      fileName: record.asset.file_name,
      linkedCampaignCount: record.linkedCampaignCount,
      linkedCampaignNames: record.linkedCampaignNames,
      mediaType: record.asset.media_type,
      reasons: assetAttentionReasons(record),
      status: record.asset.status,
    }))
    .filter((asset) => asset.reasons.length > 0)
    .sort((a, b) => {
      const reviewDelta = assetReviewWeight(a.status) - assetReviewWeight(b.status);
      if (reviewDelta !== 0) return reviewDelta;

      if (a.linkedCampaignCount === 0 && b.linkedCampaignCount > 0) return -1;
      if (b.linkedCampaignCount === 0 && a.linkedCampaignCount > 0) return 1;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit);

  return {
    attentionAssets,
    metrics: [
      { key: "total_assets", label: "Total assets", value: assets.length },
      { key: "needs_review", label: "Needs review", value: needsReview },
      { key: "approved_assets", label: "Approved", value: approved },
      { key: "linked_assets", label: "Linked to campaigns", value: linked },
    ],
  };
}
