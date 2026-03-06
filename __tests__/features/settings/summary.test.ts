import { describe, expect, it } from "vitest";
import { buildPlatformSettingsSummary } from "@/features/settings/summary";

describe("buildPlatformSettingsSummary", () => {
  it("builds integration and setup pressure metrics", () => {
    const summary = buildPlatformSettingsSummary({
      apiKeys: [{ configured: true }, { configured: false }, { configured: true }],
      clients: [
        {
          activeCampaigns: 1,
          activeShows: 0,
          assetsNeedingReview: 1,
          createdAt: "2026-03-05T10:00:00.000Z",
          connectedAccountCount: 1,
          connectionRiskAccounts: 1,
          id: "client_1",
          memberCount: 0,
          name: "Zamora",
          needsAttention: 2,
          openActionItems: 1,
          openDiscussions: 0,
          pendingApprovals: 1,
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
          connectedAccountCount: 1,
          connectionRiskAccounts: 0,
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
      connectedAccounts: [
        {
          ad_account_id: "act_1",
          ad_account_name: "Healthy",
          client_slug: "happy_paws",
          connected_at: "2026-02-20T10:00:00.000Z",
          id: "acct_1",
          last_used_at: "2026-03-04T10:00:00.000Z",
          status: "active",
          token_expires_at: "2026-04-05T10:00:00.000Z",
        },
        {
          ad_account_id: "act_2",
          ad_account_name: "Needs attention",
          client_slug: "zamora",
          connected_at: "2026-02-01T10:00:00.000Z",
          id: "acct_2",
          last_used_at: "2026-02-01T10:00:00.000Z",
          status: "active",
          token_expires_at: "2026-03-08T10:00:00.000Z",
        },
      ],
      users: [
        {
          client_slug: "zamora",
          client_slugs: [],
          created_at: "2026-03-06T12:00:00.000Z",
          email: "invite@example.com",
          id: "invite_1",
          invite_status: "expired",
          name: "",
          role: "member",
          status: "invited",
        },
      ],
    });

    expect(summary.metrics).toEqual([
      expect.objectContaining({ key: "configured_integrations", value: 2 }),
      expect.objectContaining({ key: "missing_integrations", value: 1 }),
      expect.objectContaining({ key: "client_accounts", value: 2 }),
      expect.objectContaining({ key: "pending_access", value: 2 }),
      expect.objectContaining({ key: "connections_needing_attention", value: 1 }),
    ]);
    expect(summary.clientsNeedingSetup).toEqual([
      expect.objectContaining({ id: "client_1" }),
    ]);
    expect(summary.connectionRiskClients).toEqual([
      expect.objectContaining({ clientId: "client_1", attentionAccounts: 1 }),
    ]);
    expect(summary.accessInvites).toEqual([
      expect.objectContaining({ id: "invite_1" }),
    ]);
    expect(summary.pendingInviteCount).toBe(0);
    expect(summary.expiredInviteCount).toBe(1);
    expect(summary.connectionSummary.attentionCount).toBe(1);
  });
});
