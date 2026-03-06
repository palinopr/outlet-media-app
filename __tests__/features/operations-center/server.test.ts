import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/agent-outcomes/server", () => ({
  listAgentOutcomes: vi.fn(),
}));

vi.mock("@/features/dashboard/server", () => ({
  getDashboardActionCenter: vi.fn(),
  getDashboardAssetSummary: vi.fn(),
  getDashboardOpsSummary: vi.fn(),
}));

vi.mock("@/features/system-events/server", () => ({
  listSystemEvents: vi.fn(),
}));

vi.mock("@/features/work-queue/server", () => ({
  getWorkQueue: vi.fn(),
}));

import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import {
  getDashboardActionCenter,
  getDashboardAssetSummary,
  getDashboardOpsSummary,
} from "@/features/dashboard/server";
import { getAdminOperationsCenter } from "@/features/operations-center/server";
import { listSystemEvents } from "@/features/system-events/server";
import { getWorkQueue } from "@/features/work-queue/server";

describe("getAdminOperationsCenter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDashboardActionCenter).mockResolvedValue({
      approvals: [],
      crmFollowUps: [],
      discussions: [],
    });
    vi.mocked(listAgentOutcomes).mockResolvedValue([]);
    vi.mocked(getDashboardAssetSummary).mockResolvedValue({
      attentionAssets: [],
      metrics: [],
    });
    vi.mocked(listSystemEvents).mockResolvedValue([]);
    vi.mocked(getDashboardOpsSummary).mockResolvedValue({
      attentionCampaigns: [],
      campaignsNeedingAttention: 0,
      metrics: [],
      mode: "admin",
    });
    vi.mocked(getWorkQueue).mockResolvedValue({
      items: [],
      metrics: [],
    });
  });

  it("includes shared and assigned queues in the operations center payload", async () => {
    const center = await getAdminOperationsCenter("admin_1");

    expect(getWorkQueue).toHaveBeenNthCalledWith(1, {
      limit: 6,
      mode: "admin",
    });
    expect(getWorkQueue).toHaveBeenNthCalledWith(2, {
      assigneeId: "admin_1",
      limit: 4,
      mode: "admin",
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
