import { describe, expect, it } from "vitest";
import { allowsCampaignInScope } from "@/features/client-portal/scope";

describe("client portal scope helpers", () => {
  it("allows campaigns when no assigned scope exists", () => {
    expect(allowsCampaignInScope(undefined, "cmp_1")).toBe(true);
  });

  it("restricts access to explicitly assigned campaign ids", () => {
    const scope = {
      allowedCampaignIds: ["cmp_1"],
    };

    expect(allowsCampaignInScope(scope, "cmp_1")).toBe(true);
    expect(allowsCampaignInScope(scope, "cmp_2")).toBe(false);
  });
});
