import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./data", () => ({
  getData: vi.fn().mockResolvedValue({
    campaigns: [],
    trendData: [],
    marginalRoasByCampaign: {},
    fromDb: false,
    funnelEngagement: {
      ctas: [],
      deviceSplit: [],
      fromDb: false,
      lookbackDays: 7,
      scrollDepths: [],
      sections: [],
      topSources: [],
      totals: {
        ctaClicks: 0,
        ctaCtr: null,
        ctaImpressions: 0,
        pageViews: 0,
        scroll75Rate: null,
        sessions: 0,
      },
      updatedAt: null,
    },
  }),
}));

describe("AdminDashboard", () => {
  it("does not render the creative snapshot block", async () => {
    const { default: AdminDashboard } = await import("./page");
    render(await AdminDashboard());
    expect(screen.queryByText("Creative snapshot")).not.toBeInTheDocument();
  });

  it("renders the funnel engagement block", async () => {
    const { default: AdminDashboard } = await import("./page");
    render(await AdminDashboard());
    expect(screen.getByText("Funnel engagement")).toBeInTheDocument();
    expect(screen.getByText(/Directional first-party heatmap-lite data/i)).toBeInTheDocument();
  });
});
