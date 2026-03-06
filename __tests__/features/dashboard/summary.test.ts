import { describe, expect, it } from "vitest";
import { buildDashboardOpsSummary } from "@/features/dashboard/summary";

describe("buildDashboardOpsSummary", () => {
  it("ranks campaigns by pending work and recent activity", () => {
    const summary = buildDashboardOpsSummary({
      actionItems: [
        {
          campaignId: "cmp_1",
          clientSlug: "zamora",
          priority: "urgent",
          status: "review",
          updatedAt: "2026-03-06T10:00:00.000Z",
        },
        {
          campaignId: "cmp_1",
          clientSlug: "zamora",
          priority: "medium",
          status: "todo",
          updatedAt: "2026-03-06T09:00:00.000Z",
        },
        {
          campaignId: "cmp_2",
          clientSlug: "zamora",
          priority: "medium",
          status: "todo",
          updatedAt: "2026-03-05T09:00:00.000Z",
        },
      ],
      approvals: [
        {
          clientSlug: "zamora",
          createdAt: "2026-03-06T11:00:00.000Z",
          entityId: "cmp_1",
          entityType: "campaign",
          metadata: {},
        },
      ],
      campaigns: [
        { campaignId: "cmp_1", clientSlug: "zamora", name: "Main launch", status: "ACTIVE" },
        { campaignId: "cmp_2", clientSlug: "zamora", name: "Retargeting", status: "PAUSED" },
      ],
      comments: [
        {
          campaignId: "cmp_2",
          clientSlug: "zamora",
          createdAt: "2026-03-06T08:30:00.000Z",
        },
      ],
      events: [
        {
          clientSlug: "zamora",
          createdAt: "2026-03-06T08:00:00.000Z",
          entityId: "cmp_2",
          entityType: "campaign",
          metadata: {},
        },
      ],
      limit: 6,
      mode: "client",
    });

    expect(summary.metrics[0]).toMatchObject({
      key: "pending_approvals",
      value: 1,
    });
    expect(summary.metrics[1]).toMatchObject({
      key: "action_items",
      label: "Open next steps",
      value: 3,
    });
    expect(summary.attentionCampaigns[0]).toMatchObject({
      campaignId: "cmp_1",
      openActionItems: 2,
      pendingApprovals: 1,
      urgentActionItems: 1,
    });
    expect(summary.attentionCampaigns[1]).toMatchObject({
      campaignId: "cmp_2",
      openDiscussionThreads: 1,
      recentUpdates: 1,
    });
  });

  it("uses urgent-item metrics for admin summaries", () => {
    const summary = buildDashboardOpsSummary({
      actionItems: [
        {
          campaignId: "cmp_3",
          clientSlug: "beamina",
          priority: "urgent",
          status: "review",
          updatedAt: "2026-03-06T10:00:00.000Z",
        },
        {
          campaignId: "cmp_3",
          clientSlug: "beamina",
          priority: "high",
          status: "todo",
          updatedAt: "2026-03-06T09:00:00.000Z",
        },
      ],
      approvals: [],
      campaigns: [
        { campaignId: "cmp_3", clientSlug: "beamina", name: "Evergreen", status: "ACTIVE" },
      ],
      comments: [],
      events: [],
      mode: "admin",
    });

    expect(summary.metrics[1]).toMatchObject({
      key: "action_items",
      label: "Urgent items",
      value: 1,
    });
    expect(summary.attentionCampaigns[0]?.attentionScore).toBeGreaterThan(0);
  });
});
