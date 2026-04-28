import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/features/client-portal/access", () => ({
  requireClientReportsAccess: vi.fn(),
}));

vi.mock("@/features/reports/server", () => ({
  getReportsData: vi.fn(),
  getReportsWorkflowData: vi.fn(),
}));

vi.mock("@/features/reports/components/reports-surface", () => ({
  ReportsSurface: ({ mode }: { mode: string }) => <div data-testid="reports-surface" data-mode={mode} />,
}));

import { requireClientReportsAccess } from "@/features/client-portal/access";
import { getReportsData, getReportsWorkflowData } from "@/features/reports/server";

const mockedRequireClientReportsAccess = vi.mocked(requireClientReportsAccess);
const mockedGetReportsData = vi.mocked(getReportsData);
const mockedGetReportsWorkflowData = vi.mocked(getReportsWorkflowData);

describe("ClientReportsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the shared reports surface for enabled clients", async () => {
    mockedRequireClientReportsAccess.mockResolvedValueOnce({
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
      userId: "user_1",
    });
    mockedGetReportsData.mockResolvedValueOnce({
      campaigns: [],
      clients: ["acme"],
      dataSource: "supabase",
      events: [],
      snapshots: [],
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
      trendData: [],
    });
    mockedGetReportsWorkflowData.mockResolvedValueOnce({
      actionCenter: { approvals: [], discussions: [] },
      eventOperations: { attentionEvents: [], eventsNeedingAttention: 0, metrics: [] },
      opsSummary: { attentionCampaigns: [], campaignsNeedingAttention: 0, metrics: [], mode: "client" },
    });

    const { default: ClientReportsPage } = await import("./page");
    const element = await ClientReportsPage({
      params: Promise.resolve({ slug: "acme" }),
    });

    render(<>{element}</>);

    expect(screen.getByTestId("reports-surface")).toHaveAttribute("data-mode", "client");
    expect(mockedGetReportsData).toHaveBeenCalledWith({
      clientSlug: "acme",
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
    });
    expect(mockedGetReportsWorkflowData).toHaveBeenCalledWith({
      clientSlug: "acme",
      limit: 4,
      mode: "client",
      scope: {
        allowedCampaignIds: ["cmp_1"],
        allowedEventIds: ["evt_1"],
      },
    });
  });
});
