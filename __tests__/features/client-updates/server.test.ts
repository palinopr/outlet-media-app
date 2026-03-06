import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/agent-outcomes/server", () => ({
  listAgentOutcomes: vi.fn(),
}));

vi.mock("@/features/approvals/server", () => ({
  listApprovalRequests: vi.fn(),
}));

vi.mock("@/features/dashboard/server", () => ({
  getDashboardActionCenter: vi.fn(),
  getDashboardAssetSummary: vi.fn(),
  getDashboardOpsSummary: vi.fn(),
}));

vi.mock("@/features/system-events/server", () => ({
  filterSystemEventsByClientScope: vi.fn(),
  listSystemEvents: vi.fn(),
}));

vi.mock("@/features/work-queue/server", () => ({
  getWorkQueue: vi.fn(),
}));

import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { listApprovalRequests } from "@/features/approvals/server";
import {
  getDashboardActionCenter,
  getDashboardAssetSummary,
  getDashboardOpsSummary,
} from "@/features/dashboard/server";
import { getClientUpdatesCenter } from "@/features/client-updates/server";
import {
  filterSystemEventsByClientScope,
  listSystemEvents,
} from "@/features/system-events/server";
import { getWorkQueue } from "@/features/work-queue/server";

describe("getClientUpdatesCenter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDashboardActionCenter).mockResolvedValue({
      approvals: [],
      crmFollowUps: [],
      discussions: [],
    });
    vi.mocked(listAgentOutcomes).mockResolvedValue([]);
    vi.mocked(listApprovalRequests).mockResolvedValue([]);
    vi.mocked(getDashboardAssetSummary).mockResolvedValue({
      attentionAssets: [],
      metrics: [],
    });
    vi.mocked(listSystemEvents).mockResolvedValue([]);
    vi.mocked(filterSystemEventsByClientScope).mockResolvedValue([]);
    vi.mocked(getDashboardOpsSummary).mockResolvedValue({
      attentionCampaigns: [],
      campaignsNeedingAttention: 0,
      metrics: [],
      mode: "client",
    });
    vi.mocked(getWorkQueue).mockResolvedValue({
      items: [],
      metrics: [],
    });
  });

  it("loads both shared and assigned work queues with client scope", async () => {
    const scope = {
      allowedCampaignIds: ["cmp_1"],
      allowedEventIds: ["evt_1"],
    };

    const center = await getClientUpdatesCenter("zamora", scope, "user_1");

    expect(getWorkQueue).toHaveBeenNthCalledWith(1, {
      clientSlug: "zamora",
      limit: 6,
      mode: "client",
      scope,
    });
    expect(getWorkQueue).toHaveBeenNthCalledWith(2, {
      assigneeId: "user_1",
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
      scope,
    });
    expect(center.workQueue).toEqual({
      items: [],
      metrics: [],
    });
    expect(center.assignedWorkQueue).toEqual({
      items: [],
      metrics: [],
    });
  });
});
