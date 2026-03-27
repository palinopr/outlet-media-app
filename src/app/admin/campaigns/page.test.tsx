import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./data", () => ({
  getCampaigns: vi.fn().mockResolvedValue({
    campaigns: [],
    clients: [],
    dailyInsights: [],
    error: null,
  }),
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
  it("uses thin agent-entry copy in the empty state", async () => {
    const { default: CampaignsPage } = await import("./page");
    render(await CampaignsPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByText("Use the main agent chat to kick off a Meta sync")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open chat" })).toHaveAttribute("href", "/admin/agents");
  });
});
