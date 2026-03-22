import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/reports/server", () => ({
  getReportsData: vi.fn().mockResolvedValue({
    campaigns: [],
    snapshots: [],
    trendData: [],
    events: [],
    summary: {
      avgCpc: null,
      avgCtr: null,
      blendedRoas: null,
      totalClicks: 0,
      totalImpressions: 0,
      totalRevenue: 0,
      totalSpend: 0,
      totalTicketsSold: 0,
    },
    dataSource: "meta_api",
    clients: [],
  }),
  getReportsWorkflowData: vi.fn().mockResolvedValue({
    actionCenter: {
      approvals: [],
      crmFollowUps: [],
      discussions: [],
    },
    agentOutcomes: [],
    eventOperations: {
      attentionEvents: [],
      eventsNeedingAttention: 0,
      metrics: [],
    },
    opsSummary: {
      attentionCampaigns: [],
      campaignsNeedingAttention: 0,
      metrics: [],
      mode: "admin",
    },
  }),
}));

vi.mock("@/features/reports/components/reports-surface", () => ({
  ReportsSurface: () => <div data-testid="reports-surface" />,
}));

describe("AdminReportsPage", () => {
  it("renders the shared reports surface instead of redirecting away", async () => {
    const { default: AdminReportsPage } = await import("./page");
    const element = await AdminReportsPage();

    render(element);

    expect(screen.getByText("Reports")).toBeInTheDocument();
    expect(screen.getByTestId("reports-surface")).toBeInTheDocument();
  });
});
