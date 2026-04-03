import { describe, expect, it } from "vitest";
import type { ApprovalRequest } from "@/features/approvals/server";
import {
  approvalAssetId,
  approvalIsWithinScope,
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

  it("keeps asset approvals only when the asset id is allowed", () => {
    const allowed = makeApproval({
      entityType: "asset",
      entityId: "asset_allowed",
      metadata: { assetId: "asset_allowed" },
    });
    const blocked = makeApproval({
      entityType: "asset",
      entityId: "asset_blocked",
      metadata: { assetId: "asset_blocked" },
    });

    const filtered = filterApprovalRequestsByScope(
      [allowed, blocked],
      {
        allowedCampaignIds: ["cmp_allowed"],
        allowedEventIds: [],
      },
      ["asset_allowed"],
    );

    expect(filtered.map((approval) => approval.entityId)).toEqual(["asset_allowed"]);
    expect(approvalAssetId(allowed)).toBe("asset_allowed");
  });

  it("blocks scoped approvals when the assigned campaign and event lists are empty", () => {
    expect(
      approvalIsWithinScope(
        makeApproval({ entityType: "campaign", entityId: "cmp_blocked" }),
        {
          allowedCampaignIds: [],
          allowedEventIds: [],
        },
      ),
    ).toBe(false);
  });
});

