import { describe, expect, it } from "vitest";
import { getCampaignRevalidationPaths } from "./revalidation";

describe("campaign revalidation paths", () => {
  it("keeps campaign revalidation on active admin and client routes", () => {
    expect(getCampaignRevalidationPaths("acme", "cmp_1")).toEqual([
      "/admin/campaigns",
      "/admin/campaigns/cmp_1",
      "/admin/dashboard",
      "/client/acme/campaign/cmp_1",
      "/client/acme/campaigns",
    ]);
  });
});
