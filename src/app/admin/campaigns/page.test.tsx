import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getCampaigns } = vi.hoisted(() => ({
  getCampaigns: vi.fn(),
}));

vi.mock("./data", () => ({
  getCampaigns,
}));

vi.mock("@/components/admin/campaigns/campaign-table", () => ({
  CampaignTable: () => <div data-testid="campaign-table" />,
}));

vi.mock("@/components/admin/campaigns/client-filter", () => ({
  ClientFilter: () => <div data-testid="client-filter" />,
}));

vi.mock("@/components/admin/campaigns/date-range-filter", () => ({
  DateRangeFilter: () => <div data-testid="date-range-filter" />,
}));

describe("CampaignsPage", () => {
  beforeEach(() => {
    getCampaigns.mockResolvedValue({
      campaigns: [],
      clients: [],
      dailyInsights: [],
      error: null,
    });
  });

  it("uses direct sync copy in the empty state", async () => {
    const { default: CampaignsPage } = await import("./page");
    render(await CampaignsPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByText("Connect or sync Meta data to populate campaigns.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Open chat" })).not.toBeInTheDocument();
  });

  it("flags campaigns that still need explicit client assignment", async () => {
    getCampaigns.mockResolvedValue({
      campaigns: [
        {
          campaignId: "cmp_1",
          campaignType: "sales",
          clicks: 0,
          clientSlug: "unknown",
          cpc: null,
          cpm: null,
          ctr: null,
          dailyBudget: null,
          impressions: 0,
          name: "Unmapped campaign",
          objective: "OUTCOME_SALES",
          revenue: null,
          roas: null,
          spend: 0,
          startTime: null,
          status: "ACTIVE",
        },
      ],
      clients: ["zamora"],
      dailyInsights: [],
      error: null,
    });

    const { default: CampaignsPage } = await import("./page");
    render(await CampaignsPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByText("1 campaign needs client assignment")).toBeInTheDocument();
    expect(screen.getByText(/Use the inline Client selector/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view campaigns needing assignment/i })).toHaveAttribute(
      "href",
      "/admin/campaigns?client=unknown",
    );
  });
});
