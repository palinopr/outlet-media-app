import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/charts/roas-trend-chart", () => ({
  RoasTrendChart: () => <div data-testid="roas-trend-chart" />,
  SpendTrendChart: () => <div data-testid="spend-trend-chart" />,
}));

vi.mock("../data", () => ({
  getCampaignsPageData: vi.fn().mockResolvedValue({
    campaigns: [],
    snapshots: [],
    dataSource: "database",
  }),
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
  CampaignsTable: () => <div data-testid="campaigns-table" />,
}));

vi.mock("@/features/client-portal/access", () => ({
  requireClientAccess: vi.fn().mockResolvedValue({
    userId: "user_123",
    scope: undefined,
  }),
}));

describe("ClientCampaigns", () => {
  it("does not render the retired Back to overview link", async () => {
    const { default: ClientCampaigns } = await import("./page");

    const element = await ClientCampaigns({
      params: Promise.resolve({ slug: "acme" }),
    });

    render(<>{element}</>);

    expect(screen.queryByRole("link", { name: "Back to overview" })).not.toBeInTheDocument();
  });
});
