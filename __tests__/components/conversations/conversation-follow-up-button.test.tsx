import { describe, expect, it } from "vitest";
import { getConversationFollowUpConfig } from "@/components/conversations/conversation-follow-up-button";

describe("getConversationFollowUpConfig", () => {
  it("maps each thread kind to the correct follow-up endpoint", () => {
    expect(getConversationFollowUpConfig("campaign")).toEqual({
      createdLabel: "Action created",
      createLabel: "Create action",
      route: "/api/campaign-comments/action-item",
    });
    expect(getConversationFollowUpConfig("crm")).toEqual({
      createdLabel: "Follow-up created",
      createLabel: "Create follow-up",
      route: "/api/crm-comments/follow-up-item",
    });
    expect(getConversationFollowUpConfig("asset")).toEqual({
      createdLabel: "Follow-up created",
      createLabel: "Create follow-up",
      route: "/api/asset-comments/follow-up-item",
    });
    expect(getConversationFollowUpConfig("event")).toEqual({
      createdLabel: "Follow-up created",
      createLabel: "Create follow-up",
      route: "/api/event-comments/follow-up-item",
    });
  });
});
