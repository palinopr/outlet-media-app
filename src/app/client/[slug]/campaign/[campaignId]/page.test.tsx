import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { getCampaignDetail, requireClientAccess } = vi.hoisted(() => ({
  getCampaignDetail: vi.fn(),
  requireClientAccess: vi.fn(),
}));

vi.mock("./data", () => ({
  getCampaignDetail,
}));

vi.mock("@/features/client-portal/access", () => ({
  requireClientAccess,
}));

vi.mock("@/components/client/ads-preview", () => ({
  AdsPreview: () => <div data-testid="ads-preview" />,
}));

vi.mock("@/components/client/charts", () => ({
  AudienceDemographics: () => <div data-testid="audience-demographics" />,
  HourlyHeatmap: () => <div data-testid="hourly-heatmap" />,
  MarketPerformanceTable: () => <div data-testid="market-performance-table" />,
  PerformanceTrendTabs: () => <div data-testid="performance-trend-tabs" />,
  PlacementBarChart: () => <div data-testid="placement-bar-chart" />,
}));

vi.mock("../../components/client-portal-footer", () => ({
  ClientPortalFooter: () => <div data-testid="client-portal-footer" />,
}));

vi.mock("../../components/campaign-detail-header", () => ({
  CampaignDetailHeader: () => <div data-testid="campaign-detail-header" />,
}));

describe("CampaignDetailPage", () => {
  it("renders revenue and efficiency metrics on the client campaign detail view", async () => {
    requireClientAccess.mockResolvedValue({
      userId: "user_123",
      scope: undefined,
    });

    getCampaignDetail.mockResolvedValue({
      campaign: {
        campaignId: "cmp_1",
        name: "May Ticket Push",
        status: "ACTIVE",
        spend: 254.52,
        revenue: 3850,
        roas: 15.13,
        impressions: 144400,
        clicks: 7500,
        ctr: 5.16,
        cpc: 0.03,
        cpm: 1.76,
        dailyBudget: null,
        startTime: "2026-05-01",
      },
      ageGender: [],
      placements: [],
      geography: [],
      ads: [],
      hourly: [],
      daily: [],
      recommendations: [],
      dataSource: "meta_api",
      rangeLabel: "Today",
    });

    const { default: CampaignDetailPage } = await import("./page");
    const element = await CampaignDetailPage({
      params: Promise.resolve({ slug: "acme", campaignId: "cmp_1" }),
      searchParams: Promise.resolve({}),
    });

    render(<>{element}</>);

    expect(screen.getByText("Total Ad Spend")).toBeInTheDocument();
    expect(screen.getByText("$254.52")).toBeInTheDocument();
    expect(screen.getByText("Ad Revenue")).toBeInTheDocument();
    expect(screen.getByText("$3.9K")).toBeInTheDocument();
    expect(screen.getByText("Blended ROAS")).toBeInTheDocument();
    expect(screen.getByText("15.1x")).toBeInTheDocument();
    expect(screen.getByText("$15.13 return per dollar")).toBeInTheDocument();
    expect(screen.getByText("Audience Reach")).toBeInTheDocument();
    expect(screen.getByText("144.4K")).toBeInTheDocument();
    expect(screen.getByText("7.5K clicks")).toBeInTheDocument();
    expect(screen.getByText("CPM")).toBeInTheDocument();
    expect(screen.getByText("$1.76")).toBeInTheDocument();
    expect(screen.getByText("CPC")).toBeInTheDocument();
    expect(screen.getByText("$0.03")).toBeInTheDocument();
    expect(screen.getByText("Click Rate")).toBeInTheDocument();
    expect(screen.getByText("5.16%")).toBeInTheDocument();
  });
});
