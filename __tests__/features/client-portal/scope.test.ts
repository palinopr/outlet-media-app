import { describe, expect, it } from "vitest";
import { allowsCampaignInScope, allowsEventInScope } from "@/features/client-portal/scope";

describe("client portal scope helpers", () => {
  it("allows campaigns and events when no assigned scope exists", () => {
    expect(allowsCampaignInScope(undefined, "cmp_1")).toBe(true);
    expect(allowsEventInScope(undefined, "event_1")).toBe(true);
  });

  it("restricts access to the explicitly assigned campaign and event ids", () => {
    const scope = {
      allowedCampaignIds: ["cmp_1"],
      allowedEventIds: ["event_1"],
    };

    expect(allowsCampaignInScope(scope, "cmp_1")).toBe(true);
    expect(allowsCampaignInScope(scope, "cmp_2")).toBe(false);
    expect(allowsEventInScope(scope, "event_1")).toBe(true);
    expect(allowsEventInScope(scope, "event_2")).toBe(false);
  });
});
