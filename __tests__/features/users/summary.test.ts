import { describe, expect, it } from "vitest";
import { buildUsersAccessSummary } from "@/features/users/summary";

describe("buildUsersAccessSummary", () => {
  it("surfaces pending invites, unassigned client users, and weak client coverage", () => {
    const summary = buildUsersAccessSummary(
      [
        {
          client_slug: "zamora",
          client_slugs: [],
          created_at: "2026-03-06T12:00:00.000Z",
          email: "invite@example.com",
          id: "invite_1",
          invite_status: "pending",
          name: "",
          role: "member",
          status: "invited",
        },
        {
          client_slug: null,
          client_slugs: [],
          created_at: "2026-03-06T11:00:00.000Z",
          email: "client@example.com",
          id: "user_1",
          invite_status: null,
          name: "Client User",
          role: "client",
          status: "active",
        },
        {
          client_slug: null,
          client_slugs: ["zamora"],
          created_at: "2026-03-06T10:00:00.000Z",
          email: "assigned@example.com",
          id: "user_2",
          invite_status: null,
          name: "Assigned User",
          role: "client",
          status: "active",
        },
      ],
      [
        {
          activeCampaigns: 1,
          activeShows: 0,
          assetsNeedingReview: 0,
          createdAt: "2026-03-05T10:00:00.000Z",
          id: "client_1",
          memberCount: 0,
          name: "Zamora",
          needsAttention: 1,
          openActionItems: 0,
          openDiscussions: 0,
          pendingApprovals: 0,
          roas: 0,
          slug: "zamora",
          status: "active",
          totalCampaigns: 1,
          totalRevenue: 0,
          totalSpend: 0,
        },
        {
          activeCampaigns: 0,
          activeShows: 0,
          assetsNeedingReview: 0,
          createdAt: "2026-03-05T10:00:00.000Z",
          id: "client_2",
          memberCount: 2,
          name: "Happy Paws",
          needsAttention: 0,
          openActionItems: 0,
          openDiscussions: 0,
          pendingApprovals: 0,
          roas: 0,
          slug: "happy_paws",
          status: "active",
          totalCampaigns: 0,
          totalRevenue: 0,
          totalSpend: 0,
        },
      ],
    );

    expect(summary.accessInvites).toEqual([
      expect.objectContaining({ id: "invite_1" }),
    ]);
    expect(summary.pendingInviteCount).toBe(1);
    expect(summary.expiredInviteCount).toBe(0);
    expect(summary.unassignedClientUsers).toEqual([
      expect.objectContaining({ id: "user_1" }),
    ]);
    expect(summary.clientsNeedingCoverage).toEqual([
      expect.objectContaining({ id: "client_1" }),
    ]);
  });
});
