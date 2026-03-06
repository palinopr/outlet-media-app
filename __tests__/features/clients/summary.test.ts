import { describe, expect, it } from "vitest";
import {
  buildClientWorkflowHealth,
  compareClientAccountHealth,
  compareClientWorkflowHealth,
  getClientAttentionPressure,
} from "@/features/clients/summary";

describe("client workflow summary helpers", () => {
  it("weights approvals and discussions above passive review counts", () => {
    expect(
      buildClientWorkflowHealth({
        assetsNeedingReview: 2,
        openActionItems: 1,
        openDiscussions: 2,
        pendingApprovals: 1,
      }),
    ).toMatchObject({
      needsAttention: 11,
    });
  });

  it("ranks clients by workflow pressure before spend", () => {
    const ranked = [
      {
        name: "Client A",
        totalSpend: 1000,
        ...buildClientWorkflowHealth({
          assetsNeedingReview: 4,
          openActionItems: 0,
          openDiscussions: 0,
          pendingApprovals: 0,
        }),
      },
      {
        name: "Client B",
        totalSpend: 100,
        ...buildClientWorkflowHealth({
          assetsNeedingReview: 0,
          openActionItems: 1,
          openDiscussions: 1,
          pendingApprovals: 1,
        }),
      },
      {
        name: "Client C",
        totalSpend: 5000,
        ...buildClientWorkflowHealth({
          assetsNeedingReview: 0,
          openActionItems: 0,
          openDiscussions: 0,
          pendingApprovals: 0,
        }),
      },
    ].sort(compareClientWorkflowHealth);

    expect(ranked.map((client) => client.name)).toEqual(["Client B", "Client A", "Client C"]);
  });

  it("lets connection risk outrank lighter workflow pressure", () => {
    const ranked = [
      {
        connectedAccountCount: 2,
        connectionRiskAccounts: 0,
        name: "Workflow-heavy",
        totalSpend: 1000,
        ...buildClientWorkflowHealth({
          assetsNeedingReview: 2,
          openActionItems: 0,
          openDiscussions: 0,
          pendingApprovals: 0,
        }),
      },
      {
        connectedAccountCount: 1,
        connectionRiskAccounts: 1,
        name: "Connection-risk",
        totalSpend: 500,
        ...buildClientWorkflowHealth({
          assetsNeedingReview: 0,
          openActionItems: 0,
          openDiscussions: 0,
          pendingApprovals: 0,
        }),
      },
    ].sort(compareClientAccountHealth);

    expect(ranked.map((client) => client.name)).toEqual([
      "Connection-risk",
      "Workflow-heavy",
    ]);
    expect(getClientAttentionPressure(ranked[0])).toBe(3);
  });
});
