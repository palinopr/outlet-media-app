import { describe, expect, it } from "vitest";
import {
  isCrmSystemEvent,
  matchesCrmContactSystemEvent,
  type SystemEvent,
} from "@/features/system-events/server";

function makeEvent(overrides: Partial<SystemEvent>): SystemEvent {
  return {
    id: "event-1",
    createdAt: "2026-03-06T00:00:00.000Z",
    occurredAt: "2026-03-06T00:00:00.000Z",
    eventName: "crm_contact_updated",
    eventVersion: 1,
    visibility: "shared",
    actorType: "user",
    actorId: "user_1",
    actorName: "Outlet",
    clientSlug: "zamora",
    source: "app",
    summary: "Updated CRM contact",
    detail: null,
    entityType: "crm_contact",
    entityId: "contact-1",
    pageId: null,
    taskId: null,
    correlationId: null,
    causationId: null,
    idempotencyKey: null,
    metadata: {},
    ...overrides,
  };
}

describe("CRM system-event matching", () => {
  it("treats CRM comment and follow-up events as CRM activity", () => {
    expect(isCrmSystemEvent(makeEvent({ entityType: "crm_comment", eventName: "crm_comment_added" }))).toBe(true);
    expect(
      isCrmSystemEvent(
        makeEvent({
          entityType: "crm_follow_up_item",
          eventName: "crm_follow_up_item_updated",
        }),
      ),
    ).toBe(true);
    expect(
      isCrmSystemEvent(
        makeEvent({
          entityType: "agent_task",
          eventName: "agent_action_requested",
          metadata: { crmContactId: "contact-1" },
        }),
      ),
    ).toBe(true);
    expect(
      isCrmSystemEvent(makeEvent({ entityType: "campaign", eventName: "campaign_updated" })),
    ).toBe(false);
  });

  it("matches CRM events to a contact through entity id or metadata", () => {
    expect(matchesCrmContactSystemEvent(makeEvent({ entityId: "contact-1" }), "contact-1")).toBe(
      true,
    );
    expect(
      matchesCrmContactSystemEvent(
        makeEvent({
          entityType: "crm_comment",
          entityId: "comment-1",
          metadata: { crmContactId: "contact-1" },
        }),
        "contact-1",
      ),
    ).toBe(true);
    expect(
      matchesCrmContactSystemEvent(
        makeEvent({
          entityType: "crm_follow_up_item",
          entityId: "follow-up-1",
          metadata: { crmContactId: "contact-2" },
        }),
        "contact-1",
      ),
    ).toBe(false);
  });
});
