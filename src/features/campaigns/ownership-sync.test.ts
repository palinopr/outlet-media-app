import { describe, expect, it } from "vitest";
import {
  approvalMatchesCampaignOwnership,
  notificationMatchesCampaignOwnership,
  systemEventMatchesCampaignOwnership,
} from "@/features/campaigns/ownership-sync";

const entities = {
  campaignIds: new Set(["cmp_1"]),
  campaignCommentIds: new Set(["comment_1"]),
  campaignActionItemIds: new Set(["item_1"]),
  approvalIds: new Set(["approval_1"]),
};

describe("campaign ownership sync helpers", () => {
  it("matches approvals by direct campaign entity or metadata campaign id", () => {
    expect(
      approvalMatchesCampaignOwnership(
        {
          entity_type: "campaign",
          entity_id: "cmp_1",
          metadata: null,
        },
        entities.campaignIds,
      ),
    ).toBe(true);

    expect(
      approvalMatchesCampaignOwnership(
        {
          entity_type: "campaign_comment",
          entity_id: "comment_1",
          metadata: { campaignId: "cmp_1" },
        },
        entities.campaignIds,
      ),
    ).toBe(true);

    expect(
      approvalMatchesCampaignOwnership(
        {
          entity_type: "campaign",
          entity_id: "cmp_other",
          metadata: null,
        },
        entities.campaignIds,
      ),
    ).toBe(false);
  });

  it("matches notifications and system events through linked campaign entities", () => {
    expect(
      notificationMatchesCampaignOwnership(
        { entity_type: "campaign_comment", entity_id: "comment_1" },
        entities,
      ),
    ).toBe(true);
    expect(
      notificationMatchesCampaignOwnership(
        { entity_type: "campaign_action_item", entity_id: "item_1" },
        entities,
      ),
    ).toBe(true);
    expect(
      notificationMatchesCampaignOwnership(
        { entity_type: "asset_comment", entity_id: "asset_comment_1" },
        entities,
      ),
    ).toBe(false);

    expect(
      systemEventMatchesCampaignOwnership(
        {
          entity_type: "agent_task",
          entity_id: "task_1",
          metadata: { campaignId: "cmp_1" },
        },
        entities,
      ),
    ).toBe(true);
    expect(
      systemEventMatchesCampaignOwnership(
        {
          entity_type: "approval_request",
          entity_id: "approval_1",
          metadata: null,
        },
        entities,
      ),
    ).toBe(true);
  });
});
