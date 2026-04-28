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
  linkedEvents: [],
  systemEvents: [],
} as CampaignOperatingData;

describe("AdminCampaignDetailPage", () => {
  it("renders the campaign detail dashboard without request tabs", async () => {
    getCampaignOperatingData.mockResolvedValue(data);

    const { default: AdminCampaignDetailPage } = await import("./page");
    const element = await AdminCampaignDetailPage({
      params: Promise.resolve({ campaignId: "cmp_1" }),
    });

    render(<>{element}</>);

    expect(screen.getByTestId("campaign-detail-dashboard")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Client requests/i })).not.toBeInTheDocument();
  });
});
