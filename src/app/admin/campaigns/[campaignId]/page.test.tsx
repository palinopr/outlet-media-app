import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CampaignOperatingData } from "@/features/campaigns/server";

const getCampaignOperatingData = vi.fn();

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

vi.mock("@/features/campaigns/server", () => ({
  getCampaignOperatingData,
}));

vi.mock("@/components/admin/campaigns/campaign-cells", () => ({
  SyncButton: () => <div data-testid="sync-button" />,
}));

vi.mock("@/components/admin/campaigns/campaign-detail-dashboard", () => ({
  CampaignDetailDashboard: () => <div data-testid="campaign-detail-dashboard" />,
}));

vi.mock("@/components/admin/client-requests-panel", () => ({
  ClientRequestsPanel: ({ entityId }: { entityId: string }) => (
    <div data-testid="client-requests-panel" data-entity-id={entityId} />
  ),
}));

const data = {
  actionItems: [],
  approvals: [],
  assets: [],
  campaign: {
    campaignId: "cmp_1",
    name: "Barcelona Push",
    status: "active",
    objective: "sales",
    clientSlug: "zamora",
    campaignType: "sales",
    spend: 1200,
    roas: 2.1,
    revenue: 2520,
    impressions: 10000,
    clicks: 400,
    ctr: 4,
    cpc: 3,
    cpm: 120,
    dailyBudget: 400,
    startTime: "2026-04-01",
  },
  comments: [
    {
      id: "comment_1",
      campaignId: "cmp_1",
      clientSlug: "zamora",
      content: "Can we swap the launch creative?",
      visibility: "shared",
      authorId: null,
      authorName: "Client Team",
      parentCommentId: null,
      resolved: false,
      createdAt: "2026-04-10T10:00:00.000Z",
      updatedAt: "2026-04-10T10:00:00.000Z",
    },
  ],
  linkedEvents: [],
  systemEvents: [],
} as CampaignOperatingData;

describe("AdminCampaignDetailPage", () => {
  it("renders the client requests tab when requested", async () => {
    getCampaignOperatingData.mockResolvedValue(data);

    const { default: AdminCampaignDetailPage } = await import("./page");
    const element = await AdminCampaignDetailPage({
      params: Promise.resolve({ campaignId: "cmp_1" }),
      searchParams: Promise.resolve({ tab: "requests" }),
    });

    render(<>{element}</>);

    expect(screen.getByRole("link", { name: /Client requests/i })).toHaveAttribute(
      "href",
      "/admin/campaigns/cmp_1?tab=requests",
    );
    expect(screen.getByTestId("client-requests-panel")).toHaveAttribute("data-entity-id", "cmp_1");
    expect(screen.queryByTestId("campaign-detail-dashboard")).not.toBeInTheDocument();
  });
});
