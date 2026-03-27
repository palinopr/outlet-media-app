import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CampaignDetailHeader } from "./campaign-detail-header";
import { getClientPortalTheme } from "@/features/client-portal/theme";

describe("CampaignDetailHeader", () => {
  it("links back to campaigns and no longer calls it a dashboard", () => {
    render(
      <CampaignDetailHeader
        slug="acme"
        range="30"
        rangeLabel="Last 30 days"
        campaign={{
          campaignId: "cmp_1",
          name: "Spring Push",
          status: "ACTIVE",
          spend: 1200,
          revenue: 4800,
          roas: 4,
          impressions: 10000,
          clicks: 400,
          ctr: 4,
          cpc: 3,
          cpm: 120,
          dailyBudget: 5000,
          startTime: "2026-03-01",
        }}
        theme={getClientPortalTheme("acme")}
      />,
    );

    expect(screen.getByRole("link", { name: "Back to campaigns" })).toHaveAttribute(
      "href",
      "/client/acme/campaigns?range=30",
    );
    expect(screen.queryByRole("link", { name: "Back to dashboard" })).not.toBeInTheDocument();
  });
});
