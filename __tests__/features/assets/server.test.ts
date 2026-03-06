import { describe, expect, it } from "vitest";
import { assetMatchesScopedCampaigns } from "@/features/assets/server";

describe("assetMatchesScopedCampaigns", () => {
  it("keeps assets that match an allowed campaign label or folder", () => {
    const asset = {
      folder: "Miami Launch/posters",
      labels: ["spring refresh", "hero"],
    };

    expect(
      assetMatchesScopedCampaigns(asset, [
        { name: "Miami Launch" },
      ]),
    ).toBe(true);
  });

  it("blocks assets when no allowed campaign matches", () => {
    const asset = {
      folder: "Miami Launch/posters",
      labels: ["spring refresh", "hero"],
    };

    expect(
      assetMatchesScopedCampaigns(asset, [
        { name: "Different Campaign" },
      ]),
    ).toBe(false);
    expect(assetMatchesScopedCampaigns(asset, [])).toBe(false);
  });
});
