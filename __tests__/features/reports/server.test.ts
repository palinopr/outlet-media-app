import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/dashboard/server", () => ({
  getDashboardActionCenter: vi.fn(),
  getDashboardOpsSummary: vi.fn(),
}));

vi.mock("@/features/agent-outcomes/server", () => ({
  listAgentOutcomes: vi.fn(),
}));

import { getDashboardActionCenter, getDashboardOpsSummary } from "@/features/dashboard/server";
import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { getReportsWorkflowData } from "@/features/reports/server";

describe("getReportsWorkflowData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDashboardOpsSummary).mockResolvedValue({
      attentionCampaigns: [],
      campaignsNeedingAttention: 0,
      metrics: [],
      mode: "client",
    });
    vi.mocked(getDashboardActionCenter).mockResolvedValue({
      approvals: [],
      crmFollowUps: [],
      discussions: [],
    });
    vi.mocked(listAgentOutcomes).mockResolvedValue([]);
  });

  it("passes client scope through to workflow loaders", async () => {
    await getReportsWorkflowData({
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
    });

    expect(getDashboardOpsSummary).toHaveBeenCalledWith({
      clientSlug: "zamora",
      limit: 5,
      mode: "client",
      scopeCampaignIds: ["cmp_1"],
    });
    expect(getDashboardActionCenter).toHaveBeenCalledWith({
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
      scopeCampaignIds: ["cmp_1"],
      scopeEventIds: ["evt_1"],
    });
    expect(listAgentOutcomes).toHaveBeenCalledWith({
      audience: "shared",
      clientSlug: "zamora",
      limit: 4,
      scopeCampaignIds: ["cmp_1"],
      scopeEventIds: ["evt_1"],
    });
  });

  it("uses admin audience for admin report surfaces", async () => {
    await getReportsWorkflowData({
      clientSlug: "zamora",
      limit: 3,
      mode: "admin",
    });

    expect(listAgentOutcomes).toHaveBeenCalledWith({
      audience: "all",
      clientSlug: "zamora",
      limit: 3,
      scopeCampaignIds: null,
      scopeEventIds: null,
    });
  });
});
