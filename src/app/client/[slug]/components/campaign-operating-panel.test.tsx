import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CampaignOperatingPanel } from "./campaign-operating-panel";
import type { ClientCampaignOperatingView } from "@/features/campaigns/client-operating";

vi.mock("./campaign-discussion-form", () => ({
  CampaignDiscussionForm: ({ campaignId, slug }: { campaignId: string; slug: string }) => (
    <div data-testid="campaign-discussion-form" data-campaign-id={campaignId} data-slug={slug} />
  ),
}));

const data = {
  actionItems: [
    {
      id: "item_1",
      campaignId: "cmp_1",
      clientSlug: "zamora",
      title: "Confirm refreshed venue copy",
      description: "Need a final review before Friday's launch push.",
      status: "review",
      priority: "high",
      visibility: "shared",
      assigneeId: null,
      assigneeName: "Jaime",
      dueDate: "2026-04-12",
      createdBy: "system",
      position: 0,
      sourceEntityId: null,
      sourceEntityType: null,
      createdAt: "2026-04-10T12:00:00.000Z",
      updatedAt: "2026-04-10T12:00:00.000Z",
    },
  ],
  agentOutcomes: [
    {
      action: "triage-campaign-comment",
      agentId: "assistant",
      assetId: null,
      assetFollowUpItemId: null,
      assetName: null,
      campaignId: "cmp_1",
      campaignName: "Barcelona Push",
      clientSlug: "zamora",
      completedAt: "2026-04-10T13:00:00.000Z",
      createdAt: "2026-04-10T12:30:00.000Z",
      errorText: null,
      eventFollowUpItemId: null,
      eventId: null,
      eventName: null,
      linkedActionItemId: "item_1",
      linkedAssetFollowUpItemId: null,
      linkedEventFollowUpItemId: null,
      requestDetail: "Review the client blocker and propose the next step.",
      requestSummary: "Queued agent triage for new campaign blocker",
      resultText: "Recommended confirming the final venue copy before approving the creative.",
      startedAt: "2026-04-10T12:31:00.000Z",
      status: "done",
      taskId: "task_1",
      visibility: "shared",
    },
  ],
  approvals: [
    {
      id: "approval_1",
      createdAt: "2026-04-10T11:00:00.000Z",
      updatedAt: "2026-04-10T11:00:00.000Z",
      clientSlug: "zamora",
      audience: "shared",
      requestType: "creative_review",
      status: "pending",
      title: "Approve Barcelona launch creative",
      summary: "Need sign-off before the updated cut can go live.",
      entityType: "campaign",
      entityId: "cmp_1",
      pageId: null,
      taskId: null,
      requestedById: null,
      requestedByName: "Outlet Agent",
      decidedById: null,
      decidedByName: null,
      decidedAt: null,
      decisionNote: null,
      metadata: {},
    },
  ],
  comments: [
    {
      id: "comment_1",
      campaignId: "cmp_1",
      clientSlug: "zamora",
      content: "We need confirmation on the updated venue line before launch.",
      visibility: "shared",
      authorId: null,
      authorName: "Client Team",
      parentCommentId: null,
      resolved: false,
      createdAt: "2026-04-10T10:00:00.000Z",
      updatedAt: "2026-04-10T10:00:00.000Z",
    },
    {
      id: "comment_2",
      campaignId: "cmp_1",
      clientSlug: "zamora",
      content: "Got it — waiting on final confirmation from the venue partner.",
      visibility: "shared",
      authorId: null,
      authorName: "Outlet Team",
      parentCommentId: "comment_1",
      resolved: false,
      createdAt: "2026-04-10T10:30:00.000Z",
      updatedAt: "2026-04-10T10:30:00.000Z",
    },
  ],
  systemEvents: [
    {
      id: "event_1",
      createdAt: "2026-04-10T14:00:00.000Z",
      occurredAt: "2026-04-10T14:00:00.000Z",
      eventName: "campaign_comment_added",
      eventVersion: 1,
      visibility: "shared",
      actorType: "user",
      actorId: null,
      actorName: "Client Team",
      clientSlug: "zamora",
      source: "app",
      summary: "Commented on Barcelona Push discussion",
      detail: "We need confirmation on the updated venue line before launch.",
      entityType: "campaign_comment",
      entityId: "comment_1",
      pageId: null,
      taskId: null,
      correlationId: null,
      causationId: null,
      idempotencyKey: null,
      metadata: {},
    },
  ],
} satisfies ClientCampaignOperatingView;

describe("CampaignOperatingPanel", () => {
  it("renders the campaign workflow sections on the client campaign detail page", () => {
    render(<CampaignOperatingPanel campaignId="cmp_1" data={data} slug="zamora" />);

    expect(screen.getByText("Campaign operating loop")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pending approvals" })).toBeInTheDocument();
    expect(screen.getByText("Approve Barcelona launch creative")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Open next steps" })).toBeInTheDocument();
    expect(screen.getByText("Confirm refreshed venue copy")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Shared discussion" })).toBeInTheDocument();
    expect(screen.getAllByText("We need confirmation on the updated venue line before launch.").length).toBeGreaterThan(0);
    expect(screen.getByText("Got it — waiting on final confirmation from the venue partner.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Agent follow-through" })).toBeInTheDocument();
    expect(screen.getByText("Queued agent triage for new campaign blocker")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recent activity" })).toBeInTheDocument();
    expect(screen.getByText("Commented on Barcelona Push discussion")).toBeInTheDocument();
    expect(screen.getByTestId("campaign-discussion-form")).toHaveAttribute("data-campaign-id", "cmp_1");
  });
});
