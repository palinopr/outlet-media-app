import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AgentCommandSummarySection } from "./command-summary";
import type { AgentCommandSummary } from "@/features/agents/summary";

afterEach(() => {
  cleanup();
});

const summary: AgentCommandSummary = {
  actionableOutcomes: [
    {
      action: "asset-review",
      agentId: "asset-reviewer",
      assetId: "asset-1",
      assetFollowUpItemId: null,
      assetName: "Hero video",
      campaignId: null,
      campaignName: null,
      clientSlug: "acme",
      completedAt: null,
      createdAt: "2026-03-06T10:00:00.000Z",
      crmContactId: null,
      crmFollowUpItemId: null,
      crmContactName: null,
      errorText: null,
      eventFollowUpItemId: null,
      eventId: null,
      eventName: null,
      linkedActionItemId: null,
      linkedAssetFollowUpItemId: null,
      linkedCrmFollowUpItemId: null,
      linkedEventFollowUpItemId: null,
      requestDetail: null,
      requestSummary: "Review asset",
      resultText: null,
      startedAt: null,
      status: "done",
      taskId: "asset-task",
      visibility: "shared",
    },
    {
      action: "campaign-sync",
      agentId: "campaign-monitor",
      assetId: null,
      assetFollowUpItemId: null,
      assetName: null,
      campaignId: "campaign-1",
      campaignName: "Spring Launch",
      clientSlug: "acme",
      completedAt: null,
      createdAt: "2026-03-06T11:00:00.000Z",
      crmContactId: null,
      crmFollowUpItemId: null,
      crmContactName: null,
      errorText: null,
      eventFollowUpItemId: null,
      eventId: null,
      eventName: null,
      linkedActionItemId: null,
      linkedAssetFollowUpItemId: null,
      linkedCrmFollowUpItemId: null,
      linkedEventFollowUpItemId: null,
      requestDetail: null,
      requestSummary: "Sync campaign",
      resultText: null,
      startedAt: null,
      status: "done",
      taskId: "campaign-task",
      visibility: "shared",
    },
  ],
  attentionJobs: [],
  metrics: [],
  outcomeBuckets: [],
};

describe("AgentCommandSummarySection", () => {
  it("does not render an asset link for asset outcomes", () => {
    render(<AgentCommandSummarySection attentionJobs={[]} summary={summary} />);

    const assetCard = screen.getByText("Review asset").closest("div");
    expect(assetCard).not.toBeNull();
    expect(within(assetCard as HTMLElement).queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Open asset/i })).not.toBeInTheDocument();

    expect(screen.getByRole("link", { name: /Open campaign/i })).toHaveAttribute(
      "href",
      "/admin/campaigns/campaign-1",
    );
  });
});
