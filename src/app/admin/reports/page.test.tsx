import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/features/reports/server", () => ({
  getReportsData: vi.fn(),
  getReportsWorkflowData: vi.fn(),
}));

vi.mock("@/features/reports/components/reports-surface", () => ({
  ReportsSurface: ({ mode }: { mode: string }) => (
    <div data-testid="reports-surface" data-mode={mode} />
  ),
}));

import { getReportsData, getReportsWorkflowData } from "@/features/reports/server";

const mockedGetReportsData = vi.mocked(getReportsData);
const mockedGetReportsWorkflowData = vi.mocked(getReportsWorkflowData);

describe("AdminReportsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the shared reports surface in admin mode", async () => {
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
      agentOutcomes: [],
      eventOperations: { attentionEvents: [], eventsNeedingAttention: 0, metrics: [] },
      opsSummary: { attentionCampaigns: [], campaignsNeedingAttention: 0, metrics: [], mode: "admin" },
    });

    const { default: AdminReportsPage } = await import("./page");
    const element = await AdminReportsPage();

    render(<>{element}</>);

    expect(screen.getByRole("heading", { name: "Reports" })).toBeInTheDocument();
    expect(screen.getByTestId("reports-surface")).toHaveAttribute("data-mode", "admin");
    expect(mockedGetReportsData).toHaveBeenCalledWith();
    expect(mockedGetReportsWorkflowData).toHaveBeenCalledWith({
      limit: 4,
      mode: "admin",
    });
  });
});
