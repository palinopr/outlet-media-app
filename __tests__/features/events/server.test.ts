import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/dashboard/server", () => ({
  getDashboardActionCenter: vi.fn(),
}));

vi.mock("@/features/agent-outcomes/server", () => ({
  listAgentOutcomes: vi.fn(),
}));

import { listAgentOutcomes } from "@/features/agent-outcomes/server";
import { getDashboardActionCenter } from "@/features/dashboard/server";
import { getEventsWorkflowData } from "@/features/events/server";

describe("getEventsWorkflowData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
          content: "Need promoter answer.",
          createdAt: "2026-03-06T12:00:00.000Z",
          id: "thread_event",
          kind: "event",
          linkedFollowUpItemId: null,
          targetId: "evt_1",
          targetName: "Aventura",
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

  it("passes scope through to event workflow loaders", async () => {
    await getEventsWorkflowData({
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
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
      eventId: null,
      limit: 4,
      scopeCampaignIds: ["cmp_1"],
      scopeEventIds: ["evt_1"],
    });
  });

  it("keeps event workflow views focused on event discussions", async () => {
    const workflow = await getEventsWorkflowData({
      clientSlug: "zamora",
      limit: 4,
      mode: "admin",
    });

    expect(workflow.actionCenter.crmFollowUps).toEqual([]);
    expect(workflow.actionCenter.discussions).toEqual([
      expect.objectContaining({
        id: "thread_event",
        kind: "event",
      }),
    ]);
  });
});
