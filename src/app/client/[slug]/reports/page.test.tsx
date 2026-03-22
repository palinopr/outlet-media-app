import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  currentUser: vi.fn().mockResolvedValue({ firstName: "Jamie" }),
}));

vi.mock("@/features/client-portal/access", () => ({
  requireClientReportsAccess: vi.fn().mockResolvedValue({
    scope: undefined,
    userId: "user_1",
  }),
}));

vi.mock("@/features/client-portal/config", () => ({
  getClientPortalConfig: vi.fn().mockResolvedValue({
    clientId: "client_1",
    slug: "acme",
    eventsEnabled: true,
    reportsEnabled: true,
    brandName: "Acme Live",
    logoUrl: null,
    logoAlt: null,
  }),
}));

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
      mode: "client",
    },
  }),
}));

vi.mock("@/features/reports/components/reports-surface", () => ({
  ReportsSurface: () => <div data-testid="reports-surface" />,
}));

describe("ClientReportsPage", () => {
  it("renders the branded client reports page", async () => {
    const { default: ClientReportsPage } = await import("./page");
    const element = await ClientReportsPage({
      params: Promise.resolve({ slug: "acme" }),
    });

    render(element);

    expect(screen.getByText("Acme Live reporting")).toBeInTheDocument();
    expect(screen.getByTestId("reports-surface")).toBeInTheDocument();
  });
});
