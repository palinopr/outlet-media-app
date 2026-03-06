import { describe, expect, it } from "vitest";
import type { ApprovalRequest } from "@/features/approvals/server";
import {
  approvalIsWithinScope,
  buildApprovalCenterSummary,
  filterApprovalRequestsByScope,
} from "@/features/approvals/summary";

function makeApproval(overrides: Partial<ApprovalRequest> = {}): ApprovalRequest {
  return {
    id: "approval_1",
    createdAt: "2026-03-06T10:00:00.000Z",
    updatedAt: "2026-03-06T10:00:00.000Z",
    clientSlug: "zamora",
    audience: "shared",
    requestType: "asset_review",
    status: "pending",
    title: "Review creative",
    summary: "Confirm whether this should go live.",
    entityType: "campaign",
    entityId: "cmp_1",
    pageId: null,
    taskId: null,
    requestedById: "user_1",
    requestedByName: "Outlet",
    decidedById: null,
    decidedByName: null,
    decidedAt: null,
    decisionNote: null,
    metadata: {},
    ...overrides,
  };
}

describe("approval scope filtering", () => {
  it("keeps approvals tied to allowed campaigns or events", () => {
    const filtered = filterApprovalRequestsByScope(
      [
        makeApproval({ entityType: "campaign", entityId: "cmp_allowed" }),
        makeApproval({
          entityId: "comment_1",
          entityType: "event_comment",
          metadata: { eventId: "evt_allowed" },
        }),
        makeApproval({ entityType: "campaign", entityId: "cmp_blocked" }),
      ],
      {
        allowedCampaignIds: ["cmp_allowed"],
        allowedEventIds: ["evt_allowed"],
      },
    );

    expect(filtered.map((approval) => approval.entityId)).toEqual(["cmp_allowed", "comment_1"]);
  });

  it("preserves approvals with no campaign or event context", () => {
    const unscoped = makeApproval({
      entityType: "workspace_page",
      entityId: "page_1",
      metadata: {},
      requestType: "workspace_publish",
    });

    expect(
      approvalIsWithinScope(unscoped, {
        allowedCampaignIds: ["cmp_allowed"],
        allowedEventIds: ["evt_allowed"],
      }),
    ).toBe(true);
  });
});

describe("approval center summary", () => {
  it("builds summary metrics from pending and recent approvals", () => {
    const summary = buildApprovalCenterSummary({
      now: new Date("2026-03-06T12:00:00.000Z"),
      pending: [
        makeApproval({
          createdAt: "2026-03-03T10:00:00.000Z",
          requestType: "asset_review",
        }),
        makeApproval({
          createdAt: "2026-03-06T11:00:00.000Z",
          entityType: "workspace_page",
          entityId: "page_2",
          requestType: "workspace_publish",
        }),
      ],
      recent: [
        makeApproval({
          decidedAt: "2026-03-06T09:00:00.000Z",
          status: "approved",
        }),
        makeApproval({
          decidedAt: "2026-03-06T08:00:00.000Z",
          requestType: "asset_import_review",
          status: "rejected",
        }),
      ],
    });

    expect(summary.metrics).toEqual([
      expect.objectContaining({ key: "pending_approvals", value: 2 }),
      expect.objectContaining({ key: "stale_pending", value: 1 }),
      expect.objectContaining({ key: "recently_resolved", value: 2 }),
      expect.objectContaining({ key: "asset_reviews", value: 1 }),
      expect.objectContaining({ key: "campaign_linked", value: 1 }),
    ]);
  });
});
