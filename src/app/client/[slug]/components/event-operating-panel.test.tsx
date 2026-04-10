import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EventOperatingPanel } from "./event-operating-panel";
import type { ClientEventOperatingView } from "@/features/events/client-operating";

vi.mock("./event-discussion-form", () => ({
  EventDiscussionForm: ({ eventId, slug }: { eventId: string; slug: string }) => (
    <div data-testid="event-discussion-form" data-event-id={eventId} data-slug={slug} />
  ),
}));

const data = {
  agentOutcomes: [
    {
      action: "triage-event-comment",
      agentId: "assistant",
      assetId: null,
      assetFollowUpItemId: null,
      assetName: null,
      campaignId: "cmp_1",
      campaignName: "Miami Push",
      clientSlug: "zamora",
      completedAt: "2026-04-10T13:00:00.000Z",
      createdAt: "2026-04-10T12:30:00.000Z",
      errorText: null,
      eventFollowUpItemId: "follow_1",
      eventId: "evt_1",
      eventName: "Miami Show",
      linkedActionItemId: null,
      linkedAssetFollowUpItemId: null,
      linkedEventFollowUpItemId: "follow_1",
      requestDetail: "Review the updated event blocker and propose the next step.",
      requestSummary: "Queued agent triage for show blocker",
      resultText: "Recommended confirming the latest hold count before increasing spend.",
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
      requestType: "event_review",
      status: "pending",
      title: "Approve updated weekend event copy",
      summary: "Need sign-off before we swap the promo language.",
      entityType: "event",
      entityId: "evt_1",
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
      eventId: "evt_1",
      clientSlug: "zamora",
      content: "Please confirm the latest hold count before we ramp spend.",
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
      eventId: "evt_1",
      clientSlug: "zamora",
      content: "Got it — we're waiting on the latest venue update.",
      visibility: "shared",
      authorId: null,
      authorName: "Outlet Team",
      parentCommentId: "comment_1",
      resolved: false,
      createdAt: "2026-04-10T10:30:00.000Z",
      updatedAt: "2026-04-10T10:30:00.000Z",
    },
  ],
  followUpItems: [
    {
      id: "follow_1",
      eventId: "evt_1",
      eventName: "Miami Show",
      eventDate: "2026-04-18",
      eventVenue: "Arena",
      clientSlug: "zamora",
      title: "Confirm updated hold count",
      description: "Need the latest venue inventory before increasing spend.",
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
  systemEvents: [
    {
      id: "event_1",
      createdAt: "2026-04-10T14:00:00.000Z",
      occurredAt: "2026-04-10T14:00:00.000Z",
      eventName: "event_comment_added",
      eventVersion: 1,
      visibility: "shared",
      actorType: "user",
      actorId: null,
      actorName: "Client Team",
      clientSlug: "zamora",
      source: "app",
      summary: "Commented on Miami Show discussion",
      detail: "Please confirm the latest hold count before we ramp spend.",
      entityType: "event_comment",
      entityId: "comment_1",
      pageId: null,
      taskId: null,
      correlationId: null,
      causationId: null,
      idempotencyKey: null,
      metadata: {},
    },
  ],
} satisfies ClientEventOperatingView;

describe("EventOperatingPanel", () => {
  it("renders a simpler event request surface and only shows supporting workflow that exists", () => {
    render(<EventOperatingPanel data={data} eventId="evt_1" slug="zamora" />);

    expect(screen.getByRole("heading", { name: "Event requests" })).toBeInTheDocument();
    expect(screen.getByText("Client conversation")).toBeInTheDocument();
    expect(screen.getByText("Already in motion")).toBeInTheDocument();
    expect(screen.getByText("Waiting for approval")).toBeInTheDocument();
    expect(screen.getByText("Approve updated weekend event copy")).toBeInTheDocument();
    expect(screen.getByText("Open next steps")).toBeInTheDocument();
    expect(screen.getByText("Confirm updated hold count")).toBeInTheDocument();
    expect(screen.getByText("Agent follow-through")).toBeInTheDocument();
    expect(screen.getByText("Queued agent triage for show blocker")).toBeInTheDocument();
    expect(screen.getByText("Recent changes")).toBeInTheDocument();
    expect(screen.getByText("Commented on Miami Show discussion")).toBeInTheDocument();
    expect(screen.getAllByText("Please confirm the latest hold count before we ramp spend.").length).toBeGreaterThan(0);
    expect(screen.getByText("Got it — we're waiting on the latest venue update.")).toBeInTheDocument();
    expect(screen.getByTestId("event-discussion-form")).toHaveAttribute("data-event-id", "evt_1");
    expect(screen.queryByText("Event operating loop")).not.toBeInTheDocument();
  });

  it("keeps the empty state minimal when there is no workflow yet", () => {
    render(
      <EventOperatingPanel
        data={{
          agentOutcomes: [],
          approvals: [],
          comments: [],
          followUpItems: [],
          systemEvents: [],
        }}
        eventId="evt_1"
        slug="zamora"
      />,
    );

    expect(screen.getByRole("heading", { name: "Event requests" })).toBeInTheDocument();
    expect(screen.getByText("No requests yet.")).toBeInTheDocument();
    expect(screen.queryByText("Already in motion")).not.toBeInTheDocument();
    expect(screen.queryByText("Pending approvals")).not.toBeInTheDocument();
    expect(screen.queryByText("Agent follow-through")).not.toBeInTheDocument();
    expect(screen.queryByText("Recent changes")).not.toBeInTheDocument();
  });
});
