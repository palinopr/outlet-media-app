import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CampaignCard } from "../types";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

import { CampaignsTable } from "./campaigns-table";

const campaign: CampaignCard = {
  campaignId: "cmp_123",
  clicks: 25,
  cpc: 2,
  cpm: 12,
  ctr: 1.5,
  dailyBudget: null,
  impressions: 1000,
  name: "Spring campaign",
  revenue: 300,
  roas: 3,
  spend: 100,
  startTime: null,
  status: "ACTIVE",
};

describe("CampaignsTable", () => {
  it("keeps the 30-day list range when opening campaign detail", () => {
    render(<CampaignsTable campaigns={[campaign]} range="30" slug="acme" />);

    fireEvent.click(screen.getByRole("row", { name: /spring campaign/i }));

    expect(push).toHaveBeenCalledWith("/client/acme/campaign/cmp_123?range=30");
    expect(screen.getByRole("link", { name: /spring campaign/i })).toHaveAttribute(
      "href",
      "/client/acme/campaign/cmp_123?range=30",
    );
  });
});
