import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./data", () => ({
  getData: vi.fn().mockResolvedValue({
    events: [],
    campaigns: [],
    allCampaigns: [],
    trendData: [],
    velocityData: [],
    marginalRoasByCampaign: new Map(),
    fromDb: false,
  }),
}));

describe("AdminDashboard", () => {
  it("does not render the creative snapshot block", async () => {
    const { default: AdminDashboard } = await import("./page");
    render(await AdminDashboard());
    expect(screen.queryByText("Creative snapshot")).not.toBeInTheDocument();
  });
});
