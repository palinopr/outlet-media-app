import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CampaignDetailDashboard } from "./campaign-detail-dashboard";
import type { CampaignOperatingData } from "@/features/campaigns/server";

const data = {
  campaign: {
    campaignId: "campaign_1",
    name: "Don Omar Barcelona",
    status: "active",
    objective: "sales",
    clientSlug: "zamora",
    campaignType: "sales",
    spend: 4200,
    roas: 3.4,
    revenue: 14280,
    impressions: 120000,
    clicks: 4200,
    ctr: 3.5,
    cpc: 1,
    cpm: 35,
    dailyBudget: 500,
    startTime: "2026-03-25",
  },
} satisfies CampaignOperatingData;

describe("CampaignDetailDashboard", () => {
  it("renders a simple campaign snapshot without workflow sections", () => {
    render(<CampaignDetailDashboard data={data} />);

    expect(screen.getByText("Campaign snapshot")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Don Omar Barcelona" })).toBeInTheDocument();
    expect(screen.getByText("3.40x")).toBeInTheDocument();

    expect(screen.queryByRole("heading", { name: "Pending approvals" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Action items" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Linked assets" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Recent activity" })).not.toBeInTheDocument();
  });
});
