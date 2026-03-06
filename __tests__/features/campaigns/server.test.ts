import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/dashboard/server", () => ({
  getDashboardActionCenter: vi.fn(),
  getDashboardOpsSummary: vi.fn(),
}));

vi.mock("@/features/agent-outcomes/server", () => ({
  listAgentOutcomes: vi.fn(),
}));

import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { getCampaignsWorkflowData } from "@/features/campaigns/server";
import { getDashboardActionCenter, getDashboardOpsSummary } from "@/features/dashboard/server";

describe("getCampaignsWorkflowData", () => {
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
      crmFollowUps: [
        {
          clientSlug: "zamora",
          contactId: "crm_1",
          contactName: "VIP fan",
          createdAt: "2026-03-06T10:00:00.000Z",
          dueDate: null,
          id: "follow_up_1",
          priority: "medium",
          title: "Call back",
        },
      ],
      discussions: [
        {
          authorName: "Alex",
          clientSlug: "zamora",
          content: "Need new copy.",
          createdAt: "2026-03-06T12:00:00.000Z",
          id: "thread_campaign",
          kind: "campaign",
          linkedFollowUpItemId: null,
          targetId: "cmp_1",
          targetName: "Arjona Miami",
        },
        {
          authorName: "Sam",
          clientSlug: "zamora",
          content: "Need CRM follow-up.",
          createdAt: "2026-03-06T11:00:00.000Z",
          id: "thread_crm",
          kind: "crm",
          linkedFollowUpItemId: null,
          targetId: "crm_1",
          targetName: "VIP fan",
        },
      ],
    });
    vi.mocked(listAgentOutcomes).mockResolvedValue([]);
  });

  it("passes client scope through to workflow loaders", async () => {
    await getCampaignsWorkflowData({
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

  it("keeps campaign workflow views focused on campaign discussions", async () => {
    const workflow = await getCampaignsWorkflowData({
      clientSlug: "zamora",
      limit: 4,
      mode: "admin",
    });

    expect(workflow.actionCenter.crmFollowUps).toEqual([]);
    expect(workflow.actionCenter.discussions).toEqual([
      expect.objectContaining({
        id: "thread_campaign",
        kind: "campaign",
      }),
    ]);
  });
});
