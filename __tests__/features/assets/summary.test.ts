import { describe, expect, it } from "vitest";
import { buildAssetLibrarySummary } from "@/features/assets/summary";
import type { AssetLibraryRecord } from "@/features/assets/server";

type AssetRecordInput = Partial<AssetLibraryRecord["asset"]> &
  Pick<AssetLibraryRecord["asset"], "id" | "file_name">;

function record(
  overrides: {
    asset: AssetRecordInput;
    linkedCampaignCount?: number;
    linkedCampaignNames?: string[];
  },
): AssetLibraryRecord {
  return {
    asset: {
      id: overrides.asset.id,
      file_name: overrides.asset.file_name,
      public_url: null,
      media_type: overrides.asset.media_type ?? "image",
      placement: null,
      format: null,
      folder: null,
      labels: null,
      status: overrides.asset.status ?? "new",
      created_at: overrides.asset.created_at ?? "2026-03-06T12:00:00.000Z",
      width: null,
      height: null,
      client_slug: overrides.asset.client_slug ?? "zamora",
      source_url: null,
      uploaded_by: null,
      storage_path: null,
    },
    linkedCampaignCount: overrides.linkedCampaignCount ?? 0,
    linkedCampaignNames: overrides.linkedCampaignNames ?? [],
  };
}

describe("buildAssetLibrarySummary", () => {
  it("counts review state and linked assets", () => {
    const summary = buildAssetLibrarySummary([
      record({
        asset: { id: "asset_1", file_name: "hero-new.jpg", status: "new" },
        linkedCampaignCount: 0,
      }),
      record({
        asset: { id: "asset_2", file_name: "hero-approved.jpg", status: "approved" },
        linkedCampaignCount: 1,
        linkedCampaignNames: ["Miami launch"],
      }),
      record({
        asset: { id: "asset_3", file_name: "story-labeled.mp4", media_type: "video", status: "labeled" },
        linkedCampaignCount: 1,
        linkedCampaignNames: ["Miami launch"],
      }),
    ]);

    expect(summary.metrics).toEqual([
      { key: "total_assets", label: "Total assets", value: 3 },
      { key: "needs_review", label: "Needs review", value: 2 },
      { key: "approved_assets", label: "Approved", value: 1 },
      { key: "linked_assets", label: "Linked to campaigns", value: 2 },
    ]);
  });

  it("prioritizes new unlinked assets at the top of attention", () => {
    const summary = buildAssetLibrarySummary([
      record({
        asset: {
          id: "asset_1",
          file_name: "older-labeled.jpg",
          status: "labeled",
          created_at: "2026-03-05T12:00:00.000Z",
        },
        linkedCampaignCount: 1,
        linkedCampaignNames: ["Catalog push"],
      }),
      record({
        asset: {
          id: "asset_2",
          file_name: "new-unlinked.jpg",
          status: "new",
          created_at: "2026-03-06T12:00:00.000Z",
        },
        linkedCampaignCount: 0,
      }),
      record({
        asset: {
          id: "asset_3",
          file_name: "approved.jpg",
          status: "approved",
        },
        linkedCampaignCount: 1,
        linkedCampaignNames: ["Catalog push"],
      }),
    ]);

    expect(summary.attentionAssets[0]).toMatchObject({
      id: "asset_2",
      reasons: ["needs review", "not linked"],
      status: "new",
    });
    expect(summary.attentionAssets.map((asset) => asset.id)).not.toContain("asset_3");
  });
});
