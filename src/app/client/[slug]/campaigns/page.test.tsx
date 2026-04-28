import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const { CampaignsTable, getCampaignsPageData } = vi.hoisted(() => ({
  CampaignsTable: vi.fn(() => <div data-testid="campaigns-table" />),
  getCampaignsPageData: vi.fn(),
}));

vi.mock("@/components/charts/roas-trend-chart", () => ({
  RoasTrendChart: () => <div data-testid="roas-trend-chart" />,
  SpendTrendChart: () => <div data-testid="spend-trend-chart" />,
}));

vi.mock("../data", () => ({
  getCampaignsPageData,
}));

vi.mock("../lib", () => ({
  buildTrendData: vi.fn(() => []),
  roasLabel: vi.fn(() => "healthy"),
  generateCampaignInsights: vi.fn(() => []),
}));

vi.mock("../components/insights-panel", () => ({
  InsightsPanel: () => <div data-testid="insights-panel" />,
}));

vi.mock("../components/client-portal-footer", () => ({
  ClientPortalFooter: () => <div data-testid="client-portal-footer" />,
}));

vi.mock("./campaigns-table", () => ({
  CampaignsTable,
}));

vi.mock("./campaign-range-filter", () => ({
  CampaignRangeFilter: () => <div data-testid="campaign-range-filter" />,
}));

vi.mock("@/features/client-portal/access", () => ({
  requireClientAccess: vi.fn().mockResolvedValue({
    userId: "user_123",
    scope: undefined,
  }),
}));

describe("ClientCampaigns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCampaignsPageData.mockResolvedValue({
      campaigns: [],
      snapshots: [],
      dataSource: "supabase",
    });
  });

  it("does not render the retired Back to overview link", async () => {
    const { default: ClientCampaigns } = await import("./page");

    const element = await ClientCampaigns({
      params: Promise.resolve({ slug: "acme" }),
      searchParams: Promise.resolve({}),
    });

    render(<>{element}</>);

    expect(screen.queryByRole("link", { name: "Back to overview" })).not.toBeInTheDocument();
  });

  it("defaults the campaigns page to the last 7 days", async () => {
    const { default: ClientCampaigns } = await import("./page");

    const element = await ClientCampaigns({
      params: Promise.resolve({ slug: "acme" }),
      searchParams: Promise.resolve({}),
    });

    render(<>{element}</>);

    expect(getCampaignsPageData).toHaveBeenCalledWith("acme", "7", undefined);
    expect(CampaignsTable).toHaveBeenCalledWith(
      expect.objectContaining({ range: "7" }),
      undefined,
    );
  });

  it("passes custom campaign ranges through to the loader and table", async () => {
    const { default: ClientCampaigns } = await import("./page");

    const element = await ClientCampaigns({
      params: Promise.resolve({ slug: "acme" }),
      searchParams: Promise.resolve({
        range: "custom",
        since: "2026-04-01",
        until: "2026-04-09",
      }),
    });

    render(<>{element}</>);

    expect(getCampaignsPageData).toHaveBeenCalledWith(
      "acme",
      {
        label: "Apr 1 - Apr 9",
        since: "2026-04-01",
        until: "2026-04-09",
      },
      undefined,
    );
    expect(CampaignsTable).toHaveBeenCalledWith(
      expect.objectContaining({
        range: {
          label: "Apr 1 - Apr 9",
          since: "2026-04-01",
          until: "2026-04-09",
        },
      }),
      undefined,
    );
  });
});
